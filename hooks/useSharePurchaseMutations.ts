import { useState } from 'react';
import { customerService, CreateSharePurchaseDto, UpdateSharePurchaseDto, SharePurchase } from '@/services/customers';

export const useSharePurchaseMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSharePurchase = async (data: CreateSharePurchaseDto): Promise<SharePurchase> => {
    setLoading(true);
    setError(null);
    try {
      const result = await customerService.createSharePurchase(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create share purchase');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSharePurchase = async (id: string, data: UpdateSharePurchaseDto): Promise<SharePurchase> => {
    setLoading(true);
    setError(null);
    try {
      const result = await customerService.updateSharePurchase(id, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update share purchase');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSharePurchase = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await customerService.deleteSharePurchase(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete share purchase');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveSharePurchase = async (id: string, approvedBy: string): Promise<SharePurchase> => {
    setLoading(true);
    setError(null);
    try {
      const result = await customerService.approveSharePurchase(id, approvedBy);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve share purchase');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectSharePurchase = async (id: string, rejectedBy: string): Promise<SharePurchase> => {
    setLoading(true);
    setError(null);
    try {
      const result = await customerService.rejectSharePurchase(id, rejectedBy);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject share purchase');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createSharePurchase, updateSharePurchase, deleteSharePurchase, approveSharePurchase, rejectSharePurchase, loading, error };
};

