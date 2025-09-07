export type Dosha = 'Vata' | 'Pitta' | 'Kapha' | 'Tridoshic';

export interface PatientProfile {
  id: string;
  name: string;
  clinicName: string;
  primaryDosha: Dosha;
  phone?: string;
  email?: string;
}

export type TherapyType =
  | 'Abhyanga'
  | 'Shirodhara'
  | 'Virechana'
  | 'Basti'
  | 'Nasya'
  | 'Pizhichil'
  | 'Swedana'
  | 'Other';

export interface TherapySession {
  id: string;
  type: TherapyType;
  title: string;
  dateISO: string; // e.g., 2025-09-01
  startTimeISO: string; // e.g., 2025-09-01T09:00:00Z
  endTimeISO: string;   // e.g., 2025-09-01T10:00:00Z
  durationMin: number;
  location?: string;
  practitioner?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  precautionsPre: string[];
  precautionsPost: string[];
}

export interface TherapyFeedback {
  sessionId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  createdAtISO: string;
}

export interface WellnessReport {
  dateISO: string;
  message: string;
}

