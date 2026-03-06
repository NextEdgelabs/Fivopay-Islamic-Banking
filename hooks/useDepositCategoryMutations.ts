import { useState } from 'react';
import {
  depositCategoryService,
  CreateDepositCategoryDto,
  UpdateDepositCategoryDto,
  DepositCategory,
} from '@/services/deposit-categories.service';

export const useDepositCategoryMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDepositCategory = async (data: CreateDepositCategoryDto): Promise<DepositCategory> => {
    setLoading(true);
    setError(null);
    try {
      const response = await depositCategoryService.create(data);
      const cat = response.result?.depositCategory;
      if (!cat) throw new Error('No category in response');
      return cat;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deposit category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDepositCategory = async (data: UpdateDepositCategoryDto): Promise<DepositCategory> => {
    setLoading(true);
    setError(null);
    try {
      const response = await depositCategoryService.update(data);
      const cat = response.result?.depositCategory;
      if (!cat) throw new Error('No category in response');
      return cat;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deposit category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepositCategory = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await depositCategoryService.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete deposit category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDepositCategory,
    updateDepositCategory,
    deleteDepositCategory,
    loading,
    error,
  };
};
