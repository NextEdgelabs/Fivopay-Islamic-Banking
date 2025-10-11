'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomers } from './context/CustomerContext';
import { CustomerType, CustomerStatus, RiskRating } from '@/types/customer';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import CustomerKPICards from './components/CustomerKPICards';
import PaginationControls from './components/PaginationControls';

// Loading skeleton component
const CustomerSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-stripe-surface rounded-lg p-6 border border-stripe-border">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-stripe-background rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-stripe-background rounded w-1/4"></div>
          <div className="h-3 bg-stripe-background rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-stripe-background rounded w-16"></div>
      </div>
    </div>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="bg-stripe-error-light border border-stripe-error rounded-lg p-4">
    <div className="flex items-center">
      <ExclamationTriangleIcon className="h-5 w-5 text-stripe-error mr-3" />
      <div className="flex-1">
        <p className="text-sm font-medium text-stripe-error">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-3 text-stripe-error hover:text-stripe-error-dark"
        >
          <ArrowPathIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);

// Filter component
const CustomerFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: { 
  filters: any; 
  onFiltersChange: (filters: any) => void; 
  onClearFilters: () => void;
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-stripe-text">Filters</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
            <button
              onClick={onClearFilters}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Customer Type</label>
              <select
                value={filters.customerType || ''}
                onChange={(e) => onFiltersChange({ ...filters, customerType: e.target.value || undefined })}
                className="form-input"
              >
                <option value="">All Types</option>
                <option value={CustomerType.INDIVIDUAL}>Individual</option>
                <option value={CustomerType.BUSINESS}>Business</option>
                <option value={CustomerType.NRI}>NRI</option>
              </select>
            </div>

            <div>
              <label className="form-label">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => onFiltersChange({ ...filters, status: e.target.value || undefined })}
                className="form-input"
              >
                <option value="">All Status</option>
                <option value={CustomerStatus.ACTIVE}>Active</option>
                <option value={CustomerStatus.INACTIVE}>Inactive</option>
                <option value={CustomerStatus.DORMANT}>Dormant</option>
                <option value={CustomerStatus.CLOSED}>Closed</option>
                <option value={CustomerStatus.BLOCKED}>Blocked</option>
              </select>
            </div>

            <div>
              <label className="form-label">Risk Rating</label>
              <select
                value={filters.riskRating || ''}
                onChange={(e) => onFiltersChange({ ...filters, riskRating: e.target.value || undefined })}
                className="form-input"
              >
                <option value="">All Ratings</option>
                <option value={RiskRating.LOW}>Low</option>
                <option value={RiskRating.MEDIUM}>Medium</option>
                <option value={RiskRating.HIGH}>High</option>
              </select>
            </div>

            <div>
              <label className="form-label">Branch</label>
              <select
                value={filters.branchId || ''}
                onChange={(e) => onFiltersChange({ ...filters, branchId: e.target.value || undefined })}
                className="form-input"
              >
                <option value="">All Branches</option>
                <option value="BR001">Main Branch</option>
                <option value="BR002">Downtown Branch</option>
                <option value="BR003">Bangalore Branch</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function CustomersPage() {
  const router = useRouter();
  const {
    customers,
    stats,
    loading,
    errors,
    pagination,
    searchFilters,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    setSelectedCustomer,
    clearErrors,
    refreshCustomers
  } = useCustomers();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});
  
  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Client-side pagination logic
  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.firstName.toLowerCase().includes(searchLower) ||
        customer.lastName.toLowerCase().includes(searchLower) ||
        customer.primaryEmail.toLowerCase().includes(searchLower) ||
        customer.primaryMobile.includes(searchTerm) ||
        customer.customerId.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters
    if (filters.customerType) {
      filtered = filtered.filter(customer => customer.customerType === filters.customerType);
    }
    if (filters.status) {
      filtered = filtered.filter(customer => customer.status === filters.status);
    }
    if (filters.riskRating) {
      filtered = filtered.filter(customer => customer.riskRating === filters.riskRating);
    }
    if (filters.branchId) {
      filtered = filtered.filter(customer => customer.preferredBranchId === filters.branchId);
    }

    return filtered;
  }, [customers, searchTerm, filters]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle delete confirmation
  const handleDeleteClick = (customerId: string) => {
    setDeleteConfirmId(customerId);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      const success = await deleteCustomer(deleteConfirmId);
      if (success) {
        setDeleteConfirmId(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // Get status color
  const getStatusColor = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case CustomerStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case CustomerStatus.DORMANT:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case CustomerStatus.CLOSED:
        return 'bg-red-100 text-red-800 border-red-200';
      case CustomerStatus.BLOCKED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get risk rating color
  const getRiskRatingColor = (riskRating: RiskRating) => {
    switch (riskRating) {
      case RiskRating.LOW:
        return 'bg-green-100 text-green-800';
      case RiskRating.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case RiskRating.HIGH:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-stripe-text">Customer Management</h1>
          <p className="text-stripe-text-secondary mt-1">Manage and monitor all customer accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshCustomers}
            disabled={loading.customers}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading.customers ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => router.push('/dashboard/customers/create')}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Customer
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {errors.customers && (
        <ErrorMessage 
          message={errors.customers} 
          onRetry={() => fetchCustomers()} 
        />
      )}

      {/* Stats Cards */}
      {stats && <CustomerKPICards stats={stats} />}

      {/* Search and Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stripe-text-muted" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or customer ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="form-input pl-10"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading.search}
              className="btn btn-primary flex items-center space-x-2"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <CustomerFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Customer Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-stripe-text">All Customers</h2>
          <p className="text-sm text-stripe-text-secondary mt-1">
            Showing {customers.length} of {pagination.total} customers
          </p>
        </div>
        
        {loading.customers ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <CustomerSkeleton key={i} />
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <UserCircleIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stripe-text mb-2">No customers found</h3>
            <p className="text-stripe-text-secondary mb-4">Try adjusting your search criteria or add a new customer</p>
            <button 
              onClick={() => router.push('/dashboard/customers/create')}
              className="btn btn-primary"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add New Customer
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stripe-border">
              <thead className="bg-stripe-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                    Personal Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                    Professional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                    Type / Segment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                    Risk / PEP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-stripe-surface divide-y divide-stripe-border">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-stripe-background transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-stripe-primary">{customer.customerId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-stripe-text">
                            {customer.title && `${customer.title} `}{customer.firstName} {customer.middleName && `${customer.middleName} `}{customer.lastName}
                          </div>
                          <div className="text-sm text-stripe-text-muted">
                            {customer.fatherName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-stripe-text">{customer.primaryMobile}</div>
                      <div className="text-sm text-stripe-text-muted truncate max-w-[200px]">{customer.primaryEmail}</div>
                      {customer.secondaryMobile && (
                        <div className="text-xs text-stripe-text-muted mt-1">Alt: {customer.secondaryMobile}</div>
                      )}
                      {customer.preferredLanguage && (
                        <div className="text-xs text-stripe-text-muted mt-1">Lang: {customer.preferredLanguage.toUpperCase()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-stripe-text">
                          <span className="font-medium">{customer.gender || 'N/A'}</span> • {customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString('en-IN', { year: 'numeric' }) : 'N/A'}
                        </div>
                        <div className="text-xs text-stripe-text-muted">
                          {customer.maritalStatus || 'N/A'}
                        </div>
                        <div className="text-xs text-stripe-text-muted">
                          📍 {customer.nationality || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-stripe-text font-medium">
                          {customer.occupation || 'Not specified'}
                        </div>
                        {customer.annualIncome && (
                          <div className="text-xs text-stripe-text-muted">
                            ₹{(customer.annualIncome / 100000).toFixed(1)}L/yr
                          </div>
                        )}
                        {customer.incomeSource && (
                          <div className="text-xs text-stripe-text-muted">
                            {customer.incomeSource}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {customer.customerType}
                        </span>
                        {customer.customerSegment && (
                          <div className="text-xs text-stripe-text font-medium">
                            {customer.customerSegment}
                          </div>
                        )}
                        {customer.customerCategory && (
                          <div className="text-xs text-stripe-text-muted">
                            {customer.customerCategory}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskRatingColor(customer.riskRating)}`}>
                          {customer.riskRating}
                        </span>
                        {customer.pepStatus && (
                          <div className="flex items-center text-xs text-orange-600 font-medium">
                            <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                            PEP
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            router.push(`/dashboard/customers/${customer.customerId}`);
                          }}
                          className="btn-icon-view"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            router.push(`/dashboard/customers/${customer.customerId}/edit`);
                          }}
                          className="btn-icon-edit"
                          title="Edit Customer"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(customer.customerId)}
                          className="btn-icon-delete"
                          title="Delete Customer"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredCustomers.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCustomers.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stripe-text">Delete Customer</h3>
                  <p className="text-sm text-stripe-text-secondary mt-1">
                    Are you sure you want to delete this customer?
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. All customer data, including accounts and transaction history, will be permanently deleted.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading.delete}
                  className="btn btn-danger flex items-center space-x-2"
                >
                  {loading.delete ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <TrashIcon className="w-4 h-4" />
                  )}
                  <span>Delete Customer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}