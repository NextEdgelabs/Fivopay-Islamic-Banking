import { useState, useEffect, useCallback } from 'react';
import { depositService, Deposit, DepositFilters } from '@/services/deposits';

export const useDeposits = (initialFilters?: DepositFilters) => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DepositFilters>(initialFilters || {});

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await depositService.getDeposits(filters);
      setDeposits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deposits');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  return {
    deposits,
    loading,
    error,
    refetch: fetchDeposits,
    setFilters,
  };
};

