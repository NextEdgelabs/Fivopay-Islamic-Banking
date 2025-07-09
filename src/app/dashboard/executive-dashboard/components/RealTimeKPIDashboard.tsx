"use client";
import { useState } from "react";
import { 
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  StarIcon
} from "@heroicons/react/24/outline";

export default function RealTimeKPIDashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    periodType: 'Daily'
  });

  // Mock data for portfolio metrics
  const portfolioMetrics = {
    totalPortfolioValue: 2500000000, // 2.5 billion INR
    activeLoansCount: 15000,
    totalDeposits: 1800000000, // 1.8 billion INR
    activeCustomers: 45000,
    newCustomersToday: 125,
    portfolioGrowthRate: 0.085 // 8.5%
  };

  // Mock data for performance indicators
  const performanceIndicators = {
    loanApprovalRate: 0.92, // 92%
    collectionEfficiency: 0.96, // 96%
    npaPercentage: 0.035, // 3.5%
    profitMargin: 0.18, // 18%
    customerSatisfactionScore: 4.3 // 4.3/5
  };

  // Mock data for branch network
  const branchNetwork = {
    totalBranches: 45,
    activeBranches: 42,
    branchTargetsAchieved: 0.87, // 87%
    topPerformingBranches: [
      { name: "Mumbai Central", location: "Mumbai", performance: 0.95, customers: 2500, transactions: 15000 },
      { name: "Delhi Connaught Place", location: "Delhi", performance: 0.93, customers: 2200, transactions: 13500 },
      { name: "Bangalore Koramangala", location: "Bangalore", performance: 0.91, customers: 2100, transactions: 12800 }
    ],
    underperformingBranches: [
      { name: "Chennai T Nagar", location: "Chennai", performance: 0.72, customers: 1800, transactions: 9500 },
      { name: "Kolkata Park Street", location: "Kolkata", performance: 0.75, customers: 1900, transactions: 10200 },
      { name: "Hyderabad Banjara Hills", location: "Hyderabad", performance: 0.78, customers: 2000, transactions: 11000 }
    ]
  };

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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Date Range Selection</h2>
            <p className="text-slate-600">Select the period for KPI analysis</p>
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
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(portfolioMetrics.totalPortfolioValue)}</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Active Loans</p>
                <p className="text-2xl font-bold text-green-900">{formatNumber(portfolioMetrics.activeLoansCount)}</p>
              </div>
              <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Total Deposits</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(portfolioMetrics.totalDeposits)}</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Active Customers</p>
                <p className="text-2xl font-bold text-orange-900">{formatNumber(portfolioMetrics.activeCustomers)}</p>
              </div>
              <UserIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-700">New Customers Today</p>
                <p className="text-2xl font-bold text-teal-900">{portfolioMetrics.newCustomersToday}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-teal-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700">Portfolio Growth Rate</p>
                <p className="text-2xl font-bold text-indigo-900">{formatPercentage(portfolioMetrics.portfolioGrowthRate)}</p>
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
            <p className="text-xl font-bold text-slate-900">{formatPercentage(performanceIndicators.loanApprovalRate)}</p>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">Collection Efficiency</p>
            <p className="text-xl font-bold text-slate-900">{formatPercentage(performanceIndicators.collectionEfficiency)}</p>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">NPA Percentage</p>
            <p className="text-xl font-bold text-slate-900">{formatPercentage(performanceIndicators.npaPercentage)}</p>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">Profit Margin</p>
            <p className="text-xl font-bold text-slate-900">{formatPercentage(performanceIndicators.profitMargin)}</p>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">Customer Satisfaction</p>
            <p className="text-xl font-bold text-slate-900">{performanceIndicators.customerSatisfactionScore}/5</p>
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
                <p className="text-2xl font-bold text-blue-900">{branchNetwork.totalBranches}</p>
              </div>
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Active Branches</p>
                <p className="text-2xl font-bold text-green-900">{branchNetwork.activeBranches}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Targets Achieved</p>
                <p className="text-2xl font-bold text-purple-900">{formatPercentage(branchNetwork.branchTargetsAchieved)}</p>
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
              {branchNetwork.topPerformingBranches.map((branch, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{branch.name}</p>
                    <p className="text-xs text-slate-500">{branch.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{formatPercentage(branch.performance)}</p>
                    <p className="text-xs text-slate-500">{formatNumber(branch.customers)} customers</p>
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
              {branchNetwork.underperformingBranches.map((branch, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{branch.name}</p>
                    <p className="text-xs text-slate-500">{branch.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">{formatPercentage(branch.performance)}</p>
                    <p className="text-xs text-slate-500">{formatNumber(branch.customers)} customers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 