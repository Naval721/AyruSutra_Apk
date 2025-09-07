import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Therapy, Patient } from '../types';

const CACHE_KEYS = {
  THERAPIES: 'cached_therapies',
  PATIENT: 'cached_patient',
  LAST_SYNC: 'last_sync_timestamp',
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const isOnline = (): boolean => {
  // This is a simple check - in a real app, you might want to use a more sophisticated network detection
  return true; // For now, assume online. You can implement proper network detection here
};

export const cacheData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedItem = await AsyncStorage.getItem(key);
    if (!cachedItem) return null;

    const { data, timestamp } = JSON.parse(cachedItem);
    
    // Check if cache is still valid
    if (Date.now() - timestamp > CACHE_DURATION) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

export const cacheTherapies = async (therapies: Therapy[]): Promise<void> => {
  await cacheData(CACHE_KEYS.THERAPIES, therapies);
};

export const getCachedTherapies = async (): Promise<Therapy[] | null> => {
  return await getCachedData<Therapy[]>(CACHE_KEYS.THERAPIES);
};

export const cachePatient = async (patient: Patient): Promise<void> => {
  await cacheData(CACHE_KEYS.PATIENT, patient);
};

export const getCachedPatient = async (): Promise<Patient | null> => {
  return await getCachedData<Patient>(CACHE_KEYS.PATIENT);
};

export const setLastSyncTime = async (): Promise<void> => {
  await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
};

export const getLastSyncTime = async (): Promise<number | null> => {
  try {
    const timestamp = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Error getting last sync time:', error);
    return null;
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(CACHE_KEYS));
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

export const syncOfflineData = async (patientId: string): Promise<void> => {
  try {
    if (!isOnline()) return;

    // Fetch fresh data from Supabase
    const { data: therapies, error: therapiesError } = await supabase
      .from('therapies')
      .select('*')
      .eq('patient_id', patientId)
      .order('scheduled_date', { ascending: true });

    if (therapiesError) {
      console.error('Error syncing therapies:', therapiesError);
      return;
    }

    // Cache the fresh data
    if (therapies) {
      await cacheTherapies(therapies);
      await setLastSyncTime();
    }
  } catch (error) {
    console.error('Error syncing offline data:', error);
  }
};

export const getOfflineTherapies = async (patientId: string): Promise<Therapy[]> => {
  try {
    // First try to get cached data
    const cachedTherapies = await getCachedTherapies();
    if (cachedTherapies) {
      return cachedTherapies;
    }

    // If no cache and online, fetch from server
    if (isOnline()) {
      const { data: therapies, error } = await supabase
        .from('therapies')
        .select('*')
        .eq('patient_id', patientId)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching therapies:', error);
        return [];
      }

      if (therapies) {
        await cacheTherapies(therapies);
        return therapies;
      }
    }

    return [];
  } catch (error) {
    console.error('Error getting offline therapies:', error);
    return [];
  }
};