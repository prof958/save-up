// App constants

// Calculation constants
export const WEEKS_PER_YEAR = 52;
export const HOURS_PER_WEEK = 40;
export const MONTHS_PER_YEAR = 12;

// Investment calculation defaults
export const DEFAULT_ANNUAL_RETURN = 0.07; // 7%
export const DEFAULT_INVESTMENT_YEARS = 10;

// Salary types
export const SALARY_TYPE = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
} as const;

export type SalaryType = typeof SALARY_TYPE[keyof typeof SALARY_TYPE];

// Decision types
export const DECISION_TYPE = {
  BUY: 'buy',
  DONT_BUY: 'dont_buy',
  THINK: 'think',
} as const;

export type DecisionType = typeof DECISION_TYPE[keyof typeof DECISION_TYPE];
