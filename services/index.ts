// Services index file for easy imports
export { SettingsService, SettingsCache } from './settings.service';

// Re-export types for convenience
export type {
  UserSettings,
  OrganizationSettings,
  Theme,
  NotificationSettings,
  SecuritySettings,
  BankingSettings,
  DashboardSettings,
  SystemSettings
} from '../src/app/dashboard/settings/types';