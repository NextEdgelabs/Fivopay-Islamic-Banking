import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

// ============================================================================
// SHARE TRANSACTIONS (shareTransaction module)
// ============================================================================

export type ShareTransactionType = 'purchase' | 'sell';
export type ShareTransactionStatus = 'Pending' | 'Verified' | 'Rejected' | 'Completed';

export interface ShareTransaction {
  _id: string;
  transactionId?: string;
  customerId: string | { _id: string; fullName?: string; memberId?: string; email?: string; phone?: string };
  agentId?: string | { _id: string; fullName?: string; employeeId?: string };
  transactionType: ShareTransactionType;
  quantity: number;
  pricePerShare: number;
  totalAmount: number;
  status: ShareTransactionStatus;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt?: string;
  completedAt?: string;
}

export interface ShareTransactionsResponse {
  success: boolean;
  message: string;
  result: {
    transactions: ShareTransaction[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTransactions: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface ShareTransactionsParams {
  page?: number;
  limit?: number;
  customerId?: string;
  agentId?: string;
  transactionType?: ShareTransactionType;
  status?: ShareTransactionStatus;
  startDate?: string;
  endDate?: string;
}

export async function getAllShareTransactionsApi(
  params?: ShareTransactionsParams
): Promise<ShareTransactionsResponse['result']> {
  const token = getAuthToken();
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.customerId) query.append('customerId', params.customerId);
  if (params?.agentId) query.append('agentId', params.agentId);
  if (params?.transactionType) query.append('transactionType', params.transactionType);
  if (params?.status) query.append('status', params.status);
  if (params?.startDate) query.append('startDate', params.startDate);
  if (params?.endDate) query.append('endDate', params.endDate);

  const response = await axios.get(
    `${API.domain}${API.endPoints.getAllShareTransactions}${query.toString() ? '?' + query.toString() : ''}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  if (response.data?.success && response.data?.result) {
    return response.data.result;
  }
  throw new Error(response.data?.message || 'Failed to fetch share transactions');
}

// ============================================================================
// INVESTMENT TRANSACTIONS (investmentModule)
// ============================================================================

export type InvestmentTransactionType = 'deposit' | 'interest' | 'maturity' | 'withdrawal';

export interface InvestmentTransaction {
  _id: string;
  investmentId: string | {
    _id: string;
    customerId?: string | { _id: string; fullName?: string; memberId?: string; email?: string; phone?: string };
    productId?: string;
    principalAmount?: number;
  };
  transactionType: InvestmentTransactionType;
  amount: number;
  date: string;
  remarks?: string;
  createdAt?: string;
}

export interface InvestmentTransactionsResponse {
  success: boolean;
  message: string;
  data: {
    transactions: InvestmentTransaction[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTransactions: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface InvestmentTransactionsParams {
  page?: number;
  limit?: number;
  customerId?: string;
  transactionType?: InvestmentTransactionType;
  startDate?: string;
  endDate?: string;
}

export async function getAllInvestmentTransactionsApi(
  params?: InvestmentTransactionsParams
): Promise<InvestmentTransactionsResponse['data']> {
  const token = getAuthToken();
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.customerId) query.append('customerId', params.customerId);
  if (params?.transactionType) query.append('transactionType', params.transactionType);
  if (params?.startDate) query.append('startDate', params.startDate);
  if (params?.endDate) query.append('endDate', params.endDate);

  const response = await axios.get(
    `${API.domain}${API.endPoints.getAllInvestmentTransactions}${query.toString() ? '?' + query.toString() : ''}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  if (response.data?.success && response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.data?.message || 'Failed to fetch investment transactions');
}

// ============================================================================
// UNIFIED TRANSACTION (for display on deposits page)
// ============================================================================

export type TransactionSource = 'share' | 'investment';

export interface UnifiedTransaction {
  id: string;
  source: TransactionSource;
  date: string;
  type: string;
  typeLabel: string;
  amount: number;
  status?: string;
  customerName: string;
  customerId?: string;
  reference?: string;
  raw: ShareTransaction | InvestmentTransaction;
}

function formatDate(d: string | Date | undefined): string {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getCustomerNameFromShare(t: ShareTransaction): string {
  const c = t.customerId;
  if (typeof c === 'object' && c?.fullName) return c.fullName;
  return '—';
}

function getCustomerIdFromShare(t: ShareTransaction): string | undefined {
  const c = t.customerId;
  if (typeof c === 'object' && c?._id) return c._id;
  if (typeof c === 'string') return c;
  return undefined;
}

function getCustomerNameFromInvestment(t: InvestmentTransaction): string {
  const inv = t.investmentId;
  if (typeof inv === 'object' && inv?.customerId) {
    const c = inv.customerId;
    if (typeof c === 'object' && c?.fullName) return c.fullName;
  }
  return '—';
}

function getCustomerIdFromInvestment(t: InvestmentTransaction): string | undefined {
  const inv = t.investmentId;
  if (typeof inv === 'object' && inv?.customerId) {
    const c = inv.customerId;
    if (typeof c === 'object' && c?._id) return c._id;
    if (typeof c === 'string') return c;
  }
  return undefined;
}

export function normalizeShareTransactions(transactions: ShareTransaction[]): UnifiedTransaction[] {
  return transactions.map((t) => ({
    id: t._id,
    source: 'share' as const,
    date: formatDate(t.createdAt),
    type: t.transactionType,
    typeLabel: t.transactionType === 'purchase' ? 'Share purchase' : 'Share sell',
    amount: t.totalAmount ?? 0,
    status: t.status,
    customerName: getCustomerNameFromShare(t),
    customerId: getCustomerIdFromShare(t),
    reference: t.transactionId,
    raw: t,
  }));
}

export function normalizeInvestmentTransactions(transactions: InvestmentTransaction[]): UnifiedTransaction[] {
  return transactions.map((t) => ({
    id: t._id,
    source: 'investment' as const,
    date: formatDate(t.date || t.createdAt),
    type: t.transactionType,
    typeLabel:
      t.transactionType === 'deposit'
        ? 'Investment deposit'
        : t.transactionType === 'interest'
          ? 'Interest'
          : t.transactionType === 'maturity'
            ? 'Maturity'
            : 'Withdrawal',
    amount: t.amount ?? 0,
    customerName: getCustomerNameFromInvestment(t),
    customerId: getCustomerIdFromInvestment(t),
    raw: t,
  }));
}
