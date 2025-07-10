
"use client";
import { useState } from "react";
import { useCashContext, InterbranchTransfer, InterbranchTransferFormData } from "../context/CashContext";
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
  ArrowsRightLeftIcon,
  EyeIcon,
  BanknotesIcon,
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

export default function InterbranchReportsPage() {
  const {
    interbranchTransfers,
    addInterbranchTransfer,
    updateTransferStatus,
    deleteTransfer,
  } = useCashContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<InterbranchTransfer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    transferId: '', 
    action: '' as 'approve' | 'reject' | 'cancel' | 'delete'
  });
  const [formData, setFormData] = useState<InterbranchTransferFormData>({
    fromBranch: '',
    toBranch: '',
    amount: 0,
    purpose: '',
    notes: ''
  });

  const filteredTransfers = interbranchTransfers.filter((transfer) => {
    const matchesSearch = 
      transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.toBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transfer.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === "all" || transfer.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalTransfers = interbranchTransfers.length;
  const completedTransfers = interbranchTransfers.filter(t => t.status === "Completed").length;
  const pendingTransfers = interbranchTransfers.filter(t => t.status === "Pending").length;
  const totalAmount = interbranchTransfers
    .filter(t => t.status === "Completed")
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

  // Form handling functions
  const handleFormChange = (field: keyof InterbranchTransferFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateTransfer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.fromBranch.trim()) {
      addToast('From branch is required', 'error');
      return;
    }
    if (!formData.toBranch.trim()) {
      addToast('To branch is required', 'error');
      return;
    }
    if (formData.fromBranch === formData.toBranch) {
      addToast('From and To branches cannot be the same', 'error');
      return;
    }
    if (formData.amount <= 0) {
      addToast('Amount must be greater than 0', 'error');
      return;
    }
    if (!formData.purpose.trim()) {
      addToast('Purpose is required', 'error');
      return;
    }

    addInterbranchTransfer(formData);
    addToast('Interbranch transfer created successfully', 'success');
    setShowNewTransferModal(false);
    setFormData({
      fromBranch: '',
      toBranch: '',
      amount: 0,
      purpose: '',
      notes: ''
    });
  };

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
  const openConfirm = (id: string, action: 'approve' | 'reject' | 'cancel' | 'delete') => {
    setConfirmDialog({ isOpen: true, transferId: id, action });
  };

  const handleConfirmAction = () => {
    const { action, transferId } = confirmDialog;
    
    if (action === 'approve') {
      updateTransferStatus(transferId, 'Approved');
      addToast('Transfer has been approved successfully', 'success');
    } else if (action === 'reject') {
      updateTransferStatus(transferId, 'Rejected');
      addToast('Transfer has been rejected successfully', 'success');
    } else if (action === 'cancel') {
      updateTransferStatus(transferId, 'Rejected');
      addToast('Transfer has been cancelled successfully', 'success');
    } else if (action === 'delete') {
      deleteTransfer(transferId);
      addToast('Transfer has been deleted successfully', 'success');
    }
    
    setConfirmDialog({ isOpen: false, transferId: '', action: 'approve' });
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
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
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
                      {transfer.id}
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
                    <div className="text-sm text-gray-900">
                      {transfer.purpose}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transfer.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : transfer.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : transfer.status === "Approved"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transfer.requestDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(transfer)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                      {transfer.status === "Pending" && (
                        <button 
                          onClick={() => openConfirm(transfer.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => openConfirm(transfer.id, 'delete')}
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
                {interbranchTransfers.filter(t => t.fromBranch === branch || t.toBranch === branch).length} transfers
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* New Transfer Modal */}
      {showNewTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                New Interbranch Transfer
              </h3>
              <button
                onClick={() => setShowNewTransferModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Branch *
                </label>
                <select 
                  value={formData.fromBranch}
                  onChange={(e) => handleFormChange('fromBranch', e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select from branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Branch *
                </label>
                <select 
                  value={formData.toBranch}
                  onChange={(e) => handleFormChange('toBranch', e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select to branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', parseFloat(e.target.value) || 0)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose *
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => handleFormChange('purpose', e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter transfer purpose"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter additional notes (optional)"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewTransferModal(false);
                    setFormData({
                      fromBranch: '',
                      toBranch: '',
                      amount: 0,
                      purpose: '',
                      notes: ''
                    });
                  }}
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
                      <span className="text-gray-500">ID:</span>
                      <span className="font-mono text-gray-900">{selectedTransfer.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Purpose:</span>
                      <span className="text-gray-900">{selectedTransfer.purpose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-semibold text-gray-900">₹{selectedTransfer.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedTransfer.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : selectedTransfer.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedTransfer.status === "Approved"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {selectedTransfer.status}
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
                        <div className="text-sm text-gray-500">Requested By</div>
                        <div className="font-medium text-gray-900">{selectedTransfer.requestedBy}</div>
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
                        <div className="text-sm font-medium text-gray-900">Request Date</div>
                        <div className="text-xs text-gray-500">
                          {new Date(selectedTransfer.requestDate).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedTransfer.notes || 'No notes available'}</p>
                  </div>
                </div>

                {selectedTransfer.status === "Pending" && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => openConfirm(selectedTransfer.id, 'approve')}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Approve Transfer
                      </button>
                      <button 
                        onClick={() => openConfirm(selectedTransfer.id, 'reject')}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                      >
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

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, transferId: '', action: 'approve' })}
        onConfirm={handleConfirmAction}
        title={`Confirm ${confirmDialog.action}`}
        message={`Are you sure you want to ${confirmDialog.action} this transfer? This action cannot be undone.`}
      />
    </div>
  );
} 