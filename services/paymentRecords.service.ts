import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

// Payment Record Enums
export enum PaymentType {
  Loan = 'loan',
  Product = 'product',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Verified = 'Verified',
  Rejected = 'Rejected',
  Collected = 'Collected',
}

// Payment Record Interface
export interface PaymentRecord {
  _id?: string;
  id?: string;
  
  // Product/Investment References
  productId?: string;
  investmentId?: string;
  
  // Payment Type
  type: PaymentType;
  
  // Payment Amount
  amount: number;
  
  // Notes
  notes?: string;
  
  // Photo Proof
  photoproof_url?: string;
  
  // Agent (Employee) Reference
  agentId: string;
  agent?: {
    _id: string;
    fullName: string;
    employeeId: string;
  };
  
  // Payment Status
  status: PaymentStatus;
  
  // Verification Details
  verifiedBy?: string;
  verifiedAt?: string | Date;
  rejectionReason?: string;
  
  // System Fields
  isDeleted?: boolean;
  isActive?: boolean;
  
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreatePaymentRecordDto {
  productId?: string;
  investmentId?: string;
  type: PaymentType;
  amount: number;
  notes?: string;
  photoproof_url?: string;
  agentId: string;
  status?: PaymentStatus;
}

export interface UpdatePaymentRecordDto {
  productId?: string;
  investmentId?: string;
  type?: PaymentType;
  amount?: number;
  notes?: string;
  photoproof_url?: string;
  status?: PaymentStatus;
}

export interface PaymentRecordResponse {
  success: boolean;
  message: string;
  data?: PaymentRecord;
  result?: PaymentRecord;
}

export interface PaymentRecordsListResponse {
  success: boolean;
  message: string;
  data?: PaymentRecord[];
  result?: PaymentRecord[];
}

// Helper Functions
/**
 * Normalize payment record data from API to match frontend expectations
 */
function normalizePaymentRecord(record: any): PaymentRecord {
  return {
    ...record,
    id: record._id || record.id,
    agentId: typeof record.agentId === 'string'
      ? record.agentId
      : typeof record.agentId === 'object' && record.agentId?._id
      ? record.agentId._id
      : record.agentId?.toString() || '',
    agent: typeof record.agentId === 'object' && record.agentId
      ? {
          _id: record.agentId._id || record.agentId.toString(),
          fullName: record.agentId.fullName || record.agentId.name || '',
          employeeId: record.agentId.employeeId || record.agentId._id || '',
        }
      : record.agent,
    type: record.type || PaymentType.Loan,
    status: record.status || PaymentStatus.Pending,
    amount: record.amount || 0,
    notes: record.notes || '',
    photoproof_url: record.photoproof_url || '',
    isDeleted: record.isDeleted ?? false,
    isActive: record.isActive ?? true,
  };
}

// API Service Functions
export const getAllPaymentRecords = async (): Promise<PaymentRecordsListResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getAllPaymentRecords}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200) {
      const data = response.data;
      if (data.success && (data.data || data.result)) {
        const records = (data.data || data.result || []).map(normalizePaymentRecord);
        return {
          ...data,
          data: records,
          result: records,
        };
      }
      return data;
    } else {
      throw new Error('Failed to fetch payment records');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch payment records');
  }
};

export const getPaymentRecordById = async (id: string): Promise<PaymentRecordResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getPaymentRecordById}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200) {
      const data = response.data;
      if (data.success && data.data) {
        return {
          ...data,
          data: normalizePaymentRecord(data.data),
        };
      }
      return data;
    } else {
      throw new Error('Failed to fetch payment record');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch payment record');
  }
};

export const getPaymentRecordsByAgent = async (agentId: string): Promise<PaymentRecordsListResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getPaymentRecordsByAgent}/${agentId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200) {
      const data = response.data;
      if (data.success && (data.data || data.result)) {
        const records = (data.data || data.result.paymentRecords || []).map(normalizePaymentRecord);
        return {
          ...data,
          data: records,
          result: {
            paymentRecords: records,
          },
        };
      }
      return data;
    } else {
      throw new Error('Failed to fetch payment records by agent');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch payment records by agent');
  }
};

export const createPaymentRecord = async (record: CreatePaymentRecordDto): Promise<PaymentRecordResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API.domain}${API.endPoints.createPaymentRecord}`, record, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200 || response.status === 201) {
      const data = response.data;
      if (data.success && data.data) {
        return {
          ...data,
          data: normalizePaymentRecord(data.data),
        };
      }
      return data;
    } else {
      throw new Error('Failed to create payment record');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create payment record');
  }
};

export const updatePaymentRecord = async (id: string, record: UpdatePaymentRecordDto): Promise<PaymentRecordResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API.domain}${API.endPoints.updatePaymentRecord}/${id}`, record, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200) {
      const data = response.data;
      if (data.success && data.data) {
        return {
          ...data,
          data: normalizePaymentRecord(data.data),
        };
      }
      return data;
    } else {
      throw new Error('Failed to update payment record');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update payment record');
  }
};

export interface UpdatePaymentStatusDto {
  status: PaymentStatus;
  rejectionReason?: string;
  verifiedBy?: string;
}

export const updatePaymentStatus = async (id: string, data: UpdatePaymentStatusDto): Promise<PaymentRecordResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API.domain}${API.endPoints.updatePaymentStatus}/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200) {
      const responseData = response.data;
      if (responseData.success && responseData.data) {
        return {
          ...responseData,
          data: normalizePaymentRecord(responseData.data),
        };
      }
      return responseData;
    } else {
      throw new Error('Failed to update payment status');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update payment status');
  }
};

export const verifyPaymentRecord = async (id: string): Promise<PaymentRecordResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API.domain}${API.endPoints.verifyPaymentRecord}/${id}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200) {
      const data = response.data;
      if (data.success && data.data) {
        return {
          ...data,
          data: normalizePaymentRecord(data.data),
        };
      }
      return data;
    } else {
      throw new Error('Failed to verify payment record');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify payment record');
  }
};

export const rejectPaymentRecord = async (id: string, rejectionReason: string): Promise<PaymentRecordResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API.domain}${API.endPoints.rejectPaymentRecord}/${id}`, {
      rejectionReason,
    }, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200) {
      const data = response.data;
      if (data.success && data.data) {
        return {
          ...data,
          data: normalizePaymentRecord(data.data),
        };
      }
      return data;
    } else {
      throw new Error('Failed to reject payment record');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reject payment record');
  }
};

export const collectPaymentRecord = async (id: string): Promise<PaymentRecordResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API.domain}${API.endPoints.collectPaymentRecord}/${id}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200) {
      const data = response.data;
      if (data.success && data.data) {
        return {
          ...data,
          data: normalizePaymentRecord(data.data),
        };
      }
      return data;
    } else {
      throw new Error('Failed to collect payment record');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to collect payment record');
  }
};

export const deletePaymentRecord = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API.domain}${API.endPoints.deletePaymentRecord}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      throw new Error('Failed to delete payment record');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete payment record');
  }
};

// Service Object
export const paymentRecordService = {
  getAll: getAllPaymentRecords,
  getById: getPaymentRecordById,
  getByAgent: getPaymentRecordsByAgent,
  create: createPaymentRecord,
  update: updatePaymentRecord,
  updateStatus: updatePaymentStatus,
  verify: verifyPaymentRecord,
  reject: rejectPaymentRecord,
  collect: collectPaymentRecord,
  delete: deletePaymentRecord,
};

