import { useState, useCallback, useEffect } from 'react';
import {
  jointLiabilityService,
  Group,
  Loan,
} from '@/services/joint-liability';

export const useJointLiabilityLoans = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [groupsData, loansData] = await Promise.all([
        jointLiabilityService.getAllGroups({}),
        jointLiabilityService.getAllLoans(),
      ]);
      setGroups(groupsData);
      setLoans(loansData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const applyForLoan = useCallback(
    async (groupId: string, memberId: string, amount: number, purpose: string) => {
      const loan = await jointLiabilityService.applyForLoan(groupId, memberId, amount, purpose);
      await refetch();
      return loan;
    },
    [refetch]
  );

  const updateLoanStatus = useCallback(
    async (loanId: string, status: Loan['status']) => {
      await jointLiabilityService.updateLoanStatus(loanId, status);
      await refetch();
    },
    [refetch]
  );

  const repayLoan = useCallback(
    async (loanId: string, amount: number) => {
      await jointLiabilityService.repayLoan(loanId, amount);
      await refetch();
    },
    [refetch]
  );

  return {
    groups,
    loans,
    loading,
    error,
    refetch,
    applyForLoan,
    updateLoanStatus,
    repayLoan,
  };
};
