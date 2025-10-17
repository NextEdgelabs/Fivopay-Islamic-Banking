// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface OrganizationSettings {
  organizationType: 'Ethical Banking' | 'Conventional Banking';
  organizationName: string;
  perSharePrice: number;
  registrationNumber?: string;
  establishedDate?: string;
}

export interface GeneralSettings extends OrganizationSettings {
  currency: string;
  timezone: string;
  fiscalYearStart: string;
}

export type OrganizationType = 'Ethical Banking' | 'Conventional Banking';

// ============================================================================
// MOCK DATA
// ============================================================================

const mockOrganizationSettings: OrganizationSettings = {
  organizationType: 'Ethical Banking',
  organizationName: 'FivoPay Banking',
  perSharePrice: 100, // Default ₹100 per share
  registrationNumber: 'REG-2024-001',
  establishedDate: '2024-01-01',
};

// ============================================================================
// SERVICE METHODS
// ============================================================================

export const settingsService = {
  // Get organization type
  async getOrganizationType(): Promise<OrganizationType> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockOrganizationSettings.organizationType;
  },

  // Update organization type
  async updateOrganizationType(type: OrganizationType): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockOrganizationSettings.organizationType = type;
  },

  // Get per share price
  async getPerSharePrice(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockOrganizationSettings.perSharePrice;
  },

  // Update per share price
  async updatePerSharePrice(price: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (price < 1) throw new Error('Per share price must be at least ₹1');
    mockOrganizationSettings.perSharePrice = price;
  },

  // Get all organization settings
  async getOrganizationSettings(): Promise<OrganizationSettings> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...mockOrganizationSettings };
  },

  // Update organization settings
  async updateOrganizationSettings(settings: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
    await new Promise(resolve => setTimeout(resolve, 500));
    Object.assign(mockOrganizationSettings, settings);
    return { ...mockOrganizationSettings };
  },
};

