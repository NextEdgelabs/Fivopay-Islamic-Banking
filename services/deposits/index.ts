import axios from 'axios';
import { API } from '@/api';
import { getAuthToken, getOrganisationId } from '@/lib/auth';

// ============================================================================
// TYPE DEFINITIONS (matching loadFlow.md schema)
// ============================================================================

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  REFUND = 'refund',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  RAZORPAY = 'razorpay',
  BANK_TRANSFER = 'bank_transfer',
  UPI = 'upi',
  CARD = 'card',
  WALLET = 'wallet',
}

export enum PaymentStatus {
  PENDING = 'pending',
  CAPTURED = 'captured',
  AUTHORIZED = 'authorized',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

// Backend Deposit/Transaction Interface (matching loadFlow.md)
export interface DepositTransaction {
  _id?: string;
  id?: string;
  
  // Transaction Information
  transactionId: string;
  userId: string;
  transactionType: TransactionType;
  amount: number;
  fees: number;
  netAmount: number;
  status: TransactionStatus;
  
  // Payment Information
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  razorpayRefundId?: string;
  
  // Bank Details (for withdrawals)
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  ifscCode?: string;
  upiId?: string;
  
  // Transaction Details
  description?: string;
  reference?: string;
  notes?: string;
  
  // Razorpay Response Data
  razorpayResponse?: any;
  webhookData?: any;
  
  // Timestamps
  processedAt?: string | Date;
  completedAt?: string | Date;
  failedAt?: string | Date;
  
  // System Fields
  retryCount?: number;
  failureReason?: string;
  ipAddress?: string;
  userAgent?: string;
  
  // Balance Information
  balanceBefore: number;
  balanceAfter: number;
  
  // Additional Fields
  isRefundable?: boolean;
  isReversible?: boolean;
  reversalReason?: string;
  reversedAt?: string | Date;
  reversalReference?: string;
  
  createdAt?: string | Date;
  updatedAt?: string | Date;
  
  // Populated fields
  user?: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    memberId?: string;
  };
}

// Frontend compatibility interface (for existing UI)
export interface Deposit {
  id: string;
  depositId: string;
  accountNumber: string;
  
  // Customer Info
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  
  // Deposit Details
  depositType: 'Savings Account' | 'Fixed Deposit' | 'Recurring Deposit' | 'Current Account';
  depositAmount: number;
  interestRate: number;
  tenure?: number;
  maturityAmount?: number;
  maturityDate?: string;
  
  // Dates
  openingDate: string;
  lastTransactionDate?: string;
  
  // Status
  status: 'Active' | 'Closed' | 'Matured' | 'Frozen';
  
  // Financial Details
  currentBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  interestEarned: number;
  
  // Branch
  branchId: string;
  branchName: string;
  
