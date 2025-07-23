
"use client";
import { useState } from "react";
import {
  DocumentChartBarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  XMarkIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
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

interface LiquidityData {
  date: string;
  cashBalance: number;
  deposits: number;
  withdrawals: number;
  netFlow: number;
  liquidityRatio: number;
  branch: string;
}

export default function LiquidityReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    action: '', 
    message: ''
  });

  const liquidityData: LiquidityData[] = [
    {
      date: "2024-01-15",
      cashBalance: 8450000,
      deposits: 1250000,
      withdrawals: 980000,
      netFlow: 270000,
      liquidityRatio: 0.85,
      branch: "All Branches",
    },
    {
      date: "2024-01-14",
      cashBalance: 8180000,
      deposits: 1100000,
      withdrawals: 1050000,
      netFlow: 50000,
      liquidityRatio: 0.82,
      branch: "All Branches",
    },
    {
      date: "2024-01-13",
      cashBalance: 8130000,
      deposits: 1350000,
      withdrawals: 920000,
      netFlow: 430000,
      liquidityRatio: 0.84,
      branch: "All Branches",
    },
    {
      date: "2024-01-12",
      cashBalance: 7700000,
      deposits: 980000,
      withdrawals: 1150000,
      netFlow: -170000,
      liquidityRatio: 0.78,
      branch: "All Branches",
    },
    {
      date: "2024-01-11",
      cashBalance: 7870000,
      deposits: 1200000,
      withdrawals: 870000,
      netFlow: 330000,
      liquidityRatio: 0.81,
      branch: "All Branches",
    },
  ];

  const branchLiquidity = [
    {
      branch: "Mumbai Central",
      cashBalance: 2500000,
      dailyAverage: 450000,
      liquidityRatio: 0.88,
      status: "excellent",
    },
    {
      branch: "Delhi Main",
      cashBalance: 1800000,
      dailyAverage: 380000,
      liquidityRatio: 0.72,
      status: "warning",
    },
    {
      branch: "Bangalore Tech Park",
      cashBalance: 3200000,
      dailyAverage: 520000,
      liquidityRatio: 0.91,
      status: "excellent",
    },
    {
      branch: "Chennai Central",
      cashBalance: 950000,
      dailyAverage: 280000,
      liquidityRatio: 0.65,
      status: "critical",
    },
  ];

  // Helper function to check if a date is within range
  const isDateInRange = (dataDate: string, start: string, end: string) => {
    if (!start && !end) return true; // No date filter applied
    
    const data = new Date(dataDate);
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end + 'T23:59:59') : null; // Include entire end date
    
    if (startDate && endDate) {
      return data >= startDate && data <= endDate;
    } else if (startDate) {
      return data >= startDate;
    } else if (endDate) {
      return data <= endDate;
    }
    
    return true;
  };

  // Filter liquidity data based on date range
  const filteredLiquidityData = liquidityData.filter(data => 
    isDateInRange(data.date, startDate, endDate)
  );

  const currentLiquidity = filteredLiquidityData[0] || liquidityData[0];
  const averageLiquidityRatio = filteredLiquidityData.length > 0 
    ? filteredLiquidityData.reduce((sum, data) => sum + data.liquidityRatio, 0) / filteredLiquidityData.length
    : liquidityData.reduce((sum, data) => sum + data.liquidityRatio, 0) / liquidityData.length;

  // Clear all filters
  const clearFilters = () => {
    setSelectedPeriod("7d");
    setSelectedBranch("all");
    setStartDate("");
    setEndDate("");
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
          <h1 className="text-2xl font-bold text-gray-900">Liquidity Report</h1>
          <p className="text-gray-600">
            Comprehensive cash liquidity analysis and forecasting
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            {showDetailedView ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
            <span>{showDetailedView ? "Hide Details" : "Show Details"}</span>
          </button>
          <button className="flex items-center space-x-2 text-green-600 hover:text-green-800">
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Basic Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Branches</option>
                <option value="mumbai">Mumbai Central</option>
                <option value="delhi">Delhi Main</option>
                <option value="bangalore">Bangalore Tech Park</option>
                <option value="chennai">Chennai Central</option>
              </select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Custom Date Range:</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          </div>

          {/* Filter Summary */}
          {(selectedPeriod !== "7d" || selectedBranch !== "all" || startDate || endDate) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-700">Active Filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedPeriod !== "7d" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Period: {selectedPeriod === "30d" ? "Last 30 Days" : selectedPeriod === "90d" ? "Last 90 Days" : "Last Year"}
                      </span>
                    )}
                    {selectedBranch !== "all" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Branch: {selectedBranch.charAt(0).toUpperCase() + selectedBranch.slice(1)}
                      </span>
                    )}
                    {startDate && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        From: {new Date(startDate).toLocaleDateString()}
                      </span>
                    )}
                    {endDate && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        To: {new Date(endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-blue-600">
                  {filteredLiquidityData.length} of {liquidityData.length} records
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Cash Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(currentLiquidity.cashBalance / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <DocumentChartBarIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Liquidity Ratio</p>
              <p className="text-2xl font-bold text-gray-900">
                {(currentLiquidity.liquidityRatio * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <ArrowTrendingUpIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Cash Flow</p>
              <p className={`text-2xl font-bold ${
                currentLiquidity.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{(currentLiquidity.netFlow / 1000).toFixed(0)}K
              </p>
            </div>
            <div className={`p-3 rounded-lg text-white ${
              currentLiquidity.netFlow >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {currentLiquidity.netFlow >= 0 ? (
                <ArrowTrendingUpIcon className="h-6 w-6" />
              ) : (
                <ArrowTrendingDownIcon className="h-6 w-6" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Liquidity Ratio</p>
              <p className="text-2xl font-bold text-gray-900">
                {(averageLiquidityRatio * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg text-white">
              <ChartBarIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Liquidity Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Liquidity Alerts</h2>
        <div className="space-y-4">
          {branchLiquidity
            .filter(branch => branch.status !== "excellent")
            .map((branch, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  branch.status === "critical"
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className={`h-5 w-5 ${
                      branch.status === "critical" ? "text-red-400" : "text-yellow-400"
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{branch.branch}</h3>
                      <p className="text-sm text-gray-600">
                        Liquidity ratio: {(branch.liquidityRatio * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      branch.status === "critical"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {branch.status === "critical" ? "Critical" : "Warning"}
                  </span>
                </div>
              </div>
            ))}
          {branchLiquidity.filter(branch => branch.status !== "excellent").length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-2 text-green-400" />
              <p>All branches have excellent liquidity ratios</p>
            </div>
          )}
        </div>
      </div>

      {/* Branch-wise Liquidity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Branch-wise Liquidity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cash Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daily Average
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liquidity Ratio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branchLiquidity.map((branch, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{branch.branch}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ₹{(branch.cashBalance / 100000).toFixed(1)}L
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ₹{branch.dailyAverage.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {(branch.liquidityRatio * 100).toFixed(1)}%
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            branch.liquidityRatio >= 0.8
                              ? "bg-green-500"
                              : branch.liquidityRatio >= 0.6
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${branch.liquidityRatio * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        branch.status === "excellent"
                          ? "bg-green-100 text-green-800"
                          : branch.status === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View */}
      {showDetailedView && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Liquidity History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cash Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deposits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Withdrawals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Flow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liquidity Ratio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLiquidityData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(data.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(data.cashBalance / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      ₹{(data.deposits / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      ₹{(data.withdrawals / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${
                        data.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₹{(data.netFlow / 1000).toFixed(0)}K
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(data.liquidityRatio * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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