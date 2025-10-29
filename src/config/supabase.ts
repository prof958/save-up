import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types for database tables
export interface QuestionnaireAnswers {
  q1_unplanned_purchases: boolean;
  q2_sale_urgency: boolean;
  q3_purchase_regret: boolean;
  q4_emotional_shopping: boolean;
  q5_no_price_comparison: boolean;
  q6_reward_justification: boolean;
  q7_unused_items: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  salary_amount: number;
  salary_type: 'monthly' | 'annual';
  hourly_wage: number;
  currency: string;
  region: string | null;
  questionnaire_score: number;
  questionnaire_answers: QuestionnaireAnswers | null;
  onboarding_completed: boolean;
  // Stats (stored in DB for sync/display)
  total_money_saved: number;
  total_hours_saved: number;
  total_decisions: number;
  buy_count: number;
  dont_buy_count: number;
  save_count: number;
  let_me_think_count: number;
  created_at: string;
  updated_at: string;
}

export type DecisionType = 'buy' | 'dont_buy' | 'save' | 'let_me_think';

// Local storage interface for decisions (stored in AsyncStorage)
export interface SpendingDecision {
  id: string; // Generated locally
  item_name: string | null;
  item_price: number;
  work_hours: number;
  investment_value: number;
  decision_type: DecisionType;
  remind_at: string | null; // ISO timestamp for "let_me_think" reminders
  created_at: string; // ISO timestamp
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'hourly_wage' | 'created_at' | 'updated_at' | 'questionnaire_score' | 'total_money_saved' | 'total_hours_saved' | 'total_decisions' | 'buy_count' | 'dont_buy_count' | 'save_count' | 'let_me_think_count'> & {
          questionnaire_score?: number;
          total_money_saved?: number;
          total_hours_saved?: number;
          total_decisions?: number;
          buy_count?: number;
          dont_buy_count?: number;
          save_count?: number;
          let_me_think_count?: number;
        };
        Update: Partial<Omit<UserProfile, 'id' | 'user_id' | 'hourly_wage' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
