import { useState, useEffect, useCallback } from 'react';
import { depositCategoryService, DepositCategory, DepositCategoryFilters } from '@/services/deposit-categories.service';

interface UseDepositCategoriesResult {
  categories: DepositCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filters: DepositCategoryFilters;
  setFilters: React.Dispatch<React.SetStateAction<DepositCategoryFilters>>;
}

export const useDepositCategories = (initialFilters?: DepositCategoryFilters): UseDepositCategoriesResult => {
  const [categories, setCategories] = useState<DepositCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DepositCategoryFilters>(initialFilters || {});

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await depositCategoryService.getAll({
        ...filters,
        limit: 100,
        organisationId: filters.organisationId ?? localStorage.getItem('organisationId') ?? undefined,
      });
      setCategories(data.result.depositCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deposit categories');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.categoryType, filters.page, filters.limit, filters.organisationId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories, filters, setFilters };
};
