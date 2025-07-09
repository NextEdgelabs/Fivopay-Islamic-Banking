"use client";
import Link from "next/link";
import { useState } from "react";
import { 
  UserIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { useAppContext } from "../context/AppContext";

export default function DashboardPage() {
  const { customers, employees, dashboardData } = useAppContext();
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    periodType: 'Daily'
  });

  // Calculate statistics
  const activeCustomers = customers.filter(c => c.status === "Active").length;
  const pendingCustomers = customers.filter(c => c.status === "Pending").length;
  const kycVerified = customers.filter(c => c.kycStatus === "Verified").length;
  const kycPending = customers.filter(c => c.kycStatus === "Pending" || c.kycStatus === "Under Review").length;
  
  const activeEmployees = employees.filter(e => e.status === "Active").length;
  const shariaCompliant = employees.filter(e => e.shariaCompliant).length;
  const compliancePercentage = employees.length > 0 ? Math.round((shariaCompliant / employees.length) * 100) : 0;

  // Recent customers
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 5);

  // Get top and underperforming branches
  const topPerformingBranches = [...dashboardData.branches]
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 3);
  
  const underperformingBranches = [...dashboardData.branches]
    .sort((a, b) => a.performance - b.performance)
    .slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Islamic Banking Dashboard</h1>
      
      {/* Date Range Selector */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Date Range</h2>
            <p className="text-slate-600">Select the period for dashboard metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-slate-500" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="text-gray-700 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-slate-500" />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="text-gray-700 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={dateRange.periodType}
              onChange={(e) => setDateRange(prev => ({ ...prev, periodType: e.target.value }))}
              className="text-gray-700 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Portfolio Metrics Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Portfolio Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(dashboardData.portfolioMetrics.totalPortfolioValue)}</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Active Loans</p>
                <p className="text-2xl font-bold text-green-900">{dashboardData.portfolioMetrics.activeLoansCount.toLocaleString()}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Total Deposits</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(dashboardData.portfolioMetrics.totalDeposits)}</p>
              </div>
              <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Active Customers</p>
                <p className="text-2xl font-bold text-orange-900">{dashboardData.portfolioMetrics.activeCustomers.toLocaleString()}</p>
              </div>
              <UserIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-700">New Customers Today</p>
                <p className="text-2xl font-bold text-teal-900">{dashboardData.portfolioMetrics.newCustomersToday}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-teal-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700">Portfolio Growth Rate</p>
                <p className="text-2xl font-bold text-indigo-900">{formatPercentage(dashboardData.portfolioMetrics.portfolioGrowthRate)}</p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">Loan Approval Rate</p>
            <p className="text-xl font-bold text-slate-900">{formatPercentage(dashboardData.performanceIndicators.loanApprovalRate)}</p>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">Collection Efficiency</p>
            <p className="text-xl font-bold text-slate-900">{formatPercentage(dashboardData.performanceIndicators.collectionEfficiency)}</p>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">NPA Percentage</p>
            <p className="text-xl font-bold text-slate-900">{formatPercentage(dashboardData.performanceIndicators.npaPercentage)}</p>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">Profit Margin</p>
            <p className="text-xl font-bold text-slate-900">{formatPercentage(dashboardData.performanceIndicators.profitMargin)}</p>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">Customer Satisfaction</p>
            <p className="text-xl font-bold text-slate-900">{dashboardData.performanceIndicators.customerSatisfactionScore}/5</p>
          </div>
        </div>
      </div>

      {/* Branch Network Overview */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Branch Network Overview</h2>
        
        {/* Branch Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Branches</p>
                <p className="text-2xl font-bold text-blue-900">{dashboardData.totalBranches}</p>
              </div>
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Active Branches</p>
                <p className="text-2xl font-bold text-green-900">{dashboardData.activeBranches}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Targets Achieved</p>
                <p className="text-2xl font-bold text-purple-900">{formatPercentage(dashboardData.branchTargetsAchieved)}</p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Top Performing and Underperforming Branches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-semibold text-slate-900 mb-4 flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              Top Performing Branches
            </h3>
            <div className="space-y-3">
              {topPerformingBranches.map((branch) => (
                <div key={branch.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{branch.name}</p>
                    <p className="text-xs text-slate-500">{branch.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{formatPercentage(branch.performance)}</p>
                    <p className="text-xs text-slate-500">{branch.totalCustomers} customers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-slate-900 mb-4 flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              Underperforming Branches
            </h3>
            <div className="space-y-3">
              {underperformingBranches.map((branch) => (
                <div key={branch.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{branch.name}</p>
                    <p className="text-xs text-slate-500">{branch.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">{formatPercentage(branch.performance)}</p>
                    <p className="text-xs text-slate-500">{branch.totalCustomers} customers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sharia Compliance Status */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sharia Compliance Status</h2>
            <p className="text-slate-600">Overall system compliance with Islamic banking principles</p>
          </div>
          <div className="flex items-center space-x-2">
            {compliancePercentage >= 90 ? (
              <>
                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                <span className="text-green-600 font-medium">Fully Compliant</span>
              </>
            ) : compliancePercentage >= 75 ? (
              <>
                <ShieldCheckIcon className="h-6 w-6 text-yellow-600" />
                <span className="text-yellow-600 font-medium">Partially Compliant</span>
              </>
            ) : (
              <>
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                <span className="text-red-600 font-medium">Compliance Issues</span>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                compliancePercentage >= 90 ? 'bg-green-600' : 
                compliancePercentage >= 75 ? 'bg-yellow-500' : 
                'bg-red-600'
              }`}
              style={{ width: `${compliancePercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-500">0%</span>
            <span className="text-xs font-medium text-slate-700">{compliancePercentage}% Sharia Compliant</span>
            <span className="text-xs text-slate-500">100%</span>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-slate-600">
          <p>
            {compliancePercentage >= 90 
              ? "All banking operations are currently in compliance with Sharia principles." 
              : compliancePercentage >= 75 
              ? "Some operations require review to ensure full Sharia compliance." 
              : "Urgent review needed for multiple operations to meet Sharia requirements."}
          </p>
        </div>
      </div>

      {/* Recent Customers and Islamic Banking Principles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Customers</h2>
            <Link 
              href="/dashboard/customers"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-medium">{customer.name.charAt(0)}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.accountType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{customer.accountBalance}</p>
                  <p className="text-xs text-slate-500">Joined {customer.joinDate}</p>
                </div>
              </div>
            ))}
            
            {recentCustomers.length === 0 && (
              <div className="text-center py-6">
                <p className="text-slate-500">No customers yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Islamic Banking Principles */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Islamic Banking Principles</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="p-2 bg-green-50 rounded-lg">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">No Interest (Riba)</p>
                <p className="text-xs text-slate-500">
                  All financial products avoid interest-based transactions, complying with Islamic law
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">Profit-Loss Sharing</p>
                <p className="text-xs text-slate-500">
                  Financial transactions based on equitable risk and profit sharing between parties
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 bg-purple-50 rounded-lg">
                <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">Ethical Investments</p>
                <p className="text-xs text-slate-500">
                  All investments screened to ensure they are halal and socially responsible
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 bg-orange-50 rounded-lg">
                <ClockIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">Regular Sharia Audits</p>
                <p className="text-xs text-slate-500">
                  System undergoes regular compliance reviews by qualified Sharia scholars
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
