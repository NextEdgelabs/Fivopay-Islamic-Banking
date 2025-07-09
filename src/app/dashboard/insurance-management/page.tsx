"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

interface InsuranceStats {
  totalProducts: number;
  activePolicies: number;
  pendingClaims: number;
  approvedClaims: number;
  totalPremium: number;
  totalPayouts: number;
}

interface RecentActivity {
  id: string;
  type: "policy" | "claim" | "product";
  title: string;
  status: "pending" | "approved" | "rejected" | "active";
  date: string;
  amount?: number;
}

export default function InsuranceManagementPage() {
  const [stats] = useState<InsuranceStats>({
    totalProducts: 12,
    activePolicies: 1247,
    pendingClaims: 23,
    approvedClaims: 156,
    totalPremium: 2450000,
    totalPayouts: 890000,
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "claim",
      title: "Health Insurance Claim - John Smith",
      status: "pending",
      date: "2024-01-15",
      amount: 25000,
    },
    {
      id: "2",
      type: "policy",
      title: "New Life Insurance Policy - Sarah Johnson",
      status: "active",
      date: "2024-01-14",
      amount: 5000,
    },
    {
      id: "3",
      type: "claim",
      title: "Motor Insurance Claim - Mike Wilson",
      status: "approved",
      date: "2024-01-13",
      amount: 15000,
    },
    {
      id: "4",
      type: "product",
      title: "New Takaful Health Product Added",
      status: "active",
      date: "2024-01-12",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-4 w-4" />;
      case "approved":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "rejected":
        return <XCircleIcon className="h-4 w-4" />;
      case "active":
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "policy":
        return <DocumentTextIcon className="h-5 w-5" />;
      case "claim":
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case "product":
        return <ShieldCheckIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Insurance Management
          </h1>
          <p className="text-slate-600">
            Manage Takaful products, policies, and claims
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/insurance-management/insurance-product"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Products</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalProducts}
              </p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Active Policies
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.activePolicies.toLocaleString()}
              </p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Pending Claims
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.pendingClaims}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Approved Claims
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.approvedClaims}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Premium
              </p>
              <p className="text-2xl font-bold text-slate-900">
                ${(stats.totalPremium / 1000000).toFixed(1)}M
              </p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Payouts
              </p>
              <p className="text-2xl font-bold text-slate-900">
                ${(stats.totalPayouts / 1000).toFixed(0)}K
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/insurance-management/insurance-product"
            className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-slate-900">Manage Products</p>
              <p className="text-sm text-slate-600">Browse & configure Takaful products</p>
            </div>
          </Link>

          <Link
            href="/dashboard/insurance-management/insurance-policy"
            className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-slate-900">Manage Policies</p>
              <p className="text-sm text-slate-600">View and manage insurance policies</p>
            </div>
          </Link>

          <Link
            href="/dashboard/insurance-management/insurance-claim"
            className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-slate-900">Process Claims</p>
              <p className="text-sm text-slate-600">Review and process insurance claims</p>
            </div>
          </Link>

          <Link
            href="/dashboard/insurance-management/analytics"
            className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-slate-900">Analytics</p>
              <p className="text-sm text-slate-600">View insurance analytics & reports</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activities
          </h2>
          <Link
            href="/dashboard/insurance-management/activities"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  {getTypeIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{activity.title}</p>
                  <p className="text-sm text-slate-600">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {activity.amount && (
                  <span className="text-sm font-medium text-slate-900">
                    ${activity.amount.toLocaleString()}
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    activity.status
                  )}`}
                >
                  {getStatusIcon(activity.status)}
                  <span className="ml-1 capitalize">{activity.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
