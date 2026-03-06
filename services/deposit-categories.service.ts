import axios from 'axios';
import { API } from '@/api';
import { getAuthToken, getOrganisationId } from '@/lib/auth';

export enum DepositCategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum DepositCategoryType {
  DEMAND_DEPOSIT = 'demand_deposit',
  TERM_DEPOSIT = 'term_deposit',
}

export interface DepositCategory {
  _id: string;
  categoryName: string;
  categoryType: DepositCategoryType | string;
  description: string;
  organisation?: string;
  status: DepositCategoryStatus | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateDepositCategoryDto {
  categoryName: string;
  categoryType: DepositCategoryType | string;
  description: string;
  organisation?: string;
  status?: DepositCategoryStatus | string;
}

export interface UpdateDepositCategoryDto {
  _id: string;
  categoryName?: string;
  categoryType?: DepositCategoryType | string;
  description?: string;
  organisation?: string;
  status?: DepositCategoryStatus | string;
}

export interface DepositCategoryFilters {
  status?: DepositCategoryStatus | string;
  categoryType?: DepositCategoryType | string;
  page?: number;
  limit?: number;
  organisationId?: string;
}

export interface DepositCategoriesListResponse {
  success: boolean;
  result: {
    depositCategories: DepositCategory[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface DepositCategoryResponse {
  success: boolean;
  result?: { depositCategory: DepositCategory };
}

const create = async (data: CreateDepositCategoryDto): Promise<DepositCategoryResponse> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${API.domain}${API.endPoints.createDepositCategory}`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200 || response.status === 201) return response.data;
  throw new Error('Failed to create deposit category');
};

const getAll = async (filters?: DepositCategoryFilters): Promise<DepositCategoriesListResponse> => {
  const params = new URLSearchParams();
  const organisationId = filters?.organisationId ?? getOrganisationId();
  if (organisationId) params.append('organisation', organisationId);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'organisationId' || value === undefined || value === '') return;
      params.append(key, String(value));
    });
  }
  const token = getAuthToken();
  const response = await axios.get(
    `${API.domain}${API.endPoints.getAllDepositCategories}${params.toString() ? '?' + params.toString() : ''}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch deposit categories');
};

const getById = async (id: string): Promise<DepositCategoryResponse> => {
  const token = getAuthToken();
  const response = await axios.get(`${API.domain}${API.endPoints.getDepositCategoryById}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch deposit category');
};

const getByType = async (categoryType: string): Promise<{ success: boolean; result: { depositCategories: DepositCategory[]; count: number } }> => {
  const token = getAuthToken();
  const response = await axios.get(
    `${API.domain}${API.endPoints.getDepositCategoriesByType}/${categoryType}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch deposit categories by type');
};

const update = async (data: UpdateDepositCategoryDto): Promise<DepositCategoryResponse> => {
  const { _id, ...updateData } = data;
  const token = getAuthToken();
  const response = await axios.put(
    `${API.domain}${API.endPoints.updateDepositCategory}/${_id}`,
    updateData,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to update deposit category');
};

const deleteCategory = async (id: string): Promise<{ success: boolean; result?: { message: string } }> => {
  const token = getAuthToken();
  const response = await axios.delete(`${API.domain}${API.endPoints.deleteDepositCategory}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (response.status === 200 || response.status === 204) return response.data;
  throw new Error('Failed to delete deposit category');
};

export const depositCategoryService = {
  create,
  getAll,
  getById,
  getByType,
  update,
  delete: deleteCategory,
};
