'use client';

import { useState } from 'react';
import { OrganizationSettings as OrganizationSettingsType } from '../types';

interface OrganizationSettingsProps {
  settings: OrganizationSettingsType;
  onUpdate: (settings: Partial<OrganizationSettingsType>) => void;
}

export default function OrganizationSettings({ settings, onUpdate }: OrganizationSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (field: keyof OrganizationSettingsType, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    onUpdate({ [field]: value });
  };

  const handleNestedChange = (
    parent: keyof OrganizationSettingsType,
    field: string,
    value: any
  ) => {
    const currentParent = localSettings[parent] as Record<string, any>;
    const updated = {
      ...localSettings,
      [parent]: {
        ...currentParent,
        [field]: value,
      },
    };
    setLocalSettings(updated);
    onUpdate({ [parent]: updated[parent] });
  };

  return (
    <div className="space-y-6">
      {/* Banking Model Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Model</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Banking Model
            </label>
            <select
              value={localSettings.bankingModel}
              onChange={(e) => handleChange('bankingModel', e.target.value as 'ethical' | 'conventional')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ethical">Ethical Banking</option>
              <option value="conventional">Conventional Banking</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {localSettings.bankingModel === 'ethical' 
                ? 'Sharia-compliant banking following Islamic principles'
                : 'Traditional banking with interest-based products'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Organization Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={localSettings.organizationName}
              onChange={(e) => handleChange('organizationName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter organization name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Code
            </label>
            <input
              type="text"
              value={localSettings.organizationCode}
              onChange={(e) => handleChange('organizationCode', e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ORG001"
              maxLength={10}
            />
          </div>
        </div>
      </div>

      {/* Compliance Framework */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Framework</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Regulatory Compliance</label>
              <p className="text-sm text-gray-500">Follow generic banking principles</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.complianceFramework.regulatoryCompliance}
                onChange={(e) => handleNestedChange('complianceFramework', 'regulatoryCompliance', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Conventional Regulations</label>
              <p className="text-sm text-gray-500">Traditional banking regulations compliance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.complianceFramework.conventionalRegulations}
                onChange={(e) => handleNestedChange('complianceFramework', 'conventionalRegulations', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Hybrid Model</label>
              <p className="text-sm text-gray-500">Support both banking models</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.complianceFramework.hybridModel}
                onChange={(e) => handleNestedChange('complianceFramework', 'hybridModel', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Branding Settings */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding & Display</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={localSettings.branding.displayName}
              onChange={(e) => handleNestedChange('branding', 'displayName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Public display name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={localSettings.branding.tagline}
              onChange={(e) => handleNestedChange('branding', 'tagline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your banking tagline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Banking Terms
            </label>
            <select
              value={localSettings.branding.primaryBankingTerms}
              onChange={(e) => handleNestedChange('branding', 'primaryBankingTerms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ethical">Ethical Banking Terms</option>
              <option value="generic">Generic Banking Terms</option>
              <option value="conventional">Conventional Banking Terms</option>
            </select>
          </div>
        </div>
      </div>

      {/* Operational Mode */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Interest-Based Products</label>
              <p className="text-sm text-gray-500">Traditional loans and deposits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.operationalMode.interestBasedProducts}
                onChange={(e) => handleNestedChange('operationalMode', 'interestBasedProducts', e.target.checked)}
                className="sr-only peer"
                disabled={localSettings.bankingModel === 'ethical' && localSettings.complianceFramework.regulatoryCompliance}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Investment Products</label>
              <p className="text-sm text-gray-500">Fixed & Variable Return Products</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.operationalMode.profitSharingProducts}
                onChange={(e) => handleNestedChange('operationalMode', 'profitSharingProducts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Investment Bonds</label>
              <p className="text-sm text-gray-500">investment certificates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.operationalMode.investmentBonds}
                onChange={(e) => handleNestedChange('operationalMode', 'investmentBonds', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Conventional Loans</label>
              <p className="text-sm text-gray-500">Traditional lending products</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.operationalMode.conventionalLoans}
                onChange={(e) => handleNestedChange('operationalMode', 'conventionalLoans', e.target.checked)}
                className="sr-only peer"
                disabled={localSettings.bankingModel === 'ethical' && localSettings.complianceFramework.regulatoryCompliance}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {localSettings.bankingModel === 'ethical' && localSettings.complianceFramework.regulatoryCompliance && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Interest-based products and conventional loans are disabled when regulatory compliance is enabled in ethical banking mode.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}