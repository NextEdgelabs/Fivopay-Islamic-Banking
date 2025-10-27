import { useState } from 'react';
import { loanCategoryService, CreateLoanCategoryDto, UpdateLoanCategoryDto, LoanCategory, CreateLoanSubCategoryDto, UpdateLoanSubCategoryDto, LoanSubCategory } from '@/services/loan-categories.service';

export const useLoanCategoryMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLoanCategory = async (data: CreateLoanCategoryDto): Promise<LoanCategory> => {
    setLoading(true);
    setError(null);
    try {
      const response = await loanCategoryService.create(data);
      return response.result.loanCategory || response.result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create loan category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLoanCategory = async (data: UpdateLoanCategoryDto): Promise<LoanCategory> => {
    setLoading(true);
    setError(null);
    try {
      const response = await loanCategoryService.update(data);
      return response.result.loanCategory || response.result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update loan category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLoanCategory = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await loanCategoryService.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete loan category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createLoanSubCategory = async (data: CreateLoanSubCategoryDto): Promise<LoanSubCategory> => {
    setLoading(true);
    setError(null);
    try {
      const response = await loanCategoryService.createSubCategory(data);
      return response.result.loanCategory || response.result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create loan sub-category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLoanSubCategory = async (data: UpdateLoanSubCategoryDto): Promise<LoanSubCategory> => {
    setLoading(true);
    setError(null);
    try {
      const response = await loanCategoryService.updateSubCategory(data);
      return response.result.loanCategory || response.result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update loan sub-category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLoanSubCategory = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await loanCategoryService.deleteSubCategory(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete loan sub-category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    createLoanCategory, 
    updateLoanCategory, 
    deleteLoanCategory,
    createLoanSubCategory,
    updateLoanSubCategory,
    deleteLoanSubCategory,
    loading, 
    error 
  };
};
