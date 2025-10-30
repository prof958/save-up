-- Quick test to verify all required columns exist in user_profiles

-- This should return 19 rows (one for each column)
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Expected columns (19 total):
-- 1. id
-- 2. user_id
-- 3. salary_amount
-- 4. salary_type
-- 5. hourly_wage (GENERATED)
-- 6. created_at
-- 7. updated_at
-- 8. currency
-- 9. region
-- 10. questionnaire_score
-- 11. questionnaire_answers
-- 12. onboarding_completed
-- 13. total_money_saved
-- 14. total_hours_saved
-- 15. total_decisions
-- 16. buy_count
-- 17. dont_buy_count
-- 18. save_count
-- 19. let_me_think_count

-- If you're missing any columns, run verify_and_setup.sql
