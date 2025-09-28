import { apiClient, API_ENDPOINTS, ApiResponse, ApiError } from '../api';
import { logger } from '../utils/logger';
import { 
  UserSettings, 
  OrganizationSettings, 
  Theme, 
  NotificationSettings,
  SecuritySettings,
  BankingSettings,
  DashboardSettings,
  SystemSettings 
} from '../src/app/dashboard/settings/types';

// Settings Service Class
export class SettingsService {
  // User Settings Operations
  static async getUserSettings(): Promise<ApiResponse<UserSettings>> {
    try {
      return await apiClient.get<UserSettings>(API_ENDPOINTS.SETTINGS.GET_USER_SETTINGS);
    } catch (error) {
      logger.apiError('Failed to fetch user settings', error, API_ENDPOINTS.SETTINGS.GET_USER_SETTINGS);
      throw error;
    }
  }

  static async updateUserSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
    try {
      return await apiClient.put<UserSettings>(
        API_ENDPOINTS.SETTINGS.UPDATE_USER_SETTINGS, 
        settings
      );
    } catch (error) {
      console.error('Failed to update user settings:', error);
      throw error;
    }
  }

  // Organization Settings Operations
  static async getOrganizationSettings(): Promise<ApiResponse<OrganizationSettings>> {
    try {
      return await apiClient.get<OrganizationSettings>(
        API_ENDPOINTS.SETTINGS.GET_ORGANIZATION_SETTINGS
      );
    } catch (error) {
      console.error('Failed to fetch organization settings:', error);
      throw error;
    }
  }

  static async updateOrganizationSettings(
    settings: Partial<OrganizationSettings>
  ): Promise<ApiResponse<OrganizationSettings>> {
    try {
      return await apiClient.put<OrganizationSettings>(
        API_ENDPOINTS.SETTINGS.UPDATE_ORGANIZATION_SETTINGS,
        settings
      );
    } catch (error) {
      console.error('Failed to update organization settings:', error);
      throw error;
    }
  }

  // Theme and Appearance
  static async updateTheme(theme: Partial<Theme>): Promise<ApiResponse<Theme>> {
    try {
      return await apiClient.patch<Theme>(API_ENDPOINTS.APPEARANCE.UPDATE_THEME, theme);
    } catch (error) {
      console.error('Failed to update theme:', error);
      throw error;
    }
  }

  static async getAvailableThemes(): Promise<ApiResponse<Theme[]>> {
    try {
      return await apiClient.get<Theme[]>(API_ENDPOINTS.APPEARANCE.GET_THEMES);
    } catch (error) {
      console.error('Failed to fetch themes:', error);
      throw error;
    }
  }

  // Notification Settings
  static async updateNotificationSettings(
    notifications: Partial<NotificationSettings>
  ): Promise<ApiResponse<NotificationSettings>> {
    try {
      return await apiClient.patch<NotificationSettings>(
        `${API_ENDPOINTS.SETTINGS.UPDATE_USER_SETTINGS}/notifications`,
        { notifications }
      );
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  // Security Settings
  static async updateSecuritySettings(
    security: Partial<SecuritySettings>
  ): Promise<ApiResponse<SecuritySettings>> {
    try {
      return await apiClient.patch<SecuritySettings>(
        `${API_ENDPOINTS.SETTINGS.UPDATE_USER_SETTINGS}/security`,
        { security }
      );
    } catch (error) {
      console.error('Failed to update security settings:', error);
      throw error;
    }
  }

  static async updatePassword(
    currentPassword: string, 
    newPassword: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await apiClient.post(API_ENDPOINTS.SECURITY.UPDATE_PASSWORD, {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Failed to update password:', error);
      throw error;
    }
  }

  static async toggle2FA(enabled: boolean): Promise<ApiResponse<{ enabled: boolean; qrCode?: string }>> {
    try {
      return await apiClient.post(API_ENDPOINTS.SECURITY.TOGGLE_2FA, { enabled });
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
      throw error;
    }
  }

  // Banking Settings
  static async updateBankingSettings(
    banking: Partial<BankingSettings>
  ): Promise<ApiResponse<BankingSettings>> {
    try {
      return await apiClient.patch<BankingSettings>(
        `${API_ENDPOINTS.SETTINGS.UPDATE_USER_SETTINGS}/banking`,
        { banking }
      );
    } catch (error) {
      console.error('Failed to update banking settings:', error);
      throw error;
    }
  }

  // Dashboard Settings
  static async updateDashboardSettings(
    dashboard: Partial<DashboardSettings>
  ): Promise<ApiResponse<DashboardSettings>> {
    try {
      return await apiClient.patch<DashboardSettings>(
        `${API_ENDPOINTS.SETTINGS.UPDATE_USER_SETTINGS}/dashboard`,
        { dashboard }
      );
    } catch (error) {
      console.error('Failed to update dashboard settings:', error);
      throw error;
    }
  }

  // System Settings
  static async updateSystemSettings(
    system: Partial<SystemSettings>
  ): Promise<ApiResponse<SystemSettings>> {
    try {
      return await apiClient.patch<SystemSettings>(
        `${API_ENDPOINTS.SETTINGS.UPDATE_USER_SETTINGS}/system`,
        { system }
      );
    } catch (error) {
      console.error('Failed to update system settings:', error);
      throw error;
    }
  }

  // Settings Backup and Restore
  static async exportSettings(): Promise<ApiResponse<{ settings: UserSettings; exportDate: string }>> {
    try {
      return await apiClient.get(API_ENDPOINTS.SETTINGS.EXPORT_SETTINGS);
    } catch (error) {
      console.error('Failed to export settings:', error);
      throw error;
    }
  }

  static async importSettings(
    settingsFile: File | UserSettings
  ): Promise<ApiResponse<{ imported: boolean; conflicts?: string[] }>> {
    try {
      let settingsData: UserSettings;

      if (settingsFile instanceof File) {
        // Parse file content
        const fileContent = await settingsFile.text();
        settingsData = JSON.parse(fileContent);
      } else {
        settingsData = settingsFile;
      }

      return await apiClient.post(API_ENDPOINTS.SETTINGS.IMPORT_SETTINGS, {
        settings: settingsData,
        importDate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw error;
    }
  }

  static async createBackup(): Promise<ApiResponse<{ backupId: string; backupDate: string }>> {
    try {
      return await apiClient.post(API_ENDPOINTS.SETTINGS.CREATE_SETTINGS_BACKUP);
    } catch (error) {
      console.error('Failed to create settings backup:', error);
      throw error;
    }
  }

  static async getBackups(): Promise<ApiResponse<Array<{ 
    id: string; 
    date: string; 
    size: number; 
    description?: string 
  }>>> {
    try {
      return await apiClient.get(API_ENDPOINTS.SETTINGS.GET_SETTINGS_BACKUP);
    } catch (error) {
      console.error('Failed to fetch settings backups:', error);
      throw error;
    }
  }

  // Settings Reset
  static async resetSettings(category?: string): Promise<ApiResponse<{ reset: boolean }>> {
    try {
      return await apiClient.post(API_ENDPOINTS.SETTINGS.RESET_SETTINGS, {
        category: category || 'all'
      });
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  }

  // Settings Validation
  static validateSettings(settings: Partial<UserSettings>): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];

    // Validate theme settings
    if (settings.theme) {
      const { mode, primaryColor, fontSize } = settings.theme;
      
      if (mode && !['light', 'dark', 'system'].includes(mode)) {
        errors.push('Invalid theme mode');
      }
      
      if (primaryColor && !/^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
        errors.push('Invalid primary color format');
      }
      
      if (fontSize && !['small', 'medium', 'large'].includes(fontSize)) {
        errors.push('Invalid font size');
      }
    }

    // Validate security settings
    if (settings.security) {
      const { sessionTimeout, loginAttempts } = settings.security;
      
      if (sessionTimeout && (sessionTimeout < 5 || sessionTimeout > 1440)) {
        errors.push('Session timeout must be between 5 and 1440 minutes');
      }
      
      if (loginAttempts && (loginAttempts < 1 || loginAttempts > 10)) {
        errors.push('Login attempts must be between 1 and 10');
      }
    }

    // Validate banking settings
    if (settings.banking?.transactionLimits) {
      const { daily, monthly, singleTransaction } = settings.banking.transactionLimits;
      
      if (daily && daily < 0) {
        errors.push('Daily limit cannot be negative');
      }
      
      if (monthly && monthly < 0) {
        errors.push('Monthly limit cannot be negative');
      }
      
      if (singleTransaction && singleTransaction < 0) {
        errors.push('Single transaction limit cannot be negative');
      }
      
      if (daily && monthly && daily > monthly) {
        errors.push('Daily limit cannot exceed monthly limit');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Cache management for settings
export class SettingsCache {
  private static readonly CACHE_KEY = 'fivopay_settings_cache';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static set(settings: UserSettings): void {
    if (typeof window === 'undefined') return;

    const cacheData = {
      settings,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION
    };

    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache settings:', error);
    }
  }

  static get(): UserSettings | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() > cacheData.expiresAt) {
        this.clear();
        return null;
      }

      return cacheData.settings;
    } catch (error) {
      console.warn('Failed to read settings cache:', error);
      this.clear();
      return null;
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear settings cache:', error);
    }
  }

  static isExpired(): boolean {
    if (typeof window === 'undefined') return true;

    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return true;

      const cacheData = JSON.parse(cached);
      return Date.now() > cacheData.expiresAt;
    } catch (error) {
      return true;
    }
  }
}

// Default export
export default SettingsService;