// Global ref to trigger onboarding status refresh
// This breaks the require cycle between App.tsx and OnboardingNavigator.tsx
export const onboardingRefreshTrigger = { current: () => {} };
