import { useState, useEffect, useCallback } from 'react';
import { branchService, BranchKpi } from '@/services/branches';

export const useBranchKpis = (branchId: string) => {
  const [kpis, setKpis] = useState<BranchKpi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKpis = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await branchService.getBranchKpis(branchId);
      setKpis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load branch KPIs');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchKpis();
  }, [fetchKpis]);

  return { kpis, loading, error, refetch: fetchKpis };
};

