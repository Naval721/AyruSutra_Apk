import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export async function initFcm(onForegroundMessage?: (payload: any) => void) {
  if (!(await isSupported())) return null;
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
  if (onForegroundMessage) onMessage(messaging, onForegroundMessage);
  return token;
}


