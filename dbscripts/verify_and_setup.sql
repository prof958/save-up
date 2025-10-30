-- Verification and Setup Script for Save Up Database
-- Run this script to ensure all required columns exist in user_profiles table

-- This script is idempotent - safe to run multiple times

-- ============================================================================
-- VERIFY AND ADD ALL REQUIRED COLUMNS
-- ============================================================================

-- Basic profile columns (from 01_user_profiles.sql)
-- These should already exist, but we verify them here

-- Onboarding columns (from 03_onboarding_fields.sql)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS questionnaire_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS questionnaire_answers JSONB,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Stats columns (from 04_spending_decisions.sql)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS total_money_saved DECIMAL(10, 2) DEFAULT 0 CHECK (total_money_saved >= 0),
ADD COLUMN IF NOT EXISTS total_hours_saved DECIMAL(10, 2) DEFAULT 0 CHECK (total_hours_saved >= 0),
ADD COLUMN IF NOT EXISTS total_decisions INTEGER DEFAULT 0 CHECK (total_decisions >= 0),
ADD COLUMN IF NOT EXISTS buy_count INTEGER DEFAULT 0 CHECK (buy_count >= 0),
ADD COLUMN IF NOT EXISTS dont_buy_count INTEGER DEFAULT 0 CHECK (dont_buy_count >= 0),
ADD COLUMN IF NOT EXISTS save_count INTEGER DEFAULT 0 CHECK (save_count >= 0),
ADD COLUMN IF NOT EXISTS let_me_think_count INTEGER DEFAULT 0 CHECK (let_me_think_count >= 0);

-- Buying questionnaire preference (from 05_buying_questionnaire.sql)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS show_buying_questionnaire BOOLEAN DEFAULT false;

-- ============================================================================
-- VERIFY COLUMN TYPES AND CONSTRAINTS
-- ============================================================================

-- This query will show all columns in user_profiles table with their types
-- Run this to verify everything is set up correctly:
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- ============================================================================
-- TEST DATA INTEGRITY
-- ============================================================================

-- Check if any existing profiles have NULL values that should be initialized
SELECT 
    id,
    user_id,
    total_money_saved,
    total_hours_saved,
    total_decisions,
    buy_count,
    dont_buy_count,
    save_count,
    let_me_think_count,
    currency,
    questionnaire_score
FROM public.user_profiles
WHERE total_money_saved IS NULL 
   OR total_hours_saved IS NULL 
   OR total_decisions IS NULL;

-- ============================================================================
-- INITIALIZE NULL VALUES (if any found above)
-- ============================================================================

-- If you found NULL values above, run this to initialize them:
UPDATE public.user_profiles
SET 
    total_money_saved = COALESCE(total_money_saved, 0),
    total_hours_saved = COALESCE(total_hours_saved, 0),
    total_decisions = COALESCE(total_decisions, 0),
    buy_count = COALESCE(buy_count, 0),
    dont_buy_count = COALESCE(dont_buy_count, 0),
    save_count = COALESCE(save_count, 0),
    let_me_think_count = COALESCE(let_me_think_count, 0),
    currency = COALESCE(currency, 'USD'),
    questionnaire_score = COALESCE(questionnaire_score, 0)
WHERE total_money_saved IS NULL 
   OR total_hours_saved IS NULL 
   OR total_decisions IS NULL
   OR buy_count IS NULL
   OR dont_buy_count IS NULL
   OR save_count IS NULL
   OR let_me_think_count IS NULL
   OR currency IS NULL
   OR questionnaire_score IS NULL;

-- ============================================================================
-- VERIFICATION COMPLETE
-- ============================================================================

-- Expected columns in user_profiles:
-- ✓ id (UUID)
-- ✓ user_id (UUID) - references auth.users
-- ✓ salary_amount (DECIMAL)
-- ✓ salary_type (TEXT: monthly/annual)
-- ✓ hourly_wage (DECIMAL, GENERATED)
-- ✓ currency (TEXT)
-- ✓ region (TEXT)
-- ✓ questionnaire_score (INTEGER)
-- ✓ questionnaire_answers (JSONB)
-- ✓ onboarding_completed (BOOLEAN)
-- ✓ show_buying_questionnaire (BOOLEAN)
-- ✓ total_money_saved (DECIMAL)
-- ✓ total_hours_saved (DECIMAL)
-- ✓ total_decisions (INTEGER)
-- ✓ buy_count (INTEGER)
-- ✓ dont_buy_count (INTEGER)
-- ✓ save_count (INTEGER)
-- ✓ let_me_think_count (INTEGER)
-- ✓ created_at (TIMESTAMPTZ)
-- ✓ updated_at (TIMESTAMPTZ)

COMMENT ON TABLE public.user_profiles IS 'Complete user profile including salary, preferences, questionnaire results, and spending statistics';
COMMENT ON COLUMN public.user_profiles.currency IS 'User preferred currency code (USD, EUR, GBP, etc.)';
COMMENT ON COLUMN public.user_profiles.questionnaire_score IS 'Number of "yes" answers to impulsive spending questions (0-7)';
COMMENT ON COLUMN public.user_profiles.total_money_saved IS 'Total money saved from dont_buy and save decisions';
COMMENT ON COLUMN public.user_profiles.total_hours_saved IS 'Total work hours saved from dont_buy and save decisions';
COMMENT ON COLUMN public.user_profiles.total_decisions IS 'Total number of decisions made (all types)';
COMMENT ON COLUMN public.user_profiles.buy_count IS 'Number of buy decisions';
COMMENT ON COLUMN public.user_profiles.dont_buy_count IS 'Number of dont_buy decisions';
COMMENT ON COLUMN public.user_profiles.save_count IS 'Number of save decisions';
COMMENT ON COLUMN public.user_profiles.let_me_think_count IS 'Number of let_me_think decisions (reminders set)';
COMMENT ON COLUMN public.user_profiles.show_buying_questionnaire IS 'Whether to show buying questionnaire before confirming purchase';
