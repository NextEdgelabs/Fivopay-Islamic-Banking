import { useState, useEffect, useCallback, useRef } from 'react';
import { depositService, Deposit, DepositFilters } from '@/services/deposits';
import { getOrganisationId } from '@/lib/auth';

function getDefaultDepositFilters(initialFilters?: DepositFilters): DepositFilters {
  const orgId = typeof window !== 'undefined' ? getOrganisationId() : null;
  return {
    ...initialFilters,
    organisationId: initialFilters?.organisationId !== undefined ? initialFilters.organisationId : (orgId ?? undefined),
  };
}

export const useDeposits = (initialFilters?: DepositFilters) => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DepositFilters>(getDefaultDepositFilters(initialFilters));
  const hasFetchedRef = useRef(false);

  const fetchDeposits = useCallback(async () => {
    if (!hasFetchedRef.current) setLoading(true);
    setError(null);
    try {
      const data = await depositService.getDeposits(filters);
      setDeposits(data);
      hasFetchedRef.current = true;
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
    filters,
    setFilters,
  };
};

