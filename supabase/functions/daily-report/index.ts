import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the JWT token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { context } = await req.json()

    // Get user's recent data for context
    const { data: userProfile } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const { data: dailyActivities } = await supabaseClient
      .from('daily_activities')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })

    const { data: healthMetrics } = await supabaseClient
      .from('health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })

    const { data: previousReports } = await supabaseClient
      .from('daily_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(7)

    // Call Google Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const reportPrompt = `Generate a personalized daily Ayurvedic wellness report based on the following context:
    
    User Profile: ${JSON.stringify(userProfile || {})}
    Daily Activities: ${JSON.stringify(dailyActivities || [])}
    Health Metrics: ${JSON.stringify(healthMetrics || [])}
    Previous Reports: ${JSON.stringify(previousReports || [])}
    
    Provide:
    1. Daily wellness assessment
    2. Recommended practices for today
    3. Dietary suggestions
    4. Lifestyle recommendations
    5. Any concerns to watch for
    
    Format as a structured, encouraging report.`;

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
              text: reportPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    const report = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate daily report.'

    // Save daily report to database
    const { error: saveError } = await supabaseClient
      .from('daily_reports')
      .insert({
        user_id: user.id,
        report,
        generated_at: new Date().toISOString(),
        context: {
          userProfile,
          dailyActivities,
          healthMetrics,
          previousReports
        }
      })

    if (saveError) {
      console.error('Error saving daily report:', saveError)
    }

    return new Response(
      JSON.stringify({
        report,
        usage: geminiData.usageMetadata,
        generatedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in daily report function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})