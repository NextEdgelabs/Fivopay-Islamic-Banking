'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Table,
  Input,
  Select,
  Pagination,
  Badge,
  Skeleton,
  Breadcrumbs,
} from '@/components/ui';
import { Search, Plus, Edit, Trash2, Wallet } from 'lucide-react';
import { useDeposits } from '@/hooks/useDeposits';
import { useDepositMutations } from '@/hooks/useDepositMutations';
import { useToast } from '@/components/ui/Toast';

export default function DepositsPage() {
  const router = useRouter();
  const { deposits: allDeposits, loading, error, refetch } = useDeposits();
  const { deleteDeposit } = useDepositMutations();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDeposits = useMemo(() => {
    return allDeposits.filter((deposit) => {
      const matchesSearch =
        deposit.depositId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deposit.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deposit.customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter ? deposit.status === statusFilter : true;
      const matchesType = typeFilter ? deposit.depositType === typeFilter : true;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allDeposits, searchTerm, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);
  const paginatedDeposits = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDeposits.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDeposits, currentPage]);

  const handleDelete = async (deposit: any) => {
    if (confirm(`Are you sure you want to delete deposit ${deposit.depositId}?`)) {
      try {
        await deleteDeposit(deposit.id);
        addToast({
          type: 'success',
          message: `Deposit ${deposit.depositId} has been deleted successfully`,
        });
        refetch();
      } catch (err) {
        addToast({
          type: 'error',
          message: 'Failed to delete deposit',
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      Active: 'success',
      Closed: 'neutral',
      Matured: 'primary',
      Frozen: 'warning',
    };
    return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="p-6 text-center text-error-500">
            <p>Error: {error}</p>
            <Button onClick={refetch} className="mt-4">
              Retry
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Deposits', href: '/deposits' },
  ];

  const columns = [
    {
      key: 'depositId',
      header: 'Deposit ID',
      render: (deposit: any) => (
        <div className="font-medium text-neutral-900">{deposit.depositId}</div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (deposit: any) => (
        <div>
          <Link
            href={`/customers/${deposit.customerId}`}
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            {deposit.customerName}
          </Link>
          <div className="text-sm text-neutral-500">{deposit.accountNumber}</div>
        </div>
      ),
    },
    {
      key: 'depositType',
      header: 'Type',
      render: (deposit: any) => (
        deposit ? <Badge variant="neutral">{deposit.depositType}</Badge> : null
      ),
    },
    {
      key: 'amount',
      header: 'Balance',
      render: (deposit: any) => (
        <div className="font-semibold text-neutral-900">
          ₹{deposit.currentBalance.toLocaleString('en-IN')}
        </div>
      ),
    },
    {
      key: 'interest',
      header: 'Interest',
      render: (deposit: any) => (
        <div className="text-neutral-700">{deposit.interestRate}%</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (deposit: any) => getStatusBadge(deposit.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (deposit: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/deposits/${deposit.id}`)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit className="h-4 w-4" />}
            onClick={() => router.push(`/deposits/${deposit.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => handleDelete(deposit)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Deposits</h1>
            <p className="text-neutral-600 mt-1">
              Manage all deposit accounts and investments
            </p>
          </div>
          <Button
            icon={<Plus className="h-5 w-5" />}
            onClick={() => router.push('/deposits/add')}
          >
            Add Deposit
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <Input
                placeholder="Search deposits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Closed', label: 'Closed' },
                { value: 'Matured', label: 'Matured' },
                { value: 'Frozen', label: 'Frozen' },
              ]}
            />
            <Select
              placeholder="Filter by type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: '', label: 'All Types' },
                { value: 'Savings Account', label: 'Savings Account' },
                { value: 'Fixed Deposit', label: 'Fixed Deposit' },
                { value: 'Recurring Deposit', label: 'Recurring Deposit' },
                { value: 'Current Account', label: 'Current Account' },
              ]}
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Showing {paginatedDeposits.length} of {filteredDeposits.length} deposits
            </p>
          </div>

          {filteredDeposits.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
              <p className="text-neutral-500">No deposits found</p>
            </div>
          ) : (
            <>
              <Table columns={columns} data={paginatedDeposits} />

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

