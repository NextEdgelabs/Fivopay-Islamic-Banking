"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  TrashIcon,
  PencilSquareIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon
} from "@heroicons/react/24/outline";

export default function StrategicPlanningPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("business-plan");
  const [businessPlanSearch, setBusinessPlanSearch] = useState("");
  const [investmentSearch, setInvestmentSearch] = useState("");
  const [businessPlanFilter, setBusinessPlanFilter] = useState("all");
  const [investmentFilter, setInvestmentFilter] = useState("all");



  // Mock data for existing plans and investments
  const [businessPlans, setBusinessPlans] = useState([
    {
      id: 1,
      name: "Digital Transformation 2024",
      type: "Strategic",
      status: "In Progress",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      budget: "50000000",
      departments: ["Technology", "Operations"],
      progress: 65
    },
    {
      id: 2,
      name: "Branch Expansion Q2 2024",
      type: "Quarterly",
      status: "Approved",
      startDate: "2024-04-01",
      endDate: "2024-06-30",
      budget: "25000000",
      departments: ["Operations", "Finance"],
      progress: 30
    },
    {
      id: 3,
      name: "Islamic Banking Compliance",
      type: "Annual",
      status: "Completed",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      budget: "15000000",
      departments: ["Compliance", "Legal"],
      progress: 100
    }
  ]);

  const [investmentDecisions, setInvestmentDecisions] = useState([
    {
      id: 1,
      title: "Core Banking System Upgrade",
      type: "Technology",
      amount: "75000000",
      roi: "15.5",
      paybackPeriod: "24",
      riskLevel: "Medium",
      status: "Approved",
      submittedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "New Branch Infrastructure",
      type: "Infrastructure",
      amount: "45000000",
      roi: "12.8",
      paybackPeriod: "36",
      riskLevel: "Low",
      status: "Under Review",
      submittedDate: "2024-01-20"
    },
    {
      id: 3,
      title: "Mobile Banking Platform",
      type: "Technology",
      amount: "30000000",
      roi: "18.2",
      paybackPeriod: "18",
      riskLevel: "Medium",
      status: "Pending",
      submittedDate: "2024-01-25"
    }
  ]);



  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount) || 0);
  };

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

  // Filter and search functions
  const filteredBusinessPlans = businessPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(businessPlanSearch.toLowerCase()) ||
                         plan.type.toLowerCase().includes(businessPlanSearch.toLowerCase());
    const matchesFilter = businessPlanFilter === "all" || plan.status.toLowerCase() === businessPlanFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const filteredInvestmentDecisions = investmentDecisions.filter(investment => {
    const matchesSearch = investment.title.toLowerCase().includes(investmentSearch.toLowerCase()) ||
                         investment.type.toLowerCase().includes(investmentSearch.toLowerCase());
    const matchesFilter = investmentFilter === "all" || investment.status.toLowerCase() === investmentFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Strategic Planning Tools</h1>
          <p className="text-slate-600">Business planning and investment decision workflows for strategic growth</p>
        </div>
        <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-medium text-purple-800">Strategic</span>
        </div>
      </div>

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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">Business Plan Creation</h2>
                  <p className="text-slate-600">Create comprehensive business plans with strategic objectives and resource allocation</p>
                </div>
                <button
                  onClick={() => router.push("/dashboard/executive-dashboard/strategic-planning/add-business-plan")}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Business Plan</span>
                </button>
              </div>

              

               {/* Business Plans Table */}
               <div className="bg-white rounded-lg border border-slate-200">
                 <div className="p-6 border-b border-slate-200">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-semibold text-slate-900">Business Plans</h3>
                     <div className="flex items-center space-x-4">
                       <div className="relative">
                         <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                         <input
                           type="text"
                           placeholder="Search plans..."
                           value={businessPlanSearch}
                           onChange={(e) => setBusinessPlanSearch(e.target.value)}
                           className="text-slate-900 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       </div>
                       <div className="flex items-center space-x-2">
                         <FunnelIcon className="h-4 w-4 text-slate-500" />
                         <select
                           value={businessPlanFilter}
                           onChange={(e) => setBusinessPlanFilter(e.target.value)}
                           className="text-slate-900 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         >
                           <option value="all">All Status</option>
                           <option value="draft">Draft</option>
                           <option value="in progress">In Progress</option>
                           <option value="approved">Approved</option>
                           <option value="completed">Completed</option>
                         </select>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full">
                     <thead className="bg-slate-50">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan Name</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Budget</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-slate-200">
                       {filteredBusinessPlans.map((plan) => (
                         <tr key={plan.id} className="hover:bg-slate-50">
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div>
                               <div className="text-sm font-medium text-slate-900">{plan.name}</div>
                               <div className="text-sm text-slate-500">{plan.startDate} - {plan.endDate}</div>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className="text-sm text-slate-900">{plan.type}</span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                               {plan.status}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className="text-sm text-slate-900">{formatCurrency(plan.budget)}</span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex items-center space-x-2">
                               <div className="w-16 bg-slate-200 rounded-full h-2">
                                 <div 
                                   className="bg-blue-600 h-2 rounded-full" 
                                   style={{ width: `${plan.progress}%` }}
                                 ></div>
                               </div>
                               <span className="text-sm text-slate-600">{plan.progress}%</span>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                             <div className="flex items-center space-x-2">
                               <button 
                                 onClick={() => router.push(`/dashboard/executive-dashboard/strategic-planning/view-business-plan?id=${plan.id}`)}
                                 className="text-blue-600 hover:text-blue-800"
                               >
                                 <EyeIcon className="h-4 w-4" />
                               </button>
                               <button 
                                 onClick={() => router.push(`/dashboard/executive-dashboard/strategic-planning/edit-business-plan?id=${plan.id}`)}
                                 className="text-green-600 hover:text-green-800"
                               >
                                 <PencilIcon className="h-4 w-4" />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            </div>
          )}

          {activeTab === "investment" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">Investment Decision Workflow</h2>
                  <p className="text-slate-600">Evaluate and approve investment proposals with comprehensive analysis</p>
                </div>
                <button
                  onClick={() => router.push("/dashboard/executive-dashboard/strategic-planning/add-investment")}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Investment</span>
                </button>
              </div>

              

               {/* Investment Decisions Table */}
               <div className="bg-white rounded-lg border border-slate-200">
                 <div className="p-6 border-b border-slate-200">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-semibold text-slate-900">Investment Decisions</h3>
                     <div className="flex items-center space-x-4">
                       <div className="relative">
                         <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                         <input
                           type="text"
                           placeholder="Search investments..."
                           value={investmentSearch}
                           onChange={(e) => setInvestmentSearch(e.target.value)}
                           className="text-slate-900 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       </div>
                       <div className="flex items-center space-x-2">
                         <FunnelIcon className="h-4 w-4 text-slate-500" />
                         <select
                           value={investmentFilter}
                           onChange={(e) => setInvestmentFilter(e.target.value)}
                           className="text-slate-900 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         >
                           <option value="all">All Status</option>
                           <option value="pending">Pending</option>
                           <option value="under review">Under Review</option>
                           <option value="approved">Approved</option>
                           <option value="rejected">Rejected</option>
                         </select>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full">
                     <thead className="bg-slate-50">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Investment Title</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ROI</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risk</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-slate-200">
                       {filteredInvestmentDecisions.map((investment) => (
                         <tr key={investment.id} className="hover:bg-slate-50">
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div>
                               <div className="text-sm font-medium text-slate-900">{investment.title}</div>
                               <div className="text-sm text-slate-500">Submitted: {investment.submittedDate}</div>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className="text-sm text-slate-900">{investment.type}</span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className="text-sm text-slate-900">{formatCurrency(investment.amount)}</span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className="text-sm text-slate-900">{investment.roi}%</span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.riskLevel)}`}>
                               {investment.riskLevel}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                               {investment.status}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                             <div className="flex items-center space-x-2">
                               <button 
                                 onClick={() => router.push(`/dashboard/executive-dashboard/strategic-planning/view-investment?id=${investment.id}`)}
                                 className="text-blue-600 hover:text-blue-800"
                               >
                                 <EyeIcon className="h-4 w-4" />
                               </button>
                               <button 
                                 onClick={() => router.push(`/dashboard/executive-dashboard/strategic-planning/edit-investment?id=${investment.id}`)}
                                 className="text-green-600 hover:text-green-800"
                               >
                                 <PencilIcon className="h-4 w-4" />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
