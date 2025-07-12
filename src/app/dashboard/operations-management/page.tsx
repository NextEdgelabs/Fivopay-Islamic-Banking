"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  ShieldExclamationIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
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
      <button onClick={() => onRemove(toast.id)} className="ml-4 text-white hover:text-gray-200">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default function OperationsManagementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const overviewCards = [
    {
      title: "Active Loan Applications",
      value: "1,247",
      change: "+12.5%",
      changeType: "positive",
      icon: ClipboardDocumentListIcon,
      color: "bg-blue-500",
    },
    {
      title: "Portfolio Risk Score",
      value: "7.2/10",
      change: "-0.3",
      changeType: "positive",
      icon: ShieldExclamationIcon,
      color: "bg-green-500",
    },
    {
      title: "Collection Efficiency",
      value: "94.8%",
      change: "+2.1%",
      changeType: "positive",
      icon: ChartBarIcon,
      color: "bg-purple-500",
    },
    {
      title: "NPA Ratio",
      value: "3.2%",
      change: "-0.5%",
      changeType: "positive",
      icon: ExclamationTriangleIcon,
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      title: "Loan Operations",
      description: "Monitor loan processing pipeline and approval workflows",
      href: "/dashboard/operations-management/loan-operations",
      icon: ClipboardDocumentListIcon,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Risk Management",
      description: "Portfolio risk monitoring and NPA management",
      href: "/dashboard/operations-management/risk-monitoring",
      icon: ShieldExclamationIcon,
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: "Collection Analytics",
      description: "Collection performance and agent productivity tracking",
      href: "/dashboard/operations-management/collections-analytics",
      icon: ChartBarIcon,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
  ];

  const recentAlerts = [
    {
      type: "warning",
      message: "5 loan applications pending approval for more than 48 hours",
      time: "2 hours ago",
    },
    {
      type: "info",
      message: "Risk score increased by 0.2 points in Manufacturing sector",
      time: "4 hours ago",
    },
    {
      type: "success",
      message: "Collection efficiency improved by 3.2% this week",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operations Management</h1>
          <p className="text-gray-600">
            Comprehensive operations monitoring and management
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
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
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
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
                </div>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {recentAlerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 border-b border-gray-100 last:border-b-0 ${
                alert.type === "warning"
                  ? "border-l-4 border-l-yellow-400 bg-yellow-50"
                  : alert.type === "error"
                  ? "border-l-4 border-l-red-400 bg-red-50"
                  : alert.type === "success"
                  ? "border-l-4 border-l-green-400 bg-green-50"
                  : "border-l-4 border-l-blue-400 bg-blue-50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {alert.type === "warning" ? (
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                  ) : alert.type === "error" ? (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  ) : alert.type === "success" ? (
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <DocumentMagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
}
