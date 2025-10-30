import 'react-native-url-polyfill/auto';
import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ProfileProvider } from './src/contexts/ProfileContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import { supabase } from './src/config/supabase';
import { colors } from './src/constants/theme';

// Create a global ref to trigger onboarding status refresh
export const onboardingRefreshTrigger = { current: () => {} };

const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  const checkOnboardingStatus = React.useCallback(async () => {
    if (!user) {
      setOnboardingCompleted(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching onboarding status:', error);
        setOnboardingCompleted(false);
        return;
      }

      // If no profile exists, user needs onboarding
      if (!data) {
        setOnboardingCompleted(false);
        return;
      }

      setOnboardingCompleted(data.onboarding_completed ?? false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setOnboardingCompleted(false);
    }
  }, [user]);

  // Expose refresh function globally
  useEffect(() => {
    onboardingRefreshTrigger.current = checkOnboardingStatus;
  }, [checkOnboardingStatus]);

  useEffect(() => {
    checkOnboardingStatus();
  }, [user, checkOnboardingStatus]);

  if (loading || (user && onboardingCompleted === null)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  return onboardingCompleted ? <AppNavigator /> : <OnboardingNavigator />;
};

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="auto" />
      </ProfileProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
