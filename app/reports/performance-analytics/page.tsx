'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Table,
  Tabs,
  Pagination,
  Input,
  Select,
  Breadcrumbs,
} from '@/components/ui';
import {
  Filter,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  Clock,
  CheckCircle,
  Users,
  Award,
  Calendar,
  BarChart3,
  Image as ImageIcon,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import { exportChartAsPNG, exportKPIsAsCSV } from '@/lib/reportExport';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Type definitions
interface TopPerformer {
  id: string;
  name: string;
  type: 'Branch' | 'Agent';
  branch?: string;
  metric: string;
  value: number;
  change: number; // percentage
  rank: number;
}

// Generate dummy data
const generateTopPerformers = (): TopPerformer[] => {
  const performers: TopPerformer[] = [];
  const branches = ['Main Branch', 'Downtown Branch', 'City Center', 'Suburban Branch', 'North Branch'];
  const agents = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh',
    'Anjali Desai', 'Rohit Mehta', 'Kavita Nair', 'Suresh Iyer', 'Meera Joshi'
  ];

  // Top Branches
  branches.forEach((branch, index) => {
    const productivity = 70 + Math.random() * 25; // 70-95%
    performers.push({
      id: `branch-${index + 1}`,
      name: branch,
      type: 'Branch',
      metric: 'Productivity Index',
      value: parseFloat(productivity.toFixed(1)),
      change: (Math.random() * 10 - 5), // -5% to +5%
      rank: index + 1,
    });
  });

  // Top Agents
  agents.slice(0, 10).forEach((agent, index) => {
    const productivity = 65 + Math.random() * 30; // 65-95%
    performers.push({
      id: `agent-${index + 1}`,
      name: agent,
      type: 'Agent',
      branch: branches[Math.floor(Math.random() * branches.length)],
      metric: 'Productivity Index',
      value: parseFloat(productivity.toFixed(1)),
      change: (Math.random() * 15 - 5), // -5% to +10%
      rank: index + 1,
    });
  });

  return performers.sort((a, b) => b.value - a.value);
};

const allTopPerformers = generateTopPerformers();

