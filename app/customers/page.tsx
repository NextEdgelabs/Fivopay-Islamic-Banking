'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Table,
  Badge,
  Button,
  Input,
  Select,
  IconButton,
  Breadcrumbs,
  Pagination,
  Avatar,
  Skeleton,
} from '@/components/ui';
import {
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  UserCircle,
  Users,
  CreditCard,
  CheckCircle,
  DollarSign,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useCustomers } from '@/hooks/useCustomers';
import { useCustomerMutations } from '@/hooks/useCustomerMutations';
import { Customer, customerService, getAllCustomers } from '@/services/customers.service';
import { useBranches } from '@/hooks/useBranches';
import { INDIAN_STATES, CITIES_BY_STATE } from '@/lib/indiaData';

export default function CustomersPage() {
  const router = useRouter();
  const { customers, loading, error, refetch, filters, setFilters } = useCustomers();
  const { branches } = useBranches(); // Fetch branches for the filter dropdown
  const { addToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Reset page to 1 when filters change
    setCurrentPage(1);
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };
  
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setFilters(prev => ({ ...prev, state, city: '' })); // Reset city when state changes
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ [e.target.name]: e.target.value });
  };

  // Pagination is now calculated based on the customers array from the hook
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

  const columns = [
    {
      key: 'fullName',
      header: 'Customer',
      sortable: true,
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback={row.fullName} />
          <div>
            <p className="font-medium text-neutral-900">{row.fullName}</p>
            <p className="text-sm text-neutral-500">{row.memberId || row._id || row.id || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (_: any, row: any) => (
        <div>
          <p className="text-sm text-neutral-900 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {row.email}
          </p>
          <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
            <Phone className="h-3 w-3" />
            {row.phone}
          </p>
        </div>
      ),
    },
    {
      key: 'accountType',
      header: 'Account Type',
      sortable: true,
      render: (value: string) => (
        <Badge
          variant={
            value === 'Business'
              ? 'primary'
              : value === 'Current'
              ? 'warning'
              : 'success'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'initialDeposit',
      header: 'Initial Deposit',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-neutral-900">
          ₹{value ? value.toLocaleString('en-IN') : '0'}
        </span>
      ),
    },
    {
      key: 'kycStatus',
      header: 'KYC Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'Completed' ? 'success' : value === 'Pending' ? 'warning' : 'error'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined Date',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-neutral-600">
          {new Date(value).toLocaleDateString('en-IN')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <IconButton
            icon={<Eye className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); router.push(`/customers/${row.id}`)}}
            ariaLabel="View customer"
          />
          <IconButton
            icon={<Edit className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); router.push(`/customers/${row.id}/edit`)}}
            ariaLabel="Edit customer"
          />
          <IconButton
            icon={<Trash2 className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleDelete(row)}}
            ariaLabel="Delete customer"
          />
        </div>
      ),
    },
  ];

  const handleDelete = (customer: any) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    
    try {
      await customerService.delete(customerToDelete.memberId || customerToDelete._id || customerToDelete.id);
      addToast({
        type: 'success',
        message: `${customerToDelete.fullName} has been deleted successfully`,
      });
      refetch(); // Refresh the list
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Failed to delete customer',
      });
    } finally {
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleExport = () => {
    addToast({
      type: 'success',
      message: 'Exporting customer data...',
    });
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Customers', href: '/customers' },
  ];

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6 animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <div className="p-12 text-center">
              <p className="text-error-500 mb-4">Error: {error}</p>
              <Button variant="primary" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Customers</h1>
              <p className="text-neutral-600 mt-1">Manage all customer accounts</p>
            </div>
            <Link href="/customers/add">
              <Button variant="primary" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add Customer
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Customers</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {customers.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">KYC Completed</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {customers.filter((c: any) => c.kycStatus === 'Completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <p className="text-xs text-success-600 mt-2">
              {customers.length > 0 ? ((customers.filter((c) => c.status === 'Active').length / customers.length) * 100).toFixed(0) : 0}% active rate
            </p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Loans</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">50</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-stripe flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Deposits</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">75</p>
              </div>
              <div className="w-12 h-12 bg-info-100 rounded-stripe flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Search by name, email, or ID..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                name="branch"
                value={filters.branch || ''}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'All Branches' },
                  ...branches.map(b => ({ value: b.branchName, label: b.branchName }))
                ]}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                name="state"
                value={filters.state || ''}
                onChange={handleStateChange}
                options={[
                  { value: '', label: 'All States' },
                  ...INDIAN_STATES.map(s => ({ value: s, label: s }))
                ]}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                name="city"
                value={filters.city || ''}
                onChange={handleFilterChange}
                disabled={!filters.state}
                options={[
                  { value: '', label: 'All Cities' },
                  ...(CITIES_BY_STATE[filters.state || ''] || []).map(c => ({ value: c, label: c }))
                ]}
              />
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>

        {/* Customer Table */}
        <Card>
          {customers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500 mb-4">No customers found</p>
              <p className="text-sm text-neutral-400">Check console for debugging information</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                data={paginatedCustomers}
                columns={columns}
              />
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t mt-6 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, customers.length)} of{' '}
                {customers.length} customers
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="Confirm Delete Customer"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-error-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Delete {customerToDelete?.fullName}?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                This action cannot be undone. All customer data, transactions, and related records will be permanently deleted.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={cancelDelete}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
