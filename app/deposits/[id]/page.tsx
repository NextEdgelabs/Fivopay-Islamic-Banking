'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Badge, Breadcrumbs, Skeleton, Tabs } from '@/components/ui';
import { Edit, Trash2, XCircle, CreditCard, FileText } from 'lucide-react';
import { useDeposit } from '@/hooks/useDeposit';
import { useDepositMutations } from '@/hooks/useDepositMutations';
import { useToast } from '@/components/ui/Toast';

export default function ViewDepositPage() {
  const params = useParams();
  const router = useRouter();
  const depositId = params.id as string;
  const { deposit, loading, error } = useDeposit(depositId);
  const { deleteDeposit, closeDeposit } = useDepositMutations();
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (!deposit) return;
    if (confirm(`Are you sure you want to delete deposit ${deposit.depositId}?`)) {
      try {
        await deleteDeposit(deposit.id);
        addToast({ type: 'success', message: 'Deposit deleted successfully' });
        router.push('/deposits');
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to delete deposit' });
      }
    }
  };

  const handleClose = async () => {
    if (!deposit) return;
    if (confirm(`Close deposit ${deposit.depositId}?`)) {
      try {
        await closeDeposit(deposit.id);
        addToast({ type: 'success', message: 'Deposit closed successfully' });
        window.location.reload();
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to close deposit' });
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
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !deposit) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="p-6 text-center text-error-500">
            <p>Error: {error || 'Deposit not found'}</p>
            <Button onClick={() => router.push('/deposits')} className="mt-4">
              Back to Deposits
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
      icon: <CreditCard className="h-4 w-4" />,
      content: <DepositOverviewTab deposit={deposit} getStatusBadge={getStatusBadge} />,
    },
    {
      id: 'transactions',
      label: 'Transaction History',
      icon: <FileText className="h-4 w-4" />,
      content: <div className="p-6 text-center text-neutral-500">Transaction history feature coming soon.</div>,
      disabled: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Deposits', href: '/deposits' },
          { label: deposit.depositId },
        ]} />
        
        {/* Standard Header Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">{deposit.depositId}</h1>
              <Link href={`/customers/${deposit.customerId}`} className="text-primary-600 hover:underline">
                {deposit.customerName}
              </Link>
            </div>
            <div className="flex gap-2 flex-wrap">
              {deposit.status === 'Active' && (
                <Button variant="danger" onClick={handleClose}><XCircle className="mr-2 h-4 w-4" />Close Deposit</Button>
              )}
              <Button variant="outline" onClick={() => router.push(`/deposits/${deposit.id}/edit`)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
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

const DepositOverviewTab = ({ deposit, getStatusBadge }: { deposit: any, getStatusBadge: (status: string) => React.ReactNode }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
    <div className="lg:col-span-2 space-y-6">
      {/* Deposit Details Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Deposit Details</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Deposit Type</label>
                  <p className="mt-1"><Badge variant="neutral">{deposit.depositType}</Badge></p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Status</label>
                  <p className="mt-1">{getStatusBadge(deposit.status)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Current Balance</label>
                  <p className="mt-1 text-2xl font-bold text-primary-600">
                    ₹{deposit.currentBalance.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Profit Rate</label>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">{deposit.interestRate}%</p>
                </div>
                {deposit.maturityAmount && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Maturity Amount</label>
                    <p className="mt-1 text-lg font-semibold text-success-600">
                      ₹{deposit.maturityAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
                {deposit.tenure && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Tenure</label>
                    <p className="mt-1 text-neutral-900">{deposit.tenure} months</p>
                  </div>
                )}
              </div>
            </Card>
      {/* Customer Information Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
        <Link href={`/customers/${deposit.customerId}`} className="block mt-1 text-primary-600 hover:text-primary-700 font-medium">
          {deposit.customerName}
        </Link>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Phone</label>
            <p className="mt-1 text-neutral-900">{deposit.customerPhone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <p className="mt-1 text-neutral-900">{deposit.customerEmail}</p>
          </div>
        </div>
      </Card>
      {/* Financial Summary Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-neutral-700">Total Deposits</label>
            <p className="mt-1 text-lg font-semibold text-success-600">
              ₹{deposit.totalDeposits.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Total Withdrawals</label>
            <p className="mt-1 text-lg font-semibold text-warning-600">
              ₹{deposit.totalWithdrawals.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Profit Earned</label>
            <p className="mt-1 text-lg font-semibold text-primary-600">
              ₹{deposit.interestEarned.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </Card>
    </div>
    <div className="space-y-6">
      {/* Important Dates Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Important Dates</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-neutral-700">Opening Date</label>
            <p className="mt-1 text-neutral-900">
              {new Date(deposit.openingDate).toLocaleDateString('en-IN')}
            </p>
          </div>
          {deposit.maturityDate && (
            <div>
              <label className="text-sm font-medium text-neutral-700">Maturity Date</label>
              <p className="mt-1 text-neutral-900">
                {new Date(deposit.maturityDate).toLocaleDateString('en-IN')}
              </p>
            </div>
          )}
          {deposit.lastTransactionDate && (
            <div>
              <label className="text-sm font-medium text-neutral-700">Last Transaction</label>
              <p className="mt-1 text-neutral-900">
                {new Date(deposit.lastTransactionDate).toLocaleDateString('en-IN')}
              </p>
            </div>
          )}
        </div>
      </Card>
      {/* Nominee Details Card */}
      {deposit.nomineeName && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Nominee Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-700">Name</label>
              <p className="mt-1 text-neutral-900">{deposit.nomineeName}</p>
            </div>
            {deposit.nomineeRelation && (
              <div>
                <label className="text-sm font-medium text-neutral-700">Relation</label>
                <p className="mt-1 text-neutral-900">{deposit.nomineeRelation}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  </div>
);

