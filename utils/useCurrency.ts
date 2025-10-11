'use client';

import { useEffect, useState } from 'react';
import { Currency, getCurrentCurrency, formatCurrency as formatCurrencyUtil, getCurrencySymbol, getCurrencyCode } from './currency';

/**
 * React hook for currency management
 * Provides easy access to currency settings and formatting functions
 */
export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>(getCurrentCurrency());

  useEffect(() => {
    // Update currency when settings change
    const handleStorageChange = () => {
      setCurrency(getCurrentCurrency());
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom currency change events
    window.addEventListener('currencyChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('currencyChanged', handleStorageChange);
    };
  }, []);

  const formatCurrency = (amount: number): string => {
    return formatCurrencyUtil(amount, currency.code);
  };

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString(currency.locale, {
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces,
    });
  };

  return {
    currency,
    formatCurrency,
    formatAmount,
    symbol: currency.symbol,
    code: currency.code,
    getCurrencySymbol,
    getCurrencyCode,
  };
};
