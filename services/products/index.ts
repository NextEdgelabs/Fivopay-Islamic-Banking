import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Loan Product Enums (matching the model)
export enum LoanProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum RepaymentFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half_yearly',
  YEARLY = 'yearly',
}

export enum ProductType {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  BASIC = 'basic',
  CUSTOM = 'custom',
}

// Loan Product Interface (matching the model)
export interface LoanProduct {
  _id: string;
  productName: string;
  description: string;
  organisation: string;
  category: string; // LoanCategory ID
  productType: ProductType | string;
  minLoanAmount: number;
  maxLoanAmount: number;
  interestRate: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  repaymentFrequency: RepaymentFrequency | string;
  status: LoanProductStatus | string;
  eligibilityCriteria?: {
    minAge?: number;
    maxAge?: number;
    minIncome?: number;
    creditScoreMin?: number;
    requiredDocuments?: string[];
    employmentType?: string[];
  };
  processingFee?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  prepaymentCharges?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  latePaymentCharges?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  features?: string[];
  benefits?: string[];
  termsAndConditions?: string;
  documentsRequired?: string[];
  applicationProcess?: {
    steps: string[];
    estimatedTime: string;
    requiredDocuments: string[];
  };
  promotionalOffers?: {
    title: string;
    description: string;
    validFrom: Date | string;
    validTo: Date | string;
    discountPercentage?: number;
    discountAmount?: number;
  }[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Legacy types for backward compatibility (if needed)
export type AnyProduct = LoanProduct;
export type ProductStatus = 'Active' | 'Inactive' | 'Draft' | 'Pending Approval' | 'Retired';

// Eligibility Rule interface (for backward compatibility with deposits and other modules)
export interface EligibilityRule {
  field: 'age' | 'annualIncome' | 'occupation';
  operator: '==' | '!=' | '>=' | '<=' | '>' | '<';
  value: string | number;
}

// Legacy product types for backward compatibility
export type TermDepositProduct = LoanProduct & {
  type?: 'Term Deposit';
  subType?: string;
  eligibilityRules?: EligibilityRule[];
  interestRates?: { [tenureInMonths: number]: number };
  minDeposit?: number;
  maxDeposit?: number;
  compoundingFrequency?: string;
};

export interface CreateLoanProductDto {
  productName: string;
  description: string;
  organisation: string;
  category: string;
  productType: ProductType | string;
  minLoanAmount: number;
  maxLoanAmount: number;
  interestRate: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  repaymentFrequency: RepaymentFrequency | string;
  status?: LoanProductStatus | string;
  eligibilityCriteria?: {
    minAge?: number;
    maxAge?: number;
    minIncome?: number;
    creditScoreMin?: number;
    requiredDocuments?: string[];
    employmentType?: string[];
  };
  processingFee?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  prepaymentCharges?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  latePaymentCharges?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  features?: string[];
  benefits?: string[];
  termsAndConditions?: string;
  documentsRequired?: string[];
  applicationProcess?: {
    steps: string[];
    estimatedTime: string;
    requiredDocuments: string[];
  };
  promotionalOffers?: {
    title: string;
    description: string;
    validFrom: Date | string;
    validTo: Date | string;
    discountPercentage?: number;
    discountAmount?: number;
  }[];
}

export type CreateProductDto = CreateLoanProductDto;
export type UpdateProductDto = Partial<CreateLoanProductDto> & { _id: string };

export interface ProductFilters {
  search?: string;
  productType?: ProductType | string;
  status?: LoanProductStatus | string;
  category?: string;
  organisation?: string;
  page?: number;
  limit?: number;
}

// API Response Types
export interface LoanProductResponse {
  success: boolean;
  message: string;
  // Some endpoints wrap the product in `data.loanProduct`,
  // others return it under `result.loanProduct` or directly as `result`.
  data?: {
    loanProduct: LoanProduct;
  };
  result?: {
    loanProduct?: LoanProduct;
    message?: string;
  } | LoanProduct;
}

export interface LoanProductsListResponse {
  success: boolean;
  message: string;
  result: {
    loanProducts: LoanProduct[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

// Normalize different backend response shapes to always return a LoanProduct
function extractLoanProductFromResponse(raw: LoanProductResponse | any): LoanProduct {
  if (!raw) return raw as LoanProduct;

  // Preferred: data.loanProduct
  if (raw.data && raw.data.loanProduct) {
    return raw.data.loanProduct as LoanProduct;
  }

  // Common shape for create/update: result.{ message, loanProduct }
  if (raw.result && (raw.result as any).loanProduct) {
    return (raw.result as any).loanProduct as LoanProduct;
  }

  // get-by-id returns result as the product itself
  if (raw.result && !(raw.result as any).loanProduct) {
    return raw.result as LoanProduct;
  }

  // Fallbacks
  if (raw.loanProduct) {
    return raw.loanProduct as LoanProduct;
  }

  return raw as LoanProduct;
}

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

export const productService = {
  /**
   * Get all loan products with optional filters
   * API: GET /api/v1/loan-product/get-all-loan-products
   */
  async getProducts(filters?: ProductFilters): Promise<AnyProduct[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const token = getAuthToken();
      const response = await axios.get<LoanProductsListResponse>(
        `${API.domain}${API.endPoints.getAllLoanProducts}?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const products = response.data.result?.loanProducts || [];
        return products;
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  /**
   * Get a single loan product by ID
   * API: GET /api/v1/loan-product/get-loan-product-by-id/:id
   */
  async getProductById(id: string): Promise<AnyProduct> {
    try {
      const token = getAuthToken();
      const response:any = await axios.get<LoanProductResponse>(
        `${API.domain}${API.endPoints.getLoanProductById}/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        return extractLoanProductFromResponse(response.data);
      } else {
        throw new Error('Failed to fetch product');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  },

  /**
   * Create a new loan product
   * API: POST /api/v1/loan-product/create-loan-product
   */
  async createProduct(data: CreateProductDto): Promise<AnyProduct> {
    try {
      const token = getAuthToken();
      const response = await axios.post<LoanProductResponse>(
        `${API.domain}${API.endPoints.createLoanProduct}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if ((response.status === 200 || response.status === 201) && response.data.success) {
        const product = extractLoanProductFromResponse(response.data);
        if (!product) {
          throw new Error('Failed to create product');
        }
        return product;
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  /**
   * Update a loan product
   * API: PUT /api/v1/loan-product/update-loan-product/:id
   */
  async updateProduct(id: string, data: UpdateProductDto): Promise<AnyProduct> {
    try {
      const { _id, ...updateData } = data;
      const token = getAuthToken();
      const response = await axios.put<LoanProductResponse>(
        `${API.domain}${API.endPoints.updateLoanProduct}/${id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const product = extractLoanProductFromResponse(response.data);
        if (!product) {
          throw new Error('Failed to update product');
        }
        return product;
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  /**
   * Delete a loan product
   * API: DELETE /api/v1/loan-product/delete-loan-product/:id
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      const token = getAuthToken();
      const response = await axios.delete(
        `${API.domain}${API.endPoints.deleteLoanProduct}/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status !== 200 && response.status !== 204) {
        throw new Error('Failed to delete product');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },
};
