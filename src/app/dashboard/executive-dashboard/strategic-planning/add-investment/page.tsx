"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon,
  DocumentIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function AddInvestmentPage() {
  const router = useRouter();
  const [investmentDecision, setInvestmentDecision] = useState({
    investmentTitle: "",
    investmentAmount: "",
    investmentType: "Technology",
    expectedROI: "",
    paybackPeriod: "",
    riskLevel: "Medium",
    approvalStatus: "Pending",
    supportingDocuments: [] as File[]
  });

  const investmentTypes = ["Technology", "Infrastructure", "Expansion"];
  const riskLevels = ["Low", "Medium", "High"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Investment Decision:", investmentDecision);
    // Here you would typically save to database
    router.push("/dashboard/executive-dashboard/strategic-planning");
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
            <h1 className="text-2xl font-bold text-slate-900">Create Investment Decision</h1>
            <p className="text-slate-600">Evaluate and submit investment proposals for approval</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-medium text-purple-800">Strategic</span>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Investment Decision Details</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Investment Title *
              </label>
              <input
                type="text"
                value={investmentDecision.investmentTitle}
                onChange={(e) => setInvestmentDecision(prev => ({ ...prev, investmentTitle: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter investment title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Investment Type *
              </label>
              <select
                value={investmentDecision.investmentType}
                onChange={(e) => setInvestmentDecision(prev => ({ ...prev, investmentType: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {investmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Investment Amount *
              </label>
              <input
                type="text"
                value={investmentDecision.investmentAmount}
                onChange={(e) => setInvestmentDecision(prev => ({ ...prev, investmentAmount: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Amount in INR"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Expected ROI *
              </label>
              <input
                type="text"
                value={investmentDecision.expectedROI}
                onChange={(e) => setInvestmentDecision(prev => ({ ...prev, expectedROI: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Percentage"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payback Period (Months) *
              </label>
              <input
                type="number"
                value={investmentDecision.paybackPeriod}
                onChange={(e) => setInvestmentDecision(prev => ({ ...prev, paybackPeriod: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Number of months"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Risk Level *
              </label>
              <select
                value={investmentDecision.riskLevel}
                onChange={(e) => setInvestmentDecision(prev => ({ ...prev, riskLevel: e.target.value }))}
                className="text-slate-900  w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {riskLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Approval Status
              </label>
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                <ClockIcon className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Pending Review</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Supporting Documents
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <DocumentIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-sm text-slate-600 mb-2">Upload supporting documents</p>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Choose Files
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 