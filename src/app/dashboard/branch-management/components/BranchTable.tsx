'use client';

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
}

export default function BranchTable({ 
  branches, 
  onViewBranch, 
  onEditBranch, 
  onGenerateReport 
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
        return 'text-gray-600 bg-gray-100';
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
        return <CheckCircleIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Branch Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manager
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Performance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {branches.map((branch) => (
            <tr key={branch.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{branch.branchName}</div>
                  <div className="text-sm text-gray-500">{branch.branchCode}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm text-gray-900">{branch.city}, {branch.state}</div>
                  <div className="text-sm text-gray-500">{branch.pincode}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{branch.managerName}</div>
                  <div className="text-sm text-gray-500">{branch.managerPhone}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm text-gray-900">{branch.customerCount} customers</div>
                  <div className="text-sm text-gray-500">{branch.employeeCount} employees</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(branch.status)}`}>
                  {getStatusIcon(branch.status)}
                  <span className="ml-1">{branch.status}</span>
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 