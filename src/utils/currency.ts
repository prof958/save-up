import { getCurrencyByCode } from '../constants/regions';

/**
 * Get currency symbol for a given currency code
 * @param currencyCode - Currency code (e.g., 'USD', 'EUR')
 * @returns Currency symbol (e.g., '$', '€')
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode);
  return currency?.symbol || '$'; // Fallback to $ if not found
};

/**
 * Format currency with user's selected currency symbol
 * @param amount - Amount to format
 * @param currencyCode - Currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 */
export const formatCurrencyWithCode = (amount: number, currencyCode: string): string => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Format large currency values with K/M suffixes using user's currency
 * @param amount - Amount to format
 * @param currencyCode - Currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string with K/M suffix
 */
export const formatCompactCurrencyWithCode = (amount: number, currencyCode: string): string => {
  const symbol = getCurrencySymbol(currencyCode);
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000) {
    const millions = amount / 1000000;
    return `${symbol}${millions.toFixed(millions >= 10 ? 1 : 2)}M`;
  }
  
  if (absAmount >= 1000) {
    const thousands = amount / 1000;
    return `${symbol}${thousands.toFixed(thousands >= 10 ? 0 : 1)}K`;
  }
  
  return formatCurrencyWithCode(amount, currencyCode);
};
