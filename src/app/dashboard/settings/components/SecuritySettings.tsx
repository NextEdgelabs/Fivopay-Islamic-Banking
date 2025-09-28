'use client';

import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function SecuritySettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
          <span>Security Settings</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your security preferences and authentication methods
        </p>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
        <p className="text-gray-600">
          Advanced security configuration coming soon. This will include password policies, 
          two-factor authentication, session management, and IP whitelisting.
        </p>
      </div>
    </div>
  );
}