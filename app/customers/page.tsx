'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function CustomersPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample customer data
  const allCustomers = [
    {
      id: 'CUS001',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+91 98765 43210',
      accountType: 'Savings',
      balance: 348000,
      status: 'Active',
      joinedDate: '2024-01-15',
      address: 'Mumbai, Maharashtra',
      occupation: 'Business Owner',
    },
    {
      id: 'CUS002',
      name: 'Fatima Ali',
      email: 'fatima.ali@email.com',
      phone: '+91 98765 43211',
      accountType: 'Current',
      balance: 950000,
      status: 'Active',
      joinedDate: '2024-02-20',
      address: 'Delhi, Delhi',
      occupation: 'Software Engineer',
    },
    {
      id: 'CUS003',
      name: 'Mohammed Khan',
      email: 'mohammed.khan@email.com',
      phone: '+91 98765 43212',
      accountType: 'Savings',
      balance: 607000,
      status: 'Inactive',
      joinedDate: '2023-11-10',
      address: 'Bangalore, Karnataka',
      occupation: 'Doctor',
    },
    {
      id: 'CUS004',
      name: 'Aisha Rahman',
      email: 'aisha.rahman@email.com',
      phone: '+91 98765 43213',
      accountType: 'Business',
      balance: 1806000,
      status: 'Active',
      joinedDate: '2024-03-05',
      address: 'Hyderabad, Telangana',
      occupation: 'Entrepreneur',
    },
    {
      id: 'CUS005',
      name: 'Omar Yusuf',
      email: 'omar.yusuf@email.com',
      phone: '+91 98765 43214',
      accountType: 'Savings',
      balance: 437000,
      status: 'Active',
      joinedDate: '2024-04-12',
      address: 'Pune, Maharashtra',
      occupation: 'Teacher',
    },
    {
      id: 'CUS006',
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@email.com',
      phone: '+91 98765 43215',
      accountType: 'Current',
      balance: 725000,
      status: 'Active',
      joinedDate: '2024-05-18',
      address: 'Chennai, Tamil Nadu',
      occupation: 'Architect',
    },
    {
      id: 'CUS007',
      name: 'Bilal Hussain',
      email: 'bilal.hussain@email.com',
      phone: '+91 98765 43216',
      accountType: 'Savings',
      balance: 298000,
      status: 'Pending',
      joinedDate: '2024-06-22',
      address: 'Kolkata, West Bengal',
      occupation: 'Accountant',
    },
    {
      id: 'CUS008',
      name: 'Zainab Malik',
      email: 'zainab.malik@email.com',
      phone: '+91 98765 43217',
      accountType: 'Business',
      balance: 1425000,
      status: 'Active',
      joinedDate: '2024-07-08',
      address: 'Ahmedabad, Gujarat',
      occupation: 'Consultant',
    },
  ];

  // Filter customers
  const filteredCustomers = allCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback={row.name} />
          <div>
            <p className="font-medium text-neutral-900">{row.name}</p>
            <p className="text-sm text-neutral-500">{row.id}</p>
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
      key: 'balance',
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

  const handleDelete = (customer: any) => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      addToast({
        type: 'success',
        message: `${customer.name} has been deleted`,
      });
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
                  {allCustomers.length}
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
                  {allCustomers.filter((c) => c.status === 'Active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <p className="text-xs text-success-600 mt-2">
              {((allCustomers.filter((c) => c.status === 'Active').length / allCustomers.length) * 100).toFixed(0)}% active rate
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'Pending', label: 'Pending' },
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
