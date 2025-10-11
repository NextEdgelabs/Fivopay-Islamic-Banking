// Settings Type Definitions

export interface Theme {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  transactionAlerts: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
}

export interface SecuritySettings {
  sessionTimeout: number; // in minutes
  twoFactorAuth: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  ipWhitelisting: boolean;
  loginAttempts: number;
}

export interface DashboardSettings {
  layout: 'grid' | 'list' | 'compact';
  widgetsOrder: string[];
  refreshInterval: number; // in seconds
  showQuickActions: boolean;
  defaultView: 'overview' | 'transactions' | 'customers';
}

export interface BankingSettings {
  defaultBranch: string;
  transactionLimits: {
    daily: number;
    monthly: number;
    singleTransaction: number;
  };
  approvalWorkflow: {
    requireApproval: boolean;
    approvalLevels: number;
    autoApprovalLimit: number;
  };
  complianceChecks: {
    regulatoryCompliance: boolean;
    kycVerification: boolean;
    amlScreening: boolean;
  };
}

export interface OrganizationSettings {
  bankingModel: 'ethical' | 'conventional';
  organizationName: string;
  organizationCode: string;
  complianceFramework: {
    regulatoryCompliance: boolean;
    conventionalRegulations: boolean;
    hybridModel: boolean;
  };
  branding: {
    displayName: string;
    tagline: string;
    primaryBankingTerms: 'ethical' | 'generic' | 'conventional';
  };
  operationalMode: {
    interestBasedProducts: boolean;
    profitSharingProducts: boolean;
    investmentBonds: boolean;
    conventionalLoans: boolean;
  };
}

export interface SystemSettings {
  language: 'en' | 'hi';
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  currency: {
    primary: string;
    decimalPlaces: number;
    symbol: string;
  };
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  auditLevel: 'basic' | 'detailed' | 'comprehensive';
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: Theme;
  notifications: NotificationSettings;
  security: SecuritySettings;
  dashboard: DashboardSettings;
  banking: BankingSettings;
  system: SystemSettings;
  organization: OrganizationSettings;
  lastUpdated: string;
  version: number;
}

export interface SettingsFormData {
  theme: Partial<Theme>;
  notifications: Partial<NotificationSettings>;
  security: Partial<SecuritySettings>;
  dashboard: Partial<DashboardSettings>;
  banking: Partial<BankingSettings>;
  system: Partial<SystemSettings>;
  organization: Partial<OrganizationSettings>;
}

export interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

export type SettingsCategory = 
  | 'general'
  | 'appearance' 
  | 'notifications'
  | 'security'
  | 'banking'
  | 'dashboard'
  | 'system'
  | 'organization'
  | 'import-export'
  | 'products';