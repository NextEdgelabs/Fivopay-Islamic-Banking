"use client";

import { useState } from "react";
import {
  DocumentTextIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  lastUpdated: string;
  status: "available" | "generating" | "error";
}

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const reportCategories = [
    { id: "all", name: "All Reports", count: 12 },
    { id: "financial", name: "Financial", count: 4 },
    { id: "operational", name: "Operational", count: 3 },
    { id: "compliance", name: "Compliance", count: 3 },
    { id: "analytics", name: "Analytics", count: 2 },
  ];

  const reports: ReportCard[] = [
    {
      id: "1",
      title: "Monthly Financial Summary",
      description: "Comprehensive financial performance report for the current month",
      icon: DocumentTextIcon,
      category: "financial",
      lastUpdated: "2024-01-15",
      status: "available",
    },
    {
      id: "2",
      title: "Branch Performance Report",
      description: "Detailed analysis of branch-wise performance metrics",
      icon: ChartBarIcon,
      category: "operational",
      lastUpdated: "2024-01-14",
      status: "available",
    },
    {
      id: "3",
      title: "Compliance Audit Report",
      description: "Regulatory compliance and audit findings report",
      icon: ShieldCheckIcon,
      category: "compliance",
      lastUpdated: "2024-01-13",
      status: "available",
    },
    {
      id: "4",
      title: "Customer Analytics Dashboard",
      description: "Real-time customer behavior and engagement analytics",
      icon: DocumentChartBarIcon,
      category: "analytics",
      lastUpdated: "2024-01-15",
      status: "available",
    },
    {
      id: "5",
      title: "Loan Portfolio Analysis",
      description: "Comprehensive analysis of loan portfolio performance",
      icon: DocumentTextIcon,
      category: "financial",
      lastUpdated: "2024-01-12",
      status: "available",
    },
    {
      id: "6",
      title: "Operational Efficiency Report",
      description: "Key operational metrics and efficiency indicators",
      icon: ChartBarIcon,
      category: "operational",
      lastUpdated: "2024-01-11",
      status: "available",
    },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesCategory = selectedCategory === "all" || report.category === selectedCategory;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "generating":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "generating":
        return "Generating";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and manage comprehensive banking reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <report.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Updated:</span>
                <span className="text-gray-900">{report.lastUpdated}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {getStatusText(report.status)}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Schedule Report</div>
              <div className="text-sm text-gray-600">Set up automated report generation</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <DocumentTextIcon className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Export Data</div>
              <div className="text-sm text-gray-600">Export report data in various formats</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ChartBarIcon className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Custom Analytics</div>
              <div className="text-sm text-gray-600">Create custom analytical reports</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 