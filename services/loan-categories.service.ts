import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

// Loan Category Types
export interface LoanCategory {
  _id: string;
  categoryName: string;
  description: string;
  loanType: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  interestRate: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  status: 'active' | 'inactive';
  eligibilityCriteria: {
    minAge: number;
    maxAge: number;
    minIncome: number;
    requiredDocuments: string[];
    creditScoreMin: number;
  };
  processingFee: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  prepaymentCharges: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  latePaymentCharges: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  features: string[];
  termsAndConditions: string;
  createdAt: string;
  updatedAt: string;
}

// Note: The API doesn't seem to have sub-categories in the current response
// Keeping this interface for future use if sub-categories are added
export interface LoanSubCategory {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  isActive: boolean;
  displayOrder: number;
  interestRateRange: {
    min: number;
    max: number;
  };
  tenureRange: {
    min: number; // in months
    max: number; // in months
  };
  amountRange: {
    min: number;
    max: number;
  };
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  processingFee: number; // percentage
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanCategoryDto {
  categoryName: string;
  description: string;
  loanType: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  interestRate: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  status?: 'active' | 'inactive';
  eligibilityCriteria: {
    minAge: number;
    maxAge: number;
    minIncome: number;
    requiredDocuments: string[];
    creditScoreMin: number;
  };
  processingFee: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  prepaymentCharges: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  latePaymentCharges: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  features: string[];
  termsAndConditions: string;
}

export interface UpdateLoanCategoryDto extends Partial<CreateLoanCategoryDto> {
  _id: string;
}

export interface CreateLoanSubCategoryDto {
  name: string;
  description: string;
  categoryId: string;
  isActive?: boolean;
  displayOrder?: number;
  interestRateRange: {
    min: number;
    max: number;
  };
  tenureRange: {
    min: number;
    max: number;
  };
  amountRange: {
    min: number;
    max: number;
  };
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  processingFee: number;
}

export interface UpdateLoanSubCategoryDto extends Partial<CreateLoanSubCategoryDto> {
  _id: string;
}

export interface LoanCategoryFilters {
  search?: string;
  status?: 'active' | 'inactive';
  loanType?: string;
}

export interface LoanCategoryResponse {
  success: boolean;
  message: string;
  data: LoanCategory;
}

export interface LoanCategoriesListResponse {
  success: boolean;
  result: {
    loanCategories: LoanCategory[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

// API Service Functions
export const createLoanCategory = async (data: CreateLoanCategoryDto): Promise<LoanCategoryResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API.domain}${API.endPoints.createLoanCategory}`,
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
      throw new Error('Failed to create loan category');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create loan category');
  }
};

export const getAllLoanCategories = async (filters?: LoanCategoryFilters): Promise<LoanCategoriesListResponse> => {
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
    const response = await axios.get(`${API.domain}${API.endPoints.getAllLoanCategories}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch loan categories');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch loan categories');
  }
};

export const getLoanCategoryById = async (id: string): Promise<LoanCategoryResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getLoanCategoryById}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch loan category');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch loan category');
  }
};

export const updateLoanCategory = async (data: UpdateLoanCategoryDto): Promise<LoanCategoryResponse> => {
  try {
    const { _id, ...updateData } = data;
    const token = getAuthToken();
    const response = await axios.put(`${API.domain}${API.endPoints.updateLoanCategory}/${_id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to update loan category');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update loan category');
  }
};

export const deleteLoanCategory = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API.domain}${API.endPoints.deleteLoanCategory}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      throw new Error('Failed to delete loan category');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete loan category');
  }
};

// Sub-category functions
export const createLoanSubCategory = async (data: CreateLoanSubCategoryDto): Promise<{ success: boolean; message: string; data: LoanSubCategory }> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API.domain}${API.endPoints.createLoanSubCategory}`,
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
      throw new Error('Failed to create loan sub-category');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create loan sub-category');
  }
};

export const updateLoanSubCategory = async (data: UpdateLoanSubCategoryDto): Promise<{ success: boolean; message: string; data: LoanSubCategory }> => {
  try {
    const { _id, ...updateData } = data;
    const token = getAuthToken();
    const response = await axios.put(`${API.domain}${API.endPoints.updateLoanSubCategory}/${_id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to update loan sub-category');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update loan sub-category');
  }
};

export const deleteLoanSubCategory = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API.domain}${API.endPoints.deleteLoanSubCategory}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      throw new Error('Failed to delete loan sub-category');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete loan sub-category');
  }
};

// Loan Category Service Object (for easier imports)
export const loanCategoryService = {
  create: createLoanCategory,
  getAll: getAllLoanCategories,
  getById: getLoanCategoryById,
  update: updateLoanCategory,
  delete: deleteLoanCategory,
  createSubCategory: createLoanSubCategory,
  updateSubCategory: updateLoanSubCategory,
  deleteSubCategory: deleteLoanSubCategory,
};
