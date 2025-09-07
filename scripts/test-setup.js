#!/usr/bin/env node

/**
 * AyurSutra Patient App Setup Test
 * This script tests if the app is properly configured and ready to run
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing AyurSutra Patient App Setup...\n');

const tests = [
  {
    name: 'Package.json exists',
    test: () => fs.existsSync('package.json'),
    fix: 'Run npm init or copy from template'
  },
  {
    name: 'Dependencies installed',
    test: () => fs.existsSync('node_modules'),
    fix: 'Run npm install'
  },
  {
    name: 'Environment file exists',
    test: () => fs.existsSync('.env'),
    fix: 'Copy .env.example to .env and fill in your credentials'
  },
  {
    name: 'Source directory exists',
    test: () => fs.existsSync('src'),
    fix: 'Ensure src directory exists with all required files'
  },
  {
    name: 'App.tsx exists',
    test: () => fs.existsSync('src/App.tsx'),
    fix: 'Ensure src/App.tsx exists'
  },
  {
    name: 'Supabase config exists',
    test: () => fs.existsSync('src/lib/supabase.ts'),
    fix: 'Ensure src/lib/supabase.ts exists'
  },
  {
    name: 'Auth context exists',
    test: () => fs.existsSync('src/contexts/AuthContext.tsx'),
    fix: 'Ensure src/contexts/AuthContext.tsx exists'
  },
  {
    name: 'Navigation exists',
    test: () => fs.existsSync('src/navigation/AppNavigator.tsx'),
    fix: 'Ensure navigation files exist'
  },
  {
    name: 'Screens exist',
    test: () => {
      const screens = [
        'src/screens/LoginScreen.tsx',
        'src/screens/DashboardScreen.tsx',
        'src/screens/ScheduleScreen.tsx',
        'src/screens/ProgressScreen.tsx',
        'src/screens/ProfileScreen.tsx',
        'src/screens/ChatScreen.tsx',
        'src/screens/FeedbackScreen.tsx'
      ];
      return screens.every(screen => fs.existsSync(screen));
    },
    fix: 'Ensure all screen files exist'
  },
  {
    name: 'Components exist',
    test: () => {
      const components = [
        'src/components/TherapyCard.tsx',
        'src/components/LoadingIndicator.tsx',
        'src/components/ErrorBoundary.tsx'
      ];
      return components.every(component => fs.existsSync(component));
    },
    fix: 'Ensure all component files exist'
  },
  {
    name: 'Types exist',
    test: () => {
      const types = [
        'src/types/database.ts',
        'src/types/index.ts'
      ];
      return types.every(type => fs.existsSync(type));
    },
    fix: 'Ensure all type files exist'
  },
  {
    name: 'Utils exist',
    test: () => {
      const utils = [
        'src/utils/gemini.ts',
        'src/utils/notifications.ts',
        'src/utils/offline.ts'
      ];
      return utils.every(util => fs.existsSync(util));
    },
    fix: 'Ensure all utility files exist'
  },
  {
    name: 'Theme exists',
    test: () => fs.existsSync('src/theme/theme.ts'),
    fix: 'Ensure src/theme/theme.ts exists'
  },
  {
    name: 'Supabase functions exist',
    test: () => fs.existsSync('supabase/functions/gemini-chat/index.ts'),
    fix: 'Ensure Supabase Edge Function exists'
  },
  {
    name: 'Database migration exists',
    test: () => fs.existsSync('supabase/migrations/001_initial_schema.sql'),
    fix: 'Ensure database migration file exists'
  }
];

let passed = 0;
let failed = 0;

console.log('Running tests...\n');

tests.forEach(({ name, test, fix }) => {
  try {
    const result = test();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      console.log(`   Fix: ${fix}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name} (Error: ${error.message})`);
    console.log(`   Fix: ${fix}\n`);
    failed++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Your app is ready to run.');
  console.log('\nNext steps:');
  console.log('1. Update .env file with your Supabase and Gemini credentials');
  console.log('2. Set up your Supabase project and run the migration');
  console.log('3. Deploy the Gemini chat function');
  console.log('4. Run "npm start" to start the development server');
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues above before running the app.');
  process.exit(1);
}