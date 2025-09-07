#!/usr/bin/env node

// Complete Project Setup Script
const fs = require('fs');

console.log('🚀 AyurSutra Patient Companion - Complete Setup\n');

// Check current configuration
console.log('📋 Current Configuration Status:\n');

// Check environment files
const envFiles = [
  { path: '.env', name: 'Frontend Environment' },
  { path: 'supabase/.env', name: 'Supabase Environment' }
];

envFiles.forEach(file => {
  if (fs.existsSync(file.path)) {
    const content = fs.readFileSync(file.path, 'utf8');
    const hasSupabase = content.includes('hefmoyiinlpwmfmxfjqk.supabase.co');
    const hasFirebase = content.includes('ayursutra-patient-app.firebaseapp.com');
    const hasGemini = content.includes('AIzaSyCt26NSBSCWT1FEQtO48H0JEm9QPDCkM-4');
    
    console.log(`✅ ${file.name}:`);
    console.log(`   ${hasSupabase ? '✅' : '❌'} Supabase configured`);
    console.log(`   ${hasFirebase ? '✅' : '❌'} Firebase configured`);
    console.log(`   ${hasGemini ? '✅' : '❌'} Gemini API key ${hasGemini ? 'configured' : 'needed'}`);
  } else {
    console.log(`❌ ${file.name}: Missing`);
  }
});

console.log('\n📱 Next Steps to Complete Your Project:\n');

console.log('1. 🔑 Get Google Gemini API Key:');
console.log('   • Go to: https://makersuite.google.com/app/apikey');
console.log('   • Create a new API key');
console.log('   • Copy the key and run: node scripts/add-gemini-key.js YOUR_KEY');

console.log('\n2. 🗄️ Deploy Database Schema:');
console.log('   • Go to: https://supabase.com/dashboard');
console.log('   • Open your project: ayursutra-patient-app');
console.log('   • Navigate to SQL Editor');
console.log('   • Copy the schema from: supabase/migrations/20240101000001_initial_schema.sql');
console.log('   • Paste and run the SQL script');

console.log('\n3. ⚡ Deploy Edge Functions:');
console.log('   • Install Supabase CLI: npm install -g supabase');
console.log('   • Login: supabase login');
console.log('   • Link project: supabase link --project-ref hefmoyiinlpwmfmxfjqk');
console.log('   • Deploy functions: supabase functions deploy');

console.log('\n4. 🚀 Start the App:');
console.log('   • Run: npm start');
console.log('   • Open: http://localhost:3000');

console.log('\n📚 Quick Commands:');
console.log('   • Test setup: node scripts/verify-setup.js');
console.log('   • Test Firebase: node scripts/test-firebase.js');
console.log('   • Add Gemini key: node scripts/add-gemini-key.js YOUR_KEY');

console.log('\n🎉 Your app is almost ready! Just need the Gemini API key and database deployment.');