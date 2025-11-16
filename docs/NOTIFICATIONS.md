# Notification Feature Implementation

## Overview
Added push notification support to Save Up with two notification types:
1. **Reminder Notifications** - Scheduled notifications for "Let Me Think" reminders
2. **Engagement Notifications** - Periodic reminders to use the app

## What Was Added

### 1. New Dependencies
```bash
npm install expo-notifications expo-device
```

### 2. New Files Created

#### `src/utils/notificationService.ts`
- Complete notification service with all helper functions
- Functions:
  - `initializeNotificationChannels()` - Set up Android notification channels
  - `registerForPushNotifications()` - Request notification permissions
  - `scheduleReminderNotification()` - Schedule notification for "Let Me Think" reminders
  - `cancelReminderNotification()` - Cancel a specific notification
  - `scheduleEngagementNotifications()` - Schedule/cancel periodic engagement reminders
  - Notification listeners for handling taps and foreground notifications

#### `dbscripts/add_notification_preferences.sql`
- Database migration to add `enable_engagement_notifications` column to `user_profiles` table

### 3. Modified Files

#### `app.json`
- Added notification configuration
- Added notification plugin config
- Added notification icons and colors

#### `src/config/supabase.ts`
- Added `notification_id` field to `SpendingDecision` interface
- Added `enable_engagement_notifications` field to `UserProfile` interface

#### `App.tsx`
- Imported notification service
- Added `useEffect` to initialize notifications on app start

#### `src/screens/LetMeThinkScreen.tsx`
- Imported `scheduleReminderNotification`
- Updated `handleSave` to schedule notification when creating reminder
- Notification is scheduled for the exact remind_at time
- Notification ID is stored with the decision

#### `src/screens/HomeScreen.tsx`
- Imported `cancelReminderNotification`
- Updated `handleReminderDecision` to cancel notification when user makes a decision
- Updated questionnaire completion handlers to cancel notifications
- Cancels notification before updating/deleting reminders

#### `src/screens/ProfileScreen.tsx`
- Added "Engagement Reminders" toggle switch
- Toggle schedules/cancels periodic engagement notifications
- Updates user preference in database

## Notification Channels (Android)

### 1. Reminders Channel
- **ID**: `reminders`
- **Name**: Purchase Reminders
- **Importance**: HIGH
- **Use**: "Let Me Think" reminder notifications
- **Sound**: Yes
- **Vibration**: Pattern (0, 250, 250, 250)

### 2. Engagement Channel
- **ID**: `engagement`
- **Name**: Engagement Reminders
- **Importance**: DEFAULT
- **Use**: Periodic "Save Up" reminders
- **Sound**: Yes
- **Vibration**: Pattern (0, 250)

## Notification Messages

### Reminder Notifications
- **Title**: "⏰ Time to Decide!"
- **Body**: Ready to decide on "{item_name}" (${price})?
- **Data**: Contains reminder ID, item details
- **Trigger**: Exact date/time set by user

### Engagement Notifications
- **Title**: "💚 Hey, Save Up!"
- **Body**: Rotating messages:
  - "💰 Ready to make smarter spending decisions?"
  - "🎯 Check your savings progress!"
  - "💡 Before you buy, calculate the true cost"
  - "⏱ How many work hours is that purchase worth?"
  - "📊 See how much you've saved this month"
- **Frequency**: Twice per week (every 3 and 7 days)
- **Time**: 7:00 PM
- **Repeating**: Yes

## User Flow

### Creating a Reminder
1. User navigates to "Let Me Think" screen
2. User sets waiting period (24h, 48h, 72h, 1 week)
3. User saves reminder
4. System schedules notification for specified time
5. Notification ID is stored with reminder

### Receiving Notification
1. User receives notification at scheduled time
2. Notification shows item name and price
3. User taps notification → opens app to reminder screen
4. User makes decision (Buy/Don't Buy/Wait longer)
5. System cancels notification

### Engagement Notifications
1. User enables in Profile → Settings
2. System schedules 2 notifications per week
3. Notifications sent at 7 PM
4. User can disable anytime in settings

## Database Changes Required

Run this SQL in Supabase:

```sql
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS enable_engagement_notifications BOOLEAN DEFAULT true;

COMMENT ON COLUMN user_profiles.enable_engagement_notifications 
IS 'Enable periodic engagement reminder notifications';
```

## Testing Checklist

- [ ] Notification permissions requested on app start
- [ ] "Let Me Think" reminder creates notification
- [ ] Notification appears at scheduled time
- [ ] Tapping notification opens app
- [ ] Making decision cancels notification
- [ ] Engagement notifications toggle works
- [ ] Engagement notifications appear twice per week
- [ ] Disabling engagement notifications cancels them
- [ ] Notifications work after app restart
- [ ] Notifications work when app is closed
- [ ] Android notification channels configured correctly

## Next Steps

1. **Run database migration** in Supabase SQL Editor
2. **Test on physical device** (notifications don't work in simulators/emulators)
3. **Verify notification permissions** are requested
4. **Test reminder notifications** with short time periods (1 minute for testing)
5. **Test engagement notifications** (check scheduled notifications)
6. **Add notification icon** (`assets/notification-icon.png` - white icon on transparent background)

## Notes

- Notifications only work on physical devices
- Expo Go app may have limitations with notifications
- For production, standalone build is required
- Notification data can be used to navigate to specific screens
- Consider adding deep linking for better notification handling
