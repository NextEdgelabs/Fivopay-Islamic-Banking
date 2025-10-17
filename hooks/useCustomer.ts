import { useState, useEffect, useCallback } from 'react';
import {
  customerService,
  Customer,
  CustomerTransaction,
  CustomerActivity,
} from '@/services/customers';

interface UseCustomerResult {
  customer: Customer | null;
  transactions: CustomerTransaction[];
  activities: CustomerActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCustomer(id: string): UseCustomerResult {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [activities, setActivities] = useState<CustomerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [customerData, transactionsData, activitiesData] = await Promise.all([
        customerService.getCustomerById(id),
        customerService.getCustomerTransactions(id),
        customerService.getCustomerActivity(id),
      ]);

      setCustomer(customerData);
      setTransactions(transactionsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customer data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  return {
    customer,
    transactions,
    activities,
    loading,
    error,
    refetch: fetchCustomerData,
  };
}

