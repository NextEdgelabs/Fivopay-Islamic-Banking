'use client';

import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { UserSettings, SettingsState, SettingsFormData, Theme, NotificationSettings, SecuritySettings, DashboardSettings, BankingSettings, SystemSettings, OrganizationSettings } from '../types';
import { SettingsService, SettingsCache } from '../../../../../services/settings.service';

// Default settings configuration
const DEFAULT_THEME: Theme = {
  mode: 'light',
  primaryColor: '#3B82F6', // blue-500
  fontSize: 'medium'
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  email: true,
  push: true,
  sms: false,
  transactionAlerts: true,
  systemUpdates: true,
  marketingEmails: false
};

const DEFAULT_SECURITY: SecuritySettings = {
  sessionTimeout: 30,
  twoFactorAuth: false,
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  ipWhitelisting: false,
  loginAttempts: 3
};

const DEFAULT_DASHBOARD: DashboardSettings = {
  layout: 'grid',
  widgetsOrder: ['overview', 'recent-transactions', 'quick-actions', 'notifications'],
  refreshInterval: 300, // 5 minutes
  showQuickActions: true,
  defaultView: 'overview'
};

const DEFAULT_BANKING: BankingSettings = {
  defaultBranch: '',
  transactionLimits: {
    daily: 100000,
    monthly: 1000000,
    singleTransaction: 50000
  },
  approvalWorkflow: {
    requireApproval: true,
    approvalLevels: 2,
    autoApprovalLimit: 10000
  },
  complianceChecks: {
    regulatoryCompliance: true,
    kycVerification: true,
    amlScreening: true
  }
};

const DEFAULT_SYSTEM: SystemSettings = {
  language: 'en',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  currency: {
    primary: 'INR',
    decimalPlaces: 2,
    symbol: '₹'
  },
  backupFrequency: 'daily',
  auditLevel: 'detailed'
};

const DEFAULT_ORGANIZATION: OrganizationSettings = {
  bankingModel: 'ethical',
  organizationName: 'Fivo Pay Digital Banking',
  organizationCode: 'FPDB001',
  complianceFramework: {
    regulatoryCompliance: true,
    conventionalRegulations: true,
    hybridModel: false
  },
  branding: {
    displayName: 'Fivo Pay',
    tagline: 'Digital Banking for Everyone',
    primaryBankingTerms: 'ethical'
  },
  operationalMode: {
    interestBasedProducts: false,
    profitSharingProducts: true,
    investmentBonds: true,
    conventionalLoans: false
  }
};

const DEFAULT_SETTINGS: UserSettings = {
  id: '1',
  userId: 'user_1',
  theme: DEFAULT_THEME,
  notifications: DEFAULT_NOTIFICATIONS,
  security: DEFAULT_SECURITY,
  dashboard: DEFAULT_DASHBOARD,
  banking: DEFAULT_BANKING,
  system: DEFAULT_SYSTEM,
  organization: DEFAULT_ORGANIZATION,
  lastUpdated: new Date().toISOString(),
  version: 1
};

// Settings Actions
type SettingsAction =
  | { type: 'LOAD_SETTINGS_START' }
  | { type: 'LOAD_SETTINGS_SUCCESS'; payload: UserSettings }
  | { type: 'LOAD_SETTINGS_ERROR'; payload: string }
  | { type: 'UPDATE_SETTINGS_START' }
  | { type: 'UPDATE_SETTINGS_SUCCESS'; payload: UserSettings }
  | { type: 'UPDATE_SETTINGS_ERROR'; payload: string }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'RESET_SETTINGS' }
  | { type: 'IMPORT_SETTINGS'; payload: UserSettings }
  | { type: 'UPDATE_THEME'; payload: Partial<Theme> }
  | { type: 'UPDATE_NOTIFICATIONS'; payload: Partial<NotificationSettings> }
  | { type: 'UPDATE_SECURITY'; payload: Partial<SecuritySettings> }
  | { type: 'UPDATE_DASHBOARD'; payload: Partial<DashboardSettings> }
  | { type: 'UPDATE_BANKING'; payload: Partial<BankingSettings> }
  | { type: 'UPDATE_SYSTEM'; payload: Partial<SystemSettings> }
  | { type: 'UPDATE_ORGANIZATION'; payload: Partial<OrganizationSettings> };

