import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { depositService, CreateDepositDto, UpdateDepositDto, Deposit, VerifyDepositDto, DepositTransaction } from '@/services/deposits';

export const useDepositMutations = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDeposit = async (data: CreateDepositDto): Promise<Deposit> => {
    setLoading(true);
    setError(null);
    try {
      const newDeposit = await depositService.createDeposit(data);
      addToast({
        type: 'success',
        message: 'Deposit created successfully',
      });
      return newDeposit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create deposit';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage,
      });
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
      addToast({
        type: 'success',
        message: 'Deposit updated successfully',
      });
      return updatedDeposit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update deposit';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage,
      });
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
      addToast({
        type: 'success',
        message: 'Deposit deleted successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete deposit';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage,
      });
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
      addToast({
        type: 'success',
        message: 'Deposit closed successfully',
      });
      return closedDeposit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to close deposit';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyDeposit = async (data: VerifyDepositDto): Promise<DepositTransaction> => {
    setLoading(true);
    setError(null);
    try {
      const verifiedDeposit = await depositService.verifyDeposit(data);
      addToast({
        type: 'success',
        message: 'Deposit verified successfully',
      });
      return verifiedDeposit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify deposit';
      setError(errorMessage);
      addToast({
        type: 'error',
        message: errorMessage,
      });
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
    verifyDeposit,
    loading,
    error,
  };
};

