import { useState, useEffect, useCallback } from 'react';
import { branchService, Branch, BranchFilters } from '@/services/branches';

export const useBranches = (initialFilters?: BranchFilters) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BranchFilters>(initialFilters || {});

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await branchService.getBranches(filters);
      setBranches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return { branches, loading, error, refetch: fetchBranches, setFilters };
};

