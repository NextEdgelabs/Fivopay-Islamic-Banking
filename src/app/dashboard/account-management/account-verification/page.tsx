"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  DocumentTextIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

interface PendingVerification {
  id: string;
  accountNumber: string;
  customerName: string;
  email: string;
  phone: string;
  accountType: string;
  submissionDate: string;
  priority: 'High' | 'Medium' | 'Low';
  kycStatus: 'Pending' | 'Under Review' | 'Rejected' | 'Approved';
  documents: {
    panCard: { status: 'Pending' | 'Verified' | 'Rejected'; remarks?: string };
    aadharCard: { status: 'Pending' | 'Verified' | 'Rejected'; remarks?: string };
    addressProof: { status: 'Pending' | 'Verified' | 'Rejected'; remarks?: string };
    incomeProof: { status: 'Pending' | 'Verified' | 'Rejected'; remarks?: string };
  };
  riskFlags: string[];
  branch: string;
  initialDeposit: number;
}

export default function AccountVerificationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAccount, setSelectedAccount] = useState<PendingVerification | null>(null);
  const [showModal, setShowModal] = useState(false);

  const pendingAccounts: PendingVerification[] = [
    {
      id: '1',
      accountNumber: 'FP001234567890',
      customerName: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+91 98765 43210',
      accountType: 'Savings',
      submissionDate: '2024-01-20',
      priority: 'High',
      kycStatus: 'Under Review',
      documents: {
        panCard: { status: 'Verified' },
        aadharCard: { status: 'Verified' },
        addressProof: { status: 'Pending' },
        incomeProof: { status: 'Verified' }
      },
      riskFlags: [],
      branch: 'Mumbai Central',
      initialDeposit: 50000
    },
    {
      id: '2',
      accountNumber: 'FP001234567891',
      customerName: 'Fatima Al-Zahra',
      email: 'fatima.zahra@email.com',
      phone: '+91 98765 43211',
      accountType: 'Business',
      submissionDate: '2024-01-18',
      priority: 'High',
      kycStatus: 'Pending',
      documents: {
        panCard: { status: 'Pending' },
        aadharCard: { status: 'Pending' },
        addressProof: { status: 'Pending' },
        incomeProof: { status: 'Pending' }
      },
      riskFlags: ['High Value Transaction'],
      branch: 'Delhi Main',
      initialDeposit: 1000000
    },
    {
      id: '3',
      accountNumber: 'FP001234567892',
      customerName: 'Mohammad Ali',
      email: 'mohammad.ali@email.com',
      phone: '+91 98765 43212',
      accountType: 'Current',
      submissionDate: '2024-01-15',
      priority: 'Medium',
      kycStatus: 'Rejected',
      documents: {
        panCard: { status: 'Verified' },
        aadharCard: { status: 'Rejected', remarks: 'Invalid document format' },
        addressProof: { status: 'Pending' },
        incomeProof: { status: 'Verified' }
      },
      riskFlags: ['Document Mismatch'],
      branch: 'Bangalore Tech',
      initialDeposit: 25000
    }
  ];

  const filteredAccounts = pendingAccounts.filter(account => {
    const matchesSearch = account.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || account.kycStatus === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'Low':
        return 'bg-green-50 text-green-700 border border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'Under Review':
        return <DocumentTextIcon className="h-4 w-4 text-blue-500" />;
      case 'Approved':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleViewAccount = (account: PendingVerification) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const totalPending = pendingAccounts.length;
  const underReview = pendingAccounts.filter(acc => acc.kycStatus === 'Under Review').length;
  const highPriority = pendingAccounts.filter(acc => acc.priority === 'High').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/account-management" className="text-slate-500 hover:text-slate-700">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Account Verification</h1>
            <p className="text-slate-600">Review and verify customer KYC documents</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{totalPending}</p>
              <p className="text-sm font-medium text-slate-600">Pending Verification</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{underReview}</p>
              <p className="text-sm font-medium text-slate-600">Under Review</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{highPriority}</p>
              <p className="text-sm font-medium text-slate-600">High Priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by customer name or account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Verification Queue */}
      <div className="space-y-4">
        {filteredAccounts.map((account) => (
          <div key={account.id} className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{account.customerName}</h3>
                  <p className="text-sm text-slate-500">{account.accountNumber} • {account.accountType}</p>
                  <p className="text-sm text-slate-600">{account.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(account.kycStatus)}`}>
                  {getStatusIcon(account.kycStatus)}
                  <span className="ml-1">{account.kycStatus}</span>
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(account.priority)}`}>
                  {account.priority}
                </span>
              </div>
            </div>

            {/* Document Status */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-900 mb-2">Document Status</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-xs text-slate-600">PAN Card</span>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getDocumentStatusBadge(account.documents.panCard.status)}`}>
                    {account.documents.panCard.status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-xs text-slate-600">Aadhar Card</span>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getDocumentStatusBadge(account.documents.aadharCard.status)}`}>
                    {account.documents.aadharCard.status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-xs text-slate-600">Address Proof</span>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getDocumentStatusBadge(account.documents.addressProof.status)}`}>
                    {account.documents.addressProof.status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-xs text-slate-600">Income Proof</span>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getDocumentStatusBadge(account.documents.incomeProof.status)}`}>
                    {account.documents.incomeProof.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Flags */}
            {account.riskFlags.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Risk Flags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {account.riskFlags.map((flag, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => handleViewAccount(account)}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center space-x-1"
              >
                <EyeIcon className="h-4 w-4" />
                <span>Review</span>
              </button>
              <button className="bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm">
                Approve
              </button>
              <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Review Modal */}
      {showModal && selectedAccount && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-900">Document Review - {selectedAccount.customerName}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Account Number</label>
                    <p className="text-sm text-slate-900">{selectedAccount.accountNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Customer Name</label>
                    <p className="text-sm text-slate-900">{selectedAccount.customerName}</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Document Status</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedAccount.documents).map(([docType, doc]) => (
                      <div key={docType} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-sm capitalize">{docType.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getDocumentStatusBadge(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Approve Account
                  </button>
                  <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    Reject Account
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