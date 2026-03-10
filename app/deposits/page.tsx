'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { Search, Plus, Edit, Trash2, Wallet, Users, Banknote, Shield, Download, Eye, Settings, Receipt } from 'lucide-react';
import { useDeposits } from '@/hooks/useDeposits';
import { useDepositMutations } from '@/hooks/useDepositMutations';
import { useDepositTransactions } from '@/hooks/useDepositTransactions';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
import { useToast } from '@/components/ui/Toast';

export default function DepositsPage() {
  const router = useRouter();
  const { deposits, loading, error, refetch, filters, setFilters } = useDeposits();
  const { deleteDeposit } = useDepositMutations();
  const { rateLabel } = useInterestProfitTerm();
  const { addToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [txnPage, setTxnPage] = useState(1);
  const [txnSource, setTxnSource] = useState<'all' | 'share' | 'investment'>('all');
  const [searchInputValue, setSearchInputValue] = useState(filters.search || '');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemsPerPage = 10;
  const txnPerPage = 15;

  useEffect(() => {
    setSearchInputValue(filters.search || '');
  }, [filters.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value }));
      searchDebounceRef.current = null;
    }, 1000);
  };

  const {
    transactions: allTransactions,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
    totalCount: totalTransactionsCount,
    totalPages: totalTxnPages,
  } = useDepositTransactions({
    page: txnPage,
    limit: txnPerPage,
    source: txnSource,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.ceil(deposits.length / itemsPerPage);
  const paginatedDeposits = deposits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const isInitialLoad = loading && !deposits.length;
  if (isInitialLoad) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-96 w-full" />
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
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-neutral-900">{row.depositId}</p>
          <p className="text-sm text-neutral-500">{row.accountNumber}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (value: string, row: any) => (
        <div>
          <Link
            href={`/customers/${row.customerId}`}
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            {row.customerName}
          </Link>
        </div>
      ),
    },
    {
      key: 'depositType',
      header: 'Type',
      render: (value: string) => <Badge variant="neutral">{value}</Badge>,
    },
    {
      key: 'currentBalance',
      header: 'Balance',
      render: (value: number) => <div className="font-semibold">₹{value.toLocaleString('en-IN')}</div>,
    },
    {
      key: 'interestRate',
      header: rateLabel,
      render: (value: number) => <div>{value}%</div>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/deposits/${row.id}`)}}><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/deposits/${row.id}/edit`)}}><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(row)}}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  const totalDepositValue = deposits.reduce((acc, deposit) => acc + deposit.currentBalance, 0);
  const activeDeposits = deposits.filter(d => d.status === 'Active');

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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/deposits/products')}>
              <Settings className="mr-2 h-4 w-4" />
              Manage Deposit Products
            </Button>
            <Button onClick={() => router.push('/deposits/add')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Deposit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Deposits</p>
                <p className="text-2xl font-bold">{deposits.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center"><Users className="h-6 w-6 text-primary-600" /></div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Value</p>
                <p className="text-2xl font-bold">₹{totalDepositValue.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center"><Banknote className="h-6 w-6 text-success-600" /></div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Accounts</p>
                <p className="text-2xl font-bold">{activeDeposits.length}</p>
              </div>
              <div className="w-12 h-12 bg-info-100 rounded-stripe flex items-center justify-center"><Shield className="h-6 w-6 text-info-600" /></div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Input
                placeholder="Search by deposit ID, account, or customer..."
                value={searchInputValue}
                onChange={handleSearchChange}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select
              name="status"
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Closed', label: 'Closed' },
                { value: 'Matured', label: 'Matured' },
                { value: 'Frozen', label: 'Frozen' },
              ]}
            />
            <Select
              name="depositType"
              value={filters.depositType || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, depositType: e.target.value }))}
              options={[
                { value: '', label: 'All Types' },
                { value: 'Savings Account', label: 'Savings Account' },
                { value: 'Fixed Deposit', label: 'Fixed Deposit' },
                { value: 'Recurring Deposit', label: 'Recurring Deposit' },
                { value: 'Current Account', label: 'Current Account' },
              ]}
            />
            <Button variant="outline" onClick={() => { /* Implement Export */ }}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {deposits.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
              <p className="text-neutral-500">No deposits found for the current filters.</p>
            </div>
          ) : (
            <>
              <Table columns={columns} data={paginatedDeposits} onRowClick={(row) => router.push(`/deposits/${row.id}`)} />

              {totalPages > 1 && (
                <div className="p-4 border-t flex items-center justify-between">
                  <p className="text-sm text-neutral-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, deposits.length)} of {deposits.length} deposits
                  </p>
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

        {/* All Transactions (Share + Investment) */}
        <Card>
          <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-neutral-600" />
              <h2 className="text-lg font-semibold text-neutral-900">All Transactions</h2>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={txnSource}
                onChange={(e) => {
                  setTxnSource(e.target.value as 'all' | 'share' | 'investment');
                  setTxnPage(1);
                }}
                options={[
                  { value: 'all', label: 'All (Share + Investment)' },
                  { value: 'share', label: 'Share only' },
                  { value: 'investment', label: 'Investment only' },
                ]}
              />
              <Button variant="ghost" size="sm" onClick={() => refetchTransactions()} disabled={transactionsLoading}>
                Refresh
              </Button>
            </div>
          </div>
          {transactionsLoading ? (
            <div className="p-8 flex justify-center">
              <Skeleton className="h-48 w-full" />
            </div>
          ) : transactionsError ? (
            <div className="p-6 text-center text-error-500">
              <p>{transactionsError}</p>
              <Button variant="outline" className="mt-2" onClick={() => refetchTransactions()}>Retry</Button>
            </div>
          ) : allTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
              <p className="text-neutral-500">No transactions found.</p>
            </div>
          ) : (
            <>
              <Table
                columns={[
                  {
                    key: 'date',
                    header: 'Date',
                    render: (_: any, row: any) => <span className="text-sm text-neutral-700">{row.date}</span>,
                  },
                  {
                    key: 'typeLabel',
                    header: 'Type',
                    render: (val: string) => <Badge variant="neutral">{val}</Badge>,
                  },
                  {
                    key: 'source',
                    header: 'Source',
                    render: (val: string) => (
                      <Badge variant={val === 'share' ? 'primary' : 'success'}>{val === 'share' ? 'Share' : 'Investment'}</Badge>
                    ),
                  },
                  {
                    key: 'customerName',
                    header: 'Customer',
                    render: (_: any, row: any) =>
                      row.customerId ? (
                        <Link href={`/customers/${row.customerId}`} className="font-medium text-primary-600 hover:underline">
                          {row.customerName}
                        </Link>
                      ) : (
                        <span className="text-neutral-600">{row.customerName}</span>
                      ),
                  },
                  {
                    key: 'amount',
                    header: 'Amount',
                    render: (val: number) => <span className="font-semibold">₹{Number(val).toLocaleString('en-IN')}</span>,
                  },
                  ...(txnSource !== 'investment'
                    ? [{
                        key: 'status',
                        header: 'Status',
                        render: (_: any, row: any) =>
                          row.status ? <Badge variant={row.status === 'Completed' ? 'success' : row.status === 'Rejected' ? 'error' : 'warning'}>{row.status}</Badge> : null,
                      }]
                    : []),
                ]}
                data={allTransactions}
              />
              {totalTxnPages > 1 && (
                <div className="p-4 border-t flex items-center justify-between">
                  <p className="text-sm text-neutral-600">
                    Showing {(txnPage - 1) * txnPerPage + 1} to {Math.min(txnPage * txnPerPage, totalTransactionsCount)} of {totalTransactionsCount} transactions
                  </p>
                  <Pagination
                    currentPage={txnPage}
                    totalPages={totalTxnPages}
                    onPageChange={setTxnPage}
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

