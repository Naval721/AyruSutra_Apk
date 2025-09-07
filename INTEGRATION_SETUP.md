# AyurSutra Patient Companion - Integration Setup

## 🚀 Quick Start

Your app is ready for integration! Follow these steps to get everything running:

### 1. Environment Configuration

#### Frontend (.env)
```bash
# Copy the example file
cp .env.example .env

# Update with your actual credentials
nano .env
```

Required variables:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `EXPO_PUBLIC_FIREBASE_*` - Firebase configuration for notifications

#### Supabase Edge Functions (.env)
```bash
# Copy the example file
cd supabase
cp .env.example .env

# Update with your actual credentials
nano .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `GEMINI_API_KEY` - Your Google Gemini API key
- `FCM_SERVER_KEY` - Your Firebase server key

### 2. Supabase Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy Edge Functions
supabase functions deploy ai-assistant
supabase functions deploy daily-report

# Deploy database schema
supabase db push
```

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 4. Run Integration Setup Script

```bash
# Run the automated setup
./scripts/setup-integration.sh
```

## 📱 App Features Ready

Your app includes:

### Core Features
- ✅ **Authentication** - Supabase Auth integration
- ✅ **AI Chat Assistant** - Google Gemini-powered Ayurvedic guidance
- ✅ **Daily Wellness Tracking** - Progress monitoring
- ✅ **Push Notifications** - Firebase Cloud Messaging
- ✅ **Offline Support** - AsyncStorage for data persistence
- ✅ **Cross-Platform** - React Native with Expo

### Screens & Navigation
- ✅ **Dashboard** - Overview and quick actions
- ✅ **Chat Interface** - AI assistant conversation
- ✅ **Progress Tracking** - Wellness metrics and history
- ✅ **Schedule Management** - Therapy and appointment scheduling
- ✅ **Profile & Settings** - User preferences and account management
- ✅ **Help & Support** - User guidance and feedback

### Backend Services
- ✅ **Supabase Edge Functions** - AI assistant and daily reports
- ✅ **Google Gemini Integration** - Advanced AI capabilities
- ✅ **Firebase Notifications** - Push notification management
- ✅ **Supabase Database** - User data and conversation storage

## 🔧 Configuration Details

### Supabase Setup
1. Create a new Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Deploy the database schema: `supabase db push`
4. Deploy Edge Functions: `supabase functions deploy`
5. Set up environment variables in Supabase dashboard

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Cloud Messaging
3. Generate server key and VAPID key
4. Configure web app settings
5. Add your domain to authorized domains

### Google Gemini Setup
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add the key to your Supabase Edge Functions environment
4. Enable the Gemini API in Google Cloud Console

## 🚀 Running the App

### Development
```bash
# Start Expo development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web
```

### Production Build
```bash
# Build for production
expo build:android
expo build:ios
expo build:web
```

## 📋 Pre-Launch Checklist

- [ ] Update all environment variables with real credentials
- [ ] Deploy backend services to AWS
- [ ] Test all API integrations
- [ ] Configure push notifications
- [ ] Test offline functionality
- [ ] Verify cross-platform compatibility
- [ ] Run security audit
- [ ] Test user authentication flow
- [ ] Validate AI assistant responses
- [ ] Test notification delivery

## 🆘 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure variables start with `EXPO_PUBLIC_`
   - Restart the development server after changes

2. **Supabase Connection Issues**
   - Verify URL and key are correct
   - Check network connectivity
   - Ensure RLS policies are configured

3. **Firebase Notifications Not Working**
   - Verify Firebase configuration
   - Check service worker registration
   - Ensure proper VAPID key setup

4. **Backend Deployment Issues**
   - Verify AWS credentials
   - Check CDK configuration
   - Ensure all environment variables are set

## 📞 Support

For integration support:
1. Check the logs for specific error messages
2. Verify all environment variables are correctly set
3. Test each service individually
4. Review the troubleshooting section above

Your AyurSutra Patient Companion app is now ready for integration and deployment! 🎉