export type ProductCategory = 'loans' | 'deposits' | 'investments' | 'insurance' | 'accounts';
export type BankingMode = 'ethical' | 'conventional' | 'both';
export type ProductStatus = 'active' | 'inactive' | 'draft' | 'archived';

// Base product interface
export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  bankingMode: BankingMode;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDefault?: boolean;
  tags?: string[];
  features?: string[];
}

// Loan Product specific fields
export interface LoanProduct extends BaseProduct {
  category: 'loans';
  loanType: 'Personal' | 'Business' | 'Home' | 'Vehicle' | 'Education' | 'Murabaha' | 'Musharakah' | 'Ijarah' | 'Istisna' | 'Salam';
  minAmount: number;
  maxAmount: number;
  profitRate?: number; // For Islamic banking
  interestRate?: number; // For conventional banking
  tenure: string;
  applications: number;
  disbursed: number;
  eligibilityCriteria?: string[];
  requiredDocuments?: string[];
  processingFee?: number;
  prepaymentCharges?: number;
  latePaymentCharges?: number;
  isShariaCompliant?: boolean;
  shariaBoardApproval?: boolean;
}

// Deposit Product specific fields
export interface DepositProduct extends BaseProduct {
  category: 'deposits';
  depositType: 'Fixed Deposit' | 'Recurring Deposit' | 'Savings Account' | 'Current Account' | 'Mudarabah' | 'Wadiah' | 'Musharakah';
  minAmount: number;
  maxAmount?: number;
  profitRate?: number; // For Islamic banking
  interestRate?: number; // For conventional banking
  tenure?: string;
  accounts: number;
  totalDeposits: number;
  withdrawalRestrictions?: string[];
  minimumBalance?: number;
  isShariaCompliant?: boolean;
  profitSharingRatio?: number; // For Mudarabah
}

// Investment Product specific fields
export interface InvestmentProduct extends BaseProduct {
  category: 'investments';
  investmentType: 'Mutual Fund' | 'Sukuk' | 'Equity' | 'Bond' | 'Real Estate' | 'Commodity' | 'Sharia Fund';
  minInvestment: number;
  maxInvestment?: number;
  expectedReturn?: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  lockInPeriod?: string;
  investments: number;
  totalValue: number;
  isShariaCompliant?: boolean;
  shariaScreening?: boolean;
  assetBacked?: boolean;
}

// Insurance Product specific fields
export interface InsuranceProduct extends BaseProduct {
  category: 'insurance';
  insuranceType: 'Health' | 'Life' | 'Motor' | 'Property' | 'Travel' | 'Business' | 'Takaful' | 'Family Takaful' | 'General Takaful';
  premium: number;
  coverage: number;
  subscribers: number;
  claimSettlementRatio?: number;
  waitingPeriod?: string;
  exclusions?: string[];
  benefits?: string[];
  isShariaCompliant?: boolean;
  takafulModel?: 'Mudarabah' | 'Wakalah' | 'Hybrid';
}

// Account Product specific fields
export interface AccountProduct extends BaseProduct {
  category: 'accounts';
  accountType: 'Savings' | 'Current' | 'Fixed Deposit' | 'Recurring Deposit' | 'Investment' | 'Islamic Savings' | 'Mudarabah' | 'Wadiah';
  minBalance: number;
  maxBalance?: number;
  profitRate?: number;
  interestRate?: number;
  accounts: number;
  totalBalance: number;
  transactionLimits?: {
    daily?: number;
    monthly?: number;
    yearly?: number;
  };
  fees?: {
    maintenance?: number;
    transaction?: number;
    overdraft?: number;
  };
  isShariaCompliant?: boolean;
}

// Union type for all products
export type Product = LoanProduct | DepositProduct | InvestmentProduct | InsuranceProduct | AccountProduct;

// Product creation/update types
export type CreateProductData<T extends Product = Product> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
export type UpdateProductData<T extends Product = Product> = Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>;

// Product filters
export interface ProductFilters {
  category?: ProductCategory;
  bankingMode?: BankingMode;
  status?: ProductStatus;
  search?: string;
  isShariaCompliant?: boolean;
  tags?: string[];
}

// Product statistics
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  draftProducts: number;
  byCategory: Record<ProductCategory, number>;
  byBankingMode: Record<BankingMode, number>;
  byStatus: Record<ProductStatus, number>;
}

// Product template for quick creation
export interface ProductTemplate {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  bankingMode: BankingMode;
  template: Partial<Product>;
  isDefault: boolean;
}

// Islamic banking specific product attributes
export interface IslamicProductAttributes {
  isShariaCompliant: boolean;
  shariaBoardApproval: boolean;
  assetBacked: boolean;
  profitLossSharing: boolean;
  noInterest: boolean;
  ethicalScreening: boolean;
  takafulModel?: 'Mudarabah' | 'Wakalah' | 'Hybrid';
  profitSharingRatio?: number;
  shariaScreening?: boolean;
}

// Conventional banking specific product attributes
export interface ConventionalProductAttributes {
  interestBased: boolean;
  collateralRequired: boolean;
  creditScoring: boolean;
  marketBasedPricing: boolean;
  regulatoryCompliant: boolean;
}

