"use client";

import { useState } from "react";
import {
  DocumentTextIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClockIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function OperationalReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("");

  const operationalReports = [
    {
      id: "1",
      title: "Branch Performance Report",
      description: "Comprehensive branch-wise performance analysis",
      period: "monthly",
      lastGenerated: "2024-01-15",
      status: "available",
    },
    {
      id: "2",
      title: "Employee Productivity Report",
      description: "Employee performance and productivity metrics",
      period: "monthly",
      lastGenerated: "2024-01-14",
      status: "available",
    },
    {
      id: "3",
      title: "Customer Service Metrics",
      description: "Customer satisfaction and service quality metrics",
      period: "weekly",
      lastGenerated: "2024-01-13",
      status: "available",
    },
    {
      id: "4",
      title: "Operational Efficiency Report",
      description: "Key operational efficiency indicators",
      period: "monthly",
      lastGenerated: "2024-01-12",
      status: "available",
    },
  ];

  const operationalMetrics = [
    {
      title: "Branch Efficiency",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: BuildingOfficeIcon,
    },
    {
      title: "Employee Productivity",
      value: "87.5%",
      change: "+5.3%",
      trend: "up",
      icon: UserGroupIcon,
    },
    {
      title: "Customer Satisfaction",
      value: "4.6/5.0",
      change: "+0.2",
      trend: "up",
      icon: ChartBarIcon,
    },
    {
      title: "Average Response Time",
      value: "2.3 min",
      change: "-0.5 min",
      trend: "down",
      icon: ClockIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operational Reports</h1>
          <p className="text-gray-600">Monitor operational performance and efficiency metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {operationalMetrics.map((metric, index) => {
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

      {/* Report Generation */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Operational Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Report Type</option>
              <option value="branch-performance">Branch Performance Report</option>
              <option value="employee-productivity">Employee Productivity Report</option>
              <option value="customer-service">Customer Service Metrics</option>
              <option value="operational-efficiency">Operational Efficiency Report</option>
              <option value="process-analysis">Process Analysis Report</option>
              <option value="resource-utilization">Resource Utilization Report</option>
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
            {operationalReports.map((report) => (
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ChartBarIcon className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Performance Analytics</div>
              <div className="text-sm text-gray-600">Advanced operational analytics</div>
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
              <div className="text-sm text-gray-600">Automated report generation</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 