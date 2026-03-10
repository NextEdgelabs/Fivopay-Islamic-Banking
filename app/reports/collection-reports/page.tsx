'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  IndianRupee,
  Users,
  MapPin,
  Award,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import { exportChartAsPNG, exportKPIsAsCSV } from '@/lib/reportExport';
import { reportsService, type Pagination as PaginationType } from '@/services/reports.service';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Type definitions
interface AgentCollectionSummary {
  id: string;
  agentId: string;
  name: string;
  branch: string;
  totalCollected: number;
  deposited: number;
  pending: number;
  visits: number;
  successRate: number;
}

interface CollectionLog {
  id: string;
  transactionId: string;
  loanId: string;
  customer: string;
  agent: string;
  date: string;
  amount: number;
  mode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  status: 'Collected' | 'Pending' | 'Verified' | 'Rejected';
  receipt: string;
}

interface ReconciliationReport {
  id: string;
  agent: string;
  period: string;
  collected: number;
  deposited: number;
  variance: number;
  verifiedBy: string;
  verifiedDate?: string;
}

// Heatmap component for Collections by Region
const RegionHeatmap: React.FC<{ data: { region: string; amount: number; color: string }[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-sm text-neutral-500 text-center py-8">No region data available</p>;
  }

  const maxAmount = Math.max(...data.map(d => d.amount));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((item) => {
        const intensity = (item.amount / maxAmount) * 100;
        const opacity = Math.max(0.3, intensity / 100);

        return (
          <div
            key={item.region}
            className="p-4 rounded-lg border-2 transition-all hover:shadow-md"
            style={{
              backgroundColor: `${item.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`,
              borderColor: item.color,
            }}
          >
            <div className="text-sm font-medium text-neutral-700 mb-1">{item.region}</div>
            <div className="text-lg font-bold text-neutral-900">
              ₹{item.amount.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-neutral-600 mt-1">
              {((item.amount / maxAmount) * 100).toFixed(0)}% of max
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function CollectionReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 15;

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    agent: '',
    branch: '',
    loanType: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(true);
  const chartsSectionRef = useRef<HTMLDivElement>(null);

  // API state
  const [summaryData, setSummaryData] = useState<{
    summary: {
      totalCollectionsToday: number;
      totalCollectionsMtd: number;
      deposited: number;
      pending: number;
      activeAgentsToday: number;
      totalAgents: number;
      avgSuccessRate: number;
    };
    charts: {
      byAgent: Array<{ name: string; collected: number; deposited: number; [key: string]: string | number }>;
      byRegion: Array<{ region: string; amount: number; color: string }>;
    };
  } | null>(null);

  const [tabData, setTabData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildFilterParams = useCallback(() => {
    const params: Record<string, any> = {
      page: currentPage,
      limit: itemsPerPage,
    };
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.agent) params.agent = filters.agent;
    if (filters.branch) params.branch = filters.branch;
    if (filters.search) params.search = filters.search;
    return params;
  }, [currentPage, filters]);

  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      setError(null);
      const params = buildFilterParams();
      const res = await reportsService.getCollectionsSummary(params);
      setSummaryData(res.data as any);
    } catch (err: any) {
      console.error('Failed to fetch summary:', err);
      setError(err?.message || 'Failed to fetch summary data');
    } finally {
      setSummaryLoading(false);
    }
  }, [buildFilterParams]);

  const fetchTabData = useCallback(async () => {
    try {
      setTabLoading(true);
      setError(null);
      const params = buildFilterParams();

      if (activeTab === 'summary') {
        const res = await reportsService.getCollectionsAgentSummary(params);
        setTabData(res.data.agentSummaries || []);
        setPagination(res.data.pagination || null);
      } else if (activeTab === 'log') {
        const res = await reportsService.getCollectionsLogs(params);
        setTabData(res.data.logs || []);
        setPagination(res.data.pagination || null);
      } else if (activeTab === 'reconciliation') {
        const res = await reportsService.getCollectionsReconciliation(params);
        setTabData(res.data.reconciliation || []);
        setPagination(res.data.pagination || null);
      }
    } catch (err: any) {
      console.error('Failed to fetch tab data:', err);
      setError(err?.message || 'Failed to fetch data');
      setTabData([]);
      setPagination(null);
    } finally {
      setTabLoading(false);
    }
  }, [activeTab, buildFilterParams]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchTabData();
  }, [fetchTabData]);

  const kpis = summaryData?.summary ?? {
    totalCollectionsToday: 0,
    totalCollectionsMtd: 0,
    deposited: 0,
    pending: 0,
    activeAgentsToday: 0,
    totalAgents: 0,
    avgSuccessRate: 0,
  };

  const collectionsByAgentData = summaryData?.charts?.byAgent ?? [];
  const regionData = summaryData?.charts?.byRegion ?? [];

  const loanTypes = ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Vehicle Loan', 'Gold Loan'];

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      agent: '',
      branch: '',
      loanType: '',
      search: '',
    });
    setCurrentPage(1);
  };

  // Table columns
  const summaryColumns = [
    {
      key: 'agentId',
      header: 'Agent ID',
      sortable: true,
      width: '120px',
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      width: '180px',
      render: (_: any, row: AgentCollectionSummary) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-600">
              {row.name?.split(' ').map(n => n[0]).join('') || '?'}
            </span>
          </div>
          <span className="font-medium text-neutral-900">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'branch',
      header: 'Branch',
      sortable: true,
      width: '140px',
    },
    {
      key: 'totalCollected',
      header: 'Total Collected',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{(amount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'deposited',
      header: 'Deposited',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm text-success-600 font-medium">
          ₹{(amount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'pending',
      header: 'Pending',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm text-warning-600 font-medium">
          ₹{(amount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'visits',
      header: 'No. of Visits',
      sortable: true,
      width: '120px',
      render: (visits: number) => (
        <span className="text-sm text-neutral-700">{visits}</span>
      ),
    },
    {
      key: 'successRate',
      header: 'Success Rate',
      sortable: true,
      width: '120px',
      render: (rate: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-neutral-200 rounded-full h-2">
            <div
              className="bg-success-500 h-2 rounded-full"
              style={{ width: `${rate ?? 0}%` }}
            />
          </div>
          <span className="text-sm font-medium text-neutral-700">{rate ?? 0}%</span>
        </div>
      ),
    },
  ];

  const logColumns = [
    {
      key: 'transactionId',
      header: 'Tx ID',
      sortable: true,
      width: '140px',
    },
    {
      key: 'loanId',
      header: 'Loan ID',
      sortable: true,
      width: '140px',
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      width: '180px',
    },
    {
      key: 'agent',
      header: 'Agent',
      sortable: true,
      width: '140px',
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      width: '120px',
      render: (date: string) => date ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) : '—',
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      width: '120px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{(amount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'mode',
      header: 'Mode',
      sortable: true,
      width: '120px',
      render: (mode: string) => (
        <Badge variant="neutral" className="text-xs">
          {mode}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '120px',
      render: (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
          'Collected': 'success',
          'Pending': 'warning',
          'Verified': 'success',
          'Rejected': 'error',
        };
        return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
      },
    },
    {
      key: 'receipt',
      header: 'Receipt',
      sortable: true,
      width: '120px',
      render: (receipt: string) => (
        <span className="text-xs text-neutral-500 font-mono">{receipt}</span>
      ),
    },
  ];

  const reconciliationColumns = [
    {
      key: 'agent',
      header: 'Agent',
      sortable: true,
      width: '180px',
    },
    {
      key: 'period',
      header: 'Period',
      sortable: true,
      width: '120px',
    },
    {
      key: 'collected',
      header: 'Collected',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{(amount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'deposited',
      header: 'Deposited',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm text-success-600 font-medium">
          ₹{(amount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'variance',
      header: 'Variance',
      sortable: true,
      width: '140px',
      render: (variance: number) => (
        <span
          className={`text-sm font-medium ${
            variance > 0 ? 'text-warning-600' : variance < 0 ? 'text-error-600' : 'text-neutral-600'
          }`}
        >
          {variance > 0 ? '+' : ''}₹{(variance ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'verifiedBy',
      header: 'Verified By',
      sortable: true,
      width: '140px',
    },
    {
      key: 'verifiedDate',
      header: 'Verified Date',
      sortable: true,
      width: '140px',
      render: (date: string | undefined) =>
        date ? (
          new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        ) : (
          <span className="text-sm text-neutral-400">Not verified</span>
        ),
    },
  ];

  const totalPages = pagination?.totalPages ?? 1;

  const renderTabLoading = () => (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      <span className="ml-3 text-neutral-600">Loading data...</span>
    </div>
  );

  const renderTabError = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className="h-10 w-10 text-error-500 mb-3" />
      <p className="text-error-600 font-medium mb-2">Failed to load data</p>
      <p className="text-sm text-neutral-500 mb-4">{error}</p>
      <Button variant="outline" size="sm" onClick={fetchTabData}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <FileText className="h-10 w-10 text-neutral-300 mb-3" />
      <p className="text-neutral-500">No records found</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Reports', href: '/reports' },
              { label: 'Collections & Agent Reports' },
            ]}
          />
          <h1 className="text-3xl font-bold text-neutral-900 mt-2">
            Collections & Agent Reports
          </h1>
          <p className="text-neutral-600 mt-1">
            Track loan recovery and field agent performance
          </p>
          </div>
          <Button
            variant="outline"
            onClick={() => exportChartAsPNG(chartsSectionRef.current, 'collection-charts', 'Collection Reports')}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Export Charts
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              exportKPIsAsCSV(
                [
                  { label: 'Total Collections', value: `₹${kpis.totalCollectionsToday.toLocaleString('en-IN')}` },
                  { label: 'MTD Collections', value: `₹${kpis.totalCollectionsMtd.toLocaleString('en-IN')}` },
                  { label: 'Cash Deposited', value: `₹${kpis.deposited.toLocaleString('en-IN')}` },
                  { label: 'Pending', value: `₹${kpis.pending.toLocaleString('en-IN')}` },
                  { label: 'Agents Active Today', value: String(kpis.activeAgentsToday) },
                  { label: 'Avg Collection Success Rate', value: `${kpis.avgSuccessRate}%` },
                ],
                'collection-reports',
                'Collections & Agent Reports'
              )
            }
          >
            <Download className="h-4 w-4 mr-2" />
            Export KPIs
          </Button>
        </div>

        {/* KPI Cards */}
        {summaryLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            <span className="ml-3 text-neutral-600">Loading summary...</span>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Collections</p>
                <p className="text-2xl font-bold text-neutral-900">
                  ₹{kpis.totalCollectionsToday.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  MTD: ₹{kpis.totalCollectionsMtd.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <IndianRupee className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Cash Deposited vs Pending</p>
                <p className="text-lg font-bold text-success-600">
                  ₹{kpis.deposited.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-warning-600 mt-1">
                  Pending: ₹{kpis.pending.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-success-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Agents Active Today</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.activeAgentsToday}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  of {kpis.totalAgents} total agents
                </p>
              </div>
              <div className="bg-info-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Avg Collection Success Rate</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.avgSuccessRate}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success-600" />
                  <span className="text-xs text-success-600">+2.5% vs last month</span>
                </div>
              </div>
              <div className="bg-warning-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>
        </div>
        )}

        {/* Charts */}
        <div ref={chartsSectionRef} className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Collection Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collections by Agent */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Collections by Agent
            </h3>
            {summaryLoading ? (
              <div className="flex items-center justify-center h-80">
                <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
              </div>
            ) : collectionsByAgentData.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-8">No agent data available</p>
            ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionsByAgentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <Legend />
                  <Bar dataKey="collected" fill="#635BFF" name="Total Collected" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="deposited" fill="#10B981" name="Deposited" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            )}
          </Card>

          {/* Collections by Region Heatmap */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Collections by Region
            </h3>
            {summaryLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
              </div>
            ) : (
              <RegionHeatmap data={regionData} />
            )}
          </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
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
                onChange={(e) => { setFilters({ ...filters, dateFrom: e.target.value }); setCurrentPage(1); }}
              />
              <Input
                type="date"
                label="Date To"
                value={filters.dateTo}
                onChange={(e) => { setFilters({ ...filters, dateTo: e.target.value }); setCurrentPage(1); }}
              />
              <Input
                label="Agent"
                placeholder="Filter by agent name"
                value={filters.agent}
                onChange={(e) => { setFilters({ ...filters, agent: e.target.value }); setCurrentPage(1); }}
              />
              <Input
                label="Branch"
                placeholder="Filter by branch"
                value={filters.branch}
                onChange={(e) => { setFilters({ ...filters, branch: e.target.value }); setCurrentPage(1); }}
              />
              <Select
                label="Loan Type"
                placeholder="All Types"
                value={filters.loanType}
                onChange={(e) => { setFilters({ ...filters, loanType: e.target.value }); setCurrentPage(1); }}
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
                  placeholder="Search by Agent ID, Transaction ID, Loan ID, or Customer..."
                  value={filters.search}
                  onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setCurrentPage(1); }}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedRows.size > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Mark as Verified:', Array.from(selectedRows));
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Verified ({selectedRows.size})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Approve Commission:', Array.from(selectedRows));
                  }}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Approve Commission ({selectedRows.size})
                </Button>
              </>
            )}
          </div>
          <Button 
            variant="primary"
            onClick={() => {
              let dataToExport: any[] = tabData;
              let filename = 'collection-reports';
              
              if (activeTab === 'summary') {
                filename = 'agent-collection-summary';
              } else if (activeTab === 'log') {
                filename = 'collection-log';
              } else if (activeTab === 'reconciliation') {
                filename = 'reconciliation-report';
              }
              
              exportToCSV(dataToExport, `${filename}-${new Date().toISOString().split('T')[0]}`);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report PDF
          </Button>
        </div>

        {/* Tabs */}
        <Card className="p-6">
          <Tabs
            tabs={[
              {
                id: 'summary',
                label: 'Agent Collection Summary',
                content: (
                  <div className="mt-4">
                    {tabLoading ? renderTabLoading() : error && tabData.length === 0 ? renderTabError() : tabData.length === 0 ? renderEmptyState() : (
                      <>
                        <Table
                          data={tabData}
                          columns={summaryColumns}
                          onRowClick={(row) => {
                            console.log('View agent:', row);
                          }}
                        />
                        {totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                              {Math.min(currentPage * itemsPerPage, pagination?.totalItems ?? 0)} of{' '}
                              {pagination?.totalItems ?? 0} agents
                            </p>
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
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
                id: 'log',
                label: 'Collection Log',
                content: (
                  <div className="mt-4">
                    {tabLoading ? renderTabLoading() : error && tabData.length === 0 ? renderTabError() : tabData.length === 0 ? renderEmptyState() : (
                      <>
                        <Table
                          data={tabData}
                          columns={logColumns}
                          onRowClick={(row) => {
                            console.log('View collection:', row);
                          }}
                        />
                        {totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                              {Math.min(currentPage * itemsPerPage, pagination?.totalItems ?? 0)} of{' '}
                              {pagination?.totalItems ?? 0} collections
                            </p>
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
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
                id: 'reconciliation',
                label: 'Reconciliation Report',
                content: (
                  <div className="mt-4">
                    {tabLoading ? renderTabLoading() : error && tabData.length === 0 ? renderTabError() : tabData.length === 0 ? renderEmptyState() : (
                      <>
                        <Table
                          data={tabData}
                          columns={reconciliationColumns}
                          onRowClick={(row) => {
                            console.log('View reconciliation:', row);
                          }}
                        />
                        {totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                              {Math.min(currentPage * itemsPerPage, pagination?.totalItems ?? 0)} of{' '}
                              {pagination?.totalItems ?? 0} records
                            </p>
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
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
            defaultTab="summary"
            onChange={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
              setSelectedRows(new Set());
            }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
