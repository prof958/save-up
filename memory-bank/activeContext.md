# Active Context: Save Up

## Current Work Focus
**Status**: Phase 9 Complete - Notifications & Navigation Bar ✅
**Ready for**: Production Build & Testing

Completed enhancements:
1. ✅ User-scoped storage (critical security fix - no cross-account data leakage)
2. ✅ Stats unification (single source of truth in Supabase)
3. ✅ Generated column fix (hourly_wage auto-calculated)
4. ✅ Optional categories (improved UX across all screens)
5. ✅ Personality test retake (full navigation flow)
6. ✅ Modal dismissal (tap-outside-to-close)
7. ✅ Input validation consistency (15-char limits)
8. ✅ Keyboard behavior fixes (no button clipping)
9. ✅ UI clash prevention (item name/time badge spacing)
10. ✅ Push notification system (reminder & engagement notifications)
11. ✅ Android navigation bar respect (SafeAreaProvider integration)

## Recent Changes (Phase 9: Notifications & Navigation Bar - CURRENT)

**Push Notification System** (Multiple files - NEW FEATURE)
- **Dependencies Added**: expo-notifications, expo-device
- **New Files Created**:
  - `src/utils/notificationService.ts` - Complete notification management
  - `dbscripts/add_notification_preferences.sql` - Database migration
- **Notification Channels** (Android):
  - **Reminders Channel**: HIGH importance for "Let Me Think" notifications
  - **Engagement Channel**: DEFAULT importance for periodic reminders
- **Notification Types**:
  1. **Reminder Notifications**: Scheduled when user creates "Let Me Think" reminder
     - Title: "⏰ Time to Decide!"
     - Body: "Ready to decide on {item_name} (${price})?"
     - Fires at exact remind_at time
     - Cancelled automatically when user makes decision
  2. **Engagement Notifications**: Periodic app engagement reminders
     - Title: "💚 Hey, Save Up!"
     - Body: Rotating motivational messages (5 variants)
     - Frequency: Twice per week at 7 PM
     - User-controlled via Profile settings toggle
- **Integration Points**:
  - `App.tsx`: Initialize notifications on app start
  - `LetMeThinkScreen.tsx`: Schedule notification when creating reminder
  - `HomeScreen.tsx`: Cancel notification when making decision
  - `ProfileScreen.tsx`: Toggle engagement notifications on/off
- **Database Schema**: Added `notification_id` to SpendingDecision, `enable_engagement_notifications` to UserProfile
- **Configuration**: Updated app.json with notification icons, colors, plugins
- **User Preference**: Note to avoid creating .md files for every change

**Android Navigation Bar Fix** (App.tsx, AppNavigator.tsx - CRITICAL FIX)
- **Problem**: Content hidden behind Android navigation bar (edge-to-edge mode enabled)
- **Root Cause**: edgeToEdgeEnabled=true without SafeAreaProvider
- **Solution**:
  - Wrapped entire app with SafeAreaProvider in App.tsx
  - Used useSafeAreaInsets() hook in TabNavigator
  - Dynamic tab bar padding: `insets.bottom > 0 ? insets.bottom : 15`
  - Dynamic tab bar height: `(insets.bottom > 0 ? insets.bottom : 15) + 65`
- **Result**: Tab bar respects navigation bar height on all Android devices
- **Benefits**: Works with gesture nav, button nav, different screen sizes
- **TypeScript Fix**: Added notification_id to SpendingScreen.tsx saveDecision call

## Recent Changes (Phase 8: Navigation Fix & Code Cleanup - COMPLETE)

**Critical Navigation Bug Fix** (`src/navigation/AppNavigator.tsx`, `src/screens/ProfileScreen.tsx` - CRITICAL FIX)
- **Problem**: After completing onboarding, "Start Saving Smart" button showed "Retake Personality Test" screen instead of Home
- **Root Cause**: Both OnboardingNavigator and AppNavigator had screens named "Questionnaire"
  - React Navigation preserved the route key when switching navigators
  - Route `Questionnaire-G1awVRzi4EkOaFw2cYoD3` from OnboardingNavigator carried over to AppNavigator
  - AppNavigator saw existing "Questionnaire" route and displayed it instead of initial "Tabs" route
- **Solution**: Renamed AppNavigator's screen from "Questionnaire" to "RetakeQuestionnaire"
  - Updated RootStackParamList type
  - Updated Stack.Screen name
  - Updated ProfileScreen navigation call
