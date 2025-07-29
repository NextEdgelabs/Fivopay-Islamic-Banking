'use client';

import { useState } from 'react';
import {
  UserGroupIcon,
  BanknotesIcon,
  ChartBarIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentChartBarIcon,
  UserIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import {
  FieldAgent,
  Collection,
  CustomerAssignment,
  CollectionStatistics,
  AgentFilter,
  CollectionFilter,
} from './types';
import { useFieldAgentContext } from './context/FieldAgentContext';

// Toast notification state
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Toast component
const Toast = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const bgColor = toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}>
      <span>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="ml-4 text-white hover:text-gray-200">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string;
  change?: string;
  icon: any;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-1">{change}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// Statistics Cards Component
const StatisticsCards = ({ stats }: { stats: CollectionStatistics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <KPICard
      title="Total Collections"
      value={stats.totalCollections.toLocaleString()}
      change="+12% from last month"
      icon={BanknotesIcon}
      color="bg-blue-500"
    />
    <KPICard
      title="Total Amount Collected"
      value={`INR ${stats.totalAmount.toLocaleString()}`}
      change="+8% from last month"
      icon={ChartBarIcon}
      color="bg-green-500"
    />
    <KPICard
      title="Active Agents"
      value={stats.activeAgents.toString()}
      change={`${((stats.activeAgents / stats.totalAgents) * 100).toFixed(1)}% of total`}
      icon={UserGroupIcon}
      color="bg-purple-500"
    />
    <KPICard
      title="Success Rate"
      value={`${((stats.successfulCollections / stats.totalCollections) * 100).toFixed(1)}%`}
      change="+5% from last month"
      icon={CheckCircleIcon}
      color="bg-emerald-500"
    />
  </div>
);

// Filters Component
const Filters = ({
  searchTerm,
  statusFilter,
  branchFilter,
  territoryFilter,
  onSearchChange,
  onStatusChange,
  onBranchChange,
  onTerritoryChange,
  onClearFilters,
}: {
  searchTerm: string;
  statusFilter: string;
  branchFilter: string;
  territoryFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onTerritoryChange: (value: string) => void;
  onClearFilters: () => void;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents, customers, collections..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Suspended">Suspended</option>
      </select>
      
      <select
        value={branchFilter}
        onChange={(e) => onBranchChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">All Branches</option>
        <option value="FP001">Mumbai Main</option>
        <option value="FP002">Bandra</option>
        <option value="FP003">Pune</option>
        <option value="FP004">Delhi</option>
      </select>
      
      <select
        value={territoryFilter}
        onChange={(e) => onTerritoryChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">All Territories</option>
        <option value="North Mumbai">North Mumbai</option>
        <option value="South Mumbai">South Mumbai</option>
        <option value="Pune City">Pune City</option>
        <option value="Delhi Central">Delhi Central</option>
      </select>
      
      <button
        onClick={onClearFilters}
        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
      >
        <FunnelIcon className="h-4 w-4" />
        <span>Clear</span>
      </button>
    </div>
  </div>
);

// Agent Table Component
const AgentTable = ({ agents, onViewDetails }: { agents: FieldAgent[]; onViewDetails: (agent: FieldAgent) => void }) => (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Branch
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Collections
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount Collected
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Performance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {agents.map((agent) => (
            <tr key={agent.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                    <div className="text-sm text-gray-500">{agent.agentCode}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{agent.branchName}</div>
                <div className="text-sm text-gray-500">{agent.territory}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  agent.status === 'Active' ? 'bg-green-100 text-green-800' :
                  agent.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {agent.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {agent.totalCollections}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                INR {agent.totalAmountCollected.toLocaleString()}
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onViewDetails(agent)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function FieldAgentsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [territoryFilter, setTerritoryFilter] = useState('all');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<FieldAgent | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { agents, getCollectionStatistics, getAgentStatistics } = useFieldAgentContext();

  // Get statistics from context
  const stats = getCollectionStatistics();

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === '' || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || agent.branchId === branchFilter;
    const matchesTerritory = territoryFilter === 'all' || agent.territory === territoryFilter;
    
    return matchesSearch && matchesStatus && matchesBranch && matchesTerritory;
  });

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleViewDetails = (agent: FieldAgent) => {
    setSelectedAgent(agent);
    setShowDetailsModal(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setBranchFilter('all');
    setTerritoryFilter('all');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Field Agent Management</h1>
          <p className="text-gray-600 mt-1">Manage field agents and track cash collections</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <PlusIcon className="w-5 h-5" />
            <span>Add New Agent</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards stats={stats} />

      {/* Filters */}
      <Filters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        branchFilter={branchFilter}
        territoryFilter={territoryFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onBranchChange={setBranchFilter}
        onTerritoryChange={setTerritoryFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'agents', name: 'Field Agents', icon: UserGroupIcon },
              { id: 'collections', name: 'Collections', icon: BanknotesIcon },
              { id: 'assignments', name: 'Assignments', icon: UserIcon },
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Collections</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Collection #{1000 + i}</p>
                            <p className="text-xs text-gray-500">Rahul Sharma • North Mumbai</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">INR 15,000</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monthly Target</span>
                      <span className="text-sm font-medium text-gray-900">INR 5,000,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Achieved</span>
                      <span className="text-sm font-medium text-gray-900">INR 3,080,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Remaining</span>
                      <span className="text-sm font-medium text-gray-900">INR 1,920,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '61.6%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">61.6% of monthly target achieved</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Field Agents ({filteredAgents.length})</h3>
                <div className="text-sm text-gray-500">
                  Showing {filteredAgents.length} of {agents.length} agents
                </div>
              </div>
              <AgentTable agents={filteredAgents} onViewDetails={handleViewDetails} />
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="text-center py-12">
              <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Collections Management</h3>
              <p className="mt-1 text-sm text-gray-500">View and manage all collection records.</p>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Customer Assignments</h3>
              <p className="mt-1 text-sm text-gray-500">Manage customer-agent assignments.</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
} 