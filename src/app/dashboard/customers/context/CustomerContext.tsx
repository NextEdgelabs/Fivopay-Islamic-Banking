"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  Customer, 
  CustomerStats, 
  CustomerSearchFilters,
  CustomerType,
  Gender,
  MaritalStatus,
  CustomerStatus,
  RiskRating,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerListResponse
} from '@/types/customer';
import { CustomerService, CustomerCache } from '@/services/customer.service';
import { ApiError } from '@/types/api';

// Loading states for different operations
interface LoadingStates {
  customers: boolean;
  stats: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  search: boolean;
}

// Error states
interface ErrorStates {
  customers: string | null;
  stats: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
  search: string | null;
}

// Customer Context Type
interface CustomerContextType {
  // Data
  customers: Customer[];
  stats: CustomerStats | null;
  selectedCustomer: Customer | null;
  
  // Loading states
  loading: LoadingStates;
  
  // Error states
  errors: ErrorStates;
  
  // Pagination
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  
  // Search and filters
  searchFilters: CustomerSearchFilters;
  
  // Actions
  fetchCustomers: (filters?: CustomerSearchFilters, page?: number) => Promise<void>;
  fetchCustomerById: (customerId: string) => Promise<Customer | null>;
  fetchCustomerStats: () => Promise<void>;
  createCustomer: (customerData: CreateCustomerRequest) => Promise<Customer | null>;
  updateCustomer: (customerId: string, updates: UpdateCustomerRequest) => Promise<Customer | null>;
  deleteCustomer: (customerId: string) => Promise<boolean>;
  searchCustomers: (filters: CustomerSearchFilters) => Promise<void>;
  setSelectedCustomer: (customer: Customer | null) => void;
  clearErrors: () => void;
  refreshCustomers: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// Initial state
const initialLoadingStates: LoadingStates = {
  customers: false,
  stats: false,
  create: false,
  update: false,
  delete: false,
  search: false,
};

const initialErrorStates: ErrorStates = {
  customers: null,
  stats: null,
  create: null,
  update: null,
  delete: null,
  search: null,
};

const initialPagination = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
};

