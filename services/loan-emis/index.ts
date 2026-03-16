import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

export interface LoanEmi {
  _id: string;
  loanId: string | { _id: string; amount?: number; approvalStatus?: string };
  emiNumber: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  totalEmiAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'pending' | 'paid' | 'overdue' | 'partially_paid';
  paidDate?: string;
  lateFees?: number;
  paymentReference?: string;
  remarks?: string;
  outstandingPrincipal?: number;
}

export interface LoanEmisResponse {
  success: boolean;
  message: string;
  data?: {
    emis: LoanEmi[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalEmis: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    summary: {
      byStatus: Array<{ _id: string; totalAmount: number; paidAmount: number; remainingAmount: number; count: number }>;
      totals: {
        totalEmiAmount: number;
        totalPaidAmount: number;
        totalRemainingAmount: number;
        totalLateFees: number;
      };
    };
  };
}

export const loanEmiService = {
  async getLoanEmis(loanId: string, page = 1, limit = 100): Promise<{
    emis: LoanEmi[];
    pagination: { currentPage: number; totalPages: number; totalEmis: number };
    totals: { totalEmiAmount: number; totalPaidAmount: number; totalRemainingAmount: number };
  }> {
    const token = getAuthToken();
    const response = await axios.get<LoanEmisResponse>(
      `${API.domain}${API.endPoints.getLoanEmis}/${loanId}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      }
    );

    if (response.status === 200 && response.data.success && response.data.data) {
      const { emis, pagination, summary } = response.data.data;
      const totals = summary?.totals || { totalEmiAmount: 0, totalPaidAmount: 0, totalRemainingAmount: 0, totalLateFees: 0 };
      return {
        emis: emis || [],
        pagination: pagination || { currentPage: 1, totalPages: 0, totalEmis: 0, hasNextPage: false, hasPrevPage: false },
        totals: { totalEmiAmount: totals.totalEmiAmount || 0, totalPaidAmount: totals.totalPaidAmount || 0, totalRemainingAmount: totals.totalRemainingAmount || 0 },
      };
    }
    throw new Error(response.data?.message || 'Failed to fetch loan EMIs');
  },
};
