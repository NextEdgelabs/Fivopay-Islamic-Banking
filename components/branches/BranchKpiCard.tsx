import React from 'react';
import { useBranch } from '@/hooks/useBranch';
import { StatsCard, Skeleton } from '@/components/ui';
import { Users, DollarSign, PiggyBank, UserPlus } from 'lucide-react';

interface BranchKpiCardProps {
  branchId: string;
}

const BranchKpiCard: React.FC<BranchKpiCardProps> = ({ branchId }) => {
  const { kpis, loading, error } = useBranch(branchId);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (error || !kpis) {
    return <div className="text-error-500">Could not load branch performance data.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Total Customers"
        value={kpis.totalCustomers.toString()}
        icon={<Users className="h-6 w-6 text-primary-500" />}
      />
      <StatsCard
        label="Total Loan Value"
        value={`₹${kpis.totalLoanValue.toLocaleString('en-IN')}`}
        icon={<DollarSign className="h-6 w-6 text-success-500" />}
      />
      <StatsCard
        label="Total Deposit Value"
        value={`₹${kpis.totalDepositValue.toLocaleString('en-IN')}`}
        icon={<PiggyBank className="h-6 w-6 text-warning-500" />}
      />
      <StatsCard
        label="New Members (30d)"
        value={`+${kpis.newMembersThisMonth}`}
        icon={<UserPlus className="h-6 w-6 text-info-500" />}
      />
    </div>
  );
};

export default BranchKpiCard;
