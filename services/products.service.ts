import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

// ============================================================================
// TYPE DEFINITIONS FOR LOAN PRODUCTS
// ============================================================================

export enum ProductType {
  TERM_DEPOSIT = 'Term Deposit',
  LOAN = 'Loan'
}

export enum ProductStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DRAFT = 'Draft',
  PENDING_APPROVAL = 'Pending Approval',
  RETIRED = 'Retired'
}

export interface EligibilityRule {
  field: 'age' | 'annualIncome' | 'occupation';
  operator: '==' | '!=' | '>=' | '<=' | '>' | '<';
  value: string | number;
}

export interface TermDepositProduct {
  subType: 'Fixed Deposit' | 'Recurring Deposit';
  interestRates: { [tenureInMonths: number]: number };
  minDeposit: number;
  maxDeposit: number;
  compoundingFrequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly';
}

export interface LoanProductData {
  _id?: string;
  name: string;
  type: ProductType;
  description?: string;
  status?: ProductStatus;
  termDeposit?: TermDepositProduct;
  eligibilityRules?: EligibilityRule[];
  requiredDocuments?: string[];
  fees?: { [feeName: string]: number };
  createdBy: string;
  version?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLoanProductDto {
  name: string;
  type: ProductType;
  description?: string;
  status?: ProductStatus;
  termDeposit?: TermDepositProduct;
  eligibilityRules?: EligibilityRule[];
  requiredDocuments?: string[];
  fees?: { [feeName: string]: number };
  createdBy: string;
}

export interface UpdateLoanProductDto extends Partial<CreateLoanProductDto> {
  _id: string;
}

export interface LoanProductFilters {
  status?: ProductStatus;
  type?: ProductType;
  page?: number;
  limit?: number;
  search?: string;
}

export interface LoanProductSearchFilters {
  q?: string;
  type?: ProductType;
  status?: ProductStatus;
  page?: number;
  limit?: number;
}

export interface LoanProductResponse {
  success: boolean;
  result: {
    message?: string;
    product?: LoanProductData;
    products?: LoanProductData[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
    count?: number;
  };
}

export interface LoanProductsListResponse {
  success: boolean;
  result: {
    products: LoanProductData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

// ============================================================================
// LOAN PRODUCT SERVICE FUNCTIONS
// ============================================================================

export const createLoanProduct = async (data: CreateLoanProductDto): Promise<LoanProductResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API.domain}${API.endPoints.createLoanProduct}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error('Failed to create loan product');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.result || 'Failed to create loan product');
  }
};

export const getAllLoanProducts = async (filters?: LoanProductFilters): Promise<LoanProductsListResponse> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          // Map search to q parameter for the API
          if (key === 'search') {
            params.append('q', value.toString());
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getAllLoanProducts}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch loan products');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.result || 'Failed to fetch loan products');
  }
};

export const getLoanProductById = async (id: string): Promise<LoanProductResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getLoanProductById}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch loan product');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.result || 'Failed to fetch loan product');
  }
};

export const updateLoanProduct = async (data: UpdateLoanProductDto): Promise<LoanProductResponse> => {
  try {
    const { _id, ...updateData } = data;
    const token = getAuthToken();
    const response = await axios.put(`${API.domain}${API.endPoints.updateLoanProduct}/${_id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to update loan product');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.result || 'Failed to update loan product');
  }
};

export const deleteLoanProduct = async (id: string): Promise<LoanProductResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API.domain}${API.endPoints.deleteLoanProduct}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      throw new Error('Failed to delete loan product');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.result || 'Failed to delete loan product');
  }
};

export const getLoanProductsByType = async (productType: ProductType): Promise<LoanProductResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getLoanProductsByType}/${productType}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch loan products by type');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.result || 'Failed to fetch loan products by type');
  }
};

export const updateLoanProductStatus = async (id: string, status: ProductStatus): Promise<LoanProductResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API.domain}${API.endPoints.updateLoanProductStatus}/${id}`, 
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to update loan product status');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.result || 'Failed to update loan product status');
  }
};

export const searchLoanProducts = async (filters?: LoanProductSearchFilters): Promise<LoanProductsListResponse> => {
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
    const response = await axios.get(`${API.domain}${API.endPoints.searchLoanProducts}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to search loan products');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.result || 'Failed to search loan products');
  }
};