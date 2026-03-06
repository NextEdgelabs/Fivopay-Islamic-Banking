import { useState } from 'react';
import {
  createBatch,
  updateBatch,
  deleteBatch,
  addCustomersToBatch,
  removeCustomersFromBatch,
  updateBatchStatus,
  CreateBatchDto,
  UpdateBatchDto,
  Batch,
  BatchStatus,
} from '@/services/batch.service';

export const useBatchMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateBatchDto): Promise<Batch> => {
    try {
      setLoading(true);
      setError(null);
      const response = await createBatch(data);
      if (response.success) {
        const batch = response.data?.batch;
        if (!batch) throw new Error(response.message || 'Failed to create batch');
        return batch;
      } else {
        throw new Error(response.message || 'Failed to create batch');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create batch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateBatchDto): Promise<Batch> => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateBatch(id, data);
      if (response.success) {
        const batch = response.data?.batch;
        if (!batch) throw new Error(response.message || 'Failed to update batch');
        return batch;
      } else {
        throw new Error(response.message || 'Failed to update batch');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update batch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBatchItem = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteBatch(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete batch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCustomers = async (batchId: string, customerIds: string[]): Promise<Batch> => {
    try {
      setLoading(true);
      setError(null);
      const response = await addCustomersToBatch(batchId, customerIds);
      if (response.success) {
        const batch = response.data?.batch;
        if (!batch) throw new Error(response.message || 'Failed to add customers');
        return batch;
      } else {
        throw new Error(response.message || 'Failed to add customers');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add customers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCustomers = async (batchId: string, customerIds: string[]): Promise<Batch> => {
    try {
      setLoading(true);
      setError(null);
      const response = await removeCustomersFromBatch(batchId, customerIds);
      if (response.success) {
        const batch = response.data?.batch;
        if (!batch) throw new Error(response.message || 'Failed to remove customers');
        return batch;
      } else {
        throw new Error(response.message || 'Failed to remove customers');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove customers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (batchId: string, status: BatchStatus): Promise<Batch> => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateBatchStatus(batchId, status);
      if (response.success) {
        const batch = response.data?.batch;
        if (!batch) throw new Error(response.message || 'Failed to update batch status');
        return batch;
      } else {
        throw new Error(response.message || 'Failed to update batch status');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update batch status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBatch: create,
    updateBatch: update,
    deleteBatch: deleteBatchItem,
    addCustomers,
    removeCustomers,
    updateBatchStatus: updateStatus,
    loading,
    error,
  };
};

