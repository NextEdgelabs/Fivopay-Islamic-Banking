'use client';

import { useState } from 'react';
import { GlobeAltIcon, CurrencyRupeeIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { CURRENCIES } from '../../../../../utils/currency';

export default function SystemSettings() {
  const { state, updateSystem } = useSettings();
  const settings = state.settings;
  
  const [tempSettings, setTempSettings] = useState({
    currency: settings?.system.currency.primary || 'INR',
    backupFrequency: settings?.system.backupFrequency || 'daily',
    auditLevel: settings?.system.auditLevel || 'detailed'
  });

  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = CURRENCIES[currencyCode];
    if (selectedCurrency) {
      setTempSettings(prev => ({ ...prev, currency: currencyCode }));
      updateSystem({ 
        currency: {
          primary: currencyCode,
          decimalPlaces: selectedCurrency.decimalPlaces,
          symbol: selectedCurrency.symbol
        }
      });
    }
  };

  const handleBackupFrequencyChange = (frequency: 'daily' | 'weekly' | 'monthly') => {
    setTempSettings(prev => ({ ...prev, backupFrequency: frequency }));
    updateSystem({ backupFrequency: frequency });
  };

  const handleAuditLevelChange = (level: 'basic' | 'detailed' | 'comprehensive') => {
    setTempSettings(prev => ({ ...prev, auditLevel: level }));
    updateSystem({ auditLevel: level });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stripe-text flex items-center space-x-2">
          <GlobeAltIcon className="h-6 w-6 text-blue-600" />
          <span>System Settings</span>
        </h2>
        <p className="text-stripe-text-secondary mt-2">
          System-wide configuration and settings
        </p>
      </div>

      <div className="space-y-8">
        {/* Currency Settings */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
            <CurrencyRupeeIcon className="h-5 w-5 text-gray-600" />
            <span>Currency</span>
          </label>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Select the primary currency for all financial transactions and displays across the application.
            </p>
            <select
              value={tempSettings.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(CURRENCIES).map(([code, currency]) => (
                <option key={code} value={code}>
                  {currency.symbol} {currency.name} ({code})
                </option>
              ))}
            </select>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Current Currency:</strong> {CURRENCIES[tempSettings.currency]?.symbol} {CURRENCIES[tempSettings.currency]?.name}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                All amounts will be displayed in {CURRENCIES[tempSettings.currency]?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
            <BanknotesIcon className="h-5 w-5 text-gray-600" />
            <span>Backup Frequency</span>
          </label>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="space-y-3">
              {[
                { value: 'daily', label: 'Daily', description: 'Automatic backup every day' },
                { value: 'weekly', label: 'Weekly', description: 'Automatic backup every week' },
                { value: 'monthly', label: 'Monthly', description: 'Automatic backup every month' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    tempSettings.backupFrequency === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="backupFrequency"
                    value={option.value}
                    checked={tempSettings.backupFrequency === option.value}
                    onChange={(e) => handleBackupFrequencyChange(e.target.value as any)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900 block">{option.label}</span>
                    <span className="text-sm text-gray-500">{option.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Level Settings */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
            <GlobeAltIcon className="h-5 w-5 text-gray-600" />
            <span>Audit Level</span>
          </label>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="space-y-3">
              {[
                { value: 'basic', label: 'Basic', description: 'Log only critical operations' },
                { value: 'detailed', label: 'Detailed', description: 'Log most operations (recommended)' },
                { value: 'comprehensive', label: 'Comprehensive', description: 'Log all operations' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    tempSettings.auditLevel === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="auditLevel"
                    value={option.value}
                    checked={tempSettings.auditLevel === option.value}
                    onChange={(e) => handleAuditLevelChange(e.target.value as any)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900 block">{option.label}</span>
                    <span className="text-sm text-gray-500">{option.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}