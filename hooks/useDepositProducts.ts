import { useState, useEffect, useCallback } from 'react';
import { depositProductService, DepositProduct, DepositProductFilters } from '@/services/deposit-products.service';

interface UseDepositProductsResult {
  products: DepositProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filters: DepositProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<DepositProductFilters>>;
}

export const useDepositProducts = (initialFilters?: DepositProductFilters): UseDepositProductsResult => {
  const [products, setProducts] = useState<DepositProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DepositProductFilters>(initialFilters || {});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await depositProductService.getAll({ ...filters, limit: 100 });
      setProducts(data.result.depositProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deposit products');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.productType, filters.category, filters.page, filters.limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts, filters, setFilters };
};
