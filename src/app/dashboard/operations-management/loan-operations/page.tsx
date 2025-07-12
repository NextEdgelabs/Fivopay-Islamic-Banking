"use client";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CalendarIcon,
  BanknotesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Application {
  id: string;
  customer_name: string;
  application_status: 'Pending' | 'Processing' | 'Approved' | 'Rejected';
  loan_type: 'Personal' | 'Business' | 'Secured' | 'Unsecured';
  application_date: string;
  processing_stage: number;
  assigned_processor: string;
  time_in_current_stage: string;
  sla_breach_alert: boolean;
  approval_level: number;
  approver_name: string;
  approval_limit: number;
  pending_approvals: number;
  disbursement_date?: string;
  disbursement_amount?: number;
  disbursement_method?: string;
  beneficiary_account?: string;
  disbursement_status?: string;
  processing_time?: string;
}

export default function LoanOperationsPage() {
  const [searchApplicationId, setSearchApplicationId] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("all");
  const [loanType, setLoanType] = useState("all");
  const [applicationDateRange, setApplicationDateRange] = useState({ start: "", end: "" });
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [approvalDecision, setApprovalDecision] = useState("");
  const [approvalComments, setApprovalComments] = useState("");
  const [nextApprover, setNextApprover] = useState("");
  const [disbursementDate, setDisbursementDate] = useState("");
  const [disbursementAmount, setDisbursementAmount] = useState("");
  const [disbursementMethod, setDisbursementMethod] = useState("");
  const [beneficiaryAccount, setBeneficiaryAccount] = useState("");

  const mockApplications: Application[] = [
    {
      id: "APP001",
      customer_name: "Rajesh Kumar",
      application_status: "Processing",
      loan_type: "Personal",
      application_date: "2024-01-15",
      processing_stage: 3,
      assigned_processor: "Priya Sharma",
      time_in_current_stage: "2 days",
      sla_breach_alert: false,
      approval_level: 2,
      approver_name: "Amit Patel",
      approval_limit: 500000,
      pending_approvals: 3,
    },
    {
      id: "APP002",
      customer_name: "Sunita Enterprises",
      application_status: "Pending",
      loan_type: "Business",
      application_date: "2024-01-14",
      processing_stage: 1,
      assigned_processor: "Rahul Verma",
      time_in_current_stage: "5 days",
      sla_breach_alert: true,
      approval_level: 1,
      approver_name: "Neha Singh",
      approval_limit: 1000000,
      pending_approvals: 1,
    },
    {
      id: "APP003",
      customer_name: "Vikram Singh",
      application_status: "Approved",
      loan_type: "Secured",
      application_date: "2024-01-10",
      processing_stage: 5,
      assigned_processor: "Anjali Desai",
      time_in_current_stage: "1 day",
      sla_breach_alert: false,
      approval_level: 3,
      approver_name: "Rajesh Mehta",
      approval_limit: 2000000,
      pending_approvals: 0,
      disbursement_date: "2024-01-20",
      disbursement_amount: 1500000,
      disbursement_method: "Transfer",
      beneficiary_account: "HDFC1234567890",
      disbursement_status: "Completed",
      processing_time: "10 days",
    },
  ];

  const filteredApplications = mockApplications.filter(app => {
    const matchesId = app.id.toLowerCase().includes(searchApplicationId.toLowerCase());
    const matchesName = app.customer_name.toLowerCase().includes(searchCustomerName.toLowerCase());
    const matchesStatus = applicationStatus === "all" || app.application_status === applicationStatus;
    const matchesType = loanType === "all" || app.loan_type === loanType;
    
    return matchesId && matchesName && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStageProgress = (stage: number) => {
    return (stage / 5) * 100;
  };

  const handleApprovalSubmit = () => {
    if (selectedApplication && approvalDecision) {
      // Handle approval logic here
      console.log("Approval submitted:", { selectedApplication, approvalDecision, approvalComments });
    }
  };

  const handleDisbursementSubmit = () => {
    if (selectedApplication && disbursementAmount && disbursementMethod) {
      // Handle disbursement logic here
      console.log("Disbursement submitted:", { selectedApplication, disbursementAmount, disbursementMethod });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Operations Dashboard</h1>
          <p className="text-gray-600">Monitor loan processing pipeline and approval workflows</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <ArrowPathIcon className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Application Pipeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Pipeline</h2>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Application ID"
                value={searchApplicationId}
                onChange={(e) => setSearchApplicationId(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Customer Name"
                value={searchCustomerName}
                onChange={(e) => setSearchCustomerName(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={applicationStatus}
              onChange={(e) => setApplicationStatus(e.target.value)}
              className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Personal">Personal</option>
              <option value="Business">Business</option>
              <option value="Secured">Secured</option>
              <option value="Unsecured">Unsecured</option>
            </select>
            
            <input
              type="date"
              value={applicationDateRange.start}
              onChange={(e) => setApplicationDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <input
              type="date"
              value={applicationDateRange.end}
              onChange={(e) => setApplicationDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time in Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.id}</div>
                        <div className="text-sm text-gray-500">{app.customer_name}</div>
                        <div className="text-xs text-gray-400">{app.loan_type} • {app.application_date}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.application_status)}`}>
                        {app.application_status}
                      </span>
                      {app.sla_breach_alert && (
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500 ml-1 inline" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getStageProgress(app.processing_stage)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Stage {app.processing_stage}/5</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{app.assigned_processor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{app.time_in_current_stage}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approval Workflow Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Workflow Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-600">Approval Level</div>
              <div className="text-2xl font-bold text-blue-900">2</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-600">Approver</div>
              <div className="text-lg font-semibold text-green-900">Amit Patel</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-purple-600">Approval Limit</div>
              <div className="text-lg font-semibold text-purple-900">₹5,00,000</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-orange-600">Pending Approvals</div>
              <div className="text-2xl font-bold text-orange-900">3</div>
            </div>
          </div>

          {selectedApplication && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Process Application: {selectedApplication.id}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approval Decision</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="approvalDecision"
                        value="approve"
                        onChange={(e) => setApprovalDecision(e.target.value)}
                        className="mr-2"
                      />
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                      Approve
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="approvalDecision"
                        value="reject"
                        onChange={(e) => setApprovalDecision(e.target.value)}
                        className="mr-2"
                      />
                      <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                      Reject
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="approvalDecision"
                        value="return"
                        onChange={(e) => setApprovalDecision(e.target.value)}
                        className="mr-2"
                      />
                      <ArrowPathIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      Return
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Approver</label>
                  <select
                    value={nextApprover}
                    onChange={(e) => setNextApprover(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Approver</option>
                    <option value="rajesh">Rajesh Mehta</option>
                    <option value="neha">Neha Singh</option>
                    <option value="amit">Amit Patel</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Comments</label>
                <textarea
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter approval comments..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleApprovalSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Decision
                </button>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disbursement Tracking */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Disbursement Tracking</h2>
          
          {selectedApplication && selectedApplication.application_status === "Approved" && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Process Disbursement: {selectedApplication.id}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disbursement Date</label>
                  <input
                    type="date"
                    value={disbursementDate}
                    onChange={(e) => setDisbursementDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disbursement Amount</label>
                  <div className="relative">
                    <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={disbursementAmount}
                      onChange={(e) => setDisbursementAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disbursement Method</label>
                  <select
                    value={disbursementMethod}
                    onChange={(e) => setDisbursementMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Beneficiary Account</label>
                  <input
                    type="text"
                    value={beneficiaryAccount}
                    onChange={(e) => setBeneficiaryAccount(e.target.value)}
                    placeholder="Enter account number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleDisbursementSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Process Disbursement
                </button>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {selectedApplication && selectedApplication.disbursement_status && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Disbursement Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <div className="font-medium">{selectedApplication.disbursement_status}</div>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <div className="font-medium">₹{selectedApplication.disbursement_amount?.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Method:</span>
                  <div className="font-medium">{selectedApplication.disbursement_method}</div>
                </div>
                <div>
                  <span className="text-gray-600">Processing Time:</span>
                  <div className="font-medium">{selectedApplication.processing_time}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
