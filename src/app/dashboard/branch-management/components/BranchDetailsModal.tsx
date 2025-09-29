'use client';

import {
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
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

interface BranchDetailsModalProps {
  isOpen: boolean;
  branch: Branch | null;
  onClose: () => void;
  onEdit?: (branch: Branch) => void;
  onGenerateReport?: (branch: Branch) => void;
}

export default function BranchDetailsModal({
  isOpen,
  branch,
  onClose,
  onEdit,
  onGenerateReport
}: BranchDetailsModalProps) {
  if (!isOpen || !branch) return null;

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-stripe-text">Branch Details</h3>
          <button
            onClick={onClose}
            className="text-stripe-text-secondary hover:text-stripe-text-secondary"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stripe-text">Branch Name</label>
              <p className="mt-1 text-sm text-stripe-text">{branch.branchName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text">Branch Code</label>
              <p className="mt-1 text-sm text-stripe-text">{branch.branchCode}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text">Address</label>
              <p className="mt-1 text-sm text-stripe-text">{branch.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text">City & State</label>
              <p className="mt-1 text-sm text-stripe-text">{branch.city}, {branch.state}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text">Pincode</label>
              <p className="mt-1 text-sm text-stripe-text">{branch.pincode}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text">Contact</label>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-stripe-text flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {branch.phone}
                </p>
                <p className="text-sm text-stripe-text flex items-center">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  {branch.email}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stripe-text">Branch Manager</label>
              <p className="mt-1 text-sm text-stripe-text">{branch.managerName}</p>
              <p className="text-sm text-stripe-text-secondary">{branch.managerPhone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text">Status</label>
              <p className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(branch.status)}`}>
                  {branch.status}
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text">Established Date</label>
              <p className="mt-1 text-sm text-stripe-text">{branch.establishedDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text">Last Inspection</label>
              <p className="mt-1 text-sm text-stripe-text">{branch.lastInspection}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text">Employee Count</label>
              <p className="mt-1 text-sm text-stripe-text">{branch.employeeCount} employees</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text">Customer Count</label>
              <p className="mt-1 text-sm text-stripe-text">{branch.customerCount.toLocaleString()} customers</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-stripe-border">
          <h4 className="text-lg font-semibold text-stripe-text mb-4">Financial Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-stripe-text">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(branch.totalDeposits)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-stripe-text">Total Loans</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(branch.totalLoans)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stripe-border rounded-lg text-stripe-text hover:bg-stripe-background-light transition-colors"
          >
            Close
          </button>
          {onEdit && (
            <button 
              onClick={() => onEdit(branch)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Branch
            </button>
          )}
          {onGenerateReport && (
            <button 
              onClick={() => onGenerateReport(branch)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 