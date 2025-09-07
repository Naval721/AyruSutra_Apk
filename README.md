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

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account
- Google Cloud account (for Gemini API)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ayursutra-patient-app
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Run the following SQL to create the database schema:

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  primary_dosha TEXT NOT NULL CHECK (primary_dosha IN ('vata', 'pitta', 'kapha', 'tridosha')),
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create therapies table
CREATE TABLE therapies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  precautions TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapy_id UUID REFERENCES therapies(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Patients can view own data" ON patients FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Practitioners can view their patients" ON patients FOR SELECT USING (practitioner_id = auth.uid());

CREATE POLICY "Patients can view own therapies" ON therapies FOR SELECT USING (patient_id = auth.uid());
CREATE POLICY "Practitioners can manage therapies" ON therapies FOR ALL USING (practitioner_id = (SELECT practitioner_id FROM patients WHERE id = patient_id));

CREATE POLICY "Patients can view own feedback" ON feedback FOR SELECT USING (patient_id = auth.uid());
CREATE POLICY "Patients can insert own feedback" ON feedback FOR INSERT WITH CHECK (patient_id = auth.uid());
CREATE POLICY "Practitioners can view patient feedback" ON feedback FOR SELECT USING (practitioner_id = (SELECT practitioner_id FROM patients WHERE id = patient_id));
```

3. Set up Row Level Security (RLS) policies as shown above

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your environment variables:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 4. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file

### 5. Supabase Edge Function Setup

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy the Gemini chat function:
```bash
supabase functions deploy gemini-chat
```

5. Set the environment variables for the function:
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 6. Run the Application

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
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
│   ├── TherapyCard.tsx          # Therapy card component
│   └── LoadingIndicator.tsx     # Loading indicator
├── screens/
│   ├── LoginScreen.tsx          # Authentication screen
│   ├── DashboardScreen.tsx      # Main dashboard
│   ├── ScheduleScreen.tsx       # Therapy schedule
│   ├── TherapyDetailScreen.tsx  # Therapy details
│   ├── ProgressScreen.tsx       # Progress tracking
│   ├── ProfileScreen.tsx        # User profile
│   ├── ChatScreen.tsx           # AI Wellness Assistant
│   └── FeedbackScreen.tsx       # Session feedback
├── navigation/
│   ├── AppNavigator.tsx         # Main navigation
│   ├── AuthStack.tsx            # Authentication stack
│   └── MainTabs.tsx             # Main tab navigation
├── types/
│   ├── database.ts              # Database type definitions
│   └── index.ts                 # App type definitions
├── utils/
│   └── gemini.ts                # Gemini API utility
└── theme/
    └── theme.ts                 # App theme configuration
```

## Key Features Implementation

### Real-time Data Synchronization
- Uses Supabase real-time subscriptions for live updates
- Automatic data refresh when therapy schedules change
- Offline support with automatic sync when connection is restored

### AI Wellness Assistant
- Powered by Google Gemini API via Supabase Edge Functions
- Personalized responses based on patient's dosha and therapy schedule
- Secure API calls with proper error handling

### Authentication & Security
- Supabase Auth with email/password authentication
- Row Level Security (RLS) for data protection
- Secure API keys management

### Beautiful UI/UX
- React Native Paper components for consistent design
- Ayurvedic color palette and healing-focused design
- Smooth animations and transitions
- Responsive layout for different screen sizes

## Database Schema

The app uses the following main tables:

- **profiles**: User profile information
- **patients**: Patient data linked to practitioners
- **therapies**: Therapy sessions with AI-generated precautions
- **feedback**: Patient feedback on completed sessions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Roadmap

- [ ] Push notifications for therapy reminders
- [ ] Offline data caching improvements
- [ ] Advanced analytics and insights
- [ ] Multi-language support
- [ ] Integration with wearable devices
- [ ] Video consultation features