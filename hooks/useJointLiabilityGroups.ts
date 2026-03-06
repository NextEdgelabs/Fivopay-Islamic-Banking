import { useState, useCallback, useEffect } from 'react';
import {
  jointLiabilityService,
  Group,
  CreateGroupPayload,
  DistributeCreditPayload,
  AddMemberPayload,
} from '@/services/joint-liability';

export const useJointLiabilityGroups = (options?: { search?: string }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jointLiabilityService.getAllGroups({ search: options?.search });
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  }, [options?.search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createGroup = useCallback(
    async (payload: CreateGroupPayload) => {
      const group = await jointLiabilityService.createGroup(payload);
      await refetch();
      return group;
    },
    [refetch]
  );

  const deleteGroup = useCallback(
    async (groupId: string) => {
      await jointLiabilityService.deleteGroup(groupId);
      await refetch();
    },
    [refetch]
  );

  const distributeCredit = useCallback(
    async (groupId: string, payload: DistributeCreditPayload) => {
      await jointLiabilityService.distributeCredit(groupId, payload);
      await refetch();
    },
    [refetch]
  );

  const addMemberToGroup = useCallback(
    async (groupId: string, payload: AddMemberPayload) => {
      const group = await jointLiabilityService.addMemberToGroup(groupId, payload);
      await refetch();
      return group;
    },
    [refetch]
  );

  const removeMemberFromGroup = useCallback(
    async (groupId: string, memberId: string) => {
      const group = await jointLiabilityService.removeMemberFromGroup(groupId, memberId);
      await refetch();
      return group;
    },
    [refetch]
  );

  const getGroupById = useCallback(async (groupId: string) => {
    return jointLiabilityService.getGroupById(groupId);
  }, []);

  return {
    groups,
    loading,
    error,
    refetch,
    createGroup,
    deleteGroup,
    distributeCredit,
    addMemberToGroup,
    removeMemberFromGroup,
    getGroupById,
  };
};
