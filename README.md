# AyurSutra Patient Companion App

A cross-platform mobile application built with React Native (Expo) for patients undergoing Panchakarma treatment. The app provides a personalized, supportive experience with AI-powered wellness guidance using Google Gemini.

## Features

- 🔐 **Secure Authentication** - Supabase Auth integration
- 📅 **Therapy Schedule** - Real-time schedule updates with detailed therapy information
- 🤖 **AI Wellness Assistant** - Personalized guidance powered by Google Gemini
- 📊 **Progress Tracking** - Visual progress indicators and completion statistics
- 💬 **Feedback System** - Rate and provide feedback on completed sessions
- 📱 **Offline Support** - Works offline with Supabase's real-time sync
- 🔔 **Push Notifications** - Therapy reminders and updates
- 🎨 **Beautiful UI** - Modern, healing-focused design with React Native Paper

## Tech Stack

- **Framework**: React Native (Expo Managed Workflow)
- **Database & Backend**: Supabase (PostgreSQL, Auth, Real-time, Storage)
- **AI Engine**: Google Gemini API (via Supabase Edge Functions)
- **State Management**: React Context API + TanStack Query
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **UI Library**: React Native Paper
- **Language**: TypeScript

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Update .env with your Supabase and Gemini API credentials
```

### 3. Run the App
```bash
npm start
```

## Project Structure

```
src/
├── lib/
│   └── supabase.ts              # Supabase client configuration
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── hooks/
│   └── useSupabase.ts           # Custom hooks for data fetching
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── TherapyCard.tsx
│   └── LoadingIndicator.tsx
├── screens/
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── ScheduleScreen.tsx
│   ├── TherapyDetailScreen.tsx
│   ├── ProgressScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── ChatScreen.tsx           # AI Assistant
│   └── FeedbackScreen.tsx
├── navigation/
│   ├── AppNavigator.tsx         # Main navigation
│   ├── AuthStack.tsx            # Authentication stack
│   └── MainTabs.tsx             # Main tab navigation
├── types/
│   ├── database.ts              # Database type definitions
│   └── index.ts                 # App type definitions
├── utils/
│   ├── gemini.ts                # Gemini API utility
│   ├── notifications.ts         # Push notifications
│   └── offline.ts               # Offline support
└── theme/
    └── theme.ts                 # App theme configuration
```

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project
2. Run the database migration in `supabase/migrations/001_initial_schema.sql`
3. Deploy the Gemini chat function: `supabase functions deploy gemini-chat`

### 2. Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 3. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file

## Key Features

- **Real-time Data Sync** - Live updates with Supabase subscriptions
- **AI Wellness Assistant** - Personalized guidance with Gemini API
- **Beautiful UI** - Modern design with healing-focused theme
- **Offline Support** - Works without internet connection
- **Push Notifications** - Therapy reminders and updates

## License

MIT License