'use client';

import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function SystemSettings() {
  return (
    <div className="p-6">
            <div className="mb-6">
        <h2 className="text-2xl font-bold text-stripe-text flex items-center space-x-2">
          <GlobeAltIcon className="h-6 w-6 text-blue-600" />
          <span>System</span>
        </h2>
        <p className="text-stripe-text-secondary mt-2">
          System-wide configuration and settings
        </p>
      </div>

      <div className="bg-stripe-background-light border border-stripe-border rounded-lg p-8 text-center">
        <GlobeAltIcon className="h-12 w-12 text-stripe-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-stripe-text mb-2">System Configuration</h3>
        <p className="text-stripe-text-secondary">          Advanced system settings including backup schedules, audit levels, 
          currency settings, and integration preferences will be available here.
        </p>
      </div>
    </div>
  );
}