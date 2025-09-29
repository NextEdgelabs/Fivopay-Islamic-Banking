/**
 * Customer Hooks - Reusable hooks for customer operations
 * These hooks provide common customer functionality with proper error handling and loading states
 */

import { useState, useEffect, useMemo } from 'react';
import { Customer, useAppContext } from '@/app/context/AppContext';
import { customerService, CustomerSearchFilters, CustomerStats } from '../../../../../services';
import { useCustomerContext } from './CustomerContext';

/**
 * Hook for filtered and sorted customer data
 */
export function useCustomerList(
  filters: CustomerSearchFilters = {},
  sortBy: keyof Customer = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
  page: number = 1,
  limit: number = 10
) {
  const { customers } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort customers locally (will be replaced with API when ready)
  const { filteredCustomers, totalPages, total } = useMemo(() => {
    let filtered = [...customers];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.id.toLowerCase().includes(searchTerm) ||
        (customer.phone && customer.phone.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.status) {
      filtered = filtered.filter(customer => customer.status === filters.status);
    }

    if (filters.kycStatus) {
      filtered = filtered.filter(customer => customer.kycStatus === filters.kycStatus);
    }

    if (filters.accountType) {
      filtered = filtered.filter(customer => customer.accountType === filters.accountType);
    }

    if (filters.verificationLevel) {
      filtered = filtered.filter(customer => customer.verificationLevel === filters.verificationLevel);
    }

    // Sort customers
    filtered.sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const totalPages = Math.ceil(filtered.length / limit);
    const startIndex = (page - 1) * limit;
    const paginatedCustomers = filtered.slice(startIndex, startIndex + limit);

    return {
      filteredCustomers: paginatedCustomers,
      totalPages,
      total: filtered.length
    };
  }, [customers, filters, sortBy, sortOrder, page, limit]);

  return {
    customers: filteredCustomers,
    total,
    totalPages,
    loading,
    error,
    currentPage: page
  };
}

/**
 * Hook for customer statistics and analytics
 */
export function useCustomerStats() {
  const { customers } = useAppContext();
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats from current customer data
  const calculatedStats = useMemo(() => {
    if (!customers.length) return null;

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'Active').length;
    const activeRate = Math.round((activeCustomers / totalCustomers) * 100);

    // Calculate new customers today and this month
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const newCustomersToday = customers.filter(c => c.joinDate === today).length;
    const newCustomersThisMonth = customers.filter(c => {
      const joinDate = new Date(c.joinDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;

    // Account type distribution
    const accountTypeDistribution = customers.reduce((acc, customer) => {
      acc[customer.accountType] = (acc[customer.accountType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // KYC status distribution
    const kycStatusDistribution = customers.reduce((acc, customer) => {
      acc[customer.kycStatus] = (acc[customer.kycStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // KYC verification rate
    const verifiedCustomers = customers.filter(c => c.kycStatus === 'Verified').length;
    const kycVerificationRate = Math.round((verifiedCustomers / totalCustomers) * 100);

    // Recent activity (customers with recent activity)
    const recentActivity = customers.filter(customer => {
      if (!customer.lastActivity) return false;
      return customer.lastActivity.includes('hour') || 
             customer.lastActivity.includes('minute') || 
             customer.lastActivity.includes('day');
    }).length;

    return {
      totalCustomers,
      activeCustomers,
      newCustomersToday,
      newCustomersThisMonth,
      activeRate,
      kycVerificationRate,
      accountTypeDistribution,
      kycStatusDistribution,
      recentActivity
    } as CustomerStats;
  }, [customers]);

  useEffect(() => {
    setStats(calculatedStats);
  }, [calculatedStats]);

  const refreshStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would fetch from the API
      // const newStats = await customerService.getCustomerStats();
      // setStats(newStats);
      
      // For now, use calculated stats
      setStats(calculatedStats);
    } catch (err) {
      setError('Failed to refresh customer statistics');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats
  };
}

/**
 * Hook for customer selection management
 */
export function useCustomerSelection() {
  const { 
    selectedCustomers, 
    selectMultipleCustomers, 
    toggleCustomerSelection, 
    clearSelection 
  } = useCustomerContext();
  
  const selectAll = (customerIds: string[]) => {
    selectMultipleCustomers(customerIds);
  };

  const isSelected = (customerId: string) => {
    return selectedCustomers.includes(customerId);
  };

  const isAllSelected = (customerIds: string[]) => {
    return customerIds.length > 0 && customerIds.every(id => selectedCustomers.includes(id));
  };

  const isPartiallySelected = (customerIds: string[]) => {
    return customerIds.some(id => selectedCustomers.includes(id)) && !isAllSelected(customerIds);
  };

  return {
    selectedCustomers,
    selectAll,
    toggleSelection: toggleCustomerSelection,
    clearSelection,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    selectedCount: selectedCustomers.length
  };
}

/**
 * Hook for customer actions with loading and error states
 */
export function useCustomerActions() {
  const { sendMessage, updateKycStatus, updateAccountStatus, exportCustomers } = useCustomerContext();
  const { updateCustomer } = useAppContext();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const performAction = async (action: () => Promise<void>) => {
    setActionLoading(true);
    setActionError(null);
    
    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Action failed');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const sendMessageToCustomers = async (customerIds: string[], message: string) => {
    await performAction(() => sendMessage(customerIds, message));
  };

  const updateCustomerKyc = async (customerId: string, status: Customer['kycStatus']) => {
    await performAction(async () => {
      await updateKycStatus(customerId, status);
      // Update in AppContext as well
      // This would normally be handled by the API response
      // updateCustomer({ id: customerId, kycStatus: status } as Customer);
    });
  };

  const updateCustomerStatus = async (customerId: string, status: Customer['status']) => {
    await performAction(async () => {
      await updateAccountStatus(customerId, status);
      // Update in AppContext as well
      // This would normally be handled by the API response
      // updateCustomer({ id: customerId, status } as Customer);
    });
  };

  const exportCustomerData = async (filters: CustomerSearchFilters, format: 'csv' | 'excel' = 'csv') => {
    setActionLoading(true);
    setActionError(null);
    
    try {
      const blob = await exportCustomers(filters, format);
      
      // Download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return blob;
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Export failed');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    sendMessageToCustomers,
    updateCustomerKyc,
    updateCustomerStatus,
    exportCustomerData,
    actionLoading,
    actionError,
    clearError: () => setActionError(null)
  };
}

/**
 * Hook for customer form validation
 */
export function useCustomerValidation() {
  const validateCustomerForm = (customerData: Partial<Customer>) => {
    const errors: Record<string, string> = {};

    if (!customerData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!customerData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      errors.email = 'Invalid email format';
    }

    if (customerData.phone && !/^\+?[\d\s-()]+$/.test(customerData.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (!customerData.accountType) {
      errors.accountType = 'Account type is required';
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };

  return { validateCustomerForm };
}