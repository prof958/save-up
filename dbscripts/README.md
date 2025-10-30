# Save Up - Database Scripts

This folder contains SQL scripts for setting up the Supabase database schema.

## Scripts

- `01_user_profiles.sql` - Creates the base user_profiles table with salary and wage calculation
- `02_currency_support.sql` - Adds currency support (optional)
- `03_onboarding_fields.sql` - Adds currency, region, questionnaire fields
- `04_spending_decisions.sql` - Adds statistics tracking columns
- `05_buying_questionnaire.sql` - Adds buying questionnaire preference toggle
- `verify_and_setup.sql` - **Run this first!** Verifies and adds all required columns (idempotent)

## Quick Setup (Recommended)

**For existing databases or to verify setup:**

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the content of `verify_and_setup.sql`
4. Run the script

This will:
- ✅ Add any missing columns (safe to run multiple times)
- ✅ Show you all current columns
- ✅ Initialize any NULL values
- ✅ Add proper comments and constraints

## Fresh Database Setup

If you're setting up from scratch, run scripts in order:

```sql
\i 01_user_profiles.sql
\i 02_currency_support.sql
\i 03_onboarding_fields.sql
\i 04_spending_decisions.sql
```

## Required Columns

The app expects these columns in `user_profiles`:

### Basic Profile
- `id`, `user_id`, `salary_amount`, `salary_type`
- `hourly_wage` (GENERATED - never update directly!)
- `created_at`, `updated_at`

### Onboarding Data
- `currency` (USD, EUR, GBP, etc.)
- `region`, `questionnaire_score`, `questionnaire_answers`
- `onboarding_completed`

### Statistics (Single Source of Truth)
- `total_money_saved`, `total_hours_saved`, `total_decisions`
- `buy_count`, `dont_buy_count`, `save_count`, `let_me_think_count`

**Both HomeScreen and ProfileScreen read from these DB columns!**

## Verify Setup

Run this query to check all columns exist:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'user_profiles'
ORDER BY ordinal_position;
```

You should see 19 columns total.

## Important Notes

⚠️ **Never update `hourly_wage`** - It's auto-calculated from salary
⚠️ **Stats are in Supabase** - Not in AsyncStorage (AsyncStorage only has individual decisions)
⚠️ **Row Level Security enabled** - Users can only access their own data
