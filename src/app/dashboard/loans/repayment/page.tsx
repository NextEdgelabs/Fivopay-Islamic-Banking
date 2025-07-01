/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import {
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ReceiptPercentIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface Repayment {
  id: string;
  customerName: string;
  loanAccount: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  paidDate?: string;
  receiptUrl?: string;
  branch: string;
  contactNumber: string;
}

interface NewRepayment {
  customerName: string;
  loanAccount: string;
  dueDate: string;
  amount: number;
  branch: string;
  contactNumber: string;
}

const repayments: Repayment[] = [
  {
    id: "1",
    customerName: "Ahmed Hassan",
    loanAccount: "LN001001",
    dueDate: "2024-01-05",
    amount: 25000,
    status: "Paid",
    paidDate: "2024-01-05",
    receiptUrl: "#",
    branch: "Main Branch",
    contactNumber: "+91 9876543210",
  },
  {
    id: "2",
    customerName: "Fatima Al-Zahra",
    loanAccount: "LN001002",
    dueDate: "2024-02-05",
    amount: 35000,
    status: "Pending",
    branch: "Downtown Branch",
    contactNumber: "+91 9876543211",
  },
  {
    id: "3",
    customerName: "Mohammad Ali",
    loanAccount: "LN001003",
    dueDate: "2024-03-05",
    amount: 45000,
    status: "Pending",
    branch: "Main Branch",
    contactNumber: "+91 9876543212",
  },
  {
    id: "4",
    customerName: "Sarah Khan",
    loanAccount: "LN001004",
    dueDate: "2023-12-05",
    amount: 28000,
    status: "Overdue",
    branch: "Downtown Branch",
    contactNumber: "+91 9876543213",
  },
  {
    id: "5",
    customerName: "Ibrahim Sheikh",
    loanAccount: "LN001005",
    dueDate: "2023-11-05",
    amount: 32000,
    status: "Overdue",
    branch: "Main Branch",
    contactNumber: "+91 9876543214",
  },
];

const branches = ["All Branches", "Main Branch", "Downtown Branch", "North Branch", "South Branch"];

export default function RepaymentJourneyPage() {
  const [showReceipt, setShowReceipt] = useState<Repayment | null>(null);
  const [showPayModal, setShowPayModal] = useState<Repayment | null>(null);
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [showNotificationModal, setShowNotificationModal] = useState<Repayment | null>(null);
  const [showCreateRepaymentModal, setShowCreateRepaymentModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newRepayment, setNewRepayment] = useState<NewRepayment>({
    customerName: '',
    loanAccount: '',
    dueDate: '',
    amount: 0,
    branch: 'Main Branch',
    contactNumber: ''
  });

  const filteredRepayments = selectedBranch === "All Branches" 
    ? repayments 
    : repayments.filter(r => r.branch === selectedBranch);

  const paidCount = filteredRepayments.filter(r => r.status === "Paid").length;
  const overdueCount = filteredRepayments.filter(r => r.status === "Overdue").length;
  const pendingCount = filteredRepayments.filter(r => r.status === "Pending").length;
  const totalAmount = filteredRepayments.reduce((sum, r) => sum + r.amount, 0);
  const collectedAmount = filteredRepayments.filter(r => r.status === "Paid").reduce((sum, r) => sum + r.amount, 0);

  const sendNotification = (repayment: Repayment) => {
    alert(`Notification sent to ${repayment.customerName} (${repayment.contactNumber}) for overdue payment of ₹${repayment.amount.toLocaleString()}`);
    setShowNotificationModal(null);
  };

  const handleCreateRepayment = () => {
    if (!newRepayment.customerName || !newRepayment.loanAccount || !newRepayment.dueDate || !newRepayment.amount || !newRepayment.contactNumber) {
      alert('Please fill in all required fields');
      return;
    }

    // Here you would typically send this data to your backend API
    console.log('Creating repayment:', newRepayment);
    
    alert(`Repayment created successfully!\nCustomer: ${newRepayment.customerName}\nLoan Account: ${newRepayment.loanAccount}\nDue Date: ${newRepayment.dueDate}\nAmount: ₹${newRepayment.amount.toLocaleString()}`);
    
    setShowCreateRepaymentModal(false);
    setNewRepayment({
      customerName: '',
      loanAccount: '',
      dueDate: '',
      amount: 0,
      branch: 'Main Branch',
      contactNumber: ''
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleBulkUpload = () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    // Here you would typically process the CSV/Excel file
    console.log('Processing bulk upload file:', selectedFile.name);
    
    alert(`Bulk repayment upload initiated!\nFile: ${selectedFile.name}\nProcessing ${Math.floor(Math.random() * 50) + 10} repayment entries...`);
    
    setShowBulkUploadModal(false);
    setSelectedFile(null);
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const template = `Customer Name,Loan Account,Due Date,Amount,Branch,Contact Number
Ahmed Hassan,LN001001,2024-02-15,25000,Main Branch,+91 9876543210
Fatima Al-Zahra,LN001002,2024-02-20,35000,Downtown Branch,+91 9876543211
Mohammad Ali,LN001003,2024-02-25,45000,Main Branch,+91 9876543212`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'repayment_bulk_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Branch Repayment Management</h1>
          <p className="text-slate-600">Monitor and manage loan repayments across all branches</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {branches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          <button 
            onClick={() => setShowCreateRepaymentModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Create Repayment</span>
          </button>
          <button 
            onClick={() => setShowBulkUploadModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <DocumentArrowUpIcon className="h-4 w-4" />
            <span>Bulk Upload</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-6 flex items-center">
          <BanknotesIcon className="h-8 w-8 text-blue-600 mr-4" />
          <div>
            <p className="text-2xl font-bold text-slate-900">₹{totalAmount.toLocaleString()}</p>
            <p className="text-sm text-slate-600">Total Due Amount</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex items-center">
          <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
          <div>
            <p className="text-2xl font-bold text-green-700">₹{collectedAmount.toLocaleString()}</p>
            <p className="text-sm text-slate-600">Amount Collected</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex items-center">
          <ArrowTrendingDownIcon className="h-8 w-8 text-yellow-500 mr-4" />
          <div>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-sm text-slate-600">Pending Payments</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex items-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-4" />
          <div>
            <p className="text-2xl font-bold text-red-700">{overdueCount}</p>
            <p className="text-sm text-slate-600">Overdue Accounts</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6" />
            <span>You have {overdueCount} overdue repayments requiring immediate attention.</span>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Send Bulk Notifications
          </button>
        </div>
      )}

      {/* Repayment Schedule Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Repayment Schedule</h2>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Generate Notices
            </button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Account</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRepayments.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{r.customerName}</div>
                    <div className="text-sm text-gray-500">{r.contactNumber}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.loanAccount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.branch}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.dueDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{r.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {r.status === "Paid" && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                  )}
                  {r.status === "Pending" && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                  )}
                  {r.status === "Overdue" && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {r.status === "Paid" && r.receiptUrl && (
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      title="View Receipt"
                      onClick={() => setShowReceipt(r)}
                    >
                      <ReceiptPercentIcon className="h-5 w-5" />
                    </button>
                  )}
                  {r.status !== "Paid" && (
                    <button
                      className="text-green-600 hover:text-green-900"
                      title="Record Payment"
                      onClick={() => setShowPayModal(r)}
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                  )}
                  {r.status === "Overdue" && (
                    <button
                      className="text-red-600 hover:text-red-900"
                      title="Send Notification"
                      onClick={() => setShowNotificationModal(r)}
                    >
                      <BellIcon className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Branch Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Branch Performance</h2>
          <div className="space-y-4">
            {["Main Branch", "Downtown Branch", "North Branch", "South Branch"].map((branch) => {
              const branchRepayments = repayments.filter(r => r.branch === branch);
              const branchCollected = branchRepayments.filter(r => r.status === "Paid").reduce((sum, r) => sum + r.amount, 0);
              const branchTotal = branchRepayments.reduce((sum, r) => sum + r.amount, 0);
              const collectionRate = branchTotal > 0 ? (branchCollected / branchTotal * 100).toFixed(1) : "0";
              
              return (
                <div key={branch} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{branch}</h3>
                    <p className="text-sm text-gray-500">Collection Rate: {collectionRate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{branchCollected.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">of ₹{branchTotal.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {filteredRepayments.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <div className={`w-2 h-2 rounded-full ${
                  r.status === "Paid" ? "bg-green-500" : 
                  r.status === "Pending" ? "bg-yellow-500" : "bg-red-500"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{r.customerName}</p>
                  <p className="text-xs text-gray-500">{r.branch} • {r.loanAccount}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₹{r.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{r.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Receipt</h3>
              <button onClick={() => setShowReceipt(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-700">Customer: <span className="font-medium">{showReceipt.customerName}</span></div>
              <div className="text-sm text-gray-700">Loan Account: <span className="font-medium">{showReceipt.loanAccount}</span></div>
              <div className="text-sm text-gray-700">Branch: <span className="font-medium">{showReceipt.branch}</span></div>
              <div className="text-sm text-gray-700">Due Date: <span className="font-medium">{showReceipt.dueDate}</span></div>
              <div className="text-sm text-gray-700">Amount: <span className="font-medium">₹{showReceipt.amount.toLocaleString()}</span></div>
              <div className="text-sm text-gray-700">Paid Date: <span className="font-medium">{showReceipt.paidDate}</span></div>
              <div className="text-sm text-gray-700">Status: <span className="font-medium text-green-700">Paid</span></div>
              <div className="pt-4">
                <a href={showReceipt.receiptUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Download Receipt</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Record Payment</h3>
              <button onClick={() => setShowPayModal(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-gray-700">Customer: <span className="font-medium">{showPayModal.customerName}</span></div>
              <div className="text-sm text-gray-700">Loan Account: <span className="font-medium">{showPayModal.loanAccount}</span></div>
              <div className="text-sm text-gray-700">Branch: <span className="font-medium">{showPayModal.branch}</span></div>
              <div className="text-sm text-gray-700">Due Date: <span className="font-medium">{showPayModal.dueDate}</span></div>
              <div className="text-sm text-gray-700">Amount: <span className="font-medium">₹{showPayModal.amount.toLocaleString()}</span></div>
              <div className="text-sm text-gray-700">Status: <span className={`font-medium ${showPayModal.status === "Overdue" ? "text-red-700" : "text-yellow-700"}`}>{showPayModal.status}</span></div>
              <div className="pt-4 flex space-x-2">
                <button
                  onClick={() => { alert("Payment recorded successfully!"); setShowPayModal(null); }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Record Payment
                </button>
                <button
                  onClick={() => setShowPayModal(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Notification</h3>
              <button onClick={() => setShowNotificationModal(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-gray-700">Customer: <span className="font-medium">{showNotificationModal.customerName}</span></div>
              <div className="text-sm text-gray-700">Contact: <span className="font-medium">{showNotificationModal.contactNumber}</span></div>
              <div className="text-sm text-gray-700">Overdue Amount: <span className="font-medium text-red-700">₹{showNotificationModal.amount.toLocaleString()}</span></div>
              <div className="text-sm text-gray-700">Due Date: <span className="font-medium">{showNotificationModal.dueDate}</span></div>
              <div className="pt-4 flex space-x-2">
                <button
                  onClick={() => sendNotification(showNotificationModal)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Send SMS
                </button>
                <button
                  onClick={() => sendNotification(showNotificationModal)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Email
                </button>
                <button
                  onClick={() => setShowNotificationModal(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Repayment Modal */}
      {showCreateRepaymentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Repayment</h3>
                <button 
                  onClick={() => setShowCreateRepaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={newRepayment.customerName}
                      onChange={(e) => setNewRepayment({...newRepayment, customerName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Account *
                    </label>
                    <input
                      type="text"
                      value={newRepayment.loanAccount}
                      onChange={(e) => setNewRepayment({...newRepayment, loanAccount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter loan account"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={newRepayment.dueDate}
                      onChange={(e) => setNewRepayment({...newRepayment, dueDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount *
                    </label>
                    <input
                      type="number"
                      value={newRepayment.amount || ''}
                      onChange={(e) => setNewRepayment({...newRepayment, amount: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch *
                    </label>
                    <select
                      value={newRepayment.branch}
                      onChange={(e) => setNewRepayment({...newRepayment, branch: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {branches.slice(1).map((branch) => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={newRepayment.contactNumber}
                      onChange={(e) => setNewRepayment({...newRepayment, contactNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
                
                {newRepayment.customerName && newRepayment.amount && newRepayment.dueDate && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Repayment Preview</h4>
                    <div className="text-sm text-blue-800">
                      <p>Customer: {newRepayment.customerName}</p>
                      <p>Loan Account: {newRepayment.loanAccount}</p>
                      <p>Due Date: {new Date(newRepayment.dueDate).toLocaleDateString()}</p>
                      <p>Amount: ₹{newRepayment.amount.toLocaleString()}</p>
                      <p>Branch: {newRepayment.branch}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleCreateRepayment}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Repayment
                  </button>
                  <button
                    onClick={() => setShowCreateRepaymentModal(false)}
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

      {/* Bulk Upload Repayment Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Bulk Upload Repayments</h3>
                <button 
                  onClick={() => setShowBulkUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Instructions</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Upload a CSV file with repayment data</li>
                    <li>• File should contain: Customer Name, Loan Account, Due Date, Amount, Branch, Contact Number</li>
                    <li>• Use the template below for correct format</li>
                    <li>• All dates should be in YYYY-MM-DD format</li>
                  </ul>
                </div>
                
                <div>
                  <button
                    onClick={downloadTemplate}
                    className="w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center justify-center space-x-2"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>Download Template</span>
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Sample Data Format</h4>
                  <div className="text-xs text-gray-600 font-mono">
                    <p>Customer Name,Loan Account,Due Date,Amount,Branch,Contact Number</p>
                    <p>Ahmed Hassan,LN001001,2024-02-15,25000,Main Branch,+91 9876543210</p>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleBulkUpload}
                    disabled={!selectedFile}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Upload & Process
                  </button>
                  <button
                    onClick={() => setShowBulkUploadModal(false)}
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