import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Therapy, Feedback, ProgressData } from '../types';
import { useAuth } from '../contexts/AuthContext';

// Custom hook for fetching therapies
export const useTherapies = () => {
  const { patient } = useAuth();

  return useQuery({
    queryKey: ['therapies', patient?.id],
    queryFn: async () => {
      if (!patient?.id) return [];

      const { data, error } = await supabase
        .from('therapies')
        .select('*')
        .eq('patient_id', patient.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data as Therapy[];
    },
    enabled: !!patient?.id,
  });
};

// Custom hook for fetching upcoming therapies
export const useUpcomingTherapies = () => {
  const { patient } = useAuth();

  return useQuery({
    queryKey: ['upcoming-therapies', patient?.id],
    queryFn: async () => {
      if (!patient?.id) return [];

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('therapies')
        .select('*')
        .eq('patient_id', patient.id)
        .gte('scheduled_date', today)
        .in('status', ['scheduled', 'in_progress'])
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data as Therapy[];
    },
    enabled: !!patient?.id,
  });
};

// Custom hook for fetching completed therapies
export const useCompletedTherapies = () => {
  const { patient } = useAuth();

  return useQuery({
    queryKey: ['completed-therapies', patient?.id],
    queryFn: async () => {
      if (!patient?.id) return [];

      const { data, error } = await supabase
        .from('therapies')
        .select('*')
        .eq('patient_id', patient.id)
        .eq('status', 'completed')
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      return data as Therapy[];
    },
    enabled: !!patient?.id,
  });
};

// Custom hook for fetching progress data
export const useProgressData = () => {
  const { patient } = useAuth();

  return useQuery({
    queryKey: ['progress-data', patient?.id],
    queryFn: async (): Promise<ProgressData> => {
      if (!patient?.id) {
        return {
          totalTherapies: 0,
          completedTherapies: 0,
          upcomingTherapies: 0,
          completionPercentage: 0,
        };
      }

      const { data: allTherapies, error: allError } = await supabase
        .from('therapies')
        .select('status')
        .eq('patient_id', patient.id);

      if (allError) throw allError;

      const { data: completedTherapies, error: completedError } = await supabase
        .from('therapies')
        .select('id')
        .eq('patient_id', patient.id)
        .eq('status', 'completed');

      if (completedError) throw completedError;

      const { data: upcomingTherapies, error: upcomingError } = await supabase
        .from('therapies')
        .select('id')
        .eq('patient_id', patient.id)
        .in('status', ['scheduled', 'in_progress']);

      if (upcomingError) throw upcomingError;

      const totalTherapies = allTherapies?.length || 0;
      const completed = completedTherapies?.length || 0;
      const upcoming = upcomingTherapies?.length || 0;
      const completionPercentage = totalTherapies > 0 ? (completed / totalTherapies) * 100 : 0;

      return {
        totalTherapies,
        completedTherapies: completed,
        upcomingTherapies: upcoming,
        completionPercentage,
      };
    },
    enabled: !!patient?.id,
  });
};

// Custom hook for submitting feedback
export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  const { patient } = useAuth();

  return useMutation({
    mutationFn: async ({
      therapyId,
      rating,
      comment,
    }: {
      therapyId: string;
      rating: number;
      comment?: string;
    }) => {
      if (!patient?.id) throw new Error('Patient not found');

      const { data, error } = await supabase
        .from('feedback')
        .insert({
          therapy_id: therapyId,
          patient_id: patient.id,
          rating,
          comment: comment || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Feedback;
    },
    onSuccess: () => {
      // Invalidate and refetch progress data
      queryClient.invalidateQueries({ queryKey: ['progress-data'] });
      queryClient.invalidateQueries({ queryKey: ['completed-therapies'] });
    },
  });
};

// Custom hook for fetching feedback for a specific therapy
export const useTherapyFeedback = (therapyId: string) => {
  const { patient } = useAuth();

  return useQuery({
    queryKey: ['therapy-feedback', therapyId, patient?.id],
    queryFn: async () => {
      if (!patient?.id || !therapyId) return null;

      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('therapy_id', therapyId)
        .eq('patient_id', patient.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Feedback | null;
    },
    enabled: !!patient?.id && !!therapyId,
  });
};