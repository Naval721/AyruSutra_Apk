-- AyurSutra Patient App Database Schema
-- This migration creates the initial database structure for the patient companion app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE dosha_type AS ENUM ('vata', 'pitta', 'kapha', 'tridosha');
CREATE TYPE therapy_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  practitioner_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  primary_dosha dosha_type NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create therapies table
CREATE TABLE therapies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  status therapy_status DEFAULT 'scheduled' NOT NULL,
  precautions TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  therapy_id UUID REFERENCES therapies(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(therapy_id, patient_id) -- One feedback per therapy per patient
);

-- Create indexes for better performance
CREATE INDEX idx_patients_practitioner_id ON patients(practitioner_id);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_therapies_patient_id ON therapies(patient_id);
CREATE INDEX idx_therapies_scheduled_date ON therapies(scheduled_date);
CREATE INDEX idx_therapies_status ON therapies(status);
CREATE INDEX idx_feedback_therapy_id ON feedback(therapy_id);
CREATE INDEX idx_feedback_patient_id ON feedback(patient_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapies ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for patients
CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Practitioners can view their patients" ON patients
  FOR SELECT USING (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can manage their patients" ON patients
  FOR ALL USING (practitioner_id = auth.uid());

-- Create RLS policies for therapies
CREATE POLICY "Patients can view own therapies" ON therapies
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Practitioners can manage therapies for their patients" ON therapies
  FOR ALL USING (
    practitioner_id = (
      SELECT practitioner_id 
      FROM patients 
      WHERE id = patient_id
    )
  );

-- Create RLS policies for feedback
CREATE POLICY "Patients can view own feedback" ON feedback
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Patients can insert own feedback" ON feedback
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients can update own feedback" ON feedback
  FOR UPDATE USING (patient_id = auth.uid());

CREATE POLICY "Practitioners can view patient feedback" ON feedback
  FOR SELECT USING (
    practitioner_id = (
      SELECT practitioner_id 
      FROM patients 
      WHERE id = patient_id
    )
  );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at 
  BEFORE UPDATE ON patients 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_therapies_updated_at 
  BEFORE UPDATE ON therapies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at 
  BEFORE UPDATE ON feedback 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get patient progress
CREATE OR REPLACE FUNCTION get_patient_progress(patient_uuid UUID)
RETURNS TABLE (
  total_therapies BIGINT,
  completed_therapies BIGINT,
  upcoming_therapies BIGINT,
  completion_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_therapies,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_therapies,
    COUNT(*) FILTER (WHERE status IN ('scheduled', 'in_progress')) as upcoming_therapies,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END as completion_percentage
  FROM therapies 
  WHERE patient_id = patient_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;