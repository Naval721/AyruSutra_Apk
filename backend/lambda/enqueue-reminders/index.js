// Node.js 20 Lambda - Enqueue Reminders (CloudWatch Scheduled)
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const handler = async (event) => {
  try {
    const now = new Date();
    const in5Minutes = new Date(now.getTime() + 5 * 60 * 1000);

    console.log(`Enqueue reminders check at ${now.toISOString()}`);

    // Find upcoming therapies that need reminders
    const { data: upcomingSessions } = await supabase
      .from('therapies')
      .select('id, user_id, title, start_time, notify_before_min, status')
      .eq('status', 'upcoming')
      .lte('start_time', in5Minutes.toISOString());

    const reminderJobs = (upcomingSessions || [])
      .filter(session => {
        const startTime = new Date(session.start_time).getTime();
        const reminderTime = startTime - (session.notify_before_min || 120) * 60 * 1000;
        const nowTime = now.getTime();
        const in5Time = in5Minutes.getTime();
        
        return reminderTime >= nowTime && reminderTime <= in5Time;
      })
      .map(session => ({
        user_id: session.user_id,
        type: 'reminder',
        title: 'Upcoming Therapy Session',
        body: `"${session.title}" starts in ${session.notify_before_min || 120} minutes. Please prepare accordingly.`,
        scheduled_at: new Date(new Date(session.start_time).getTime() - (session.notify_before_min || 120) * 60 * 1000).toISOString(),
        meta: { therapy_id: session.id }
      }));

    // Find completed therapies that need feedback requests
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const { data: completedSessions } = await supabase
      .from('therapies')
      .select('id, user_id, title, end_time, status')
      .eq('status', 'upcoming')
      .lte('end_time', oneHourAgo);

    const feedbackJobs = (completedSessions || [])
      .map(session => ({
        user_id: session.user_id,
        type: 'feedback',
        title: 'How was your therapy session?',
        body: `Please share your feedback for "${session.title}". Your input helps us improve your care.`,
        scheduled_at: now.toISOString(),
        meta: { therapy_id: session.id }
      }));

    // Insert reminder jobs
    let reminderCount = 0;
    if (reminderJobs.length > 0) {
      const { error: reminderError } = await supabase
        .from('notification_queue')
        .insert(reminderJobs);
      
      if (reminderError) {
        console.error('Error inserting reminder jobs:', reminderError);
      } else {
        reminderCount = reminderJobs.length;
        console.log(`Enqueued ${reminderCount} reminder notifications`);
      }
    }

    // Insert feedback jobs
    let feedbackCount = 0;
    if (feedbackJobs.length > 0) {
      const { error: feedbackError } = await supabase
        .from('notification_queue')
        .insert(feedbackJobs);
      
      if (feedbackError) {
        console.error('Error inserting feedback jobs:', feedbackError);
      } else {
        feedbackCount = feedbackJobs.length;
        console.log(`Enqueued ${feedbackCount} feedback notifications`);
      }
    }

    // Update completed therapy statuses
    if (completedSessions && completedSessions.length > 0) {
      const completedIds = completedSessions.map(s => s.id);
      const { error: updateError } = await supabase
        .from('therapies')
        .update({ status: 'completed' })
        .in('id', completedIds);
      
      if (updateError) {
        console.error('Error updating therapy statuses:', updateError);
      } else {
        console.log(`Updated ${completedIds.length} therapies to completed status`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        enqueued: reminderCount + feedbackCount,
        reminders: reminderCount,
        feedback: feedbackCount,
        timestamp: now.toISOString()
      })
    };
  } catch (e) {
    console.error('Enqueue reminders error:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};

