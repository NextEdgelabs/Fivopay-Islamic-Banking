import axios from 'axios';
import { API } from '@/api';
import { getAuthToken, getOrganisationId } from '@/lib/auth';

// Enums matching backend User model
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum MaritalStatus {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
  Widowed = 'Widowed',
}

export enum AccountType {
  Savings = 'Savings',
  Current = 'Current',
  Business = 'Business',
}

export enum KycStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Verified = 'Verified',
  Rejected = 'Rejected',
}

// Customer Types and Interfaces (matching backend User model)
export interface Customer {
  _id?: string; // MongoDB ObjectId
  id?: string; // For compatibility
  customerId?: string; // For compatibility with existing code
  memberId: string; // Required in backend User model
  
  // Primary Details
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string | Date; // Backend stores as Date, frontend can use string
  gender: Gender | 'Male' | 'Female' | 'Other';
  maritalStatus?: MaritalStatus | 'Single' | 'Married' | 'Divorced' | 'Widowed';
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
  country: string; // Default: "India"
  
  // Account Information
  accountType: AccountType | 'Savings' | 'Current' | 'Business';
  initialDeposit: number; // Minimum ₹1,000
  accountBalance: number; // Current account balance (min: 0, default: 0)
  branch: string;
  
  // Nominee Information
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  nomineeAddress?: string;
  
  // KYC Details (matching backend User model)
  aadhaarNumber?: string; // 12 digits
  aadharVerificationStatus?: boolean;
  panNumber?: string; // ABCDE1234F
  panVerificationStatus?: boolean;
  passportNumber?: string;
  drivingLicenseNumber?: string;
  voterIdNumber?: string;
  addressProofType?: string;
  addressProofNumber?: string;
  kycStatus: KycStatus | 'Pending' | 'In Progress' | 'Verified' | 'Rejected'; // Default: Pending
  kycNotes?: string;
  
  // Status and Organization
  isDeleted?: boolean; // Default: false
  isActive: boolean; // Default: true
  organisation?: string; // MongoDB ObjectId reference
  
  // Shareholder Information
  totalSharesPurchased: number; // Default: 0
  isShareHolder: boolean; // Default: false
  isApproved: boolean; // Default: false
  
  // Documents
  documents?: CustomerDocument[];
  
  // Timestamps (from schemaOptions: { timestamps: true })
  createdAt?: string | Date;
  updatedAt?: string | Date;
  
  // Compatibility fields (for UI - not in backend)
  status?: 'Active' | 'Inactive' | 'Pending' | 'Blocked'; // Derived from isActive
  currentBalance?: number; // Alias for accountBalance for backward compatibility
  joinedDate?: string; // Alias for createdAt
}

export interface CreateCustomerDto {
  // Primary Details
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string | Date;
  gender: Gender | 'Male' | 'Female' | 'Other';
  maritalStatus?: MaritalStatus | 'Single' | 'Married' | 'Divorced' | 'Widowed';
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
  country?: string; // Default: "India"
  
  // Account Information
  accountType: AccountType | 'Savings' | 'Current' | 'Business';
  initialDeposit: number; // Minimum ₹1,000
  branch: string;
  
  // Nominee Information
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  nomineeAddress?: string;
  
  // KYC Details
  aadhaarNumber?: string; // 12 digits
  panNumber?: string; // ABCDE1234F
  passportNumber?: string;
  drivingLicenseNumber?: string;
  voterIdNumber?: string;
  addressProofType?: string;
  addressProofNumber?: string;
  kycStatus?: KycStatus | 'Pending' | 'In Progress' | 'Verified' | 'Rejected';
  kycNotes?: string;
  
  // Organization (optional)
  organisation?: string; // MongoDB ObjectId reference
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
  /** Scope customers by organisation */
  organisationId?: string;
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

// Helper Functions
/**
 * Format date to YYYY-MM-DD for HTML date inputs (handles ISO strings, Date objects, etc.)
 */
export function formatDateForInput(value: string | Date | null | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (trimmed.includes('T')) return trimmed.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? '' : value.toISOString().split('T')[0];
  }
  return '';
}

/**
 * Normalize customer data from API to match frontend expectations
 */
