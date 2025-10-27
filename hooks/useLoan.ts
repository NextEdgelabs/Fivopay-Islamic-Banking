import { useState, useEffect, useCallback } from 'react';
import { loanService, Loan } from '@/services/loans';

export const useLoan = (loanId: string) => {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoan = useCallback(async () => {
    if (!loanId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await loanService.getLoanById(loanId);
      setLoan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch loan');
    } finally {
      setLoading(false);
    }
  }, [loanId]);

  useEffect(() => {
    fetchLoan();
  }, [fetchLoan]);

  return {
    loan,
    loading,
    error,
    refetch: fetchLoan,
  };
};

