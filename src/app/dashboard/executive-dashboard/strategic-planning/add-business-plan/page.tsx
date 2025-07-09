"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

export default function AddBusinessPlanPage() {
  const router = useRouter();
  const [businessPlan, setBusinessPlan] = useState({
    planName: "",
    planDescription: "",
    planStartDate: "",
    planEndDate: "",
    planType: "Annual",
    responsibleDepartment: [] as string[],
    targetMetrics: [] as Array<{ metric: string; target: string; unit: string }>,
    budgetAllocation: "",
    riskAssessment: "",
    successCriteria: ""
  });

  const departments = [
    "Operations", "Finance", "Technology", "Marketing", "Human Resources", "Compliance", "Legal", "Customer Service"
  ];

  const planTypes = ["Annual", "Quarterly", "Strategic"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Business Plan:", businessPlan);
    // Here you would typically save to database
    router.push("/dashboard/executive-dashboard/strategic-planning");
  };

  const addTargetMetric = () => {
    setBusinessPlan(prev => ({
      ...prev,
      targetMetrics: [...prev.targetMetrics, { metric: "", target: "", unit: "" }]
    }));
  };

  const removeTargetMetric = (index: number) => {
    setBusinessPlan(prev => ({
      ...prev,
      targetMetrics: prev.targetMetrics.filter((_, i) => i !== index)
    }));
  };

  const updateTargetMetric = (index: number, field: string, value: string) => {
    setBusinessPlan(prev => ({
      ...prev,
      targetMetrics: prev.targetMetrics.map((metric, i) => 
        i === index ? { ...metric, [field]: value } : metric
      )
    }));
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
            <h1 className="text-2xl font-bold text-slate-900">Create Business Plan</h1>
            <p className="text-slate-600">Define strategic objectives and resource allocation</p>
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
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Business Plan Details</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                value={businessPlan.planName}
                onChange={(e) => setBusinessPlan(prev => ({ ...prev, planName: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter plan name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Plan Type *
              </label>
              <select
                value={businessPlan.planType}
                onChange={(e) => setBusinessPlan(prev => ({ ...prev, planType: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {planTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Plan Description *
            </label>
            <textarea
              value={businessPlan.planDescription}
              onChange={(e) => setBusinessPlan(prev => ({ ...prev, planDescription: e.target.value }))}
              rows={4}
              className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the business plan objectives and strategy"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={businessPlan.planStartDate}
                onChange={(e) => setBusinessPlan(prev => ({ ...prev, planStartDate: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={businessPlan.planEndDate}
                onChange={(e) => setBusinessPlan(prev => ({ ...prev, planEndDate: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Responsible Department *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {departments.map(dept => (
                <label key={dept} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={businessPlan.responsibleDepartment.includes(dept)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBusinessPlan(prev => ({
                          ...prev,
                          responsibleDepartment: [...prev.responsibleDepartment, dept]
                        }));
                      } else {
                        setBusinessPlan(prev => ({
                          ...prev,
                          responsibleDepartment: prev.responsibleDepartment.filter(d => d !== dept)
                        }));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-slate-700">{dept}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Target Metrics
            </label>
            <div className="space-y-3">
              {businessPlan.targetMetrics.map((metric, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <input
                    type="text"
                    value={metric.metric}
                    onChange={(e) => updateTargetMetric(index, "metric", e.target.value)}
                    placeholder="Metric name"
                    className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={metric.target}
                    onChange={(e) => updateTargetMetric(index, "target", e.target.value)}
                    placeholder="Target value"
                    className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={metric.unit}
                    onChange={(e) => updateTargetMetric(index, "unit", e.target.value)}
                    placeholder="Unit"
                    className="w-24 border border-slate-300 rounded px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeTargetMetric(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTargetMetric}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Target Metric</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Budget Allocation *
            </label>
            <input
              type="text"
              value={businessPlan.budgetAllocation}
              onChange={(e) => setBusinessPlan(prev => ({ ...prev, budgetAllocation: e.target.value }))}
              className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter budget amount in INR"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Risk Assessment
            </label>
            <textarea
              value={businessPlan.riskAssessment}
              onChange={(e) => setBusinessPlan(prev => ({ ...prev, riskAssessment: e.target.value }))}
              rows={3}
              className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe potential risks and mitigation strategies"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Success Criteria *
            </label>
            <textarea
              value={businessPlan.successCriteria}
              onChange={(e) => setBusinessPlan(prev => ({ ...prev, successCriteria: e.target.value }))}
              rows={3}
              className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Define measurable success criteria"
              required
            />
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
              Create Business Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 