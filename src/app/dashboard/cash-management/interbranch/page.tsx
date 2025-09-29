
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
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XCircleIcon,
  ClockIcon as ClockIconSolid,
} from "@heroicons/react/24/outline";

// Toast notification state
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Approval workflow interface
interface ApprovalWorkflow {
  id: string;
  transferId: string;
  level: number;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  timestamp: Date;
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

// Approval workflow component
const ApprovalWorkflowComponent = ({ 
  transfer, 
  onApprove, 
  onReject,
  onComplete
}: { 
  transfer: InterbranchTransfer; 
  onApprove: (level: number, comments?: string) => void; 
  onReject: (level: number, comments?: string) => void; 
  onComplete: (comments?: string) => void; 
}) => {
  const [comments, setComments] = useState("");
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | 'complete'>('approve');

  const approvalLevels = [
    { level: 1, title: "Branch Manager", required: true },
    { level: 2, title: "Regional Manager", required: transfer.amount > 1000000 },
    { level: 3, title: "Head of Operations", required: transfer.amount > 5000000 },
  ];

  const getCurrentApprovalLevel = () => {
    if (transfer.status === "Pending") return 1;
    if (transfer.status === "Level1_Approved") return 2;
    if (transfer.status === "Level2_Approved") return 3;
    return 0;
  };

  const currentLevel = getCurrentApprovalLevel();
  const nextLevel = approvalLevels.find(level => level.level === currentLevel);

  const handleApprovalAction = () => {
    if (approvalAction === 'approve') {
      onApprove(currentLevel, comments);
    } else if (approvalAction === 'reject') {
      onReject(currentLevel, comments);
    } else if (approvalAction === 'complete') {
      onComplete(comments);
    }
    setShowApprovalForm(false);
    setComments("");
  };

  return (
    <div className="space-y-4">
      <div className="bg-stripe-background-light p-4 rounded-lg">
        <h4 className="text-sm font-medium text-stripe-text mb-3">Approval Workflow</h4>
        <div className="space-y-3">
          {approvalLevels.map((level) => (
            <div key={level.level} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                level.level < currentLevel 
                  ? 'bg-green-100 text-green-800' 
                  : level.level === currentLevel 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-stripe-background-light text-stripe-text-secondary'
              }`}>
                {level.level < currentLevel ? (
                  <CheckIcon className="h-4 w-4" />
                ) : level.level === currentLevel ? (
                  <ClockIconSolid className="h-4 w-4" />
                ) : (
                  level.level
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-stripe-text">{level.title}</div>
                <div className="text-xs text-stripe-text-secondary">
                  {level.required ? 'Required' : 'Conditional'} • 
                  {level.level < currentLevel ? ' Approved' : 
                   level.level === currentLevel ? ' Pending' : ' Not Started'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {transfer.status !== "Completed" && transfer.status !== "Rejected" && nextLevel && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Current Approval: {nextLevel.title}
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setApprovalAction('approve');
                setShowApprovalForm(true);
              }}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => {
                setApprovalAction('reject');
                setShowApprovalForm(true);
              }}
              className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Manual Completion Option */}
      {(transfer.status === "Level1_Approved" || transfer.status === "Level2_Approved") && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-900 mb-2">
            Manual Completion
          </h4>
          <p className="text-xs text-green-700 mb-3">
            Mark transfer as completed after physical cash movement
          </p>
          <button
            onClick={() => {
              setApprovalAction('complete');
              setShowApprovalForm(true);
            }}
            className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
          >
            Mark as Completed
          </button>
        </div>
      )}

      {showApprovalForm && (
        <div className="bg-white border border-stripe-border rounded-lg p-4">
          <h5 className="text-sm font-medium text-stripe-text mb-3">
            {approvalAction === 'approve' ? 'Approve' : 
             approvalAction === 'reject' ? 'Reject' : 'Complete'} Transfer
          </h5>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={`Enter comments for ${approvalAction === 'approve' ? 'approval' : 
                        approvalAction === 'reject' ? 'rejection' : 'completion'}...`}
            className="w-full border border-stripe-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => setShowApprovalForm(false)}
              className="flex-1 bg-stripe-background-light text-stripe-text px-3 py-2 rounded text-sm hover:bg-stripe-border"
            >
              Cancel
            </button>
            <button
              onClick={handleApprovalAction}
              className={`flex-1 px-3 py-2 rounded text-sm text-white ${
                approvalAction === 'approve' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : approvalAction === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {approvalAction === 'approve' ? 'Approve' : 
               approvalAction === 'reject' ? 'Reject' : 'Complete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function InterbranchReportsPage() {
  const {
    interbranchTransfers = [],
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

  // Mock approval workflow data
  const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflow[]>([]);

  const filteredTransfers = (interbranchTransfers || []).filter((transfer) => {
    const matchesSearch = 
      transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.toBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transfer.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === "all" || transfer.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalTransfers = (interbranchTransfers || []).length;
  const completedTransfers = (interbranchTransfers || []).filter(t => t.status === "Completed").length;
  const pendingTransfers = (interbranchTransfers || []).filter(t => 
    t.status === "Pending" || t.status === "Level1_Approved" || t.status === "Level2_Approved"
  ).length;
  const totalAmount = (interbranchTransfers || [])
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

  // Approval workflow functions
  const handleApproval = (transferId: string, level: number, comments?: string) => {
    const transfer = interbranchTransfers.find(t => t.id === transferId);
    if (!transfer) return;

    let newStatus: InterbranchTransfer['status'] = 'Pending';
    if (level === 1) {
      newStatus = transfer.amount > 1000000 ? 'Level1_Approved' : 'Completed';
    } else if (level === 2) {
      newStatus = transfer.amount > 5000000 ? 'Level2_Approved' : 'Completed';
    } else if (level === 3) {
      newStatus = 'Completed';
    }

    updateTransferStatus(transferId, newStatus, 'Current User');
    
    // Add approval record
    const approvalRecord: ApprovalWorkflow = {
      id: Date.now().toString(),
      transferId,
      level,
      approver: 'Current User', // In real app, get from auth context
      status: 'approved',
      comments,
      timestamp: new Date(),
    };
    setApprovalWorkflows(prev => [...prev, approvalRecord]);
    
    addToast(`Transfer approved at level ${level}`, 'success');
  };

  // Manual completion function
  const handleManualCompletion = (transferId: string, comments?: string) => {
    updateTransferStatus(transferId, 'Completed');
    
    // Add completion record
    const completionRecord: ApprovalWorkflow = {
      id: Date.now().toString(),
      transferId,
      level: 999, // Special level for manual completion
      approver: 'Current User',
      status: 'approved',
      comments: comments || 'Manually completed',
      timestamp: new Date(),
    };
    setApprovalWorkflows(prev => [...prev, completionRecord]);
    
    addToast('Transfer marked as completed', 'success');
  };

  const handleRejection = (transferId: string, level: number, comments?: string) => {
    const transfer = interbranchTransfers.find(t => t.id === transferId);
    if (!transfer) return;

    updateTransferStatus(transferId, 'Rejected');
    
    // Add rejection record
    const rejectionRecord: ApprovalWorkflow = {
      id: Date.now().toString(),
      transferId,
      level,
      approver: 'Current User', // In real app, get from auth context
      status: 'rejected',
      comments,
      timestamp: new Date(),
    };
    setApprovalWorkflows(prev => [...prev, rejectionRecord]);
    
    addToast(`Transfer rejected at level ${level}`, 'error');
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
      // For simple approval, move to Level1_Approved
      updateTransferStatus(transferId, 'Level1_Approved', 'Current User');
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

  const getStatusColor = (status: InterbranchTransfer['status']) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Level1_Approved":
        return "bg-blue-100 text-blue-800";
      case "Level2_Approved":
        return "bg-purple-100 text-purple-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-stripe-background-light text-stripe-text";
    }
  };

  const getStatusIcon = (status: InterbranchTransfer['status']) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "Pending":
        return <ClockIcon className="h-4 w-4" />;
      case "Level1_Approved":
      case "Level2_Approved":
        return <ShieldCheckIcon className="h-4 w-4" />;
      case "Rejected":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stripe-text">Interbranch Reports</h1>
          <p className="text-stripe-text-secondary">
            Track cash movements and transfers between branches with approval workflow
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
        <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Total Transfers</p>
              <p className="text-2xl font-bold text-stripe-text">{totalTransfers}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <ArrowPathIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTransfers}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTransfers}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg text-white">
              <ClockIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Total Amount</p>
              <p className="text-2xl font-bold text-stripe-text">
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
      <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stripe-text-secondary" />
              <input
                type="text"
                placeholder="Search by reference, branch, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-stripe-text w-full pl-10 pr-4 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-stripe-text-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-stripe-text border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="level1_approved">Level 1 Approved</option>
              <option value="level2_approved">Level 2 Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-stripe-text border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="bg-white rounded-lg shadow-sm border border-stripe-border overflow-hidden">
        <div className="px-6 py-4 border-b border-stripe-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-stripe-text">Transfer History</h2>
          <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-stripe-background-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Transfer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-stripe-background-light">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-stripe-text font-mono">
                      {transfer.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-stripe-text">{transfer.fromBranch}</span>
                      <ArrowRightIcon className="h-4 w-4 text-stripe-text-secondary" />
                      <span className="text-sm text-stripe-text">{transfer.toBranch}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-stripe-text">
                      ₹{transfer.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-stripe-text">
                      {transfer.purpose}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transfer.status)}`}>
                      {getStatusIcon(transfer.status)}
                      <span className="ml-1">{transfer.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text-secondary">
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
                      {(transfer.status === "Pending" || transfer.status === "Level1_Approved" || transfer.status === "Level2_Approved") && (
                        <button 
                          onClick={() => openConfirm(transfer.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                      )}
                      {(transfer.status === "Pending") && (
                        <button 
                          onClick={() => openConfirm(transfer.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Reject
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
      <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
        <h2 className="text-lg font-semibold text-stripe-text mb-4">Branch Network Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {branches.map((branch, index) => (
            <div
              key={index}
              className="p-4 border border-stripe-border rounded-lg text-center"
            >
              <BuildingOfficeIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-stripe-text">{branch}</h3>
              <p className="text-sm text-stripe-text-secondary mt-1">
                {(interbranchTransfers || []).filter(t => t.fromBranch === branch || t.toBranch === branch).length} transfers
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
              <h3 className="text-lg font-semibold text-stripe-text">
                New Interbranch Transfer
              </h3>
              <button
                onClick={() => setShowNewTransferModal(false)}
                className="text-stripe-text-secondary hover:text-stripe-text-secondary"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">
                  From Branch *
                </label>
                <select 
                  value={formData.fromBranch}
                  onChange={(e) => handleFormChange('fromBranch', e.target.value)}
                  className="text-stripe-text w-full border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-stripe-text mb-1">
                  To Branch *
                </label>
                <select 
                  value={formData.toBranch}
                  onChange={(e) => handleFormChange('toBranch', e.target.value)}
                  className="text-stripe-text w-full border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  Purpose *
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => handleFormChange('purpose', e.target.value)}
                  className="text-stripe-text w-full border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter transfer purpose"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  className="text-stripe-text w-full border border-stripe-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="flex-1 bg-stripe-background-light text-stripe-text px-4 py-2 rounded-lg hover:bg-stripe-border"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-stripe-text">
                Transfer Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-stripe-text-secondary hover:text-stripe-text-secondary"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Transfer Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">Transfer Information</h4>
                      <div className="bg-stripe-background-light p-4 rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <span className="text-stripe-text-secondary">ID:</span>
                          <span className="font-mono text-stripe-text">{selectedTransfer.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stripe-text-secondary">Purpose:</span>
                          <span className="text-stripe-text">{selectedTransfer.purpose}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stripe-text-secondary">Amount:</span>
                          <span className="font-semibold text-stripe-text">₹{selectedTransfer.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stripe-text-secondary">Status:</span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTransfer.status)}`}>
                            {getStatusIcon(selectedTransfer.status)}
                            <span className="ml-1">{selectedTransfer.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">Branch Details</h4>
                      <div className="bg-stripe-background-light p-4 rounded-lg space-y-3">
                        <div className="flex items-center space-x-3">
                          <BuildingOfficeIcon className="h-4 w-4 text-stripe-text-secondary" />
                          <div>
                            <div className="text-sm text-stripe-text-secondary">From Branch</div>
                            <div className="font-medium text-stripe-text">{selectedTransfer.fromBranch}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <ArrowRightIcon className="h-4 w-4 text-stripe-text-secondary" />
                          <div>
                            <div className="text-sm text-stripe-text-secondary">To Branch</div>
                            <div className="font-medium text-stripe-text">{selectedTransfer.toBranch}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">User Information</h4>
                      <div className="bg-stripe-background-light p-4 rounded-lg space-y-3">
                        <div className="flex items-center space-x-3">
                          <UserIcon className="h-4 w-4 text-stripe-text-secondary" />
                          <div>
                            <div className="text-sm text-stripe-text-secondary">Requested By</div>
                            <div className="font-medium text-stripe-text">{selectedTransfer.requestedBy}</div>
                          </div>
                        </div>
                        {selectedTransfer.approvedBy && (
                          <div className="flex items-center space-x-3">
                            <UserIcon className="h-4 w-4 text-stripe-text-secondary" />
                            <div>
                              <div className="text-sm text-stripe-text-secondary">Approved By</div>
                              <div className="font-medium text-stripe-text">{selectedTransfer.approvedBy}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">Timeline</h4>
                      <div className="bg-stripe-background-light p-4 rounded-lg space-y-3">
                        <div className="flex items-center space-x-3">
                          <CalendarIcon className="h-4 w-4 text-stripe-text-secondary" />
                          <div>
                            <div className="text-sm font-medium text-stripe-text">Request Date</div>
                            <div className="text-xs text-stripe-text-secondary">
                              {new Date(selectedTransfer.requestDate).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-stripe-text-secondary mb-2">Notes</h4>
                      <div className="bg-stripe-background-light p-4 rounded-lg">
                        <p className="text-sm text-stripe-text">{selectedTransfer.notes || 'No notes available'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                             {/* Approval Workflow */}
               <div className="lg:col-span-1">
                 <ApprovalWorkflowComponent
                   transfer={selectedTransfer}
                   onApprove={(level, comments) => handleApproval(selectedTransfer.id, level, comments)}
                   onReject={(level, comments) => handleRejection(selectedTransfer.id, level, comments)}
                   onComplete={(comments) => handleManualCompletion(selectedTransfer.id, comments)}
                 />
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