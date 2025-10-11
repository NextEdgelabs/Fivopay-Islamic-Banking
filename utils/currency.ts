/**
 * Centralized Currency Management System
 * Single source of truth for all currency-related operations
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimalPlaces: number;
  locale: string;
}

// Supported currencies
export const CURRENCIES: Record<string, Currency> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    decimalPlaces: 2,
    locale: 'en-IN',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimalPlaces: 2,
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimalPlaces: 2,
    locale: 'en-EU',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimalPlaces: 2,
    locale: 'en-GB',
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    decimalPlaces: 2,
    locale: 'ar-AE',
  },
  SAR: {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'Saudi Riyal',
    decimalPlaces: 2,
    locale: 'ar-SA',
  },
};

// Default currency (Indian Rupee for FivoPay)
export const DEFAULT_CURRENCY_CODE = 'INR';

/**
 * Get current currency from settings or use default
 */
export const getCurrentCurrency = (): Currency => {
  if (typeof window !== 'undefined') {
    try {
      const settings = localStorage.getItem('fivopay_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        const currencyCode = parsed?.system?.currency?.primary || DEFAULT_CURRENCY_CODE;
        return CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY_CODE];
      }
    } catch (error) {
      console.warn('Failed to get currency from settings:', error);
    }
  }
  return CURRENCIES[DEFAULT_CURRENCY_CODE];
};

/**
 * Format amount with current currency
 */
export const formatCurrency = (amount: number, currencyCode?: string): string => {
  const currency = currencyCode ? CURRENCIES[currencyCode] : getCurrentCurrency();
  
  if (!currency) {
    return amount.toLocaleString();
  }

  return amount.toLocaleString(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  });
};

/**
 * Format amount with currency symbol only
 */
export const formatCurrencySimple = (amount: number, currencyCode?: string): string => {
  const currency = currencyCode ? CURRENCIES[currencyCode] : getCurrentCurrency();
  
  if (!currency) {
    return amount.toLocaleString();
  }

  const formatted = amount.toLocaleString(currency.locale, {
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  });

  return `${currency.symbol}${formatted}`;
};

/**
 * Parse currency string to number
 */
export const parseCurrencyString = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currencyCode?: string): string => {
  const currency = currencyCode ? CURRENCIES[currencyCode] : getCurrentCurrency();
  return currency?.symbol || '₹';
};

/**
 * Get currency code
 */
export const getCurrencyCode = (): string => {
  return getCurrentCurrency().code;
};

/**
 * Convert amount between currencies (simplified - in production use real exchange rates)
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  // In production, fetch real-time exchange rates from an API
  // This is a simplified example
  const exchangeRates: Record<string, Record<string, number>> = {
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, AED: 0.044, SAR: 0.045, INR: 1 },
    USD: { INR: 83.0, EUR: 0.92, GBP: 0.79, AED: 3.67, SAR: 3.75, USD: 1 },
    EUR: { INR: 90.0, USD: 1.09, GBP: 0.86, AED: 4.0, SAR: 4.08, EUR: 1 },
    GBP: { INR: 105.0, USD: 1.27, EUR: 1.16, AED: 4.65, SAR: 4.75, GBP: 1 },
    AED: { INR: 22.6, USD: 0.27, EUR: 0.25, GBP: 0.22, SAR: 1.02, AED: 1 },
    SAR: { INR: 22.1, USD: 0.27, EUR: 0.24, GBP: 0.21, AED: 0.98, SAR: 1 },
  };

  const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
  return amount * rate;
};
