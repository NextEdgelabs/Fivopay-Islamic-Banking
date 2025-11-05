// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ProductType = 'Term Deposit' | 'Loan';
export type TermDepositSubType = 'Fixed Deposit' | 'Recurring Deposit';
export type LoanSubType = 'Business' | 'Education' | 'Home' | 'Personal' | 'Emergency';
export type ProductStatus = 'Active' | 'Inactive' | 'Draft' | 'Pending Approval' | 'Retired';

// Base Product Interface
export interface Product {
  id: string;
  name: string;
  type: ProductType;
  description: string;
  status: ProductStatus;
  eligibilityRules: EligibilityRule[];
  requiredDocuments: string[];
  fees: { [feeName: string]: number };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version: number;
}

// Term Deposit Product
export interface TermDepositProduct extends Product {
  type: 'Term Deposit';
  subType: TermDepositSubType;
  interestRates: { [tenureInMonths: number]: number }; // e.g., { 12: 6.5, 24: 7.0 }
  minDeposit: number;
  maxDeposit: number;
  compoundingFrequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly';
}

// Loan Product
export interface LoanProduct extends Product {
  type: 'Loan';
  subType: LoanSubType;
  interestRate: number; // Annual interest rate
  minTenure: number; // in months
  maxTenure: number; // in months
  minAmount: number;
  maxAmount: number;
  processingFee: number; // as a percentage of loan amount
}

export type AnyProduct = TermDepositProduct | LoanProduct;

export interface EligibilityRule {
  field: 'age' | 'annualIncome' | 'occupation';
  operator: '==' | '!=' | '>=' | '<=' | '>' | '<';
  value: string | number;
}

export type CreateProductDto = Omit<TermDepositProduct, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> | Omit<LoanProduct, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductFilters {
  search?: string;
  type?: ProductType;
  status?: ProductStatus;
}


// ============================================================================
// MOCK DATA
// ============================================================================

