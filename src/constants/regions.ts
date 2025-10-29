// Currency and region data

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Region {
  code: string;
  name: string;
  currency: string; // Default currency for this region
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
];

export const REGIONS: Region[] = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'TR', name: 'Turkey', currency: 'TRY' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return CURRENCIES.find((c) => c.code === code);
};

export const getRegionByCode = (code: string): Region | undefined => {
  return REGIONS.find((r) => r.code === code);
};

export const getDefaultCurrencyForRegion = (regionCode: string): string => {
  const region = getRegionByCode(regionCode);
  return region?.currency || 'USD';
};
