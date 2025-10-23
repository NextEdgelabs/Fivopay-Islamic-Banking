import { useState, useEffect, useCallback } from 'react';
import { loanCategoryService, LoanCategory, LoanCategoryFilters } from '@/services/loan-categories.service';

interface UseLoanCategoriesResult {
  categories: LoanCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filters: LoanCategoryFilters;
  setFilters: React.Dispatch<React.SetStateAction<LoanCategoryFilters>>;
}

export const useLoanCategories = (initialFilters?: LoanCategoryFilters): UseLoanCategoriesResult => {
  const [categories, setCategories] = useState<LoanCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LoanCategoryFilters>(initialFilters || {});

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loanCategoryService.getAll(filters);
      setCategories(data.result.loanCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch loan categories');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories, filters, setFilters };
};
