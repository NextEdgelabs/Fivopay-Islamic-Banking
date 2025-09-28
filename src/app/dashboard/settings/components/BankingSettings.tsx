'use client';

import { BuildingLibraryIcon } from '@heroicons/react/24/outline';

export default function BankingSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <BuildingLibraryIcon className="h-6 w-6 text-blue-600" />
          <span>Banking Settings</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Configure banking-specific settings and compliance requirements
        </p>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <BuildingLibraryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Banking Configuration</h3>
        <p className="text-gray-600">
          Banking settings including transaction limits, approval workflows, 
          compliance checks, and regulatory banking standards will be available here.
        </p>
      </div>
    </div>
  );
}