// Product validation rules
export interface ProductValidationRules {
  requiredFields: (keyof Product)[];
  minAmounts: Record<ProductCategory, number>;
  maxAmounts: Record<ProductCategory, number>;
  allowedTypes: Record<ProductCategory, string[]>;
  bankingModeRestrictions: Record<BankingMode, string[]>;
}

// Product configuration for different banking modes
export const PRODUCT_CONFIGURATION = {
  ethical: {
    allowedCategories: ['loans', 'deposits', 'investments', 'insurance', 'accounts'],
    requiredAttributes: ['isShariaCompliant', 'shariaBoardApproval'],
    prohibitedFeatures: ['interestRate', 'interestBased'],
    requiredFeatures: ['profitRate', 'profitLossSharing'],
    defaultTags: ['Islamic', 'Sharia Compliant', 'Ethical']
  },
  conventional: {
    allowedCategories: ['loans', 'deposits', 'investments', 'insurance', 'accounts'],
    requiredAttributes: ['interestRate', 'regulatoryCompliant'],
    prohibitedFeatures: ['profitRate', 'shariaBoardApproval'],
    requiredFeatures: ['interestBased', 'creditScoring'],
    defaultTags: ['Conventional', 'Interest Based', 'Market Rate']
  }
} as const;

// Default product templates
export const DEFAULT_PRODUCT_TEMPLATES: ProductTemplate[] = [
  // Islamic Banking Templates
  {
    id: 'islamic-personal-financing',
    name: 'Personal Financing (Murabaha)',
    description: 'Sharia-compliant personal financing based on cost-plus principle',
    category: 'loans',
    bankingMode: 'ethical',
    template: {
      loanType: 'Murabaha',
      minAmount: 50000,
      maxAmount: 1000000,
      profitRate: 12,
      tenure: '6-36 months',
      isShariaCompliant: true,
      shariaBoardApproval: true,
      profitLossSharing: false,
      noInterest: true
    },
    isDefault: true
  },
  {
    id: 'islamic-home-financing',
    name: 'Home Financing (Musharakah)',
    description: 'Partnership-based home financing following Islamic principles',
    category: 'loans',
    bankingMode: 'ethical',
    template: {
      loanType: 'Musharakah',
      minAmount: 1000000,
      maxAmount: 50000000,
      profitRate: 8,
      tenure: '60-240 months',
      isShariaCompliant: true,
      shariaBoardApproval: true,
      profitLossSharing: true,
      noInterest: true
    },
    isDefault: true
  },
  {
    id: 'islamic-savings',
    name: 'Islamic Savings Account (Wadiah)',
    description: 'Safe custody account with profit sharing',
    category: 'deposits',
    bankingMode: 'ethical',
    template: {
      depositType: 'Wadiah',
      minAmount: 1000,
      profitRate: 4,
      isShariaCompliant: true,
      shariaBoardApproval: true,
      profitLossSharing: true,
      noInterest: true
    },
    isDefault: true
  },
  {
    id: 'takaful-health',
    name: 'Health Takaful',
    description: 'Mutual health insurance following Islamic principles',
    category: 'insurance',
    bankingMode: 'ethical',
    template: {
      insuranceType: 'Takaful',
      premium: 250,
      coverage: 50000,
      isShariaCompliant: true,
      takafulModel: 'Mudarabah',
      profitLossSharing: true
    },
    isDefault: true
  },
  // Conventional Banking Templates
  {
    id: 'conventional-personal-loan',
    name: 'Personal Loan',
    description: 'Traditional personal loan with competitive interest rates',
    category: 'loans',
    bankingMode: 'conventional',
    template: {
      loanType: 'Personal',
      minAmount: 50000,
      maxAmount: 1000000,
      interestRate: 12,
      tenure: '6-36 months',
      interestBased: true,
      creditScoring: true,
      regulatoryCompliant: true
    },
    isDefault: true
  },
  {
    id: 'conventional-home-loan',
    name: 'Home Loan',
    description: 'Mortgage loan for home purchase',
    category: 'loans',
    bankingMode: 'conventional',
    template: {
      loanType: 'Home',
      minAmount: 1000000,
      maxAmount: 50000000,
      interestRate: 8,
      tenure: '60-240 months',
      interestBased: true,
      collateralRequired: true,
      regulatoryCompliant: true
    },
    isDefault: true
  },
  {
    id: 'conventional-savings',
    name: 'Savings Account',
    description: 'Traditional savings account with interest',
    category: 'deposits',
    bankingMode: 'conventional',
    template: {
      depositType: 'Savings Account',
      minAmount: 1000,
      interestRate: 4,
      interestBased: true,
      regulatoryCompliant: true
    },
    isDefault: true
  },
  {
    id: 'conventional-health-insurance',
    name: 'Health Insurance',
    description: 'Traditional health insurance coverage',
    category: 'insurance',
    bankingMode: 'conventional',
    template: {
      insuranceType: 'Health',
      premium: 250,
      coverage: 50000,
      interestBased: false,
      regulatoryCompliant: true
    },
    isDefault: true
  }
];
