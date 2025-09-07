// Node.js 20 Lambda - Assistant (API Gateway HTTP)
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY } = process.env;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;

export const handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
    const { prompt, context } = body;

    if (!prompt) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Get user context from Supabase if available
    let userContext = context || {};
    if (supabase && context?.user_id) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, dosha, clinic_name')
          .eq('id', context.user_id)
          .single();
        
        if (profile) {
          userContext = { ...userContext, ...profile };
        }
      } catch (e) {
        console.log('Could not fetch user profile:', e.message);
      }
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${OPENAI_API_KEY}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert Ayurvedic wellness assistant. Provide helpful, personalized advice based on the user's context. Be concise, practical, and encouraging. Context: ${JSON.stringify(userContext).slice(0, 3000)}` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response. Please try again.';

    // Optional: Log interaction to Supabase
    if (supabase && context?.user_id) {
      try {
        await supabase.from('feedback').insert({
          therapy_id: null,
          rating: 5,
          notes: `AI Assistant Q: ${prompt.slice(0, 200)}`
        });
      } catch (e) {
        console.log('Could not log interaction:', e.message);
      }
    }

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ answer })
    };
  } catch (e) {
    console.error('Assistant error:', e);
    return { 
      statusCode: 500, 
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }, 
      body: JSON.stringify({ error: 'Internal server error' }) 
    };
  }
};

