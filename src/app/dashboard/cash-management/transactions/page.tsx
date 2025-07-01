/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
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
} from "@heroicons/react/24/outline";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  fromAccount: string;
  toAccount: string;
  status: "completed" | "pending" | "failed";
  timestamp: string;
  reference: string;
  branch: string;
  description: string;
}

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<"deposit" | "withdrawal" | "transfer">("deposit");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "deposit",
      amount: 50000,
      fromAccount: "Cash",
      toAccount: "WAL001234567",
      status: "completed",
      timestamp: "2024-01-15T10:30:00Z",
      reference: "TXN001234",
      branch: "Branch A001",
      description: "Cash deposit by Rahul Sharma",
    },
    {
      id: "2",
      type: "withdrawal",
      amount: 25000,
      fromAccount: "WAL001234568",
      toAccount: "Cash",
      status: "completed",
      timestamp: "2024-01-15T09:15:00Z",
      reference: "TXN001235",
      branch: "Branch B002",
      description: "Cash withdrawal by Priya Patel",
    },
    {
      id: "3",
      type: "transfer",
      amount: 100000,
      fromAccount: "WAL001234569",
      toAccount: "WAL001234570",
      status: "pending",
      timestamp: "2024-01-15T08:45:00Z",
      reference: "TXN001236",
      branch: "Branch C003",
      description: "Inter-wallet transfer",
    },
    {
      id: "4",
      type: "deposit",
      amount: 75000,
      fromAccount: "Cash",
      toAccount: "WAL001234571",
      status: "failed",
      timestamp: "2024-01-15T07:30:00Z",
      reference: "TXN001237",
      branch: "Branch A001",
      description: "Failed deposit attempt",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalDeposits = transactions
    .filter(t => t.type === "deposit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === "withdrawal" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingTransactions = transactions.filter(t => t.status === "pending").length;

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const handleApproveTransaction = (transactionId: string) => {
    // Handle approval logic here
    console.log("Approving transaction:", transactionId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600">
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{totalDeposits.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <ArrowDownIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{totalWithdrawals.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg text-white">
              <ArrowUpIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Transactions</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTransactions}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg text-white">
              <ArrowPathIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Flow</p>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference, description, or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="transfer">Transfers</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From/To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-mono">
                      {transaction.reference}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === "deposit"
                          ? "bg-green-100 text-green-800"
                          : transaction.type === "withdrawal"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{transaction.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>From: {transaction.fromAccount}</div>
                      <div>To: {transaction.toAccount}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                      {transaction.status === "pending" && (
                        <button 
                          onClick={() => handleApproveTransaction(transaction.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              New Transaction
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  value={selectedTransactionType}
                  onChange={(e) => setSelectedTransactionType(e.target.value as any)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedTransactionType === "transfer" ? "From Account" : "Account"}
                </label>
                <input
                  type="text"
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter account number"
                />
              </div>
              {selectedTransactionType === "transfer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Account
                  </label>
                  <input
                    type="text"
                    className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter destination account"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter transaction description"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTransactionModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Transaction Details
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
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Transaction Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference:</span>
                      <span className="font-mono text-gray-900">{selectedTransaction.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedTransaction.type === "deposit"
                          ? "bg-green-100 text-green-800"
                          : selectedTransaction.type === "withdrawal"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-semibold text-gray-900">₹{selectedTransaction.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedTransaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedTransaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Account Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">From Account</div>
                      <div className="font-medium text-gray-900">{selectedTransaction.fromAccount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">To Account</div>
                      <div className="font-medium text-gray-900">{selectedTransaction.toAccount}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Branch Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{selectedTransaction.branch}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Timeline</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Transaction Time</div>
                        <div className="text-xs text-gray-500">
                          {new Date(selectedTransaction.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedTransaction.description}</p>
                  </div>
                </div>

                {selectedTransaction.status === "pending" && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleApproveTransaction(selectedTransaction.id)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Approve Transaction
                      </button>
                      <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                        Reject Transaction
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 