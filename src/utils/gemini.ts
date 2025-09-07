import { supabase } from '../lib/supabase';
import { Patient, Therapy } from '../types';

export interface GeminiResponse {
  response: string;
  error?: string;
}

export interface ChatRequest {
  message: string;
  patientId: string;
}

export const callGeminiAPI = async ({
  message,
  patientId,
}: ChatRequest): Promise<GeminiResponse> => {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: {
        message,
        patientId,
      },
    });

    if (error) {
      console.error('Error calling Gemini API:', error);
      return {
        response: 'I apologize, but I\'m having trouble connecting right now. Please try again later.',
        error: error.message,
      };
    }

    return {
      response: data.response || 'I apologize, but I couldn\'t generate a response. Please try again.',
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      response: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const generateTherapyContext = (patient: Patient, therapies: Therapy[]): string => {
  const upcomingTherapies = therapies
    .filter(t => t.status === 'scheduled' || t.status === 'in_progress')
    .slice(0, 3);

  const context = `
Patient Information:
- Name: ${patient.name}
- Primary Dosha: ${patient.primary_dosha}
- Email: ${patient.email}

Upcoming Therapies:
${upcomingTherapies.map(t => `- ${t.name} on ${new Date(t.scheduled_date).toLocaleDateString()}`).join('\n')}

Please provide personalized Ayurvedic guidance based on this information. Focus on:
1. Dosha-specific recommendations
2. Preparation for upcoming therapies
3. General wellness advice
4. Dietary and lifestyle suggestions
5. Precautions and contraindications

Keep responses concise, practical, and encouraging. Use Ayurvedic terminology appropriately but explain when necessary.
  `.trim();

  return context;
};