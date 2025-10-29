// Questionnaire questions and scoring

export interface Question {
  id: string;
  text: string;
  key: keyof import('../config/supabase').QuestionnaireAnswers;
}

export const QUESTIONNAIRE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    key: 'q1_unplanned_purchases',
    text: 'Do you often buy things that weren\'t on your list or plan?',
  },
  {
    id: 'q2',
    key: 'q2_sale_urgency',
    text: 'When you see a sale or discount, do you feel the urge to buy immediately?',
  },
  {
    id: 'q3',
    key: 'q3_purchase_regret',
    text: 'Do you ever feel regret or guilt soon after making a purchase?',
  },
  {
    id: 'q4',
    key: 'q4_emotional_shopping',
    text: 'Do you shop when you\'re stressed, bored, or upset?',
  },
  {
    id: 'q5',
    key: 'q5_no_price_comparison',
    text: 'Do you rarely compare prices or wait before buying something you want?',
  },
  {
    id: 'q6',
    key: 'q6_reward_justification',
    text: 'Do you often justify purchases as "rewards" for yourself?',
  },
  {
    id: 'q7',
    key: 'q7_unused_items',
    text: 'Do you have unopened or unused items at home?',
  },
];

export interface QuestionnaireResult {
  score: number;
  level: 'low' | 'moderate' | 'high';
  title: string;
  message: string;
  emoji: string;
}

export const getQuestionnaireResult = (score: number): QuestionnaireResult => {
  if (score <= 2) {
    return {
      score,
      level: 'low',
      title: 'Mindful Spender',
      message: 'Great job! You already practice mindful spending habits. This app will help you stay on track and make even more informed decisions.',
      emoji: '🎯',
    };
  } else if (score <= 3) {
    return {
      score,
      level: 'moderate',
      title: 'Occasional Impulse Buyer',
      message: 'You\'re doing well but have room for improvement. This app will help you pause and think before making purchases.',
      emoji: '💭',
    };
  } else {
    return {
      score,
      level: 'high',
      title: 'Impulsive Spender',
      message: 'Don\'t worry - recognizing the pattern is the first step! This app is designed specifically to help you make more thoughtful spending decisions.',
      emoji: '💪',
    };
  }
};