export default function PerformanceAnalyticsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('branches');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const chartsSectionRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    branch: '',
    department: '',
    loanType: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(true);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const avgLoanApprovalTime = 18.5; // hours
    const avgKYCVerificationTime = 4.2; // hours
    const ticketsOpen = 23;
    const ticketsResolved = 187;
    const agentProductivityIndex = 82.5; // percentage

    return {
      avgLoanApprovalTime,
      avgKYCVerificationTime,
      ticketsOpen,
      ticketsResolved,
      agentProductivityIndex,
    };
  }, []);

  // Chart data
  const slaPerformanceData = [
    { department: 'Loan Processing', sla: 95, target: 90 },
    { department: 'KYC Verification', sla: 88, target: 85 },
    { department: 'Customer Service', sla: 92, target: 90 },
    { department: 'Collections', sla: 85, target: 80 },
    { department: 'Compliance', sla: 98, target: 95 },
    { department: 'IT Support', sla: 90, target: 88 },
  ];

  const loanProcessingTimeData = [
    { month: 'Jan', avgTime: 20.5, target: 18 },
    { month: 'Feb', avgTime: 19.2, target: 18 },
    { month: 'Mar', avgTime: 18.8, target: 18 },
    { month: 'Apr', avgTime: 18.5, target: 18 },
    { month: 'May', avgTime: 18.1, target: 18 },
    { month: 'Jun', avgTime: 17.9, target: 18 },
    { month: 'Jul', avgTime: 17.5, target: 18 },
    { month: 'Aug', avgTime: 17.2, target: 18 },
    { month: 'Sep', avgTime: 16.8, target: 18 },
    { month: 'Oct', avgTime: 16.5, target: 18 },
    { month: 'Nov', avgTime: 16.2, target: 18 },
    { month: 'Dec', avgTime: 15.9, target: 18 },
  ];

  // Filter data
  const filteredBranches = useMemo(() => {
    let filtered = allTopPerformers.filter(p => p.type === 'Branch');

    if (filters.branch) {
      filtered = filtered.filter(p => p.name === filters.branch);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower));
    }

    return filtered;
  }, [filters]);

  const filteredAgents = useMemo(() => {
    let filtered = allTopPerformers.filter(p => p.type === 'Agent');

    if (filters.branch) {
      filtered = filtered.filter(p => p.branch === filters.branch);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower));
    }

    return filtered;
  }, [filters]);

  // Pagination
  const getPaginatedData = (data: any[]) => {
    return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };

  const totalPages = (data: any[]) => Math.ceil(data.length / itemsPerPage);

  // Get unique values for filters
  const uniqueBranches = Array.from(new Set(allTopPerformers.map(p => p.name).filter(n => allTopPerformers.find(p => p.name === n && p.type === 'Branch')))).sort();
  const departments = ['Loan Processing', 'KYC Verification', 'Customer Service', 'Collections', 'Compliance', 'IT Support'];
  const loanTypes = ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Vehicle Loan', 'Gold Loan'];

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      branch: '',
      department: '',
      loanType: '',
      search: '',
    });
  };


  // Table columns
  const branchColumns = [
    {
      key: 'rank',
      header: 'Rank',
      sortable: true,
      width: '80px',
      render: (rank: number) => (
        <div className="flex items-center gap-2">
          {rank <= 3 && (
            <Award className={`h-4 w-4 ${
              rank === 1 ? 'text-yellow-500' :
              rank === 2 ? 'text-gray-400' :
              'text-orange-600'
            }`} />
          )}
          <span className="font-semibold text-neutral-900">#{rank}</span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Branch Name',
      sortable: true,
      width: '200px',
    },
    {
      key: 'metric',
      header: 'Metric',
      sortable: true,
      width: '180px',
    },
    {
      key: 'value',
      header: 'Value',
      sortable: true,
      width: '140px',
      render: (value: number) => (
        <span className="text-lg font-bold text-neutral-900">{value}%</span>
      ),
    },
    {
      key: 'change',
      header: 'Change',
      sortable: true,
      width: '140px',
      render: (change: number) => (
        <div className="flex items-center gap-1">
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4 text-success-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-error-600" />
          )}
          <span className={`text-sm font-medium ${
            change >= 0 ? 'text-success-600' : 'text-error-600'
          }`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      ),
    },
  ];

  const agentColumns = [
    {
      key: 'rank',
      header: 'Rank',
      sortable: true,
      width: '80px',
      render: (rank: number) => (
        <div className="flex items-center gap-2">
          {rank <= 3 && (
            <Award className={`h-4 w-4 ${
              rank === 1 ? 'text-yellow-500' :
              rank === 2 ? 'text-gray-400' :
              'text-orange-600'
            }`} />
          )}
          <span className="font-semibold text-neutral-900">#{rank}</span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Agent Name',
      sortable: true,
      width: '180px',
    },
    {
      key: 'branch',
      header: 'Branch',
      sortable: true,
      width: '160px',
    },
    {
      key: 'metric',
      header: 'Metric',
      sortable: true,
      width: '180px',
    },
    {
      key: 'value',
      header: 'Value',
      sortable: true,
      width: '140px',
      render: (value: number) => (
        <span className="text-lg font-bold text-neutral-900">{value}%</span>
      ),
    },
    {
      key: 'change',
      header: 'Change',
      sortable: true,
      width: '140px',
      render: (change: number) => (
        <div className="flex items-center gap-1">
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4 text-success-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-error-600" />
          )}
          <span className={`text-sm font-medium ${
            change >= 0 ? 'text-success-600' : 'text-error-600'
          }`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Reports', href: '/reports' },
                { label: 'Performance Analytics' },
              ]}
            />
            <h1 className="text-3xl font-bold text-neutral-900 mt-2">
              Performance Analytics
            </h1>
            <p className="text-neutral-600 mt-1">
              Operational efficiency tracking and performance metrics
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => exportChartAsPNG(chartsSectionRef.current, 'performance-charts', 'Performance Analytics')}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Export Charts
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              exportKPIsAsCSV(
                [
                  { label: 'Avg Loan Approval Time', value: `${kpis.avgLoanApprovalTime} hrs` },
                  { label: 'Avg KYC Verification Time', value: `${kpis.avgKYCVerificationTime} hrs` },
                  { label: 'Tickets Open', value: String(kpis.ticketsOpen) },
                  { label: 'Tickets Resolved', value: String(kpis.ticketsResolved) },
                  { label: 'Agent Productivity Index', value: `${kpis.agentProductivityIndex}%` },
                ],
                'performance-analytics',
                'Performance Analytics'
              )
            }
          >
            <Download className="h-4 w-4 mr-2" />
            Export KPIs
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1 font-medium">Avg Loan Approval Time</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.avgLoanApprovalTime} hrs
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-success-600" />
                  <span className="text-xs text-success-600">-2.3 hrs vs last month</span>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1 font-medium">Avg KYC Verification Time</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.avgKYCVerificationTime} hrs
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-success-600" />
                  <span className="text-xs text-success-600">-0.8 hrs vs last month</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1 font-medium">Tickets Open vs Resolved</p>
                <p className="text-lg font-bold text-neutral-900">
                  {kpis.ticketsOpen} / {kpis.ticketsResolved}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {((kpis.ticketsResolved / (kpis.ticketsOpen + kpis.ticketsResolved)) * 100).toFixed(1)}% resolution rate
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1 font-medium">Agent Productivity Index</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.agentProductivityIndex}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success-600" />
                  <span className="text-xs text-success-600">+3.2% vs last month</span>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div ref={chartsSectionRef} className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Performance Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SLA Performance by Department */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              SLA Performance by Department
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slaPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="department"
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    domain={[0, 100]}
                    label={{ value: 'SLA %', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Legend />
                  <Bar dataKey="sla" fill="#3B82F6" name="Actual SLA" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="target" fill="#10B981" name="Target SLA" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Loan Processing Time Trend */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Loan Processing Time Trend
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loanProcessingTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `${value} hrs`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgTime"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Avg Processing Time"
                    dot={{ fill: '#3B82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target Time"
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-white border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-neutral-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                type="date"
                label="Date From"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
              <Input
                type="date"
                label="Date To"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
              <Select
                label="Branch"
                placeholder="All Branches"
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                options={[
                  { value: '', label: 'All Branches' },
                  ...uniqueBranches.map((branch) => ({
                    value: branch,
                    label: branch,
                  })),
                ]}
              />
              <Select
                label="Department"
                placeholder="All Departments"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                options={[
                  { value: '', label: 'All Departments' },
                  ...departments.map((dept) => ({
                    value: dept,
                    label: dept,
                  })),
                ]}
              />
              <Select
                label="Loan Type"
                placeholder="All Types"
                value={filters.loanType}
                onChange={(e) => setFilters({ ...filters, loanType: e.target.value })}
                options={[
                  { value: '', label: 'All Types' },
                  ...loanTypes.map((type) => ({
                    value: type,
                    label: type,
                  })),
                ]}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <Input
                  label="Search"
                  placeholder="Search by Branch or Agent Name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              let dataToExport: any[] = [];
              let filename = 'performance-analytics';
              
              if (activeTab === 'branches') {
                dataToExport = filteredBranches;
                filename = 'top-performing-branches';
              } else if (activeTab === 'agents') {
                dataToExport = filteredAgents;
                filename = 'top-performing-agents';
              }
              
              exportToCSV(dataToExport, `${filename}-${new Date().toISOString().split('T')[0]}`);
            }}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => {
            console.log('Schedule Report');
          }}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
        </div>

        {/* Top Performers Table */}
        <Card className="p-6 bg-white border border-neutral-200">
          <Tabs
            tabs={[
              {
                id: 'branches',
                label: 'Top Performing Branches',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredBranches)}
                      columns={branchColumns}
                      onRowClick={(row) => {
                        console.log('View branch performance:', row);
                      }}
                    />
                    {totalPages(filteredBranches) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredBranches.length)} of{' '}
                          {filteredBranches.length} branches
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredBranches)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'agents',
                label: 'Top Performing Agents',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredAgents)}
                      columns={agentColumns}
                      onRowClick={(row) => {
                        console.log('View agent performance:', row);
                      }}
                    />
                    {totalPages(filteredAgents) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredAgents.length)} of{' '}
                          {filteredAgents.length} agents
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredAgents)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
            defaultTab="branches"
            onChange={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
            }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}

