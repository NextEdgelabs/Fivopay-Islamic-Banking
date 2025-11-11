'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
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

// Transaction type definitions
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

// Dummy data
const generateDummyTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const types: Transaction['type'][] = ['Deposit', 'Withdrawal', 'Transfer', 'Loan Disbursement', 'Loan Repayment'];
  const statuses: Transaction['status'][] = ['Completed', 'Pending', 'Failed', 'Reversed'];
  const paymentMethods: Transaction['paymentMethod'][] = ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card'];
  const agents = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh'];
  const branches = ['Main Branch', 'Downtown Branch', 'City Center', 'Suburban Branch', 'North Branch'];
  const users = ['Ramesh Kumar', 'Sunita Devi', 'Anil Mehta', 'Kavita Singh', 'Mohammed Ali', 'Lakshmi Nair', 'Suresh Reddy'];

  for (let i = 0; i < 150; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    const amount = Math.floor(Math.random() * 500000) + 1000;
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    transactions.push({
      id: `txn-${i + 1}`,
      transactionId: `TXN${String(i + 1).padStart(8, '0')}`,
      dateTime: date.toISOString(),
      user: users[Math.floor(Math.random() * users.length)],
      userId: `USR${String(Math.floor(Math.random() * 1000)).padStart(6, '0')}`,
      type,
      amount,
      status,
      agent: agents[Math.floor(Math.random() * agents.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      paymentMethod,
      balanceAfter: Math.floor(Math.random() * 10000000) + amount,
      reference: `REF${String(Math.floor(Math.random() * 100000)).padStart(8, '0')}`,
    });
  }

  return transactions.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
};

const allTransactions = generateDummyTransactions();

// Chart data
const dailyTrendData = [
  { date: '01 Jan', transactions: 45, amount: 1250000 },
  { date: '02 Jan', transactions: 52, amount: 1420000 },
  { date: '03 Jan', transactions: 48, amount: 1380000 },
  { date: '04 Jan', transactions: 61, amount: 1650000 },
  { date: '05 Jan', transactions: 55, amount: 1520000 },
  { date: '06 Jan', transactions: 42, amount: 1180000 },
  { date: '07 Jan', transactions: 58, amount: 1680000 },
  { date: '08 Jan', transactions: 49, amount: 1350000 },
  { date: '09 Jan', transactions: 53, amount: 1480000 },
  { date: '10 Jan', transactions: 47, amount: 1320000 },
  { date: '11 Jan', transactions: 56, amount: 1620000 },
  { date: '12 Jan', transactions: 44, amount: 1280000 },
  { date: '13 Jan', transactions: 50, amount: 1450000 },
  { date: '14 Jan', transactions: 59, amount: 1720000 },
];

const paymentMethodData = [
  { name: 'Cash', value: 35, color: '#635BFF' },
  { name: 'UPI', value: 28, color: '#00D924' },
  { name: 'Bank Transfer', value: 22, color: '#FFA500' },
  { name: 'Card', value: 10, color: '#DF1B41' },
  { name: 'Cheque', value: 5, color: '#8B5CF6' },
];

export default function TransactionReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 15;

  // Filter states
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

  // Filter transactions based on active tab and filters
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    // Apply tab filter
    if (activeTab === 'failed') {
      filtered = filtered.filter((t) => t.status === 'Failed' || t.status === 'Reversed');
    } else if (activeTab === 'high-value') {
      filtered = filtered.filter((t) => t.amount >= 100000);
    }

    // Apply other filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter((t) => new Date(t.dateTime) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => new Date(t.dateTime) <= toDate);
    }
    if (filters.transactionType) {
      filtered = filtered.filter((t) => t.type === filters.transactionType);
    }
    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters.agent) {
      filtered = filtered.filter((t) => t.agent === filters.agent);
    }
    if (filters.branch) {
      filtered = filtered.filter((t) => t.branch === filters.branch);
    }
    if (filters.amountMin) {
      filtered = filtered.filter((t) => t.amount >= parseFloat(filters.amountMin));
    }
    if (filters.amountMax) {
      filtered = filtered.filter((t) => t.amount <= parseFloat(filters.amountMax));
    }
    if (filters.paymentMethod) {
      filtered = filtered.filter((t) => t.paymentMethod === filters.paymentMethod);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(searchLower) ||
          t.user.toLowerCase().includes(searchLower) ||
          t.reference.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [activeTab, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Summary stats
  const summaryStats = useMemo(() => {
    const totalCount = filteredTransactions.length;
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgValue = totalCount > 0 ? totalAmount / totalCount : 0;
    return { totalCount, totalAmount, avgValue };
  }, [filteredTransactions]);

  // Reset filters
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
  };

  // Handle row selection
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

  // Table columns
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

  // Get unique values for filter dropdowns
  const uniqueAgents = Array.from(new Set(allTransactions.map((t) => t.agent))).sort();
  const uniqueBranches = Array.from(new Set(allTransactions.map((t) => t.branch))).sort();

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
        </div>

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
                  ...uniqueAgents.map((agent) => ({
                    value: agent,
                    label: agent,
                  })),
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
                  ...uniqueBranches.map((branch) => ({
                    value: branch,
                    label: branch,
                  })),
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
                // Export CSV logic
                console.log('Export CSV');
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Export PDF logic
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
                  // Reconcile logic
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
                content: (
                  <div className="mt-4">
                    <Table
                      data={paginatedTransactions}
                      columns={columns}
                      onRowClick={(row) => {
                        // View details logic
                        console.log('View transaction:', row);
                      }}
                    />
                    {totalPages > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                          {filteredTransactions.length} transactions
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'failed',
                label: 'Failed / Reversed Transactions',
                content: (
                  <div className="mt-4">
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
                          {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                          {filteredTransactions.length} transactions
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'high-value',
                label: 'High-Value Transactions',
                content: (
                  <div className="mt-4">
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
                          {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                          {filteredTransactions.length} transactions
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
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
                    {paymentMethodData.map((entry, index) => (
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
    </DashboardLayout>
  );
}

