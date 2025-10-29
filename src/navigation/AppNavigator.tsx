import React from 'react';
import { Platform, TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SpendingScreen from '../screens/SpendingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LetMeThinkScreen from '../screens/LetMeThinkScreen';
import QuestionnaireScreen from '../screens/onboarding/QuestionnaireScreen';
import { colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { supabase } from '../config/supabase';

export type RootTabParamList = {
  Home: undefined;
  Spending: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  LetMeThink: {
    itemName: string;
    itemPrice: number;
    workHours: number;
  };
  Questionnaire: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        },
      ]
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 95 : 75,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
        headerStyle: {
          backgroundColor: '#fff',
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        } as any,
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerTitle: 'Save Up',
          headerShown: false, // Hide default header to show custom header in HomeScreen
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Spending" 
        component={SpendingScreen}
        options={{
          tabBarLabel: 'Spending',
          headerTitle: 'Spending Calculator',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerTitle: 'Your Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSignOut}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.alert} />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const QuestionnaireWrapper: React.FC<any> = ({ navigation }) => {
  const { user } = useAuth();
  const { refreshProfile } = useProfile();
  const [saving, setSaving] = React.useState(false);

  const handleComplete = async (answers: any) => {
    if (!user || saving) return;
    
    setSaving(true);
    try {
      const score = Object.values(answers).filter(Boolean).length;
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          questionnaire_score: score,
          questionnaire_answers: answers,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      await refreshProfile();
      
      // Navigate back to profile
      navigation.goBack();
    } catch (error) {
      console.error('Error updating questionnaire:', error);
      Alert.alert('Error', 'Failed to save questionnaire. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    // Just go back without saving
    navigation.goBack();
  };

  return (
    <QuestionnaireScreen 
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen 
        name="LetMeThink" 
        component={LetMeThinkScreen}
        options={{
          headerShown: true,
          headerTitle: 'Let Me Think',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#fff',
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
          } as any,
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen 
        name="Questionnaire" 
        component={QuestionnaireWrapper}
        options={{
          headerShown: true,
          headerTitle: 'Retake Personality Test',
          headerBackTitle: 'Back',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#fff',
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
          } as any,
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
