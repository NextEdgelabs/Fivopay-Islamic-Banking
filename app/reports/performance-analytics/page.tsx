'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Loader2,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import { exportChartAsPNG, exportKPIsAsCSV } from '@/lib/reportExport';
import { reportsService, type Pagination as PaginationType } from '@/services/reports.service';
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

  // API state
  const [summaryData, setSummaryData] = useState<any>(null);
  const [tabData, setTabData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      setError(null);
      const response = await reportsService.getPerformanceSummary({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        branch: filters.branch,
        search: filters.search,
      });
      setSummaryData(response.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch performance summary');
    } finally {
      setSummaryLoading(false);
    }
  }, [filters.dateFrom, filters.dateTo, filters.branch, filters.search]);

  const fetchTabData = useCallback(async () => {
    try {
      setTabLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: 10,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        branch: filters.branch,
        search: filters.search,
      };

      if (activeTab === 'branches') {
        const response = await reportsService.getPerformanceTopBranches(params);
        setTabData(response.data.topBranches || []);
        setPagination(response.data.pagination || null);
      } else {
        const response = await reportsService.getPerformanceTopAgents(params);
        setTabData(response.data.topAgents || []);
        setPagination(response.data.pagination || null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch tab data');
    } finally {
      setTabLoading(false);
    }
  }, [activeTab, currentPage, filters.dateFrom, filters.dateTo, filters.branch, filters.search]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchTabData();
  }, [fetchTabData]);

  // Derived data from API
  const kpis = summaryData?.summary;
  const slaPerformanceData = summaryData?.charts?.slaPerformance || [];
  const loanProcessingTimeData = summaryData?.charts?.processingTimeTrend || [];

  // Static filter options
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
    setCurrentPage(1);
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
                  { label: 'Avg Loan Approval Time', value: `${kpis?.avgLoanApprovalTime ?? '-'} hrs` },
                  { label: 'Avg KYC Verification Time', value: `${kpis?.avgKycVerificationTime ?? '-'} hrs` },
                  { label: 'Tickets Open', value: String(kpis?.ticketsOpen ?? '-') },
                  { label: 'Tickets Resolved', value: String(kpis?.ticketsResolved ?? '-') },
                  { label: 'Agent Productivity Index', value: `${kpis?.agentProductivityIndex ?? '-'}%` },
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

        {/* Error Banner */}
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-error-700">{error}</p>
            <Button variant="outline" size="sm" onClick={() => { fetchSummary(); fetchTabData(); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* KPI Cards + Charts */}
        {summaryLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1 font-medium">Avg Loan Approval Time</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {kpis?.avgLoanApprovalTime ?? '-'} hrs
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
                      {kpis?.avgKycVerificationTime ?? '-'} hrs
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
                      {kpis?.ticketsOpen ?? '-'} / {kpis?.ticketsResolved ?? '-'}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {kpis?.ticketsOpen != null && kpis?.ticketsResolved != null
                        ? `${((kpis.ticketsResolved / (kpis.ticketsOpen + kpis.ticketsResolved)) * 100).toFixed(1)}% resolution rate`
                        : '—'}
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
                      {kpis?.agentProductivityIndex ?? '-'}%
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
                  {slaPerformanceData.length > 0 ? (
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
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400">
                      No SLA data available
                    </div>
                  )}
                </div>
              </Card>

              {/* Loan Processing Time Trend */}
              <Card className="p-6 bg-white border border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Loan Processing Time Trend
                </h3>
                <div className="h-80">
                  {loanProcessingTimeData.length > 0 ? (
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
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400">
                      No processing time data available
                    </div>
                  )}
                </div>
              </Card>
              </div>
            </div>
          </>
        )}

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
              <Input
                label="Branch"
                placeholder="Filter by branch..."
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
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
              const filename = activeTab === 'branches'
                ? 'top-performing-branches'
                : 'top-performing-agents';
              exportToCSV(tabData, `${filename}-${new Date().toISOString().split('T')[0]}`);
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
                    {tabLoading && activeTab === 'branches' ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                      </div>
                    ) : (
                      <>
                        <Table
                          data={tabData}
                          columns={branchColumns}
                          onRowClick={(row) => {
                            console.log('View branch performance:', row);
                          }}
                        />
                        {pagination && pagination.totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {((pagination.currentPage - 1) * itemsPerPage) + 1} to{' '}
                              {Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)} of{' '}
                              {pagination.totalItems} branches
                            </p>
                            <Pagination
                              currentPage={pagination.currentPage}
                              totalPages={pagination.totalPages}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ),
              },
              {
                id: 'agents',
                label: 'Top Performing Agents',
                content: (
                  <div className="mt-4">
                    {tabLoading && activeTab === 'agents' ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                      </div>
                    ) : (
                      <>
                        <Table
                          data={tabData}
                          columns={agentColumns}
                          onRowClick={(row) => {
                            console.log('View agent performance:', row);
                          }}
                        />
                        {pagination && pagination.totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {((pagination.currentPage - 1) * itemsPerPage) + 1} to{' '}
                              {Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)} of{' '}
                              {pagination.totalItems} agents
                            </p>
                            <Pagination
                              currentPage={pagination.currentPage}
                              totalPages={pagination.totalPages}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                      </>
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
