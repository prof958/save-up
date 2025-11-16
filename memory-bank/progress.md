# Progress: Save Up

## Project Status: MVP Feature Complete - Ready for Production Build

**Current Phase**: Phase 9 Complete - Notifications & Navigation Bar ✅
**Next Phase**: Phase 10 - Production Build & Testing
**Last Updated**: 2025-11-16
**Overall Progress**: 99% (All features complete, notifications added, navigation bar fixed, database migration pending)

## What Works
✅ **Memory Bank Created**
- Complete project documentation structure
- Clear requirements and technical specifications
- Architecture and patterns defined

✅ **Expo Project with TypeScript**
- Expo 54 initialized and running
- TypeScript configured in strict mode
- All dependencies installed

✅ **Project Structure**
- Complete folder structure created
- Proper organization by feature/domain
- TypeScript files with proper extensions

✅ **Navigation System**
- React Navigation with bottom tabs
- Three main screens (Home, Spending, Profile)
- Type-safe navigation with `RootTabParamList`
- Working placeholder screens

✅ **Calculation Utilities**
- `calculateHourlyWage()` - Fully typed and tested logic
- `calculateWorkHours()` - Converts price to work hours
- `calculateInvestmentValue()` - Compound interest calculation
- `formatCurrency()` and `formatHours()` - Display helpers
- All functions in TypeScript with proper types

✅ **Constants & Types**
- Salary type constants and types
- Decision type constants and types
- Calculation constants (weeks, hours, rates)

✅ **Design System**
- Color palette documented (4 main colors)
- Theme constants file created (`src/constants/theme.ts`)
- Spacing, typography, and styling system defined
- Applied consistently across all screens

✅ **Supabase Backend**
- Project created and configured
- Environment variables set up
- Supabase client initialized with TypeScript types
- Database table created (user_profiles)
- Row Level Security policies in place
- Email confirmation disabled for development

✅ **Authentication System**
- AuthContext with full type safety
- Login screen with theme styling
- Signup screen with validation
- Auth state management working
- Session persistence enabled
- Conditional navigation (auth vs app)
- Successfully tested with real user signup/login

✅ **Onboarding Flow (Phase 3)**
- **WelcomeScreen**: Feature introduction with emoji, benefits list, continue button
- **SalaryInputScreen**: Complete form with:
  - 13 region options and 10 currency options
  - Real-time hourly wage calculation (salary × 12 / 2080 hours)
  - Animated hourly wage display with compact layout
  - KeyboardAvoidingView for iOS/Android
  - Info modal explaining calculation formula
  - Auto-currency selection based on region
- **QuestionnaireScreen**: 7-question spending personality assessment with:
  - Intro loading screen with animated dots
  - PanResponder-based swipe gestures (25% threshold)
  - Fade and scale animations between questions
  - Background overlays showing YES/NO feedback
  - Progress bar showing current question
  - Fixed closure bug using refs for mutable state
- **ResultsScreen**: Personalized feedback with:
  - Score display (0-7 range)
  - Three spending types: Mindful Spender (0-2), Occasional Impulse Buyer (3), Impulsive Spender (4+)
  - Emoji indicators and actionable advice
  - Loading state during profile save
- **OnboardingNavigator**: Stack navigation with:
  - Data flow management between screens
  - Profile creation/update logic
  - Global refresh trigger integration
  - Score calculation (sum of YES answers)
- **Database Schema Extension**:
  - Added 5 columns to user_profiles: currency, region, questionnaire_score, questionnaire_answers (JSONB), onboarding_completed
  - Created index on onboarding_completed
  - Successfully executed in Supabase
- **Global Navigation Pattern**:
  - Exported refresh trigger ref from App.tsx
  - Manual refresh after onboarding saves data
  - Conditional routing: Auth → Onboarding → App
  - Uses .maybeSingle() to handle missing profiles gracefully

✅ **Home Screen Dashboard (Phase 4) - NEW**
- **Horizontal Carousels**: 3 separate scrollable card sections
  - **Stats Carousel** (4 cards × 140px width):
    - Money Saved display with currency symbol
    - Time Saved display in hours
    - Smart Choices count
    - Total Decisions count
  - **Reminders Carousel** (variable items × 180px width):
    - Active "Let Me Think" items with countdown timers
    - Shows item name, price, work hours required
    - Time badge showing hours/minutes/days remaining
  - **Money Tips Carousel** (10 tips × 280px width):
    - Saving tips from constants (e.g., 24-hour rule, automate savings)
    - Each card shows title, tip text, emoji icon
