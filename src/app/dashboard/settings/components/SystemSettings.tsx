'use client';

import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function SystemSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <GlobeAltIcon className="h-6 w-6 text-blue-600" />
          <span>System Settings</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Configure system-wide settings and preferences
        </p>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">System Configuration</h3>
        <p className="text-gray-600">
          Advanced system settings including backup schedules, audit levels, 
          currency settings, and integration preferences will be available here.
        </p>
      </div>
    </div>
  );
}