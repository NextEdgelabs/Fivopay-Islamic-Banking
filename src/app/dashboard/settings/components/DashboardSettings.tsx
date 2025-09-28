'use client';

import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function DashboardSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <ChartBarIcon className="h-6 w-6 text-blue-600" />
          <span>Dashboard Settings</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Customize your dashboard layout and widget preferences
        </p>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Layout</h3>
        <p className="text-gray-600">
          Dashboard customization including widget arrangement, layout preferences, 
          refresh intervals, and default views will be configurable here.
        </p>
      </div>
    </div>
  );
}