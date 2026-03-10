'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  Users,
  Image as ImageIcon,
  Loader2,
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
import { reportsService } from '@/services/reports.service';
import type { Pagination as PaginationType } from '@/services/reports.service';

// Type definitions
interface LoanApplication {
  id: string;
  applicationId: string;
  applicantName: string;
  product: string;
  status: 'Applied' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed' | 'Closed';
  submittedOn: string;
  reviewer: string;
  timeInStage: number; // days
}

interface DisbursedLoan {
  id: string;
  loanId: string;
  customer: string;
  principal: number;
  disbursedDate: string;
  tenure: number; // months
  interest: number; // rate
  emi: number;
  nextPayment: string;
  bounceCount?: number;
}

interface LoanAging {
  id: string;
  loanId: string;
  customer: string;
  daysOverdue: number;
  outstandingPrincipal: number;
  bucket: '0-30' | '31-60' | '61-90' | '90+';
  bounceCount?: number;
}

// Funnel component
const LoanPipelineFunnel: React.FC<{ data: { stage: string; count: number; color: string }[] }> = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const widthPercent = (item.count / maxCount) * 100;

        return (
          <div key={item.stage} className="flex items-center gap-4">
            <div className="w-32 text-sm font-medium text-neutral-700">{item.stage}</div>
            <div className="flex-1 relative">
              <div
                className="h-12 rounded-lg transition-all duration-500 flex items-center justify-between px-4"
                style={{
                  width: `${Math.max(widthPercent, 15)}%`,
                  backgroundColor: item.color,
                }}
              >
                <span className="text-white font-semibold text-sm">{item.count}</span>
                <span className="text-white text-xs opacity-90">
                  {((item.count / maxCount) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function LoanReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('applications');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    loanProduct: '',
    status: '',
    approvalManager: '',
    branch: '',
    search: '',
    emiPending: '',
    bounce: '',
  });

  const [showFilters, setShowFilters] = useState(true);
  const chartsSectionRef = useRef<HTMLDivElement>(null);

  // API data states
  const [summaryData, setSummaryData] = useState<{
    summary: { applicationsReceived: number; approved: number; disbursed: number; activeLoans: number };
    charts: {
      pipelineFunnel: Array<{ stage: string; count: number; color: string }>;
      byProduct: Array<{ name: string; value: number }>;
      disbursementTrend: Array<Record<string, string | number>>;
    };
  } | null>(null);
  const [tabData, setTabData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateFilters = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Fetch summary data (KPIs + charts)
  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const response = await reportsService.getLoansSummary({
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        product: filters.loanProduct || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
        branch: filters.branch || undefined,
      });
      setSummaryData(response.data);
    } catch (err: any) {
      console.error('Failed to fetch loan summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, [filters]);

  // Fetch tab-specific table data
  const fetchTabData = useCallback(async () => {
    try {
      setTabLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        product: filters.loanProduct || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
        branch: filters.branch || undefined,
        emiPending: filters.emiPending || undefined,
        bounce: filters.bounce || undefined,
      };

      if (activeTab === 'applications') {
        const response = await reportsService.getLoansApplications(params);
        setTabData(response.data.applications || []);
        setPagination(response.data.pagination || null);
      } else if (activeTab === 'disbursed') {
        const response = await reportsService.getLoansDisbursed(params);
        setTabData(response.data.disbursedLoans || []);
        setPagination(response.data.pagination || null);
      } else if (activeTab === 'aging') {
        const response = await reportsService.getLoansAging(params);
        setTabData(response.data.agingData || []);
        setPagination(response.data.pagination || null);
      }
    } catch (err: any) {
      console.error('Failed to fetch tab data:', err);
      setError(err.message || 'Failed to fetch data');
      setTabData([]);
      setPagination(null);
    } finally {
      setTabLoading(false);
    }
  }, [activeTab, currentPage, filters]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchTabData();
  }, [fetchTabData]);

  // Derived data from summary
  const kpis = summaryData?.summary ?? { applicationsReceived: 0, approved: 0, disbursed: 0, activeLoans: 0 };
  const pipelineData = summaryData?.charts?.pipelineFunnel ?? [];
  const loansByProductData = summaryData?.charts?.byProduct ?? [];
  const disbursementTrendData = summaryData?.charts?.disbursementTrend ?? [];

  // Static filter options
  const uniqueProducts = ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Vehicle Loan', 'Gold Loan'];
  const uniqueReviewers = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh'];
  const uniqueBranches = ['Main Branch', 'Downtown Branch', 'City Center', 'Suburban Branch', 'North Branch'];

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      loanProduct: '',
      status: '',
      approvalManager: '',
      branch: '',
      search: '',
      emiPending: '',
      bounce: '',
    });
    setCurrentPage(1);
  };

  // Pagination helpers
  const showingFrom = tabData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const showingTo = (currentPage - 1) * itemsPerPage + tabData.length;
  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  // Table columns
  const applicationsColumns = [
    {
      key: 'applicationId',
      header: 'Application ID',
      sortable: true,
      width: '140px',
    },
    {
      key: 'applicantName',
      header: 'Applicant Name',
      sortable: true,
      width: '180px',
    },
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      width: '140px',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '140px',
      render: (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'primary'> = {
          'Applied': 'primary',
          'Under Review': 'warning',
          'Approved': 'success',
          'Rejected': 'error',
          'Disbursed': 'success',
          'Closed': 'neutral',
        };
        return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
      },
    },
    {
      key: 'submittedOn',
      header: 'Submitted On',
      sortable: true,
      width: '140px',
      render: (date: string) => new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    },
    {
      key: 'reviewer',
      header: 'Reviewer',
      sortable: true,
      width: '140px',
    },
    {
      key: 'timeInStage',
      header: 'Time in Stage',
      sortable: true,
      width: '120px',
      render: (days: number) => (
        <span className="text-sm text-neutral-700">{days} days</span>
      ),
    },
  ];

  const disbursedColumns = [
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
      key: 'principal',
      header: 'Principal',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{(amount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'disbursedDate',
      header: 'Disbursed Date',
      sortable: true,
      width: '140px',
      render: (date: string) => new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    },
    {
      key: 'tenure',
      header: 'Tenure',
      sortable: true,
      width: '100px',
      render: (months: number) => (
        <span className="text-sm text-neutral-700">{months} months</span>
      ),
    },
    {
      key: 'interest',
      header: 'Interest',
      sortable: true,
      width: '100px',
      render: (rate: number) => (
        <span className="text-sm text-neutral-700">{rate}%</span>
      ),
    },
    {
      key: 'emi',
      header: 'EMI',
      sortable: true,
      width: '120px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{(amount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'nextPayment',
      header: 'Next Payment',
      sortable: true,
      width: '140px',
      render: (date: string, row: DisbursedLoan) => {
        const isPending = new Date(date) < new Date();
        return (
          <div className="flex items-center gap-2">
            <span>
              {new Date(date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            {isPending && (
              <Badge variant="warning" className="text-xs">EMI Pending</Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'bounceCount',
      header: 'Bounce',
      sortable: true,
      width: '100px',
      render: (count: number | undefined) =>
        (count || 0) > 0 ? (
          <Badge variant="error">{count || 0} bounce{(count || 0) > 1 ? 's' : ''}</Badge>
        ) : (
          <span className="text-sm text-neutral-500">-</span>
        ),
    },
  ];

  const agingColumns = [
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
      key: 'daysOverdue',
      header: 'Days Overdue',
      sortable: true,
      width: '140px',
      render: (days: number) => (
        <Badge variant={days > 90 ? 'error' : days > 60 ? 'warning' : 'neutral'}>
          {days} days
        </Badge>
      ),
    },
    {
      key: 'outstandingPrincipal',
      header: 'Outstanding Principal',
      sortable: true,
      width: '180px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{(amount ?? 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'bucket',
      header: 'Bucket',
      sortable: true,
      width: '120px',
      render: (bucket: string) => {
        const colors: Record<string, string> = {
          '0-30': 'bg-blue-100 text-blue-700',
          '31-60': 'bg-yellow-100 text-yellow-700',
          '61-90': 'bg-orange-100 text-orange-700',
          '90+': 'bg-red-100 text-red-700',
        };
        return (
          <Badge className={colors[bucket] || ''}>{bucket}</Badge>
        );
      },
    },
    {
      key: 'bounceCount',
      header: 'Bounce',
      sortable: true,
      width: '100px',
      render: (count: number | undefined) =>
        (count || 0) > 0 ? (
          <Badge variant="error">{count || 0} bounce{(count || 0) > 1 ? 's' : ''}</Badge>
        ) : (
          <span className="text-sm text-neutral-500">-</span>
        ),
    },
  ];

  // Loading spinner for table areas
  const tableLoader = (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
    </div>
  );

  // Error display for table areas
  const errorDisplay = error ? (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-700 text-sm">{error}</p>
      <Button variant="outline" size="sm" onClick={fetchTabData} className="mt-2">
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </div>
  ) : null;

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
              { label: 'Loan Reports' },
            ]}
          />
          <h1 className="text-3xl font-bold text-neutral-900 mt-2">
            Loan Lifecycle Reports
          </h1>
          <p className="text-neutral-600 mt-1">
            Track loan flow from application to closure
          </p>
          </div>
          <Button
            variant="outline"
            onClick={() => exportChartAsPNG(chartsSectionRef.current, 'loan-charts', 'Loan Reports')}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Export Charts
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              exportKPIsAsCSV(
                [
                  { label: 'Applications Received', value: String(kpis.applicationsReceived) },
                  { label: 'Approved', value: String(kpis.approved) },
                  { label: 'Disbursed', value: String(kpis.disbursed) },
                  { label: 'Active Loans', value: String(kpis.activeLoans) },
                ],
                'loan-reports',
                'Loan Lifecycle Reports'
              )
            }
          >
            <Download className="h-4 w-4 mr-2" />
            Export KPIs
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Applications Received</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {summaryLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                  ) : (
                    kpis.applicationsReceived.toLocaleString()
                  )}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {summaryLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                  ) : (
                    kpis.approved.toLocaleString()
                  )}
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
                <p className="text-sm text-neutral-600 mb-1">Disbursed</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {summaryLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                  ) : (
                    kpis.disbursed.toLocaleString()
                  )}
                </p>
              </div>
              <div className="bg-info-100 p-3 rounded-lg">
                <IndianRupee className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Active Loans</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {summaryLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                  ) : (
                    kpis.activeLoans.toLocaleString()
                  )}
                </p>
              </div>
              <div className="bg-warning-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section - Pipeline + Chart Grid */}
        <div ref={chartsSectionRef} className="space-y-6">
          <h2 className="text-lg font-semibold text-neutral-900">Loan Analytics</h2>
          {/* Loan Pipeline Funnel */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Loan Pipeline Funnel
            </h2>
            {summaryLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              </div>
            ) : pipelineData.length > 0 ? (
              <LoanPipelineFunnel data={pipelineData} />
            ) : (
              <p className="text-sm text-neutral-500 text-center py-8">No pipeline data available</p>
            )}
          </Card>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Loans by Product Type</h3>
              <div className="h-80">
                {summaryLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                  </div>
                ) : loansByProductData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={loansByProductData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#635BFF" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-neutral-500">No product data available</p>
                  </div>
                )}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Loan Disbursements Over Time</h3>
              <div className="h-80">
                {summaryLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                  </div>
                ) : disbursementTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={disbursementTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <YAxis
                        stroke="#6B7280"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
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
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#635BFF"
                        strokeWidth={2}
                        name="Disbursed Amount"
                        dot={{ fill: '#635BFF', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-neutral-500">No disbursement data available</p>
                  </div>
                )}
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                type="date"
                label="Date From"
                value={filters.dateFrom}
                onChange={(e) => updateFilters({ ...filters, dateFrom: e.target.value })}
              />
              <Input
                type="date"
                label="Date To"
                value={filters.dateTo}
                onChange={(e) => updateFilters({ ...filters, dateTo: e.target.value })}
              />
              <Select
                label="Loan Product"
                placeholder="All Products"
                value={filters.loanProduct}
                onChange={(e) => updateFilters({ ...filters, loanProduct: e.target.value })}
                options={[
                  { value: '', label: 'All Products' },
                  ...uniqueProducts.map((product) => ({
                    value: product,
                    label: product,
                  })),
                ]}
              />
              <Select
                label="Status"
                placeholder="All Statuses"
                value={filters.status}
                onChange={(e) => updateFilters({ ...filters, status: e.target.value })}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'Applied', label: 'Applied' },
                  { value: 'Under Review', label: 'Under Review' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Rejected', label: 'Rejected' },
                  { value: 'Disbursed', label: 'Disbursed' },
                  { value: 'Closed', label: 'Closed' },
                ]}
              />
              <Select
                label="Approval Manager"
                placeholder="All Managers"
                value={filters.approvalManager}
                onChange={(e) => updateFilters({ ...filters, approvalManager: e.target.value })}
                options={[
                  { value: '', label: 'All Managers' },
                  ...uniqueReviewers.map((reviewer) => ({
                    value: reviewer,
                    label: reviewer,
                  })),
                ]}
              />
              <Select
                label="Branch"
                placeholder="All Branches"
                value={filters.branch}
                onChange={(e) => updateFilters({ ...filters, branch: e.target.value })}
                options={[
                  { value: '', label: 'All Branches' },
                  ...uniqueBranches.map((branch) => ({
                    value: branch,
                    label: branch,
                  })),
                ]}
              />
              <Select
                label="EMI Pending"
                placeholder="All"
                value={filters.emiPending}
                onChange={(e) => updateFilters({ ...filters, emiPending: e.target.value })}
                options={[
                  { value: '', label: 'All' },
                  { value: 'yes', label: 'Yes (Pending)' },
                  { value: 'no', label: 'No (Up to date)' },
                ]}
              />
              <Select
                label="Bounce"
                placeholder="All"
                value={filters.bounce}
                onChange={(e) => updateFilters({ ...filters, bounce: e.target.value })}
                options={[
                  { value: '', label: 'All' },
                  { value: 'yes', label: 'Yes (Has bounce)' },
                  { value: 'no', label: 'No (No bounce)' },
                ]}
              />
              <div className="md:col-span-2 lg:col-span-4">
                <Input
                  label="Search"
                  placeholder="Search by Application ID, Loan ID, or Customer Name..."
                  value={filters.search}
                  onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Tabs */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Reports</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                let filename = 'loan-reports';
                if (activeTab === 'applications') filename = 'loan-applications-pipeline';
                else if (activeTab === 'disbursed') filename = 'disbursed-loans';
                else if (activeTab === 'aging') filename = 'loan-aging-report';
                exportToCSV(tabData, `${filename}-${new Date().toISOString().split('T')[0]}`);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          <Tabs
            tabs={[
              {
                id: 'applications',
                label: 'Applications Pipeline',
                content: (
                  <div className="mt-4">
                    {tabLoading ? tableLoader : error ? errorDisplay : (
                      <>
                        <Table
                          data={tabData}
                          columns={applicationsColumns}
                          onRowClick={(row) => {
                            router.push(`/loans/${row.id}`);
                          }}
                        />
                        {totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {showingFrom} to {showingTo} of {totalItems} applications
                            </p>
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                        {!tabLoading && tabData.length === 0 && (
                          <p className="text-sm text-neutral-500 text-center py-8">No applications found</p>
                        )}
                      </>
                    )}
                  </div>
                ),
              },
              {
                id: 'disbursed',
                label: 'Disbursed Loans',
                content: (
                  <div className="mt-4">
                    {tabLoading ? tableLoader : error ? errorDisplay : (
                      <>
                        <Table
                          data={tabData}
                          columns={disbursedColumns}
                          onRowClick={(row) => {
                            router.push(`/loans/${row.id}`);
                          }}
                        />
                        {totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {showingFrom} to {showingTo} of {totalItems} loans
                            </p>
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                        {!tabLoading && tabData.length === 0 && (
                          <p className="text-sm text-neutral-500 text-center py-8">No disbursed loans found</p>
                        )}
                      </>
                    )}
                  </div>
                ),
              },
              {
                id: 'aging',
                label: 'Loan Aging Report',
                content: (
                  <div className="mt-4">
                    {tabLoading ? tableLoader : error ? errorDisplay : (
                      <>
                        <Table
                          data={tabData}
                          columns={agingColumns}
                          onRowClick={(row) => {
                            router.push(`/loans/${row.id}`);
                          }}
                        />
                        {totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {showingFrom} to {showingTo} of {totalItems} loans
                            </p>
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                        {!tabLoading && tabData.length === 0 && (
                          <p className="text-sm text-neutral-500 text-center py-8">No aging data found</p>
                        )}
                      </>
                    )}
                  </div>
                ),
              },
            ]}
            defaultTab="applications"
            onChange={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
              setTabLoading(true);
            }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
