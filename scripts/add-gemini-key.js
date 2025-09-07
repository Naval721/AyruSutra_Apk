#!/usr/bin/env node

// Add Google Gemini API Key Script
const fs = require('fs');

const geminiKey = process.argv[2];

if (!geminiKey) {
  console.log('❌ Please provide a Gemini API key');
  console.log('Usage: node scripts/add-gemini-key.js YOUR_GEMINI_API_KEY');
  console.log('\nGet your key from: https://makersuite.google.com/app/apikey');
  process.exit(1);
}

console.log('🔑 Adding Google Gemini API key...\n');

// Update frontend .env
const frontendEnvPath = '.env';
if (fs.existsSync(frontendEnvPath)) {
  let content = fs.readFileSync(frontendEnvPath, 'utf8');
  content = content.replace('EXPO_PUBLIC_GEMINI_API_KEY=your-google-gemini-api-key', `EXPO_PUBLIC_GEMINI_API_KEY=${geminiKey}`);
  fs.writeFileSync(frontendEnvPath, content);
  console.log('✅ Frontend .env updated');
} else {
  console.log('❌ Frontend .env not found');
}

// Update Supabase .env
const supabaseEnvPath = 'supabase/.env';
if (fs.existsSync(supabaseEnvPath)) {
  let content = fs.readFileSync(supabaseEnvPath, 'utf8');
  content = content.replace('GEMINI_API_KEY=your-google-gemini-api-key', `GEMINI_API_KEY=${geminiKey}`);
  fs.writeFileSync(supabaseEnvPath, content);
  console.log('✅ Supabase .env updated');
} else {
  console.log('❌ Supabase .env not found');
}

console.log('\n🎉 Gemini API key added successfully!');
console.log('\n📱 Next steps:');
console.log('1. Deploy database schema to Supabase');
console.log('2. Deploy Edge Functions: supabase functions deploy');
console.log('3. Start the app: npm start');