// Services index file for easy imports
export { SettingsService, SettingsCache } from './settings.service';
export { CustomerService, customerService } from './customer.service';

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

export type {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerSearchFilters,
  CustomerSearchParams,
  PaginatedCustomers,
  BulkCustomerAction,
  CustomerStats
} from './customer.service';