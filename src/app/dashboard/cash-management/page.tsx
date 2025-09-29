
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  WalletIcon,
  ArrowsRightLeftIcon,
  PresentationChartLineIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
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

export default function CashManagementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    action: '', 
    message: ''
  });

  const overviewCards = [
    {
      title: "Total Cash Position",
      value: "₹2,45,67,890",
      change: "+12.5%",
      changeType: "positive",
      icon: BanknotesIcon,
      color: "bg-blue-500",
    },
    {
      title: "Digital Wallet Balance",
      value: "₹89,45,230",
      change: "+8.3%",
      changeType: "positive",
      icon: WalletIcon,
      color: "bg-green-500",
    },
    {
      title: "Daily Transactions",
      value: "1,234",
      change: "+15.2%",
      changeType: "positive",
      icon: ArrowsRightLeftIcon,
      color: "bg-purple-500",
    },
    {
      title: "Liquidity Ratio",
      value: "85.2%",
      change: "-2.1%",
      changeType: "negative",
      icon: ArrowTrendingUpIcon,
      color: "bg-orange-500",
    },
  ];

  const managementOptions = [
    {
      title: "Digital Wallet",
      description: "Manage digital wallet functionality and balances",
      href: "/dashboard/cash-management/wallet",
      icon: WalletIcon,
      color: "bg-white border border-stripe-border shadow-stripe-sm hover:shadow-stripe",
      iconColor: "text-stripe-primary",
      iconBg: "bg-stripe-primary bg-opacity-10",
    },
    {
      title: "Transactions",
      description: "Handle deposits, withdrawals, and transfers",
      href: "/dashboard/cash-management/transactions",
      icon: ArrowsRightLeftIcon,
      color: "bg-white border border-stripe-border shadow-stripe-sm hover:shadow-stripe",
      iconColor: "text-stripe-success",
      iconBg: "bg-stripe-success bg-opacity-10",
    },
    {
      title: "Branch Dashboard",
      description: "Branch-specific cash management overview",
      href: "/dashboard/cash-management/branch-dashboard",
      icon: PresentationChartLineIcon,
      color: "bg-white border border-stripe-border shadow-stripe-sm hover:shadow-stripe",
      iconColor: "text-stripe-primary",
      iconBg: "bg-stripe-primary bg-opacity-10",
    },
    {
      title: "Liquidity Report",
      description: "Monitor cash liquidity across branches",
      href: "/dashboard/cash-management/liquidity",
      icon: DocumentChartBarIcon,
      color: "bg-white border border-stripe-border shadow-stripe-sm hover:shadow-stripe",
      iconColor: "text-stripe-warning",
      iconBg: "bg-stripe-warning bg-opacity-10",
    },
    {
      title: "Interbranch Reports",
      description: "Track cash movements between branches",
      href: "/dashboard/cash-management/interbranch",
      icon: ArrowPathIcon,
      color: "bg-white border border-stripe-border shadow-stripe-sm hover:shadow-stripe",
      iconColor: "text-stripe-error",
      iconBg: "bg-stripe-error bg-opacity-10",
    },
  ];  const recentAlerts = [
    {
      type: "warning",
      message: "Low liquidity alert for Branch B001",
      time: "2 hours ago",
    },
    {
      type: "info",
      message: "Large withdrawal processed at Branch A003",
      time: "4 hours ago",
    },
    {
      type: "success",
      message: "Daily reconciliation completed successfully",
      time: "6 hours ago",
    },
  ];

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
          <h1 className="text-2xl font-bold text-stripe-text">Cash Management</h1>
          <p className="text-stripe-text-secondary">
            Comprehensive cash management and liquidity monitoring
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="form-input"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <div
            key={index}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stripe-text-secondary">{card.title}</p>
                <p className="text-2xl font-bold text-stripe-text mt-1">
                  {card.value}
                </p>
                <div className="flex items-center mt-2">
                  {card.changeType === "positive" ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm text-stripe-text-tertiary ml-1">vs last period</span>
                </div>
              </div>
              <div
                className={`${card.color} p-3 rounded-lg text-white`}
              >
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-stripe-text mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementOptions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`group block ${action.color} rounded-stripe p-6 transition-shadow duration-200`}
            >
              <div className="flex items-center space-x-4">
                <div className={`${action.iconBg} p-3 rounded-stripe`}>
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stripe-text group-hover:text-stripe-primary transition-colors duration-200">
                    {action.title}
                  </h3>
                  <p className="text-sm text-stripe-text-secondary mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-stripe-text mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {[
              {
                type: "Deposit",
                amount: "₹50,000",
                branch: "Branch A001",
                time: "2 minutes ago",
                status: "completed",
              },
              {
                type: "Withdrawal",
                amount: "₹25,000",
                branch: "Branch B002",
                time: "15 minutes ago",
                status: "completed",
              },
              {
                type: "Transfer",
                amount: "₹1,00,000",
                branch: "Branch C003",
                time: "1 hour ago",
                status: "pending",
              },
            ].map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-stripe-background rounded-stripe"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      transaction.status === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-stripe-text">
                      {transaction.type}
                    </p>
                    <p className="text-sm text-stripe-text-secondary">{transaction.branch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-stripe-text">
                    {transaction.amount}
                  </p>
                  <p className="text-sm text-stripe-text-tertiary">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <h2 className="text-lg font-semibold text-stripe-text mb-4">
            Recent Alerts
          </h2>
          <div className="space-y-4">
            {recentAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-stripe-background rounded-stripe"
              >
                <div
                  className={`mt-1 ${
                    alert.type === "warning"
                      ? "text-yellow-500"
                      : alert.type === "info"
                      ? "text-blue-500"
                      : "text-green-500"
                  }`}
                >
                  <ExclamationTriangleIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stripe-text">
                    {alert.message}
                  </p>
                  <p className="text-xs text-stripe-text-tertiary mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 