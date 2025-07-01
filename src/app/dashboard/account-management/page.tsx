"use client";
import Link from "next/link";
import { 
  CreditCardIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  BanknotesIcon,
  EyeIcon,
  PencilIcon,
  ShieldCheckIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

interface Account {
  id: string;
  accountNumber: string;
  customerName: string;
  accountType: 'Savings' | 'Current' | 'Investment' | 'Business';
  status: 'Active' | 'Pending' | 'Suspended' | 'Closed';
  balance: number;
  openingDate: string;
  kycStatus: 'Completed' | 'Pending' | 'Under Review' | 'Rejected';
  branch: string;
  riskRating: 'Low' | 'Medium' | 'High';
}

export default function AccountManagementPage() {

  const accounts: Account[] = [
    {
      id: '1',
      accountNumber: 'FP001234567890',
      customerName: 'Ahmed Hassan',
      accountType: 'Savings',
      status: 'Active',
      balance: 125000,
      openingDate: '2024-01-15',
      kycStatus: 'Completed',
      branch: 'Mumbai Central',
      riskRating: 'Low'
    },
    {
      id: '2',
      accountNumber: 'FP001234567891',
      customerName: 'Fatima Al-Zahra',
      accountType: 'Business',
      status: 'Active',
      balance: 850000,
      openingDate: '2024-01-10',
      kycStatus: 'Completed',
      branch: 'Delhi Main',
      riskRating: 'Low'
    },
    {
      id: '3',
      accountNumber: 'FP001234567892',
      customerName: 'Mohammad Ali',
      accountType: 'Current',
      status: 'Pending',
      balance: 0,
      openingDate: '2024-01-20',
      kycStatus: 'Under Review',
      branch: 'Bangalore Tech',
      riskRating: 'Medium'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const displayAccounts = accounts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Account Management</h1>
          <p className="text-slate-600">Manage customer accounts and banking services</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/account-management/account-creation"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Account</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/dashboard/account-management/account-creation"
          className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-shadow group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <PlusIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-slate-900">Account Creation</h3>
              <p className="text-sm text-slate-600">Create new customer accounts with Islamic banking compliance</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/dashboard/account-management/account-verification"
          className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-shadow group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-slate-900">Account Verification</h3>
              <p className="text-sm text-slate-600">Verify KYC documents and approve customer accounts</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{accounts.length}</p>
              <p className="text-sm font-medium text-slate-600">Total Accounts</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{accounts.filter(acc => acc.status === 'Active').length}</p>
              <p className="text-sm font-medium text-slate-600">Active Accounts</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{accounts.filter(acc => acc.status === 'Pending').length}</p>
              <p className="text-sm font-medium text-slate-600">Pending Approval</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">₹{(accounts.reduce((sum, acc) => sum + acc.balance, 0) / 100000).toFixed(1)}L</p>
              <p className="text-sm font-medium text-slate-600">Total Balance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white shadow-lg rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type & Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{account.customerName}</div>
                        <div className="text-sm text-gray-500">{account.accountNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{account.accountType}</div>
                    <div className="text-sm text-gray-500">₹{account.balance.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(account.status)}`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getKycBadge(account.kycStatus)}`}>
                      {account.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
