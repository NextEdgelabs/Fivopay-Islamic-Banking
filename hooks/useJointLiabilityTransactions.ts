import { useState, useCallback, useEffect } from 'react';
import {
  jointLiabilityService,
  Group,
  Transaction,
} from '@/services/joint-liability';

export const useJointLiabilityTransactions = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [groupsData, transactionsData] = await Promise.all([
        jointLiabilityService.getAllGroups({}),
        jointLiabilityService.getAllTransactions(),
      ]);
      setGroups(groupsData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addDepositToMember = useCallback(
    async (groupId: string, memberId: string, amount: number) => {
      await jointLiabilityService.addDepositToMember(groupId, memberId, amount);
      await refetch();
    },
    [refetch]
  );

  return {
    groups,
    transactions,
    loading,
    error,
    refetch,
    addDepositToMember,
  };
};
