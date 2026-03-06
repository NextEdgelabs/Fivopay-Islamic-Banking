import axios from "axios";
import { API } from "@/api";
import { getAuthToken, getOrganisationId } from "@/lib/auth";

// Branch Types
export interface Branch {
  id?: string;
  _id?: string; // MongoDB ObjectId for compatibility
  branchCode: string;
  branchName: string;
  branchType: 'Main Branch' | 'Sub Branch' | 'Extension Counter';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: 'India';
  landmark?: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email: string;
  managerName: string;
  managerPhone: string;
  openingDate: string;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  totalCustomers: number;
}

export interface CreateBranchDto extends Omit<Branch, 'id' | 'branchCode' | 'country' | 'totalCustomers'> {}
export interface UpdateBranchDto extends Partial<CreateBranchDto> {
  id: string;
}

export interface BranchFilters {
  search?: string;
  state?: string;
  status?: Branch['status'];
  branchType?: Branch['branchType'];
  page?: number;
  limit?: number;
  /** Scope branches by organisation */
  organisationId?: string;
}

export interface BranchResponse {
  success: boolean;
  message: string;
  data: Branch;
}

export interface BranchesListResponse {
  success: boolean;
  message: string;
  data: {
    branches: Branch[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBranches: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// API Service Functions
export const createBranch = async (data: CreateBranchDto): Promise<BranchResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API.domain}${API.endPoints.createBranch}`,
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
      throw new Error('Failed to create branch');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create branch');
  }
};

export const getAllBranches = async (filters?: BranchFilters): Promise<BranchesListResponse> => {
  try {
    const params = new URLSearchParams();
    const organisationId = filters?.organisationId ?? getOrganisationId();
    if (organisationId) params.append('organisation', organisationId);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (key === 'organisationId' || value === undefined || value === '') return;
        params.append(key, value.toString());
      });
    }
    
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getAllBranches}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch branches');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch branches');
  }
};

export const getBranchById = async (id: string): Promise<BranchResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getBranchById}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch branch');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch branch');
  }
};

export const updateBranch = async (data: UpdateBranchDto): Promise<BranchResponse> => {
  try {
    const { id, ...updateData } = data;
    const token = getAuthToken();
    const response = await axios.put(`${API.domain}${API.endPoints.updateBranch}/${id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to update branch');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update branch');
  }
};

export const deleteBranch = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API.domain}${API.endPoints.deleteBranch}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      throw new Error('Failed to delete branch');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete branch');
  }
};

// Branch Service Object (for easier imports)
export const branchService = {
  create: createBranch,
  getAll: getAllBranches,
  getById: getBranchById,
  update: updateBranch,
  delete: deleteBranch,
};
