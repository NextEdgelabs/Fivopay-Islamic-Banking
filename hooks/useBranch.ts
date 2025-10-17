import { useState, useEffect, useCallback } from 'react';
import { branchService, Branch, BranchKpi } from '@/services/branches';

export const useBranch = (branchId: string) => {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [kpis, setKpis] = useState<BranchKpi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranchData = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    setError(null);
    try {
      const branchData = await branchService.getBranchById(branchId);
      setBranch(branchData);
      
      const kpiData = await branchService.getBranchKpis(branchId);
      setKpis(kpiData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load branch data');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchBranchData();
  }, [fetchBranchData]);

  return { branch, kpis, loading, error, refetch: fetchBranchData };
};

