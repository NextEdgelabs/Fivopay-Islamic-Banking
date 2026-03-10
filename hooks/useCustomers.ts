import { useState, useEffect, useCallback } from 'react';
import { customerService, Customer, CustomerFilters, getAllCustomers } from '@/services/customers.service';
import { getOrganisationId } from '@/lib/auth';

interface UseCustomersResult {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filters: CustomerFilters;
  setFilters: React.Dispatch<React.SetStateAction<CustomerFilters>>;
}

function getDefaultCustomerFilters(initialFilters?: CustomerFilters): CustomerFilters {
  const orgId = typeof window !== 'undefined' ? getOrganisationId() : null;
  return {
    limit: 500,
    ...initialFilters,
    organisationId: initialFilters?.organisationId !== undefined ? initialFilters.organisationId : (orgId ?? undefined),
  };
}

export function useCustomers(initialFilters?: CustomerFilters): UseCustomersResult {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>(getDefaultCustomerFilters(initialFilters));

  const fetchCustomers = useCallback(async () => {
    const isRefetch = customers.length > 0;
    if (!isRefetch) {
      setLoading(true);
    }
    setError(null);
    try {
      const data: any = await getAllCustomers(filters);
      setCustomers(data.data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    filters,
    setFilters,
  };
}

