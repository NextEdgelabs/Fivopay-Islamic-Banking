/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { 
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CreditCardIcon,
  XCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  PlusIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// Import types from AppContext
type Disbursement = {
  id: string;
  loanId: string;
  applicantName: string;
  productType: string;
  disbursementAmount: number;
  beneficiaryBank: string;
  accountNumber: string;
  currentStage: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Failed' | 'On Hold';
  scheduledDate: string;
  completedDate?: string;
  stages: DisbursementStage[];
  riskFlags: string[];
  branch?: string;
  contactNumber?: string;
  hasRepaymentSchedule?: boolean;
};

type DisbursementStage = {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  completedDate?: string;
  estimatedTime: string;
};

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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

interface RepaymentSchedule {
  disbursementId: string;
  customerName: string;
  loanAccount: string;
  dueDate: string;
  amount: number;
  branch: string;
  contactNumber: string;
}

export default function DisbursementJourneyPage() {
  const { disbursements, updateDisbursement, addRepayment } = useAppContext();

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDisbursement, setSelectedDisbursement] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [repaymentDate, setRepaymentDate] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    disbursementId: '', 
    applicantName: '' 
  });

  const disbursementStagesTemplate = [
    { id: '1', name: 'Final Verification', status: 'pending', estimatedTime: '2 hours' },
    { id: '2', name: 'Fund Allocation', status: 'pending', estimatedTime: '4 hours' },
    { id: '3', name: 'Compliance Check', status: 'pending', estimatedTime: '1 hour' },
    { id: '4', name: 'Payment Processing', status: 'pending', estimatedTime: '30 minutes' },
    { id: '5', name: 'Fund Transfer', status: 'pending', estimatedTime: '15 minutes' },
    { id: '6', name: 'Confirmation', status: 'pending', estimatedTime: '10 minutes' }
  ];

  const filteredDisbursements = disbursements.filter(disbursement => {
    return selectedStatus === 'All' || disbursement.status === selectedStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'On Hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageStatus = (stage: any) => {
    switch (stage.status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'current': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStageIcon = (stage: any) => {
    const baseClasses = "h-4 w-4";
    
    switch (stage.status) {
      case 'completed': return <CheckCircleIcon className={`${baseClasses} text-green-600`} />;
      case 'current': return <ClockIcon className={`${baseClasses} text-blue-600`} />;
      case 'pending': return <ClockIcon className={`${baseClasses} text-gray-400`} />;
      case 'failed': return <XCircleIcon className={`${baseClasses} text-red-600`} />;
      default: return <ClockIcon className={`${baseClasses} text-gray-400`} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-700 border border-red-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'Low': return 'bg-green-50 text-green-700 border border-green-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const totalDisbursements = disbursements.length;
  const completedDisbursements = disbursements.filter(d => d.status === 'Completed').length;
  const inProgressDisbursements = disbursements.filter(d => d.status === 'In Progress').length;
  const totalAmount = disbursements.reduce((sum, d) => sum + d.disbursementAmount, 0);

  const handleViewDisbursement = (disbursement: any) => {
    setSelectedDisbursement(disbursement);
    setShowModal(true);
  };

  const handleCreateRepayment = (disbursement: any) => {
    setSelectedDisbursement(disbursement);
    setShowRepaymentModal(true);
  };

  const handleCreateRepaymentSchedule = () => {
    if (!selectedDisbursement || !repaymentDate) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    // Create new repayment entry
    const newRepayment = {
      customerName: selectedDisbursement.applicantName,
      loanAccount: selectedDisbursement.loanId,
      dueDate: repaymentDate,
      amount: selectedDisbursement.disbursementAmount,
      status: "Pending" as const,
      branch: selectedDisbursement.branch || 'Main Branch',
      contactNumber: selectedDisbursement.contactNumber || '+91 9876543210'
    };

    addRepayment(newRepayment);

    // Update disbursement to mark that it has a repayment schedule
    updateDisbursement(selectedDisbursement.id, { hasRepaymentSchedule: true });

    addToast('Repayment schedule created successfully!', 'success');
    setShowRepaymentModal(false);
    setSelectedDisbursement(null);
    setRepaymentDate('');
  };

  const handleAdvanceStage = (disbursementId: string) => {
    const disbursement = disbursements.find(d => d.id === disbursementId);
    if (!disbursement) return;

    const currentStageIndex = disbursement.currentStage - 1;
    if (currentStageIndex >= disbursement.stages.length - 1) return;

    const updatedStages = disbursement.stages.map((stage, index) => {
      if (index === currentStageIndex) {
        return { ...stage, status: 'completed' as const, completedDate: new Date().toISOString() };
      } else if (index === currentStageIndex + 1) {
        return { ...stage, status: 'current' as const };
      }
      return stage;
    });

    const newStatus = disbursement.currentStage + 1 === disbursement.stages.length 
      ? 'Completed' 
      : 'In Progress';

    updateDisbursement(disbursementId, {
      currentStage: disbursement.currentStage + 1,
      stages: updatedStages,
      status: newStatus,
      ...(newStatus === 'Completed' ? { completedDate: new Date().toISOString() } : {})
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
  const openDeleteConfirm = (id: string, name: string) => {
    setConfirmDialog({ isOpen: true, disbursementId: id, applicantName: name });
  };

  const handleConfirmDelete = () => {
    // In a real app, you'd call deleteDisbursement here
    addToast(`Disbursement for ${confirmDialog.applicantName} has been deleted successfully`, 'success');
    setConfirmDialog({ isOpen: false, disbursementId: '', applicantName: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Disbursement Journey</h1>
          <p className="text-slate-600">Track and manage loan disbursement processes</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{totalDisbursements}</p>
              <p className="text-sm font-medium text-slate-600">Total Disbursements</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{completedDisbursements}</p>
              <p className="text-sm font-medium text-slate-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{inProgressDisbursements}</p>
              <p className="text-sm font-medium text-slate-600">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">₹{(totalAmount / 10000000).toFixed(1)}Cr</p>
              <p className="text-sm font-medium text-slate-600">Total Amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disbursements List */}
      <div className="space-y-6">
        {filteredDisbursements.map((disbursement) => (
          <div key={disbursement.id} className="bg-white shadow-lg rounded-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{disbursement.applicantName}</h3>
                    <p className="text-sm text-gray-600">{disbursement.productType} • ₹{disbursement.disbursementAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Disbursement ID: {disbursement.id} • Loan ID: {disbursement.loanId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(disbursement.priority)}`}>
                    {disbursement.priority} Priority
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(disbursement.status)}`}>
                    {disbursement.status}
                  </span>
                  {disbursement.hasRepaymentSchedule && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Repayment Created
                    </span>
                  )}
                </div>
              </div>

              {/* Risk Flags */}
              {disbursement.riskFlags && disbursement.riskFlags.length > 0 && (
                <div className="mt-3 flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">Risk Flags:</span>
                  {disbursement.riskFlags.map((flag, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                      {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="p-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Stage {disbursement.currentStage} of {disbursement.stages.length}</span>
                <span>{Math.round((disbursement.currentStage / disbursement.stages.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(disbursement.currentStage / disbursement.stages.length) * 100}%` }}
                ></div>
              </div>

              {/* Stages */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {disbursement.stages.map((stage: any, index: number) => (
                  <div
                    key={stage.id}
                    className={`border rounded-lg p-3 text-center ${getStageStatus(stage)}`}
                  >
                    <div className="flex justify-center mb-2">
                      {getStageIcon(stage)}
                    </div>
                    <p className="text-xs font-medium">{stage.name}</p>
                    <p className="text-xs mt-1 opacity-75">{stage.estimatedTime}</p>
                    {stage.completedDate && (
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(stage.completedDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {disbursement.branch && (
                    <span className="inline-flex items-center mr-4">
                      📍 {disbursement.branch}
                    </span>
                  )}
                  {disbursement.contactNumber && (
                    <span className="inline-flex items-center">
                      📞 {disbursement.contactNumber}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDisbursement(disbursement)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </button>
                  {disbursement.status === 'In Progress' && (
                    <button
                      onClick={() => handleAdvanceStage(disbursement.id)}
                      className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Advance Stage
                    </button>
                  )}
                  {disbursement.status === 'Completed' && !disbursement.hasRepaymentSchedule && (
                    <button
                      onClick={() => handleCreateRepayment(disbursement)}
                      className="px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      Create Repayment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDisbursements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-slate-200">
          <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No disbursements found</h3>
          <p className="text-gray-500">No disbursements match the current filter criteria.</p>
        </div>
      )}

      {/* View Details Modal */}
      {showModal && selectedDisbursement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Disbursement Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Disbursement Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Disbursement ID</label>
                    <p className="text-gray-900">{selectedDisbursement.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Loan ID</label>
                    <p className="text-gray-900">{selectedDisbursement.loanId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Applicant Name</label>
                    <p className="text-gray-900">{selectedDisbursement.applicantName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product Type</label>
                    <p className="text-gray-900">{selectedDisbursement.productType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="text-gray-900">₹{selectedDisbursement.disbursementAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bank Name</label>
                    <p className="text-gray-900">{selectedDisbursement.beneficiaryBank}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Number</label>
                    <p className="text-gray-900">{selectedDisbursement.accountNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Scheduled Date</label>
                    <p className="text-gray-900">{new Date(selectedDisbursement.scheduledDate).toLocaleDateString()}</p>
                  </div>
                  {selectedDisbursement.completedDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Completed Date</label>
                      <p className="text-gray-900">{new Date(selectedDisbursement.completedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedDisbursement.status)}`}>
                      {selectedDisbursement.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Disbursement Stages</h3>
              <div className="space-y-4">
                {selectedDisbursement.stages.map((stage: any, index: number) => (
                  <div key={stage.id} className={`border rounded-lg p-4 ${getStageStatus(stage)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStageIcon(stage)}
                        <div>
                          <p className="font-medium">{stage.name}</p>
                          <p className="text-sm opacity-75">Estimated: {stage.estimatedTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize">{stage.status}</p>
                        {stage.completedDate && (
                          <p className="text-xs opacity-75">
                            {new Date(stage.completedDate).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Repayment Modal */}
      {showRepaymentModal && selectedDisbursement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Repayment Schedule</h2>
              <button
                onClick={() => setShowRepaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Disbursement Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Customer:</span>
                  <span className="text-sm text-gray-900">{selectedDisbursement.applicantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Loan Account:</span>
                  <span className="text-sm text-gray-900">{selectedDisbursement.loanId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Disbursed Amount:</span>
                  <span className="text-sm text-gray-900">₹{selectedDisbursement.disbursementAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Branch:</span>
                  <span className="text-sm text-gray-900">{selectedDisbursement.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Contact:</span>
                  <span className="text-sm text-gray-900">{selectedDisbursement.contactNumber}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Repayment Due Date *
              </label>
              <input
                type="date"
                value={repaymentDate}
                onChange={(e) => setRepaymentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />
            </div>

            {repaymentDate && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Repayment Preview</h4>
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-blue-700">Customer:</span>
                    <span className="text-sm text-blue-900">{selectedDisbursement.applicantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-blue-700">Due Date:</span>
                    <span className="text-sm text-blue-900">{new Date(repaymentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-blue-700">Amount:</span>
                    <span className="text-sm text-blue-900">₹{selectedDisbursement.disbursementAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-blue-700">Days from today:</span>
                    <span className="text-sm text-blue-900">
                      {Math.ceil((new Date(repaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRepaymentModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRepaymentSchedule}
                disabled={!repaymentDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Repayment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false, disbursementId: '', applicantName: '' })}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the disbursement for ${confirmDialog.applicantName}?`}
        />
      )}
    </div>
  );
}
