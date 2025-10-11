// Services index file for easy imports
export { SettingsService, SettingsCache } from './settings.service';
export { CustomerService, CustomerCache } from './customer.service';

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
  Customer,
  CustomerKYC,
  CustomerDocument,
  CustomerAddress,
  CustomerNominee,
  CustomerAccount,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerSearchFilters,
  CustomerListResponse,
  CustomerStats,
  CustomerType,
  CustomerStatus,
  KYCStatus,
  RiskRating
} from '../src/types/customer';