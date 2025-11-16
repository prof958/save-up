-- Add notification preferences column to user_profiles table
-- Run this in your Supabase SQL Editor

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS enable_engagement_notifications BOOLEAN DEFAULT true;

-- Add comment
COMMENT ON COLUMN user_profiles.enable_engagement_notifications IS 'Enable periodic engagement reminder notifications';
