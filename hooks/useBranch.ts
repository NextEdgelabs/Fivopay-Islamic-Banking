import { useState, useEffect, useCallback } from 'react';
import { branchService, Branch } from '@/services/branch.service';

export const useBranch = (branchId: string) => {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranchData = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await branchService.getById(branchId);
      setBranch(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load branch data');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchBranchData();
  }, [fetchBranchData]);

  return { branch, loading, error, refetch: fetchBranchData };
};

