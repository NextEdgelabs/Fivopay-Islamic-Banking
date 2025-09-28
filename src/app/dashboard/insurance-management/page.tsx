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
      title: "New Health Insurance Product Added",
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
        return "bg-stripe-background-dark text-stripe-text-secondary";
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
          <h1 className="text-2xl font-bold text-stripe-text">
            Insurance Management
          </h1>
          <p className="text-stripe-text-secondary">
            Manage insurance products, policies, and claims
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/insurance-management/insurance-product"
            className="btn btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Total Products</p>
              <p className="text-2xl font-bold text-stripe-text">
                {stats.totalProducts}
              </p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">
                Active Policies
              </p>
              <p className="text-2xl font-bold text-stripe-text">
                {stats.activePolicies.toLocaleString()}
              </p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">
                Pending Claims
              </p>
              <p className="text-2xl font-bold text-stripe-text">
                {stats.pendingClaims}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">
                Approved Claims
              </p>
              <p className="text-2xl font-bold text-stripe-text">
                {stats.approvedClaims}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">
                Total Premium
              </p>
              <p className="text-2xl font-bold text-stripe-text">
                ${(stats.totalPremium / 1000000).toFixed(1)}M
              </p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">
                Total Payouts
              </p>
              <p className="text-2xl font-bold text-stripe-text">
                ${(stats.totalPayouts / 1000).toFixed(0)}K
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-stripe-text mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/insurance-management/insurance-product"
            className="flex items-center p-4 border border-stripe-border rounded-lg hover:bg-stripe-background-light transition-colors"
          >
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-stripe-text">Manage Products</p>
              <p className="text-sm text-stripe-text-secondary">Browse & configure insurance products</p>
            </div>
          </Link>

          <Link
            href="/dashboard/insurance-management/insurance-policy"
            className="flex items-center p-4 border border-stripe-border rounded-lg hover:bg-stripe-background-light transition-colors"
          >
            <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-stripe-text">Manage Policies</p>
              <p className="text-sm text-stripe-text-secondary">View and manage insurance policies</p>
            </div>
          </Link>

          <Link
            href="/dashboard/insurance-management/insurance-claim"
            className="flex items-center p-4 border border-stripe-border rounded-lg hover:bg-stripe-background-light transition-colors"
          >
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-stripe-text">Process Claims</p>
              <p className="text-sm text-stripe-text-secondary">Review and process insurance claims</p>
            </div>
          </Link>

          <Link
            href="/dashboard/insurance-management/analytics"
            className="flex items-center p-4 border border-stripe-border rounded-lg hover:bg-stripe-background-light transition-colors"
          >
            <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-stripe-text">Analytics</p>
              <p className="text-sm text-stripe-text-secondary">View insurance analytics & reports</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stripe-text">
            Recent Activities
          </h2>
          <Link
            href="/dashboard/insurance-management/activities"
            className="text-sm text-stripe-primary hover:text-stripe-primary-dark"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 border border-stripe-border rounded-lg hover:bg-stripe-background-light transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-stripe-background-dark rounded-lg">
                  {getTypeIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium text-stripe-text">{activity.title}</p>
                  <p className="text-sm text-stripe-text-secondary">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {activity.amount && (
                  <span className="text-sm font-medium text-stripe-text">
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
