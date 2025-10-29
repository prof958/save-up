-- user_stats table for tracking aggregate user statistics
-- Individual decisions are stored locally on device (AsyncStorage)
-- This table only stores cumulative stats for display and sync

-- Add stats columns to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS total_money_saved DECIMAL(10, 2) DEFAULT 0 CHECK (total_money_saved >= 0);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS total_hours_saved DECIMAL(10, 2) DEFAULT 0 CHECK (total_hours_saved >= 0);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS total_decisions INTEGER DEFAULT 0 CHECK (total_decisions >= 0);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS buy_count INTEGER DEFAULT 0 CHECK (buy_count >= 0);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS dont_buy_count INTEGER DEFAULT 0 CHECK (dont_buy_count >= 0);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS save_count INTEGER DEFAULT 0 CHECK (save_count >= 0);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS let_me_think_count INTEGER DEFAULT 0 CHECK (let_me_think_count >= 0);

-- Comments for documentation
COMMENT ON COLUMN user_profiles.total_money_saved IS 'Total money saved from dont_buy and save decisions';
COMMENT ON COLUMN user_profiles.total_hours_saved IS 'Total work hours saved from dont_buy and save decisions';
COMMENT ON COLUMN user_profiles.total_decisions IS 'Total number of decisions made (all types)';
COMMENT ON COLUMN user_profiles.buy_count IS 'Number of buy decisions';
COMMENT ON COLUMN user_profiles.dont_buy_count IS 'Number of dont_buy decisions';
COMMENT ON COLUMN user_profiles.save_count IS 'Number of save decisions';
COMMENT ON COLUMN user_profiles.let_me_think_count IS 'Number of let_me_think decisions';
