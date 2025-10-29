# Supabase Setup Instructions

## ✅ Completed
- Environment variables configured in `.env`
- Supabase client created in `src/config/supabase.ts`
- Authentication context created
- Login and Signup screens built

## 🔧 Required: Database Setup

You need to run the SQL script to create the `user_profiles` table.

### Steps:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/jqhhhdvaafuznljnbjsu

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Run the Script**
   - Open `dbscripts/01_user_profiles.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl/Cmd + Enter

4. **Verify the Table**
   - Go to "Table Editor" in the left sidebar
   - You should see `user_profiles` table
   - Check that RLS (Row Level Security) is enabled

### What the Script Creates:

- **user_profiles table** with columns:
  - `id` (UUID, primary key)
  - `user_id` (UUID, references auth.users)
  - `salary_amount` (decimal)
  - `salary_type` (text: 'monthly' or 'annual')
  - `hourly_wage` (computed column - automatically calculated!)
  - `created_at` and `updated_at` timestamps

- **Row Level Security policies**:
  - Users can only see/edit their own profile
  - Automatic security enforcement

- **Triggers**:
  - `updated_at` automatically updates on changes

## 🧪 Testing Authentication

After running the database script:

1. **Start the app**: `npx expo start`
2. **You should see the Login screen** (since you're not authenticated)
3. **Try signing up**:
   - Enter an email and password
   - You'll get a confirmation email from Supabase
4. **Confirm your email** (check your inbox)
5. **Sign in** with your credentials
6. **You should now see the app tabs** (Home, Spending, Profile)

## 🔐 Disable Email Confirmation (For Development)

To allow users to sign in immediately without email verification:

1. Go to **Authentication** → **Providers** → **Email**
2. **Toggle OFF** "Confirm email"
3. Click **Save**

This is recommended for development/testing. You can re-enable it later for production.

**Alternative via URL:**
- Direct link: https://supabase.com/dashboard/project/jqhhhdvaafuznljnbjsu/auth/providers

## Next Steps After Setup

Once authentication works:
- Create Profile screen UI for salary input
- Add profile context for managing user profile data
- Update Home screen to show personalized content
- Build the Spending Calculator screen
