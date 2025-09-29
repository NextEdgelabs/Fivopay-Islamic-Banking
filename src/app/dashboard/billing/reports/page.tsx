"use client";

import { useState } from "react";
import {
  DocumentChartBarIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface BillingReport {
  id: string;
  title: string;
  description: string;
  period: string;
  lastGenerated: string;
  status: string;
}

export default function BillingReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReportItem, setSelectedReportItem] = useState<BillingReport | null>(null);

  const [billingReports, setBillingReports] = useState<BillingReport[]>([
    {
      id: "1",
      title: "Revenue Analytics Report",
      description: "Comprehensive revenue analysis and trends",
      period: "monthly",
      lastGenerated: "2024-01-15",
      status: "available",
    },
    {
      id: "2",
      title: "Payment Processing Report",
      description: "Payment processing efficiency and success rates",
      period: "monthly",
      lastGenerated: "2024-01-14",
      status: "available",
    },
    {
      id: "3",
      title: "Customer Billing Report",
      description: "Customer billing patterns and preferences",
      period: "weekly",
      lastGenerated: "2024-01-13",
      status: "available",
    },
    {
      id: "4",
      title: "Billing Performance Report",
      description: "Billing system performance and metrics",
      period: "monthly",
      lastGenerated: "2024-01-12",
      status: "available",
    },
  ]);

  const billingMetrics = [
    {
      title: "Total Revenue",
      value: "₹12,45,678",
      change: "+8.5%",
      trend: "up",
      icon: CurrencyRupeeIcon,
    },
    {
      title: "Payment Success Rate",
      value: "96.2%",
      change: "+1.3%",
      trend: "up",
      icon: ArrowTrendingUpIcon,
    },
    {
      title: "Average Invoice Value",
      value: "₹2,450",
      change: "+5.7%",
      trend: "up",
      icon: ChartBarIcon,
    },
    {
      title: "Active Customers",
      value: "1,234",
      change: "+12.3%",
      trend: "up",
      icon: UserGroupIcon,
    },
  ];

  const handleGenerateReport = () => {
    if (selectedReport && selectedPeriod) {
      const newReport: BillingReport = {
        id: Date.now().toString(),
        title: `${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1).replace('-', ' ')} Report`,
        description: `Generated ${selectedReport.replace('-', ' ')} report for ${selectedPeriod} period`,
        period: selectedPeriod,
        lastGenerated: new Date().toISOString().split('T')[0],
        status: "available",
      };
      setBillingReports([...billingReports, newReport]);
      setSelectedReport("");
      setSelectedPeriod("monthly");
      setShowGenerateModal(false);
    }
  };

  const handleViewReport = (report: BillingReport) => {
    setSelectedReportItem(report);
    setShowViewModal(true);
  };

  const handleDownloadReport = (report: BillingReport) => {
    // Simulate download functionality
    alert(`${report.title} download started`);
  };

  const handleRegenerateReport = (report: BillingReport) => {
    // Simulate regenerate functionality
    const updatedReports = billingReports.map(r =>
      r.id === report.id
        ? { ...r, lastGenerated: new Date().toISOString().split('T')[0] }
        : r
    );
    setBillingReports(updatedReports);
    alert(`${report.title} regenerated successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing Reports</h1>
          <p className="text-gray-600">Analytics and insights for billing operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <DocumentChartBarIcon className="h-5 w-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Billing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {billingMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {metric.change} from last period
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Generation Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generate Billing Report</h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Report Type</option>
                  <option value="revenue-analytics">Revenue Analytics Report</option>
                  <option value="payment-processing">Payment Processing Report</option>
                  <option value="customer-billing">Customer Billing Report</option>
                  <option value="billing-performance">Billing Performance Report</option>
                  <option value="invoice-analysis">Invoice Analysis Report</option>
                  <option value="payment-methods">Payment Methods Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="custom">Custom Period</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <DocumentChartBarIcon className="h-5 w-5" />
                <span>Generate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Reports */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Available Billing Reports</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {billingReports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{report.title}</h4>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>Period: {report.period}</span>
                  <span>Last generated: {report.lastGenerated}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewReport(report)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button 
                    onClick={() => handleDownloadReport(report)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button 
                    onClick={() => handleRegenerateReport(report)}
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    <DocumentChartBarIcon className="h-4 w-4" />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Report Modal */}
      {showViewModal && selectedReportItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Report Title</label>
                <p className="text-gray-900">{selectedReportItem.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900">{selectedReportItem.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Period</label>
                <p className="text-gray-900">{selectedReportItem.period}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {selectedReportItem.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Generated</label>
                <p className="text-gray-900">{selectedReportItem.lastGenerated}</p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadReport(selectedReportItem)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 