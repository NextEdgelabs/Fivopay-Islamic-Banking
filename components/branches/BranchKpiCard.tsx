import React from 'react';
import { StatsCard } from '@/components/ui';
import { Users, DollarSign, PiggyBank, Briefcase } from 'lucide-react';

interface BranchKpiCardProps {
  branch: {
    totalCustomers?: number;
    totalLoanValue?: number;
    totalDepositValue?: number;
    totalEmployees?: number;
  };
}

const BranchKpiCard: React.FC<BranchKpiCardProps> = ({ branch }) => {
  const totalCustomers = branch.totalCustomers || 0;
  const totalLoanValue = branch.totalLoanValue || 0;
  const totalDepositValue = branch.totalDepositValue || 0;
  const totalEmployees = branch.totalEmployees || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Customers"
        value={totalCustomers.toString()}
        icon={<Users className="h-6 w-6 text-primary-500" />}
      />
      <StatsCard
        title="Total Loan Value"
        value={`₹${totalLoanValue.toLocaleString('en-IN')}`}
        icon={<DollarSign className="h-6 w-6 text-success-500" />}
      />
      <StatsCard
        title="Total Deposit Value"
        value={`₹${totalDepositValue.toLocaleString('en-IN')}`}
        icon={<PiggyBank className="h-6 w-6 text-warning-500" />}
      />
      <StatsCard
        title="Total Employees"
        value={totalEmployees.toString()}
        icon={<Briefcase className="h-6 w-6 text-info-500" />}
      />
    </div>
  );
};

export default BranchKpiCard;
