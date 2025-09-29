
"use client";
import { useState } from "react";
import { useCashContext, CashTransaction, TransactionFormData } from "../context/CashContext";
import {
  ArrowsRightLeftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  ClockIcon,
  EyeIcon,
  UserIcon,
  BanknotesIcon,
  CalendarIcon,
  CheckCircleIcon,
  UserCircleIcon,
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
      <button onClick={() => onRemove(toast.id)} className="ml-4 text-white hover:text-stripe-text-secondary">
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
        <h3 className="text-lg font-semibold text-stripe-text mb-2">{title}</h3>
        <p className="text-stripe-text-secondary mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stripe-border text-stripe-text rounded-lg hover:bg-stripe-background-light"
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

// Approval Log Interface
interface ApprovalLog {
  id: string;
  transactionId: string;
  approverName: string;
  approverRole: string;
  approvalAction: 'approved' | 'rejected' | 'cancelled';
  approvalDate: string;
  comments?: string;
}

export default function TransactionsPage() {
  const {
    transactions,
    addTransaction,
    updateTransactionStatus,
    deleteTransaction,
  } = useCashContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<"Deposit" | "Withdrawal" | "Transfer">("Deposit");
  const [selectedTransaction, setSelectedTransaction] = useState<CashTransaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    transactionId: '', 
    action: '' as 'cancel' | 'approve' | 'reject' | 'delete'
  });
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'Deposit',
    amount: 0,
    customerName: '',
    accountNumber: '',
    description: '',
    branchId: ''
  });

  // Mock approval logs data - these will show in the approval column and details modal
  const [approvalLogs, setApprovalLogs] = useState<ApprovalLog[]>([
    {
      id: '1',
      transactionId: '1',
      approverName: 'Rajesh Kumar',
      approverRole: 'Branch Manager',
      approvalAction: 'approved',
      approvalDate: '2024-01-20T10:30:00Z',
      comments: 'Transaction approved after verification of customer documents'
    },
    {
      id: '2',
      transactionId: '2',
      approverName: 'Priya Sharma',
      approverRole: 'Senior Manager',
      approvalAction: 'approved',
      approvalDate: '2024-01-20T11:15:00Z',
      comments: 'Withdrawal approved with proper verification'
    },
    {
      id: '3',
      transactionId: '3',
      approverName: 'Amit Patel',
      approverRole: 'Regional Manager',
      approvalAction: 'approved',
      approvalDate: '2024-01-20T12:00:00Z',
      comments: 'Interbranch transfer approved'
    },
    // Add more sample approval logs for better visibility
    {
      id: '4',
      transactionId: '1',
      approverName: 'Fatima Al-Zahra',
      approverRole: 'Regional Director',
      approvalAction: 'approved',
      approvalDate: '2024-01-20T09:15:00Z',
      comments: 'Initial approval for large deposit'
    },
    {
      id: '5',
      transactionId: '2',
      approverName: 'Mohammed Ali',
      approverRole: 'Compliance Officer',
      approvalAction: 'approved',
      approvalDate: '2024-01-20T10:45:00Z',
      comments: 'Compliance check completed'
    },
  ]);

  // Helper function to get approval logs for a transaction
  const getApprovalLogsForTransaction = (transactionId: string) => {
    const logs = approvalLogs.filter(log => log.transactionId === transactionId);
    return logs;
  };

  // Helper function to get the latest approval for a transaction
  const getLatestApproval = (transactionId: string) => {
    const logs = getApprovalLogsForTransaction(transactionId);
    return logs.length > 0 ? logs[logs.length - 1] : null;
  };

  // Helper function to check if a date is within range
  const isDateInRange = (transactionDate: string, start: string, end: string) => {
    if (!start && !end) return true; // No date filter applied
    
    const transaction = new Date(transactionDate);
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end + 'T23:59:59') : null; // Include entire end date
    
    if (startDate && endDate) {
      return transaction >= startDate && transaction <= endDate;
    } else if (startDate) {
      return transaction >= startDate;
    } else if (endDate) {
      return transaction <= endDate;
    }
    
    return true;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      transaction.branchId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDateRange = isDateInRange(transaction.timestamp, startDate, endDate);
    
    return matchesSearch && matchesType && matchesStatus && matchesDateRange;
  });

  const totalDeposits = transactions
    .filter(t => t.type === "Deposit" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === "Withdrawal" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingTransactions = transactions.filter(t => t.status === "Pending").length;

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
  const openConfirm = (id: string, action: 'cancel' | 'approve' | 'reject' | 'delete') => {
    setConfirmDialog({ isOpen: true, transactionId: id, action });
  };

  const handleConfirmAction = () => {
    const { action, transactionId } = confirmDialog;
    
    if (action === 'cancel') {
      updateTransactionStatus(transactionId, 'Cancelled');
      addToast('Transaction has been cancelled successfully', 'success');
    } else if (action === 'approve') {
      updateTransactionStatus(transactionId, 'Completed');
      // Add approval log entry
      const newApprovalLog: ApprovalLog = {
        id: Date.now().toString(),
        transactionId: transactionId,
        approverName: 'Current User', // In real app, get from auth context
        approverRole: 'Branch Manager',
        approvalAction: 'approved',
        approvalDate: new Date().toISOString(),
        comments: 'Transaction approved by current user'
      };
      setApprovalLogs(prev => [...prev, newApprovalLog]);
      addToast('Transaction has been approved successfully', 'success');
    } else if (action === 'reject') {
      updateTransactionStatus(transactionId, 'Failed');
      // Add rejection log entry
      const newApprovalLog: ApprovalLog = {
        id: Date.now().toString(),
        transactionId: transactionId,
        approverName: 'Current User', // In real app, get from auth context
        approverRole: 'Branch Manager',
        approvalAction: 'rejected',
        approvalDate: new Date().toISOString(),
        comments: 'Transaction rejected by current user'
      };
      setApprovalLogs(prev => [...prev, newApprovalLog]);
      addToast('Transaction has been rejected successfully', 'success');
    } else if (action === 'delete') {
      deleteTransaction(transactionId);
      addToast('Transaction has been deleted successfully', 'success');
    }
    
    setConfirmDialog({ isOpen: false, transactionId: '', action: 'cancel' });
  };

  const handleViewDetails = (transaction: CashTransaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  // Form handling functions
  const handleFormChange = (field: keyof TransactionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.customerName?.trim()) {
      addToast('Customer name is required', 'error');
      return;
    }
    if (formData.amount <= 0) {
      addToast('Amount must be greater than 0', 'error');
      return;
    }
    if (!formData.accountNumber?.trim()) {
      addToast('Account number is required', 'error');
      return;
    }
    if (!formData.branchId?.trim()) {
      addToast('Branch ID is required', 'error');
      return;
    }
    if (!formData.description?.trim()) {
      addToast('Description is required', 'error');
      return;
    }

    addTransaction(formData);
    addToast('Transaction created successfully', 'success');
    setShowNewTransactionModal(false);
    setFormData({
      type: 'Deposit',
      amount: 0,
      customerName: '',
      accountNumber: '',
      description: '',
      branchId: ''
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
  };

  // Helper function to get approval status badge
  const getApprovalStatusBadge = (action: string) => {
    switch (action) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-stripe-background-light text-stripe-text';
      default:
        return 'bg-stripe-background-light text-stripe-text';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stripe-text">Transaction Management</h1>
          <p className="text-stripe-text-secondary">
            Handle deposits, withdrawals, and transfers with comprehensive tracking
          </p>
        </div>
        <button
          onClick={() => setShowNewTransactionModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{totalDeposits.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <ArrowDownIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Total Withdrawals</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{totalWithdrawals.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg text-white">
              <ArrowUpIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Pending Transactions</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTransactions}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg text-white">
              <ArrowPathIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Net Flow</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{(totalDeposits - totalWithdrawals).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <ArrowsRightLeftIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
        <div className="space-y-4">
          {/* Search and Basic Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stripe-text-secondary" />
                <input
                  type="text"
                  placeholder="Search by reference, description, or branch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-stripe-text w-full pl-10 pr-4 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-stripe-text-secondary" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-stripe-text border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Deposit">Deposits</option>
                <option value="Withdrawal">Withdrawals</option>
                <option value="Transfer">Transfers</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-stripe-text border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-stripe-text-secondary" />
              <span className="text-sm font-medium text-stripe-text">Date Range:</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-stripe-text-secondary">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-stripe-text border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-stripe-text-secondary">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-stripe-text border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-stripe-border rounded-lg text-sm font-medium text-stripe-text bg-white hover:bg-stripe-background-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          </div>

          {/* Filter Summary */}
          {(searchTerm || typeFilter !== "all" || statusFilter !== "all" || startDate || endDate) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-700">Active Filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Search: "{searchTerm}"
                      </span>
                    )}
                    {typeFilter !== "all" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Type: {typeFilter}
                      </span>
                    )}
                    {statusFilter !== "all" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Status: {statusFilter}
                      </span>
                    )}
                    {startDate && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        From: {new Date(startDate).toLocaleDateString()}
                      </span>
                    )}
                    {endDate && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        To: {new Date(endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-blue-600">
                  {filteredTransactions.length} of {transactions.length} transactions
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-stripe-border overflow-hidden">
        <div className="px-6 py-4 border-b border-stripe-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-stripe-text">Transaction History</h2>
          <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-stripe-background-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Customer/Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Approval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const latestApproval = getLatestApproval(transaction.id);
                return (
                  <tr key={transaction.id} className="hover:bg-stripe-background-light">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-stripe-text font-mono">
                        {transaction.referenceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === "Deposit"
                            ? "bg-green-100 text-green-800"
                            : transaction.type === "Withdrawal"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-stripe-text">
                        ₹{transaction.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stripe-text">
                        <div>{transaction.customerName}</div>
                        <div className="text-stripe-text-secondary">{transaction.accountNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text">
                      {transaction.branchId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {latestApproval ? (
                        <div className="flex items-center space-x-2 bg-green-50 p-2 rounded-lg border border-green-200">
                          <UserCircleIcon className="h-4 w-4 text-green-600" />
                          <div className="text-sm">
                            <div className="font-semibold text-stripe-text">{latestApproval.approverName}</div>
                            <div className="text-xs text-stripe-text-secondary font-medium">{latestApproval.approverRole}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                          <UserCircleIcon className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm text-stripe-text font-medium">Pending Approval</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text-secondary">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                          <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(transaction)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleViewDetails(transaction)}
                        className="text-purple-600 hover:text-purple-900"
                        title="View Approval Log"
                      >
                        <UserCircleIcon className="h-4 w-4" />
                      </button>
                      {transaction.status === "Pending" && (
                        <button 
                          onClick={() => openConfirm(transaction.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => openConfirm(transaction.id, 'delete')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-stripe-text">
                New Transaction
              </h3>
              <button
                onClick={() => setShowNewTransactionModal(false)}
                className="text-stripe-text-secondary hover:text-stripe-text-secondary"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">
                  Transaction Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleFormChange('type', e.target.value as 'Deposit' | 'Withdrawal' | 'Transfer')}
                  className="text-stripe-text w-full border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Deposit">Deposit</option>
                  <option value="Withdrawal">Withdrawal</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', parseFloat(e.target.value) || 0)}
                  className="text-stripe-text w-full border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleFormChange('customerName', e.target.value)}
                  className="text-stripe-text w-full border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleFormChange('accountNumber', e.target.value)}
                  className="text-stripe-text w-full border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter account number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">
                  Branch ID *
                </label>
                <input
                  type="text"
                  value={formData.branchId}
                  onChange={(e) => handleFormChange('branchId', e.target.value)}
                  className="text-stripe-text w-full border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter branch ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="text-stripe-text w-full border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter transaction description"
                  rows={3}
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewTransactionModal(false);
                    setFormData({
                      type: 'Deposit',
                      amount: 0,
                      customerName: '',
                      accountNumber: '',
                      description: '',
                      branchId: ''
                    });
                  }}
                  className="flex-1 bg-stripe-background-light text-stripe-text px-4 py-2 rounded-lg hover:bg-stripe-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Process Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-stripe-text">
                Transaction Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-stripe-text-secondary hover:text-stripe-text-secondary"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">Transaction Information</h4>
                  <div className="bg-stripe-background-light p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Reference:</span>
                      <span className="font-mono text-stripe-text">{selectedTransaction.referenceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Type:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedTransaction.type === "Deposit"
                          ? "bg-green-100 text-green-800"
                          : selectedTransaction.type === "Withdrawal"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {selectedTransaction.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Amount:</span>
                      <span className="font-semibold text-stripe-text">₹{selectedTransaction.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedTransaction.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : selectedTransaction.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">Account Details</h4>
                  <div className="bg-stripe-background-light p-4 rounded-lg space-y-3">
                    <div>
                      <div className="text-sm text-stripe-text-secondary">Customer Name</div>
                      <div className="font-medium text-stripe-text">{selectedTransaction.customerName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-stripe-text-secondary">Account Number</div>
                      <div className="font-medium text-stripe-text">{selectedTransaction.accountNumber}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">Branch Information</h4>
                  <div className="bg-stripe-background-light p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-stripe-text-secondary" />
                      <span className="font-medium text-stripe-text">{selectedTransaction.branchId}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">Timeline</h4>
                  <div className="bg-stripe-background-light p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-4 w-4 text-stripe-text-secondary" />
                      <div>
                        <div className="text-sm font-medium text-stripe-text">Transaction Time</div>
                        <div className="text-xs text-stripe-text-secondary">
                          {new Date(selectedTransaction.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">Description</h4>
                  <div className="bg-stripe-background-light p-4 rounded-lg">
                    <p className="text-sm text-stripe-text">{selectedTransaction.description}</p>
                  </div>
                </div>

                {selectedTransaction.status === "Pending" && (
                  <div>
                    <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">Actions</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => openConfirm(selectedTransaction.id, 'approve')}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Approve Transaction
                      </button>
                      <button 
                        onClick={() => openConfirm(selectedTransaction.id, 'reject')}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                      >
                        Reject Transaction
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Approval Log Section */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-stripe-text mb-4 flex items-center bg-blue-50 p-3 rounded-lg">
                    <UserCircleIcon className="h-6 w-6 mr-3 text-blue-600" />
                    Approval Log & History
                  </h4>
                  <div className="bg-white border border-stripe-border rounded-lg p-4">
                    {(() => {
                      const logs = getApprovalLogsForTransaction(selectedTransaction.id);                      return logs.length > 0 ? (
                        <div className="space-y-4">
                          <div className="text-sm text-stripe-text-secondary mb-3">
                            Found {logs.length} approval record(s) for this transaction
                          </div>
                          {logs.map((log, index) => (
                            <div key={log.id} className={`border-l-4 pl-4 py-3 bg-stripe-background-light rounded-r-lg ${
                              log.approvalAction === 'approved' ? 'border-green-500 bg-green-50' :
                              log.approvalAction === 'rejected' ? 'border-red-500 bg-red-50' :
                              'border-stripe-border bg-stripe-background-light'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <UserCircleIcon className="h-5 w-5 text-stripe-text-secondary" />
                                  <div>
                                    <div className="font-semibold text-stripe-text">{log.approverName}</div>
                                    <div className="text-sm text-stripe-text-secondary font-medium">{log.approverRole}</div>
                                  </div>
                                </div>
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getApprovalStatusBadge(log.approvalAction)}`}>
                                  {log.approvalAction.charAt(0).toUpperCase() + log.approvalAction.slice(1)}
                                </span>
                              </div>
                              <div className="text-sm text-stripe-text-secondary mb-2">
                                <ClockIcon className="h-4 w-4 inline mr-1" />
                                {new Date(log.approvalDate).toLocaleString()}
                              </div>
                              {log.comments && (
                                <div className="text-sm text-stripe-text bg-white p-3 rounded border">
                                  <span className="font-medium">Comments:</span> "{log.comments}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-stripe-text-secondary">
                          <UserCircleIcon className="h-12 w-12 mx-auto mb-3 text-stripe-text-secondary" />
                          <p className="text-lg font-medium">No approval history available</p>
                          <p className="text-sm">This transaction has not been approved yet.</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
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
        onClose={() => setConfirmDialog({ isOpen: false, transactionId: '', action: 'cancel' })}
        onConfirm={handleConfirmAction}
        title={`Confirm ${confirmDialog.action}`}
        message={`Are you sure you want to ${confirmDialog.action} this transaction? This action cannot be undone.`}
      />
    </div>
  );
} 