'use client';

import React from 'react';
import { useBankingMode } from '@/context/BankingModeContext';
import { BankingMode } from '@/types/banking-mode';
import { 
  BuildingLibraryIcon,
  HeartIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

interface BankingModeSwitcherProps {
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BankingModeSwitcher({ 
  showDetails = false, 
  size = 'md',
  className = '' 
}: BankingModeSwitcherProps) {
  const { currentMode, config, switchMode } = useBankingMode();

  const handleToggle = () => {
    const newMode: BankingMode = currentMode === 'ethical' ? 'conventional' : 'ethical';
    switchMode(newMode);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {currentMode === 'ethical' ? (
            <HeartIcon className="h-5 w-5 text-green-600" />
          ) : (
            <BuildingLibraryIcon className="h-5 w-5 text-blue-600" />
          )}
          
          <div>
            <label className={`font-medium text-stripe-text ${sizeClasses[size]}`}>
              {config.displayName}
            </label>
            {showDetails && (
              <p className="text-xs text-stripe-text-secondary mt-1">
                {config.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-sm ${currentMode === 'conventional' ? 'text-stripe-text' : 'text-stripe-text-secondary'}`}>
            Conventional
          </span>
          
          <button
            onClick={handleToggle}
            className={`${
              currentMode === 'ethical' ? 'bg-green-600' : 'bg-blue-600'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              currentMode === 'ethical' ? 'focus:ring-green-500' : 'focus:ring-blue-500'
            }`}
            aria-pressed={currentMode === 'ethical'}
            aria-label="Toggle banking mode"
          >
            <span
              className={`${
                currentMode === 'ethical' ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          
          <span className={`text-sm ${currentMode === 'ethical' ? 'text-stripe-text' : 'text-stripe-text-secondary'}`}>
            Ethical
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 p-4 bg-stripe-background-light rounded-lg border border-stripe-border">
          <div className="flex items-start space-x-2 mb-3">
            <InformationCircleIcon className="h-4 w-4 text-stripe-text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-stripe-text mb-2">Key Principles</h4>
              <ul className="text-xs text-stripe-text-secondary space-y-1">
                {config.principles.map((principle, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{principle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-stripe-border pt-3">
            <h4 className="text-sm font-medium text-stripe-text mb-2">Available Products</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-stripe-text-secondary">Deposits:</span>
                <ul className="text-stripe-text-secondary ml-2">
                  {config.productTypes.deposits.slice(0, 2).map((product, index) => (
                    <li key={index}>• {product}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium text-stripe-text-secondary">Loans:</span>
                <ul className="text-stripe-text-secondary ml-2">
                  {config.productTypes.loans.slice(0, 2).map((product, index) => (
                    <li key={index}>• {product}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}