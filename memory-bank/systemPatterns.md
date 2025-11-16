# System Patterns: Save Up

## Architecture Overview

### High-Level Structure
```
┌─────────────────────────────────────────────────┐
│          React Native + Expo App                │
│  ┌───────────┬──────────────┬────────────────┐ │
│  │   Home    │   Spending   │    Profile     │ │
│  │  (Stats   │  (Calculator │  (Settings &   │ │
│  │ Dashboard)│   + Actions) │   User Info)   │ │
│  └───────────┴──────────────┴────────────────┘ │
│              ↕                                  │
│     ┌────────────────────┐                     │
│     │  ProfileContext    │ (User data cache)   │
│     └────────────────────┘                     │
│              ↕                                  │
│     ┌────────────────────┐                     │
│     │  Supabase Client   │                     │
│     └────────────────────┘                     │
└─────────────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────────────┐
│         Supabase Backend                        │
│  ┌──────────┬──────────────┬─────────────────┐ │
│  │   Auth   │   Database   │   Real-time     │ │
│  │          │ - profiles   │   (optional)    │ │
│  │          │ - decisions  │                 │ │
│  └──────────┴──────────────┴─────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Component Architecture

### Navigation Structure
- **Root Navigator**: Tab-based navigation (React Navigation)
  - Home Tab
  - Spending Tab
  - Profile Tab

### Key Components

#### Authentication Layer
- `AuthProvider`: Context for authentication state
- `LoginScreen`: Email/password login
- `SignupScreen`: Email/password signup
- `GoogleAuthButton`: Google OAuth integration
- `ProtectedRoute`: Wrapper for authenticated screens

#### Home Screen (Dashboard)
- `HomeScreen`: Main dashboard container with 3 horizontal carousels
- `StatsCard`: Display stats (money/hours saved, decisions count)
- `LetMeThinkCard`: Active "Let Me Think" items with countdown timers
- `SavingTipsCard`: Carousel of 10 money-saving tips
- `EmptyStateCard`: Shown when no decisions made yet

#### Spending Calculator
- `SpendingScreen`: Input form for item price and name
- `CalculationModal`: Bottom sheet showing results and actions
- `WorkHoursDisplay`: Visual representation of work hours
- `InvestmentDisplay`: Visual representation of investment returns
- `DecisionButtons`: Buy/Don't Buy/Save/Let Me Think actions
- `ReminderPicker`: Date/time picker for "Let Me Think" reminders

#### Profile Management
- `ProfileScreen`: Main profile view
- `SalaryInput`: Form for entering/updating salary
- `SalaryTypeToggle`: Switch between monthly/annual
- `HourlyWageDisplay`: Calculated hourly wage

#### Shared Components
- `TabNavigation`: Bottom tab bar with Ionicons
- `Button`: Standardized button component
- `Input`: Standardized input component
- `Modal`: Reusable modal component
- `LoadingSpinner`: Loading indicator component
- `Toast`: Notification/confirmation feedback component (for future use)

## Data Model

### Database Schema (Supabase)

#### users table
```sql
id: UUID (primary key, from Supabase Auth)
email: TEXT
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### user_profiles table
```sql
id: UUID (primary key)
user_id: UUID (foreign key → users.id)
salary_amount: DECIMAL
salary_type: ENUM ('monthly', 'annual')
hourly_wage: DECIMAL (computed)
currency: VARCHAR (from onboarding)
region: VARCHAR (from onboarding)
questionnaire_score: INTEGER (0-7 range)
questionnaire_answers: JSONB (array of yes/no answers)
onboarding_completed: BOOLEAN
-- Phase 4 additions: Stats aggregation columns
total_money_saved: DECIMAL DEFAULT 0
total_hours_saved: DECIMAL DEFAULT 0
total_decisions: INTEGER DEFAULT 0
buy_count: INTEGER DEFAULT 0
dont_buy_count: INTEGER DEFAULT 0
save_count: INTEGER DEFAULT 0
let_me_think_count: INTEGER DEFAULT 0
created_at: TIMESTAMP
updated_at: TIMESTAMP

INDEX on user_id
INDEX on onboarding_completed
```

#### Local AsyncStorage (Phase 4 - Private decisions cache, Phase 7 - User-scoped)
```typescript
// Key Pattern (Phase 7): "@save_up_decisions_{user_id}" (user-specific, prevents cross-account leakage)
// Before Phase 7: "@save_up_decisions" (VULNERABLE - shared across all users!)
// Structure: SpendingDecision[]
interface SpendingDecision {
  id: string
  item_name: string
  item_price: number
  work_hours: number
  investment_value: number
  decision_type: 'buy' | 'dont_buy' | 'save' | 'let_me_think'
  remind_at: number (milliseconds, for timers)
  created_at: number (milliseconds)
  categories?: string[] (optional - Phase 7 update)
}

// User decisions stay on device for privacy
// Stats calculated locally, synced to user_profiles for backup
// CRITICAL: Keys are user-scoped to prevent data leakage between accounts
// Storage key generated via: getStorageKey() function using supabase.auth.getUser()
```

