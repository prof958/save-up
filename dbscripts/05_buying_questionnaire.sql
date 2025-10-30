-- Add buying questionnaire preference to user_profiles
-- This field controls whether the user sees a questionnaire before buying

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS show_buying_questionnaire BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.user_profiles.show_buying_questionnaire IS 'Whether to show buying questionnaire before confirming purchase';
