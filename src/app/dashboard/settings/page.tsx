'use client';

import { useState } from 'react';
import {
  CogIcon,
  PaintBrushIcon,
  BellIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useSettings } from './context/SettingsContext';
import { SettingsCategory } from './types';

// Import settings components
import GeneralSettings from './components/GeneralSettings';
import AppearanceSettings from './components/AppearanceSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import BankingSettings from './components/BankingSettings';
import DashboardSettings from './components/DashboardSettings';
import SystemSettings from './components/SystemSettings';
import OrganizationSettings from './components/OrganizationSettings';
import ImportExportSettings from './components/ImportExportSettings';

// Settings categories configuration
const SETTINGS_CATEGORIES: Array<{
  id: SettingsCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    id: 'general',
    label: 'General',
    icon: CogIcon,
    description: 'Basic application preferences'
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: PaintBrushIcon,
    description: 'Theme, colors, and visual settings'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: BellIcon,
    description: 'Email, SMS, and push notification preferences'
  },
  {
    id: 'security',
    label: 'Security',
    icon: ShieldCheckIcon,
    description: 'Password, authentication, and access control'
  },
  {
    id: 'banking',
    label: 'Banking',
    icon: BuildingLibraryIcon,
    description: 'Transaction limits and compliance settings'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: ChartBarIcon,
    description: 'Layout, widgets, and display preferences'
  },
  {
    id: 'system',
    label: 'System',
    icon: GlobeAltIcon,
    description: 'Language, timezone, and regional settings'
  },
  {
    id: 'organization',
    label: 'Organization',
    icon: BuildingOfficeIcon,
    description: 'Banking model, compliance, and branding settings'
  },
  {
    id: 'import-export',
    label: 'Data Management',
    icon: ArrowDownTrayIcon,
    description: 'Import, export, and backup settings'
  }
];

// Toast notification component
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const Toast = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const bgColor = toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const Icon = toast.type === 'success' ? CheckCircleIcon : toast.type === 'error' ? ExclamationTriangleIcon : CogIcon;
  
  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}>
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5" />
        <span>{toast.message}</span>
      </div>
      <button onClick={() => onRemove(toast.id)} className="ml-4 text-white hover:text-stripe-text-secondary">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default function SettingsPage() {
  const { state, saveSettings, hasUnsavedChanges, updateOrganization } = useSettings();
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
      addToast('Settings saved successfully', 'success');
    } catch (error) {
      addToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Render active category component
  const renderActiveCategory = () => {
    if (!state.settings) return <div>Loading...</div>;
    
    switch (activeCategory) {
      case 'general':
        return <GeneralSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'banking':
        return <BankingSettings />;
      case 'dashboard':
        return <DashboardSettings />;
      case 'system':
        return <SystemSettings />;
      case 'organization':
        return (
          <OrganizationSettings 
            settings={state.settings.organization} 
            onUpdate={updateOrganization}
          />
        );
      case 'import-export':
        return <ImportExportSettings onToast={addToast} />;
      default:
        return <GeneralSettings />;
    }
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stripe-text">Settings</h1>
        <p className="text-stripe-text-secondary mt-2">
          Manage your application preferences and configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-stripe-text mb-4">Categories</h2>
            <nav className="space-y-2">
              {SETTINGS_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-stripe-primary/10 text-stripe-primary border-l-4 border-stripe-primary'
                        : 'text-stripe-text hover:bg-stripe-background-light'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mt-0.5 ${isActive ? 'text-stripe-primary' : 'text-stripe-text-secondary'}`} />
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-sm text-stripe-text-secondary">{category.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Save Button */}
          {hasUnsavedChanges() && (
            <div className="mt-6">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full flex items-center justify-center space-x-2 bg-stripe-primary hover:bg-stripe-primary/90 disabled:bg-stripe-text-secondary text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <p className="text-sm text-stripe-text-secondary mt-2 text-center">
                You have unsaved changes
              </p>
            </div>
          )}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {renderActiveCategory()}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <span>{state.error}</span>
          <button
            onClick={() => {
              // Clear error logic would go here
            }}
            className="ml-4 text-white hover:text-stripe-text-secondary"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
}