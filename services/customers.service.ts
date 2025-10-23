import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

// Customer Types and Interfaces (matching backend User model)
export interface Customer {
  _id?: string; // MongoDB ObjectId
  id?: string; // For compatibility
  customerId?: string; // For compatibility with existing code
  memberId?: string; // Backend User model has memberId
  
  // Primary Details
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string; // Backend stores as Date
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  fatherName?: string;
  motherName?: string;
  occupation: string;
  annualIncome?: number;
  
  // Address Information
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Account Information
  accountType: 'Savings' | 'Current' | 'Business';
  initialDeposit: number;
  currentBalance?: number;
  branch: string;
  status?: 'Active' | 'Inactive' | 'Pending' | 'Blocked';
  joinedDate?: string;
  
  // Nominee Information
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  nomineeAddress?: string;
  
  // KYC Details (matching backend User model)
  aadhaarNumber?: string;
  aadharVerificationStatus?: boolean; // Backend uses this field name
  panNumber?: string;
  panVerificationStatus?: boolean; // Backend uses this field name
  passportNumber?: string;
  drivingLicenseNumber?: string;
  voterIdNumber?: string;
  addressProofType?: 'Utility Bill' | 'Bank Statement' | 'Rent Agreement' | 'Property Tax Receipt';
  addressProofNumber?: string;
  kycStatus: 'Pending' | 'In Progress' | 'Verified' | 'Rejected';
  kycNotes?: string;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerDto {
  // Primary Details
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  fatherName?: string;
  motherName?: string;
  occupation: string;
  annualIncome?: number;
  
  // Address Information
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Account Information
  accountType: 'Savings' | 'Current' | 'Business';
  initialDeposit: number;
  branch: string;
  
  // Nominee Information
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  nomineeAddress?: string;
  
  // KYC Details
  aadhaarNumber?: string;
  panNumber?: string;
  passportNumber?: string;
  drivingLicenseNumber?: string;
  voterIdNumber?: string;
  addressProofType?: 'Utility Bill' | 'Bank Statement' | 'Rent Agreement' | 'Property Tax Receipt';
  addressProofNumber?: string;
  kycStatus?: 'Pending' | 'In Progress' | 'Verified' | 'Rejected';
  kycNotes?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  id: string;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  kycStatus?: string;
  accountType?: string;
  city?: string;
  state?: string;
  branch?: string;
  status?: string;
}

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

export interface CustomersListResponse {
  success: boolean;
  message: string;
  data: {
    users: Customer[]; // Backend returns 'users' array
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number; // Backend uses 'totalUsers'
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface CustomerTransaction {
  id: string;
  customerId: string;
  transactionId: string;
  date: string;
  description: string;
  type: 'Credit' | 'Debit';
  amount: number;
  balanceAfter: number;
  status: 'Completed' | 'Pending' | 'Failed';
  branchName: string;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  type: 'account_created' | 'kyc_verified' | 'profile_updated' | 'transaction' | 'status_changed' | 'document_uploaded';
  title: string;
  description: string;
  date: string;
  user?: string;
}

export interface ShareholderSummary {
  id: string;
  customerId: string;
  fullName: string;
  customerName: string; // For compatibility
  email: string;
  phone: string;
  totalShares: number;
  totalQuantity: number; // For compatibility
  totalInvestment: number;
  totalValue: number; // For compatibility
  lastPurchaseDate: string;
  memberId?: string; // For compatibility
  pendingShares: number; // For compatibility
  status: 'Active' | 'Inactive';
}

export interface CustomerDocument {
  id: string;
  type: string;
  fileName?: string;
  status: 'Missing' | 'Uploaded' | 'Verified' | 'Rejected';
  uploadedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface SharePurchase {
  id: string;
  customerId: string;
  purchaseDate: string;
  shareType: 'Equity' | 'Preference' | 'Redeemable';
  numberOfShares: number;
  quantity: number; // For compatibility
  pricePerShare: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online';
  status: 'Pending' | 'Completed' | 'Cancelled';
  approvalStatus: 'Pending Approval' | 'Approved' | 'Rejected'; // For compatibility
  certificateNumber?: string; // For compatibility
  shareholderId?: string; // For compatibility
  transactionReference?: string; // For compatibility
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSharePurchaseDto {
  customerId: string;
  purchaseDate: string;
  shareType: 'Equity' | 'Preference' | 'Redeemable';
  numberOfShares: number;
  quantity: number; // For compatibility
  pricePerShare: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online';
  status?: 'Pending' | 'Completed' | 'Cancelled';
  certificateNumber?: string; // For compatibility
  shareholderId?: string; // For compatibility
  transactionReference?: string; // For compatibility
  notes?: string;
}

export interface UpdateSharePurchaseDto extends Partial<CreateSharePurchaseDto> {
  id: string;
}

export const saveUserBasicInformation = async (customer: any)=> {
  try {
    const response = await axios.post( `${API.domain}${API.endPoints.saveUserBasicInformation}`, customer);
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error('Failed to save user basic information');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to save user basic information');
  }
};

// API Service Functions
export const createCustomer = async (customer: CreateCustomerDto): Promise<CustomerResponse> => {
    try {
        const response = await axios.post( `${API.domain}${API.endPoints.addCustomer}`, customer);
    if (response.status === 200 || response.status === 201) {
            return response.data;
    } else {
            throw new Error('Failed to create customer');
        }
    } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create customer');
  }
};

export const getAllCustomers = async (filters?: CustomerFilters): Promise<CustomersListResponse> => {
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
    const response = await axios.get(`${API.domain}${API.endPoints.getAllCustomers}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      // Backend returns { success, message, data: { users, pagination } }
      return response.data;
    } else {
      throw new Error('Failed to fetch customers');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch customers');
  }
};

export const getCustomerById = async (id: string): Promise<CustomerResponse> => {
  try {
    const response = await axios.get(`${API.domain}${API.endPoints.getCustomerById}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      // Backend returns { success, message, data: user }
      return response.data;
    } else {
      throw new Error('Failed to fetch customer');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch customer');
  }
};

export const updateCustomer = async (customer: UpdateCustomerDto): Promise<CustomerResponse> => {
  try {
    const { id, ...updateData } = customer;
    const response = await axios.put(`${API.domain}${API.endPoints.updateCustomer}/${id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to update customer');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update customer');
  }
};

export const deleteCustomer = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.delete(`${API.domain}${API.endPoints.deleteCustomer}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      throw new Error('Failed to delete customer');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete customer');
  }
};

export const updateCustomerKyc = async (id: string, kycData: {
  kycStatus: 'Pending' | 'In Progress' | 'Verified' | 'Rejected';
  kycNotes?: string;
  aadharVerificationStatus?: boolean;
  panVerificationStatus?: boolean;
}): Promise<CustomerResponse> => {
  try {
    const response = await axios.patch(`${API.domain}${API.endPoints.updateCustomerKyc}/${id}`, kycData);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to update KYC status');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update KYC status');
  }
};

export const exportCustomers = async (filters?: CustomerFilters): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await axios.get(`${API.domain}${API.endPoints.exportCustomers}?${params.toString()}`, {
      responseType: 'blob'
    });
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to export customers');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to export customers');
  }
};

// Additional service methods for compatibility
export const getCustomerTransactions = async (customerId: string): Promise<CustomerTransaction[]> => {
  // This would be implemented based on your backend API
  // For now, returning empty array
  return [];
};

export const getCustomerActivity = async (customerId: string): Promise<CustomerActivity[]> => {
  // This would be implemented based on your backend API
  // For now, returning empty array
  return [];
};

// Shareholder and Share Purchase methods
export const getAllShareholders = async (): Promise<ShareholderSummary[]> => {
  // This would be implemented based on your backend API
  // For now, returning empty array
  return [];
};

export const getCustomerSharePurchases = async (customerId: string): Promise<SharePurchase[]> => {
  // This would be implemented based on your backend API
  // For now, returning empty array
  return [];
};

export const createSharePurchase = async (data: CreateSharePurchaseDto): Promise<SharePurchase> => {
  // This would be implemented based on your backend API
  // For now, returning mock data
  return {
    id: 'mock-id',
    customerId: data.customerId,
    purchaseDate: data.purchaseDate,
    shareType: data.shareType,
    numberOfShares: data.numberOfShares,
    quantity: data.quantity,
    pricePerShare: data.pricePerShare,
    totalAmount: data.totalAmount,
    paymentMethod: data.paymentMethod,
    status: data.status || 'Pending',
    approvalStatus: 'Pending Approval',
    certificateNumber: data.certificateNumber,
    shareholderId: data.shareholderId,
    transactionReference: data.transactionReference,
    notes: data.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const updateSharePurchase = async (data: UpdateSharePurchaseDto): Promise<SharePurchase> => {
  // This would be implemented based on your backend API
  // For now, returning mock data
  return {
    id: data.id,
    customerId: data.customerId || 'mock-customer-id',
    purchaseDate: data.purchaseDate || new Date().toISOString(),
    shareType: data.shareType || 'Equity',
    numberOfShares: data.numberOfShares || 0,
    quantity: data.quantity || 0,
    pricePerShare: data.pricePerShare || 0,
    totalAmount: data.totalAmount || 0,
    paymentMethod: data.paymentMethod || 'Cash',
    status: data.status || 'Pending',
    approvalStatus: 'Pending Approval',
    certificateNumber: data.certificateNumber,
    shareholderId: data.shareholderId,
    transactionReference: data.transactionReference,
    notes: data.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const deleteSharePurchase = async (id: string): Promise<void> => {
  // This would be implemented based on your backend API
  // For now, just a placeholder
  return;
};

export const approveSharePurchase = async (id: string, approvedBy: string): Promise<SharePurchase> => {
  // This would be implemented based on your backend API
  // For now, returning mock data
  return {
    id,
    customerId: 'mock-customer-id',
    purchaseDate: new Date().toISOString(),
    shareType: 'Equity',
    numberOfShares: 0,
    quantity: 0,
    pricePerShare: 0,
    totalAmount: 0,
    paymentMethod: 'Cash',
    status: 'Completed',
    approvalStatus: 'Approved',
    notes: `Approved by ${approvedBy}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const rejectSharePurchase = async (id: string, rejectedBy: string): Promise<SharePurchase> => {
  // This would be implemented based on your backend API
  // For now, returning mock data
  return {
    id,
    customerId: 'mock-customer-id',
    purchaseDate: new Date().toISOString(),
    shareType: 'Equity',
    numberOfShares: 0,
    quantity: 0,
    pricePerShare: 0,
    totalAmount: 0,
    paymentMethod: 'Cash',
    status: 'Cancelled',
    approvalStatus: 'Rejected',
    notes: `Rejected by ${rejectedBy}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const getAllTransactions = async (): Promise<CustomerTransaction[]> => {
  // This would be implemented based on your backend API
  // For now, returning empty array
  return [];
};

export const uploadCustomerDocument = async (customerId: string, docType: string, file: File): Promise<void> => {
  // This would be implemented based on your backend API
  // For now, just a placeholder
  return;
};

// Customer Service Object (for easier imports)
export const customerService = {
  create: createCustomer,
  getAll: getAllCustomers,
  getById: getCustomerById,
  update: updateCustomer,
  delete: deleteCustomer,
  updateKyc: updateCustomerKyc,
  export: exportCustomers,
  getCustomerTransactions,
  getCustomerActivity,
  getAllShareholders,
  getCustomerSharePurchases,
  createSharePurchase,
  updateSharePurchase,
  deleteSharePurchase,
  approveSharePurchase,
  rejectSharePurchase,
  getAllTransactions,
  uploadCustomerDocument,
};