// Settings Reducer
const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'LOAD_SETTINGS_START':
    case 'UPDATE_SETTINGS_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'LOAD_SETTINGS_SUCCESS':
      return {
        ...state,
        settings: action.payload,
        isLoading: false,
        error: null,
        hasUnsavedChanges: false
      };

    case 'UPDATE_SETTINGS_SUCCESS':
      return {
        ...state,
        settings: action.payload,
        isLoading: false,
        error: null,
        hasUnsavedChanges: false
      };

    case 'LOAD_SETTINGS_ERROR':
    case 'UPDATE_SETTINGS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'SET_UNSAVED_CHANGES':
      return {
        ...state,
        hasUnsavedChanges: action.payload
      };

    case 'RESET_SETTINGS':
      return {
        ...state,
        settings: DEFAULT_SETTINGS,
        hasUnsavedChanges: false,
        error: null
      };

    case 'IMPORT_SETTINGS':
      return {
        ...state,
        settings: {
          ...action.payload,
          lastUpdated: new Date().toISOString(),
          version: (action.payload.version || 0) + 1
        },
        hasUnsavedChanges: true
      };

    case 'UPDATE_THEME':
      if (!state.settings) return state;
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: { ...state.settings.theme, ...action.payload },
          lastUpdated: new Date().toISOString()
        },
        hasUnsavedChanges: true
      };

    case 'UPDATE_NOTIFICATIONS':
      if (!state.settings) return state;
      return {
        ...state,
        settings: {
          ...state.settings,
          notifications: { ...state.settings.notifications, ...action.payload },
          lastUpdated: new Date().toISOString()
        },
        hasUnsavedChanges: true
      };

    case 'UPDATE_SECURITY':
      if (!state.settings) return state;
      return {
        ...state,
        settings: {
          ...state.settings,
          security: { ...state.settings.security, ...action.payload },
          lastUpdated: new Date().toISOString()
        },
        hasUnsavedChanges: true
      };

    case 'UPDATE_DASHBOARD':
      if (!state.settings) return state;
      return {
        ...state,
        settings: {
          ...state.settings,
          dashboard: { ...state.settings.dashboard, ...action.payload },
          lastUpdated: new Date().toISOString()
        },
        hasUnsavedChanges: true
      };

    case 'UPDATE_BANKING':
      if (!state.settings) return state;
      return {
        ...state,
        settings: {
          ...state.settings,
          banking: { ...state.settings.banking, ...action.payload },
          lastUpdated: new Date().toISOString()
        },
        hasUnsavedChanges: true
      };

    case 'UPDATE_SYSTEM':
      if (!state.settings) return state;
      return {
        ...state,
        settings: {
          ...state.settings,
          system: { ...state.settings.system, ...action.payload },
          lastUpdated: new Date().toISOString()
        },
        hasUnsavedChanges: true
      };

    case 'UPDATE_ORGANIZATION':
      if (!state.settings) return state;
      return {
        ...state,
        settings: {
          ...state.settings,
          organization: { ...state.settings.organization, ...action.payload },
          lastUpdated: new Date().toISOString()
        },
        hasUnsavedChanges: true
      };

    default:
      return state;
  }
};

// Context Type
interface SettingsContextType {
  state: SettingsState;
  
  // Actions
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
  importSettings: (settings: UserSettings) => void;
  exportSettings: () => UserSettings | null;
  