  // Nominee & Auto-renewal
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  autoRenewal?: boolean;
  remarks?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepositDto {
  customerId: string;
  depositType: 'Savings Account' | 'Fixed Deposit' | 'Recurring Deposit' | 'Current Account';
  depositAmount: number;
  tenure?: number;
  branchId: string;
  productId?: string;
  interestRate?: number;
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  autoRenewal?: boolean;
  remarks?: string;
}

export interface UpdateDepositDto extends Partial<CreateDepositDto> {
  status?: 'Active' | 'Closed' | 'Matured' | 'Frozen';
}

export interface DepositFilters {
  search?: string;
  status?: string;
  depositType?: string;
  branchId?: string;
  customerId?: string;
  /** Scope by organisation */
  organisationId?: string;
}

export interface GetAllDepositsParams {
  page?: number;
  limit?: number;
  userId?: string;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface DepositListResponse {
  success: boolean;
  message: string;
  data?: DepositTransaction[];
  result?: DepositTransaction[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DepositResponse {
  success: boolean;
  message: string;
  data?: DepositTransaction;
  result?: DepositTransaction;
}

export interface VerifyDepositDto {
  transactionId: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Normalize deposit transaction from API to match frontend expectations
 */
function normalizeDeposit(transaction: any): Deposit {
  const userId = typeof transaction.userId === 'string'
    ? transaction.userId
    : typeof transaction.userId === 'object' && transaction.userId?._id
    ? transaction.userId._id
    : transaction.userId?.toString() || '';

  const user = transaction.user || (typeof transaction.userId === 'object' ? transaction.userId : null);
  
  // Map backend status to frontend status
  const mapStatus = (status: TransactionStatus): 'Active' | 'Closed' | 'Matured' | 'Frozen' => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return 'Active';
      case TransactionStatus.CANCELLED:
      case TransactionStatus.FAILED:
        return 'Closed';
      default:
        return 'Active';
    }
  };

  // Map transaction type to deposit type
  const mapDepositType = (type: TransactionType): 'Savings Account' | 'Fixed Deposit' | 'Recurring Deposit' | 'Current Account' => {
    // This might need adjustment based on actual backend data
    return 'Savings Account';
  };

  return {
    id: transaction._id || transaction.id || '',
    depositId: transaction.transactionId || transaction._id || transaction.id || '',
    accountNumber: transaction.reference || transaction.transactionId || '',
    
    customerId: userId,
    customerName: user?.fullName || user?.name || 'N/A',
    customerPhone: user?.phone || '',
    customerEmail: user?.email || '',
    
    depositType: mapDepositType(transaction.transactionType),
    depositAmount: transaction.amount || 0,
    interestRate: 0, // Not in backend schema
    tenure: undefined,
    maturityAmount: undefined,
    maturityDate: undefined,
    
    openingDate: transaction.createdAt 
      ? new Date(transaction.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    lastTransactionDate: transaction.completedAt
      ? new Date(transaction.completedAt).toISOString().split('T')[0]
      : undefined,
    
    status: mapStatus(transaction.status),
    
    currentBalance: transaction.balanceAfter || 0,
    totalDeposits: transaction.transactionType === TransactionType.DEPOSIT ? transaction.amount : 0,
    totalWithdrawals: transaction.transactionType === TransactionType.WITHDRAWAL ? transaction.amount : 0,
    interestEarned: 0, // Not in backend schema
    
    branchId: '',
    branchName: '',
    
    createdAt: transaction.createdAt 
      ? new Date(transaction.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: transaction.updatedAt
      ? new Date(transaction.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Normalize deposit account from API to frontend Deposit shape
 */
function normalizeDepositAccount(account: any): Deposit {
  const customerId = typeof account.customerId === 'object' ? account.customerId?._id : account.customerId;
  const customer = typeof account.customerId === 'object' ? account.customerId : null;
  const branchId = typeof account.branchId === 'object' ? account.branchId?._id : account.branchId;
  const branch = typeof account.branchId === 'object' ? account.branchId : null;
  return {
    id: account._id || '',
    depositId: account.depositId || account._id || '',
    accountNumber: account.accountNumber || account.depositId || '',
    customerId: customerId?.toString() || '',
    customerName: customer?.fullName || 'N/A',
    customerPhone: customer?.phone || '',
    customerEmail: customer?.email || '',
    depositType: account.depositType || 'Savings Account',
    depositAmount: account.depositAmount ?? 0,
    interestRate: account.interestRate ?? 0,
    tenure: account.tenure,
    maturityAmount: account.maturityAmount,
    maturityDate: account.maturityDate ? new Date(account.maturityDate).toISOString().split('T')[0] : undefined,
    openingDate: account.createdAt ? new Date(account.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    lastTransactionDate: undefined,
    status: account.status || 'Active',
    currentBalance: account.currentBalance ?? 0,
    totalDeposits: account.totalDeposits ?? 0,
    totalWithdrawals: account.totalWithdrawals ?? 0,
    interestEarned: account.interestEarned ?? 0,
    branchId: branchId?.toString() || '',
    branchName: branch?.branchName || '',
    nomineeName: account.nomineeName,
    nomineeRelation: account.nomineeRelation,
    nomineePhone: account.nomineePhone,
    autoRenewal: account.autoRenewal,
    remarks: account.remarks,
    createdAt: account.createdAt ? new Date(account.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: account.updatedAt ? new Date(account.updatedAt).toISOString() : new Date().toISOString(),
  };
}

// ============================================================================
// API SERVICE FUNCTIONS
// ============================================================================

export const createDepositAccountApi = async (data: CreateDepositDto): Promise<Deposit> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${API.domain}${API.endPoints.createDepositAccount}`,
    {
      customerId: data.customerId,
      depositType: data.depositType,
      depositAmount: data.depositAmount,
      tenure: data.tenure,
      branchId: data.branchId,
      productId: data.productId,
      interestRate: data.interestRate,
      nomineeName: data.nomineeName,
      nomineeRelation: data.nomineeRelation,
      nomineePhone: data.nomineePhone,
      autoRenewal: data.autoRenewal,
      remarks: data.remarks,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 201 && response.data?.success && response.data?.result?.depositAccount) {
    return normalizeDepositAccount(response.data.result.depositAccount);
  }
  throw new Error(response.data?.message || 'Failed to create deposit account');
};

export const updateDepositAccountApi = async (id: string, data: UpdateDepositDto): Promise<Deposit> => {
  const token = getAuthToken();
  const response = await axios.put(
    `${API.domain}${API.endPoints.updateDepositAccount}/${id}`,
    {
      status: data.status,
      nomineeName: data.nomineeName,
      nomineeRelation: data.nomineeRelation,
      nomineePhone: data.nomineePhone,
      autoRenewal: data.autoRenewal,
      remarks: data.remarks,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200 && response.data?.success && response.data?.result?.depositAccount) {
    return normalizeDepositAccount(response.data.result.depositAccount);
  }
  throw new Error(response.data?.message || 'Failed to update deposit account');
};

export const getDepositAccountByIdApi = async (id: string): Promise<Deposit> => {
  const token = getAuthToken();
  const response = await axios.get(
    `${API.domain}${API.endPoints.getDepositAccountById}/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200 && response.data?.success && response.data?.result?.depositAccount) {
    return normalizeDepositAccount(response.data.result.depositAccount);
  }
  throw new Error(response.data?.message || 'Failed to fetch deposit account');
};

export interface GetAllDepositAccountsParams {
  page?: number;
  limit?: number;
  customerId?: string;
  branchId?: string;
  status?: string;
  depositType?: string;
  /** Scope by organisation (filters via branches of this org) */
  organisationId?: string;
}

export const getAllDepositAccountsApi = async (
  params?: GetAllDepositAccountsParams
): Promise<Deposit[]> => {
  const token = getAuthToken();
  const query = new URLSearchParams();
  const organisationId = params?.organisationId ?? getOrganisationId();
  if (organisationId) query.append('organisation', organisationId);
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.customerId) query.append('customerId', params.customerId);
  if (params?.branchId) query.append('branchId', params.branchId);
  if (params?.status) query.append('status', params.status);
  if (params?.depositType) query.append('depositType', params.depositType);
  const response = await axios.get(
    `${API.domain}${API.endPoints.getAllDepositAccounts}${query.toString() ? '?' + query.toString() : ''}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (response.status === 200 && response.data?.success && response.data?.result?.depositAccounts) {
    return response.data.result.depositAccounts.map(normalizeDepositAccount);
  }
  throw new Error(response.data?.message || 'Failed to fetch deposit accounts');
};

export const getAllDeposits = async (params?: GetAllDepositsParams): Promise<DepositListResponse> => {
  try {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.transactionType) queryParams.append('transactionType', params.transactionType);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    if (params?.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const url = `${API.domain}${API.endPoints.getAllDeposits}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200) {
      const data = response.data;
      if (data.success && (data.data || data.result)) {
        const transactions = (data.data?.deposits || data.result?.deposits || data.data || data.result || []).map(normalizeDeposit);
        return {
          ...data,
          data: transactions as any,
          result: transactions as any,
        };
      }
      return data;
    } else {
      throw new Error('Failed to fetch deposits');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch deposits');
  }
};

export const verifyDepositTransaction = async (data: VerifyDepositDto): Promise<DepositResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API.domain}${API.endPoints.verifyDeposit}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200 || response.status === 201) {
      const responseData = response.data;
      if (responseData.success && responseData.data) {
        return {
          ...responseData,
          data: responseData.data,
        };
      }
      return responseData;
    } else {
      throw new Error('Failed to verify deposit');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify deposit');
  }
};

// ============================================================================
// SERVICE OBJECT (with backward compatibility)
// ============================================================================

export const depositService = {
  /**
   * Get all deposits with optional filters (uses deposit accounts API)
   */
  async getDeposits(filters?: DepositFilters): Promise<Deposit[]> {
    try {
      const params: GetAllDepositAccountsParams = {
        page: 1,
        limit: 100,
      };
      if (filters?.organisationId) params.organisationId = filters.organisationId;
      if (filters?.customerId) params.customerId = filters.customerId;
      if (filters?.branchId) params.branchId = filters.branchId;
      if (filters?.status) params.status = filters.status;
      if (filters?.depositType) params.depositType = filters.depositType;
      return await getAllDepositAccountsApi(params);
    } catch {
      // Fallback to transaction-based list if deposit accounts API fails
      const params: GetAllDepositsParams = { page: 1, limit: 100 };
      if (filters?.customerId) params.userId = filters.customerId;
      if (filters?.status) {
        const statusMap: Record<string, TransactionStatus> = {
          Active: TransactionStatus.COMPLETED,
          Closed: TransactionStatus.CANCELLED,
          Matured: TransactionStatus.COMPLETED,
          Frozen: TransactionStatus.PENDING,
        };
        params.status = statusMap[filters.status] || TransactionStatus.COMPLETED;
      }
      if (filters?.depositType) params.transactionType = TransactionType.DEPOSIT;
      const response = await getAllDeposits(params);
      return (response.data || response.result || []) as any;
    }
  },

  /**
   * Get a single deposit by ID (tries deposit account API first, then transaction list)
   */
  async getDepositById(id: string): Promise<Deposit> {
    try {
      return await getDepositAccountByIdApi(id);
    } catch {
      const deposits = await this.getDeposits();
      const deposit = deposits.find((d) => d.id === id || d.depositId === id);
      if (!deposit) {
        throw new Error(`Deposit with ID ${id} not found`);
      }
      return deposit;
    }
  },

  /**
   * Create a new deposit account (savings/FD/RD)
   */
  async createDeposit(data: CreateDepositDto): Promise<Deposit> {
    return createDepositAccountApi(data);
  },

  /**
   * Update a deposit account (e.g. status, nominee)
   */
  async updateDeposit(id: string, data: UpdateDepositDto): Promise<Deposit> {
    return updateDepositAccountApi(id, data);
  },

  /**
   * Delete a deposit (placeholder - may need separate endpoint)
   */
  async deleteDeposit(id: string): Promise<void> {
    // This would need a delete endpoint if available
    throw new Error('Delete deposit endpoint not yet implemented');
  },

  /**
   * Close a deposit (placeholder - may need separate endpoint)
   */
  async closeDeposit(id: string): Promise<Deposit> {
    // This would need a close endpoint if available
    throw new Error('Close deposit endpoint not yet implemented');
  },

  /**
   * Verify a deposit
   */
  async verifyDeposit(data: VerifyDepositDto): Promise<DepositTransaction> {
    const response = await verifyDepositTransaction(data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to verify deposit');
  },

  /**
   * Get customer deposits
   */
  async getCustomerDeposits(customerId: string): Promise<Deposit[]> {
    return this.getDeposits({ customerId });
  },

  // New API methods
  getAll: getAllDeposits,
  verify: verifyDepositTransaction,
};
