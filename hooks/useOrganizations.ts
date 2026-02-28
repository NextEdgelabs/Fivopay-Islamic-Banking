import { useState, useEffect, useCallback } from 'react';
import { getAllOrganizations, Organization } from '@/services/organization.service';

interface UseOrganizationsResult {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrganizations(): UseOrganizationsResult {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      const orgs = await getAllOrganizations();
      setOrganizations(Array.isArray(orgs) ? orgs : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    loading,
    error,
    refetch: fetchOrganizations,
  };
}

