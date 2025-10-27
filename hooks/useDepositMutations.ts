import { useState } from 'react';
import { depositService, CreateDepositDto, UpdateDepositDto, Deposit } from '@/services/deposits';

export const useDepositMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDeposit = async (data: CreateDepositDto): Promise<Deposit> => {
    setLoading(true);
    setError(null);
    try {
      const newDeposit = await depositService.createDeposit(data);
      return newDeposit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deposit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDeposit = async (id: string, data: UpdateDepositDto): Promise<Deposit> => {
    setLoading(true);
    setError(null);
    try {
      const updatedDeposit = await depositService.updateDeposit(id, data);
      return updatedDeposit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deposit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDeposit = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await depositService.deleteDeposit(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete deposit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeDeposit = async (id: string): Promise<Deposit> => {
    setLoading(true);
    setError(null);
    try {
      const closedDeposit = await depositService.closeDeposit(id);
      return closedDeposit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close deposit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDeposit,
    updateDeposit,
    deleteDeposit,
    closeDeposit,
    loading,
    error,
  };
};

