"use client";
import { useState } from "react";
import {
  ArrowPathIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface InterbranchTransfer {
  id: string;
  fromBranch: string;
  toBranch: string;
  amount: number;
  type: "cash_transfer" | "settlement" | "replenishment";
  status: "pending" | "completed" | "failed" | "in_transit";
  timestamp: string;
  reference: string;
  description: string;
  initiatedBy: string;
  approvedBy?: string;
}

export default function InterbranchReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<InterbranchTransfer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const transfers: InterbranchTransfer[] = [
    {
      id: "1",
      fromBranch: "Mumbai Central",
      toBranch: "Delhi Main",
      amount: 500000,
      type: "cash_transfer",
      status: "completed",
      timestamp: "2024-01-15T14:30:00Z",
      reference: "IBT001234",
      description: "Cash transfer for operational needs",
      initiatedBy: "Rajesh Kumar",
      approvedBy: "Priya Sharma",
    },
    {
      id: "2",
      fromBranch: "Bangalore Tech Park",
      toBranch: "Chennai Central",
      amount: 300000,
      type: "replenishment",
      status: "in_transit",
      timestamp: "2024-01-15T12:15:00Z",
      reference: "IBT001235",
      description: "Cash replenishment for low balance",
      initiatedBy: "Amit Patel",
    },
    {
      id: "3",
      fromBranch: "Delhi Main",
      toBranch: "Mumbai Central",
      amount: 750000,
      type: "settlement",
      status: "pending",
      timestamp: "2024-01-15T10:45:00Z",
      reference: "IBT001236",
      description: "End-of-day settlement",
      initiatedBy: "Priya Sharma",
    },
    {
      id: "4",
      fromBranch: "Chennai Central",
      toBranch: "Bangalore Tech Park",
      amount: 200000,
      type: "cash_transfer",
      status: "failed",
      timestamp: "2024-01-15T09:20:00Z",
      reference: "IBT001237",
      description: "Failed transfer due to insufficient balance",
      initiatedBy: "Lakshmi Devi",
    },
  ];

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch = 
      transfer.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.toBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter;
    const matchesType = typeFilter === "all" || transfer.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalTransfers = transfers.length;
  const completedTransfers = transfers.filter(t => t.status === "completed").length;
  const pendingTransfers = transfers.filter(t => t.status === "pending").length;
  const totalAmount = transfers
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const branches = [
    "Mumbai Central",
    "Delhi Main", 
    "Bangalore Tech Park",
    "Chennai Central",
  ];

  const handleViewDetails = (transfer: InterbranchTransfer) => {
    setSelectedTransfer(transfer);
    setShowDetailsModal(true);
  };

  const handleApproveTransfer = (transferId: string) => {
    // Handle approval logic here
    console.log("Approving transfer:", transferId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interbranch Reports</h1>
          <p className="text-gray-600">
            Track cash movements and transfers between branches
          </p>
        </div>
        <button
          onClick={() => setShowNewTransferModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Transfer</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transfers</p>
              <p className="text-2xl font-bold text-gray-900">{totalTransfers}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <ArrowPathIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTransfers}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTransfers}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg text-white">
              <ClockIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(totalAmount / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg text-white">
              <BuildingOfficeIcon className="h-6 w-6" />
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
                placeholder="Search by reference, branch, or description..."
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
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="cash_transfer">Cash Transfer</option>
              <option value="settlement">Settlement</option>
              <option value="replenishment">Replenishment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transfers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Transfer History</h2>
          <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Export Report</span>
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
                  Transfer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-mono">
                      {transfer.reference}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">{transfer.fromBranch}</span>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{transfer.toBranch}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{transfer.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transfer.type === "cash_transfer"
                          ? "bg-blue-100 text-blue-800"
                          : transfer.type === "settlement"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {transfer.type.replace("_", " ").charAt(0).toUpperCase() + 
                       transfer.type.replace("_", " ").slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transfer.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transfer.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : transfer.status === "in_transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transfer.status.replace("_", " ").charAt(0).toUpperCase() + 
                       transfer.status.replace("_", " ").slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transfer.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(transfer)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                      {transfer.status === "pending" && (
                        <button 
                          onClick={() => handleApproveTransfer(transfer.id)}
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

      {/* Branch Network Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Branch Network Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {branches.map((branch, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg text-center"
            >
              <BuildingOfficeIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">{branch}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {transfers.filter(t => t.fromBranch === branch || t.toBranch === branch).length} transfers
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* New Transfer Modal */}
      {showNewTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              New Interbranch Transfer
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Branch
                </label>
                <select className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Branch
                </label>
                <select className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
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
                  Transfer Type
                </label>
                <select className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="cash_transfer">Cash Transfer</option>
                  <option value="settlement">Settlement</option>
                  <option value="replenishment">Replenishment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter transfer description"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTransferModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Initiate Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Details Modal */}
      {showDetailsModal && selectedTransfer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Transfer Details
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
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Transfer Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference:</span>
                      <span className="font-mono text-gray-900">{selectedTransfer.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedTransfer.type === "cash_transfer"
                          ? "bg-blue-100 text-blue-800"
                          : selectedTransfer.type === "settlement"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {selectedTransfer.type.replace("_", " ").charAt(0).toUpperCase() + 
                         selectedTransfer.type.replace("_", " ").slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-semibold text-gray-900">₹{selectedTransfer.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedTransfer.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedTransfer.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedTransfer.status === "in_transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {selectedTransfer.status.replace("_", " ").charAt(0).toUpperCase() + 
                         selectedTransfer.status.replace("_", " ").slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Branch Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">From Branch</div>
                        <div className="font-medium text-gray-900">{selectedTransfer.fromBranch}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">To Branch</div>
                        <div className="font-medium text-gray-900">{selectedTransfer.toBranch}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">User Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Initiated By</div>
                        <div className="font-medium text-gray-900">{selectedTransfer.initiatedBy}</div>
                      </div>
                    </div>
                    {selectedTransfer.approvedBy && (
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Approved By</div>
                          <div className="font-medium text-gray-900">{selectedTransfer.approvedBy}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Timeline</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Transfer Time</div>
                        <div className="text-xs text-gray-500">
                          {new Date(selectedTransfer.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedTransfer.description}</p>
                  </div>
                </div>

                {selectedTransfer.status === "pending" && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleApproveTransfer(selectedTransfer.id)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Approve Transfer
                      </button>
                      <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                        Reject Transfer
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