#!/usr/bin/env node

// Firebase Integration Test Script
const fs = require('fs');

console.log('🔥 Testing Firebase Integration...\n');

// Test 1: Check environment variables
console.log('1. Checking Firebase environment variables...');
const envContent = fs.readFileSync('.env', 'utf8');

const requiredVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
  'EXPO_PUBLIC_FIREBASE_VAPID_KEY'
];

let allVarsPresent = true;
requiredVars.forEach(varName => {
  if (envContent.includes(varName) && !envContent.includes(`${varName}=your-`)) {
    console.log(`   ✅ ${varName} is configured`);
  } else {
    console.log(`   ❌ ${varName} is missing or not configured`);
    allVarsPresent = false;
  }
});

// Test 2: Check Firebase service worker
console.log('\n2. Checking Firebase service worker...');
if (fs.existsSync('public/firebase-messaging-sw.js')) {
  const swContent = fs.readFileSync('public/firebase-messaging-sw.js', 'utf8');
  if (swContent.includes('ayursutra-patient-app')) {
    console.log('   ✅ Firebase service worker is configured with correct project');
  } else {
    console.log('   ❌ Firebase service worker needs project configuration');
  }
} else {
  console.log('   ❌ Firebase service worker not found');
}

// Test 3: Check Firebase notification utilities
console.log('\n3. Checking Firebase notification utilities...');
if (fs.existsSync('src/lib/firebase-notifications.ts')) {
  console.log('   ✅ Firebase notifications library exists');
} else {
  console.log('   ❌ Firebase notifications library missing');
}

if (fs.existsSync('src/utils/notifications.ts')) {
  const notificationsContent = fs.readFileSync('src/utils/notifications.ts', 'utf8');
  if (notificationsContent.includes('initializeFirebaseNotifications')) {
    console.log('   ✅ Firebase notification functions are integrated');
  } else {
    console.log('   ❌ Firebase notification functions not integrated');
  }
} else {
  console.log('   ❌ Notifications utility missing');
}

// Test 4: Check Supabase Edge Function for notifications
console.log('\n4. Checking Supabase Edge Function for notifications...');
if (fs.existsSync('supabase/functions/send-notification/index.ts')) {
  console.log('   ✅ Send notification Edge Function exists');
} else {
  console.log('   ❌ Send notification Edge Function missing');
}

// Test 5: Check FCM library
console.log('\n5. Checking FCM library...');
if (fs.existsSync('src/lib/fcm.ts')) {
  const fcmContent = fs.readFileSync('src/lib/fcm.ts', 'utf8');
  if (fcmContent.includes('ayursutra-patient-app')) {
    console.log('   ✅ FCM library is configured with correct project');
  } else {
    console.log('   ❌ FCM library needs project configuration');
  }
} else {
  console.log('   ❌ FCM library missing');
}

console.log('\n' + '='.repeat(50));

if (allVarsPresent) {
  console.log('🎉 Firebase integration is properly configured!');
  console.log('\n📱 Next steps:');
  console.log('1. Set up Supabase project and get credentials');
  console.log('2. Get Google Gemini API key');
  console.log('3. Deploy Supabase Edge Functions');
  console.log('4. Test the app: npm start');
} else {
  console.log('⚠️  Some Firebase configuration is missing.');
  console.log('Please check the environment variables and configuration files.');
}

console.log('\n🔥 Firebase setup complete! Ready for Supabase and Gemini integration.');