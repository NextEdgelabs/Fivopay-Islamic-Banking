import { useState, useEffect, useCallback } from 'react';
import { 
  getLoanProductById, 
  LoanProductData 
} from '@/services/products.service';

export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<LoanProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await getLoanProductById(productId);
      if (response.success && response.result.product) {
        setProduct(response.result.product);
      } else {
        throw new Error('Product not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
