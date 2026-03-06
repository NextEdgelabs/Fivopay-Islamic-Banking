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
// HELPERS: use first organisation for settings (stored in backend)
// ============================================================================

import { getAllOrganizations, updateOrganization } from '@/services/organization.service';

async function getFirstOrganisationId(): Promise<string> {
  const orgs = await getAllOrganizations();
  const first = orgs?.[0];
  if (!first?._id && !first?.id) {
    throw new Error('No organisation found. Please create an organisation first.');
  }
  return (first._id || first.id) as string;
}

// ============================================================================
// SERVICE METHODS (persisted to organisation in backend)
// ============================================================================

export const settingsService = {
  // Get organization type from first organisation
  async getOrganizationType(): Promise<OrganizationType> {
    const orgs = await getAllOrganizations();
    const first = orgs?.[0];
    const mode = first?.bankingMode;
    if (mode === 'Ethical Banking' || mode === 'Conventional Banking') return mode;
    return 'Ethical Banking';
  },

  // Update organization type (store in organisation)
  async updateOrganizationType(type: OrganizationType): Promise<void> {
    const id = await getFirstOrganisationId();
    await updateOrganization(id, { bankingMode: type });
  },

  // Get per share price from first organisation
  async getPerSharePrice(): Promise<number> {
    const orgs = await getAllOrganizations();
    const first = orgs?.[0];
    const price = first?.perSharePrice;
    return typeof price === 'number' && price >= 0 ? price : 100;
  },

  // Update per share price (store in organisation)
  async updatePerSharePrice(price: number): Promise<void> {
    if (price < 1) throw new Error('Per share price must be at least ₹1');
    const id = await getFirstOrganisationId();
    await updateOrganization(id, { perSharePrice: price });
  },

  // Get all organization settings (from first organisation)
  async getOrganizationSettings(): Promise<OrganizationSettings> {
    const orgs = await getAllOrganizations();
    const first = orgs?.[0];
    return {
      organizationType: (first?.bankingMode === 'Conventional Banking' ? 'Conventional Banking' : 'Ethical Banking') as OrganizationType,
      organizationName: first?.organisationName || first?.organizationName || first?.name || 'FivoPay Banking',
      perSharePrice: typeof first?.perSharePrice === 'number' && first.perSharePrice >= 0 ? first.perSharePrice : 100,
      registrationNumber: first?.registrationNumber,
      establishedDate: first?.establishedDate,
    };
  },

  // Update organization settings (store in organisation)
  async updateOrganizationSettings(settings: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
    const id = await getFirstOrganisationId();
    const update: Parameters<typeof updateOrganization>[1] = {};
    if (settings.organizationType !== undefined) update.bankingMode = settings.organizationType;
    if (settings.perSharePrice !== undefined) update.perSharePrice = settings.perSharePrice;
    if (Object.keys(update).length > 0) {
      await updateOrganization(id, update);
    }
    return this.getOrganizationSettings();
  },
};

