/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import {
  BuildingOfficeIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
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

interface Branch {
  id: string;
  name: string;
  code: string;
  cashBalance: number;
  dailyDeposits: number;
  dailyWithdrawals: number;
  pendingTransactions: number;
  status: "active" | "low_cash" | "maintenance";
  lastReconciliation: string;
  manager: string;
  employeeCount: number;
}

export default function BranchDashboardPage() {
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [timeRange, setTimeRange] = useState("today");
  const [selectedBranchDetails, setSelectedBranchDetails] = useState<Branch | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    action: '', 
    message: ''
  });

  const branches: Branch[] = [
    {
      id: "1",
      name: "Mumbai Central",
      code: "B001",
      cashBalance: 2500000,
      dailyDeposits: 450000,
      dailyWithdrawals: 320000,
      pendingTransactions: 15,
      status: "active",
      lastReconciliation: "2024-01-15T18:00:00Z",
      manager: "Rajesh Kumar",
      employeeCount: 12,
    },
    {
      id: "2",
      name: "Delhi Main",
      code: "B002",
      cashBalance: 1800000,
      dailyDeposits: 380000,
      dailyWithdrawals: 420000,
      pendingTransactions: 8,
      status: "low_cash",
      lastReconciliation: "2024-01-15T17:30:00Z",
      manager: "Priya Sharma",
      employeeCount: 15,
    },
    {
      id: "3",
      name: "Bangalore Tech Park",
      code: "B003",
      cashBalance: 3200000,
      dailyDeposits: 520000,
      dailyWithdrawals: 280000,
      pendingTransactions: 22,
      status: "active",
      lastReconciliation: "2024-01-15T18:15:00Z",
      manager: "Amit Patel",
      employeeCount: 18,
    },
    {
      id: "4",
      name: "Chennai Central",
      code: "B004",
      cashBalance: 950000,
      dailyDeposits: 280000,
      dailyWithdrawals: 350000,
      pendingTransactions: 5,
      status: "low_cash",
      lastReconciliation: "2024-01-15T16:45:00Z",
      manager: "Lakshmi Devi",
      employeeCount: 10,
    },
  ];

  const filteredBranches = selectedBranch === "all" 
    ? branches 
    : branches.filter(b => b.id === selectedBranch);

  const totalCashBalance = branches.reduce((sum, branch) => sum + branch.cashBalance, 0);
  const totalDailyDeposits = branches.reduce((sum, branch) => sum + branch.dailyDeposits, 0);
  const totalDailyWithdrawals = branches.reduce((sum, branch) => sum + branch.dailyWithdrawals, 0);
  const totalPendingTransactions = branches.reduce((sum, branch) => sum + branch.pendingTransactions, 0);

  const lowCashBranches = branches.filter(b => b.status === "low_cash").length;

  const handleViewDetails = (branch: Branch) => {
    setSelectedBranchDetails(branch);
    setShowDetailsModal(true);
  };

  const branchDetails = {
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    phone: "+91 22 1234 5678",
    email: "mumbai.central@fivopay.com",
    operatingHours: "9:00 AM - 6:00 PM",
    services: ["Cash Deposits", "Withdrawals", "Transfers", "Account Opening", "Loan Processing"],
    facilities: ["ATM", "Safe Deposit Lockers", "Customer Lounge", "WiFi"],
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
  const openConfirm = (action: string, message: string) => {
    setConfirmDialog({ isOpen: true, action, message });
  };

  const handleConfirmAction = () => {
    addToast(`${confirmDialog.action} completed successfully!`, 'success');
    setConfirmDialog({ isOpen: false, action: '', message: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Cash Dashboard</h1>
          <p className="text-gray-600">
            Real-time cash management overview across all branches
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cash Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(totalCashBalance / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <BanknotesIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Deposits</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{(totalDailyDeposits / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <ArrowDownIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Withdrawals</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{(totalDailyWithdrawals / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg text-white">
              <ArrowUpIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Transactions</p>
              <p className="text-2xl font-bold text-yellow-600">
                {totalPendingTransactions}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg text-white">
              <ClockIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {lowCashBranches > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Low Cash Alert
              </h3>
              <p className="text-sm text-yellow-700">
                {lowCashBranches} branch(es) have low cash balance and may need replenishment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Branch Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                <p className="text-sm text-gray-600">Branch Code: {branch.code}</p>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  branch.status === "active"
                    ? "bg-green-100 text-green-800"
                    : branch.status === "low_cash"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {branch.status === "active" ? "Active" : 
                 branch.status === "low_cash" ? "Low Cash" : "Maintenance"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Cash Balance</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{(branch.cashBalance / 100000).toFixed(1)}L
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Manager</p>
                <p className="text-sm text-gray-900">{branch.manager}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Deposits</p>
                <p className="text-sm font-semibold text-green-600">
                  ₹{branch.dailyDeposits.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Withdrawals</p>
                <p className="text-sm font-semibold text-red-600">
                  ₹{branch.dailyWithdrawals.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{branch.employeeCount} employees</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {branch.pendingTransactions} pending
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewDetails(branch)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            {
              branch: "Mumbai Central",
              action: "Large withdrawal processed",
              amount: "₹2,50,000",
              time: "2 minutes ago",
              type: "withdrawal",
            },
            {
              branch: "Delhi Main",
              action: "Cash replenishment completed",
              amount: "₹5,00,000",
              time: "15 minutes ago",
              type: "deposit",
            },
            {
              branch: "Bangalore Tech Park",
              action: "Daily reconciliation completed",
              amount: "₹8,45,000",
              time: "1 hour ago",
              type: "reconciliation",
            },
            {
              branch: "Chennai Central",
              action: "Low cash alert triggered",
              amount: "₹95,000",
              time: "2 hours ago",
              type: "alert",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "withdrawal"
                      ? "bg-red-500"
                      : activity.type === "deposit"
                      ? "bg-green-500"
                      : activity.type === "reconciliation"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                  }`}
                />
                <div>
                  <p className="font-medium text-gray-900">{activity.branch}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{activity.amount}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Branch Details Modal */}
      {showDetailsModal && selectedBranchDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Branch Details - {selectedBranchDetails.name}
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
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Branch Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{selectedBranchDetails.name}</div>
                        <div className="text-sm text-gray-600">Code: {selectedBranchDetails.code}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <UserGroupIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Manager</div>
                        <div className="font-medium text-gray-900">{selectedBranchDetails.manager}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <UserGroupIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Employees</div>
                        <div className="font-medium text-gray-900">{selectedBranchDetails.employeeCount}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Cash Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Balance:</span>
                      <span className="font-semibold text-gray-900">
                        ₹{(selectedBranchDetails.cashBalance / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Daily Deposits:</span>
                      <span className="font-semibold text-green-600">
                        ₹{selectedBranchDetails.dailyDeposits.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Daily Withdrawals:</span>
                      <span className="font-semibold text-red-600">
                        ₹{selectedBranchDetails.dailyWithdrawals.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pending Transactions:</span>
                      <span className="font-semibold text-yellow-600">
                        {selectedBranchDetails.pendingTransactions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Address</div>
                        <div className="text-sm text-gray-900">{branchDetails.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="text-sm text-gray-900">{branchDetails.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="text-sm text-gray-900">{branchDetails.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Operating Hours</div>
                        <div className="text-sm text-gray-900">{branchDetails.operatingHours}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Services & Facilities</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Services</div>
                      <div className="flex flex-wrap gap-1">
                        {branchDetails.services.map((service, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Facilities</div>
                      <div className="flex flex-wrap gap-1">
                        {branchDetails.facilities.map((facility, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  View Transactions
                </button>
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Cash Replenishment
                </button>
                <button className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                  Generate Report
                </button>
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
        onClose={() => setConfirmDialog({ isOpen: false, action: '', message: '' })}
        onConfirm={handleConfirmAction}
        title={`Confirm Action`}
        message={confirmDialog.message}
      />
    </div>
  );
} 