import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import SalaryInputScreen from '../screens/onboarding/SalaryInputScreen';
import QuestionnaireScreen from '../screens/onboarding/QuestionnaireScreen';
import ResultsScreen from '../screens/onboarding/ResultsScreen';
import { QuestionnaireAnswers } from '../config/supabase';
import { onboardingRefreshTrigger } from '../../App';

export type OnboardingStackParamList = {
  Welcome: undefined;
  SalaryInput: undefined;
  Questionnaire: { salary: number; salaryType: string; currency: string; region: string };
  Results: { 
    salary: number; 
    salaryType: string; 
    currency: string; 
    region: string; 
    score: number; 
    answers: QuestionnaireAnswers 
  };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

type WelcomeProps = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;
type SalaryInputProps = NativeStackScreenProps<OnboardingStackParamList, 'SalaryInput'>;
type QuestionnaireProps = NativeStackScreenProps<OnboardingStackParamList, 'Questionnaire'>;
type ResultsProps = NativeStackScreenProps<OnboardingStackParamList, 'Results'>;

const WelcomeWrapper: React.FC<WelcomeProps> = ({ navigation }) => {
  return (
    <WelcomeScreen 
      onContinue={() => navigation.navigate('SalaryInput')} 
    />
  );
};

const SalaryInputWrapper: React.FC<SalaryInputProps> = ({ navigation }) => {
  return (
    <SalaryInputScreen 
      onContinue={(data) => navigation.navigate('Questionnaire', data)} 
    />
  );
};

const QuestionnaireWrapper: React.FC<QuestionnaireProps> = ({ navigation, route }) => {
  const { salary, salaryType, currency, region } = route.params;
  
  const calculateScore = (answers: QuestionnaireAnswers): number => {
    return Object.values(answers).filter(Boolean).length;
  };
  
  return (
    <QuestionnaireScreen 
      onComplete={(answers) => {
        const score = calculateScore(answers);
        navigation.navigate('Results', { salary, salaryType, currency, region, score, answers });
      }}
      onSkip={() => 
        navigation.navigate('Results', { 
          salary, 
          salaryType, 
          currency, 
          region, 
          score: 0, 
          answers: {
            q1_unplanned_purchases: false,
            q2_sale_urgency: false,
            q3_purchase_regret: false,
            q4_emotional_shopping: false,
            q5_no_price_comparison: false,
            q6_reward_justification: false,
            q7_unused_items: false,
          }
        })
      }
    />
  );
};

const ResultsWrapper: React.FC<ResultsProps> = ({ route }) => {
  const { salary, salaryType, currency, region, score, answers } = route.params;
  const { user } = useAuth();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleContinue = async () => {
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update({
            salary_amount: salary,
            salary_type: salaryType,
            currency,
            region,
            questionnaire_score: score,
            questionnaire_answers: answers,
            onboarding_completed: true,
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating profile:', error);
          throw error;
        }
      } else {
        // Create new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            salary_amount: salary,
            salary_type: salaryType,
            currency,
            region,
            questionnaire_score: score,
            questionnaire_answers: answers,
            onboarding_completed: true,
          });

        if (error) {
          console.error('Error creating profile:', error);
          throw error;
        }
      }
      
      // Give database a moment to process
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Trigger immediate refresh of onboarding status
      await onboardingRefreshTrigger.current();
      
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      setIsSaving(false);
      alert('Failed to save your profile. Please try again.');
    }
  };

  return (
    <ResultsScreen 
      score={score}
      onContinue={handleContinue}
      isLoading={isSaving}
    />
  );
};

const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeWrapper} />
      <Stack.Screen name="SalaryInput" component={SalaryInputWrapper} />
      <Stack.Screen name="Questionnaire" component={QuestionnaireWrapper} />
      <Stack.Screen name="Results" component={ResultsWrapper} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
