# Active Context: Save Up

## Current Work Focus
**Status**: Phase 1 Complete - Foundation Built with TypeScript

We have just completed:
1. ✅ Created complete Memory Bank structure
2. ✅ Initialized Expo project with TypeScript
3. ✅ Set up project folder structure
4. ✅ Installed all core dependencies
5. ✅ Created navigation with 3 tabs
6. ✅ Built placeholder screens (TypeScript)
7. ✅ Implemented calculation utilities (fully typed)
8. ✅ Created README documentation

## Recent Changes
- **Converted project to TypeScript** (user request)
  - Installed TypeScript and type definitions
  - Configured tsconfig.json for Expo
  - Converted all files from .js to .tsx/.ts
  - Added proper type exports and interfaces
- **Created App.tsx** - Main entry with URL polyfill
- **Built src/navigation/AppNavigator.tsx** - Tab navigation with typed routes
- **Created 3 screens** - HomeScreen, SpendingScreen, ProfileScreen (all TypeScript)
- **Implemented src/utils/calculations.ts** - All calculation logic with TypeScript types
- **Created src/constants/index.ts** - Constants with type exports
- **Generated README.md** - Complete project documentation

## Next Steps

### Immediate Actions (Phase 2: Supabase & Authentication)
1. **Set Up Supabase** - NEXT PRIORITY
   - Create Supabase project
   - Configure authentication providers (email/password)
   - Set up database schema (user_profiles table)
   - Add environment variables (.env file)
   - Create src/config/supabase.ts

2. **Implement Authentication**
   - Build LoginScreen.tsx
   - Build SignupScreen.tsx
   - Create AuthContext.tsx with TypeScript types
   - Add protected route logic
   - Update navigation to handle auth state

3. **Profile Screen Development**
   - Build salary input form
   - Add monthly/annual toggle
   - Create ProfileContext.tsx
   - Connect to Supabase user_profiles
   - Display calculated hourly wage

### Phase 2: Core Features
5. **Build Calculator Logic**
   - Implement hourly wage calculation
   - Create work hours calculation
   - Add investment calculation

6. **Build Spending Screen**
   - Input form for item cost
   - Calculate button
   - Results modal/popup

7. **Build Profile Screen**
   - Salary input form
   - Monthly/annual toggle
   - Display calculated hourly wage

8. **Add Google OAuth**
   - Configure Google OAuth in Supabase
   - Add Google sign-in button
   - Test OAuth flow

### Phase 3: Polish & Testing
9. **UI/UX Refinement**
10. **Error Handling**
11. **Testing on iOS and Android**
12. **Documentation finalization**

## Active Decisions & Considerations

### Architecture Decisions Made
- ✅ Using Expo for easier development and deployment
- ✅ Supabase for backend (Auth + Database)
- ✅ React Navigation with bottom tabs
- ✅ Client-side calculations for instant results
- ✅ Context API for state management (no Redux needed)
- ✅ **TypeScript in strict mode** (user preference)
- ✅ Investment calculation: 7% annual return over 10 years (simple compound)

### Pending Decisions
- [ ] Whether to track decision history in MVP
- [ ] Styling approach: Currently using StyleSheet (can enhance later)
- [ ] Error tracking/analytics tools (defer to post-MVP)
- [ ] Testing framework (defer to post-MVP)

## Important Patterns & Preferences

### Code Style
- **TypeScript strict mode** - All files properly typed
- Use functional components with `React.FC` type
- Keep components small and focused
- Separate business logic from UI
- Use custom hooks for shared logic
- Export types alongside constants (e.g., `SalaryType`, `DecisionType`)

### File Organization
- Group by feature/domain in `src/` directory
- All React components use `.tsx` extension
- All utilities/configs use `.ts` extension
- Type definitions exported from same file as implementation
- Keep screens simple (delegate to components)

### Calculation Approach
- All calculations client-side
- Simple, transparent formulas
- Round display values appropriately
- Handle edge cases (zero salary, negative numbers)

## Learnings & Project Insights

### Key Insights
1. **Simplicity is Core**: The app's power comes from its simplicity - one input, instant results, clear actions
2. **Mobile-First**: Users will use this in real-time shopping decisions, so speed and clarity are critical
3. **Non-Judgmental Design**: The app provides perspective, not prescription - users stay in control
4. **Personal Context Matters**: All calculations are relative to individual salary, making it personally meaningful

### Technical Insights
1. **TypeScript Benefits**: Strict typing catches errors early and improves code quality
2. **Expo Advantage**: Faster iteration and easier OAuth setup justify using Expo over bare React Native
3. **Supabase Benefits**: Built-in auth and database with minimal setup time
4. **Calculation Strategy**: Client-side math eliminates latency and enables offline use
5. **Navigation Pattern**: Bottom tabs are perfect for this flat, three-section structure
6. **Type-Safe Navigation**: Using typed param lists prevents navigation errors

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
- **None** - Foundation complete, ready for Supabase setup

## Notes for Future Sessions
- Remember: This is an MVP - focus on core calculator functionality first
- Don't over-engineer the investment calculations - simple compound interest is fine
- User experience matters more than feature completeness
- Test calculator logic thoroughly with edge cases
- Keep the Memory Bank updated as patterns emerge during implementation
