'use client';

import { useState } from 'react';
import {
  DocumentChartBarIcon,
  ChartBarIcon,
  UserGroupIcon,
  BanknotesIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { CollectionReport, AgentPerformance, TerritoryStatistics, BranchCollectionStats } from '../types';

// Report Card Component
const ReportCard = ({ title, value, change, icon: Icon, color, trend }: {
  title: string;
  value: string;
  change?: string;
  icon: any;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <div className="flex items-center mt-1">
            {trend === 'up' && <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />}
            {trend === 'down' && <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />}
            <span className={`text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
              {change}
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// Performance Chart Component (Mock)
const PerformanceChart = ({ title, data }: { title: string; data: any[] }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="h-64 flex items-end justify-center space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="w-8 bg-blue-500 rounded-t"
            style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 200}px` }}
          ></div>
          <span className="text-xs text-gray-500 mt-2">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

// Agent Performance Table
const AgentPerformanceTable = ({ agents }: { agents: AgentPerformance[] }) => (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Collections
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Success Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Performance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Target Achievement
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {agents.map((agent) => (
            <tr key={agent.agentId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{agent.agentName}</div>
                    <div className="text-sm text-gray-500">{agent.territory}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {agent.totalCollections}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                AED {agent.totalAmount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${agent.successRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{agent.successRate}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${agent.performanceRating}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{agent.performanceRating}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {((agent.monthlyAchievement / agent.monthlyTarget) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">
                  AED {agent.monthlyAchievement.toLocaleString()} / {agent.monthlyTarget.toLocaleString()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Territory Statistics Table
const TerritoryStatisticsTable = ({ territories }: { territories: TerritoryStatistics[] }) => (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Territory
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agents
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Collections
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Success Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customers
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {territories.map((territory) => (
            <tr key={territory.territory} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPinIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{territory.territory}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{territory.activeAgents}</div>
                <div className="text-sm text-gray-500">of {territory.totalAgents}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {territory.totalCollections}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                AED {territory.totalAmount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${territory.successRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{territory.successRate}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{territory.assignedCustomers}</div>
                <div className="text-sm text-gray-500">of {territory.totalCustomers}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  // Mock data for reports
  const [reports] = useState<CollectionReport[]>([
    {
      id: '1',
      reportDate: '2024-01-20',
      agentId: 'FA001',
      agentName: 'Rahul Sharma',
      totalCollections: 156,
      totalAmount: 1250000,
      successfulCollections: 148,
      failedCollections: 5,
      pendingCollections: 3,
      averageCollectionAmount: 8012,
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      territory: 'North Mumbai',
      performanceScore: 92,
    },
    {
      id: '2',
      reportDate: '2024-01-20',
      agentId: 'FA002',
      agentName: 'Amit Patel',
      totalCollections: 142,
      totalAmount: 980000,
      successfulCollections: 135,
      failedCollections: 4,
      pendingCollections: 3,
      averageCollectionAmount: 6901,
      branchId: 'FP002',
      branchName: 'Bandra Branch',
      territory: 'South Mumbai',
      performanceScore: 88,
    },
    {
      id: '3',
      reportDate: '2024-01-20',
      agentId: 'FA003',
      agentName: 'Priya Singh',
      totalCollections: 128,
      totalAmount: 850000,
      successfulCollections: 120,
      failedCollections: 6,
      pendingCollections: 2,
      averageCollectionAmount: 6640,
      branchId: 'FP003',
      branchName: 'Pune Branch',
      territory: 'Pune City',
      performanceScore: 85,
    },
  ]);

  const [agentPerformance] = useState<AgentPerformance[]>([
    {
      agentId: 'FA001',
      agentName: 'Rahul Sharma',
      totalCollections: 156,
      totalAmount: 1250000,
      successRate: 95,
      averageCollectionTime: 45,
      customerSatisfaction: 4.8,
      territory: 'North Mumbai',
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      monthlyTarget: 1500000,
      monthlyAchievement: 1250000,
      performanceRating: 92,
    },
    {
      agentId: 'FA002',
      agentName: 'Amit Patel',
      totalCollections: 142,
      totalAmount: 980000,
      successRate: 92,
      averageCollectionTime: 52,
      customerSatisfaction: 4.6,
      territory: 'South Mumbai',
      branchId: 'FP002',
      branchName: 'Bandra Branch',
      monthlyTarget: 1200000,
      monthlyAchievement: 980000,
      performanceRating: 88,
    },
    {
      agentId: 'FA003',
      agentName: 'Priya Singh',
      totalCollections: 128,
      totalAmount: 850000,
      successRate: 89,
      averageCollectionTime: 48,
      customerSatisfaction: 4.7,
      territory: 'Pune City',
      branchId: 'FP003',
      branchName: 'Pune Branch',
      monthlyTarget: 1000000,
      monthlyAchievement: 850000,
      performanceRating: 85,
    },
  ]);

  const [territoryStats] = useState<TerritoryStatistics[]>([
    {
      territory: 'North Mumbai',
      totalAgents: 8,
      activeAgents: 7,
      totalCollections: 156,
      totalAmount: 1250000,
      averageCollectionAmount: 8012,
      successRate: 95,
      totalCustomers: 45,
      assignedCustomers: 42,
    },
    {
      territory: 'South Mumbai',
      totalAgents: 6,
      activeAgents: 5,
      totalCollections: 142,
      totalAmount: 980000,
      averageCollectionAmount: 6901,
      successRate: 92,
      totalCustomers: 38,
      assignedCustomers: 35,
    },
    {
      territory: 'Pune City',
      totalAgents: 5,
      activeAgents: 4,
      totalCollections: 128,
      totalAmount: 850000,
      averageCollectionAmount: 6640,
      successRate: 89,
      totalCustomers: 32,
      assignedCustomers: 28,
    },
  ]);

  const [branchStats] = useState<BranchCollectionStats[]>([
    {
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      totalCollections: 156,
      totalAmount: 1250000,
      successfulCollections: 148,
      failedCollections: 5,
      pendingCollections: 3,
      totalAgents: 8,
      activeAgents: 7,
      totalCustomers: 45,
      assignedCustomers: 42,
      averageCollectionAmount: 8012,
      successRate: 95,
    },
    {
      branchId: 'FP002',
      branchName: 'Bandra Branch',
      totalCollections: 142,
      totalAmount: 980000,
      successfulCollections: 135,
      failedCollections: 4,
      pendingCollections: 3,
      totalAgents: 6,
      activeAgents: 5,
      totalCustomers: 38,
      assignedCustomers: 35,
      averageCollectionAmount: 6901,
      successRate: 92,
    },
    {
      branchId: 'FP003',
      branchName: 'Pune Branch',
      totalCollections: 128,
      totalAmount: 850000,
      successfulCollections: 120,
      failedCollections: 6,
      pendingCollections: 2,
      totalAgents: 5,
      activeAgents: 4,
      totalCustomers: 32,
      assignedCustomers: 28,
      averageCollectionAmount: 6640,
      successRate: 89,
    },
  ]);

  // Calculate summary statistics
  const totalCollections = reports.reduce((sum, r) => sum + r.totalCollections, 0);
  const totalAmount = reports.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalSuccessful = reports.reduce((sum, r) => sum + r.successfulCollections, 0);
  const totalFailed = reports.reduce((sum, r) => sum + r.failedCollections, 0);
  const totalPending = reports.reduce((sum, r) => sum + r.pendingCollections, 0);
  const averageAmount = totalCollections > 0 ? totalAmount / totalCollections : 0;
  const successRate = totalCollections > 0 ? (totalSuccessful / totalCollections) * 100 : 0;

  // Mock chart data
  const weeklyData = [
    { label: 'Mon', value: 25 },
    { label: 'Tue', value: 30 },
    { label: 'Wed', value: 28 },
    { label: 'Thu', value: 35 },
    { label: 'Fri', value: 32 },
    { label: 'Sat', value: 20 },
    { label: 'Sun', value: 15 },
  ];

  const monthlyData = [
    { label: 'Week 1', value: 120 },
    { label: 'Week 2', value: 135 },
    { label: 'Week 3', value: 142 },
    { label: 'Week 4', value: 128 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collection Reports</h1>
          <p className="text-gray-600 mt-1">Analytics and performance reports for field agents</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title="Total Collections"
          value={totalCollections.toLocaleString()}
          change="+12% from last month"
          icon={BanknotesIcon}
          color="bg-blue-500"
          trend="up"
        />
        <ReportCard
          title="Total Amount"
          value={`AED ${totalAmount.toLocaleString()}`}
          change="+8% from last month"
          icon={ChartBarIcon}
          color="bg-green-500"
          trend="up"
        />
        <ReportCard
          title="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          change="+3% from last month"
          icon={CheckCircleIcon}
          color="bg-emerald-500"
          trend="up"
        />
        <ReportCard
          title="Average Amount"
          value={`AED ${averageAmount.toFixed(0)}`}
          change="-2% from last month"
          icon={ArrowTrendingUpIcon}
          color="bg-purple-500"
          trend="down"
        />
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'agents', name: 'Agent Performance', icon: UserGroupIcon },
              { id: 'territories', name: 'Territory Analysis', icon: MapPinIcon },
              { id: 'branches', name: 'Branch Reports', icon: DocumentChartBarIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceChart title="Weekly Collections" data={weeklyData} />
                <PerformanceChart title="Monthly Collections" data={monthlyData} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">Completed</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{totalSuccessful}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-600">Pending</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{totalPending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm text-gray-600">Failed</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{totalFailed}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                  <div className="space-y-3">
                    {agentPerformance.slice(0, 3).map((agent, index) => (
                      <div key={agent.agentId} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">{agent.agentName}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {agent.performanceRating}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Territory Performance</h3>
                  <div className="space-y-3">
                    {territoryStats.map((territory) => (
                      <div key={territory.territory} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{territory.territory}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {territory.successRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agent Performance Tab */}
          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Agent Performance Analysis</h3>
                <div className="text-sm text-gray-500">
                  Showing performance metrics for all active agents
                </div>
              </div>
              <AgentPerformanceTable agents={agentPerformance} />
            </div>
          )}

          {/* Territory Analysis Tab */}
          {activeTab === 'territories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Territory Analysis</h3>
                <div className="text-sm text-gray-500">
                  Performance breakdown by territory
                </div>
              </div>
              <TerritoryStatisticsTable territories={territoryStats} />
            </div>
          )}

          {/* Branch Reports Tab */}
          {activeTab === 'branches' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Branch Performance Reports</h3>
                <div className="text-sm text-gray-500">
                  Collection performance by branch
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branchStats.map((branch) => (
                  <div key={branch.branchId} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{branch.branchName}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        branch.successRate >= 90 ? 'bg-green-100 text-green-800' :
                        branch.successRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {branch.successRate}% Success
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Collections</span>
                        <span className="text-sm font-medium text-gray-900">{branch.totalCollections}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Amount</span>
                        <span className="text-sm font-medium text-gray-900">AED {branch.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Agents</span>
                        <span className="text-sm font-medium text-gray-900">{branch.activeAgents}/{branch.totalAgents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Customers</span>
                        <span className="text-sm font-medium text-gray-900">{branch.assignedCustomers}/{branch.totalCustomers}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 