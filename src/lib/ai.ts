import { supabase } from './supabase';

const ASSISTANT_URL = import.meta.env.VITE_ASSISTANT_URL as string | undefined;
const DAILY_REPORT_URL = import.meta.env.VITE_DAILY_REPORT_URL as string | undefined;

async function fetchWithAuth(url: string, payload: unknown) {
  let authHeader: Record<string, string> = {};
  try {
    if (supabase) {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (token) authHeader = { Authorization: `Bearer ${token}` };
    }
  } catch {}
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function callAssistant(prompt: string, context: Record<string, any>) {
  if (ASSISTANT_URL) {
    return fetchWithAuth(ASSISTANT_URL, { prompt, context });
  }
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.functions.invoke('assistant', { body: { prompt, context } });
  if (error) throw error;
  return data;
}

export async function dailyReport(context: Record<string, any>) {
  if (DAILY_REPORT_URL) {
    return fetchWithAuth(DAILY_REPORT_URL, { context });
  }
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.functions.invoke('daily_report', { body: { context } });
  if (error) throw error;
  return data;
}