- **Navigation Architecture Improvements**:
  - Added `initialRouteName="Tabs"` to AppNavigator Stack (explicit initial route)
  - Added `initialRouteName="Home"` to TabNavigator (explicit tab selection)
  - Added unique React keys to each navigator type (auth/onboarding/app) to force complete remount
  - Moved NavigationContainer into wrapper component with key prop
- **Result**: Clean navigation transitions, no route name conflicts, onboarding completes properly

**Code Cleanup - Removed Debug Logging** (Multiple files)
- **Files Updated**:
  - `App.tsx`: Removed 10+ console.log statements from checkOnboardingStatus and RootNavigator
  - `src/navigation/OnboardingNavigator.tsx`: Removed 9 debug logs from handleContinue function
  - `src/navigation/AppNavigator.tsx`: Removed mount notification log
  - NavigationContainer: Removed onStateChange and onReady logging
- **Kept Essential Logs**: Only error logs remain (console.error for actual errors)
- **Result**: Clean production-ready console output, easier debugging of real issues

**Require Cycle Fix** (`src/utils/onboardingTrigger.ts` - NEW FILE)
- **Problem**: Circular dependency between App.tsx ↔ OnboardingNavigator.tsx
- **Solution**: Extracted `onboardingRefreshTrigger` to dedicated utility file
- **Result**: Clean imports, no require cycle warnings

## Recent Changes (Phase 7: Bug Fixes & UI Refinements - COMPLETE)

**Critical Architecture Fix - User-Scoped Storage** (`src/utils/decisionStorage.ts` - CRITICAL UPDATE)
- **Problem**: Multiple users on same device could see each other's data
- **Root Cause**: Shared AsyncStorage key `@save_up_decisions` across all users
- **Solution**: User-specific keys `@save_up_decisions_{user_id}`
- Added `getStorageKey()` function that gets current user ID from Supabase
- All storage functions now use user-scoped keys (loadDecisions, saveDecision, etc.)
- Added comprehensive architecture documentation in comments
- **Result**: Complete data isolation between users, zero cross-contamination possible

**Stats Unification** (`src/screens/HomeScreen.tsx` - MAJOR FIX)
- **Problem**: HomeScreen and ProfileScreen showed different stats
- **Root Cause**: HomeScreen used AsyncStorage, ProfileScreen used Supabase
- **Solution**: Both screens now use `profile.*` from Supabase (single source of truth)
- Removed local `DecisionStats` state and `getStats()` calls
- Now displays: `profile.total_money_saved`, `profile.total_decisions`, etc.
- **Result**: Perfect consistency across all screens

**Generated Column Fix** (`src/screens/ProfileScreen.tsx` - DATABASE FIX)
- **Problem**: ERROR "Column 'hourly_wage' can only be updated to DEFAULT"
- **Root Cause**: Trying to UPDATE a GENERATED ALWAYS column
- **Solution**: Removed `hourly_wage` from updateProfile() payload
- Added real-time comma formatting to salary input (`handleSalaryChange()`)
- Fixed currency dropdown with ScrollView + `nestedScrollEnabled={true}`
- **Result**: Profile updates work without errors, hourly wage auto-calculates

**Optional Categories** (`src/components/calculator/RemindersModal.tsx`, `src/screens/LetMeThinkScreen.tsx` - UX IMPROVEMENT)
- Removed mandatory category validation (was forcing selection even when not relevant)
- Updated UI text: "Tag the item (optional)"
- Save logic: `categories: selectedTags.length > 0 ? selectedTags : undefined`
- **Result**: Better UX, users can skip irrelevant categorization

**Personality Test Retake** (`src/navigation/AppNavigator.tsx`, `src/screens/ProfileScreen.tsx` - NEW FEATURE)
- Added `Questionnaire: undefined` to RootStackParamList
- Created QuestionnaireWrapper component that:
  - Takes questionnaire answers
  - Calculates score
  - Updates Supabase user_profiles
  - Refreshes profile context
  - Navigates back to ProfileScreen
- Added "Retake" button in ProfileScreen with refresh icon
- **Result**: Users can retake personality test anytime from Profile screen

**Modal Dismissal Enhancement** (`src/screens/ProfileScreen.tsx`, `src/screens/HomeScreen.tsx` - UX IMPROVEMENT)
- Wrapped all modals with TouchableWithoutFeedback
- Tapping outside modal area now closes modal
- Applied to 4 modals total: Edit Profile, About, Privacy, Reminder Detail
- X button still works as fallback
- **Result**: More intuitive mobile UX

**Input Validation Consistency** (`src/screens/SpendingScreen.tsx`, `src/screens/LetMeThinkScreen.tsx` - CONSISTENCY FIX)
- Added `maxLength={15}` to item name inputs on both screens
- Added character counters: `{itemName.length}/15 characters`
- Updated placeholder text to shorter examples
- **Result**: Consistent 15-char limit prevents UI issues

