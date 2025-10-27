import { useState } from 'react';
import { branchService, CreateBranchDto, UpdateBranchDto, Branch } from '@/services/branch.service';

export const useBranchMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBranch = async (data: CreateBranchDto): Promise<Branch> => {
    setLoading(true);
    setError(null);
    try {
      const response = await branchService.create(data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBranch = async (data: UpdateBranchDto): Promise<Branch> => {
    setLoading(true);
    setError(null);
    try {
      const response = await branchService.update(data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBranch = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await branchService.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBranch, updateBranch, deleteBranch, loading, error };
};

