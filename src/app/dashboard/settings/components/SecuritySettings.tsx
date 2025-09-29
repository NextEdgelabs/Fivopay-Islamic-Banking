'use client';

import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function SecuritySettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stripe-text flex items-center space-x-2">
          <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
          <span>Security</span>
        </h2>
        <p className="text-stripe-text-secondary mt-2">
          Security settings and access controls
        </p>
      </div>

      <div className="bg-stripe-background-light border border-stripe-border rounded-lg p-8 text-center">
        <ShieldCheckIcon className="h-12 w-12 text-stripe-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-stripe-text mb-2">Security Settings</h3>
        <p className="text-stripe-text-secondary">
          Advanced security configuration and access control settings coming soon.
        </p>
      </div>
    </div>
  );
}