export function CustomerProvider({ children }: { children: ReactNode }) {
  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<LoadingStates>(initialLoadingStates);
  const [errors, setErrors] = useState<ErrorStates>(initialErrorStates);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchFilters, setSearchFilters] = useState<CustomerSearchFilters>({});

  // Helper function to set loading state
  const setLoadingState = useCallback((operation: keyof LoadingStates, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [operation]: isLoading }));
  }, []);

  // Helper function to set error state
  const setErrorState = useCallback((operation: keyof ErrorStates, error: string | null) => {
    setErrors(prev => ({ ...prev, [operation]: error }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors(initialErrorStates);
  }, []);

  // Fetch customers with filters and pagination
  const fetchCustomers = useCallback(async (
    filters: CustomerSearchFilters = {}, 
    page: number = 1
  ) => {
    try {
      setLoadingState('customers', true);
      setErrorState('customers', null);
      
      // Check cache first
      const cachedCustomers = CustomerCache.get();
      if (cachedCustomers && !CustomerCache.isExpired()) {
        setCustomers(cachedCustomers);
        setLoadingState('customers', false);
        return;
      }

      const response = await CustomerService.getCustomers({
        ...filters,
        page,
        pageSize: pagination.pageSize
      });

      if (response.success && response.data) {
        setCustomers(response.data.customers);
        setPagination({
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
        
        // Cache the results
        CustomerCache.set(response.data.customers);
        
        // Update search filters
        setSearchFilters(filters);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customers';
      setErrorState('customers', errorMessage);
      console.error('Error fetching customers:', error);
    } finally {
      setLoadingState('customers', false);
    }
  }, [pagination.pageSize, setLoadingState, setErrorState]);

  // Fetch customer by ID
  const fetchCustomerById = useCallback(async (customerId: string): Promise<Customer | null> => {
    try {
      console.log('📡 CustomerContext: Fetching customer with ID:', customerId);
      setLoadingState('customers', true);
      setErrorState('customers', null);

      const response = await CustomerService.getCustomerById(customerId);
      console.log('📡 CustomerContext: API response:', response);
      
      if (response.success && response.data) {
        console.log('✅ CustomerContext: Customer fetched successfully:', response.data);
        return response.data;
      }
      console.warn('⚠️ CustomerContext: No data in response');
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customer';
      setErrorState('customers', errorMessage);
      console.error('❌ CustomerContext: Error fetching customer:', error);
      return null;
    } finally {
      setLoadingState('customers', false);
    }
  }, [setLoadingState, setErrorState]);

  // Fetch customer statistics
  const fetchCustomerStats = useCallback(async () => {
    try {
      setLoadingState('stats', true);
      setErrorState('stats', null);

      const response = await CustomerService.getCustomerStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customer stats';
      setErrorState('stats', errorMessage);
      console.error('Error fetching customer stats:', error);
    } finally {
      setLoadingState('stats', false);
    }
  }, [setLoadingState, setErrorState]);

  // Create new customer
  const createCustomer = useCallback(async (customerData: CreateCustomerRequest): Promise<Customer | null> => {
    try {
      setLoadingState('create', true);
      setErrorState('create', null);

      // Validate customer data
      const validation = CustomerService.validateCustomerData(customerData);
      if (!validation.isValid) {
        setErrorState('create', validation.errors.join(', '));
        return null;
      }

      const response = await CustomerService.createCustomer(customerData);
      
      if (response.success && response.data) {
        // Add to local state
        setCustomers(prev => [response.data!, ...prev]);
        
        // Clear cache to force refresh
        CustomerCache.clear();
        
        // Refresh stats
        await fetchCustomerStats();
        
        return response.data;
      }
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create customer';
      setErrorState('create', errorMessage);
      console.error('Error creating customer:', error);
      return null;
    } finally {
      setLoadingState('create', false);
    }
  }, [setLoadingState, setErrorState, fetchCustomerStats]);

  // Update customer
  const updateCustomer = useCallback(async (
    customerId: string, 
    updates: UpdateCustomerRequest
  ): Promise<Customer | null> => {
    try {
      setLoadingState('update', true);
      setErrorState('update', null);

      const response = await CustomerService.updateCustomer(customerId, updates);
      
      if (response.success && response.data) {
        // Update local state
        setCustomers(prev => 
          prev.map(customer => 
            customer.customerId === customerId ? response.data! : customer
          )
        );
        
        // Update selected customer if it's the same
        if (selectedCustomer?.customerId === customerId) {
          setSelectedCustomer(response.data);
        }
        
        // Clear cache to force refresh
        CustomerCache.clear();
        
        return response.data;
      }
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update customer';
      setErrorState('update', errorMessage);
      console.error('Error updating customer:', error);
      return null;
    } finally {
      setLoadingState('update', false);
    }
  }, [selectedCustomer, setLoadingState, setErrorState]);

  // Delete customer
  const deleteCustomer = useCallback(async (customerId: string): Promise<boolean> => {
    try {
      setLoadingState('delete', true);
      setErrorState('delete', null);

      const response = await CustomerService.deleteCustomer(customerId);
      
      if (response.success) {
        // Remove from local state
        setCustomers(prev => prev.filter(customer => customer.customerId !== customerId));
        
        // Clear selected customer if it's the same
        if (selectedCustomer?.customerId === customerId) {
          setSelectedCustomer(null);
        }
        
        // Clear cache to force refresh
        CustomerCache.clear();
        
        // Refresh stats
        await fetchCustomerStats();
        
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete customer';
      setErrorState('delete', errorMessage);
      console.error('Error deleting customer:', error);
      return false;
    } finally {
      setLoadingState('delete', false);
    }
  }, [selectedCustomer, setLoadingState, setErrorState, fetchCustomerStats]);

  // Search customers
  const searchCustomers = useCallback(async (filters: CustomerSearchFilters) => {
    try {
      setLoadingState('search', true);
      setErrorState('search', null);

      await fetchCustomers(filters, 1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search customers';
      setErrorState('search', errorMessage);
      console.error('Error searching customers:', error);
    } finally {
      setLoadingState('search', false);
    }
  }, [fetchCustomers, setLoadingState, setErrorState]);

  // Refresh customers
  const refreshCustomers = useCallback(async () => {
    CustomerCache.clear();
    await fetchCustomers(searchFilters, pagination.page);
  }, [fetchCustomers, searchFilters, pagination.page]);

  // Load initial data
  useEffect(() => {
    fetchCustomers();
    fetchCustomerStats();
  }, [fetchCustomers, fetchCustomerStats]);

  const value: CustomerContextType = {
    // Data
    customers,
    stats,
    selectedCustomer,
    
    // Loading states
    loading,
    
    // Error states
    errors,
    
    // Pagination
    pagination,
    
    // Search and filters
    searchFilters,
    
    // Actions
    fetchCustomers,
    fetchCustomerById,
    fetchCustomerStats,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    setSelectedCustomer,
    clearErrors,
    refreshCustomers,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
}

// Export the context for advanced usage
export { CustomerContext };