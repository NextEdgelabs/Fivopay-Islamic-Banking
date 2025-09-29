'use client';

import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  PaintBrushIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  SwatchIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export default function AppearanceSettings() {
  const { state, updateTheme } = useSettings();
  const settings = state.settings;
  const [tempSettings, setTempSettings] = useState({
    mode: settings?.theme.mode || 'light',
    primaryColor: settings?.theme.primaryColor || '#3B82F6',
    fontSize: settings?.theme.fontSize || 'medium'
  });

  const handleThemeModeChange = (mode: 'light' | 'dark' | 'system') => {
    setTempSettings(prev => ({ ...prev, mode }));
    updateTheme({ mode });
  };

  const handleColorChange = (primaryColor: string) => {
    setTempSettings(prev => ({ ...prev, primaryColor }));
    updateTheme({ primaryColor });
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    setTempSettings(prev => ({ ...prev, fontSize }));
    updateTheme({ fontSize });
  };

  const themeOptions = [
    { 
      value: 'light', 
      label: 'Light Mode', 
      icon: SunIcon,
      description: 'Clean and bright interface',
      preview: 'bg-white border-gray-200'
    },
    { 
      value: 'dark', 
      label: 'Dark Mode', 
      icon: MoonIcon,
      description: 'Easy on the eyes in low light',
      preview: 'bg-gray-900 border-gray-700'
    },
    { 
      value: 'system', 
      label: 'System', 
      icon: ComputerDesktopIcon,
      description: 'Follows your system preference',
      preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400'
    }
  ];

  const colorOptions = [
    { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
    { name: 'Green', value: '#10B981', class: 'bg-green-500' },
    { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
    { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
    { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' },
    { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
    { name: 'Orange', value: '#F97316', class: 'bg-orange-500' },
    { name: 'Teal', value: '#14B8A6', class: 'bg-teal-500' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small', description: 'Compact interface', size: 'text-sm' },
    { value: 'medium', label: 'Medium', description: 'Default size', size: 'text-base' },
    { value: 'large', label: 'Large', description: 'Easier to read', size: 'text-lg' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stripe-text flex items-center space-x-2">
          <PaintBrushIcon className="h-6 w-6 text-blue-600" />
          <span>Appearance</span>
        </h2>
        <p className="text-stripe-text-secondary mt-2">
          Customize the look and feel of your application
        </p>
      </div>

      <div className="space-y-8">
        {/* Theme Mode */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-stripe-text mb-4">
            <SunIcon className="h-5 w-5 text-stripe-text-secondary" />
            <span>Theme Mode</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((theme) => {
              const Icon = theme.icon;
              return (
                <label
                  key={theme.value}
                  className={`relative cursor-pointer`}
                >
                  <input
                    type="radio"
                    name="themeMode"
                    value={theme.value}
                    checked={tempSettings.mode === theme.value}
                    onChange={(e) => handleThemeModeChange(e.target.value as 'light' | 'dark' | 'system')}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 transition-colors ${
                    tempSettings.mode === theme.value
                      ? 'border-stripe-primary bg-stripe-background-light'
                      : 'border-stripe-border hover:border-stripe-text-secondary'
                  }`}>
                    <div className={`w-full h-20 rounded-md mb-3 border ${theme.preview}`}></div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="h-5 w-5 text-stripe-text-secondary" />
                      <span className="font-medium text-stripe-text">{theme.label}</span>
                    </div>
                    <p className="text-sm text-stripe-text-secondary">{theme.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-stripe-text mb-4">
            <SwatchIcon className="h-5 w-5 text-stripe-text-secondary" />
            <span>Primary Color</span>
          </label>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {colorOptions.map((color) => (
              <label
                key={color.value}
                className="cursor-pointer group"
              >
                <input
                  type="radio"
                  name="primaryColor"
                  value={color.value}
                  checked={tempSettings.primaryColor === color.value}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-12 h-12 rounded-lg ${color.class} relative transition-transform group-hover:scale-110 ${
                  tempSettings.primaryColor === color.value ? 'ring-4 ring-gray-300 scale-110' : ''
                }`}>
                  {tempSettings.primaryColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-stripe-text-secondary mt-1 text-center">{color.name}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-stripe-text mb-4">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-stripe-text-secondary" />
            <span>Font Size</span>
          </label>
          <div className="space-y-3">
            {fontSizeOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  tempSettings.fontSize === option.value
                    ? 'border-stripe-primary bg-stripe-background-light'
                    : 'border-stripe-border hover:border-stripe-text-secondary'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="fontSize"
                    value={option.value}
                    checked={tempSettings.fontSize === option.value}
                    onChange={(e) => handleFontSizeChange(e.target.value as 'small' | 'medium' | 'large')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-stripe-text">{option.label}</div>
                    <div className="text-sm text-stripe-text-secondary">{option.description}</div>
                  </div>
                </div>
                <div className={`${option.size} text-stripe-text`}>
                  Sample Text (Aa)
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-stripe-background-light border border-stripe-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-stripe-text mb-4">Preview</h3>
          <div 
            className="border-2 rounded-lg p-4 bg-white"
            style={{ 
              borderColor: tempSettings.primaryColor,
              fontSize: tempSettings.fontSize === 'small' ? '14px' : tempSettings.fontSize === 'large' ? '18px' : '16px'
            }}
          >
            <div className="flex items-center space-x-2 mb-3">
              <div 
                className="w-6 h-6 rounded"
                style={{ backgroundColor: tempSettings.primaryColor }}
              ></div>
              <span className="font-medium">FivoPay Digital Banking</span>
            </div>
            <p className="text-gray-600">
              This is how your interface will look with the selected theme settings. 
              The primary color will be used for buttons, links, and highlights throughout the application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}