## State Management Pattern

### Authentication State
- Managed via Supabase Auth + React Context
- Persisted sessions
- Automatic token refresh

### User Profile State
- Fetched on app initialization via ProfileContext
- Cached locally via ProfileContext (useProfile hook)
- Updated when profile changes
- Includes: salary, currency, region, hourly wage, questionnaire results, stats

### Decision/Transaction State (Phase 4 - Local-First)
- **Primary Storage**: AsyncStorage on device (privacy-first)
- **Stats Calculation**: Calculated locally from AsyncStorage decisions
- **Cloud Backup**: Stats synced to user_profiles (not individual decisions)
- **Sync Pattern**: Background sync via decisionStorage.syncStatsToSupabase()
- **Privacy Benefit**: Individual decisions never leave device, only aggregates stored in cloud

### Calculator State
- Local component state (no persistence needed)
- Calculations performed client-side
- Results displayed immediately

## Key Technical Decisions

### 1. Client-Side Calculations
**Decision**: Perform all calculator math in the React Native app

**Reasoning**:
- Instant results (no network latency)
- Simple arithmetic doesn't need backend
- Reduces API calls
- Works offline

### 2. Supabase for Backend
**Decision**: Use Supabase as primary backend

**Reasoning**:
- Built-in authentication (email + OAuth)
- PostgreSQL database
- Real-time capabilities (future features)
- Automatic API generation
- Easy to set up and deploy

### 3. Expo Framework
**Decision**: Build with Expo rather than bare React Native

**Reasoning**:
- Faster development setup
- Built-in navigation and common libraries
- Easy Google OAuth integration
- Simplified build process
- Good for MVP and iteration

### 4. Tab Navigation
**Decision**: Use bottom tab navigation for main screens

**Reasoning**:
- Standard mobile pattern
- Quick access to all sections
- Clear mental model
- Single-level hierarchy (no deep nesting)

### 5. Local-First Decision Storage (Phase 4, Enhanced Phase 7)
**Decision**: Store individual decisions in AsyncStorage with user-scoped keys, sync stats to Supabase

**Reasoning**:
- Privacy: User decisions stay on device
- Performance: No upload latency
- Offline support: Works without internet
- Cloud backup: Stats synced for multi-device support
- Efficiency: Only aggregates stored in database
- Security (Phase 7): User-scoped keys prevent cross-account data leakage

**Critical Implementation Detail (Phase 7)**:
- Storage keys MUST be scoped per user: `@save_up_decisions_{user_id}`
- Using shared key across users causes security vulnerability
- getStorageKey() function fetches current user ID from Supabase auth

### 6. ProfileContext for Global State (Phase 4)
**Decision**: Use React Context (not Redux) for user profile management

**Reasoning**:
- Simpler than Redux for this use case
- Sufficient for our state complexity
- Less boilerplate code
- Easier to understand and maintain
- Built-in React pattern

### 7. Single Source of Truth for Stats (Phase 7)
**Decision**: Supabase user_profiles table is the authoritative source for all user stats

**Reasoning**:
- Prevents inconsistency between HomeScreen and ProfileScreen
- Eliminates dual calculation logic (local + cloud)
- Simplifies debugging (one place to check)
- Reliable across sessions and devices
- Stats survive cache clearing

**Implementation**:
- Both HomeScreen and ProfileScreen read from `profile.*` via ProfileContext
- AsyncStorage stores individual decisions only (for privacy and details)
- decisionStorage.syncStatsToSupabase() updates aggregates in Supabase after each decision

### 9. Push Notification System (Phase 9)
**Decision**: Implement local notifications for reminder and engagement types

**Reasoning**:
- Increases user engagement and retention
- Reminds users to make decisions on "Let Me Think" items
- Periodic engagement prompts encourage app usage
- User control via settings toggle respects preferences
- Local notifications don't require push server setup

**Implementation**:
- Two notification channels (Android): REMINDERS (high), ENGAGEMENT (default)
- Scheduled notifications stored with reminder_id/notification_id
- Automatic cancellation when user makes decision
- User toggle in Profile settings for engagement notifications
- Notification data includes item details for deep linking

### 10. SafeAreaProvider for Android Navigation Bar (Phase 9)
**Decision**: Use react-native-safe-area-context to handle system UI insets

