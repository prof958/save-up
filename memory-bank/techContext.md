# Technical Context: Save Up

## Technology Stack

### Frontend
- **Framework**: React Native (via Expo)
- **Language**: TypeScript (strict mode enabled)
- **UI Library**: React Native built-in components + custom styling
- **Navigation**: React Navigation (Tab Navigator)
- **State Management**: React Context API + Hooks
- **HTTP Client**: Supabase JS Client

### Backend
- **Platform**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
  - Email/Password provider
  - Google OAuth provider
- **API**: Auto-generated REST API (Supabase)

### Development Tools
- **Package Manager**: npm or yarn
- **Build Tool**: Expo CLI
- **Version Control**: Git
- **Code Editor**: VS Code (assumed)

## Project Structure (Current - TypeScript)

```
save-up/
├── memory-bank/              # Documentation
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   ├── activeContext.md
│   └── progress.md
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Auth-related components (to be created)
│   │   ├── calculator/     # Calculator components (to be created)
│   │   ├── profile/        # Profile components (to be created)
│   │   └── shared/         # Shared/common components (to be created)
│   ├── screens/            # Main screen components
│   │   ├── HomeScreen.tsx  ✅
│   │   ├── SpendingScreen.tsx  ✅
│   │   └── ProfileScreen.tsx  ✅
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx  ✅
│   ├── contexts/           # React Context providers (to be created)
│   ├── hooks/              # Custom React hooks (to be created)
│   ├── utils/              # Utility functions
│   │   └── calculations.ts  ✅
│   ├── config/             # Configuration files (to be created)
│   └── constants/          # App constants
│       └── index.ts  ✅
├── assets/                 # Images, fonts, etc.
├── App.tsx                # Main app entry  ✅
├── app.json               # Expo configuration
├── tsconfig.json          # TypeScript configuration  ✅
├── package.json           # Dependencies
├── .env                   # Environment variables (to be created)
└── README.md             # Project documentation  ✅
```

## Dependencies (Initial)

### Core Dependencies (Installed)
```json
{
  "expo": "~54.0.20",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "@supabase/supabase-js": "^2.77.0",
  "@react-navigation/native": "^7.1.19",
  "@react-navigation/bottom-tabs": "^7.7.2",
  "react-native-url-polyfill": "^3.0.0",
  "react-native-screens": "~4.16.0",
  "react-native-safe-area-context": "~5.6.0",
  "expo-status-bar": "~3.0.8"
}
```

### TypeScript Dependencies (Installed)
```json
{
  "typescript": "^5.9.3",
  "@types/react": "~19.1.10",
  "@types/react-native": "^0.72.8"
}
```

### Google OAuth Dependencies (To be installed)
```json
{
  "@react-native-google-signin/google-signin": "^10.x.x"
}
```

## Environment Variables

Required environment variables (stored in `.env`):
```
EXPO_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=[google-client-id]
```

## Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for testing on physical device)
- iOS Simulator (macOS) or Android Emulator

### Initial Setup Steps
1. Clone repository
2. Run `npm install`
3. Create `.env` file with Supabase credentials
4. Set up Supabase project:
   - Create new project
   - Enable email auth
   - Configure Google OAuth
   - Set up database schema
   - Configure RLS policies
5. Run `npx expo start`

## Supabase Configuration

### Authentication Providers
1. **Email/Password**: Enabled by default
2. **Google OAuth**: 
   - Configure OAuth consent screen
   - Add authorized redirect URIs
   - Store client ID in Supabase settings

### Database Setup
- Create tables via Supabase SQL editor
- Set up Row Level Security policies
- Create necessary indexes

### Security Rules (RLS Policies)
```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);
```

## Build & Deployment

### Development
```bash
npx expo start
```

### Building for Production
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Technical Constraints

### Platform Limitations
- Must work on both iOS and Android
- Minimum iOS version: 13.0
- Minimum Android version: 5.0 (API 21)

### Performance Requirements
- Calculator must respond instantly (<100ms)
- App launch time: <3 seconds
- Smooth navigation transitions

### Network Requirements
- Must handle offline scenarios gracefully
- Authentication requires internet connection
- Calculator works offline (after profile loaded)

### Storage
- Minimal local storage needs
- Session tokens stored securely
- Profile data cached locally

## Calculation Formulas (Implemented in TypeScript)

### Hourly Wage
```typescript
// Implemented in src/utils/calculations.ts
export const calculateHourlyWage = (
  salaryAmount: number, 
  salaryType: SalaryType
): number => {
  if (!salaryAmount || salaryAmount <= 0) return 0;
  
  const annualSalary = salaryType === 'monthly' 
    ? salaryAmount * MONTHS_PER_YEAR 
    : salaryAmount;
  
  const hourlyWage = annualSalary / (WEEKS_PER_YEAR * HOURS_PER_WEEK);
  return Math.round(hourlyWage * 100) / 100;
};
```

### Work Hours for Purchase
```typescript
// Implemented in src/utils/calculations.ts
export const calculateWorkHours = (
  itemCost: number, 
  hourlyWage: number
): number => {
  if (!itemCost || !hourlyWage || hourlyWage <= 0) return 0;
  
  const workHours = itemCost / hourlyWage;
  return Math.round(workHours * 100) / 100;
};
```

### Investment Calculation
```typescript
// Implemented in src/utils/calculations.ts
export const calculateInvestmentValue = (
  amount: number, 
  annualReturn: number = 0.07,  // 7% default
  years: number = 10             // 10 years default
): number => {
  if (!amount || amount <= 0) return 0;
  
  const futureValue = amount * Math.pow(1 + annualReturn, years);
  return Math.round(futureValue * 100) / 100;
};
```

## Development Workflow

1. **Feature Branch**: Create branch for new feature
2. **Development**: Build feature with Expo dev server
3. **Testing**: Test on iOS and Android (simulator/device)
4. **Documentation**: Update memory bank as needed
5. **Commit**: Commit with clear message
6. **Merge**: Merge to main branch

## Common Commands

```bash
# Start development server
npx expo start

# Start with cleared cache
npx expo start -c

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Install dependencies
npm install

# Update dependencies
npx expo install --check
```

## Debugging Tools
- React Native Debugger
- Expo DevTools
- Chrome DevTools (for debugging JS)
- Supabase Dashboard (for backend inspection)

## Known Limitations & Workarounds

### Google OAuth on Expo Go
- Full OAuth flow requires custom development build
- Workaround: Use Expo EAS Build for production
- Alternative: Start with email auth, add OAuth later

### Calculation Accuracy
- JavaScript floating-point precision issues
- Workaround: Round to 2 decimal places for currency
- Use `toFixed(2)` for display values