- **Empty State**: Messaging for new users with no decisions yet
- **Pull-to-Refresh**: Reloads stats and reminders on swipe
- **Responsive Design**:
  - Platform-specific bottom padding (120px iOS, 100px Android) to not hide behind navbar
  - Proper ScrollView contentContainerStyle with gap spacing
  - Fixed-height carouselContainer prevents top/bottom clipping
- **ProfileContext Integration**: Shows user's spending personality

✅ **DecisionStorage Utility (Phase 4) - NEW**
- AsyncStorage CRUD operations for spending decisions (local-first pattern)
- `loadDecisions()`, `saveDecision()`, `updateDecision()`, `deleteDecision()`
- `getActiveReminders()` - filters "let_me_think" decisions by reminder date
- `calculateStats(decisions)` → DecisionStats with all counters
- `getStats()` and `syncStatsToSupabase()` for cloud backup
- Privacy-focused: decisions stay on device, only aggregates sync to cloud

✅ **ProfileContext (Phase 4) - NEW**
- Global user profile data management
- `useProfile()` hook returns: profile, loading, error, refreshProfile(), updateProfile()
- Fetches from user_profiles table on component mount
- Gracefully handles missing profiles for new users
- useCallback optimization for all functions
- Integrated into App.tsx as ProfileProvider wrapper

