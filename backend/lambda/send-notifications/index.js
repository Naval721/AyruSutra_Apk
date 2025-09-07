// Node.js 20 Lambda - Send Notifications (CloudWatch Scheduled)
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FCM_SERVER_KEY } = process.env;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function sendFCMNotification(token, title, body, data = {}) {
  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${FCM_SERVER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title,
          body,
          icon: '/placeholder.svg',
          badge: '/placeholder.svg'
        },
        data: {
          type: data.type || 'general',
          therapy_id: data.therapy_id || '',
          timestamp: new Date().toISOString(),
          ...data
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channel_id: 'ayursutra_notifications'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FCM error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    console.error('FCM send error:', error);
    return { success: false, error: error.message };
  }
}

export const handler = async (event) => {
  try {
    const now = new Date().toISOString();
    console.log(`Send notifications check at ${now}`);

    // Get due notifications
    const { data: dueNotifications, error: fetchError } = await supabase
      .from('notification_queue')
      .select('id, user_id, type, title, body, scheduled_at, meta')
      .lte('scheduled_at', now)
      .is('sent_at', null)
      .order('scheduled_at', { ascending: true })
      .limit(100);

    if (fetchError) {
      throw new Error(`Failed to fetch notifications: ${fetchError.message}`);
    }

    if (!dueNotifications || dueNotifications.length === 0) {
      console.log('No notifications to send');
      return {
        statusCode: 200,
        body: JSON.stringify({ sent: 0, timestamp: now })
      };
    }

    console.log(`Processing ${dueNotifications.length} notifications`);

    let totalSent = 0;
    let totalFailed = 0;

    for (const notification of dueNotifications) {
      try {
        // Get user's FCM tokens
        const { data: devices, error: deviceError } = await supabase
          .from('user_devices')
          .select('token, device_type')
          .eq('user_id', notification.user_id)
          .eq('active', true);

        if (deviceError) {
          console.error(`Error fetching devices for user ${notification.user_id}:`, deviceError);
          continue;
        }

        if (!devices || devices.length === 0) {
          console.log(`No active devices for user ${notification.user_id}`);
          // Mark as sent even if no devices (user might have opted out)
          await supabase
            .from('notification_queue')
            .update({ sent_at: now })
            .eq('id', notification.id);
          continue;
        }

        // Send to all user devices
        let userSent = 0;
        for (const device of devices) {
          const result = await sendFCMNotification(
            device.token,
            notification.title,
            notification.body,
            notification.meta || {}
          );

          if (result.success) {
            userSent++;
            console.log(`Sent notification ${notification.id} to device ${device.device_type}`);
          } else {
            console.error(`Failed to send to device ${device.token}:`, result.error);
            
            // If token is invalid, mark device as inactive
            if (result.error.includes('InvalidRegistration') || result.error.includes('NotRegistered')) {
              await supabase
                .from('user_devices')
                .update({ active: false })
                .eq('token', device.token);
            }
          }
        }

        if (userSent > 0) {
          totalSent += userSent;
          // Mark notification as sent
          await supabase
            .from('notification_queue')
            .update({ sent_at: now })
            .eq('id', notification.id);
        } else {
          totalFailed++;
          console.error(`Failed to send notification ${notification.id} to any device`);
        }

      } catch (notificationError) {
        console.error(`Error processing notification ${notification.id}:`, notificationError);
        totalFailed++;
      }
    }

    console.log(`Notification batch complete: ${totalSent} sent, ${totalFailed} failed`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        sent: totalSent,
        failed: totalFailed,
        processed: dueNotifications.length,
        timestamp: now
      })
    };

  } catch (e) {
    console.error('Send notifications error:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};

