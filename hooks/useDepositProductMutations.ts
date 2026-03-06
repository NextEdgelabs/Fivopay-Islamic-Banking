import { useState } from 'react';
import {
  depositProductService,
  CreateDepositProductDto,
  UpdateDepositProductDto,
  DepositProduct,
} from '@/services/deposit-products.service';

export const useDepositProductMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDepositProduct = async (data: CreateDepositProductDto): Promise<DepositProduct> => {
    setLoading(true);
    setError(null);
    try {
      const response = await depositProductService.create(data);
      const product = response.result?.depositProduct;
      if (!product) throw new Error('No product in response');
      return product;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deposit product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDepositProduct = async (data: UpdateDepositProductDto): Promise<DepositProduct> => {
    setLoading(true);
    setError(null);
    try {
      const response = await depositProductService.update(data);
      const product = response.result?.depositProduct;
      if (!product) throw new Error('No product in response');
      return product;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deposit product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepositProduct = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await depositProductService.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete deposit product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDepositProduct,
    updateDepositProduct,
    deleteDepositProduct,
    loading,
    error,
  };
};
