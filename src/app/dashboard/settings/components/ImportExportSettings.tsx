'use client';

import { useState } from 'react';
import { 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { UserSettings } from '../types';

interface ImportExportSettingsProps {
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function ImportExportSettings({ onToast }: ImportExportSettingsProps) {
  const { exportSettings, importSettings, resetSettings } = useSettings();
  const [isImporting, setIsImporting] = useState(false);

  const handleExportSettings = () => {
    try {
      const settings = exportSettings();
      if (!settings) {
        onToast('No settings to export', 'error');
        return;
      }

      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `fivopay-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      onToast('Settings exported successfully', 'success');
    } catch (error) {
      onToast('Failed to export settings', 'error');
    }
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const importedSettings: UserSettings = JSON.parse(result);
        
        // Basic validation
        if (!importedSettings.version || !importedSettings.theme) {
          onToast('Invalid settings file format', 'error');
          return;
        }
        
        importSettings(importedSettings);
        onToast('Settings imported successfully', 'success');
      } catch (error) {
        onToast('Failed to parse settings file', 'error');
      } finally {
        setIsImporting(false);
        // Reset the input
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      resetSettings();
      onToast('Settings reset to default values', 'info');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <ArrowDownTrayIcon className="h-6 w-6 text-blue-600" />
          <span>Data Management</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Import, export, and manage your settings data
        </p>
      </div>

      <div className="space-y-6">
        {/* Export Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <DocumentArrowDownIcon className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Export Settings</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Download your current settings as a JSON file for backup or sharing.
          </p>
          <button
            onClick={handleExportSettings}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export Settings</span>
          </button>
        </div>

        {/* Import Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <DocumentArrowUpIcon className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Import Settings</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Upload a previously exported settings file to restore your preferences.
          </p>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              disabled={isImporting}
              className="hidden"
              id="import-settings"
            />
            <label
              htmlFor="import-settings"
              className={`inline-flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg transition-colors ${
                isImporting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="h-4 w-4" />
                  <span>Import Settings</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Reset Settings */}
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Reset Settings</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Reset all settings to their default values. This action cannot be undone.
          </p>
          <button
            onClick={handleResetSettings}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span>Reset All Settings</span>
          </button>
        </div>

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Data Management Tips</h4>
              <ul className="text-blue-700 text-sm mt-1 space-y-1">
                <li>• Export your settings regularly as a backup</li>
                <li>• Settings files are portable between different devices</li>
                <li>• Import will override all current settings</li>
                <li>• Reset will restore factory defaults</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}