import { useState, useEffect, useCallback } from 'react';
import { productService, AnyProduct, ProductFilters } from '@/services/products';

export function useProducts(initialFilters: ProductFilters = {}) {
  const [products, setProducts] = useState<AnyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(filters);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchProducts,
  };
}
