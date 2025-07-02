/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import {
  BanknotesIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useDepositContext, NewAccountFormData, TransactionFormData, DepositAccount } from './context/DepositContext';

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

export default function DepositManagementPage() {
  const {
    depositAccounts,
    transactions,
    addDepositAccount,
    addTransaction,
    updateAccountStatus,
    deleteAccount,
    updateAccountBalance,
    getAccountByNumber
  } = useDepositContext();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAccount, setSelectedAccount] = useState<DepositAccount | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    accountId: '', 
    customerName: '',
    action: '' as 'delete' | 'close' | 'mature'
  });

  // Add new state variables
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState<NewAccountFormData>({
    customerName: '',
    accountType: 'Mudarabah Fixed Deposit',
    initialDeposit: 0,
    profitRate: 7.2,
    tenure: { years: 0, months: 0 }
  });
  const [transactionForm, setTransactionForm] = useState<TransactionFormData>({
    accountNumber: '',
    transactionType: 'Deposit',
    amount: 0,
    description: '',
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
  const openDeleteConfirm = (id: string, name: string, action: 'delete' | 'close' | 'mature') => {
    setConfirmDialog({ isOpen: true, accountId: id, customerName: name, action });
  };

  const handleConfirmAction = () => {
    const { action, accountId, customerName } = confirmDialog;
    if (action === 'delete') {
      deleteAccount(accountId);
      addToast(`Account for ${customerName} has been deleted successfully`, 'success');
    } else if (action === 'close') {
      updateAccountStatus(accountId, 'Closed');
      addToast(`Account for ${customerName} has been closed successfully`, 'success');
    } else if (action === 'mature') {
      updateAccountStatus(accountId, 'Matured');
      addToast(`Account for ${customerName} has been matured successfully`, 'success');
    }
    setConfirmDialog({ isOpen: false, accountId: '', customerName: '', action: 'delete' });
  };

  // Add new functions for form handling
  const handleNewAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountForm.customerName || newAccountForm.initialDeposit <= 0) {
      addToast('Please fill in all required fields with valid values', 'error');
      return;
    }
    addDepositAccount(newAccountForm);
    addToast(`New ${newAccountForm.accountType} account created for ${newAccountForm.customerName} successfully!`, 'success');
    setShowNewAccountModal(false);
    setNewAccountForm({
      customerName: '',
      accountType: 'Mudarabah Fixed Deposit',
      initialDeposit: 0,
      profitRate: 7.2,
      tenure: { years: 0, months: 0 }
    });
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionForm.accountNumber || transactionForm.amount <= 0) {
      addToast('Please fill in all required fields with valid values', 'error');
      return;
    }
    const account = getAccountByNumber(transactionForm.accountNumber);
    if (!account) {
      addToast('Account not found', 'error');
      return;
    }
    addTransaction(transactionForm);
    addToast(`${transactionForm.transactionType} of ₹${transactionForm.amount.toLocaleString()} processed successfully!`, 'success');
    setShowTransactionModal(false);
    setTransactionForm({
      accountNumber: '',
      transactionType: 'Deposit',
      amount: 0,
      description: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Matured':
        return 'text-blue-600 bg-blue-100';
      case 'Closed':
        return 'text-gray-600 bg-gray-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Deposit':
        return <ArrowDownIcon className="w-4 h-4 text-green-600" />;
      case 'Withdrawal':
        return <ArrowUpIcon className="w-4 h-4 text-red-600" />;
      case 'Profit Credit':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />;
      case 'Maturity':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      default:
        return <CurrencyRupeeIcon className="w-4 h-4 text-gray-600" />;
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deposit Management</h1>
          <p className="text-gray-600 mt-1">Manage Islamic banking deposit products and accounts</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowNewAccountModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Account</span>
          </button>
          <button
            onClick={() => setShowTransactionModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <BanknotesIcon className="w-5 h-5" />
            <span>Process Transaction</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deposits</p>
              <p className="text-3xl font-bold text-gray-900">₹18.7 Cr</p>
              <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
            </div>
            <BanknotesIcon className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Accounts</p>
              <p className="text-3xl font-bold text-gray-900">2,847</p>
              <p className="text-sm text-green-600 mt-1">+8.3% from last month</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Profit Rate</p>
              <p className="text-3xl font-bold text-gray-900">6.8%</p>
              <p className="text-sm text-blue-600 mt-1">Sharia Compliant</p>
            </div>
            <ArrowTrendingUpIcon className="w-12 h-12 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maturing This Month</p>
              <p className="text-3xl font-bold text-gray-900">₹2.3 Cr</p>
              <p className="text-sm text-yellow-600 mt-1">23 accounts</p>
            </div>
            <CalendarIcon className="w-12 h-12 text-red-600" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'accounts', name: 'Deposit Accounts', icon: BanknotesIcon },
              { id: 'transactions', name: 'Recent Transactions', icon: CurrencyRupeeIcon },
              { id: 'maturing', name: 'Maturing Accounts', icon: CalendarIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Deposit Type Distribution */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Deposit Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Mudarabah Fixed Deposits</span>
                      <span className="text-sm font-bold text-gray-900">65% (₹12.2 Cr)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Mudarabah Recurring Deposits</span>
                      <span className="text-sm font-bold text-gray-900">25% (₹4.7 Cr)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Wadiah Savings</span>
                      <span className="text-sm font-bold text-gray-900">10% (₹1.8 Cr)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Monthly Growth */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Growth</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">New Deposits</p>
                        <p className="text-sm text-gray-600">January 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+₹2.4 Cr</p>
                        <p className="text-sm text-gray-600">145 accounts</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Profit Distributed</p>
                        <p className="text-sm text-gray-600">December 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">₹85.2 L</p>
                        <p className="text-sm text-gray-600">1,234 accounts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deposit Accounts Tab */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    className="border border-gray-300 rounded-lg px-3 py-2 w-64 text-gray-700"
                  />
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700">
                    <option>All Types</option>
                    <option>Mudarabah Fixed Deposit</option>
                    <option>Mudarabah Recurring Deposit</option>
                    <option>Wadiah Savings</option>
                  </select>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Export Data
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deposit Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Maturity
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
                    {depositAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{account.customerName}</div>
                            <div className="text-sm text-gray-500">{account.accountNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{account.depositType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(account.currentBalance)}</div>
                            <div className="text-sm text-gray-500">Principal: {formatCurrency(account.principalAmount)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {account.profitRate > 0 ? `${account.profitRate}%` : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{account.maturityDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(account.status)}`}>
                            {account.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedAccount(account);
                              setShowAccountModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-900">Edit</button>
                          <button className="text-yellow-600 hover:text-yellow-900">Statement</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <div className="flex space-x-3">
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                  />
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700">
                    <option>All Types</option>
                    <option>Deposit</option>
                    <option>Withdrawal</option>
                    <option>Profit Credit</option>
                    <option>Maturity</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-gray-900">{transaction.customerName}</p>
                          <p className="text-sm text-gray-600">
                            {transaction.type} • {transaction.accountNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                          <p className="text-sm text-gray-600">{transaction.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maturing Accounts Tab */}
          {activeTab === 'maturing' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Accounts Maturing Soon</h3>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  Send Maturity Notices
                </button>
              </div>

              <div className="grid gap-4">
                {depositAccounts
                  .filter(account => account.status === 'Active' && new Date(account.maturityDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
                  .map((account) => (
                    <div key={account.id} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                          <div>
                            <p className="font-medium text-gray-900">{account.customerName}</p>
                            <p className="text-sm text-gray-600">
                              {account.depositType} • {account.accountNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatCurrency(account.currentBalance)}</p>
                          <p className="text-sm text-yellow-600">Matures: {account.maturityDate}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                            Renew
                          </button>
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                            Withdraw
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Details Modal */}
      {showAccountModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
              <button
                onClick={() => setShowAccountModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedAccount.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <p className="mt-1 text-sm text-gray-900">{selectedAccount.accountNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deposit Type</label>
                <p className="mt-1 text-sm text-gray-900">{selectedAccount.depositType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAccount.status)}`}>
                    {selectedAccount.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Principal Amount</label>
                <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedAccount.principalAmount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Balance</label>
                <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedAccount.currentBalance)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profit Rate</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAccount.profitRate > 0 ? `${selectedAccount.profitRate}%` : 'N/A (Wadiah Account)'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Maturity Date</label>
                <p className="mt-1 text-sm text-gray-900">{selectedAccount.maturityDate}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAccountModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Generate Statement
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Process Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Account Modal */}
      {showNewAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Account</h3>
              <button
                onClick={() => setShowNewAccountModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleNewAccountSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newAccountForm.customerName}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, customerName: e.target.value })}
                  className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select
                  value={newAccountForm.accountType}
                  onChange={(e) => setNewAccountForm({ 
                    ...newAccountForm, 
                    accountType: e.target.value as NewAccountFormData['accountType']
                  })}
                  className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Mudarabah Fixed Deposit">Mudarabah Fixed Deposit</option>
                  <option value="Mudarabah Recurring Deposit">Mudarabah Recurring Deposit</option>
                  <option value="Wadiah Savings">Wadiah Savings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {newAccountForm.accountType === 'Mudarabah Recurring Deposit' ? 'Monthly Deposit' : 'Initial Deposit'}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newAccountForm.initialDeposit}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, initialDeposit: Number(e.target.value) })}
                  className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {newAccountForm.accountType !== 'Wadiah Savings' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profit Rate (%)</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min="0"
                      max="15"
                      value={newAccountForm.profitRate}
                      onChange={(e) => setNewAccountForm({ ...newAccountForm, profitRate: Number(e.target.value) })}
                      className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tenure (Years)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={newAccountForm.tenure.years}
                        onChange={(e) => setNewAccountForm({
                          ...newAccountForm,
                          tenure: { 
                            years: Number(e.target.value),
                            months: newAccountForm.tenure.months
                          }
                        })}
                        className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tenure (Months)</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={newAccountForm.tenure.months}
                        onChange={(e) => setNewAccountForm({
                          ...newAccountForm,
                          tenure: {
                            years: newAccountForm.tenure.years,
                            months: Number(e.target.value)
                          }
                        })}
                        className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewAccountModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Process Transaction</h3>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleTransactionSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input
                  type="text"
                  required
                  value={transactionForm.accountNumber}
                  onChange={(e) => setTransactionForm({ ...transactionForm, accountNumber: e.target.value })}
                  className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                <select
                  value={transactionForm.transactionType}
                  onChange={(e) => setTransactionForm({ 
                    ...transactionForm, 
                    transactionType: e.target.value as TransactionFormData['transactionType']
                  })}
                  className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Deposit">Deposit</option>
                  <option value="Withdrawal">Withdrawal</option>
                  <option value="Profit Credit">Profit Credit</option>
                  <option value="Maturity">Maturity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({ ...transactionForm, amount: Number(e.target.value) })}
                  className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                  rows={3}
                  className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter transaction description"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTransactionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Process Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, accountId: '', customerName: '', action: 'delete' })}
        onConfirm={handleConfirmAction}
        title={`Confirm ${confirmDialog.action}`}
        message={`Are you sure you want to ${confirmDialog.action} the account for ${confirmDialog.customerName}? This action cannot be undone.`}
      />
    </div>
  );
}
