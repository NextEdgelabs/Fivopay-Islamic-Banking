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
  Loader,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useCustomers } from '@/hooks/useCustomers';
import { useCustomerMutations } from '@/hooks/useCustomerMutations';
import { Customer } from '@/services/customers';
import { useBranches } from '@/hooks/useBranches';
import { INDIAN_STATES, CITIES_BY_STATE } from '@/lib/indiaData';

export default function CustomersPage() {
  const router = useRouter();
  const { customers, loading, error, refetch, setFilters } = useCustomers();
  const { branches } = useBranches(); // Fetch branches for the filter dropdown
  const { deleteCustomer, loading: isDeleting } = useCustomerMutations();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedState, setSelectedState] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    // ... existing useEffect for search debounce
  }, [searchTerm, setFilters]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedState(state);
    setFilters(prev => ({ ...prev, state, city: '' })); // Reset city when state changes
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = customer.status === 'Active'; // Assuming 'Active' is the default status filter
      const matchesBranch = customer.branch === 'All Branches' || customer.branch === 'All Cities' || customer.branch === 'All States'; // Assuming 'All Branches' is the default branch filter
      const matchesState = customer.state === 'All States' || customer.state === 'All Cities'; // Assuming 'All States' is the default state filter
      const matchesCity = customer.city === 'All Cities'; // Assuming 'All Cities' is the default city filter

      return matchesSearch && matchesStatus && matchesBranch && matchesState && matchesCity;
    });
  }, [customers, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

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
            <p className="text-sm text-neutral-500">{row.customerId}</p>
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
      key: 'currentBalance',
      header: 'Balance',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-neutral-900">
          ₹{value.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'success' : value === 'Pending' ? 'warning' : 'error'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'joinedDate',
      header: 'Joined Date',
      sortable: true,
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
            onClick={() => router.push(`/customers/${row.id}`)}
            ariaLabel="View customer"
          />
          <IconButton
            icon={<Edit className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/customers/${row.id}/edit`)}
            ariaLabel="Edit customer"
          />
          <IconButton
            icon={<Trash2 className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
            ariaLabel="Delete customer"
          />
        </div>
      ),
    },
  ];

  const handleDelete = async (customer: any) => {
    if (confirm(`Are you sure you want to delete ${customer.fullName}?`)) {
      try {
        await deleteCustomer(customer.id);
        addToast({
          type: 'success',
          message: `${customer.fullName} has been deleted successfully`,
        });
        refetch(); // Refresh the list
      } catch (err) {
        addToast({
          type: 'error',
          message: 'Failed to delete customer',
        });
      }
    }
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
                <UserCircle className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-2">All registered customers</p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Accounts</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {customers.filter((c) => c.status === 'Active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <p className="text-xs text-success-600 mt-2">
              {((customers.filter((c) => c.status === 'Active').length / customers.length) * 100).toFixed(0)}% active rate
            </p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Deposits</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">₹18.5 Cr</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-stripe flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-warning-600" />
              </div>
            </div>
            <p className="text-xs text-primary-600 mt-2">Avg: ₹48,000</p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">New This Month</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">3</p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-stripe flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-error-600" />
              </div>
            </div>
            <p className="text-xs text-success-600 mt-2">+8.2% growth</p>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={customer.branch}
                onChange={handleFilterChange}
                options={[
                  { value: 'All Branches', label: 'All Branches' },
                  ...branches.map(b => ({ value: b.branchName, label: b.branchName }))
                ]}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={selectedState}
                onChange={handleStateChange}
                options={[
                  { value: 'All States', label: 'All States' },
                  ...INDIAN_STATES.map(s => ({ value: s, label: s }))
                ]}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={customer.city}
                onChange={handleFilterChange}
                disabled={!selectedState}
                options={[
                  { value: 'All Cities', label: 'All Cities' },
                  ...(CITIES_BY_STATE[selectedState] || []).map(c => ({ value: c, label: c }))
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
          <div className="overflow-x-auto">
            <Table
              data={paginatedCustomers}
              columns={columns}
              onRowClick={(row) => router.push(`/customers/${row.id}`)}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of{' '}
                {filteredCustomers.length} customers
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
    </DashboardLayout>
  );
}
