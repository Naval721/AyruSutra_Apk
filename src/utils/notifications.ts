import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { initFirebaseMessaging, getFCMToken, onForegroundMessage, requestNotificationPermission as requestWebPermission } from '../lib/firebase-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }

  return true;
};

export const scheduleTherapyReminder = async (
  therapyId: string,
  therapyName: string,
  scheduledDate: Date,
  reminderMinutes: number = 30
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    const reminderTime = new Date(scheduledDate.getTime() - reminderMinutes * 60 * 1000);
    
    // Don't schedule if the reminder time has already passed
    if (reminderTime <= new Date()) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Therapy Reminder',
        body: `Your ${therapyName} session is starting in ${reminderMinutes} minutes`,
        data: { therapyId, type: 'therapy_reminder' },
        sound: 'default',
      },
      trigger: {
        date: reminderTime,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const cancelTherapyReminder = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

export const scheduleDailyWellnessTip = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    // Schedule for 9 AM daily
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Wellness Tip',
        body: 'Check out today\'s personalized wellness guidance in your app',
        data: { type: 'daily_tip' },
        sound: 'default',
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling daily tip:', error);
    return null;
  }
};

export const getNotificationToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      // Use Firebase for web
      const fcmToken = await getFCMToken();
      return fcmToken;
    } else {
      // Use Expo for mobile
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });
      return token.data;
    }
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

// Firebase notification functions for web
export const initializeFirebaseNotifications = async (): Promise<boolean> => {
  if (Platform.OS !== 'web') return true; // Skip for mobile (use Expo)

  try {
    const permission = await requestWebPermission();
    if (!permission) {
      console.log('Notification permission denied');
      return false;
    }

    const messaging = await initFirebaseMessaging();
    if (!messaging) {
      console.log('Firebase Messaging not available');
      return false;
    }

    const fcmToken = await getFCMToken();
    if (fcmToken) {
      console.log('FCM Token obtained:', fcmToken);
      await saveFCMToken(fcmToken);
    }

    onForegroundMessage((payload) => {
      console.log('Foreground message received:', payload);
    });

    return true;
  } catch (error) {
    console.error('Error initializing Firebase notifications:', error);
    return false;
  }
};

export const sendFirebaseNotification = async (title: string, message: string, type: string = 'info') => {
  if (!supabase) {
    console.error('Supabase not configured');
    return;
  }

  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: {
        title,
        message,
        type
      }
    });

    if (error) {
      console.error('Error sending notification:', error);
    }

    return data;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const saveFCMToken = async (token: string) => {
  if (!supabase) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        fcm_token: token,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving FCM token:', error);
    }
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};