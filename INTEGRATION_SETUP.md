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
- `EXPO_PUBLIC_ASSISTANT_URL` - AI assistant API endpoint (set after backend deployment)
- `EXPO_PUBLIC_DAILY_REPORT_URL` - Daily report API endpoint (set after backend deployment)

#### Backend (backend/.env)
```bash
# Copy the example file
cd backend
cp env.example .env

# Update with your actual credentials
nano .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `OPENAI_API_KEY` - Your OpenAI API key
- `FCM_SERVER_KEY` - Your Firebase server key
- `CDK_DEFAULT_ACCOUNT` - Your AWS account ID
- `CDK_DEFAULT_REGION` - Your AWS region

### 2. Backend Deployment

```bash
cd backend

# Install dependencies
npm install

# Deploy to AWS
npm run deploy
```

After deployment, update your frontend `.env` with the deployed API URLs.

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
- ✅ **AI Chat Assistant** - Personalized Ayurvedic guidance
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
- ✅ **AI Assistant Lambda** - OpenAI integration for chat
- ✅ **Daily Report Lambda** - Automated wellness reports
- ✅ **Notification Lambda** - Push notification management
- ✅ **Reminder Lambda** - Scheduled reminder processing

## 🔧 Configuration Details

### Supabase Setup
1. Create a new Supabase project
2. Get your project URL and anon key
3. Set up database tables (see `src/types/database.ts`)
4. Configure RLS policies for security

### Firebase Setup
1. Create a Firebase project
2. Enable Cloud Messaging
3. Generate server key and VAPID key
4. Configure web app settings

### AWS Setup
1. Configure AWS CLI with your credentials
2. Install AWS CDK
3. Deploy the Lambda functions
4. Note the API Gateway URLs for frontend integration

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