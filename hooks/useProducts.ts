import { useState, useEffect, useCallback, useRef } from 'react';
import { productService, AnyProduct, ProductFilters } from '@/services/products';

export function useProducts(initialFilters: ProductFilters = {}) {
  const [products, setProducts] = useState<AnyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const hasFetchedRef = useRef(false);

  const fetchProducts = useCallback(async () => {
    if (!hasFetchedRef.current) setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(filters);
      setProducts(data);
      hasFetchedRef.current = true;
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
