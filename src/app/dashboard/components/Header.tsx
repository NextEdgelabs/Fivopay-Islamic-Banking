'use client';

import BankingModeSwitcher from '@/components/BankingModeSwitcher';
import { useBankingMode } from '@/context/BankingModeContext';

export default function Header() {
  const { currentMode } = useBankingMode();
  
  return (
    <header className="bg-stripe-background-light border-b border-stripe-border h-20 flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold text-stripe-text">
          {currentMode === 'ethical' ? 'FivoPay Islamic Banking' : 'FivoPay Banking'}
        </h2>
        <p className="text-md text-stripe-text-secondary">
          {currentMode === 'ethical' ? 'Sharia-Compliant Banking Solutions' : 'Modern Banking as a Service'}
        </p>
      </div>
      
      <div className="flex items-center space-x-6">
        <BankingModeSwitcher size="sm" />
        
        <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
          <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
          <span className="text-sm font-semibold text-green-600">
            {currentMode === 'ethical' ? 'Sharia Compliant' : 'Fully Compliant'}
          </span>
        </div>
      </div>
    </header>
  );
}
