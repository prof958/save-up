# Active Context: Save Up

## Current Work Focus
**Status**: Phase 3 Complete - Onboarding Flow Fully Implemented ✅

We have just completed:
1. ✅ Complete onboarding flow with 4 screens (Welcome, Salary Input, Questionnaire, Results)
2. ✅ Real-time hourly wage calculator with smooth animations
3. ✅ Swipe-based questionnaire with 7 questions for spending personality assessment
4. ✅ Database schema extended with onboarding fields
5. ✅ Smart navigation flow that checks onboarding_completed status
6. ✅ Info modal explaining hourly wage calculation
7. ✅ Fully tested onboarding → home transition working perfectly

## Recent Changes (Phase 3: Onboarding Flow)

- **Onboarding Screens Created**
  - `WelcomeScreen.tsx` - Intro with app features and emoji
  - `SalaryInputScreen.tsx` - Complex form with region/currency pickers, salary type toggle, real-time hourly wage calculation
  - `QuestionnaireScreen.tsx` - Swipe-based card interface with PanResponder for 7 spending personality questions
  - `ResultsScreen.tsx` - Personalized feedback based on questionnaire score with loading state
  
- **Database Schema Extended**
  - Created `dbscripts/03_onboarding_fields.sql`
  - Added 5 new columns: currency, region, questionnaire_score, questionnaire_answers (JSONB), onboarding_completed
  - Successfully executed in Supabase

- **Navigation Architecture Enhanced**
  - Created `OnboardingNavigator.tsx` with stack navigation
  - App.tsx now checks onboarding_completed status via Supabase
  - Conditional navigation: Auth → Onboarding → App
  - Global refresh trigger pattern for immediate state updates after onboarding completion
  
- **Data Constants & Logic**
  - `src/constants/regions.ts` - 10 currencies, 13 regions with helper functions
  - `src/constants/questionnaire.ts` - 7 questions with scoring logic (0-2=low, 3=moderate, 4+=high)
  - Real-time hourly wage calculation in SalaryInputScreen
  
- **UX Enhancements**
  - Smooth fade-in/scale animations for questionnaire questions
  - Intro loading screen ("Let's see your spending type") with animated dots
  - Compact hourly wage display with fade-in animation
  - Info modal explaining calculation formula (tap ⓘ icon)
  - KeyboardAvoidingView for proper keyboard handling
  - Auto-scroll when hourly wage appears
  
- **Swipe Gesture Implementation**
  - PanResponder with 25% screen width threshold
  - Background color feedback (red for No, teal for Yes)
  - Fixed closure issue with useRef for current state
  - Smooth card animations between questions
  
- **Bug Fixes & Optimizations**
  - Fixed onboarding completion redirect with global refresh trigger
  - Fixed swipe gestures not working after first question (ref pattern)
  - Fixed keyboard blocking content (KeyboardAvoidingView + ScrollView)
  - Fixed cluttered questionnaire UI (removed overlapping text)
  - Made hourly wage calculation compact to avoid scrolling
  - Added loading spinner on "Start Saving Smart" button

## Next Steps

### Immediate Actions (Phase 4: Main App Features) - NEXT PRIORITY
1. **Home Screen Implementation**
   - Display user's hourly wage with currency
   - Show personalized greeting with user's spending personality
   - Add quick stats (based on questionnaire results)
   - Create ProfileContext to fetch user data from database
   
2. **Spending Calculator Screen**
   - Build price input form with currency symbol
   - Add "Calculate" button
   - Create results modal/sheet showing:
     - Work hours required
     - Investment value (10 years at 7% return)
   - Add decision buttons (Buy/Don't Buy/Save)
   - Animate results appearance

3. **Profile Screen**
   - Display current salary, currency, region
   - Show hourly wage calculation
   - Add "Edit Profile" functionality
   - Show questionnaire results with option to retake
   - Add logout button
   
4. **Profile Context & Data Management**
   - Create `ProfileContext.tsx` for global profile state
   - Implement `useProfile` hook
   - Fetch profile from Supabase on app load
   - Cache profile data
   - Handle profile updates

### Phase 5: Polish & Additional Features
5. **UI/UX Refinements**
   - Add loading states
   - Improve error messages
   - Add haptic feedback for decisions
   - Polish animations

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

### Pending Decisions
- [ ] Whether to track decision history in MVP (defer to Phase 4)
- [ ] Should user set salary immediately after signup, or allow skip?
- [ ] Display format for hourly wage (per hour vs per day vs per month)
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
- Use `useRef` for values needed in closures (e.g., PanResponder)
- Wrap sections in View components with consistent styling

### File Organization
- Group by feature/domain in `src/` directory
- All React components use `.tsx` extension
- All utilities/configs use `.ts` extension
- Type definitions exported from same file as implementation
- Keep screens simple (delegate to components)
- Onboarding screens in `src/screens/onboarding/` subdirectory

### Animation Patterns
- Use `Animated.Value` for smooth transitions
- Combine animations with `Animated.parallel()` for simultaneous effects
- Use `Animated.spring()` for natural feel, `Animated.timing()` for controlled speed
- Always set `useNativeDriver: false` when animating layout properties
- Add fade + scale animations for new content appearing
- Use `interpolate` for derived animation values

### State Management Patterns
- Use refs (`useRef`) to track current values in event handlers
- Sync refs with state via `useEffect` for PanResponder closures
- Create global refresh triggers via exported refs when needed
- Use `useCallback` for functions passed to useEffect dependencies

### Keyboard Handling
- Always wrap forms in `KeyboardAvoidingView`
- Use `Platform.OS` to set behavior (iOS='padding', Android='height')
- Add `keyboardShouldPersistTaps="handled"` to ScrollView
- Position important content above keyboard area or enable scrolling

### Calculation Approach
- All calculations client-side
- Simple, transparent formulas
- Round display values appropriately
- Handle edge cases (zero salary, negative numbers)
- Show real-time calculations for immediate feedback

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
- **None** - Authentication working, ready for profile and calculator features

## Notes for Future Sessions
- Remember: This is an MVP - focus on core calculator functionality first
- Don't over-engineer the investment calculations - simple compound interest is fine
- User experience matters more than feature completeness
- Test calculator logic thoroughly with edge cases
- Keep the Memory Bank updated as patterns emerge during implementation
