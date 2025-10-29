# Active Context: Save Up

## Current Work Focus
**Status**: Phase 4 Complete - Home Screen Dashboard & UI Redesign ✅

We have just completed:
1. ✅ Database schema extended with spending decision stats columns (7 aggregation fields)
2. ✅ DecisionStorage utility for local AsyncStorage management + Supabase sync
3. ✅ ProfileContext for global user profile data management
4. ✅ Complete Home Screen dashboard with card-based layout
5. ✅ Three horizontal-scrolling carousels: Stats, Reminders (with timers), and Money Tips
6. ✅ UI redesign to friendly/professional aesthetic (white headers, reduced emojis, Ionicons)
7. ✅ NavBar refinement with proper responsive padding (95px iOS, 75px Android)
8. ✅ All UI polish and responsive layout for both platforms

## Recent Changes (Phase 4: Home Screen Dashboard & UI Redesign)

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

### Immediate Actions (Phase 5: Spending Calculator) - NEXT PRIORITY

1. **Build Spending Calculator Screen** (SpendingScreen.tsx)
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

4. **Build Profile Screen** (ProfileScreen.tsx)
   - Display current salary, currency, region
   - Show hourly wage calculation
   - Add "Edit Profile" button
   - Show questionnaire results with option to retake
   - Display lifetime stats from user_profiles:
     - Total money saved
     - Total hours saved
     - Decision counts (buy, don't buy, save, let me think)
   - Add logout button with confirmation
   - Edit modal/screen for salary/currency/region changes

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
- [x] Whether to track decision history in MVP - **YES, required for Home Screen stats**
- [x] Should user set salary immediately after signup, or allow skip? - **Required during onboarding**
- [ ] Display format for hourly wage (per hour vs per day vs per month) - **Currently per hour**
- [ ] How long should "Let Me Think" timers default to? (24 hours? User choice?)
- [ ] How many saving tips to include? Should they be in database or constants?
- [ ] Should we show empty state on Home Screen for new users with no decisions?
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

### Key Insights (Phase 3 & 4)
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
