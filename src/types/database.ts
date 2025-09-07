export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          practitioner_id: string
          name: string
          email: string
          primary_dosha: 'vata' | 'pitta' | 'kapha' | 'tridosha'
          phone: string | null
          date_of_birth: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          practitioner_id: string
          name: string
          email: string
          primary_dosha: 'vata' | 'pitta' | 'kapha' | 'tridosha'
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          practitioner_id?: string
          name?: string
          email?: string
          primary_dosha?: 'vata' | 'pitta' | 'kapha' | 'tridosha'
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      therapies: {
        Row: {
          id: string
          patient_id: string
          name: string
          description: string | null
          scheduled_date: string
          duration_minutes: number
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          precautions: string[]
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          patient_id: string
          name: string
          description?: string | null
          scheduled_date: string
          duration_minutes: number
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          precautions?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          name?: string
          description?: string | null
          scheduled_date?: string
          duration_minutes?: number
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          precautions?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          therapy_id: string
          patient_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          therapy_id: string
          patient_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          therapy_id?: string
          patient_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      dosha_type: 'vata' | 'pitta' | 'kapha' | 'tridosha'
      therapy_status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}