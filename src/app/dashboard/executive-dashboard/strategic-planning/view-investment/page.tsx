"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserIcon
} from "@heroicons/react/24/outline";

export default function ViewInvestmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const investmentId = searchParams.get('id');

  const [investment, setInvestment] = useState({
    id: 1,
    title: "Core Banking System Upgrade",
    type: "Technology",
    amount: "75000000",
    roi: "15.5",
    paybackPeriod: "24",
    riskLevel: "Medium",
    status: "Approved",
    submittedDate: "2024-01-15",
    description: "Upgrade core banking system to improve operational efficiency and enhance customer service capabilities.",
    expectedBenefits: "Improved transaction processing speed, enhanced security features, and better integration with third-party services.",
    riskMitigation: "Phased implementation approach with comprehensive testing and backup systems in place."
  });

  useEffect(() => {
    // In a real app, you would fetch investment data based on investmentId
    console.log("Loading investment with ID:", investmentId);
  }, [investmentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount) || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">View Investment Decision</h1>
            <p className="text-slate-600">Investment details and analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(investment.status)}`}>
            {investment.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(investment.riskLevel)}`}>
            {investment.riskLevel} Risk
          </span>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">{investment.title}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">{investment.type}</span>
              <span className="text-sm text-slate-600">•</span>
              <span className="text-sm text-slate-600">Submitted: {investment.submittedDate}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-900">{investment.description}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900 font-medium">{formatCurrency(investment.amount)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expected ROI</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900 font-medium">{investment.roi}%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Payback Period</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900 font-medium">{investment.paybackPeriod} months</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Investment Type</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{investment.type}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Expected Benefits</label>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-900">{investment.expectedBenefits}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Risk Mitigation</label>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-900">{investment.riskMitigation}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <button
              onClick={() => router.push(`/dashboard/executive-dashboard/strategic-planning/edit-investment?id=${investment.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Investment
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 