'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BankingMode, BankingModeConfig, BankingModeContextType, BANKING_MODES } from '@/types/banking-mode';

const BankingModeContext = createContext<BankingModeContextType | undefined>(undefined);

interface BankingModeProviderProps {
  children: ReactNode;
}

export function BankingModeProvider({ children }: BankingModeProviderProps) {
  const [currentMode, setCurrentMode] = useState<BankingMode>('ethical');

  // Load banking mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('bankingMode') as BankingMode;
    if (savedMode && (savedMode === 'ethical' || savedMode === 'conventional')) {
      setCurrentMode(savedMode);
    }
  }, []);

  // Save banking mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('bankingMode', currentMode);
  }, [currentMode]);

  const config = BANKING_MODES[currentMode];

  const switchMode = (mode: BankingMode) => {
    setCurrentMode(mode);
    // You can add analytics tracking here
  };

  const isFeatureEnabled = (feature: keyof BankingModeConfig['features']): boolean => {
    return config.features[feature];
  };

  const getProductTypes = (category: keyof BankingModeConfig['productTypes']): string[] => {
    // This method is deprecated - use ProductContext instead
    // Return empty array for backward compatibility
    return [];
  };

  const getComplianceRequirements = (): string[] => {
    return config.complianceRequirements;
  };

  const contextValue: BankingModeContextType = {
    currentMode,
    config,
    switchMode,
    isFeatureEnabled,
    getProductTypes,
    getComplianceRequirements,
  };

  return (
    <BankingModeContext.Provider value={contextValue}>
      {children}
    </BankingModeContext.Provider>
  );
}

export function useBankingMode(): BankingModeContextType {
  const context = useContext(BankingModeContext);
  if (context === undefined) {
    throw new Error('useBankingMode must be used within a BankingModeProvider');
  }
  return context;
}

// Hook to get mode-specific styling
export function useBankingModeStyles() {
  const { currentMode } = useBankingMode();
  
  return {
    primaryColor: currentMode === 'ethical' ? 'text-green-600' : 'text-blue-600',
    primaryBg: currentMode === 'ethical' ? 'bg-green-50' : 'bg-blue-50',
    accentColor: currentMode === 'ethical' ? 'text-emerald-600' : 'text-indigo-600',
    accentBg: currentMode === 'ethical' ? 'bg-emerald-50' : 'bg-indigo-50',
    badgeStyle: currentMode === 'ethical' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800',
    borderColor: currentMode === 'ethical' ? 'border-green-200' : 'border-blue-200',
  };
}