**Keyboard Behavior Fix** (`src/screens/LetMeThinkScreen.tsx` - LAYOUT FIX)
- **Problem**: Editing item name then closing keyboard caused button clipping
- **Root Cause**: KeyboardAvoidingView with wrong behavior and structure
- **Solution**: Restructured layout:
  ```tsx
  <View style={styles.container}>
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
      style={styles.keyboardView}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Content */}
      </ScrollView>
      <View style={styles.buttonContainer}>
        {/* Buttons inside KeyboardAvoidingView prevents clipping */}
      </View>
    </KeyboardAvoidingView>
  </View>
  ```
- iOS uses 'padding' behavior, Android uses native handling (undefined)
- Buttons moved inside KeyboardAvoidingView
- **Result**: Smooth keyboard animation, no button clipping

**UI Clash Prevention** (`src/screens/HomeScreen.tsx` - POLISH)
- **Problem**: Long item names overlapped with time remaining badge
- **Root Cause**: Insufficient padding (32px) on reminderTitle
- **Solution**: Increased paddingRight from 32px to 68px
- Added `ellipsizeMode="tail"` to reminder title text
- **Result**: Guaranteed clearance for all time badge text ("2 days", "1 week", etc.)

**Time Display Consistency** (`src/utils/calculations.ts` - MINOR FIX)
- formatCompactHours now always shows hours format (never minutes)
- Consistent "0.0 hrs" format for values under 1 hour
- **Result**: No confusing "59m" displays

## Recent Changes (Phase 6: Currency Localization & UI Polish - COMPLETE)

**Currency Utility** (`src/utils/currency.ts` - NEW)
- Created getCurrencySymbol() to get symbol from currency code
- formatCurrencyWithCode() - formats amount with user's currency symbol
- formatCompactCurrencyWithCode() - compact format (K/M) with user's currency
- All currency displays now respect user's selected currency from profile

**Profile Screen Complete** (`src/screens/ProfileScreen.tsx` - MAJOR UPDATE)
- Complete profile management interface with modal-based editing
- Salary Information card displaying salary amount, type, hourly wage, currency, region
- Edit functionality with currency picker and salary type toggle
- Spending Personality display based on questionnaire score
- Lifetime Stats showing money saved, time saved, total decisions, counts by type
- Settings section with Privacy Policy and About modals
- Privacy Policy explains local-first storage approach
- Sign Out functionality moved to header (in AppNavigator)

**Navigation Updates** (`src/navigation/AppNavigator.tsx` - UPDATED)
- Added Sign Out button to Profile screen header (headerRight)
- Moved sign out logic to navigator for cleaner separation
- Home screen header hidden to allow custom header with logo

**Logo Component Live** (`src/components/shared/Logo.tsx` - ACTIVATED)
- Logo.png now integrated and displaying
- Removed placeholder emoji, now using actual logo
- Logo in HomeScreen header with "Save Up" text
- App icon, splash screen, and favicon updated in app.json
- App name changed from "save-up-temp" to "Save Up"
- Logo component ready for reuse in other screens (WelcomeScreen, AuthScreens, etc.)

**App Configuration Updated** (`app.json` - UPDATED)
- icon: Now points to `./assets/logo.png`
- splash image: Now points to `./assets/logo.png`
- adaptiveIcon foregroundImage: Now points to `./assets/logo.png`
- web favicon: Now points to `./assets/logo.png`
- App name: "Save Up"
- App slug: "save-up"

## Recent Changes (Phase 6: Currency Localization & UI Polish - COMPLETE)
- HomeScreen: All currency displays use formatCurrencyWithCode
- SpendingScreen: Currency symbol in price input uses getCurrencySymbol
- ResultsModal: Price and investment value use user's currency
- RemindersModal: Price summary uses user's currency  
- LetMeThinkScreen: Price summary uses user's currency
- SalaryInputScreen: Hourly wage display uses comma formatting

**Time Display Fix** (`src/utils/calculations.ts` - FIXED)
- formatCompactHours now always shows hours (0.0 hrs) instead of minutes
- Consistent "hrs" suffix for all time displays

## Recent Changes (Phase 5: Spending Calculator & Decision Tracking - COMPLETE)

**Spending Calculator Screen** (`src/screens/SpendingScreen.tsx` - NEW)
- Price input form with optional item name field
- Real-time display of user's hourly wage from ProfileContext
- Calculate button that validates input and shows preview
- Preview section displaying:
  - Item name
  - Price
  - Work hours required
  - Investment value in 10 years at 7% return
