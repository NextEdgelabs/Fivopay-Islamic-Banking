import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

// ============================================================================
// TYPE DEFINITIONS (matching loadFlow.md schema)
// ============================================================================

export enum ShareTransactionType {
  Purchase = 'purchase',
  Sell = 'sell',
}

export enum ShareTransactionStatus {
  Pending = 'Pending',
  Verified = 'Verified',
  Rejected = 'Rejected',
  Completed = 'Completed',
}

// Backend ShareTransaction Interface (matching loadFlow.md)
export interface ShareTransaction {
  _id?: string;
  id?: string;
  
  // Customer/User Reference
  customerId: string;
  customer?: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    memberId?: string;
  };
  
  // Agent (Employee) Reference
  agentId: string;
  agent?: {
    _id: string;
    fullName: string;
    employeeId: string;
  };
  
  // Transaction Type
  transactionType: ShareTransactionType;
  
  // Share Details
  quantity: number;
  pricePerShare: number;
  totalAmount: number;
  
  // Transaction Status
  status: ShareTransactionStatus;
  
  // Razorpay Payment Fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  razorpayResponse?: any;
  webhookData?: any;
  
  // Transaction ID for tracking
  transactionId?: string;
  
  // Verification Details
  verifiedBy?: string;
  verifiedAt?: string | Date;
  rejectionReason?: string;
  completedAt?: string | Date;
  
  // System Fields
  isDeleted?: boolean;
  isActive?: boolean;
  
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Frontend compatibility interface (for existing UI)
export interface SharePurchase {
  id: string;
  customerId: string;
  purchaseDate: string;
  shareType: 'Equity' | 'Preference' | 'Redeemable';
  numberOfShares: number;
  quantity: number;
  pricePerShare: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online';
  status: 'Pending' | 'Completed' | 'Cancelled';
  approvalStatus: 'Pending Approval' | 'Approved' | 'Rejected';
  certificateNumber?: string;
  shareholderId?: string;
  transactionReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllShareTransactionsParams {
  page?: number;
  limit?: number;
  customerId?: string;
  agentId?: string;
  transactionType?: ShareTransactionType;
  status?: ShareTransactionStatus;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface ShareTransactionListResponse {
  success: boolean;
  message: string;
  data?: ShareTransaction[];
  result?: ShareTransaction[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Normalize share transaction from API to match frontend SharePurchase expectations
 */
function normalizeShareTransaction(transaction: any): SharePurchase {
  // Handle customerId - could be string, object, or populated
  let customerId: string = '';
  if (typeof transaction.customerId === 'string') {
    customerId = transaction.customerId;
  } else if (transaction.customerId && typeof transaction.customerId === 'object' && transaction.customerId._id) {
    customerId = transaction.customerId._id;
  } else if (transaction.customerId) {
    customerId = String(transaction.customerId);
  }

  const customer = transaction.customer || (typeof transaction.customerId === 'object' ? transaction.customerId : null);
  
  // Map backend status to frontend status
  const mapStatus = (status: ShareTransactionStatus): 'Pending' | 'Completed' | 'Cancelled' => {
    switch (status) {
      case ShareTransactionStatus.Completed:
        return 'Completed';
      case ShareTransactionStatus.Rejected:
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  // Map backend status to frontend approval status
  const mapApprovalStatus = (status: ShareTransactionStatus): 'Pending Approval' | 'Approved' | 'Rejected' => {
    switch (status) {
      case ShareTransactionStatus.Verified:
      case ShareTransactionStatus.Completed:
        return 'Approved';
      case ShareTransactionStatus.Rejected:
        return 'Rejected';
      default:
        return 'Pending Approval';
    }
  };

  // Map payment method
  const mapPaymentMethod = (method?: string): 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online' => {
    if (!method) return 'Cash';
    const methodLower = method.toLowerCase();
    if (methodLower.includes('bank') || methodLower.includes('transfer')) return 'Bank Transfer';
    if (methodLower.includes('cheque') || methodLower.includes('check')) return 'Cheque';
    if (methodLower.includes('razorpay') || methodLower.includes('online') || methodLower.includes('upi') || methodLower.includes('card')) return 'Online';
    return 'Cash';
  };

  return {
    id: transaction._id || transaction.id || '',
    customerId: customerId,
    purchaseDate: transaction.createdAt
      ? new Date(transaction.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    shareType: 'Equity', // Default, not in backend schema
    numberOfShares: transaction.quantity,
    quantity: transaction.quantity,
    pricePerShare: transaction.pricePerShare,
    totalAmount: transaction.totalAmount,
    paymentMethod: mapPaymentMethod(transaction.paymentMethod),
    status: mapStatus(transaction.status),
    approvalStatus: mapApprovalStatus(transaction.status),
    certificateNumber: transaction.transactionId,
    shareholderId: customer?.memberId,
    transactionReference: transaction.razorpayPaymentId || transaction.transactionId,
    notes: transaction.rejectionReason,
    createdAt: transaction.createdAt
      ? new Date(transaction.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: transaction.updatedAt
      ? new Date(transaction.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

// ============================================================================
// API SERVICE FUNCTIONS
// ============================================================================

export const getAllShareTransactions = async (params?: GetAllShareTransactionsParams): Promise<ShareTransactionListResponse> => {
  try {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.customerId) queryParams.append('customerId', params.customerId);
    if (params?.agentId) queryParams.append('agentId', params.agentId);
    if (params?.transactionType) queryParams.append('transactionType', params.transactionType);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const url = `${API.domain}${API.endPoints.getAllShareTransactions}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    console.log("response data", response.data);
    if (response.status === 200) {
      const data = response.data;
      if (data.success) {
        // Extract transactions from the response structure
        // API returns: { success: true, result: { transactions: [...], pagination: {...} } }
        let rawTransactions: any[] = [];
        
        if (data.result?.transactions) {
          // Structure: { success: true, result: { transactions: [...], pagination: {...} } }
          rawTransactions = data.result.transactions;
        } else if (data.data?.transactions) {
          // Structure: { success: true, data: { transactions: [...], pagination: {...} } }
          rawTransactions = data.data.transactions;
        } else if (Array.isArray(data.result)) {
          // Structure: { success: true, result: [...] }
          rawTransactions = data.result;
        } else if (Array.isArray(data.data)) {
          // Structure: { success: true, data: [...] }
          rawTransactions = data.data;
        }
        
        const transactions = Array.isArray(rawTransactions) ? rawTransactions.map(normalizeShareTransaction) : [];
        console.log("Extracted transactions:", rawTransactions.length, "Normalized:", transactions.length);
        return {
          success: data.success,
          message: data.message,
          data: transactions as any,
          result: transactions as any,
          pagination: data.result?.pagination || data.data?.pagination || data.pagination,
        };
      }
      return data;
    } else {
      throw new Error('Failed to fetch share transactions');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch share transactions');
  }
};

// ============================================================================
// SERVICE OBJECT
// ============================================================================

export const shareTransactionService = {
  getAll: getAllShareTransactions,
  
  /**
   * Get customer share purchases (filters by customerId and transactionType=purchase)
   */
  async getCustomerSharePurchases(customerId: string): Promise<SharePurchase[]> {
    const response = await getAllShareTransactions({
      customerId,
      transactionType: ShareTransactionType.Purchase,
      page: 1,
      limit: 100,
    });
    // Extract transactions array from response
    // response.data and response.result are now arrays after normalization (SharePurchase[])
    const transactions = (response.data || response.result || []) as unknown as SharePurchase[];
    return Array.isArray(transactions) ? transactions : [];
  },
};