function normalizeCustomer(customer: any): Customer {
  const accountBalance = customer.accountBalance ?? customer.currentBalance ?? 0;
  // Branch: backend returns branchId (ObjectId) or populated branch { _id, branchName }
  const branchId = customer.branchId?.toString?.() || customer.branch?._id?.toString?.() || (typeof customer.branch === 'string' ? customer.branch : '');
  return {
    ...customer,
    // Map backend fields to frontend compatibility fields
    id: customer._id || customer.id,
    accountBalance: accountBalance,
    currentBalance: accountBalance, // Alias for compatibility
    status: customer.status || (customer.isActive ? 'Active' : 'Inactive'),
    joinedDate: customer.createdAt || customer.joinedDate,
    branch: branchId,
    // Ensure dateOfBirth is YYYY-MM-DD for HTML date inputs (backend returns ISO string from MongoDB Date)
    dateOfBirth: formatDateForInput(customer.dateOfBirth),
    // Ensure required fields have defaults
    memberId: customer.memberId || customer._id || customer.id || '',
    totalSharesPurchased: customer.totalSharesPurchased ?? 0,
    isShareHolder: customer.isShareHolder ?? false,
    isApproved: customer.isApproved ?? false,
    isActive: customer.isActive ?? true,
    isDeleted: customer.isDeleted ?? false,
    kycStatus: customer.kycStatus || KycStatus.Pending,
    country: customer.country || 'India',
    // Ensure documents is an array
    documents: Array.isArray(customer.documents) ? customer.documents : [],
  };
}

// API Service Functions
export const createCustomer = async (customer: CreateCustomerDto): Promise<CustomerResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API.domain}${API.endPoints.addCustomer}`, customer, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
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
    // Scope by org: use filter if set and not "all", else current user's org
    const organisationId =
      filters?.organisationId !== undefined && filters.organisationId !== ''
        ? filters.organisationId
        : getOrganisationId();
    const orgIdStr = typeof organisationId === 'string' ? organisationId : (organisationId as any)?._id;
    if (orgIdStr) params.append('organisation', orgIdStr);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (key === 'organisationId' || value === undefined || value === '') return;
        params.append(key, value.toString());
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
      const data = response.data;
      if (data.success && data.data?.users) {
        // Normalize all customers
        return {
          ...data,
          data: {
            ...data.data,
            users: data.data.users.map((customer: any) => normalizeCustomer(customer)),
          },
        };
      }
      return data;
    } else {
      throw new Error('Failed to fetch customers');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch customers');
  }
};

export const getCustomerById = async (id: string): Promise<CustomerResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getCustomerById}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      // Backend returns { success, message, data: user }
      const data = response.data;
      if (data.success && data.data) {
        return {
          ...data,
          data: normalizeCustomer(data.data),
        };
      }
      return data;
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

function mapPaymentMethodToBackend(method: string): string {
  const m = (method || '').toLowerCase();
  if (m.includes('cash')) return 'cash';
  if (m.includes('bank') || m.includes('transfer')) return 'bank_transfer';
  if (m.includes('cheque') || m.includes('check')) return 'cheque';
  return 'razorpay'; // Online
}

export const createSharePurchase = async (data: CreateSharePurchaseDto): Promise<SharePurchase> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API.domain}${API.endPoints.recordShareTransaction}`,
      {
        customerId: data.customerId,
        transactionType: 'purchase',
        quantity: data.quantity || data.numberOfShares,
        pricePerShare: data.pricePerShare,
        paymentMethod: mapPaymentMethodToBackend(data.paymentMethod),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      const result = response.data?.result || response.data?.data;
      const status = result?.status;
      const approvalStatus =
        status === 'Completed' || status === 'Verified'
          ? 'Approved'
          : status === 'Rejected'
          ? 'Rejected'
          : 'Pending Approval';
      return {
        id: result?._id || result?.id || '',
        customerId: data.customerId,
        purchaseDate: data.purchaseDate,
        shareType: data.shareType || 'Equity',
        numberOfShares: data.quantity || data.numberOfShares,
        quantity: data.quantity || data.numberOfShares,
        pricePerShare: data.pricePerShare,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        status: status === 'Completed' ? 'Completed' : status === 'Rejected' ? 'Cancelled' : 'Pending',
        approvalStatus,
        certificateNumber: result?.transactionId,
        shareholderId: data.shareholderId,
        transactionReference: result?.transactionId,
        notes: data.notes,
        createdAt: result?.createdAt || new Date().toISOString(),
        updatedAt: result?.updatedAt || new Date().toISOString(),
      };
    }
    throw new Error('Failed to create share purchase');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to create share purchase');
  }
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

export const approveUser = async (id: string): Promise<CustomerResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API.domain}${API.endPoints.approveUser}/${id}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to approve user');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to approve user');
  }
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
  approveUser,
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
