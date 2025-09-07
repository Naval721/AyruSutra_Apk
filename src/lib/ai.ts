import { supabase } from './supabase';

// AI Assistant using Supabase Edge Functions with Google Gemini
export async function callAssistant(prompt: string, context: Record<string, any>) {
  if (!supabase) throw new Error('Supabase not configured');
  
  try {
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: { prompt, context }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    throw error;
  }
}

// Daily wellness report using Supabase Edge Functions with Google Gemini
export async function dailyReport(context: Record<string, any>) {
  if (!supabase) throw new Error('Supabase not configured');
  
  try {
    const { data, error } = await supabase.functions.invoke('daily-report', {
      body: { context }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating daily report:', error);
    throw error;
  }
}

// Save conversation to Supabase
export async function saveConversation(userId: string, prompt: string, response: string) {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      prompt,
      response,
      created_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

// Get conversation history
export async function getConversationHistory(userId: string, limit: number = 10) {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}


