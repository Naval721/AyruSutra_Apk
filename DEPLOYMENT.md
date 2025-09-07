# AyurSutra Patient App - Deployment Guide

This guide covers the complete deployment process for the AyurSutra Patient Companion App.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account
- Google Cloud account (for Gemini API)
- iOS/Android development environment (for production builds)

## 1. Environment Setup

### 1.1 Install Dependencies

```bash
# Install project dependencies
npm install

# Install Expo CLI globally (if not already installed)
npm install -g @expo/cli

# Install Supabase CLI globally (if not already installed)
npm install -g supabase
```

### 1.2 Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update `.env` with your credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 2. Supabase Setup

### 2.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Note your project URL and anon key

### 2.2 Database Setup

1. Run the database migration:
```sql
-- Copy and paste the contents of supabase/migrations/001_initial_schema.sql
-- into the Supabase SQL Editor and execute
```

2. Verify tables are created:
- profiles
- patients
- therapies
- feedback

### 2.3 Authentication Setup

1. Go to Authentication > Settings in Supabase Dashboard
2. Configure email settings
3. Set up any additional auth providers if needed

### 2.4 Row Level Security (RLS)

The migration automatically sets up RLS policies. Verify they're enabled:
- All tables should have RLS enabled
- Policies should be created for patient and practitioner access

## 3. Google Gemini API Setup

### 3.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Generative AI API

### 3.2 Generate API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file

## 4. Supabase Edge Functions

### 4.1 Deploy Gemini Chat Function

1. Login to Supabase:
```bash
supabase login
```

2. Link your project:
```bash
supabase link --project-ref your-project-ref
```

3. Deploy the function:
```bash
supabase functions deploy gemini-chat
```

4. Set environment variables:
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4.2 Test the Function

```bash
# Test the function locally
supabase functions serve

# Test with curl
curl -X POST 'http://localhost:54321/functions/v1/gemini-chat' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"message": "Hello", "patientId": "test-patient-id"}'
```

## 5. Development Testing

### 5.1 Run Setup Test

```bash
node scripts/test-setup.js
```

### 5.2 Start Development Server

```bash
# Start Expo development server
npm start

# Run on specific platforms
npm run ios
npm run android
npm run web
```

### 5.3 Test Core Features

1. **Authentication**: Test login with test patient credentials
2. **Dashboard**: Verify patient data loads correctly
3. **Schedule**: Check therapy data displays properly
4. **AI Chat**: Test Gemini integration
5. **Feedback**: Test feedback submission
6. **Progress**: Verify progress calculations

## 6. Production Build

### 6.1 Configure App Settings

1. Update `app.json` with production settings:
```json
{
  "expo": {
    "name": "AyurSutra Patient Companion",
    "slug": "ayursutra-patient-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.ayursutra.patientapp"
    },
    "android": {
      "package": "com.yourcompany.ayursutra.patientapp"
    }
  }
}
```

### 6.2 Build for iOS

```bash
# Build for iOS App Store
expo build:ios

# Or use EAS Build (recommended)
eas build --platform ios
```

### 6.3 Build for Android

```bash
# Build for Google Play Store
expo build:android

# Or use EAS Build (recommended)
eas build --platform android
```

### 6.4 Web Deployment

```bash
# Build for web
expo build:web

# Deploy to hosting service (e.g., Vercel, Netlify)
```

## 7. App Store Deployment

### 7.1 iOS App Store

1. Create App Store Connect account
2. Create new app listing
3. Upload build using Xcode or EAS
4. Submit for review

### 7.2 Google Play Store

1. Create Google Play Console account
2. Create new app listing
3. Upload APK/AAB file
4. Submit for review

## 8. Monitoring and Analytics

### 8.1 Error Tracking

Consider integrating:
- Sentry for error tracking
- Crashlytics for crash reporting
- Analytics for user behavior

### 8.2 Performance Monitoring

- Monitor app performance
- Track API response times
- Monitor database queries

## 9. Security Considerations

### 9.1 API Security

- All API keys are stored securely
- RLS policies protect data access
- Edge functions handle sensitive operations

### 9.2 Data Privacy

- Patient data is encrypted at rest
- Secure authentication with Supabase
- GDPR compliance considerations

## 10. Maintenance

### 10.1 Regular Updates

- Monitor for security updates
- Update dependencies regularly
- Test with new OS versions

### 10.2 Database Maintenance

- Regular backups
- Monitor performance
- Update RLS policies as needed

## 11. Troubleshooting

### 11.1 Common Issues

**App won't start:**
- Check environment variables
- Verify Supabase connection
- Check for TypeScript errors

**Authentication fails:**
- Verify Supabase auth settings
- Check RLS policies
- Verify user exists in database

**AI Chat not working:**
- Check Gemini API key
- Verify Edge Function deployment
- Check function logs

**Real-time updates not working:**
- Check Supabase real-time settings
- Verify RLS policies
- Check network connectivity

### 11.2 Debug Mode

Enable debug mode in development:
```javascript
// In your app configuration
console.log('Debug mode enabled');
```

## 12. Support and Documentation

- Check the main README.md for detailed setup
- Review Supabase documentation
- Check Expo documentation for platform-specific issues
- Contact support team for app-specific issues

## 13. Future Enhancements

- Push notifications
- Offline data sync improvements
- Advanced analytics
- Multi-language support
- Wearable device integration
- Video consultation features

---

For additional support or questions, please refer to the main README.md or contact the development team.