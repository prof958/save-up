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

/**
 * Format large currency values with K/M suffixes for compact display
 * @param amount - Amount to format
 * @returns Formatted currency string with K/M suffix
 * @example formatCompactCurrency(75036) → "$75K"
 * @example formatCompactCurrency(1500000) → "$1.5M"
 */
export const formatCompactCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000) {
    const millions = amount / 1000000;
    return `$${millions.toFixed(millions >= 10 ? 1 : 2)}M`;
  }
  
  if (absAmount >= 1000) {
    const thousands = amount / 1000;
    return `$${thousands.toFixed(thousands >= 10 ? 0 : 1)}K`;
  }
  
  return formatCurrency(amount);
};

/**
 * Format large hour values with K suffix for compact display
 * @param hours - Hours to format
 * @returns Formatted hours string with K suffix
 * @example formatCompactHours(1500) → "1.5K hrs"
 */
export const formatCompactHours = (hours: number): string => {
  const absHours = Math.abs(hours);
  
  if (absHours >= 1000) {
    const thousands = hours / 1000;
    return `${thousands.toFixed(thousands >= 10 ? 0 : 1)}K hrs`;
  }
  
  if (absHours >= 100) {
    return `${Math.round(hours)} hrs`;
  }
  
  // For small values (< 100), always show as hours, not minutes
  if (absHours < 1) {
    return `${hours.toFixed(1)} hrs`;
  }
  
  return `${hours.toFixed(1)} hrs`;
};

/**
 * Format input number with commas as user types
 * @param value - Raw input string
 * @returns Formatted number string with commas
 * @example formatNumberInput("2345") → "2,345"
 */
export const formatNumberInput = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  
  // Handle multiple decimal points
  const parts = cleaned.split('.');
  const integerPart = parts[0] || '0';
  const decimalPart = parts[1] || '';
  
  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Return with decimal part if exists
  if (parts.length > 1) {
    return `${formattedInteger}.${decimalPart.slice(0, 2)}`;
  }
  
  return formattedInteger;
};

/**
 * Parse formatted number input back to raw number
 * @param formatted - Formatted number string
 * @returns Raw number
 * @example parseNumberInput("2,345.00") → 2345
 */
export const parseNumberInput = (formatted: string): number => {
  const cleaned = formatted.replace(/,/g, '');
  const number = parseFloat(cleaned);
  return isNaN(number) ? 0 : number;
};
