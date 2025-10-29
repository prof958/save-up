-- Update user_profiles table to include onboarding data
-- Run this after 01_user_profiles.sql

-- Add new columns to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS questionnaire_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS questionnaire_answers JSONB,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add comments for new columns
COMMENT ON COLUMN public.user_profiles.currency IS 'User preferred currency code (USD, EUR, GBP, etc.)';
COMMENT ON COLUMN public.user_profiles.region IS 'User country/region';
COMMENT ON COLUMN public.user_profiles.questionnaire_score IS 'Number of "yes" answers to impulsive spending questions (0-7)';
COMMENT ON COLUMN public.user_profiles.questionnaire_answers IS 'JSON object storing all questionnaire answers';
COMMENT ON COLUMN public.user_profiles.onboarding_completed IS 'Whether user has completed onboarding process';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON public.user_profiles(onboarding_completed);
