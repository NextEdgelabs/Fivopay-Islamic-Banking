import { useState, useEffect, useCallback, useRef } from 'react';
import { branchService, Branch, BranchFilters } from '@/services/branch.service';

interface UseBranchesResult {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filters: BranchFilters;
  setFilters: React.Dispatch<React.SetStateAction<BranchFilters>>;
}

export const useBranches = (initialFilters?: BranchFilters): UseBranchesResult => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BranchFilters>(initialFilters || {});
  const hasFetchedRef = useRef(false);

  const fetchBranches = useCallback(async () => {
    if (!hasFetchedRef.current) setLoading(true);
    setError(null);
    try {
      const data = await branchService.getAll(filters);
      setBranches(data.data.branches);
      hasFetchedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return { branches, loading, error, refetch: fetchBranches, filters, setFilters };
};

