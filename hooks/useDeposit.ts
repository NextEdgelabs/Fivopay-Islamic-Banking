import { useState, useEffect, useCallback } from 'react';
import { depositService, Deposit } from '@/services/deposits';

export const useDeposit = (depositId: string) => {
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeposit = useCallback(async () => {
    if (!depositId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await depositService.getDepositById(depositId);
      setDeposit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deposit');
    } finally {
      setLoading(false);
    }
  }, [depositId]);

  useEffect(() => {
    fetchDeposit();
  }, [fetchDeposit]);

  return {
    deposit,
    loading,
    error,
    refetch: fetchDeposit,
  };
};

