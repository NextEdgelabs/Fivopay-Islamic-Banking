"use client";

import { useState } from "react";
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function ComplianceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("");

  const complianceReports = [
    {
      id: "1",
      title: "Regulatory Compliance Report",
      description: "Comprehensive regulatory compliance status report",
      period: "monthly",
      lastGenerated: "2024-01-15",
      status: "available",
    },
    {
      id: "2",
      title: "Audit Findings Report",
      description: "Internal and external audit findings summary",
      period: "quarterly",
      lastGenerated: "2024-01-10",
      status: "available",
    },
    {
      id: "3",
      title: "Risk Assessment Report",
      description: "Comprehensive risk assessment and mitigation status",
      period: "monthly",
      lastGenerated: "2024-01-13",
      status: "available",
    },
    {
      id: "4",
      title: "KYC Compliance Report",
      description: "Know Your Customer compliance status report",
      period: "weekly",
      lastGenerated: "2024-01-14",
      status: "available",
    },
  ];

  const complianceMetrics = [
    {
      title: "Compliance Score",
      value: "98.5%",
      change: "+1.2%",
      trend: "up",
      icon: CheckCircleIcon,
    },
    {
      title: "Risk Level",
      value: "Low",
      change: "Stable",
      trend: "stable",
      icon: ShieldCheckIcon,
    },
    {
      title: "Audit Findings",
      value: "3",
      change: "-2",
      trend: "down",
      icon: ExclamationTriangleIcon,
    },
    {
      title: "Pending Actions",
      value: "12",
      change: "-5",
      trend: "down",
      icon: ClockIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Reports</h1>
          <p className="text-gray-600">Monitor regulatory compliance and audit status</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {complianceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-green-600" : 
                    metric.trend === "down" ? "text-red-600" : "text-gray-600"
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

      {/* Report Generation */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Compliance Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Report Type</option>
              <option value="regulatory-compliance">Regulatory Compliance Report</option>
              <option value="audit-findings">Audit Findings Report</option>
              <option value="risk-assessment">Risk Assessment Report</option>
              <option value="kyc-compliance">KYC Compliance Report</option>
              <option value="aml-compliance">AML Compliance Report</option>
              <option value="data-protection">Data Protection Report</option>
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
          <div className="flex items-end">
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <DocumentTextIcon className="h-5 w-5" />
              <span>Generate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Available Reports</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceReports.map((report) => (
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
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                    <EyeIcon className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">Compliant Areas</h4>
                <p className="text-sm text-green-700">All regulatory requirements met</p>
              </div>
            </div>
          </div>
          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-900">Attention Required</h4>
                <p className="text-sm text-yellow-700">3 items need attention</p>
              </div>
            </div>
          </div>
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">Pending Actions</h4>
                <p className="text-sm text-blue-700">12 actions in progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Compliance Dashboard</div>
              <div className="text-sm text-gray-600">Real-time compliance monitoring</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <DocumentTextIcon className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Export Reports</div>
              <div className="text-sm text-gray-600">Export in PDF, Excel, or CSV</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CalendarIcon className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Schedule Reports</div>
              <div className="text-sm text-gray-600">Automated compliance reporting</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 