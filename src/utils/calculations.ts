import { 
  WEEKS_PER_YEAR, 
  HOURS_PER_WEEK, 
  MONTHS_PER_YEAR, 
  DEFAULT_ANNUAL_RETURN, 
  DEFAULT_INVESTMENT_YEARS,
  SalaryType 
} from '../constants';

/**
 * Calculate hourly wage from salary
 * @param salaryAmount - The salary amount
 * @param salaryType - 'monthly' or 'annual'
 * @returns Hourly wage rounded to 2 decimal places
 */
export const calculateHourlyWage = (
  salaryAmount: number, 
  salaryType: SalaryType
): number => {
  if (!salaryAmount || salaryAmount <= 0) return 0;
  
  const annualSalary = salaryType === 'monthly' 
    ? salaryAmount * MONTHS_PER_YEAR 
    : salaryAmount;
  
  const hourlyWage = annualSalary / (WEEKS_PER_YEAR * HOURS_PER_WEEK);
  return Math.round(hourlyWage * 100) / 100;
};

/**
 * Calculate work hours required for a purchase
 * @param itemCost - Cost of the item
 * @param hourlyWage - User's hourly wage
 * @returns Work hours rounded to 2 decimal places
 */
export const calculateWorkHours = (
  itemCost: number, 
  hourlyWage: number
): number => {
  if (!itemCost || !hourlyWage || hourlyWage <= 0) return 0;
  
  const workHours = itemCost / hourlyWage;
  return Math.round(workHours * 100) / 100;
};

/**
 * Calculate future investment value
 * @param amount - Investment amount
 * @param annualReturn - Annual return rate (default 7%)
 * @param years - Investment period in years (default 10)
 * @returns Future value rounded to 2 decimal places
 */
export const calculateInvestmentValue = (
  amount: number, 
  annualReturn: number = DEFAULT_ANNUAL_RETURN, 
  years: number = DEFAULT_INVESTMENT_YEARS
): number => {
  if (!amount || amount <= 0) return 0;
  
  const futureValue = amount * Math.pow(1 + annualReturn, years);
  return Math.round(futureValue * 100) / 100;
};

/**
 * Format currency for display
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Format hours for display
 * @param hours - Hours to format
 * @returns Formatted hours string
 */
export const formatHours = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return `${hours.toFixed(1)} hour${hours !== 1 ? 's' : ''}`;
};
