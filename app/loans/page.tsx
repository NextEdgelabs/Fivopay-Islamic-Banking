'use client';

import React, { useState, useEffect } from 'react';
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
import { Search, Plus, Edit, Trash2, DollarSign, Users, TrendingUp, AlertCircle, Eye, Download } from 'lucide-react';
import { useLoans } from '@/hooks/useLoans';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useToast } from '@/components/ui/Toast';

export default function LoansPage() {
  const router = useRouter();
  const { loans, loading, error, refetch, filters, setFilters } = useLoans();
  const { deleteLoan } = useLoanMutations();
  const { addToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(loans.length / itemsPerPage);
  const paginatedLoans = loans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (loan: any) => {
    const loanId = loan.id || loan._id;
    const loanIdentifier = loan.loanId || loan._id || loan.id || 'this loan';
    if (confirm(`Are you sure you want to delete loan ${loanIdentifier}?`)) {
      try {
        await deleteLoan(loanId);
        addToast({
          type: 'success',
          message: `Loan ${loanIdentifier} has been deleted successfully`,
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

  const mapApprovalStatus = (approvalStatus?: string): string => {
    debugger;
    if (!approvalStatus) return 'Pending';
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'processing': 'Processing',
    };
    return statusMap[approvalStatus.toLowerCase()] || 'Pending';
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
    { label: 'Loans', href: '/loans' },
  ];

  const columns = [
    {
      key: 'loanId',
      header: 'Loan ID',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-neutral-900">{row.loanId || row._id || row.id || 'N/A'}</p>
          <p className="text-sm text-neutral-500">{row.applicationNumber || '-'}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (value: string, row: any) => {
        // Ensure we get a string value, not an object
        const customerId = typeof row.customerId === 'string' ? row.customerId 
          : typeof row.customerId === 'object' && row.customerId?._id ? row.customerId._id
          : typeof row.userId === 'string' ? row.userId
          : typeof row.userId === 'object' && row.userId?._id ? row.userId._id
          : row.customerId?.toString() || row.userId?.toString() || '';
        
        const customerName = typeof row.customerName === 'string' ? row.customerName
          : typeof row.customerName === 'object' ? row.customerName?.fullName || row.customerName?.name || 'N/A'
          : row.customerName || 'N/A';
        
        return (
          <div>
            <Link
              href={`/customers/${customerId}`}
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              {customerName}
            </Link>
            <div className="text-sm text-neutral-500">{row.customerPhone || '-'}</div>
          </div>
        );
      },
    },
    {
      key: 'loanType',
      header: 'Type',
      render: (value: string, row: any) => {
        // Handle product as string or populated object
        let loanType = value || row.loanType;
        
        if (!loanType && row.product) {
          if (typeof row.product === 'string') {
            loanType = row.product;
          } else if (typeof row.product === 'object') {
            // Extract product name from populated object
            loanType = row.product.productName 
              || row.product.name 
              || row.product.productType 
              || row.product.type
              || 'N/A';
          }
        }
        
        return <Badge variant="neutral">{loanType || 'N/A'}</Badge>;
      },
    },
    {
      key: 'loanAmount',
      header: 'Amount',
      render: (value: number, row: any) => {
        const amount = value ?? row.amount ?? row.loanAmount ?? 0;
        return <div className="font-semibold">₹{amount.toLocaleString('en-IN')}</div>;
      },
    },
    {
      key: 'emiAmount',
      header: 'EMI',
      render: (value: number, row: any) => {
        const emi = value ?? row.emiAmount ?? 0;
        return <div>₹{emi.toLocaleString('en-IN')}</div>;
      },
    },
    {
      key: 'tenure',
      header: 'Tenure',
      render: (value: number, row: any) => {
        const tenure = value ?? row.tenure ?? 0;
        return <div>{tenure} months</div>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string, row: any) => {
        const status = mapApprovalStatus(row.approvalStatus) || 'Pending';
        return getStatusBadge(status);
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => {
        const loanId = row.id || row._id || '';
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/loans/${loanId}`)}}><Eye className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/loans/${loanId}/edit`)}}><Edit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(row)}}><Trash2 className="h-4 w-4" /></Button>
          </div>
        );
      },
    },
  ];
  
  const totalLoanValue = loans.reduce((acc, loan) => acc + (loan.loanAmount || loan.amount || 0), 0);
  const activeLoans = loans.filter(l => l.status === 'Active' || l.approvalStatus === 'approved');

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
          <Button onClick={() => router.push('/loans/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Loan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Loans</p>
                <p className="text-2xl font-bold">{loans.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center"><Users className="h-6 w-6 text-primary-600" /></div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Value</p>
                <p className="text-2xl font-bold">₹{totalLoanValue.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center"><DollarSign className="h-6 w-6 text-success-600" /></div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Loans</p>
                <p className="text-2xl font-bold">{activeLoans.length}</p>
              </div>
              <div className="w-12 h-12 bg-info-100 rounded-stripe flex items-center justify-center"><TrendingUp className="h-6 w-6 text-info-600" /></div>
            </div>
          </Card>
           <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Defaulted Loans</p>
                <p className="text-2xl font-bold">{loans.filter(l => l.status === 'Defaulted').length}</p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-stripe flex items-center justify-center"><AlertCircle className="h-6 w-6 text-error-600" /></div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Search loans by ID, App No, or Customer..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select
              name="status"
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Under Review', label: 'Under Review' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Rejected', label: 'Rejected' },
                { value: 'Disbursed', label: 'Disbursed' },
                { value: 'Active', label: 'Active' },
                { value: 'Closed', label: 'Closed' },
                { value: 'Defaulted', label: 'Defaulted' },
              ]}
            />
            <Select
              name="loanType"
              value={filters.loanType || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, loanType: e.target.value }))}
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
             <Button variant="outline" onClick={() => { /* Implement Export */ }}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {loans.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
              <p className="text-neutral-500">No loans found for the current filters.</p>
            </div>
          ) : (
            <>
              <Table columns={columns} data={paginatedLoans} onRowClick={(row) => router.push(`/loans/${row.id || row._id || ''}`)} />

              {totalPages > 1 && (
                <div className="p-4 border-t flex items-center justify-between">
                   <p className="text-sm text-neutral-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, loans.length)} of {loans.length} loans
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
      </div>
    </DashboardLayout>
  );
}

