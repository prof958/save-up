-- Create user_profiles table
-- This table stores user salary information and calculated hourly wage

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    salary_amount DECIMAL(12, 2) NOT NULL,
    salary_type TEXT NOT NULL CHECK (salary_type IN ('monthly', 'annual')),
    hourly_wage DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN salary_type = 'monthly' THEN (salary_amount * 12) / (52 * 40)
            WHEN salary_type = 'annual' THEN salary_amount / (52 * 40)
            ELSE 0
        END
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
-- Users can only read their own profile
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can create own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" 
ON public.user_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

COMMENT ON TABLE public.user_profiles IS 'Stores user salary information and calculated hourly wage';
COMMENT ON COLUMN public.user_profiles.salary_amount IS 'User salary amount in their local currency';
COMMENT ON COLUMN public.user_profiles.salary_type IS 'Type of salary: monthly or annual';
COMMENT ON COLUMN public.user_profiles.hourly_wage IS 'Calculated hourly wage based on salary (computed column)';
