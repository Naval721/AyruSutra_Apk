// Firebase service worker for push notifications
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDk9xwF-YdA7OxxNCIB5RLp6iGFSugDaAI",
  authDomain: "ayursutra-patient-app.firebaseapp.com",
  projectId: "ayursutra-patient-app",
  storageBucket: "ayursutra-patient-app.firebasestorage.app",
  messagingSenderId: "266232140297",
  appId: "1:266232140297:web:3b7fe140f7992343491ed8",
  measurementId: "G-BBM261KR5M"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'AyurSutra';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'ayursutra-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});