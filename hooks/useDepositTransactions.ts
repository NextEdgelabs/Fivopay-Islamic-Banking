import { useState, useEffect, useCallback } from 'react';
import {
  getAllShareTransactionsApi,
  getAllInvestmentTransactionsApi,
  normalizeShareTransactions,
  normalizeInvestmentTransactions,
  UnifiedTransaction,
  ShareTransactionsParams,
  InvestmentTransactionsParams,
} from '@/services/transactions';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export interface UseDepositTransactionsParams {
  page?: number;
  limit?: number;
  customerId?: string;
  startDate?: string;
  endDate?: string;
  source?: 'all' | 'share' | 'investment';
}

export function useDepositTransactions(params: UseDepositTransactionsParams = {}) {
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    customerId,
    startDate,
    endDate,
    source = 'all',
  } = params;

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchSize = Math.max(limit * 10, 100);
      const shareParams: ShareTransactionsParams = {
        page: 1,
        limit: source === 'investment' ? 0 : fetchSize,
        customerId,
        startDate,
        endDate,
      };
      const invParams: InvestmentTransactionsParams = {
        page: 1,
        limit: source === 'share' ? 0 : fetchSize,
        customerId,
        startDate,
        endDate,
      };

      const [shareResult, invResult] = await Promise.all([
        source === 'investment' ? Promise.resolve(null) : getAllShareTransactionsApi(shareParams),
        source === 'share' ? Promise.resolve(null) : getAllInvestmentTransactionsApi(invParams),
      ]);

      const shareList = shareResult
        ? normalizeShareTransactions(shareResult.transactions || [])
        : [];
      const invList = invResult
        ? normalizeInvestmentTransactions(invResult.transactions || [])
        : [];

      const merged: UnifiedTransaction[] = [...shareList, ...invList].sort((a, b) => {
        const dateA = a.raw && 'createdAt' in a.raw ? (a.raw as any).createdAt : (a.raw as any).date;
        const dateB = b.raw && 'createdAt' in b.raw ? (b.raw as any).createdAt : (b.raw as any).date;
        return new Date(dateB || 0).getTime() - new Date(dateA || 0).getTime();
      });

      const start = (page - 1) * limit;
      const paginated = merged.slice(start, start + limit);
      const total = merged.length;

      setTransactions(paginated);
      setTotalCount(total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      setTransactions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, customerId, startDate, endDate, source]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    transactions,
    loading,
    error,
    refetch: fetch,
    totalCount,
    totalPages: Math.ceil(totalCount / limit) || 1,
  };
}
