"use client";
import { useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { 
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ChartBarIcon,
  ArrowRightIcon,
  PlusIcon,
  XMarkIcon
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ApprovalProcessJourneyPage() {
  const { approvals, addApproval, updateApproval, deleteApproval } = useAppContext();
  
  const [filterStage, setFilterStage] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    approvalId: '', 
    applicantName: '' 
  });
  const [formData, setFormData] = useState({
    applicantName: '',
    productType: '',
    requestedAmount: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
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
  const openDeleteConfirm = (id: string, name: string) => {
    setConfirmDialog({ isOpen: true, approvalId: id, applicantName: name });
  };

  const handleConfirmDelete = () => {
    deleteApproval(confirmDialog.approvalId);
    addToast(`Approval for ${confirmDialog.applicantName} has been deleted successfully`, 'success');
    setConfirmDialog({ isOpen: false, approvalId: '', applicantName: '' });
  };

  const approvalStagesTemplate = [
    { id: '1', name: 'Document Verification', status: 'pending' as const },
    { id: '2', name: 'Credit Assessment', status: 'pending' as const },
    { id: '3', name: 'Sharia Compliance Review', status: 'pending' as const },
    { id: '4', name: 'Risk Assessment', status: 'pending' as const },
    { id: '5', name: 'Final Approval', status: 'pending' as const }
  ];

  const handleCreateApproval = () => {
    if (!formData.applicantName || !formData.productType || !formData.requestedAmount) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    const newApproval = {
      applicantName: formData.applicantName,
      productType: formData.productType,
      requestedAmount: parseInt(formData.requestedAmount),
      currentStage: 1,
      submissionDate: new Date().toISOString().split('T')[0],
      priority: formData.priority,
      stages: approvalStagesTemplate.map((stage, index) => ({
        ...stage,
        status: index === 0 ? 'current' as const : 'pending' as const
      }))
    };

    addApproval(newApproval);

    // Reset form
    setFormData({
      applicantName: '',
      productType: '',
      requestedAmount: '',
      priority: 'Medium'
    });
    setShowCreateModal(false);
    
    addToast(`Approval process for ${formData.applicantName} initiated successfully!`, 'success');
  };

  const handleAdvanceStage = (approvalId: string) => {
    const approval = approvals.find(a => a.id === approvalId);
    if (!approval) return;

    const currentStageIndex = approval.currentStage - 1;
    if (currentStageIndex >= approval.stages.length - 1) return;

    const updatedStages = approval.stages.map((stage, index) => {
      if (index === currentStageIndex) {
        return { ...stage, status: 'completed' as const, completedDate: new Date().toISOString() };
      } else if (index === currentStageIndex + 1) {
        return { ...stage, status: 'current' as const };
      }
      return stage;
    });

    updateApproval(approvalId, {
      currentStage: approval.currentStage + 1,
      stages: updatedStages
    });

    addToast('Stage advanced successfully!', 'success');
  };

  const getStageStatus = (stage: any) => {
    switch (stage.status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'current': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStageIcon = (stage: any) => {
    const baseClasses = "h-5 w-5";
    
    switch (stage.status) {
      case 'completed': return <CheckCircleIcon className={`${baseClasses} text-green-600`} />;
      case 'current': return <ClockIcon className={`${baseClasses} text-blue-600`} />;
      case 'pending': return <ClockIcon className={`${baseClasses} text-gray-400`} />;
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

  const filteredApprovals = filterStage === 'All' 
    ? approvals 
    : approvals.filter(approval => approval.currentStage === parseInt(filterStage));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Approval Process Journey</h1>
          <p className="text-slate-600">Track and manage loan applications through the approval pipeline</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Process Report
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Approval</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{approvals.length}</p>
              <p className="text-sm font-medium text-slate-600">In Approval</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">5.2 days</p>
              <p className="text-sm font-medium text-slate-600">Avg Time</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">87%</p>
              <p className="text-sm font-medium text-slate-600">Completion Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-50 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{approvals.filter(approval => approval.currentStage === 1).length}</p>
              <p className="text-sm font-medium text-slate-600">At Doc Review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Pipeline Overview */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Approval Pipeline Overview</h2>
        <div className="flex justify-between items-center space-x-4 overflow-x-auto pb-4">
          {approvalStagesTemplate.map((stage, index) => (
            <div key={stage.id} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white border-gray-300">
                  <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-2 text-center">{stage.name}</p>
              </div>
              {index < approvalStagesTemplate.length - 1 && (
                <ArrowRightIcon className="h-5 w-5 text-gray-400 mx-4 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Loans in Approval */}
      <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Applications in Approval</h2>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            >
              <option value="All">All Stages</option>
              <option value="1">Document Verification</option>
              <option value="2">Credit Assessment</option>
              <option value="3">Sharia Compliance</option>
              <option value="4">Risk Assessment</option>
              <option value="5">Final Approval</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredApprovals.map((loan) => (
            <div key={loan.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{loan.applicantName}</h3>
                  <p className="text-sm text-gray-600">{loan.productType} • ₹{loan.requestedAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Application ID: {loan.id} • Submitted: {new Date(loan.submissionDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(loan.priority)}`}>
                    {loan.priority} Priority
                  </span>
                  <button
                    onClick={() => handleAdvanceStage(loan.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Advance Stage
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Stage {loan.currentStage} of {loan.stages.length}</span>
                  <span>{Math.round((loan.currentStage / loan.stages.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(loan.currentStage / loan.stages.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Stages */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {loan.stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={`border rounded-lg p-3 text-center ${getStageStatus(stage)}`}
                  >
                    <div className="flex justify-center mb-2">
                      {getStageIcon(stage)}
                    </div>
                    <p className="text-xs font-medium">{stage.name}</p>
                    {stage.completedDate && (
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(stage.completedDate).toLocaleDateString()}
                      </p>
                    )}
                    {stage.assignee && (
                      <p className="text-xs mt-1 opacity-75">
                        {stage.assignee}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredApprovals.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">No applications match the current filter criteria.</p>
          </div>
        )}
      </div>

      {/* Create Approval Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Initiate Approval Process</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicant Name *
                </label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter applicant name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type *
                </label>
                <select
                  value={formData.productType}
                  onChange={(e) => setFormData({...formData, productType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                >
                  <option value="">Select product type</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Vehicle Loan">Vehicle Loan</option>
                  <option value="Education Loan">Education Loan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Amount *
                </label>
                <input
                  type="number"
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({...formData, requestedAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter requested amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateApproval}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Initiate Process
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false, approvalId: '', applicantName: '' })}
          onConfirm={handleConfirmDelete}
          title="Delete Approval"
          message={`Are you sure you want to delete the approval for ${confirmDialog.applicantName}?`}
        />
      )}
    </div>
  );
}
