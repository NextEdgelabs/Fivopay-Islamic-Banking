/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useCashContext, DigitalWallet } from "../context/CashContext";
import {
  WalletIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

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

export default function DigitalWalletPage() {
  const {
    wallets,
    addWallet,
    updateWalletStatus,
    deleteWallet,
  } = useCashContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState<DigitalWallet | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    walletId: '',
    customerName: '',
    action: ''
  });
  const [formData, setFormData] = useState({
    customerName: '',
    initialBalance: 0,
    branchId: ''
  });

  const filteredWallets = wallets.filter((wallet: DigitalWallet) => {
    const matchesSearch = wallet.customerName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      wallet.walletNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || wallet.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalBalance = wallets.reduce((sum: number, wallet: DigitalWallet) => sum + wallet.balance, 0);
  const activeWallets = wallets.filter((w: DigitalWallet) => w.status.toLowerCase() === "active").length;

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev: Toast[]) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };
  const removeToast = (id: string) => {
    setToasts((prev: Toast[]) => prev.filter((toast: Toast) => toast.id !== id));
  };

  // Confirmation dialog functions
  const openConfirm = (id: string, name: string, action: 'delete' | 'suspend' | 'activate') => {
    setConfirmDialog({ isOpen: true, walletId: id, customerName: name, action });
  };
  const handleConfirmAction = () => {
    const { action, walletId, customerName } = confirmDialog;
    if (action === 'delete') {
      deleteWallet(walletId);
      addToast(`Wallet for ${customerName} has been deleted successfully`, 'success');
    } else if (action === 'suspend') {
      updateWalletStatus(walletId, 'Suspended');
      addToast(`Wallet for ${customerName} has been suspended successfully`, 'success');
    } else if (action === 'activate') {
      updateWalletStatus(walletId, 'Active');
      addToast(`Wallet for ${customerName} has been activated successfully`, 'success');
    }
    setConfirmDialog({ isOpen: false, walletId: '', customerName: '', action: '' });
  };

  // Create wallet form handling
  const handleFormChange = (field: 'customerName' | 'initialBalance' | 'branchId', value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleCreateWallet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      addToast('Customer name is required', 'error');
      return;
    }
    if (formData.initialBalance < 0) {
      addToast('Initial balance cannot be negative', 'error');
      return;
    }
    if (!formData.branchId.trim()) {
      addToast('Branch ID is required', 'error');
      return;
    }
    addWallet(formData);
    addToast('Wallet created successfully', 'success');
    setShowCreateModal(false);
    setFormData({ customerName: '', initialBalance: 0, branchId: '' });
  };

  const handleViewDetails = (wallet: DigitalWallet) => {
    setSelectedWallet(wallet);
    setShowDetailsModal(true);
  };

  const recentTransactions = [
    {
      id: "1",
      type: "deposit",
      amount: 5000,
      timestamp: "2024-01-15T10:30:00Z",
      description: "Cash deposit",
    },
    {
      id: "2",
      type: "withdrawal",
      amount: 2000,
      timestamp: "2024-01-15T09:15:00Z",
      description: "ATM withdrawal",
    },
    {
      id: "3",
      type: "transfer",
      amount: 10000,
      timestamp: "2024-01-14T16:45:00Z",
      description: "Transfer to account",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Wallet Management</h1>
          <p className="text-gray-600">
            Manage digital wallets, monitor balances, and track transactions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Wallet</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Wallets</p>
              <p className="text-2xl font-bold text-gray-900">{wallets.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <WalletIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{showBalance ? totalBalance.toLocaleString() : "••••••"}
              </p>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="bg-green-500 p-3 rounded-lg text-white"
            >
              {showBalance ? (
                <EyeSlashIcon className="h-6 w-6" />
              ) : (
                <EyeIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Wallets</p>
              <p className="text-2xl font-bold text-gray-900">{activeWallets}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <ArrowUpIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name or wallet number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Wallet List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWallets.map((wallet) => (
                <tr key={wallet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {wallet.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(wallet.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {wallet.walletNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{showBalance ? wallet.balance.toLocaleString() : "••••••"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        wallet.status.toLowerCase() === "active"
                          ? "bg-green-100 text-green-800"
                          : wallet.status.toLowerCase() === "suspended"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(wallet.lastTransaction).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(wallet)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Transactions
                      </button>
                      {wallet.status.toLowerCase() === "active" ? (
                        <button 
                          onClick={() => openConfirm(wallet.id, wallet.customerName, 'suspend')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button 
                          onClick={() => openConfirm(wallet.id, wallet.customerName, 'activate')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Activate
                        </button>
                      )}
                      <button 
                        onClick={() => openConfirm(wallet.id, wallet.customerName, 'delete')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Wallet Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Wallet
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateWallet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleFormChange('customerName', e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Balance *
                </label>
                <input
                  type="number"
                  value={formData.initialBalance}
                  onChange={(e) => handleFormChange('initialBalance', parseFloat(e.target.value) || 0)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter initial balance"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch ID *
                </label>
                <input
                  type="text"
                  value={formData.branchId}
                  onChange={(e) => handleFormChange('branchId', e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter branch ID"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ customerName: '', initialBalance: 0, branchId: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Details Modal */}
      {showDetailsModal && selectedWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Wallet Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{selectedWallet.customerName}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Wallet Number:</span>
                        <span className="ml-2 font-mono text-gray-900">{selectedWallet.walletNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedWallet.status.toLowerCase() === "active"
                            ? "bg-green-100 text-green-800"
                            : selectedWallet.status.toLowerCase() === "suspended"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {selectedWallet.status.charAt(0).toUpperCase() + selectedWallet.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Balance Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ₹{showBalance ? selectedWallet.balance.toLocaleString() : "••••••"}
                    </div>
                    <div className="text-sm text-gray-500">
                      Current available balance
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Timeline</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Created</div>
                        <div className="text-xs text-gray-500">
                          {new Date(selectedWallet.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Last Transaction</div>
                        <div className="text-xs text-gray-500">
                          {new Date(selectedWallet.lastTransaction).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                      Add Funds
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                      Transfer Funds
                    </button>
                    <button 
                      onClick={() => {
                        const action = selectedWallet.status.toLowerCase() === "active" ? 'suspend' : 'activate';
                        openConfirm(selectedWallet.id, selectedWallet.customerName, action);
                        setShowDetailsModal(false);
                      }}
                      className={`w-full px-4 py-2 rounded-lg text-sm ${
                        selectedWallet.status.toLowerCase() === "active" 
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {selectedWallet.status.toLowerCase() === "active" ? "Suspend Wallet" : "Activate Wallet"}
                    </button>
                    <button 
                      onClick={() => {
                        openConfirm(selectedWallet.id, selectedWallet.customerName, 'delete');
                        setShowDetailsModal(false);
                      }}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                    >
                      Delete Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Transactions</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type === "deposit"
                              ? "bg-green-100 text-green-800"
                              : transaction.type === "withdrawal"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          ₹{transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {transaction.description}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, walletId: '', customerName: '', action: '' })}
        onConfirm={handleConfirmAction}
        title={`Confirm ${confirmDialog.action}`}
        message={`Are you sure you want to ${confirmDialog.action} the wallet for ${confirmDialog.customerName}? This action cannot be undone.`}
      />
    </div>
  );
} 