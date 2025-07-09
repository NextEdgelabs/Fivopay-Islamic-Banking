"use client";
import { useState } from "react";
import { 
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

export default function StrategicPlanningTools() {
  const [activeTab, setActiveTab] = useState("business-plan");

  // Business Plan Form State
  const [businessPlan, setBusinessPlan] = useState({
    planName: "",
    planDescription: "",
    planStartDate: "",
    planEndDate: "",
    planType: "Annual",
    responsibleDepartment: [],
    targetMetrics: [],
    budgetAllocation: "",
    riskAssessment: "",
    successCriteria: ""
  });

  // Investment Decision Form State
  const [investmentDecision, setInvestmentDecision] = useState({
    investmentTitle: "",
    investmentAmount: "",
    investmentType: "Technology",
    expectedROI: "",
    paybackPeriod: "",
    riskLevel: "Medium",
    approvalStatus: "Pending",
    supportingDocuments: []
  });

  const departments = [
    "Operations", "Finance", "Technology", "Marketing", "Human Resources", "Compliance"
  ];

  const planTypes = ["Annual", "Quarterly", "Strategic"];
  const investmentTypes = ["Technology", "Infrastructure", "Expansion"];
  const riskLevels = ["Low", "Medium", "High"];

  const handleBusinessPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Business Plan:", businessPlan);
    // Handle form submission
  };

  const handleInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Investment Decision:", investmentDecision);
    // Handle form submission
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
      {/* Tab Navigation */}
      <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("business-plan")}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "business-plan"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span>Business Plan Creation</span>
            </button>
            <button
              onClick={() => setActiveTab("investment")}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "investment"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Investment Decision Workflow</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "business-plan" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Business Plan Creation</h2>
                <p className="text-slate-600 mb-6">Create comprehensive business plans with strategic objectives and resource allocation</p>
              </div>

              <form onSubmit={handleBusinessPlanSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      value={businessPlan.planName}
                      onChange={(e) => setBusinessPlan(prev => ({ ...prev, planName: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Responsible Department *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Define measurable success criteria"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
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
          )}

          {activeTab === "investment" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Investment Decision Workflow</h2>
                <p className="text-slate-600 mb-6">Evaluate and approve investment proposals with comprehensive analysis</p>
              </div>

              <form onSubmit={handleInvestmentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Investment Title *
                    </label>
                    <input
                      type="text"
                      value={investmentDecision.investmentTitle}
                      onChange={(e) => setInvestmentDecision(prev => ({ ...prev, investmentTitle: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                <div className="flex justify-end space-x-3">
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
          )}
        </div>
      </div>
    </div>
  );
} 