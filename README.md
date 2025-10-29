# Save Up - Financial Decision App

A mobile app built with React Native (TypeScript) and Expo that helps users make mindful spending decisions by visualizing purchases in terms of work hours and investment opportunity costs.

## 🚀 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Supabase (Auth + Database)
- **Navigation**: React Navigation (Bottom Tabs)
- **State Management**: React Context API + Hooks

## 📱 Features

- **Authentication**: Email/password & Google OAuth
- **Spending Calculator**: Calculate work hours and investment value for purchases
- **Profile Management**: Set salary and view hourly wage
- **Three Tabs**: Home, Spending, Profile

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (for testing on device)

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd save-up
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file (when Supabase is configured)
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start development server
```bash
npx expo start
```

## 📂 Project Structure

```
save-up/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Auth-related components
│   │   ├── calculator/   # Calculator components
│   │   ├── profile/      # Profile components
│   │   └── shared/       # Shared components
│   ├── screens/          # Main screen components
│   ├── navigation/       # Navigation configuration
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── constants/        # App constants
├── assets/               # Images, fonts, etc.
├── memory-bank/          # Project documentation
└── App.tsx              # App entry point
```

## 🧮 Core Calculations

### Hourly Wage
```typescript
hourlyWage = annualSalary / (52 weeks × 40 hours)
```

### Work Hours
```typescript
workHours = itemCost / hourlyWage
```

### Investment Value
```typescript
futureValue = itemCost × (1 + 0.07)^10
// 7% annual return over 10 years
```

## 📝 Development Commands

```bash
# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on web
npx expo start --web

# Clear cache and start
npx expo start -c
```

## 🎯 Current Status

✅ Project initialization complete  
✅ TypeScript configuration  
✅ Navigation structure (3 tabs)  
✅ Calculation utilities  
✅ Placeholder screens  

⏳ Next: Supabase setup and authentication

## 📚 Documentation

Detailed project documentation is available in the `memory-bank/` folder:
- `projectbrief.md` - Project requirements and scope
- `productContext.md` - User experience and goals
- `systemPatterns.md` - Architecture and patterns
- `techContext.md` - Technical details and setup
- `activeContext.md` - Current work focus
- `progress.md` - Development progress

## 📄 License

[Your License Here]
