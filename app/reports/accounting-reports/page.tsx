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
  Textarea,
} from '@/components/ui';
import {
  Filter,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  Printer,
  IndianRupee,
  Calculator,
  Banknote,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import { exportChartAsPNG, exportKPIsAsCSV } from '@/lib/reportExport';
import { reportsService } from '@/services/reports.service';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Type definitions
interface DaybookEntry {
  id: string;
  date: string;
  ledgerHead: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
}

interface InterestFeesReport {
  id: string;
  period: string;
  product: string;
  interestAccrued: number;
  collected: number;
  pending: number;
}

interface ProvisioningECL {
  id: string;
  loanBucket: string;
  outstanding: number;
  provisionPercent: number;
  provisionAmount: number;
}

interface BankReconciliation {
  id: string;
  bank: string;
  statementAmount: number;
  systemAmount: number;
  difference: number;
  status: 'Matched' | 'Pending' | 'Discrepancy';
}

const ledgerHeadOptions = [
  'Loan Disbursements',
  'Interest Income',
  'Processing Fees',
  'Cash Deposits',
  'Loan Repayments',
  'Operating Expenses',
  'Salary Payments',
  'Interest Payable',
  'Provision for Bad Debts',
  'Bank Charges',
];

const productOptions = [
  'Personal Loan',
  'Home Loan',
  'Business Loan',
  'Education Loan',
  'Vehicle Loan',
  'Gold Loan',
];

const bankOptions = [
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
];

export default function AccountingReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('daybook');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuditNotes, setShowAuditNotes] = useState(false);
  const [auditNote, setAuditNote] = useState('');
  const itemsPerPage = 15;

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    ledgerHead: '',
    product: '',
    bank: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(true);
  const chartsSectionRef = useRef<HTMLDivElement>(null);

  // API data states
  const [summaryData, setSummaryData] = useState<{
    summary: {
      totalInterestIncome: number;
      feeIncome: number;
      totalDisbursed: number;
      provisionedAmount: number;
      netCashFlow: number;
    };
    charts: {
      cashFlowTrend: any[];
      incomeComposition: any[];
    };
  } | null>(null);

  const [tabData, setTabData] = useState<any[]>([]);
  const [tabPagination, setTabPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const kpis = useMemo(() => ({
    totalInterestIncome: summaryData?.summary?.totalInterestIncome ?? 0,
    feeIncome: summaryData?.summary?.feeIncome ?? 0,
    totalDisbursed: summaryData?.summary?.totalDisbursed ?? 0,
    provisionedAmount: summaryData?.summary?.provisionedAmount ?? 0,
    netCashFlow: summaryData?.summary?.netCashFlow ?? 0,
  }), [summaryData]);

  const cashFlowTrendData = summaryData?.charts?.cashFlowTrend ?? [];
  const incomeCompositionData = summaryData?.charts?.incomeComposition ?? [];

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await reportsService.getAccountingSummary({
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
      });
      setSummaryData(res.data);
    } catch (err: any) {
      console.error('Failed to fetch accounting summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, [filters.dateFrom, filters.dateTo]);

  const fetchTabData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page: currentPage,
        limit: itemsPerPage,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        search: filters.search || undefined,
      };

      switch (activeTab) {
        case 'daybook': {
          if (filters.ledgerHead) params.ledgerHead = filters.ledgerHead;
          const res = await reportsService.getAccountingDaybook(params);
          setTabData(res.data.entries ?? []);
          setTabPagination(res.data.pagination ?? null);
          break;
        }
        case 'interest': {
          if (filters.product) params.product = filters.product;
          const res = await reportsService.getAccountingInterestFees(params);
          setTabData(res.data.interestFees ?? []);
          setTabPagination(res.data.pagination ?? null);
          break;
        }
        case 'provisioning': {
          const res = await reportsService.getAccountingProvisioning(params);
          setTabData(res.data.provisioning ?? []);
          setTabPagination(null);
          break;
        }
        case 'reconciliation': {
          if (filters.bank) params.bank = filters.bank;
          const res = await reportsService.getAccountingReconciliation(params);
          setTabData(res.data.reconciliation ?? []);
          setTabPagination(null);
          break;
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch data');
      setTabData([]);
      setTabPagination(null);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, filters, itemsPerPage]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchTabData();
  }, [fetchTabData]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      ledgerHead: '',
      product: '',
      bank: '',
      search: '',
    });
    setCurrentPage(1);
  };

  // Table columns
  const daybookColumns = [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      width: '120px',
      render: (date: string) => new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    },
    {
      key: 'ledgerHead',
      header: 'Ledger Head',
      sortable: true,
      width: '200px',
    },
    {
      key: 'debit',
      header: 'Debit',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm text-neutral-700 font-mono">
          {amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : '-'}
        </span>
      ),
    },
    {
      key: 'credit',
      header: 'Credit',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm text-neutral-700 font-mono">
          {amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : '-'}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      width: '140px',
      render: (balance: number) => (
        <span className={`text-sm font-semibold font-mono ${
          balance >= 0 ? 'text-neutral-900' : 'text-error-600'
        }`}>
          ₹{balance.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'reference',
      header: 'Reference',
      sortable: true,
      width: '120px',
      render: (ref: string | undefined) => (
        <span className="text-xs text-neutral-500 font-mono">{ref || '-'}</span>
      ),
    },
  ];

  const interestFeesColumns = [
    {
      key: 'period',
      header: 'Period',
      sortable: true,
      width: '120px',
    },
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      width: '160px',
    },
    {
      key: 'interestAccrued',
      header: 'Interest Accrued',
      sortable: true,
      width: '160px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900 font-mono">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'collected',
      header: 'Collected',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm text-success-600 font-mono">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'pending',
      header: 'Pending',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm text-warning-600 font-mono">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
  ];

  const provisioningColumns = [
    {
      key: 'loanBucket',
      header: 'Loan Bucket',
      sortable: true,
      width: '200px',
    },
    {
      key: 'outstanding',
      header: 'Outstanding',
      sortable: true,
      width: '160px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900 font-mono">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'provisionPercent',
      header: 'Provision %',
      sortable: true,
      width: '120px',
      render: (percent: number) => (
        <span className="text-sm text-neutral-700">{percent}%</span>
      ),
    },
    {
      key: 'provisionAmount',
      header: 'Provision Amount',
      sortable: true,
      width: '160px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-error-600 font-mono">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
  ];

  const bankReconciliationColumns = [
    {
      key: 'bank',
      header: 'Bank',
      sortable: true,
      width: '180px',
    },
    {
      key: 'statementAmount',
      header: 'Statement Amount',
      sortable: true,
      width: '160px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900 font-mono">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'systemAmount',
      header: 'System Amount',
      sortable: true,
      width: '160px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900 font-mono">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'difference',
      header: 'Difference',
      sortable: true,
      width: '140px',
      render: (diff: number) => (
        <span className={`text-sm font-semibold font-mono ${
          Math.abs(diff) < 100 ? 'text-success-600' : 
          Math.abs(diff) < 10000 ? 'text-warning-600' : 
          'text-error-600'
        }`}>
          {diff > 0 ? '+' : ''}₹{diff.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '120px',
      render: (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error'> = {
          'Matched': 'success',
          'Pending': 'warning',
          'Discrepancy': 'error',
        };
        return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
      },
    },
  ];

  const renderPaginationInfo = () => {
    if (!tabPagination || tabPagination.totalPages <= 1) return null;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, tabPagination.totalItems);
    return (
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing {start} to {end} of {tabPagination.totalItems} entries
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={tabPagination.totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  };

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
                { label: 'Accounting & Finance Reports' },
              ]}
            />
            <h1 className="text-3xl font-bold text-neutral-900 mt-2">
              Accounting & Finance Reports
            </h1>
            <p className="text-neutral-600 mt-1">
              Financial summaries, ledgers, and reconciliation reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => exportChartAsPNG(chartsSectionRef.current, 'accounting-charts', 'Accounting Reports')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Export Charts
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                exportKPIsAsCSV(
                  [
                    { label: 'Total Interest Income', value: `₹${kpis.totalInterestIncome.toLocaleString('en-IN')}` },
                    { label: 'Fee Income', value: `₹${kpis.feeIncome.toLocaleString('en-IN')}` },
                    { label: 'Total Disbursed', value: `₹${kpis.totalDisbursed.toLocaleString('en-IN')}` },
                    { label: 'Provisioned Amount', value: `₹${kpis.provisionedAmount.toLocaleString('en-IN')}` },
                    { label: 'Net Cash Flow', value: `${kpis.netCashFlow >= 0 ? '+' : ''}₹${kpis.netCashFlow.toLocaleString('en-IN')}` },
                  ],
                  'accounting-reports',
                  'Accounting & Finance Reports'
                )
              }
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export KPIs
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={() => setShowAuditNotes(!showAuditNotes)}>
              <FileText className="h-4 w-4 mr-2" />
              Audit Notes
            </Button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <Button variant="outline" size="sm" className="ml-auto" onClick={fetchTabData}>
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
            </Button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-5 bg-neutral-50 border border-neutral-200 relative">
            {summaryLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 mb-1 uppercase tracking-wide">Total Interest Income</p>
                <p className="text-xl font-bold text-neutral-900 font-mono">
                  ₹{kpis.totalInterestIncome.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded">
                <IndianRupee className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-neutral-50 border border-neutral-200 relative">
            {summaryLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 mb-1 uppercase tracking-wide">Fee Income</p>
                <p className="text-xl font-bold text-neutral-900 font-mono">
                  ₹{kpis.feeIncome.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded">
                <Banknote className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-neutral-50 border border-neutral-200 relative">
            {summaryLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 mb-1 uppercase tracking-wide">Total Disbursed</p>
                <p className="text-xl font-bold text-neutral-900 font-mono">
                  ₹{kpis.totalDisbursed.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-neutral-50 border border-neutral-200 relative">
            {summaryLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 mb-1 uppercase tracking-wide">Provisioned Amount</p>
                <p className="text-xl font-bold text-neutral-900 font-mono">
                  ₹{kpis.provisionedAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-orange-100 p-2 rounded">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-neutral-50 border border-neutral-200 relative">
            {summaryLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 mb-1 uppercase tracking-wide">Net Cash Flow</p>
                <p className={`text-xl font-bold font-mono ${
                  kpis.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpis.netCashFlow >= 0 ? '+' : ''}₹{kpis.netCashFlow.toLocaleString('en-IN')}
                </p>
              </div>
              <div className={`p-2 rounded ${
                kpis.netCashFlow >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {kpis.netCashFlow >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div ref={chartsSectionRef} className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Financial Charts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cash Flow Trend */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Cash Flow Trend
            </h3>
            <div className="h-80">
              {cashFlowTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowTrendData}>
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
                      dataKey="inflow"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Inflow"
                      dot={{ fill: '#10B981', r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="outflow"
                      stroke="#EF4444"
                      strokeWidth={2}
                      name="Outflow"
                      dot={{ fill: '#EF4444', r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Net Flow"
                      strokeDasharray="5 5"
                      dot={{ fill: '#3B82F6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-400">
                  {summaryLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : 'No chart data available'}
                </div>
              )}
            </div>
          </Card>

          {/* Income Composition */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Income Composition
            </h3>
            <div className="h-80">
              {incomeCompositionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeCompositionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) =>
                        `${props.name}: ${((props.percent || 0) * 100).toFixed(1)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incomeCompositionData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-400">
                  {summaryLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : 'No chart data available'}
                </div>
              )}
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
                label="Ledger Head"
                placeholder="All Ledger Heads"
                value={filters.ledgerHead}
                onChange={(e) => setFilters({ ...filters, ledgerHead: e.target.value })}
                options={[
                  { value: '', label: 'All Ledger Heads' },
                  ...ledgerHeadOptions.map((head) => ({
                    value: head,
                    label: head,
                  })),
                ]}
              />
              <Select
                label="Product"
                placeholder="All Products"
                value={filters.product}
                onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                options={[
                  { value: '', label: 'All Products' },
                  ...productOptions.map((product) => ({
                    value: product,
                    label: product,
                  })),
                ]}
              />
              <Select
                label="Bank"
                placeholder="All Banks"
                value={filters.bank}
                onChange={(e) => setFilters({ ...filters, bank: e.target.value })}
                options={[
                  { value: '', label: 'All Banks' },
                  ...bankOptions.map((bank) => ({
                    value: bank,
                    label: bank,
                  })),
                ]}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <Input
                  label="Search"
                  placeholder="Search by Ledger Head, Reference, Product, or Bank..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Export Options */}
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              const tabNames: Record<string, string> = {
                daybook: 'daybook-summary',
                interest: 'interest-fees-report',
                provisioning: 'provisioning-ecl',
                reconciliation: 'bank-reconciliation',
              };
              const filename = tabNames[activeTab] || 'accounting-reports';
              exportToCSV(tabData, `${filename}-${new Date().toISOString().split('T')[0]}`);
            }}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Tabs */}
        <Card className="p-6 bg-white border border-neutral-200 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          )}
          <Tabs
            tabs={[
              {
                id: 'daybook',
                label: 'Daybook / GL Summary',
                content: (
                  <div className="mt-4">
                    <Table
                      data={tabData}
                      columns={daybookColumns}
                    />
                    {tabData.length === 0 && !loading && (
                      <p className="text-center text-neutral-400 py-8">No daybook entries found</p>
                    )}
                    {renderPaginationInfo()}
                  </div>
                ),
              },
              {
                id: 'interest',
                label: 'Interest & Fees Report',
                content: (
                  <div className="mt-4">
                    <Table
                      data={tabData}
                      columns={interestFeesColumns}
                    />
                    {tabData.length === 0 && !loading && (
                      <p className="text-center text-neutral-400 py-8">No interest & fees records found</p>
                    )}
                    {renderPaginationInfo()}
                  </div>
                ),
              },
              {
                id: 'provisioning',
                label: 'Provisioning & ECL',
                content: (
                  <div className="mt-4">
                    <Table
                      data={tabData}
                      columns={provisioningColumns}
                    />
                    {tabData.length === 0 && !loading && (
                      <p className="text-center text-neutral-400 py-8">No provisioning data found</p>
                    )}
                  </div>
                ),
              },
              {
                id: 'reconciliation',
                label: 'Bank Reconciliation',
                content: (
                  <div className="mt-4">
                    <Table
                      data={tabData}
                      columns={bankReconciliationColumns}
                    />
                    {tabData.length === 0 && !loading && (
                      <p className="text-center text-neutral-400 py-8">No reconciliation data found</p>
                    )}
                  </div>
                ),
              },
            ]}
            defaultTab="daybook"
            onChange={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
            }}
          />
        </Card>

        {/* Audit Notes Panel */}
        {showAuditNotes && (
          <Card className="p-6 bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Audit Notes</h3>
              <Button variant="outline" size="sm" onClick={() => setShowAuditNotes(false)}>
                Close
              </Button>
            </div>
            <Textarea
              placeholder="Enter audit notes, observations, or comments..."
              value={auditNote}
              onChange={(e) => setAuditNote(e.target.value)}
              rows={6}
              className="mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setAuditNote('')}>
                Clear
              </Button>
              <Button variant="primary" onClick={() => {
                console.log('Save audit note:', auditNote);
              }}>
                Save Note
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