- Clear button to reset form (only visible when form has content)
- Responsive layout with Platform-specific bottom padding

**Results Modal** (`src/components/calculator/ResultsModal.tsx` - NEW)
- Bottom sheet modal displaying calculation results
- Item name and price header
- Two information cards:
  1. Work Hours Required (⏱) - Shows hours/minutes breakdown
  2. Investment Value (📈) - Shows 10-year compound interest value
- Reflection message: "Take a moment to decide: Is this worth your time and future?"
- Three decision buttons:
  1. **Buy** (Teal #2ec4b6) - Acknowledges purchase, closes modal
  2. **Don't Buy** (Red #e71d36) - Decides against purchase, clears form
  3. **Let Me Think** (Outline teal) - Opens RemindersModal for deferred decision

**Reminders Modal (Let Me Think Form)** (`src/components/calculator/RemindersModal.tsx` - NEW)
- Timer selection section with 4 chip options: 24 hours, 48 hours, 72 hours, 1 week
- Item name input ("Thinking on") with helper text
- Shopping category tags (12 categories in chip form):
  - Electronics, Fashion, Home & Garden, Sports & Outdoors, Books
  - Beauty & Personal Care, Food & Grocery, Entertainment, Toys & Games
  - Automotive, Health & Wellness, Office Supplies
- Multiple tag selection (user can select 1+ categories)
- Summary section showing selected options
- Form validation (item name required, at least one category required)
- Save button that:
  - Saves decision to AsyncStorage with ISO timestamp
  - Syncs stats to Supabase
  - Refreshes user profile
  - Clears calculator form
- Cancel button returns without saving

## Phase 4 Changes (Home Screen Dashboard & UI Redesign)

**Database Schema Extended**
- Created `dbscripts/04_spending_decisions.sql`
- Added 7 stats columns to user_profiles table for aggregation

**DecisionStorage Utility** (`src/utils/decisionStorage.ts`)
- AsyncStorage CRUD operations for spending decisions (local-first pattern)
- Privacy-focused: decisions stay on device, only stats sync to Supabase

**ProfileContext** (`src/contexts/ProfileContext.tsx`)
- Global user profile data management
- `useProfile()` hook for profile data access

**Saving Tips Constants** (`src/constants/savingTips.ts`)
- 20 curated money-saving tips for Home Screen carousel

**Home Screen Complete Redesign** (`src/screens/HomeScreen.tsx`)
- Dashboard with 3 horizontal-scrolling carousels
- Stats, Reminders with timers, Money Tips
- Pull-to-refresh functionality

**AppNavigator UI Polish** (`src/navigation/AppNavigator.tsx`)
- White headers with dark text (professional aesthetic)
- Ionicons for tab navigation
- Proper responsive padding

**Database Schema Extended**
- Created `dbscripts/04_spending_decisions.sql`
- Added 7 stats columns to user_profiles table:
  - `total_money_saved` (DECIMAL)
  - `total_hours_saved` (DECIMAL)
  - `total_decisions` (INTEGER)
  - `buy_count`, `dont_buy_count`, `save_count`, `let_me_think_count` (all INTEGER)
- Stats aggregated from local decisions, synced to cloud for backup

**DecisionStorage Utility** (`src/utils/decisionStorage.ts` - NEW)
- AsyncStorage CRUD operations for spending decisions (local-first pattern)
- `loadDecisions()`, `saveDecision()`, `updateDecision()`, `deleteDecision()`
- `getActiveReminders()` - filters "let_me_think" decisions by reminder date
- `calculateStats(decisions)` → DecisionStats with all counters
- `getStats()` and `syncStatsToSupabase()` for cloud backup
- Privacy-focused: decisions stay on device, only stats sync to Supabase

**ProfileContext** (`src/contexts/ProfileContext.tsx` - NEW)
- Global user profile data management
- `useProfile()` hook returns: profile, loading, error, refreshProfile(), updateProfile()
- Fetches from user_profiles table on mount
- Gracefully handles missing profiles for new users (`.maybeSingle()` pattern)
- useCallback optimization for all functions
- Integrated into App.tsx as ProfileProvider wrapper

**Saving Tips Constants** (`src/constants/savingTips.ts` - NEW)
- 20 curated money-saving tips for Home Screen carousel
- SavingTip interface (id, title, tip, emoji)
- getRandomTip() and getTipById() helper functions
- Topics: 24-hour rule, automate savings, 50/30/20 rule, meal prep, etc.

**Home Screen Complete Redesign** (`src/screens/HomeScreen.tsx` - MAJOR UPDATE)
- Dashboard with 3 horizontal-scrolling carousels:
  1. **Stats Carousel**: 4 cards (140px width each)
     - Money Saved (💰)
     - Time Saved (⏱)
     - Smart Choices count
     - Total Decisions count
  2. **Reminders Carousel**: Active "Let Me Think" items (180px width each)
     - Item name, price, work hours required
     - Countdown timer showing hours/minutes/days remaining
  3. **Money Tips Carousel**: 10 saving tips (280px × 170px each)
     - Title, tip text, emoji container
     - Horizontally scrollable, all tips accessible
- Empty state for new users with no decisions
- Pull-to-refresh functionality
- Platform-specific bottom padding (120px iOS, 100px Android) to not hide behind expanded navbar
- ProfileContext integration

**AppNavigator UI Polish** (`src/navigation/AppNavigator.tsx` - UPDATED)
- Changed from dark headers to white background with dark text (professional aesthetic)
- Replaced emoji tab icons with Ionicons (home, calculator, person)
- Tab labels: Home, Spending, Profile
- NavBar final dimensions:
  - **iOS**: height 95px, paddingBottom 30px (accounts for home indicator)
  - **Android**: height 75px, paddingBottom 15px
- White background with subtle top border (#f0f0f0)

**Config Extended** (`src/config/supabase.ts` - UPDATED)
- Added DecisionType = 'buy' | 'dont_buy' | 'save' | 'let_me_think'
- Added SpendingDecision interface for local storage format
- Extended UserProfile with 7 new stats columns

**App.tsx** (`App.tsx` - UPDATED)
- Wrapped app with ProfileProvider for global profile context
- Maintained existing onboarding status checking
- Preserved global refresh trigger pattern

## Next Steps

### Immediate Actions (Phase 10: Production Build & Testing) - NEXT

**Run Database Migration** (HIGH PRIORITY - FIRST)
1. Open Supabase SQL Editor
2. Execute dbscripts/add_notification_preferences.sql
3. Verify enable_engagement_notifications column added to user_profiles

**Build Production APK** (HIGH PRIORITY - NEXT)
1. Run `eas build --platform android --profile production`
2. Wait for build to complete on EAS servers
3. Download APK and test on physical device
4. Verify all navigation flows work correctly
5. Test notification system end-to-end

### Testing Actions (After Build) - NEXT PRIORITY

1. **Notification System Testing** (HIGH PRIORITY)
   - Run database migration in Supabase
   - Create "Let Me Think" reminder with 1-minute timer
   - Wait for notification to appear
   - Tap notification, verify app opens to reminder
   - Make decision, verify notification cancels
   - Enable engagement notifications in Profile
   - Verify notifications scheduled (check device settings)
   - Disable engagement notifications
   - Verify notifications cancelled
   - **Validates**: Notification scheduling, cancellation, user control

2. **Navigation Bar Testing** (HIGH PRIORITY)
   - Test on device with button navigation (3 buttons)
   - Test on device with gesture navigation (swipe bar)
   - Verify tab bar buttons fully visible and tappable
   - Verify no content hidden behind system UI
   - Test on different screen sizes if possible
   - **Validates**: SafeAreaProvider integration, dynamic insets

3. **Multi-Account Testing** (CRITICAL)
   - Create 2+ accounts on same device
   - Make decisions on Account A
   - Switch to Account B, verify Account B sees only their data
   - Switch back to Account A, verify data persists
   - Test stats consistency after app restart
   - **Validates**: User-scoped storage fix

2. **Stats Verification** (HIGH PRIORITY)
   - Make decisions (buy, don't buy, save, let me think)
   - Check HomeScreen stats vs ProfileScreen stats (should match exactly)
   - Refresh app, verify stats persist correctly
   - **Validates**: Stats unification fix

3. **Personality Test Retake Flow** (HIGH PRIORITY)
   - Navigate to Profile → Tap "Retake" button
   - Complete questionnaire
   - Verify modal closes automatically
   - Verify ProfileScreen shows updated personality type
   - Check Supabase user_profiles.questionnaire_score updated
   - **Validates**: Navigation expansion and retake flow

4. **Input Validation Testing** (MEDIUM PRIORITY)
   - SpendingScreen: Try entering 20-char item name (should stop at 15)
   - LetMeThinkScreen: Same test
   - Verify character counters update correctly
   - Test with emojis and special characters
   - **Validates**: maxLength consistency

5. **Keyboard Behavior Testing** (MEDIUM PRIORITY)
   - LetMeThinkScreen: Focus item name input, enter text, dismiss keyboard
   - Verify Save/Cancel buttons visible and not clipped
   - Test on both iOS and Android
   - **Validates**: KeyboardAvoidingView restructure

6. **UI Clash Testing** (LOW PRIORITY)
   - Create reminder with 15-char item name
   - Set various time periods (24h, 48h, 72h, 1 week)
   - Verify item name never overlaps time badge
   - Test on different screen sizes if possible
   - **Validates**: Padding increase fix

7. **Modal Dismissal Testing** (LOW PRIORITY)
   - ProfileScreen: Open Edit/About/Privacy modals, tap outside → should close
   - HomeScreen: Open reminder detail, tap outside → should close
   - Verify X button still works on all modals
   - **Validates**: TouchableWithoutFeedback implementation

### Optional Enhancements (Post-MVP)
   - Add logo to Welcome/Onboarding screens
   - Add logo to Login/Signup screens
   - Add animations/transitions for personality test score change
   - Add haptic feedback for decisions
   - Add loading states to retake questionnaire flow
   - Add confirmation dialog before discarding partial retake
   - Add "What's New" section to About modal
   - Add data export feature (CSV of all decisions)

### Deployment Preparation (After Testing Complete)
   - Create app store listing
   - Generate app screenshots
   - Test Google OAuth (optional for MVP)
   - Prepare privacy policy link
   - Build production APK/IPA with EAS

### Completed (Phases 1-6) ✅

1. **Build Spending Calculator Screen** (SpendingScreen.tsx) ✅
   - Create price input form with optional item name field
   - Add currency symbol display and formatting
   - Implement "Calculate" button
   - Real-time calculation preview of work hours and investment value
   - Input validation (positive numbers only)

2. **Create Results Modal/BottomSheet**
   - Show calculation results with:
     - Work hours required (formatted as hours + minutes)
     - Investment value in 10 years at 7% return
   - Display original item price and currency
   - Add 4 decision buttons:
     - Buy (record decision, return to calculator)
     - Don't Buy (record decision, show savings celebration)
     - Save (record decision, show commitment message)
     - Let Me Think (show date/time picker for reminder, save with remind_at)
   - Smooth appear animation

3. **Implement Decision Tracking**
   - Connect modal buttons to decisionStorage.saveDecision()
   - Calculate work_hours and investment_value on the fly
   - Update local AsyncStorage immediately
   - Trigger background sync to Supabase via syncStatsToSupabase()
   - Refresh Home Screen stats after decision saved
   - Show confirmation toast/feedback

4. **Build Profile Screen** (ProfileScreen.tsx) ✅
   - ✅ Display current salary, currency, region
   - ✅ Show hourly wage calculation
   - ✅ Add "Edit Profile" functionality with modal
   - ✅ Show questionnaire results (spending personality)
   - ✅ Display lifetime stats from user_profiles
   - ✅ Add logout button in header
   - ✅ Edit modal with currency picker and salary type toggle
   - ✅ Privacy Policy and About modals

### Phase 6: Currency Localization & UI Polish ✅
5. **Currency Localization** ✅
   - ✅ Created currency utility functions
   - ✅ Updated all money displays to use user's currency
   - ✅ Fixed currency symbol display in price inputs
   - ✅ All formatting uses comma separators (2,000.00)

6. **UI/UX Refinements** ✅
   - ✅ Sign Out moved to Profile header
   - ✅ Logo component created and integrated
   - ✅ Logo.png now active and displaying
   - ✅ App configuration updated with logo
   - ✅ Time display fixed (always shows hours)
   - ✅ Number formatting consistent throughout app

6. **Add Google OAuth** (Optional for MVP)
   - Configure Google OAuth in Supabase
   - Add Google sign-in button to auth screens
   - Test OAuth flow

7. **Testing & Bug Fixes**
   - Test all flows end-to-end
   - Test on iOS and Android
   - Fix edge cases
   - Performance optimization

8. **Documentation**
   - Update README with setup instructions
   - Add screenshots
   - Document environment setup

## Active Decisions & Considerations

### Architecture Decisions Made
- ✅ Using Expo for easier development and deployment
- ✅ Supabase for backend (Auth + Database)
- ✅ React Navigation with bottom tabs
- ✅ Client-side calculations for instant results
- ✅ Context API for state management (no Redux needed)
- ✅ **TypeScript in strict mode** (user preference)
- ✅ Investment calculation: 7% annual return over 10 years (simple compound)

### Resolved Decisions
- [x] Whether to track decision history in MVP - **YES, required for Home Screen stats**
- [x] Should user set salary immediately after signup, or allow skip? - **Required during onboarding**
- [x] Display format for hourly wage - **Per hour with comma formatting**
- [x] How long should "Let Me Think" timers default to? - **User choice: 24h, 48h, 72h, 1 week**
- [x] How many saving tips to include? - **20 tips in constants file**
- [x] Should we show empty state on Home Screen? - **YES, shows for new users**
- [x] Should categories be mandatory? - **NO, made optional for better UX**
- [x] Item name length limit? - **15 characters across all screens**
- [x] How to handle cross-account data? - **User-scoped AsyncStorage keys**
- [x] Stats single source of truth? - **Supabase user_profiles table**
- [x] Can personality test be retaken? - **YES, via Profile screen button**

### Pending Decisions (Deferred to Post-MVP)
- [ ] Should questionnaire retake require confirmation dialog?
- [ ] Should old personality type be shown during retake?
- [ ] Add loading indicators for stats sync?
- [ ] Should categories be editable after creation?
- [ ] Error tracking/analytics tools?
- [ ] Testing framework implementation?
- [ ] Dark mode support?

## Important Patterns & Preferences

### Code Style
- **TypeScript strict mode** - All files properly typed
- Use functional components with `React.FC` type
- Keep components small and focused
- Separate business logic from UI
- Use custom hooks for shared logic
- Export types alongside constants (e.g., `SalaryType`, `DecisionType`)
- Use `useRef` for values needed in closures (e.g., PanResponder)
- Wrap sections in View components with consistent styling

### File Organization
- Group by feature/domain in `src/` directory
- All React components use `.tsx` extension
- All utilities/configs use `.ts` extension
- Type definitions exported from same file as implementation
- Keep screens simple (delegate to components)
- Onboarding screens in `src/screens/onboarding/` subdirectory
- Home/Spending/Profile screens in `src/screens/` root

### UI/Design System Update (Phase 4)
- **Headers**: White background (#fdfffc) with dark text (#011627) - professional look
- **NavBar**: White background with subtle border, Ionicons for tab icons (no emojis)
- **Cards**: Horizontally scrollable with fixed widths, proper spacing
- **Responsive Padding**: Platform-specific bottom padding to account for navbar size
- **Emojis**: Reduced usage - only for decorative containers (tips, stats), not in headers/buttons

### Carousel Pattern (NEW in Phase 4)
- Use ScrollView with horizontal={true}
- Set showsHorizontalScrollIndicator={false}
- Fixed-width items for snap-to-item feel
- Add gap spacing between items
- Container with fixed height prevents layout issues
- Use Platform.OS to adjust padding for iOS vs Android

### Async Storage Pattern (NEW in Phase 4)
- Local-first: decisions stored on device via AsyncStorage
- Stats calculated locally from decisions
- Background sync to Supabase for backup (not blocking UI)
- Use .maybeSingle() for Supabase queries that might not exist

### ProfileContext Pattern (NEW in Phase 4)
- useProfile() hook returns profile data + loading/error states
- Refresh functions for manual updates
- useCallback for optimization
- Provider wraps entire app in App.tsx
- Automatic fetch on component mount

## Learnings & Project Insights

### Key Insights (Phases 3-7)
1. **Simplicity is Core**: The app's power comes from its simplicity - one input, instant results, clear actions
2. **Mobile-First**: Users will use this in real-time shopping decisions, so speed and clarity are critical
3. **Non-Judgmental Design**: The app provides perspective, not prescription - users stay in control
4. **Personal Context Matters**: All calculations are relative to individual salary, making it personally meaningful
5. **Friendly UI Matters**: White headers + reduced emojis + professional icons = more trustworthy app
6. **Responsive Design is Critical**: Platform-specific padding prevents content from hiding behind navbar

### Technical Insights
1. **TypeScript Benefits**: Strict typing catches errors early and improves code quality
2. **Expo Advantage**: Faster iteration and easier OAuth setup justify using Expo over bare React Native
3. **Supabase Benefits**: Built-in auth and database with minimal setup time
4. **Calculation Strategy**: Client-side math eliminates latency and enables offline use
5. **Navigation Pattern**: Bottom tabs are perfect for this flat, three-section structure
6. **Type-Safe Navigation**: Using typed param lists prevents navigation errors
7. **Local-First Architecture**: AsyncStorage for privacy + Supabase sync for backup creates best of both worlds
8. **Horizontal Carousels**: ScrollView with fixed-width items provides modern, swipeable interface
9. **Platform Differences**: iOS and Android require different padding for same visual result

### Onboarding Implementation Insights (Phase 3)
1. **PanResponder Closure Issue**: Event handlers capture initial state values. Solution: Use `useRef` for mutable values, sync with state via `useEffect`
2. **Real-time Limitations**: Supabase real-time subscriptions have latency. For critical navigation, use manual refresh triggers via exported refs
3. **Keyboard UX Critical**: Always test forms on both platforms. iOS and Android require different `KeyboardAvoidingView` behaviors
4. **Swipe Gesture Tuning**: 25% screen width threshold provides good balance - responsive but not overly sensitive
5. **Visual Hierarchy Matters**: Less clutter = better UX. Show feedback via background overlays instead of text over content
6. **Animation Timing**: Small delays (150-300ms) between actions feel more natural than instant transitions
7. **Real-time Calculations Win**: Users love seeing hourly wage update as they type - instant feedback is powerful
8. **Educational UI Builds Trust**: Info buttons explaining calculations increase user confidence
9. **Graceful Degradation**: Use `.maybeSingle()` instead of `.single()` when records might not exist yet

### Home Screen Implementation Insights (Phase 4)
1. **Horizontal Carousels over Grids**: Swipeable cards feel more modern and engaging than static grids
2. **Platform-Specific Dimensions Matter**: Each iOS/Android needs tuned navbar height and bottom padding for proper visual spacing
3. **Fixed Container Heights Prevent Clipping**: Setting carouselContainer height prevents top/bottom cards from being cut off
4. **LocalStorage + Cloud Sync**: Combining AsyncStorage for privacy with Supabase stats provides user trust and backup
5. **Empty States Improve UX**: New users with no decisions need guidance, not blank screens
6. **Pull-to-Refresh Expected Pattern**: Mobile users expect this on dashboards to see updated data
7. **Countdown Timers Create Engagement**: "Let Me Think" reminders with live timers motivate users to return to app
8. **Rotating Tips Provide Value**: Educational tips on Home Screen add value beyond calculator

### Navigation Architecture Insights (Phase 8)
1. **Screen Name Conflicts Are Critical**: When navigators can switch between each other, screen names MUST be unique
2. **React Navigation Preserves Routes**: If a route key exists in old navigator and matches name in new navigator, it will be reused
3. **Explicit Initial Routes Prevent Ambiguity**: Always set initialRouteName on navigators to control entry point
4. **Navigator Keys Force Remounts**: Adding unique React keys to navigators ensures clean state on switch
5. **Debug Logs Should Be Minimal in Production**: Only keep error logs, remove informational logs before build
6. **Require Cycles Can Hide**: Extract shared refs/constants to utilities to break circular dependencies

### Bug Fixes & Architecture Insights (Phase 7)
1. **User-Scoped Storage is Critical**: Shared AsyncStorage keys cause security vulnerabilities - always scope by user ID
2. **Single Source of Truth Prevents Confusion**: Stats should come from one place (Supabase), not calculated in multiple locations
3. **Generated Columns Can't Be Updated**: Database GENERATED ALWAYS columns must be excluded from UPDATE statements
4. **Optional Fields Improve UX**: Making categories optional reduces friction without losing functionality
5. **Keyboard Behavior Varies by Platform**: iOS needs 'padding' behavior, Android works better with native handling
6. **Generous Padding Prevents UI Clashes**: Dynamic content (time badges) needs extra space - 68px vs 32px made the difference
7. **Consistent Input Validation Matters**: Same limits (15 chars) across all screens prevents edge case bugs
8. **Modal Dismissal is Expected**: Users expect to close modals by tapping outside on mobile
9. **Navigation Must Be Complete**: Adding screens to navigator enables deep linking and proper flow management
10. **Real-time Formatting Builds Trust**: Seeing commas appear as you type salary makes app feel polished

## Questions to Address Later
- Should we add purchase history tracking?
- How to handle multiple income sources?
- Should investment calculations be customizable?
- Do we need dark mode?
- Should we add notification reminders for "Let Me Think" items?

## Dependencies on External Factors
- Supabase project must be created before development begins
- Google OAuth requires Google Cloud Console configuration
- Testing on iOS requires macOS or TestFlight
- App Store deployment requires Apple Developer account ($99/year)
- Google Play deployment requires Google Play Developer account ($25 one-time)

## Current Blockers
- **None** - Authentication working, ready for profile and calculator features

## Notes for Future Sessions
- Remember: This is an MVP - focus on core calculator functionality first
- Don't over-engineer the investment calculations - simple compound interest is fine
- User experience matters more than feature completeness
- Test calculator logic thoroughly with edge cases
- Keep the Memory Bank updated as patterns emerge during implementation
