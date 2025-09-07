import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export async function initFcm(onForegroundMessage?: (payload: any) => void) {
  if (!(await isSupported())) return null;
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const vapidKey = process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY as string | undefined;
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
  if (onForegroundMessage) onMessage(messaging, onForegroundMessage);
  return token;
}


