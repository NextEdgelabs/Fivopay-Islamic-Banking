'use client';

import {
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckCircleIcon,
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

interface BranchStatisticsProps {
  branches: Branch[];
  filteredBranches?: Branch[];
}

export default function BranchStatistics({ branches, filteredBranches }: BranchStatisticsProps) {
  const displayBranches = filteredBranches || branches;
  const uniqueStates = Array.from(new Set(branches.map(branch => branch.state))).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Branches</p>
            <p className="text-3xl font-bold text-gray-900">{displayBranches.length}</p>
            <p className="text-sm text-green-600 mt-1">Across {uniqueStates} states</p>
          </div>
          <BuildingOfficeIcon className="w-12 h-12 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900">
              {displayBranches.reduce((sum, branch) => sum + branch.employeeCount, 0)}
            </p>
            <p className="text-sm text-blue-600 mt-1">Active workforce</p>
          </div>
          <UserGroupIcon className="w-12 h-12 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Customers</p>
            <p className="text-3xl font-bold text-gray-900">
              {displayBranches.reduce((sum, branch) => sum + branch.customerCount, 0).toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-1">+5.2% this month</p>
          </div>
          <UserGroupIcon className="w-12 h-12 text-yellow-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Branches</p>
            <p className="text-3xl font-bold text-gray-900">
              {displayBranches.filter(b => b.status === 'Active').length}
            </p>
            <p className="text-sm text-green-600 mt-1">Operational</p>
          </div>
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </div>
      </div>
    </div>
  );
} 