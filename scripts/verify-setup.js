#!/usr/bin/env node

// AyurSutra Setup Verification Script
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying AyurSutra Patient Companion Setup...\n');

const checks = [
  {
    name: 'Environment Files',
    check: () => {
      const frontendEnv = fs.existsSync('.env');
      const backendEnv = fs.existsSync('backend/.env');
      return frontendEnv && backendEnv;
    },
    message: '✅ Environment files created'
  },
  {
    name: 'Frontend Dependencies',
    check: () => fs.existsSync('node_modules'),
    message: '✅ Frontend dependencies installed'
  },
  {
    name: 'Backend Dependencies',
    check: () => fs.existsSync('backend/node_modules'),
    message: '✅ Backend dependencies installed'
  },
  {
    name: 'Expo Configuration',
    check: () => fs.existsSync('app.json'),
    message: '✅ Expo configuration present'
  },
  {
    name: 'Capacitor Configuration',
    check: () => fs.existsSync('capacitor.config.ts'),
    message: '✅ Capacitor configuration present'
  },
  {
    name: 'Source Code Structure',
    check: () => {
      const srcDir = fs.existsSync('src');
      const components = fs.existsSync('src/components');
      const screens = fs.existsSync('src/screens');
      return srcDir && components && screens;
    },
    message: '✅ Source code structure complete'
  },
  {
    name: 'Backend Lambda Functions',
    check: () => {
      const lambdaDir = fs.existsSync('backend/lambda');
      const assistant = fs.existsSync('backend/lambda/assistant');
      return lambdaDir && assistant;
    },
    message: '✅ Backend Lambda functions ready'
  },
  {
    name: 'Integration Scripts',
    check: () => {
      const setupScript = fs.existsSync('scripts/setup-integration.sh');
      const verifyScript = fs.existsSync('scripts/verify-setup.js');
      return setupScript && verifyScript;
    },
    message: '✅ Integration scripts ready'
  }
];

let allPassed = true;

checks.forEach(check => {
  try {
    if (check.check()) {
      console.log(check.message);
    } else {
      console.log(`❌ ${check.name} - FAILED`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`❌ ${check.name} - ERROR: ${error.message}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Your app is ready to run.');
  console.log('\n📱 Next steps:');
  console.log('1. Update .env files with your actual credentials');
  console.log('2. Deploy backend: cd backend && npm run deploy');
  console.log('3. Start the app: npm start');
  console.log('\n🚀 Ready to launch AyurSutra Patient Companion!');
} else {
  console.log('⚠️  Some checks failed. Please review the setup.');
  console.log('\n🔧 Run ./scripts/setup-integration.sh to fix issues.');
}

console.log('\n📚 See INTEGRATION_SETUP.md for detailed instructions.');