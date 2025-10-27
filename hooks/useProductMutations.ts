import { useState } from 'react';
import { 
  createLoanProduct, 
  updateLoanProduct, 
  deleteLoanProduct,
  CreateLoanProductDto, 
  UpdateLoanProductDto,
  LoanProductResponse,
  LoanProductData
} from '@/services/products.service';

export function useProductMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: CreateLoanProductDto): Promise<LoanProductData> => {
    setLoading(true);
    setError(null);
    try {
      const response = await createLoanProduct(data);
      if (response.success && response.result.product) {
        return response.result.product;
      } else {
        throw new Error(response.result.message || 'Failed to create product');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (data: UpdateLoanProductDto): Promise<LoanProductData> => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateLoanProduct(data);
      if (response.success && response.result.product) {
        return response.result.product;
      } else {
        throw new Error(response.result.message || 'Failed to update product');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteLoanProduct(id);
      if (!response.success) {
        throw new Error(response.result.message || 'Failed to delete product');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  };
}
