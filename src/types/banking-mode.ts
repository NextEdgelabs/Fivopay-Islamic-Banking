export type BankingMode = 'ethical' | 'conventional';

export interface BankingModeConfig {
  mode: BankingMode;
  displayName: string;
  description: string;
  principles: string[];
  features: {
    interestBased: boolean;
    profitSharing: boolean;
    shariaCompliance: boolean;
    conventionalLoans: boolean;
    sukuk: boolean;
    mutualFunds: boolean;
    islamicInsurance: boolean;
    conventionalInsurance: boolean;
  };
  complianceRequirements: string[];
  productTypes: {
    deposits: string[];
    loans: string[];
    investments: string[];
    insurance: string[];
  };
}

export const BANKING_MODES: Record<BankingMode, BankingModeConfig> = {
  ethical: {
    mode: 'ethical',
    displayName: 'Ethical Banking (Islamic)',
    description: 'Sharia-compliant banking following Islamic principles',
    principles: [
      'No Interest (Riba)',
      'Profit-Loss Sharing',
      'Ethical Investments',
      'Asset-Backed Financing',
      'Risk Sharing'
    ],
    features: {
      interestBased: false,
      profitSharing: true,
      shariaCompliance: true,
      conventionalLoans: false,
      sukuk: true,
      mutualFunds: false,
      islamicInsurance: true,
      conventionalInsurance: false
    },
    complianceRequirements: [
      'Sharia Board Approval',
      'Regular Sharia Audits',
      'Halal Investment Screening',
      'Profit-Loss Documentation'
    ],
    productTypes: {
      deposits: ['Savings Account (Wadiah)', 'Investment Account (Mudarabah)', 'Current Account'],
      loans: ['Murabaha Financing', 'Musharakah Partnership', 'Ijarah Leasing', 'Istisna Manufacturing'],
      investments: ['Sukuk Bonds', 'Sharia-Compliant Funds', 'Real Estate Investment'],
      insurance: ['Takaful (Islamic Insurance)', 'Family Takaful', 'General Takaful']
    }
  },
  conventional: {
    mode: 'conventional',
    displayName: 'Conventional Banking',
    description: 'Traditional banking with interest-based products',
    principles: [
      'Interest-Based Returns',
      'Credit Risk Assessment',
      'Collateral-Based Lending',
      'Market-Based Pricing',
      'Regulatory Compliance'
    ],
    features: {
      interestBased: true,
      profitSharing: false,
      shariaCompliance: false,
      conventionalLoans: true,
      sukuk: false,
      mutualFunds: true,
      islamicInsurance: false,
      conventionalInsurance: true
    },
    complianceRequirements: [
      'Banking Regulations',
      'Credit Risk Assessment',
      'Capital Adequacy Ratios',
      'Anti-Money Laundering'
    ],
    productTypes: {
      deposits: ['Savings Account', 'Fixed Deposits', 'Current Account', 'Recurring Deposits'],
      loans: ['Personal Loans', 'Home Loans', 'Business Loans', 'Credit Cards'],
      investments: ['Mutual Funds', 'Corporate Bonds', 'Equity Investments', 'Government Securities'],
      insurance: ['Life Insurance', 'Health Insurance', 'Property Insurance', 'Vehicle Insurance']
    }
  }
};

export interface BankingModeContextType {
  currentMode: BankingMode;
  config: BankingModeConfig;
  switchMode: (mode: BankingMode) => void;
  isFeatureEnabled: (feature: keyof BankingModeConfig['features']) => boolean;
  getProductTypes: (category: keyof BankingModeConfig['productTypes']) => string[];
  getComplianceRequirements: () => string[];
}