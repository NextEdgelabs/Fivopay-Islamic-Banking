import { useState, useEffect, useCallback } from 'react';
import { loanCategoryService, LoanCategory } from '@/services/loan-categories.service';

interface UseLoanCategoryResult {
  category: LoanCategory | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useLoanCategory = (id: string): UseLoanCategoryResult => {
  const [category, setCategory] = useState<LoanCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await loanCategoryService.getById(id);
      setCategory(data.result.loanCategory || data.result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch loan category');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return { category, loading, error, refetch: fetchCategory };
};