**Reasoning**:
- edgeToEdgeEnabled requires proper inset handling
- Dynamic tab bar height works on all Android devices
- Supports both gesture and button navigation
- Content never hidden behind system UI
- Standard React Native solution

**Implementation**:
- SafeAreaProvider wraps entire app in App.tsx
- useSafeAreaInsets() hook in TabNavigator
- Dynamic paddingBottom and height based on insets.bottom
- Fallback padding (15px) when insets.bottom is 0

### 11. Horizontal Carousels for Home Screen (Phase 4)
**Decision**: Use ScrollView with fixed-width horizontal items instead of grid

**Reasoning**:
- Modern, engaging UX (swipe-friendly)
- Better use of space on mobile
- Can show partial cards (peek to right)
- More natural for mobile scrolling
- Easier to add more items without restructuring

### 9. Generated Columns Exclusion (Phase 7)
**Decision**: Never include GENERATED ALWAYS columns in UPDATE statements

**Reasoning**:
- Database constraint: Generated columns auto-calculate based on other columns
- Attempting to UPDATE causes error: "Column can only be updated to DEFAULT"
- hourly_wage is GENERATED from salary_amount and salary_type
- Solution: Exclude from all updateProfile() calls, let database calculate

**Implementation**:
- ProfileScreen update excludes hourly_wage
- Database formula: salary_amount * 12 / (52 * 40) for monthly, salary_amount / (52 * 40) for annual
- Value refreshes automatically when salary_amount or salary_type changes

## Critical Implementation Paths

### Path 1: Authentication Flow
1. Supabase project setup
2. Auth UI implementation (email + Google)
3. Session management
4. Protected route wrapper
5. Profile initialization on first login

### Path 2: Onboarding Flow
1. Welcome screen with feature intro
2. Salary input with hourly wage calculation
3. Spending personality questionnaire (7 questions)
4. Results with personalized feedback
5. Database profile creation/update
6. Global refresh trigger for navigation

### Path 3: Home Dashboard (Phase 4)
1. ProfileContext provider wrapping app
2. DecisionStorage utilities for AsyncStorage
3. HomeScreen component with ProfileContext integration
4. Three horizontal carousels: Stats, Reminders, Tips
5. Pull-to-refresh functionality
6. Real-time countdown timers for "Let Me Think" items

### Path 4: Calculator Core (Phase 5)
1. Hourly wage calculation logic (from onboarding)
2. Spending input form
3. Work hours calculation
4. Investment calculation formula
5. Results display modal
6. Decision action handlers
7. AsyncStorage save via decisionStorage
8. Stats sync to Supabase

### Path 5: Profile Management (Phase 5)
1. ProfileScreen UI showing current data
2. Edit modal for salary/currency/region
3. Questionnaire results display
4. Lifetime stats aggregation
5. Logout functionality

## Design Patterns in Use

### Patterns
- **Container/Presenter**: Separate logic from UI
- **Provider Pattern**: Context for auth and user data
- **Controlled Components**: All form inputs managed by state
- **Composition**: Small, reusable components
- **Custom Hooks**: Shared logic (useAuth, useProfile, useCalculator)
- **Type-Safe Navigation**: Typed param lists for all routes
- **Const Assertions**: Using `as const` for immutable constants with literal types
- **User-Scoped Storage Keys** (Phase 7): Prefix + user ID prevents cross-account data leakage
- **Single Source of Truth** (Phase 7): One authoritative data source (Supabase) prevents inconsistency
- **Optional Props with Validation** (Phase 7): Make fields optional but validate when needed (categories)
- **Platform-Specific Behavior** (Phase 7): Different KeyboardAvoidingView behavior for iOS vs Android
- **Tap-Outside Dismissal** (Phase 7): TouchableWithoutFeedback wrapper for modal UX
- **Real-Time Input Formatting** (Phase 7): Format as user types (comma insertion) for polish

### Naming Conventions
- Components: PascalCase with `.tsx` extension (e.g., `SpendingCalculator.tsx`)
- Hooks: camelCase with 'use' prefix and `.ts` extension (e.g., `useAuth.ts`)
- Utilities: camelCase with `.ts` extension (e.g., `calculations.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `MONTHS_PER_YEAR`)
- Types: PascalCase (e.g., `SalaryType`, `RootTabParamList`)
- Interfaces: PascalCase with 'I' prefix optional (e.g., `UserProfile` or `IUserProfile`)

## Error Handling Strategy
- Network errors: Show user-friendly messages
- Auth errors: Redirect to login
- Validation errors: Inline form feedback
- Calculation errors: Fallback to zero/default values

## Security Considerations
- Supabase Row Level Security (RLS) policies
- Users can only access their own data
- OAuth tokens managed by Supabase
- No sensitive data in client-side code
- HTTPS for all API calls
