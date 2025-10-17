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
import { Search, Plus, Edit, Trash2, DollarSign, Check, X } from 'lucide-react';
import { useLoans } from '@/hooks/useLoans';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useToast } from '@/components/ui/Toast';

export default function LoansPage() {
  const router = useRouter();
  const { loans: allLoans, loading, error, refetch } = useLoans();
  const { deleteLoan } = useLoanMutations();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter loans
  const filteredLoans = useMemo(() => {
    return allLoans.filter((loan) => {
      const matchesSearch =
        loan.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter ? loan.status === statusFilter : true;
      const matchesType = typeFilter ? loan.loanType === typeFilter : true;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allLoans, searchTerm, statusFilter, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const paginatedLoans = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLoans.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLoans, currentPage]);

  const handleDelete = async (loan: any) => {
    if (confirm(`Are you sure you want to delete loan ${loan.loanId}?`)) {
      try {
        await deleteLoan(loan.id);
        addToast({
          type: 'success',
          message: `Loan ${loan.loanId} has been deleted successfully`,
        });
        refetch();
      } catch (err) {
        addToast({
          type: 'error',
          message: 'Failed to delete loan',
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      Pending: 'warning',
      'Under Review': 'neutral',
      Approved: 'success',
      Rejected: 'error',
      Disbursed: 'primary',
      Active: 'success',
      Closed: 'neutral',
      Defaulted: 'error',
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
    { label: 'Loans', href: '/loans' },
  ];

  const columns = [
    {
      key: 'loanId',
      header: 'Loan ID',
      render: (loan: any) => (
        <div className="font-medium text-neutral-900">{loan.loanId}</div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (loan: any) => (
        <div>
          <Link
            href={`/customers/${loan.customerId}`}
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            {loan.customerName}
          </Link>
          <div className="text-sm text-neutral-500">{loan.customerPhone}</div>
        </div>
      ),
    },
    {
      key: 'loanType',
      header: 'Type',
      render: (loan: any) => (
        loan ? <Badge variant="neutral">{loan.loanType}</Badge> : null
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (loan: any) => (
        <div className="font-semibold text-neutral-900">
          ₹{loan.loanAmount.toLocaleString('en-IN')}
        </div>
      ),
    },
    {
      key: 'emi',
      header: 'EMI',
      render: (loan: any) => (
        <div className="text-neutral-700">
          ₹{loan.emiAmount.toLocaleString('en-IN')}
        </div>
      ),
    },
    {
      key: 'tenure',
      header: 'Tenure',
      render: (loan: any) => (
        <div className="text-neutral-700">{loan.tenure} months</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (loan: any) => getStatusBadge(loan.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (loan: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/loans/${loan.id}`)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit className="h-4 w-4" />}
            onClick={() => router.push(`/loans/${loan.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => handleDelete(loan)}
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
            <h1 className="text-3xl font-bold text-neutral-900">Loans</h1>
            <p className="text-neutral-600 mt-1">
              Manage all loan applications and disbursements
            </p>
          </div>
          <Button
            icon={<Plus className="h-5 w-5" />}
            onClick={() => router.push('/loans/add')}
          >
            Add Loan
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <Input
                placeholder="Search loans..."
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
                { value: 'Pending', label: 'Pending' },
                { value: 'Under Review', label: 'Under Review' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Rejected', label: 'Rejected' },
                { value: 'Disbursed', label: 'Disbursed' },
                { value: 'Active', label: 'Active' },
                { value: 'Closed', label: 'Closed' },
              ]}
            />
            <Select
              placeholder="Filter by type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: '', label: 'All Types' },
                { value: 'Personal Loan', label: 'Personal Loan' },
                { value: 'Home Loan', label: 'Home Loan' },
                { value: 'Business Loan', label: 'Business Loan' },
                { value: 'Education Loan', label: 'Education Loan' },
                { value: 'Vehicle Loan', label: 'Vehicle Loan' },
                { value: 'Gold Loan', label: 'Gold Loan' },
              ]}
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Showing {paginatedLoans.length} of {filteredLoans.length} loans
            </p>
          </div>

          {filteredLoans.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
              <p className="text-neutral-500">No loans found</p>
            </div>
          ) : (
            <>
              <Table columns={columns} data={paginatedLoans} />

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

