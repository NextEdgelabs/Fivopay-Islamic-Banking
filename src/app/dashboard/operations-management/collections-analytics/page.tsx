"use client";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface CollectionMetrics {
  collection_target: number;
  collection_achieved: number;
  collection_efficiency: number;
  overdue_amount: number;
  collection_cost: number;
  recovery_rate: number;
}

interface Agent {
  agent_id: string;
  agent_name: string;
  territory: string;
  target_assigned: number;
  amount_collected: number;
  collection_ratio: number;
  customer_visits: number;
  successful_recoveries: number;
}

export default function CollectionsAnalyticsPage() {
  const [searchAgentId, setSearchAgentId] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [collectionTarget, setCollectionTarget] = useState("");

  const collectionMetrics: CollectionMetrics = {
    collection_target: 50000000,
    collection_achieved: 47250000,
    collection_efficiency: 94.5,
    overdue_amount: 2750000,
    collection_cost: 850000,
    recovery_rate: 68.5,
  };

  const mockAgents: Agent[] = [
    {
      agent_id: "AG001",
      agent_name: "Rajesh Kumar",
      territory: "North Delhi",
      target_assigned: 5000000,
      amount_collected: 4850000,
      collection_ratio: 97.0,
      customer_visits: 45,
      successful_recoveries: 38,
    },
    {
      agent_id: "AG002",
      agent_name: "Priya Sharma",
      territory: "South Delhi",
      target_assigned: 4500000,
      amount_collected: 4320000,
      collection_ratio: 96.0,
      customer_visits: 42,
      successful_recoveries: 35,
    },
    {
      agent_id: "AG003",
      agent_name: "Amit Patel",
      territory: "East Delhi",
      target_assigned: 4000000,
      amount_collected: 3680000,
      collection_ratio: 92.0,
      customer_visits: 38,
      successful_recoveries: 28,
    },
    {
      agent_id: "AG004",
      agent_name: "Neha Singh",
      territory: "West Delhi",
      target_assigned: 3800000,
      amount_collected: 3610000,
      collection_ratio: 95.0,
      customer_visits: 40,
      successful_recoveries: 32,
    },
    {
      agent_id: "AG005",
      agent_name: "Vikram Verma",
      territory: "Central Delhi",
      target_assigned: 3500000,
      amount_collected: 3150000,
      collection_ratio: 90.0,
      customer_visits: 35,
      successful_recoveries: 25,
    },
  ];

  const filteredAgents = mockAgents.filter(agent =>
    agent.agent_id.toLowerCase().includes(searchAgentId.toLowerCase()) ||
    agent.agent_name.toLowerCase().includes(searchAgentId.toLowerCase())
  );

  const getPerformanceColor = (ratio: number) => {
    if (ratio >= 95) return "text-green-600 bg-green-100";
    if (ratio >= 90) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "text-green-600";
    if (efficiency >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const handleTargetUpdate = () => {
    if (collectionTarget) {
      // Handle target update logic here
      console.log("Collection target updated:", collectionTarget);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collection Analytics</h1>
          <p className="text-gray-600">Collection performance and agent productivity tracking</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last 1 Year</option>
          </select>
        </div>
      </div>

      {/* Collection Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Collection Metrics</h2>
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Collection Target</p>
                  <p className="text-2xl font-bold text-blue-900">₹5.0 Cr</p>
                  <div className="flex items-center mt-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">Monthly Target</span>
                  </div>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Collection Achieved</p>
                  <p className="text-2xl font-bold text-green-900">₹4.73 Cr</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">94.5%</span>
                  </div>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Overdue Amount</p>
                  <p className="text-2xl font-bold text-yellow-900">₹27.5 L</p>
                  <div className="flex items-center mt-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-yellow-600">5.5%</span>
                  </div>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Collection Efficiency</p>
                  <p className={`text-2xl font-bold ${getEfficiencyColor(collectionMetrics.collection_efficiency)}`}>
                    {collectionMetrics.collection_efficiency}%
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-sm font-medium text-purple-600">+2.1%</span>
                  </div>
                </div>
                <ChartBarIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Collection Cost</p>
                  <p className="text-2xl font-bold text-orange-900">₹8.5 L</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingDownIcon className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm font-medium text-orange-600">-5.2%</span>
                  </div>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">Recovery Rate</p>
                  <p className="text-2xl font-bold text-indigo-900">{collectionMetrics.recovery_rate}%</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-indigo-500 mr-1" />
                    <span className="text-sm font-medium text-indigo-600">+1.8%</span>
                  </div>
                </div>
                <ArrowTrendingUpIcon className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
          </div>

          {/* Target Update Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Update Collection Target</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Target Amount</label>
                <div className="relative">
                  <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={collectionTarget}
                    onChange={(e) => setCollectionTarget(e.target.value)}
                    placeholder="Enter new target amount"
                    className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={handleTargetUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Target
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance</h2>
          
          {/* Search Agent */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Agent ID or Name"
                value={searchAgentId}
                onChange={(e) => setSearchAgentId(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Agents Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Territory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ratio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recoveries</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.map((agent) => (
                  <tr key={agent.agent_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{agent.agent_name}</div>
                        <div className="text-sm text-gray-500">{agent.agent_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{agent.territory}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{(agent.target_assigned / 100000).toFixed(1)}L</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{(agent.amount_collected / 100000).toFixed(1)}L</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(agent.collection_ratio)}`}>
                        {agent.collection_ratio}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{agent.customer_visits}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-900">{agent.successful_recoveries}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Top Performer</h4>
              <div className="text-lg font-bold text-green-600">Rajesh Kumar</div>
              <div className="text-sm text-gray-600">97% Collection Ratio</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Most Visits</h4>
              <div className="text-lg font-bold text-blue-600">Rajesh Kumar</div>
              <div className="text-sm text-gray-600">45 Customer Visits</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Best Recovery</h4>
              <div className="text-lg font-bold text-purple-600">Rajesh Kumar</div>
              <div className="text-sm text-gray-600">38 Successful Recoveries</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Average Performance</h4>
              <div className="text-lg font-bold text-orange-600">94%</div>
              <div className="text-sm text-gray-600">Collection Ratio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
