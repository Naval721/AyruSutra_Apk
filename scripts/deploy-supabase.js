#!/usr/bin/env node

// Supabase Deployment Script
const fs = require('fs');
const https = require('https');

console.log('🗄️ Deploying to Supabase...\n');

const SUPABASE_URL = 'https://hefmoyiinlpwmfmxfjqk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZm1veWlpbmxwd21mbXhmanFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzc1NzgsImV4cCI6MjA3Mjg1MzU3OH0.FIs2giKhXGpiw0KBWl06M6PWq57YEltne8hipXB-9Oc';

// Read the database schema
const schemaPath = 'supabase/migrations/20240101000001_initial_schema.sql';
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Database schema file not found:', schemaPath);
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');
console.log('📄 Database schema loaded');

// Function to make HTTP request
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test Supabase connection
async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log('✅ Supabase connection successful');
      return true;
    } else {
      console.log('❌ Supabase connection failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Supabase connection error:', error.message);
    return false;
  }
}

// Main deployment function
async function deployToSupabase() {
  console.log('🚀 Starting Supabase deployment...\n');

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.log('\n❌ Cannot connect to Supabase. Please check your credentials.');
    console.log('📝 Manual setup required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the schema from:', schemaPath);
    console.log('4. Run the SQL script');
    return;
  }

  console.log('\n📋 Database schema ready for deployment');
  console.log('📝 To complete the setup:');
  console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste the schema from:', schemaPath);
  console.log('4. Run the SQL script');
  console.log('\n🎉 Supabase configuration complete!');
  console.log('📱 Next: Get Google Gemini API key and deploy Edge Functions');
}

// Run deployment
deployToSupabase().catch(console.error);