✅ **UI Redesign to Friendly & Professional (Phase 4)**
- Headers changed from dark to white background (#fdfffc) with dark text
- Reduced emoji usage (kept only as decorative icons in containers)
- NavBar updated with Ionicons (home, calculator, person icons instead of emojis)
- Tab labels: Home, Spending, Profile
- NavBar dimensions (final):
  - iOS: height 95px, paddingBottom 30px
  - Android: height 75px, paddingBottom 15px
- All cards use horizontally scrollable carousels (swipe-friendly)

✅ **Saving Tips Constants (Phase 4) - NEW**
- 20 curated money-saving tips for Home Screen carousel
- SavingTip interface (id, title, tip, emoji)
- Helper functions: getRandomTip(), getTipById(id)

✅ **Spending Calculator Screen (Phase 5) - NEW**
- Price input form with optional item name field
- Real-time hourly wage display from ProfileContext
- Calculate button with input validation
- Preview section showing calculated work hours and investment value
- Clear button to reset form
- Responsive design with Platform-specific padding

✅ **Results Modal (Phase 5) - NEW**
- Bottom sheet modal showing calculation results
- Work Hours Required card (⏱)
- Investment Value card (📈) - 10 years at 7% annual return
- Reflection message promoting mindful decision-making
- Three decision buttons:
  - Buy (Teal) - Closes modal
  - Don't Buy (Red) - Clears form
  - Let Me Think (Outline) - Opens RemindersModal

✅ **Reminders Modal (Phase 5) - NEW**
- Timer selection section with 4 chip options:
  - 24 hours, 48 hours, 72 hours, 1 week
- Item name input ("Thinking on") with helper text
- Shopping category tags (12 categories in chip form):
  - Electronics, Fashion, Home & Garden, Sports & Outdoors, Books
  - Beauty & Personal Care, Food & Grocery, Entertainment, Toys & Games
  - Automotive, Health & Wellness, Office Supplies
- Summary section displaying selected options
- Form validation (item name required, categories optional - Phase 7 update)
- Save button that:
  - Saves decision to AsyncStorage with ISO timestamp (user-scoped key - Phase 7)
  - Syncs stats to Supabase
  - Refreshes user profile
  - Clears calculator
- Cancel button returns without saving

✅ **Profile Screen Complete (Phase 6) - NEW**
- Complete profile management interface with modal-based editing
- Salary Information card displaying salary amount, type, hourly wage, currency, region
- Edit functionality with currency picker and salary type toggle
- Real-time comma formatting for salary input (Phase 7)
- Currency dropdown fixed with nestedScrollEnabled (Phase 7)
- Spending Personality display based on questionnaire score
- "Retake" button for personality test with full navigation flow (Phase 7)
- Lifetime Stats showing money saved, time saved, total decisions, counts by type
- Stats now match HomeScreen exactly (single source of truth - Phase 7)
- Settings section with Privacy Policy and About modals
- Privacy Policy explains local-first storage approach
- All modals support tap-outside-to-close (Phase 7)
- Sign Out functionality in header (AppNavigator)

✅ **Currency Localization Complete (Phase 6) - NEW**
- Created currency utility functions (getCurrencySymbol, formatCurrencyWithCode)
- All money displays use user's selected currency from profile
- Currency symbol in price inputs matches user's currency
- Comma formatting for all large numbers (2,000.00)
- Compact currency format for large values ($1.5K instead of $1,500.00)

✅ **Logo Integration Complete (Phase 6) - NEW**
- Logo component created and displaying actual logo.png
- Logo in HomeScreen header with "Save Up" text
- App configuration updated (icon, splash, favicon all use logo.png)
- App name changed from "save-up-temp" to "Save Up"

✅ **Phase 7 Critical Fixes - NEW**
- **User-Scoped Storage**: AsyncStorage keys now user-specific (`@save_up_decisions_{user_id}`)
  - Prevents cross-account data leakage
  - Complete data isolation between users
  - Added getStorageKey() function to decisionStorage.ts
- **Stats Unification**: HomeScreen and ProfileScreen now use same data source (Supabase)
  - Removed local stats calculations from HomeScreen
  - Single source of truth: user_profiles table
  - Perfect consistency across all screens
- **Generated Column Fix**: Removed hourly_wage from profile updates
  - Fixed ERROR "Column 'hourly_wage' can only be updated to DEFAULT"
  - Auto-calculation works correctly in Supabase
- **Optional Categories**: Made category tagging optional in RemindersModal and LetMeThinkScreen
  - Removed mandatory validation
  - Updated UI text to indicate optional
  - Better UX for users
- **Personality Test Retake**: Full navigation flow from ProfileScreen
  - Added Questionnaire to AppNavigator with wrapper component
  - Fixed navigation error
  - Updates Supabase and refreshes profile on completion
- **Modal Dismissal**: TouchableWithoutFeedback on all modals (4 total)
  - Tap outside modal to close
  - More intuitive mobile UX
- **Input Validation Consistency**: 15-character limit on all item name inputs
  - SpendingScreen and LetMeThinkScreen both enforce maxLength={15}
  - Character counters show remaining characters
- **Keyboard Behavior Fix**: Restructured LetMeThinkScreen KeyboardAvoidingView
  - iOS uses 'padding' behavior, Android uses native handling
  - Buttons moved inside KeyboardAvoidingView
  - No more button clipping when keyboard dismisses
- **UI Clash Prevention**: Increased padding on reminder titles
  - Changed from 32px to 68px paddingRight
  - Prevents item names from overlapping time badges
  - Added ellipsizeMode="tail" for text truncation

## What's Left to Build

### Phase 1: Foundation ✅ COMPLETE
- [x] Initialize Expo project
- [x] Convert to TypeScript with strict mode
- [x] Set up project folder structure
- [x] Install and configure dependencies
- [x] Create basic navigation structure (Tab Navigator)
- [x] Build placeholder screens (Home, Spending, Profile)
- [x] Implement calculation utilities (typed)
- [x] Create constants with type exports
- [x] Create README documentation
- [ ] Create Supabase project - **MOVED TO PHASE 2**
- [ ] Configure Supabase authentication - **MOVED TO PHASE 2**
- [ ] Set up database schema - **MOVED TO PHASE 2**
- [ ] Add environment variables - **MOVED TO PHASE 2**

**Actual Time**: ~2 hours (including TypeScript conversion)

### Phase 2: Supabase & Authentication ✅ COMPLETE
- [x] Create Supabase project and get credentials
- [x] Create .env file with Supabase keys
- [x] Create src/config/supabase.ts with TypeScript types
- [x] Create database schema (user_profiles table)
- [x] Run SQL script in Supabase dashboard
- [x] Build LoginScreen.tsx UI with theme
- [x] Build SignupScreen.tsx UI with validation
- [x] Create AuthContext.tsx with TypeScript types
- [x] Integrate Supabase email auth
- [x] Add protected route logic to navigation
- [x] Fix NavigationContainer structure
- [x] Handle auth errors with proper typing
- [x] Disable email confirmation for development
- [x] Test login/signup flows - VERIFIED WORKING ✅

**Actual Time**: ~3 hours (including debugging navigation issue)

### Phase 3: Onboarding Flow ✅ COMPLETE
- [x] Create WelcomeScreen with features list
- [x] Build SalaryInputScreen with region/currency pickers
- [x] Implement real-time hourly wage calculation
- [x] Add KeyboardAvoidingView for form inputs
- [x] Create QuestionnaireScreen with swipe gestures
- [x] Implement PanResponder for YES/NO swipes
- [x] Add animations (fade, scale) between questions
- [x] Create ResultsScreen with personalized feedback
- [x] Build OnboardingNavigator for data flow
- [x] Extend database schema (5 new columns)
- [x] Implement global refresh trigger pattern
- [x] Add intro loading screen to questionnaire
- [x] Add info modal explaining hourly wage calculation
- [x] Fix PanResponder closure bug with refs
- [x] Fix keyboard blocking UI issues
- [x] Polish animations and compact layout
- [x] Test complete onboarding flow end-to-end

**Actual Time**: ~6 hours (including bug fixes and UX polish)

### Phase 4: Core App Screens ✅ COMPLETE

**Home Screen** ✅ COMPLETE
- [x] Create ProfileContext for global user data
- [x] Implement useProfile hook to fetch from Supabase
- [x] Build HomeScreen displaying hourly wage
- [x] Create horizontal scrollable carousels for stats, reminders, tips
- [x] Implement countdown timers for "Let Me Think" items
- [x] Add pull-to-refresh functionality
- [x] Handle empty state for new users
- [x] Polish responsive padding for iOS/Android

**Spending Calculator** ✅ COMPLETE
- [x] Build SpendingScreen UI
- [x] Create price input form
- [x] Implement work hours calculation (using user's hourly wage)
- [x] Implement investment calculation (7% over 10 years)
- [x] Build results modal/sheet with animations
- [x] Add decision buttons (Buy/Don't Buy/Let Me Think)
- [x] Create RemindersModal with timer chips and category tags
- [x] Add form validation

**Profile Screen** ✅ COMPLETE
- [x] Display current salary, currency, region
- [x] Show hourly wage calculation
- [x] Add "Edit Profile" functionality
- [x] Show questionnaire results with option to retake
- [x] Add logout button

**Actual Time Spent**: ~12 hours (database, contexts, home screen, spending calculator, profile screen phases)

### Phase 5: Spending Calculator & Decision Tracking ✅ COMPLETE
- [x] Build SpendingScreen with price input and preview
- [x] Create ResultsModal with work hours and investment displays
- [x] Add three decision buttons (Buy, Don't Buy, Let Me Think)
- [x] Create RemindersModal with timer selection and category tags
- [x] Integrate with AsyncStorage via decisionStorage
- [x] Sync stats to Supabase after decisions
- [x] Form validation and error handling

**Actual Time Spent**: ~4 hours

### Phase 6: Currency Localization & UI Polish ✅ COMPLETE
- [x] Create currency utility functions
- [x] Update all money displays to use user's currency
- [x] Build complete ProfileScreen with edit functionality
- [x] Add personality test retake button
- [x] Integrate logo.png across app
- [x] Update app.json with logo assets
- [x] Fix time display formatting
- [x] Add Sign Out to Profile header

**Actual Time Spent**: ~3 hours

### Phase 8: Navigation Fix & Code Cleanup ✅ COMPLETE
- [x] Fix onboarding → home navigation bug (screen name conflict)
- [x] Rename AppNavigator Questionnaire → RetakeQuestionnaire
- [x] Add explicit initialRouteName to all navigators
- [x] Add unique React keys to navigators for clean remounts
- [x] Extract onboardingRefreshTrigger to utility file (break require cycle)
- [x] Remove all debug console.log statements
- [x] Keep only essential error logs

**Actual Time Spent**: ~2 hours

### Phase 9: Notifications & Navigation Bar ✅ COMPLETE
- [x] Install expo-notifications and expo-device packages
- [x] Create notification service utility with channels and scheduling
- [x] Add notification configuration to app.json
- [x] Implement "Let Me Think" reminder notifications
- [x] Implement periodic engagement notifications
- [x] Add notification cancellation on decisions
- [x] Create Profile settings toggle for engagement notifications
- [x] Update database schema (notification_id, enable_engagement_notifications)
- [x] Wrap app with SafeAreaProvider
- [x] Update TabNavigator to use safe area insets
- [x] Fix TypeScript error in SpendingScreen
- [x] Note user preference: No .md files for every change

**Actual Time Spent**: ~2 hours

### Phase 7: Bug Fixes & UI Refinements ✅ COMPLETE
- [x] Fix cross-account data leakage (user-scoped storage keys)
- [x] Unify stats display (single source of truth)
- [x] Fix generated column error (remove hourly_wage from updates)
- [x] Make categories optional (UX improvement)
- [x] Add personality test retake navigation
- [x] Implement tap-outside-to-close for all modals
- [x] Enforce 15-char item name limit consistently
- [x] Fix keyboard button clipping (KeyboardAvoidingView restructure)
- [x] Prevent UI clashes (increase padding for time badges)
- [x] Fix currency dropdown scrolling
- [x] Add real-time salary formatting

**Actual Time Spent**: ~5 hours (multiple bug fix iterations)

### Phase 10: Production Build & Testing (NEXT - IN PROGRESS)
- [ ] Run database migration (add_notification_preferences.sql)
- [ ] Build production APK with EAS
- [ ] Download and install on physical device
- [ ] Test notification system end-to-end
- [ ] Test navigation bar behavior (gesture vs button nav)
- [ ] Test complete onboarding flow (Welcome → Results → Home)
- [ ] Verify navigation transitions work smoothly
- [ ] Multi-account testing (verify user-scoped storage)
- [ ] Stats verification (HomeScreen vs ProfileScreen consistency)
- [ ] Personality test retake flow testing
- [ ] Input validation testing (15-char limits)
- [ ] Keyboard behavior testing (iOS and Android)
- [ ] UI clash testing (various screen sizes)
- [ ] Modal dismissal testing (all 4 modals)
- [ ] Test on iOS simulator
- [ ] Test on Android emulator

**Estimated Completion**: 4-5 hours

### Phase 11: Play Store Launch (AFTER TESTING)
- [ ] Multi-account testing (verify user-scoped storage)
- [ ] Stats verification (HomeScreen vs ProfileScreen consistency)
- [ ] Personality test retake flow testing
- [ ] Input validation testing (15-char limits)
- [ ] Keyboard behavior testing (iOS and Android)
- [ ] UI clash testing (various screen sizes)
- [ ] Modal dismissal testing (all 4 modals)
- [ ] Test on iOS simulator
- [ ] Test on Android emulator

**Estimated Completion**: 3-4 hours

### Phase 11: Google OAuth (Optional - Deferred)
- [ ] Configure Google OAuth in Supabase
- [ ] Set up Google Cloud Console
- [ ] Install Google Sign-In package
- [ ] Add Google sign-in button
- [ ] Implement OAuth flow
- [ ] Test on iOS and Android
- [ ] Handle OAuth errors

**Estimated Completion**: 2-3 hours

### Phase 12: App Store Deployment (FUTURE)
- [ ] Create app icons and splash screens (logo already integrated)
- [ ] Generate app screenshots for both platforms
- [ ] Write app store descriptions
- [ ] Set up app store listings
- [ ] Build production APK/IPA with EAS
- [ ] Submit for review (iOS App Store, Google Play Store)
- [ ] Handle any review feedback

**Estimated Completion**: 4-6 hours

## Current Status by Feature

### Authentication
- **Status**: ✅ Complete and tested
- **Complexity**: Medium
- **Files**: AuthContext.tsx, LoginScreen.tsx, SignupScreen.tsx, AuthNavigator.tsx

### Onboarding Flow
- **Status**: ✅ Complete and tested
- **Complexity**: High (gestures, animations, complex forms)
- **Files**: WelcomeScreen.tsx, SalaryInputScreen.tsx, QuestionnaireScreen.tsx, ResultsScreen.tsx, OnboardingNavigator.tsx, regions.ts, questionnaire.ts
- **Database**: user_profiles extended with 5 new columns

### Navigation
- **Status**: ✅ Complete with global refresh pattern
- **Complexity**: Medium (conditional routing based on auth/onboarding status)
- **Files**: App.tsx, AppNavigator.tsx, AuthNavigator.tsx, OnboardingNavigator.tsx

### Home Screen
- **Status**: ✅ Complete and fully responsive
- **Complexity**: Medium (carousels, timers, ProfileContext integration)
- **Files**: HomeScreen.tsx, ProfileContext.tsx, decisionStorage.ts, savingTips.ts
- **Features**: 3 horizontal carousels, stats display, timers, tips, pull-to-refresh

### Profile Management
- **Status**: Partially Complete (onboarding collects data, display/edit not yet built)
- **Complexity**: Medium
- **Priority**: High (users need to view/edit profile)

### Spending Calculator
- **Status**: ✅ Complete and fully functional
- **Complexity**: Medium (forms, modals, validation, AsyncStorage integration)
- **Files**: SpendingScreen.tsx, ResultsModal.tsx, RemindersModal.tsx (in src/components/calculator/)
- **Features**: Price input, work hours + investment calculations, 3 decision buttons, timer/category selection, form validation

### Google OAuth
- **Status**: Not Started
- **Complexity**: Medium-High
- **Priority**: Low (optional for MVP)

## Known Issues
- None currently - all Phase 7 bugs resolved ✅

## Known Limitations (Not Bugs - By Design)
- Questionnaire retake doesn't require confirmation (immediate start)
- Old personality type not shown during retake
- Stats sync happens in background (no loading indicator)
- Categories optional but can't be edited after reminder creation
- Item names can't exceed 15 chars (enforced by maxLength)
- Cache persists on logout (stats in Supabase are source of truth)

## Deferred Features (Future Versions)
- Purchase decision history tracking
- Statistics dashboard (money saved, purchases avoided)
- Savings goals
- Customizable investment return rate
- Multiple income source support
- Notifications for "Let Me Think" items
- Dark mode
- Onboarding tutorial
- Data export

## Evolution of Project Decisions

### Initial Scope
Starting with a focused MVP:
- Three screens (Home, Spending, Profile)
- Simple calculator
- Basic authentication
- No history tracking (for now)

This keeps the project achievable and testable quickly, with clear paths for enhancement later.

### Technical Choices
- **TypeScript in strict mode**: Better type safety, fewer runtime errors
- **Expo over bare React Native**: Faster setup, easier Google OAuth
- **Supabase over custom backend**: All-in-one auth and database solution
- **Client-side calculations**: No backend needed for math, works offline
- **Tab navigation**: Simple, mobile-standard pattern
- **Functional components with React.FC**: Consistent typing pattern

## Metrics for Success (Once Built)
- Authentication works reliably on both platforms
- Calculator responds instantly (<100ms)
- App launches in under 3 seconds
- No crashes during basic flows
- UI is clear and intuitive
- Works on iOS 13+ and Android 5.0+

## Next Session Priorities
1. **Multi-Account Testing**: Verify user-scoped storage prevents data leakage between accounts
2. **Stats Consistency Testing**: Confirm HomeScreen and ProfileScreen show identical numbers
3. **Personality Test Retake**: Test full navigation flow from Profile → Questionnaire → back
4. **Input Validation**: Verify 15-char limits work correctly across all screens
5. **Keyboard Behavior**: Test on both iOS and Android to confirm no button clipping
6. **Modal Dismissal**: Verify tap-outside works on all 4 modals
7. **Production Build**: Create EAS build for real device testing (if needed)

## Development Time Tracking
**Total MVP Time**: ~35-40 hours (original estimate: 25-30 hours)
**Time Spent So Far**: ~33 hours (Phases 1-9 complete)
**Remaining**: ~5-7 hours (build, testing, deployment)

**Progress Breakdown**:
- Phase 1 (Foundation): 2 hours ✅
- Phase 2 (Authentication): 3 hours ✅
- Phase 3 (Onboarding): 6 hours ✅
- Phase 4 (Home Screen): 4 hours ✅
- Phase 5 (Spending Calculator): 4 hours ✅
- Phase 6 (Currency & Profile Screen): 5 hours ✅
- Phase 7 (Bug Fixes & UI Refinements): 5 hours ✅
- Phase 8 (Navigation Fix & Code Cleanup): 2 hours ✅
- Phase 9 (Notifications & Navigation Bar): 2 hours ✅
- Phase 10 (Production Build & Testing): 4-5 hours (estimated)
- Phase 11 (Play Store Launch): 3-4 hours (estimated)
- Phase 12 (Google OAuth): 2-3 hours (optional, deferred)

**Note**: Phase 7 took longer than expected due to discovering and fixing critical architecture issues (cross-account data leakage, stats inconsistency, generated column errors). Phase 8 addressed a critical navigation bug where route names conflicted between navigators, causing incorrect screen display after onboarding completion.
