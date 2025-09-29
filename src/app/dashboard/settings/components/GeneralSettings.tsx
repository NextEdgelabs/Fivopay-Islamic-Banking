'use client';

import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  UserIcon, 
  InformationCircleIcon,
  LanguageIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function GeneralSettings() {
  const { state, updateSystem } = useSettings();
  const settings = state.settings;
  const [tempSettings, setTempSettings] = useState({
    language: settings?.system.language || 'en',
    timezone: settings?.system.timezone || 'Asia/Kolkata',
    dateFormat: settings?.system.dateFormat || 'DD/MM/YYYY'
  });

  const handleLanguageChange = (language: string) => {
    const validLanguage = language as 'en' | 'hi';
    setTempSettings(prev => ({ ...prev, language: validLanguage }));
    updateSystem({ language: validLanguage });
  };

  const handleTimezoneChange = (timezone: string) => {
    setTempSettings(prev => ({ ...prev, timezone }));
    updateSystem({ timezone });
  };

  const handleDateFormatChange = (dateFormat: string) => {
    const validDateFormat = dateFormat as 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    setTempSettings(prev => ({ ...prev, dateFormat: validDateFormat }));
    updateSystem({ dateFormat: validDateFormat });
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  const timezones = [
    { value: 'Asia/Kolkata', label: 'India (GMT+5:30)' },
    { value: 'Asia/Riyadh', label: 'Saudi Arabia (GMT+3)' },
    { value: 'Asia/Karachi', label: 'Pakistan (GMT+5)' },
    { value: 'Asia/Kolkata', label: 'India (GMT+5:30)' },
    { value: 'Europe/London', label: 'London (GMT+0)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' }
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <UserIcon className="h-6 w-6 text-blue-600" />
          <span>General Settings</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Configure basic application preferences and regional settings
        </p>
      </div>

      <div className="space-y-8">
        {/* Language Settings */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
            <LanguageIcon className="h-5 w-5 text-gray-600" />
            <span>Language</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {languages.map((lang) => (
              <label
                key={lang.code}
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  tempSettings.language === lang.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value={lang.code}
                  checked={tempSettings.language === lang.code}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium text-gray-900">{lang.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Timezone Settings */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
            <ClockIcon className="h-5 w-5 text-gray-600" />
            <span>Timezone</span>
          </label>
          <select
            value={tempSettings.timezone}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Format Settings */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
            <MapPinIcon className="h-5 w-5 text-gray-600" />
            <span>Date Format</span>
          </label>
          <div className="space-y-3">
            {dateFormats.map((format) => (
              <label
                key={format.value}
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  tempSettings.dateFormat === format.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="dateFormat"
                  value={format.value}
                  checked={tempSettings.dateFormat === format.value}
                  onChange={(e) => handleDateFormatChange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-900">{format.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Regional Settings</h4>
              <p className="text-blue-700 text-sm mt-1">
                These settings affect how dates, times, and other regional information is displayed throughout the application.
                Language changes may require a page refresh to take full effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}