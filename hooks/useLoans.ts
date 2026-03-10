import { useState, useEffect, useCallback, useRef } from 'react';
import { loanService, Loan, LoanFilters } from '@/services/loans';

export const useLoans = (initialFilters?: LoanFilters) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LoanFilters>(initialFilters || {});
  const hasFetchedRef = useRef(false);

  const fetchLoans = useCallback(async () => {
    if (!hasFetchedRef.current) setLoading(true);
    setError(null);
    try {
      const data = await loanService.getLoans(filters);
      setLoans(data);
      hasFetchedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return {
    loans,
    loading,
    error,
    refetch: fetchLoans,
    filters,
    setFilters,
  };
};

