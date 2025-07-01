/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
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

interface DisbursementStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  completedDate?: string;
  estimatedTime: string;
}

interface Disbursement {
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
}

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
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDisbursement, setSelectedDisbursement] = useState<Disbursement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [repaymentDate, setRepaymentDate] = useState('');

  const disbursementStagesTemplate: DisbursementStage[] = [
    { id: '1', name: 'Final Verification', status: 'pending', estimatedTime: '2 hours' },
    { id: '2', name: 'Fund Allocation', status: 'pending', estimatedTime: '4 hours' },
    { id: '3', name: 'Compliance Check', status: 'pending', estimatedTime: '1 hour' },
    { id: '4', name: 'Payment Processing', status: 'pending', estimatedTime: '30 minutes' },
    { id: '5', name: 'Fund Transfer', status: 'pending', estimatedTime: '15 minutes' },
    { id: '6', name: 'Confirmation', status: 'pending', estimatedTime: '10 minutes' }
  ];

  const disbursements: Disbursement[] = [
    {
      id: 'DB001',
      loanId: 'LN001',
      applicantName: 'Ahmed Hassan',
      productType: 'Personal Loan',
      disbursementAmount: 500000,
      beneficiaryBank: 'HDFC Bank',
      accountNumber: '****1234',
      currentStage: 4,
      priority: 'High',
      status: 'In Progress',
      scheduledDate: '2024-01-22',
      branch: 'Main Branch',
      contactNumber: '+91 9876543210',
      stages: [
        { ...disbursementStagesTemplate[0], status: 'completed', completedDate: '2024-01-22 09:00' },
        { ...disbursementStagesTemplate[1], status: 'completed', completedDate: '2024-01-22 10:30' },
        { ...disbursementStagesTemplate[2], status: 'completed', completedDate: '2024-01-22 11:00' },
        { ...disbursementStagesTemplate[3], status: 'current' },
        { ...disbursementStagesTemplate[4], status: 'pending' },
        { ...disbursementStagesTemplate[5], status: 'pending' }
      ],
      riskFlags: [],
      hasRepaymentSchedule: false
    },
    {
      id: 'DB002',
      loanId: 'LN002',
      applicantName: 'Fatima Al-Zahra',
      productType: 'Business Loan',
      disbursementAmount: 2000000,
      beneficiaryBank: 'SBI Bank',
      accountNumber: '****5678',
      currentStage: 6,
      priority: 'High',
      status: 'Completed',
      scheduledDate: '2024-01-20',
      completedDate: '2024-01-20 15:45',
      branch: 'Downtown Branch',
      contactNumber: '+91 9876543211',
      stages: [
        { ...disbursementStagesTemplate[0], status: 'completed', completedDate: '2024-01-20 09:00' },
        { ...disbursementStagesTemplate[1], status: 'completed', completedDate: '2024-01-20 11:00' },
        { ...disbursementStagesTemplate[2], status: 'completed', completedDate: '2024-01-20 12:00' },
        { ...disbursementStagesTemplate[3], status: 'completed', completedDate: '2024-01-20 14:30' },
        { ...disbursementStagesTemplate[4], status: 'completed', completedDate: '2024-01-20 15:30' },
        { ...disbursementStagesTemplate[5], status: 'completed', completedDate: '2024-01-20 15:45' }
      ],
      riskFlags: [],
      hasRepaymentSchedule: true
    },
    {
      id: 'DB003',
      loanId: 'LN003',
      applicantName: 'Mohammad Ali',
      productType: 'Home Loan',
      disbursementAmount: 5000000,
      beneficiaryBank: 'Axis Bank',
      accountNumber: '****3456',
      currentStage: 2,
      priority: 'Low',
      status: 'On Hold',
      scheduledDate: '2024-01-21',
      branch: 'Main Branch',
      contactNumber: '+91 9876543212',
      stages: [
        { ...disbursementStagesTemplate[0], status: 'completed', completedDate: '2024-01-21 09:00' },
        { ...disbursementStagesTemplate[1], status: 'failed' },
        { ...disbursementStagesTemplate[2], status: 'pending' },
        { ...disbursementStagesTemplate[3], status: 'pending' },
        { ...disbursementStagesTemplate[4], status: 'pending' },
        { ...disbursementStagesTemplate[5], status: 'pending' }
      ],
      riskFlags: ['Insufficient Funds', 'Bank Holiday'],
      hasRepaymentSchedule: false
    }
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

  const getStageStatus = (stage: DisbursementStage) => {
    switch (stage.status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'current': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStageIcon = (stage: DisbursementStage) => {
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
  const totalDisbursedAmount = disbursements
    .filter(d => d.status === 'Completed')
    .reduce((sum, d) => sum + d.disbursementAmount, 0);

  const handleViewDisbursement = (disbursement: Disbursement) => {
    setSelectedDisbursement(disbursement);
    setShowModal(true);
  };

  const handleCreateRepayment = (disbursement: Disbursement) => {
    setSelectedDisbursement(disbursement);
    setShowRepaymentModal(true);
    setRepaymentDate('');
  };

  const handleCreateRepaymentSchedule = () => {
    if (!selectedDisbursement || !repaymentDate) {
      alert('Please select a repayment date');
      return;
    }

    const repaymentSchedule: RepaymentSchedule = {
      disbursementId: selectedDisbursement.id,
      customerName: selectedDisbursement.applicantName,
      loanAccount: selectedDisbursement.loanId,
      dueDate: repaymentDate,
      amount: selectedDisbursement.disbursementAmount,
      branch: selectedDisbursement.branch || 'Main Branch',
      contactNumber: selectedDisbursement.contactNumber || '+91 9876543210'
    };

    // Here you would typically send this data to your backend API
    console.log('Creating repayment schedule:', repaymentSchedule);
    
    alert(`Repayment schedule created successfully for ${selectedDisbursement.applicantName}!\nDue Date: ${repaymentDate}\nAmount: ₹${selectedDisbursement.disbursementAmount.toLocaleString()}`);
    
    setShowRepaymentModal(false);
    setSelectedDisbursement(null);
    setRepaymentDate('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Disbursement Journey</h1>
          <p className="text-slate-600">Monitor and manage loan fund disbursements</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowDownTrayIcon className="h-4 w-4 inline mr-2" />
            Export Report
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Schedule Disbursement
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
              <p className="text-2xl font-bold text-slate-900">₹{(totalDisbursedAmount / 10000000).toFixed(1)}Cr</p>
              <p className="text-sm font-medium text-slate-600">Total Disbursed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disbursement Process Overview */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Disbursement Process Flow</h2>
        <div className="flex justify-between items-center space-x-4 overflow-x-auto pb-4">
          {disbursementStagesTemplate.map((stage, index) => (
            <div key={stage.id} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-2 text-center max-w-20">{stage.name}</p>
                <p className="text-xs text-gray-500 text-center max-w-24">{stage.estimatedTime}</p>
              </div>
              {index < disbursementStagesTemplate.length - 1 && (
                <ArrowRightIcon className="h-5 w-5 text-gray-400 mx-4 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Disbursements</h2>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
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

      {/* Disbursements List */}
      <div className="space-y-4">
        {filteredDisbursements.map((disbursement) => (
          <div key={disbursement.id} className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BanknotesIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{disbursement.applicantName}</h3>
                  <p className="text-sm text-gray-500">{disbursement.id} • {disbursement.productType}</p>
                  <p className="text-sm font-medium text-gray-900">₹{disbursement.disbursementAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(disbursement.status)}`}>
                  {disbursement.status}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(disbursement.priority)}`}>
                  {disbursement.priority}
                </span>
                {disbursement.hasRepaymentSchedule && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    Repayment Created
                  </span>
                )}
              </div>
            </div>

            {/* Bank Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Bank:</span>
                <span className="ml-2 font-medium text-slate-600">{disbursement.beneficiaryBank}</span>
              </div>
              <div>
                <span className="text-gray-500">Account:</span>
                <span className="ml-2 font-medium text-slate-600">{disbursement.accountNumber}</span>
              </div>
              <div>
                <span className="text-gray-500">Scheduled:</span>
                <span className="ml-2 font-medium text-slate-600">{new Date(disbursement.scheduledDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Progress</span>
                <span className="text-gray-500">Stage {disbursement.currentStage} of {disbursement.stages.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    disbursement.status === 'Failed' || disbursement.status === 'On Hold' 
                      ? 'bg-red-500' 
                      : disbursement.status === 'Completed' 
                      ? 'bg-green-500' 
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${(disbursement.currentStage / disbursement.stages.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Risk Flags */}
            {disbursement.riskFlags.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Risk Flags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {disbursement.riskFlags.map((flag, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Current Stage */}
            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {disbursement.stages.map((stage, index) => (
                  <div 
                    key={stage.id}
                    className={`p-2 rounded-lg border text-center ${getStageStatus(stage)}`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {getStageIcon(stage)}
                    </div>
                    <p className="text-xs font-medium">{stage.name}</p>
                    {stage.completedDate && (
                      <p className="text-xs mt-1">{stage.completedDate}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => handleViewDisbursement(disbursement)}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center space-x-1"
              >
                <EyeIcon className="h-4 w-4" />
                <span>View Details</span>
              </button>
              
              {disbursement.status === 'Completed' && !disbursement.hasRepaymentSchedule && (
                <button 
                  onClick={() => handleCreateRepayment(disbursement)}
                  className="bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors text-sm flex items-center space-x-1"
                >
                  <CalendarDaysIcon className="h-4 w-4" />
                  <span>Create Repayment</span>
                </button>
              )}
              
              {disbursement.status === 'On Hold' && (
                <button className="bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm">
                  Resume
                </button>
              )}
              {disbursement.status === 'Failed' && (
                <button className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors text-sm">
                  Retry
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDisbursements.length === 0 && (
        <div className="text-center py-12">
          <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No disbursements found</h3>
          <p className="text-gray-500">No disbursements match the selected criteria.</p>
        </div>
      )}

      {/* Disbursement Details Modal */}
      {showModal && selectedDisbursement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Disbursement Details</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Disbursement ID</label>
                    <p className="text-sm text-gray-900">{selectedDisbursement.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Loan ID</label>
                    <p className="text-sm text-gray-900">{selectedDisbursement.loanId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Applicant</label>
                    <p className="text-sm text-gray-900">{selectedDisbursement.applicantName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="text-sm text-gray-900">₹{selectedDisbursement.disbursementAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Beneficiary Bank</label>
                    <p className="text-sm text-gray-900">{selectedDisbursement.beneficiaryBank}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedDisbursement.status)}`}>
                      {selectedDisbursement.status}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Stage Progress</h4>
                  <div className="space-y-2">
                    {selectedDisbursement.stages.map((stage, index) => (
                      <div key={stage.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          {getStageIcon(stage)}
                          <span className="text-sm">{stage.name}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {stage.completedDate || stage.estimatedTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Repayment Modal */}
      {showRepaymentModal && selectedDisbursement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create Repayment Schedule</h3>
                <button 
                  onClick={() => setShowRepaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Disbursement Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <span className="ml-2 font-medium">{selectedDisbursement.applicantName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Loan Account:</span>
                      <span className="ml-2 font-medium">{selectedDisbursement.loanId}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Principal Amount:</span>
                      <span className="ml-2 font-medium">₹{selectedDisbursement.disbursementAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Branch:</span>
                      <span className="ml-2 font-medium">{selectedDisbursement.branch}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Repayment Due Date
                  </label>
                  <input
                    type="date"
                    value={repaymentDate}
                    onChange={(e) => setRepaymentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {repaymentDate && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Repayment Preview</h4>
                    <div className="text-sm text-blue-800">
                      <p>Customer: {selectedDisbursement.applicantName}</p>
                      <p>Due Date: {new Date(repaymentDate).toLocaleDateString()}</p>
                      <p>Amount: ₹{selectedDisbursement.disbursementAmount.toLocaleString()}</p>
                      <p>Days from now: {Math.ceil((new Date(repaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</p>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleCreateRepaymentSchedule}
                    disabled={!repaymentDate}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Create Repayment
                  </button>
                  <button
                    onClick={() => setShowRepaymentModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
