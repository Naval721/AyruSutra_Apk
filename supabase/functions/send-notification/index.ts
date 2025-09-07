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

    const { title, message, type = 'info', fcmToken } = await req.json()

    if (!title || !message) {
      return new Response(
        JSON.stringify({ error: 'Title and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Save notification to database
    const { data: notification, error: saveError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: user.id,
        title,
        message,
        type,
        sent_at: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving notification:', saveError)
    }

    // Send FCM notification if token provided
    if (fcmToken) {
      const fcmServerKey = Deno.env.get('FCM_SERVER_KEY')
      if (fcmServerKey) {
        try {
          const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Authorization': `key=${fcmServerKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: fcmToken,
              notification: {
                title,
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
              },
              data: {
                type,
                notificationId: notification?.id,
              }
            })
          })

          if (!fcmResponse.ok) {
            console.error('FCM send failed:', await fcmResponse.text())
          }
        } catch (error) {
          console.error('Error sending FCM notification:', error)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        notification,
        message: 'Notification sent successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send notification function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})