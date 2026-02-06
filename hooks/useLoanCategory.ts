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
      const response = await loanCategoryService.getById(id);
      // Handle both response formats: data or result.loanCategory
      const categoryData = response.data || response.result?.loanCategory;
      if (categoryData) {
        setCategory(categoryData);
      } else {
        throw new Error('Category data not found in response');
      }
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
