import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';
import type { DepositCategory } from './deposit-categories.service';

export enum DepositProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum DepositProductType {
  SAVINGS = 'savings',
  CURRENT = 'current',
  FD = 'fd',
  RD = 'rd',
}

export interface DepositProduct {
  _id: string;
  productName: string;
  category: DepositCategory | string;
  productType: DepositProductType | string;
  description: string;
  organisation?: string;
  minAmount: number;
  maxAmount: number;
  defaultInterestRate: number;
  interestRatesByTenure?: Record<number, number>;
  status: DepositProductStatus | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateDepositProductDto {
  productName: string;
  category: string;
  productType: DepositProductType | string;
  description: string;
  organisation?: string;
  minAmount?: number;
  maxAmount?: number;
  defaultInterestRate?: number;
  interestRatesByTenure?: Record<number, number>;
  status?: DepositProductStatus | string;
}

export interface UpdateDepositProductDto {
  _id: string;
  productName?: string;
  category?: string;
  productType?: DepositProductType | string;
  description?: string;
  organisation?: string;
  minAmount?: number;
  maxAmount?: number;
  defaultInterestRate?: number;
  interestRatesByTenure?: Record<number, number>;
  status?: DepositProductStatus | string;
}

export interface DepositProductFilters {
  status?: DepositProductStatus | string;
  productType?: DepositProductType | string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface DepositProductsListResponse {
  success: boolean;
  result: {
    depositProducts: DepositProduct[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface DepositProductResponse {
  success: boolean;
  result?: { depositProduct: DepositProduct };
}

const create = async (data: CreateDepositProductDto): Promise<DepositProductResponse> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${API.domain}${API.endPoints.createDepositProduct}`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200 || response.status === 201) return response.data;
  throw new Error('Failed to create deposit product');
};

const getAll = async (filters?: DepositProductFilters): Promise<DepositProductsListResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
  }
  const token = getAuthToken();
  const response = await axios.get(
    `${API.domain}${API.endPoints.getAllDepositProducts}${params.toString() ? '?' + params.toString() : ''}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch deposit products');
};

const getById = async (id: string): Promise<DepositProductResponse> => {
  const token = getAuthToken();
  const response = await axios.get(`${API.domain}${API.endPoints.getDepositProductById}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch deposit product');
};

const getByCategory = async (categoryId: string): Promise<{ success: boolean; result: { depositProducts: DepositProduct[]; count: number } }> => {
  const token = getAuthToken();
  const response = await axios.get(
    `${API.domain}${API.endPoints.getDepositProductsByCategory}/${categoryId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch deposit products by category');
};

const getByType = async (productType: string): Promise<{ success: boolean; result: { depositProducts: DepositProduct[]; count: number } }> => {
  const token = getAuthToken();
  const response = await axios.get(
    `${API.domain}${API.endPoints.getDepositProductsByType}/${productType}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch deposit products by type');
};

const update = async (data: UpdateDepositProductDto): Promise<DepositProductResponse> => {
  const { _id, ...updateData } = data;
  const token = getAuthToken();
  const response = await axios.put(
    `${API.domain}${API.endPoints.updateDepositProduct}/${_id}`,
    updateData,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to update deposit product');
};

const deleteProduct = async (id: string): Promise<{ success: boolean; result?: { message: string } }> => {
  const token = getAuthToken();
  const response = await axios.delete(`${API.domain}${API.endPoints.deleteDepositProduct}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (response.status === 200 || response.status === 204) return response.data;
  throw new Error('Failed to delete deposit product');
};

export const depositProductService = {
  create,
  getAll,
  getById,
  getByCategory,
  getByType,
  update,
  delete: deleteProduct,
};
