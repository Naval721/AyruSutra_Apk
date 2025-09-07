import { Tables } from '../lib/supabase';

export type Profile = Tables<'profiles'>;
export type Patient = Tables<'patients'>;
export type Therapy = Tables<'therapies'>;
export type Feedback = Tables<'feedback'>;

export type DoshaType = 'vata' | 'pitta' | 'kapha' | 'tridosha';
export type TherapyStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface TherapyWithDetails extends Therapy {
  patient?: Patient;
}

export interface ProgressData {
  totalTherapies: number;
  completedTherapies: number;
  upcomingTherapies: number;
  completionPercentage: number;
}