"use client";
import { useState } from "react";
import { 
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ChartBarIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

interface ApprovalStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending';
  assignee?: string;
  completedDate?: string;
}

interface LoanInApproval {
  id: string;
  applicantName: string;
  productType: string;
  requestedAmount: number;
  currentStage: number;
  submissionDate: string;
  priority: 'High' | 'Medium' | 'Low';
  stages: ApprovalStage[];
}

export default function ApprovalProcessJourneyPage() {
  const [filterStage, setFilterStage] = useState('All');

  const approvalStagesTemplate: ApprovalStage[] = [
    { id: '1', name: 'Document Verification', status: 'pending' },
    { id: '2', name: 'Credit Assessment', status: 'pending' },
    { id: '3', name: 'Sharia Compliance Review', status: 'pending' },
    { id: '4', name: 'Risk Assessment', status: 'pending' },
    { id: '5', name: 'Final Approval', status: 'pending' }
  ];

  const loansInApproval: LoanInApproval[] = [
    {
      id: 'LN001',
      applicantName: 'Ahmed Hassan',
      productType: 'Personal Loan',
      requestedAmount: 500000,
      currentStage: 2,
      submissionDate: '2024-01-20',
      priority: 'High',
      stages: [
        { ...approvalStagesTemplate[0], status: 'completed', completedDate: '2024-01-21', assignee: 'Sara Ahmed' },
        { ...approvalStagesTemplate[1], status: 'current', assignee: 'Omar Ali' },
        { ...approvalStagesTemplate[2], status: 'pending' },
        { ...approvalStagesTemplate[3], status: 'pending' },
        { ...approvalStagesTemplate[4], status: 'pending' }
      ]
    },
    {
      id: 'LN002',
      applicantName: 'Fatima Al-Zahra',
      productType: 'Business Loan',
      requestedAmount: 2000000,
      currentStage: 3,
      submissionDate: '2024-01-18',
      priority: 'High',
      stages: [
        { ...approvalStagesTemplate[0], status: 'completed', completedDate: '2024-01-19', assignee: 'Sara Ahmed' },
        { ...approvalStagesTemplate[1], status: 'completed', completedDate: '2024-01-20', assignee: 'Omar Ali' },
        { ...approvalStagesTemplate[2], status: 'current', assignee: 'Dr. Hassan Sheikh' },
        { ...approvalStagesTemplate[3], status: 'pending' },
        { ...approvalStagesTemplate[4], status: 'pending' }
      ]
    }
  ];

  const getStageStatus = (stage: ApprovalStage) => {
    switch (stage.status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'current': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStageIcon = (stage: ApprovalStage) => {
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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Bulk Actions
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
              <p className="text-2xl font-bold text-slate-900">{loansInApproval.length}</p>
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
              <p className="text-2xl font-bold text-slate-900">{loansInApproval.filter(loan => loan.currentStage === 1).length}</p>
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
              className="px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
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
          {loansInApproval.map((loan) => (
            <div key={loan.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{loan.applicantName}</h3>
                    <p className="text-sm text-gray-500">{loan.id} • {loan.productType}</p>
                    <p className="text-sm font-medium text-gray-900">₹{loan.requestedAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(loan.priority)}`}>
                    {loan.priority} Priority
                  </span>
                  <span className="text-sm text-gray-500">
                    Stage {loan.currentStage} of {loan.stages.length}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="text-gray-500">{Math.round((loan.currentStage / loan.stages.length) * 100)}%</span>
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
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${getStageStatus(stage)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStageIcon(stage)}
                        <span className="text-sm font-medium">{stage.name}</span>
                      </div>
                      <span className="text-xs font-medium">
                        Stage {index + 1}
                      </span>
                    </div>
                    
                    {stage.assignee && (
                      <p className="text-xs font-medium text-gray-700">
                        Assignee: {stage.assignee}
                      </p>
                    )}
                    
                    {stage.completedDate && stage.status === 'completed' && (
                      <p className="text-xs text-green-600 font-medium">
                        Completed: {stage.completedDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                  View Details
                </button>
                <button className="bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm">
                  Advance Stage
                </button>
                <button className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors text-sm">
                  Request Info
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loansInApproval.length === 0 && (
        <div className="text-center py-12">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications in approval</h3>
          <p className="text-gray-500">All applications have been processed or are waiting for submission.</p>
        </div>
      )}
    </div>
  );
}
