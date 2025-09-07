import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }

  return true;
};

export const scheduleTherapyReminder = async (
  therapyId: string,
  therapyName: string,
  scheduledDate: Date,
  reminderMinutes: number = 30
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    const reminderTime = new Date(scheduledDate.getTime() - reminderMinutes * 60 * 1000);
    
    // Don't schedule if the reminder time has already passed
    if (reminderTime <= new Date()) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Therapy Reminder',
        body: `Your ${therapyName} session is starting in ${reminderMinutes} minutes`,
        data: { therapyId, type: 'therapy_reminder' },
        sound: 'default',
      },
      trigger: {
        date: reminderTime,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const cancelTherapyReminder = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

export const scheduleDailyWellnessTip = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    // Schedule for 9 AM daily
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Wellness Tip',
        body: 'Check out today\'s personalized wellness guidance in your app',
        data: { type: 'daily_tip' },
        sound: 'default',
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling daily tip:', error);
    return null;
  }
};

export const getNotificationToken = async (): Promise<string | null> => {
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });
    return token.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};