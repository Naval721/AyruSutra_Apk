import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDk9xwF-YdA7OxxNCIB5RLp6iGFSugDaAI",
  authDomain: "ayursutra-patient-app.firebaseapp.com",
  projectId: "ayursutra-patient-app",
  storageBucket: "ayursutra-patient-app.firebasestorage.app",
  messagingSenderId: "266232140297",
  appId: "1:266232140297:web:3b7fe140f7992343491ed8",
  measurementId: "G-BBM261KR5M"
};

export async function initFcm(onForegroundMessage?: (payload: any) => void) {
  if (!(await isSupported())) return null;
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const vapidKey = "BGwqQnMLrO5EwgqrbiVlS36HCyMzZKiWXYfZMvCgbTTrW1RfJPZEVNZ0VMrgGpmFgkIKQbN1aY6-JdiGbB-0Nhc";
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
  if (onForegroundMessage) onMessage(messaging, onForegroundMessage);
  return token;
}


