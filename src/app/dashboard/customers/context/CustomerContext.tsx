"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, useAppContext } from '@/app/context/AppContext';
import { customerService, CustomerSearchFilters, CustomerStats } from '../../../../../services';

// Extended customer type with additional UI state
interface CustomerWithSelection extends Customer {
  selected?: boolean;
}

// Local filter interface for UI components
interface CustomerUIFilters {
  search?: string;
  status?: string;
  kycStatus?: string;
  accountType?: string;
  verificationLevel?: string;
  branch?: string;
  dateRange?: { start: Date | null; end: Date | null };
  balanceRange?: { min?: number; max?: number };
}

// Customer context interface
interface CustomerContextType {
  // State
  selectedCustomer: CustomerWithSelection | null;
  selectedCustomers: string[];
  loading: boolean;
  error: string | null;
  stats: CustomerStats | null;
  
  // Customer management
  selectCustomer: (customer: CustomerWithSelection | null) => void;
  selectMultipleCustomers: (customerIds: string[]) => void;
  toggleCustomerSelection: (customerId: string) => void;
  clearSelection: () => void;
  
  // Data operations (using service layer)
  refreshStats: () => Promise<void>;
  
  // Customer actions (delegated to service)
  sendMessage: (customerIds: string[], message: string) => Promise<void>;
  updateKycStatus: (customerId: string, status: Customer['kycStatus']) => Promise<void>;
  updateAccountStatus: (customerId: string, status: Customer['status']) => Promise<void>;
  exportCustomers: (filters: CustomerSearchFilters, format?: 'csv' | 'excel') => Promise<Blob>;
}

// Create context
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// Customer provider component
export function CustomerProvider({ children }: { children: ReactNode }) {
  const { customers, updateCustomer } = useAppContext();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithSelection | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CustomerStats | null>(null);

  // Load stats on mount
  useEffect(() => {
    refreshStats();
  }, [customers]);

  // Customer management functions
  const selectCustomer = (customer: CustomerWithSelection | null) => {
    setSelectedCustomer(customer);
  };

  const selectMultipleCustomers = (customerIds: string[]) => {
    setSelectedCustomers(customerIds);
  };

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const clearSelection = () => {
    setSelectedCustomers([]);
    setSelectedCustomer(null);
  };

  // Data operations
  const refreshStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const customerStats = await customerService.getCustomerStats();
      setStats(customerStats);
    } catch (err) {
      setError('Failed to fetch customer statistics');
    } finally {
      setLoading(false);
    }
  };

  const exportCustomers = async (filters: CustomerSearchFilters, format: 'csv' | 'excel' = 'csv') => {
    setLoading(true);
    setError(null);
    
    try {
      const blob = await customerService.exportCustomers(filters, format);
      return blob;
    } catch (err) {
      setError('Failed to export customers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Customer actions
  const sendMessage = async (customerIds: string[], message: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call to send messages
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Sending message to ${customerIds.length} customers:`, message);
    } catch (err) {
      setError('Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateKycStatus = async (customerId: string, status: Customer['kycStatus']) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Updated KYC status for customer ${customerId} to ${status}`);
    } catch (err) {
      setError('Failed to update KYC status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAccountStatus = async (customerId: string, status: Customer['status']) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Updated account status for customer ${customerId} to ${status}`);
    } catch (err) {
      setError('Failed to update account status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: CustomerContextType = {
    // State
    selectedCustomer,
    selectedCustomers,
    loading,
    error,
    stats,
    
    // Customer management
    selectCustomer,
    selectMultipleCustomers,
    toggleCustomerSelection,
    clearSelection,
    
    // Data operations
    refreshStats,
    
    // Customer actions
    sendMessage,
    updateKycStatus,
    updateAccountStatus,
    exportCustomers,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

// Hook to use customer context
export function useCustomerContext() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }
  return context;
}

// Export types for use in other components
export type { CustomerWithSelection, CustomerUIFilters };
