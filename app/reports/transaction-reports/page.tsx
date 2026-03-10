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
  Checkbox,
} from '@/components/ui';
import {
  Filter,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Search,
  RefreshCw,
  Eye,
  X,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import { exportChartAsPNG, exportKPIsAsCSV } from '@/lib/reportExport';
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
import { reportsService } from '@/services/reports.service';

interface Transaction {
  id: string;
  transactionId: string;
  dateTime: string;
  user: string;
  userId: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Loan Disbursement' | 'Loan Repayment';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Reversed';
  agent: string;
  branch: string;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card';
  balanceAfter: number;
  reference: string;
}

export default function TransactionReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 15;

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    transactionType: '',
    status: '',
    agent: '',
    branch: '',
    amountMin: '',
    amountMax: '',
    paymentMethod: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(true);
  const chartsSectionRef = useRef<HTMLDivElement>(null);

  const [summaryData, setSummaryData] = useState<any>(null);
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await reportsService.getTransactionsSummary({});
      setSummaryData(response.data);
    } catch (err: any) {
      console.error('Failed to fetch summary:', err);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        tab: activeTab,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        type: filters.transactionType,
        status: filters.status,
        agent: filters.agent,
        branch: filters.branch,
        minAmount: filters.amountMin,
        maxAmount: filters.amountMax,
        paymentMethod: filters.paymentMethod,
        search: filters.search,
      };
      const response = await reportsService.getTransactionsList(params);
      setTransactionsData(response.data.transactions || []);
      setPagination(response.data.pagination || null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
      setTransactionsData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab, filters]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const summaryStats = useMemo(() => ({
    totalCount: summaryData?.summary?.totalCount ?? 0,
    totalAmount: summaryData?.summary?.totalAmount ?? 0,
    avgValue: summaryData?.summary?.avgValue ?? 0,
  }), [summaryData]);

  const dailyTrendData = useMemo(() => summaryData?.charts?.dailyTrends ?? [], [summaryData]);
  const paymentMethodData = useMemo(() => summaryData?.charts?.paymentMethodBreakdown ?? [], [summaryData]);

  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.totalItems ?? 0;
  const paginatedTransactions = transactionsData;

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      transactionType: '',
      status: '',
      agent: '',
      branch: '',
      amountMin: '',
      amountMax: '',
      paymentMethod: '',
      search: '',
    });
    setCurrentPage(1);
  };

  const handleSelectRow = (transactionId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(transactionId);
    } else {
      newSelected.delete(transactionId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedTransactions.map((t) => t.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const columns = [
    {
      key: 'select',
      header: '',
      width: '50px',
      render: (_: any, row: Transaction) => (
        <Checkbox
          checked={selectedRows.has(row.id)}
          onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
      sortable: true,
      width: '140px',
    },
    {
      key: 'dateTime',
      header: 'Date/Time',
      sortable: true,
      width: '160px',
      render: (_: any, row: Transaction) => (
        <div>
          <p className="text-sm text-neutral-900">
            {new Date(row.dateTime).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs text-neutral-500">
            {new Date(row.dateTime).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      sortable: true,
      width: '180px',
      render: (_: any, row: Transaction) => (
        <div>
          <p className="text-sm font-medium text-neutral-900">{row.user}</p>
          <p className="text-xs text-neutral-500">{row.userId}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      width: '140px',
      render: (type: string) => (
        <Badge
          variant={
            type === 'Deposit' || type === 'Loan Repayment'
              ? 'success'
              : type === 'Withdrawal' || type === 'Loan Disbursement'
              ? 'error'
              : 'neutral'
          }
        >
          {type}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      width: '120px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '120px',
      render: (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
          Completed: 'success',
          Pending: 'warning',
          Failed: 'error',
          Reversed: 'error',
        };
        return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
      },
    },
    {
      key: 'agent',
      header: 'Agent',
      sortable: true,
      width: '140px',
    },
    {
      key: 'branch',
      header: 'Branch',
      sortable: true,
      width: '140px',
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      sortable: true,
      width: '140px',
      render: (method: string) => (
        <Badge variant="neutral" className="text-xs">
          {method}
        </Badge>
      ),
    },
    {
      key: 'balanceAfter',
      header: 'Balance After',
      sortable: true,
      width: '140px',
      render: (balance: number) => (
        <span className="text-sm text-neutral-700">
          ₹{balance.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'reference',
      header: 'Reference',
      sortable: true,
      width: '120px',
      render: (ref: string) => (
        <span className="text-xs text-neutral-500 font-mono">{ref}</span>
      ),
    },
  ];

  const renderTableContent = () => (
    <div className="mt-4">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : paginatedTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
          <FileText className="h-12 w-12 mb-3 text-neutral-300" />
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <>
          <Table
            data={paginatedTransactions}
            columns={columns}
            onRowClick={(row) => {
              console.log('View transaction:', row);
            }}
          />
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{' '}
                {totalItems} transactions
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
  );

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
                { label: 'Transactional Reports' },
              ]}
            />
            <h1 className="text-3xl font-bold text-neutral-900 mt-2">
              Transactional Reports
            </h1>
            <p className="text-neutral-600 mt-1">
              Comprehensive transaction analysis and reporting
            </p>
          </div>
          <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportChartAsPNG(chartsSectionRef.current, 'transaction-charts', 'Transactional Reports')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 text-sm font-medium"
          >
            <ImageIcon className="h-4 w-4" />
            Export Charts
          </button>
          <button
            type="button"
            onClick={() =>
              exportKPIsAsCSV(
                [
                  { label: 'Total Count', value: summaryStats.totalCount.toLocaleString() },
                  { label: 'Total Amount', value: `₹${summaryStats.totalAmount.toLocaleString('en-IN')}` },
                  { label: 'Avg Transaction Value', value: `₹${Math.round(summaryStats.avgValue).toLocaleString('en-IN')}` },
                ],
                'transaction-reports',
                'Transactional Reports'
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Export KPIs
          </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { fetchSummary(); fetchTransactions(); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* Advanced Filters */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-neutral-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Advanced Filters</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
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
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
              <Input
                type="date"
                label="Date To"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
              />
              <Select
                label="Transaction Type"
                placeholder="All Types"
                value={filters.transactionType}
                onChange={(e) =>
                  setFilters({ ...filters, transactionType: e.target.value })
                }
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'Deposit', label: 'Deposit' },
                  { value: 'Withdrawal', label: 'Withdrawal' },
                  { value: 'Transfer', label: 'Transfer' },
                  { value: 'Loan Disbursement', label: 'Loan Disbursement' },
                  { value: 'Loan Repayment', label: 'Loan Repayment' },
                ]}
              />
              <Select
                label="Status"
                placeholder="All Statuses"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Failed', label: 'Failed' },
                  { value: 'Reversed', label: 'Reversed' },
                ]}
              />
              <Select
                label="Agent"
                placeholder="All Agents"
                value={filters.agent}
                onChange={(e) =>
                  setFilters({ ...filters, agent: e.target.value })
                }
                options={[
                  { value: '', label: 'All Agents' },
                ]}
              />
              <Select
                label="Branch"
                placeholder="All Branches"
                value={filters.branch}
                onChange={(e) =>
                  setFilters({ ...filters, branch: e.target.value })
                }
                options={[
                  { value: '', label: 'All Branches' },
                ]}
              />
              <Input
                type="number"
                label="Min Amount (₹)"
                placeholder="0"
                value={filters.amountMin}
                onChange={(e) =>
                  setFilters({ ...filters, amountMin: e.target.value })
                }
              />
              <Input
                type="number"
                label="Max Amount (₹)"
                placeholder="No limit"
                value={filters.amountMax}
                onChange={(e) =>
                  setFilters({ ...filters, amountMax: e.target.value })
                }
              />
              <Select
                label="Payment Method"
                placeholder="All Methods"
                value={filters.paymentMethod}
                onChange={(e) =>
                  setFilters({ ...filters, paymentMethod: e.target.value })
                }
                options={[
                  { value: '', label: 'All Methods' },
                  { value: 'Cash', label: 'Cash' },
                  { value: 'UPI', label: 'UPI' },
                  { value: 'Bank Transfer', label: 'Bank Transfer' },
                  { value: 'Cheque', label: 'Cheque' },
                  { value: 'Card', label: 'Card' },
                ]}
              />
              <div className="md:col-span-2 lg:col-span-4">
                <Input
                  label="Search"
                  placeholder="Search by Transaction ID, User, or Reference..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Count</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {summaryStats.totalCount.toLocaleString()}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-neutral-900">
                  ₹{summaryStats.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-success-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Avg Transaction Value</p>
                <p className="text-2xl font-bold text-neutral-900">
                  ₹{Math.round(summaryStats.avgValue).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-info-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
              <Checkbox
                checked={
                  paginatedTransactions.length > 0 &&
                  paginatedTransactions.every((t) => selectedRows.has(t.id))
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-neutral-700">
                Select All ({paginatedTransactions.length})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={() => {
                exportToCSV(transactionsData, `transaction-reports-${new Date().toISOString().split('T')[0]}`, [
                  { key: 'transactionId', label: 'Transaction ID' },
                  { key: 'dateTime', label: 'Date/Time' },
                  { key: 'user', label: 'User' },
                  { key: 'userId', label: 'User ID' },
                  { key: 'type', label: 'Type' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'status', label: 'Status' },
                  { key: 'agent', label: 'Agent' },
                  { key: 'branch', label: 'Branch' },
                  { key: 'paymentMethod', label: 'Payment Method' },
                  { key: 'balanceAfter', label: 'Balance After' },
                  { key: 'reference', label: 'Reference' },
                ]);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                console.log('Export PDF');
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            {selectedRows.size > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Reconcile Selected', Array.from(selectedRows));
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Reconcile Selected ({selectedRows.size})
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Card className="p-6">
          <Tabs
            tabs={[
              {
                id: 'all',
                label: 'All Transactions',
                content: renderTableContent(),
              },
              {
                id: 'failed',
                label: 'Failed / Reversed Transactions',
                content: renderTableContent(),
              },
              {
                id: 'high-value',
                label: 'High-Value Transactions',
                content: renderTableContent(),
              },
            ]}
            defaultTab="all"
            onChange={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
              setSelectedRows(new Set());
            }}
          />
        </Card>

        {/* Charts Section */}
        <div ref={chartsSectionRef} className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Transaction Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Transaction Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Daily Transaction Trends
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'Transactions', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'Amount (₹)', angle: 90, position: 'insideRight' }}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="transactions"
                    stroke="#635BFF"
                    strokeWidth={2}
                    name="Transaction Count"
                    dot={{ fill: '#635BFF', r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="amount"
                    stroke="#00D924"
                    strokeWidth={2}
                    name="Amount (₹)"
                    dot={{ fill: '#00D924', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Payment Method Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Transaction Breakdown by Payment Method
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) =>
                      `${props.name}: ${((props.percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
