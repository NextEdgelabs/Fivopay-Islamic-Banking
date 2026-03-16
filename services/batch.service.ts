import axios from 'axios';
import { API } from '@/api';
import { getAuthToken, getOrganisationId } from '@/lib/auth';
import { Customer } from '@/services/customers.service';
import { Employee } from '@/services/employee.service';

// Batch Types and Interfaces (matching backend CustomerBatch model)
export enum BatchStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Completed = 'Completed',
  Closed = 'Closed',
}

export interface Batch {
  _id?: string;
  id?: string;
  batchName: string;
  batchCode?: string;
  
  // Employee Assignment (required)
  employeeId: string | Employee;
  employee?: Employee;
  
  // Organisation and Branch References
  organisation?: string | { _id: string; organisationName?: string; organizationName?: string; name?: string };
  branch?: string | { _id: string; branchName: string };
  
  // Customer References
  customers: string[] | Customer[];
  
  // Batch Details
  assignmentDate: string | Date;
  completionDate?: string | Date;
  status: BatchStatus;
  
  // Statistics
  totalCustomers?: number;
  processedCustomers?: number;
  
  // System Fields
  isDeleted?: boolean;
  isActive?: boolean;
  
  // Timestamps
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateBatchDto {
  batchName: string;
  batchCode?: string;
  employeeId: string; // Required
  organisation?: string;
  branch?: string;
  customers?: string[];
  assignmentDate: string | Date; // Required
  status?: BatchStatus;
}

export interface UpdateBatchDto {
  batchName?: string;
  batchCode?: string;
  employeeId?: string;
  organisation?: string;
  branch?: string;
  customers?: string[];
  assignmentDate?: string | Date;
  completionDate?: string | Date;
  status?: BatchStatus;
}

export interface BatchFilters {
  page?: number;
  limit?: number;
  status?: BatchStatus | string;
  employeeId?: string;
  organisation?: string;
  search?: string;
}

export interface BatchResponse {
  success: boolean;
  message: string;
  data?: {
    batch: Batch;
  };
  result?: Batch; // backend may return batch in result
}

export interface BatchesListResponse {
  success: boolean;
  message: string;
  data?: {
    batches: Batch[];
    total: number;
  };
  result?: {
    batches?: Batch[];
    total?: number;
  }; // backend may return in result
}

function normalizeBatchResponse(raw: any): BatchResponse {
  // Backend returns { success, message, data: batch } - batch is the document directly
  const batch = raw?.result ?? raw?.data?.batch ?? raw?.data ?? raw?.batch;
  return {
    success: raw?.success ?? false,
    message: raw?.message ?? '',
    data: { batch },
  };
}

function normalizeBatchesListResponse(raw: any): BatchesListResponse {
  const batches = raw?.result?.batches ?? raw?.data?.batches ?? raw?.batches ?? [];
  const total = raw?.result?.total ?? raw?.data?.total ?? raw?.total ?? batches.length;
  return {
    success: raw?.success ?? false,
    message: raw?.message ?? '',
    data: { batches, total },
  };
}

// Batch Service Class
class BatchService {
  async create(data: CreateBatchDto): Promise<BatchResponse> {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API.domain}${API.endPoints.createBatch}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return normalizeBatchResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create batch');
    }
  }

  async getAll(filters?: BatchFilters): Promise<BatchesListResponse> {
    try {
      const token = getAuthToken();
      const params = new URLSearchParams();
      
      const organisationId = filters?.organisation ?? getOrganisationId();
      if (organisationId) params.append('organisation', typeof organisationId === 'string' ? organisationId : String((organisationId as any)?._id ?? ''));
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.employeeId) params.append('employeeId', filters.employeeId);
      if (filters?.search) params.append('search', filters.search);

      const response: any = await axios.get(
        `${API.domain}${API.endPoints.getAllBatches}?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return normalizeBatchesListResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch batches');
    }
  }

  async getBatchesByEmployee(employeeId: string, filters?: { page?: number; limit?: number; status?: string }): Promise<BatchesListResponse> {
    try {
      const token = getAuthToken();
      const params = new URLSearchParams();
      
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.status) params.append('status', filters.status);

      const response = await axios.get(
        `${API.domain}${API.endPoints.getBatchesByEmployee}/${employeeId}?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return normalizeBatchesListResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch batches by employee');
    }
  }

  async getBatchCustomers(batchId: string, filters?: { page?: number; limit?: number }): Promise<{ success: boolean; message: string; data: { customers: Customer[]; total: number } }> {
    try {
      const token = getAuthToken();
      const params = new URLSearchParams();
      
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get(
        `${API.domain}${API.endPoints.getBatchCustomers}/${batchId}?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch batch customers');
    }
  }

  async getById(id: string): Promise<BatchResponse> {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API.domain}${API.endPoints.getBatchById}/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return normalizeBatchResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch batch');
    }
  }

  async update(id: string, data: UpdateBatchDto): Promise<BatchResponse> {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API.domain}${API.endPoints.updateBatch}/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return normalizeBatchResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update batch');
    }
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = getAuthToken();
      const response = await axios.delete(
        `${API.domain}${API.endPoints.deleteBatch}/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete batch');
    }
  }

  async addCustomers(batchId: string, customerIds: string[]): Promise<BatchResponse> {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API.domain}${API.endPoints.addCustomersToBatch}/${batchId}`,
        { customerIds },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return normalizeBatchResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add customers to batch');
    }
  }

  async removeCustomers(batchId: string, customerIds: string[]): Promise<BatchResponse> {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API.domain}${API.endPoints.removeCustomersFromBatch}/${batchId}`,
        { customerIds },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove customers from batch');
    }
  }

  async updateStatus(batchId: string, status: BatchStatus): Promise<BatchResponse> {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API.domain}${API.endPoints.updateBatchStatus}/${batchId}`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return normalizeBatchResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update batch status');
    }
  }

  async getStats(): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API.domain}${API.endPoints.getBatchStats}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch batch stats');
    }
  }
}

// Export singleton instance
export const batchService = new BatchService();

// Convenience functions
export const createBatch = (data: CreateBatchDto) => batchService.create(data);
export const getAllBatches = (filters?: BatchFilters) => batchService.getAll(filters);
export const getBatchById = (id: string) => batchService.getById(id);
export const getBatchesByEmployee = (employeeId: string, filters?: { page?: number; limit?: number; status?: string }) => 
  batchService.getBatchesByEmployee(employeeId, filters);
export const getBatchCustomers = (batchId: string, filters?: { page?: number; limit?: number }) => 
  batchService.getBatchCustomers(batchId, filters);
export const updateBatch = (id: string, data: UpdateBatchDto) => batchService.update(id, data);
export const addCustomersToBatch = (batchId: string, customerIds: string[]) => 
  batchService.addCustomers(batchId, customerIds);
export const removeCustomersFromBatch = (batchId: string, customerIds: string[]) => 
  batchService.removeCustomers(batchId, customerIds);
export const updateBatchStatus = (batchId: string, status: BatchStatus) => 
  batchService.updateStatus(batchId, status);
export const deleteBatch = (id: string) => batchService.delete(id);
export const getBatchStats = () => batchService.getStats();

