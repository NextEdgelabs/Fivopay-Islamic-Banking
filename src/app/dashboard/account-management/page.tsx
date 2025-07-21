"use client";
import { useState } from "react";
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
  PlusIcon,
  XMarkIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useAccountContext } from './context/AccountContext';

// Toast notification state
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Toast component
const Toast = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const bgColor = toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}>
      <span>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="ml-4 text-white hover:text-gray-200">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

// Confirmation dialog component
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AccountManagementPage() {
  const { accounts, deleteAccount, updateAccountStatus } = useAccountContext();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    accountId: '', 
    accountName: '',
    action: '' as 'delete' | 'suspend' | 'activate'
  });

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Confirmation dialog functions
  const openConfirm = (id: string, name: string, action: 'delete' | 'suspend' | 'activate') => {
    setConfirmDialog({ isOpen: true, accountId: id, accountName: name, action });
  };

  const handleConfirmAction = () => {
    const { action, accountName } = confirmDialog;
    
    if (action === 'delete') {
      deleteAccount(confirmDialog.accountId);
      addToast(`Account "${accountName}" has been deleted successfully`, 'success');
    } else if (action === 'suspend') {
      updateAccountStatus(confirmDialog.accountId, 'Suspended');
      addToast(`Account "${accountName}" has been suspended successfully`, 'success');
    } else if (action === 'activate') {
      updateAccountStatus(confirmDialog.accountId, 'Active');
      addToast(`Account "${accountName}" has been activated successfully`, 'success');
    }
    
    setConfirmDialog({ isOpen: false, accountId: '', accountName: '', action: 'delete' });
  };

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
              <p className="text-sm text-slate-600">Create new customer accounts with Ethical banking compliance</p>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {account.status === 'Active' && (
                        <button 
                          onClick={() => openConfirm(account.id, account.customerName, 'suspend')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Suspend
                        </button>
                      )}
                      {account.status === 'Suspended' && (
                        <button 
                          onClick={() => openConfirm(account.id, account.customerName, 'activate')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Activate
                        </button>
                      )}
                      <button 
                        onClick={() => openConfirm(account.id, account.customerName, 'delete')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, accountId: '', accountName: '', action: 'delete' })}
        onConfirm={handleConfirmAction}
        title={`Confirm ${confirmDialog.action}`}
        message={`Are you sure you want to ${confirmDialog.action} the account "${confirmDialog.accountName}"? This action cannot be undone.`}
      />
    </div>
  );
}
