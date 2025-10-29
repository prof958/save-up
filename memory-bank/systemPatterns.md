# System Patterns: Save Up

## Architecture Overview

### High-Level Structure
```
┌─────────────────────────────────────┐
│     React Native + Expo App         │
│  ┌───────────┬──────────┬─────────┐ │
│  │   Home    │ Spending │ Profile │ │
│  │    Tab    │   Tab    │   Tab   │ │
│  └───────────┴──────────┴─────────┘ │
│              ↕                       │
│     ┌────────────────────┐          │
│     │  State Management  │          │
│     └────────────────────┘          │
│              ↕                       │
│     ┌────────────────────┐          │
│     │  Supabase Client   │          │
│     └────────────────────┘          │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│         Supabase Backend            │
│  ┌──────────┬──────────┬─────────┐ │
│  │   Auth   │ Database │   API   │ │
│  └──────────┴──────────┴─────────┘ │
└─────────────────────────────────────┘
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

#### Spending Calculator
- `SpendingCalculator`: Input form for item price
- `CalculationPopup`: Modal showing results and actions
- `WorkHoursDisplay`: Visual representation of work hours
- `InvestmentDisplay`: Visual representation of investment returns
- `DecisionButtons`: Buy/Don't Buy/Let Me Think actions

#### Profile Management
- `ProfileScreen`: Main profile view
- `SalaryInput`: Form for entering/updating salary
- `SalaryTypeToggle`: Switch between monthly/annual
- `HourlyWageDisplay`: Calculated hourly wage

#### Shared Components
- `TabNavigation`: Bottom tab bar
- `Button`: Standardized button component
- `Input`: Standardized input component
- `Modal`: Reusable modal component

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
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### spending_decisions table (future)
```sql
id: UUID (primary key)
user_id: UUID (foreign key → users.id)
item_cost: DECIMAL
work_hours: DECIMAL
decision: ENUM ('buy', 'dont_buy', 'think')
created_at: TIMESTAMP
```

## State Management Pattern

### Authentication State
- Managed via Supabase Auth + React Context
- Persisted sessions
- Automatic token refresh

### User Profile State
- Fetched on login
- Cached locally
- Updated on profile changes

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

## Critical Implementation Paths

### Path 1: Authentication Flow
1. Supabase project setup
2. Auth UI implementation (email + Google)
3. Session management
4. Protected route wrapper
5. Profile initialization on first login

### Path 2: Calculator Core
1. Hourly wage calculation logic
2. Spending input form
3. Work hours calculation
4. Investment calculation formula
5. Results display modal
6. Decision action handlers

### Path 3: Profile Management
1. Profile data fetching
2. Salary input form
3. Monthly/annual toggle
4. Update API integration
5. Real-time hourly wage update

## Design Patterns in Use

### Patterns
- **Container/Presenter**: Separate logic from UI
- **Provider Pattern**: Context for auth and user data
- **Controlled Components**: All form inputs managed by state
- **Composition**: Small, reusable components
- **Custom Hooks**: Shared logic (useAuth, useProfile, useCalculator)
- **Type-Safe Navigation**: Typed param lists for all routes
- **Const Assertions**: Using `as const` for immutable constants with literal types

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
