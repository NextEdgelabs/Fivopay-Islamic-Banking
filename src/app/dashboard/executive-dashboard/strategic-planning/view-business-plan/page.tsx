"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon,
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  UserIcon
} from "@heroicons/react/24/outline";

export default function ViewBusinessPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('id');

  const [businessPlan, setBusinessPlan] = useState({
    id: 1,
    name: "Digital Transformation 2024",
    type: "Strategic",
    status: "In Progress",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    budget: "50000000",
    departments: ["Technology", "Operations"],
    progress: 65,
    description: "Comprehensive digital transformation initiative to modernize our banking infrastructure and enhance customer experience through technology adoption.",
    riskAssessment: "Medium risk due to technology integration complexity. Mitigation includes phased rollout and comprehensive training programs.",
    successCriteria: "Achieve 90% digital adoption rate, reduce operational costs by 25%, and improve customer satisfaction scores by 30%.",
    targetMetrics: [
      { metric: "Digital Adoption Rate", target: "90%", unit: "Percentage" },
      { metric: "Cost Reduction", target: "25%", unit: "Percentage" },
      { metric: "Customer Satisfaction", target: "85", unit: "Score" }
    ]
  });

  useEffect(() => {
    // In a real app, you would fetch business plan data based on planId
    console.log("Loading business plan with ID:", planId);
  }, [planId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
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
            <h1 className="text-2xl font-bold text-slate-900">View Business Plan</h1>
            <p className="text-slate-600">Business plan details and progress</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(businessPlan.status)}`}>
            {businessPlan.status}
          </span>
          <span className="text-sm text-slate-600">Progress: {businessPlan.progress}%</span>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">{businessPlan.name}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">{businessPlan.type}</span>
              <span className="text-sm text-slate-600">•</span>
              <span className="text-sm text-slate-600">{businessPlan.startDate} - {businessPlan.endDate}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-900">{businessPlan.description}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Budget</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900 font-medium">{formatCurrency(businessPlan.budget)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Progress</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${businessPlan.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-slate-900 font-medium">{businessPlan.progress}%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Plan Type</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{businessPlan.type}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Responsible Departments</label>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {businessPlan.departments.map((dept, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    <UserGroupIcon className="h-3 w-3 mr-1" />
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Metrics</label>
            <div className="space-y-2">
              {businessPlan.targetMetrics.map((metric, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 font-medium">{metric.metric}</span>
                    <span className="text-slate-600">{metric.target} {metric.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Risk Assessment</label>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-900">{businessPlan.riskAssessment}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Success Criteria</label>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-900">{businessPlan.successCriteria}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <button
              onClick={() => router.push(`/dashboard/executive-dashboard/strategic-planning/edit-business-plan?id=${businessPlan.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Plan
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 