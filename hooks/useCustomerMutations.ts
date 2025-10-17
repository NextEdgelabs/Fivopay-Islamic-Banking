import { useState } from 'react';
import {
  customerService,
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
} from '@/services/customers';

interface UseCustomerMutationsResult {
  createCustomer: (data: CreateCustomerDto) => Promise<Customer>;
  updateCustomer: (id: string, data: UpdateCustomerDto) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useCustomerMutations(): UseCustomerMutationsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = async (data: CreateCustomerDto): Promise<Customer> => {
    try {
      setLoading(true);
      setError(null);
      const customer = await customerService.createCustomer(data);
      return customer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id: string, data: UpdateCustomerDto): Promise<Customer> => {
    try {
      setLoading(true);
      setError(null);
      const customer = await customerService.updateCustomer(id, data);
      return customer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await customerService.deleteCustomer(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    loading,
    error,
  };
}