  // Update functions with API integration
  updateTheme: (theme: Partial<Theme>) => Promise<void>;
  updateNotifications: (notifications: Partial<NotificationSettings>) => Promise<void>;
  updateSecurity: (security: Partial<SecuritySettings>) => Promise<void>;
  updateDashboard: (dashboard: Partial<DashboardSettings>) => Promise<void>;
  updateBanking: (banking: Partial<BankingSettings>) => Promise<void>;
  updateSystem: (system: Partial<SystemSettings>) => Promise<void>;
  updateOrganization: (organization: Partial<OrganizationSettings>) => Promise<void>;
  
  // Security functions
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean }>;
  toggle2FA: (enabled: boolean) => Promise<{ success: boolean; qrCode?: string }>;
  
  // Backup functions
  createSettingsBackup: () => Promise<{ success: boolean; backupId?: string }>;
  getSettingsBackups: () => Promise<Array<{ id: string; date: string; size: number; description?: string }>>;
  
  // Utility functions
  hasUnsavedChanges: () => boolean;
  getSettings: () => UserSettings | null;
  validateSettings: (settings: Partial<UserSettings>) => { isValid: boolean; errors: string[] };
}

// Create Context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Custom Hook
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Storage Keys
const STORAGE_KEY = 'fivopay_settings';
const BACKUP_KEY = 'fivopay_settings_backup';

// Helper Functions
const saveToStorage = (settings: UserSettings): void => {
  try {
    // Only access localStorage on client-side
    if (typeof window === 'undefined') return;
    
    // Create backup of current settings
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      localStorage.setItem(BACKUP_KEY, existing);
    }
    
    // Save new settings
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to storage:', error);
    throw new Error('Failed to save settings');
  }
};

const loadFromStorage = (): UserSettings | null => {
  try {
    // Only access localStorage on client-side
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return migrateSettings(parsed);
    }
    return null;
  } catch (error) {
    console.error('Error loading settings from storage:', error);
    return null;
  }
};

const migrateSettings = (settings: any): UserSettings => {
  // Version migration logic
  if (!settings.version || settings.version < 1) {
    return {
      ...DEFAULT_SETTINGS,
      ...settings,
      version: 1
    };
  }
  return settings;
};

const validateSettingsData = (settings: Partial<UserSettings>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate theme
  if (settings.theme) {
    if (settings.theme.mode && !['light', 'dark', 'system'].includes(settings.theme.mode)) {
      errors.push('Invalid theme mode');
    }
    if (settings.theme.fontSize && !['small', 'medium', 'large'].includes(settings.theme.fontSize)) {
      errors.push('Invalid font size');
    }
  }

  // Validate security settings
  if (settings.security) {
    if (settings.security.sessionTimeout && (settings.security.sessionTimeout < 5 || settings.security.sessionTimeout > 480)) {
      errors.push('Session timeout must be between 5 and 480 minutes');
    }
    if (settings.security.loginAttempts && (settings.security.loginAttempts < 1 || settings.security.loginAttempts > 10)) {
      errors.push('Login attempts must be between 1 and 10');
    }
  }

  // Validate banking settings
  if (settings.banking?.transactionLimits) {
    const limits = settings.banking.transactionLimits;
    if (limits.daily && limits.daily < 0) {
      errors.push('Daily transaction limit must be positive');
    }
    if (limits.monthly && limits.monthly < 0) {
      errors.push('Monthly transaction limit must be positive');
    }
    if (limits.singleTransaction && limits.singleTransaction < 0) {
      errors.push('Single transaction limit must be positive');
    }
  }

  return { isValid: errors.length === 0, errors };
};

// Settings Provider Props
interface SettingsProviderProps {
  children: ReactNode;
}