let mockProducts: AnyProduct[] = [
  // Term Deposits
  {
    id: 'PROD_TD_001',
    name: 'Standard Fixed Deposit',
    type: 'Term Deposit',
    subType: 'Fixed Deposit',
    description: 'A safe and secure investment with guaranteed returns.',
    status: 'Active',
    interestRates: { 12: 6.8, 24: 7.0, 36: 7.2, 60: 7.5 },
    minDeposit: 5000,
    maxDeposit: 1000000,
    compoundingFrequency: 'Quarterly',
    eligibilityRules: [{ field: 'age', operator: '>=', value: 18 }],
    requiredDocuments: ['Identity Proof', 'Address Proof', 'PAN Card'],
    fees: { 'Account Maintenance': 0 },
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    createdBy: 'Admin',
    version: 1,
  },
  {
    id: 'PROD_TD_002',
    name: 'Flexi Recurring Deposit',
    type: 'Term Deposit',
    subType: 'Recurring Deposit',
    description: 'Build your savings with monthly contributions.',
    status: 'Active',
    interestRates: { 12: 6.5, 24: 6.8, 36: 7.0, 60: 7.2 },
    minDeposit: 1000,
    maxDeposit: 50000, // per month
    compoundingFrequency: 'Monthly',
    eligibilityRules: [],
    requiredDocuments: ['Identity Proof', 'Address Proof'],
    fees: {},
    createdAt: '2023-02-20T11:00:00Z',
    updatedAt: '2023-02-20T11:00:00Z',
    createdBy: 'Admin',
    version: 1,
  },
  // Loans
  {
    id: 'PROD_LN_001',
    name: 'Business Growth Loan',
    type: 'Loan',
    subType: 'Business',
    description: 'Fuel your business expansion with our tailored business loans.',
    status: 'Active',
    interestRate: 12.5,
    minTenure: 12,
    maxTenure: 60,
    minAmount: 100000,
    maxAmount: 5000000,
    processingFee: 1.5,
    eligibilityRules: [{ field: 'annualIncome', operator: '>=', value: 500000 }],
    requiredDocuments: ['Identity Proof', 'Address Proof', 'PAN Card', 'Business Registration', 'Bank Statements (6 months)'],
    fees: { 'Processing Fee': 1.5, 'Late Payment Fee': 500 },
    createdAt: '2023-03-10T09:00:00Z',
    updatedAt: '2023-03-10T09:00:00Z',
    createdBy: 'Admin',
    version: 1,
  },
  {
    id: 'PROD_LN_002',
    name: 'Student Education Loan',
    type: 'Loan',
    subType: 'Education',
    description: 'Invest in your future with our competitive education loans.',
    status: 'Active',
    interestRate: 9.8,
    minTenure: 24,
    maxTenure: 120,
    minAmount: 50000,
    maxAmount: 2000000,
    processingFee: 0.5,
    eligibilityRules: [{ field: 'occupation', operator: '==', value: 'Student' }],
    requiredDocuments: ['Identity Proof', 'Address Proof', 'Admission Letter', 'Parent/Guardian Income Proof'],
    fees: { 'Processing Fee': 0.5 },
    createdAt: '2023-04-05T14:00:00Z',
    updatedAt: '2023-04-05T14:00:00Z',
    createdBy: 'Admin',
    version: 1,
  },
  {
    id: 'PROD_LN_003',
    name: 'Dream Home Loan',
    type: 'Loan',
    subType: 'Home',
    description: 'Turn your dream of owning a home into a reality.',
    status: 'Inactive',
    interestRate: 8.5,
    minTenure: 60,
    maxTenure: 360,
    minAmount: 500000,
    maxAmount: 10000000,
    processingFee: 1.0,
    eligibilityRules: [{ field: 'annualIncome', operator: '>=', value: 800000 }],
    requiredDocuments: ['Identity Proof', 'Address Proof', 'PAN Card', 'Salary Slips (3 months)', 'Property Documents'],
    fees: { 'Processing Fee': 1.0, 'Prepayment Penalty': 2.0 },
    createdAt: '2023-05-12T16:00:00Z',
    updatedAt: '2023-05-12T16:00:00Z',
    createdBy: 'Admin',
    version: 1,
  },
];

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<AnyProduct[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = [...mockProducts];
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.id.toLowerCase().includes(searchLower)
          );
        }
        if (filters?.type) {
          filtered = filtered.filter(p => p.type === filters.type);
        }
        if (filters?.status) {
          filtered = filtered.filter(p => p.status === filters.status);
        }
        resolve(filtered);
      }, 500);
    });
  },

  async getProductById(id: string): Promise<AnyProduct> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p.id === id);
        if (product) {
          resolve(product);
        } else {
          reject(new Error('Product not found'));
        }
      }, 300);
    });
  },

  async createProduct(data: CreateProductDto): Promise<AnyProduct> {
    return new Promise(resolve => {
      setTimeout(() => {
        const { version, ...productData } = data;
        const newProduct: AnyProduct = {
          ...productData,
          id: `PROD_${data.type === 'Loan' ? 'LN' : 'TD'}_${String(mockProducts.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Admin', // In a real app, this would be the logged-in user
          version: version || 1,
        } as AnyProduct;
        mockProducts.push(newProduct);
        resolve(newProduct);
      }, 500);
    });
  },

  async updateProduct(id: string, data: UpdateProductDto): Promise<AnyProduct> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p.id === id);
        if (index === -1) {
          reject(new Error('Product not found'));
          return;
        }
        const { version, ...updateData } = data;
        const updatedProduct: AnyProduct = {
          ...mockProducts[index],
          ...updateData,
          updatedAt: new Date().toISOString(),
          version: (mockProducts[index].version || 0) + 1,
        } as AnyProduct;
        mockProducts[index] = updatedProduct;
        resolve(updatedProduct);
      }, 500);
    });
  },

  async deleteProduct(id: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        mockProducts = mockProducts.filter(p => p.id !== id);
        resolve();
      }, 500);
    });
  },
};
