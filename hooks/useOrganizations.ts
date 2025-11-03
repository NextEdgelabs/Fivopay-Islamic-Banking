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
      const data:any = await getAllOrganizations();
      console.log("organizations", data);
      if (data.success && data.data && data.data.organisations) {
        setOrganizations(data.data.organisations);
      } else {
        setError('Invalid response structure from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
      // Set empty array on error to prevent breaking the UI
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

