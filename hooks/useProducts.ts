import { useState, useEffect, useCallback } from 'react';
import { 
  getAllLoanProducts, 
  LoanProductData, 
  LoanProductFilters 
} from '@/services/products.service';

export function useProducts(initialFilters: LoanProductFilters = {}) {
  const [products, setProducts] = useState<LoanProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LoanProductFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllLoanProducts({
        ...filters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      });
      
      if (response.success && response.result.products) {
        setProducts(response.result.products);
        setPagination(response.result.pagination);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  return {
    products,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPage,
    refetch: fetchProducts,
  };
}
