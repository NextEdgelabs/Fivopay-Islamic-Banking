'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Breadcrumbs,
  Skeleton,
  Tabs,
} from '@/components/ui';
import { Edit, Trash2, DollarSign, User, Check, X, FileText } from 'lucide-react';
import { useLoan } from '@/hooks/useLoan';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useToast } from '@/components/ui/Toast';

export default function ViewLoanPage() {
  const params = useParams();
  const router = useRouter();
  const loanId = params.id as string;
  const { loan, loading, error } = useLoan(loanId);
  const { deleteLoan, approveLoan, rejectLoan, disburseLoan } = useLoanMutations();
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (!loan) return;

    if (confirm(`Are you sure you want to delete loan ${loan.loanId}?`)) {
      try {
        await deleteLoan(loan._id || '');
        addToast({
          type: 'success',
          message: `Loan ${loan.loanId} has been deleted successfully`,
        });
        router.push('/loans');
      } catch (err) {
        addToast({
          type: 'error',
          message: 'Failed to delete loan',
        });
      }
    }
  };

  const handleApprove = async () => {
    if (!loan) return;
    const rate = prompt('Enter profit rate (%):');
    if (rate) {
      try {
        await approveLoan(loan._id || '', 'Admin', parseFloat(rate));
        addToast({ type: 'success', message: 'Loan approved successfully' });
        window.location.reload();
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to approve loan' });
      }
    }
  };

  const handleReject = async () => {
    if (!loan) return;
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await rejectLoan(loan._id || '', 'Admin', reason);
        addToast({ type: 'success', message: 'Loan rejected' });
        window.location.reload();
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to reject loan' });
      }
    }
  };

  const handleDisburse = async () => {
    if (!loan) return;
    if (confirm(`Disburse loan ${loan.loanId}?`)) {
      try {
        await disburseLoan(loan._id || '');
        addToast({ type: 'success', message: 'Loan disbursed successfully' });
        window.location.reload();
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to disburse loan' });
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
      Processing: 'neutral',
    };
    return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !loan) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="p-6 text-center text-error-500">
            <p>Error: {error || 'Loan not found'}</p>
            <Button onClick={() => router.push('/loans')} className="mt-4">
              Back to Loans
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const TABS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <DollarSign className="h-4 w-4" />,
      content: <LoanOverviewTab loan={loan} getStatusBadge={getStatusBadge} />,
    },
    {
      id: 'repayment',
      label: 'Repayment Schedule',
      icon: <FileText className="h-4 w-4" />,
      content: <div className="p-6 text-center text-neutral-500">Repayment schedule feature coming soon.</div>,
      disabled: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Loans', href: '/loans' },
          { label: loan.loanId || '' },
        ]} />

        {/* Standard Header Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">{loan.loanId || ''}</h1>
              <Link href={`/customers/${loan.customerId}`} className="text-primary-600 hover:underline">
                {loan.customerName}
              </Link>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Action Buttons */}
              {loan.approvalStatus === 'pending' || (loan.approvalStatus as string) === 'processing' && (
                <>
                  <Button variant="primary" onClick={handleApprove}><Check className="mr-2 h-4 w-4" />Approve</Button>
                  <Button variant="danger" onClick={handleReject}><X className="mr-2 h-4 w-4" />Reject</Button>
                </>
              )}
              {loan.approvalStatus === 'approved' && (
                <Button variant="primary" onClick={handleDisburse}>Disburse</Button>
              )}
              {/* {(loan.approvalStatus as string) === 'processing' && (
                <>
                  <Button variant="primary" onClick={handleApprove}><Check className="mr-2 h-4 w-4" />Approve</Button>
                  <Button variant="danger" onClick={handleReject}><X className="mr-2 h-4 w-4" />Reject</Button>
                  <Button variant="primary" onClick={handleDisburse}>Disburse</Button>
                </>
              )} */}
              <Button variant="outline" onClick={() => router.push(`/loans/${loan._id || ''}/edit`)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
              <Button variant="danger" onClick={handleDelete}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </div>
          </div>
        </Card>

        {/* Top-level Tabs */}
        <Tabs tabs={TABS} defaultTab="overview" />
      </div>
    </DashboardLayout>
  );
}

const LoanOverviewTab = ({ loan, getStatusBadge }: { loan: any, getStatusBadge: (status: string) => React.ReactNode }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
    <div className="lg:col-span-2 space-y-6">
      {/* Loan Details Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Loan Details</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Loan Type</label>
                  <p className="mt-1"><Badge variant="neutral">{loan.loanType || ''}</Badge></p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Status</label>
                  <p className="mt-1">{getStatusBadge(loan.approvalStatus)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Loan Channel</label>
                  <p className="mt-1"><Badge variant={(loan.loanSource || 'online') === 'online' ? 'primary' : 'neutral'}>{(loan.loanSource || 'online') === 'online' ? 'Online' : 'Walk-in'}</Badge></p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Loan Amount</label>
                  <p className="mt-1 text-2xl font-bold text-primary-600">
                    ₹{loan.loanAmount?.toLocaleString('en-IN') || ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">EMI Amount</label>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    ₹{loan.emiAmount?.toLocaleString('en-IN') || ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Profit Rate</label>
                  <p className="mt-1 text-neutral-900">{loan.interestRate?.toString() || ''}% p.a.</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Tenure</label>
                  <p className="mt-1 text-neutral-900">{loan.tenure?.toString() || ''} months</p>
                </div>
              </div>
            </Card>
      {/* Customer Information Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Customer Name</label>
                  <Link
                    href={`/customers/${loan.customerId}`}
                    className="block mt-1 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {loan.customerName}
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Phone</label>
                    <p className="mt-1 text-neutral-900">{loan.phone || ''}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Email</label>
                    <p className="mt-1 text-neutral-900">{loan.email || ''}</p>
                  </div>
                </div>
              </div>
            </Card>
      {/* Financial Details Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Financial Details</h2>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Principal</label>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    ₹{loan.principalAmount?.toLocaleString('en-IN') || ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Outstanding</label>
                  <p className="mt-1 text-lg font-semibold text-warning-600">
                    ₹{loan.outstandingAmount?.toLocaleString('en-IN') || ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Paid</label>
                  <p className="mt-1 text-lg font-semibold text-success-600">
                    ₹{loan.paidAmount?.toLocaleString('en-IN') || ''}
                  </p>
                </div>
              </div>
            </Card>
    </div>
    <div className="space-y-6">
      {/* Branch Details Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Branch & Processing</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Branch Name</label>
                  <p className="mt-1 text-neutral-900">{loan.branchName}</p>
                </div>
                {loan.processedBy && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Processed By</label>
                    <p className="mt-1 text-neutral-900">{loan.processedBy}</p>
                  </div>
                )}
                {loan.approvedBy && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Approved By</label>
                    <p className="mt-1 text-neutral-900">{loan.approvedBy}</p>
                  </div>
                )}
              </div>
            </Card>
      {/* Important Dates Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Important Dates</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Application Date</label>
                  <p className="mt-1 text-neutral-900">
                    {new Date(loan.applicationDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                {loan.approvalDate && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Approval Date</label>
                    <p className="mt-1 text-neutral-900">
                      {new Date(loan.approvalDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
                {loan.disbursementDate && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Disbursement Date</label>
                    <p className="mt-1 text-neutral-900">
                      {new Date(loan.disbursementDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
                {loan.maturityDate && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Maturity Date</label>
                    <p className="mt-1 text-neutral-900">
                      {new Date(loan.maturityDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            </Card>
    </div>
  </div>
);

