import { useState, useEffect, useCallback } from 'react';
import { customerService, Customer, CustomerFilters, getAllCustomers } from '@/services/customers.service';

interface UseCustomersResult {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filters: CustomerFilters;
  setFilters: React.Dispatch<React.SetStateAction<CustomerFilters>>;
}

export function useCustomers(initialFilters?: CustomerFilters): UseCustomersResult {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>(initialFilters || {});

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLoading(true);
      setError(null);
      const data:any = await getAllCustomers(filters);
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

