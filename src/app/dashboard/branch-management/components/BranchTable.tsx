'use client';

import Table, { Column } from '@/app/dashboard/components/Table';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Branch {
  id: string;
  branchCode: string;
  branchName: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  managerName: string;
  managerPhone: string;
  employeeCount: number;
  customerCount: number;
  totalDeposits: number;
  totalLoans: number;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  establishedDate: string;
  lastInspection: string;
}

interface BranchTableProps {
  branches: Branch[];
  onViewBranch: (branch: Branch) => void;
  onEditBranch?: (branch: Branch) => void;
  onGenerateReport?: (branch: Branch) => void;
  onDeleteBranch?: (branch: Branch) => void;
  onSuspendBranch?: (branch: Branch) => void;
  onActivateBranch?: (branch: Branch) => void;
}

export default function BranchTable({ 
  branches, 
  onViewBranch, 
  onEditBranch, 
  onGenerateReport,
  onDeleteBranch,
  onSuspendBranch,
  onActivateBranch
}: BranchTableProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Inactive':
        return 'text-red-600 bg-red-100';
      case 'Under Maintenance':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-stripe-text-secondary bg-stripe-background-light';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'Inactive':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />;
      case 'Under Maintenance':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      default:
        return <CheckCircleIcon className="w-4 h-4 text-stripe-text-secondary" />;
    }
  };
  
  const columns: Column<Branch>[] = [
    {
      accessor: 'branchName',
      header: 'Branch Details',
      render: (branch) => (
        <div>
          <div className="text-sm font-medium text-stripe-text">{branch.branchName}</div>
          <div className="text-sm text-stripe-text-secondary">{branch.branchCode}</div>
        </div>
      ),
    },
    {
      accessor: 'city',
      header: 'Location',
      render: (branch) => (
        <div>
          <div className="text-sm text-stripe-text">{branch.city}, {branch.state}</div>
          <div className="text-sm text-stripe-text-secondary">{branch.pincode}</div>
        </div>
      ),
    },
    {
      accessor: 'managerName',
      header: 'Manager',
      render: (branch) => (
        <div>
          <div className="text-sm font-medium text-stripe-text">{branch.managerName}</div>
          <div className="text-sm text-stripe-text-secondary">{branch.managerPhone}</div>
        </div>
      ),
    },
    {
      accessor: 'customerCount',
      header: 'Performance',
      render: (branch) => (
        <div>
          <div className="text-sm text-stripe-text">{branch.customerCount} customers</div>
          <div className="text-sm text-stripe-text-secondary">{branch.employeeCount} employees</div>
        </div>
      ),
    },
    {
      accessor: 'status',
      header: 'Status',
      render: (branch) => (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(branch.status)}`}>
          {getStatusIcon(branch.status)}
          <span className="ml-1">{branch.status}</span>
        </span>
      ),
    },
  ];

  const renderActions = (branch: Branch) => (
    <div className="flex flex-wrap gap-2">
      <button 
        onClick={() => onViewBranch(branch)}
        className="text-blue-600 hover:text-blue-900"
      >
        View
      </button>
      {onEditBranch && (
        <button 
          onClick={() => onEditBranch(branch)}
          className="text-green-600 hover:text-green-900"
        >
          Edit
        </button>
      )}
      {onGenerateReport && (
        <button 
          onClick={() => onGenerateReport(branch)}
          className="text-yellow-600 hover:text-yellow-900"
        >
          Report
        </button>
      )}
      {onDeleteBranch && (
        <button 
          onClick={() => onDeleteBranch(branch)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      )}
      {onSuspendBranch && branch.status === 'Active' && (
        <button 
          onClick={() => onSuspendBranch(branch)}
          className="text-yellow-600 hover:text-yellow-900"
        >
          Suspend
        </button>
      )}
      {onActivateBranch && branch.status === 'Inactive' && (
        <button 
          onClick={() => onActivateBranch(branch)}
          className="text-green-600 hover:text-green-900"
        >
          Activate
        </button>
      )}
    </div>
  );

  return <Table columns={columns} data={branches} renderActions={renderActions} />;
} 