// Settings Provider Component
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, {
    settings: null,
    isLoading: true,
    error: null,
    hasUnsavedChanges: false
  });
  
  const [isClient, setIsClient] = useState(false);

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load settings on client-side initialization only
  useEffect(() => {
    if (isClient) {
      loadSettings();
    }
  }, [isClient]);

  // Apply theme changes to document
  useEffect(() => {
    if (state.settings?.theme) {
      const { mode, primaryColor, fontSize } = state.settings.theme;
      
      // Apply theme mode
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (mode === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      }
      
      // Apply primary color
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      
      // Apply font size
      const fontSizeMap = { small: '14px', medium: '16px', large: '18px' };
      document.documentElement.style.setProperty('--base-font-size', fontSizeMap[fontSize]);
    }
  }, [state.settings?.theme]);

  // Actions
  const loadSettings = async (): Promise<void> => {
    dispatch({ type: 'LOAD_SETTINGS_START' });
    
    try {
      // First try to get cached settings
      const cached = SettingsCache.get();
      if (cached && !SettingsCache.isExpired()) {
        dispatch({ type: 'LOAD_SETTINGS_SUCCESS', payload: cached });
        return;
      }

      // Load from API
      try {
        const response = await SettingsService.getUserSettings();
        if (response.success && response.data) {
          // Cache the settings
          SettingsCache.set(response.data);
          dispatch({ type: 'LOAD_SETTINGS_SUCCESS', payload: response.data });
          return;
        }
      } catch (apiError) {
        console.warn('API unavailable, falling back to local storage:', apiError);
      }

      // Fallback to localStorage
      const stored = loadFromStorage();
      if (stored) {
        dispatch({ type: 'LOAD_SETTINGS_SUCCESS', payload: stored });
      } else {
        dispatch({ type: 'LOAD_SETTINGS_SUCCESS', payload: DEFAULT_SETTINGS });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      dispatch({ type: 'LOAD_SETTINGS_ERROR', payload: 'Failed to load settings' });
      
      // Fallback to default settings
      dispatch({ type: 'LOAD_SETTINGS_SUCCESS', payload: DEFAULT_SETTINGS });
    }
  };

  const saveSettings = async (): Promise<void> => {
    if (!state.settings) return;
    
    dispatch({ type: 'UPDATE_SETTINGS_START' });
    
    try {
      // Try to save to API first
      try {
        const response = await SettingsService.updateUserSettings(state.settings);
        if (response.success && response.data) {
          // Update cache
          SettingsCache.set(response.data);
          // Also save to localStorage as backup
          saveToStorage(response.data);
          dispatch({ type: 'UPDATE_SETTINGS_SUCCESS', payload: response.data });
          return;
        }
      } catch (apiError) {
        console.warn('API save failed, saving locally:', apiError);
      }

      // Fallback to localStorage
      saveToStorage(state.settings);
      dispatch({ type: 'UPDATE_SETTINGS_SUCCESS', payload: state.settings });
    } catch (error) {
      console.error('Error saving settings:', error);
      dispatch({ type: 'UPDATE_SETTINGS_ERROR', payload: 'Failed to save settings' });
    }
  };

  const resetSettings = (): void => {
    dispatch({ type: 'RESET_SETTINGS' });
  };

  const importSettings = (settings: UserSettings): void => {
    const validation = validateSettingsData(settings);
    if (!validation.isValid) {
      dispatch({ type: 'UPDATE_SETTINGS_ERROR', payload: `Invalid settings: ${validation.errors.join(', ')}` });
      return;
    }
    dispatch({ type: 'IMPORT_SETTINGS', payload: settings });
  };

  const exportSettings = (): UserSettings | null => {
    return state.settings;
  };

  // Update functions with API integration
  const updateTheme = async (theme: Partial<Theme>): Promise<void> => {
    dispatch({ type: 'UPDATE_THEME', payload: theme });
    
    // Auto-save theme changes
    try {
      await SettingsService.updateTheme(theme);
    } catch (error) {
      console.warn('Failed to save theme to API:', error);
    }
  };

  const updateNotifications = async (notifications: Partial<NotificationSettings>): Promise<void> => {
    dispatch({ type: 'UPDATE_NOTIFICATIONS', payload: notifications });
    
    // Auto-save notification changes
    try {
      await SettingsService.updateNotificationSettings(notifications);
    } catch (error) {
      console.warn('Failed to save notifications to API:', error);
    }
  };

  const updateSecurity = async (security: Partial<SecuritySettings>): Promise<void> => {
    dispatch({ type: 'UPDATE_SECURITY', payload: security });
    
    // Auto-save security changes
    try {
      await SettingsService.updateSecuritySettings(security);
    } catch (error) {
      console.warn('Failed to save security settings to API:', error);
    }
  };

  const updateDashboard = async (dashboard: Partial<DashboardSettings>): Promise<void> => {
    dispatch({ type: 'UPDATE_DASHBOARD', payload: dashboard });
    
    // Auto-save dashboard changes
    try {
      await SettingsService.updateDashboardSettings(dashboard);
    } catch (error) {
      console.warn('Failed to save dashboard settings to API:', error);
    }
  };

  const updateBanking = async (banking: Partial<BankingSettings>): Promise<void> => {
    dispatch({ type: 'UPDATE_BANKING', payload: banking });
    
    // Auto-save banking changes
    try {
      await SettingsService.updateBankingSettings(banking);
    } catch (error) {
      console.warn('Failed to save banking settings to API:', error);
    }
  };

  const updateSystem = async (system: Partial<SystemSettings>): Promise<void> => {
    dispatch({ type: 'UPDATE_SYSTEM', payload: system });
    
    // Auto-save system changes
    try {
      await SettingsService.updateSystemSettings(system);
    } catch (error) {
      console.warn('Failed to save system settings to API:', error);
    }
  };

  const updateOrganization = async (organization: Partial<OrganizationSettings>): Promise<void> => {
    dispatch({ type: 'UPDATE_ORGANIZATION', payload: organization });
    
    // Auto-save organization changes
    try {
      await SettingsService.updateOrganizationSettings(organization);
    } catch (error) {
      console.warn('Failed to save organization settings to API:', error);
    }
  };

  // Utility functions
  const hasUnsavedChanges = (): boolean => {
    return state.hasUnsavedChanges;
  };

  const getSettings = (): UserSettings | null => {
    return state.settings;
  };

  const validateSettings = (settings: Partial<UserSettings>): { isValid: boolean; errors: string[] } => {
    return validateSettingsData(settings);
  };

  // Additional service methods
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    try {
      const response = await SettingsService.updatePassword(currentPassword, newPassword);
      return { success: response.success };
    } catch (error) {
      console.error('Failed to update password:', error);
      return { success: false };
    }
  };

  const toggle2FA = async (enabled: boolean): Promise<{ success: boolean; qrCode?: string }> => {
    try {
      const response = await SettingsService.toggle2FA(enabled);
      return { 
        success: response.success, 
        qrCode: response.data?.qrCode 
      };
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
      return { success: false };
    }
  };

  const createSettingsBackup = async (): Promise<{ success: boolean; backupId?: string }> => {
    try {
      const response = await SettingsService.createBackup();
      return { 
        success: response.success, 
        backupId: response.data?.backupId 
      };
    } catch (error) {
      console.error('Failed to create backup:', error);
      return { success: false };
    }
  };

  const getSettingsBackups = async () => {
    try {
      const response = await SettingsService.getBackups();
      return response.success && response.data ? response.data : [];
    } catch (error) {
      console.error('Failed to get backups:', error);
      return [];
    }
  };

  const contextValue: SettingsContextType = {
    state,
    loadSettings,
    saveSettings,
    resetSettings,
    importSettings,
    exportSettings,
    updateTheme,
    updateNotifications,
    updateSecurity,
    updateDashboard,
    updateBanking,
    updateSystem,
    updateOrganization,
    hasUnsavedChanges,
    getSettings,
    validateSettings,
    // Additional service methods
    updatePassword,
    toggle2FA,
    createSettingsBackup,
    getSettingsBackups
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};