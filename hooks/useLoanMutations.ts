import { useState } from 'react';
import { loanService, CreateLoanDto, UpdateLoanDto, Loan } from '@/services/loans';

export const useLoanMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLoan = async (data: CreateLoanDto): Promise<Loan> => {
    setLoading(true);
    setError(null);
    try {
      const newLoan = await loanService.createLoan(data);
      return newLoan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create loan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLoan = async (id: string, data: UpdateLoanDto): Promise<Loan> => {
    setLoading(true);
    setError(null);
    try {
      const updatedLoan = await loanService.updateLoan(id, data);
      return updatedLoan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update loan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLoan = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await loanService.deleteLoan(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete loan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveLoan = async (id: string, approvedBy: string, interestRate: number): Promise<Loan> => {
    setLoading(true);
    setError(null);
    try {
      const approvedLoan = await loanService.approveLoan(id, approvedBy, interestRate);
      return approvedLoan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve loan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectLoan = async (id: string, rejectedBy: string, reason: string): Promise<Loan> => {
    setLoading(true);
    setError(null);
    try {
      const rejectedLoan = await loanService.rejectLoan(id, rejectedBy, reason);
      return rejectedLoan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject loan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disburseLoan = async (id: string): Promise<Loan> => {
    setLoading(true);
    setError(null);
    try {
      const disbursedLoan = await loanService.disburseLoan(id);
      return disbursedLoan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disburse loan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLoan,
    updateLoan,
    deleteLoan,
    approveLoan,
    rejectLoan,
    disburseLoan,
    loading,
    error,
  };
};

