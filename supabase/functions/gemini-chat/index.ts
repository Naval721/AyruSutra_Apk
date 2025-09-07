import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string;
  patientId: string;
}

interface GeminiResponse {
  response: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { message, patientId }: ChatRequest = await req.json()

    if (!message || !patientId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: message and patientId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch patient data and therapies
    const { data: patient, error: patientError } = await supabaseClient
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single()

    if (patientError || !patient) {
      return new Response(
        JSON.stringify({ error: 'Patient not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch upcoming therapies for context
    const { data: therapies, error: therapiesError } = await supabaseClient
      .from('therapies')
      .select('*')
      .eq('patient_id', patientId)
      .in('status', ['scheduled', 'in_progress'])
      .order('scheduled_date', { ascending: true })
      .limit(3)

    if (therapiesError) {
      console.error('Error fetching therapies:', therapiesError)
    }

    // Generate context for Gemini
    const therapyContext = therapies && therapies.length > 0 
      ? therapies.map(t => `- ${t.name} on ${new Date(t.scheduled_date).toLocaleDateString()}`).join('\n')
      : 'No upcoming therapies scheduled'

    const context = `
You are an AI Wellness Assistant for an Ayurvedic treatment app. You are helping a patient named ${patient.name} with their treatment journey.

Patient Information:
- Name: ${patient.name}
- Primary Dosha: ${patient.primary_dosha}
- Email: ${patient.email}

Upcoming Therapies:
${therapyContext}

Instructions:
1. Provide personalized Ayurvedic guidance based on the patient's dosha
2. Help with preparation for upcoming therapies
3. Offer general wellness advice and lifestyle recommendations
4. Use appropriate Ayurvedic terminology but explain when necessary
5. Be encouraging, supportive, and professional
6. Keep responses concise but informative (2-3 paragraphs max)
7. If asked about specific therapies, refer to the upcoming schedule
8. Focus on practical, actionable advice

Patient's Question: ${message}

Please provide a helpful, personalized response that addresses their question while considering their dosha and treatment schedule.
    `.trim()

    // Call Google Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found')
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: context
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', errorText)
      throw new Error(`Gemini API error: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      throw new Error('No response from Gemini API')
    }

    const response = geminiData.candidates[0].content.parts[0].text

    const result: GeminiResponse = {
      response: response || 'I apologize, but I couldn\'t generate a response. Please try again.'
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in gemini-chat function:', error)
    
    const result: GeminiResponse = {
      response: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.',
      error: error.message
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})