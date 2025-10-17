import { useState } from 'react';
import { branchService, CreateBranchDto, UpdateBranchDto, Branch } from '@/services/branches';

export const useBranchMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBranch = async (data: CreateBranchDto): Promise<Branch> => {
    setLoading(true);
    setError(null);
    try {
      const newBranch = await branchService.createBranch(data);
      return newBranch;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBranch = async (id: string, data: UpdateBranchDto): Promise<Branch> => {
    setLoading(true);
    setError(null);
    try {
      const updatedBranch = await branchService.updateBranch(id, data);
      return updatedBranch;
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
      await branchService.deleteBranch(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBranch, updateBranch, deleteBranch, loading, error };
};

