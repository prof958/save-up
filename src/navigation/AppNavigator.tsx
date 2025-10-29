import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SpendingScreen from '../screens/SpendingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../constants/theme';

export type RootTabParamList = {
  Home: undefined;
  Spending: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.inactive,
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
            backgroundColor: colors.background,
          },
          headerStyle: {
            backgroundColor: colors.dark,
          },
          headerTintColor: colors.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            headerTitle: 'Save Up',
          }}
        />
        <Tab.Screen 
          name="Spending" 
          component={SpendingScreen}
          options={{
            tabBarLabel: 'Spending',
            headerTitle: 'Spending Calculator',
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            headerTitle: 'Profile',
          }}
        />
      </Tab.Navigator>
  );
};

export default AppNavigator;
