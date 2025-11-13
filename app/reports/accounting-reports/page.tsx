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
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
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

// Generate dummy data
const generateDaybookEntries = (): DaybookEntry[] => {
  const entries: DaybookEntry[] = [];
  const ledgerHeads = [
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

  let runningBalance = 5000000; // Starting balance

  for (let i = 0; i < 100; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const ledgerHead = ledgerHeads[Math.floor(Math.random() * ledgerHeads.length)];
    const isDebit = Math.random() > 0.5;
    const amount = Math.floor(Math.random() * 500000) + 10000;

    if (isDebit) {
      runningBalance += amount;
    } else {
      runningBalance -= amount;
    }

    entries.push({
      id: `entry-${i + 1}`,
      date: date.toISOString(),
      ledgerHead,
      debit: isDebit ? amount : 0,
      credit: isDebit ? 0 : amount,
      balance: runningBalance,
      reference: `REF${String(i + 1).padStart(6, '0')}`,
    });
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateInterestFees = (): InterestFeesReport[] => {
  const reports: InterestFeesReport[] = [];
  const products = ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Vehicle Loan', 'Gold Loan'];
  const months = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'];

  products.forEach((product) => {
    months.forEach((month) => {
      const interestAccrued = Math.floor(Math.random() * 500000) + 50000;
      const collected = Math.floor(interestAccrued * (0.75 + Math.random() * 0.2)); // 75-95% collected
      const pending = interestAccrued - collected;

      reports.push({
        id: `int-${product}-${month}`,
        period: month,
        product,
        interestAccrued,
        collected,
        pending,
      });
    });
  });

  return reports;
};

const generateProvisioning = (): ProvisioningECL[] => {
  const buckets = [
    { bucket: 'Standard (0-30 days)', provisionPercent: 1 },
    { bucket: 'Watch (31-60 days)', provisionPercent: 5 },
    { bucket: 'Substandard (61-90 days)', provisionPercent: 15 },
    { bucket: 'Doubtful (91-180 days)', provisionPercent: 40 },
    { bucket: 'Loss (180+ days)', provisionPercent: 100 },
  ];

  return buckets.map((b, index) => {
    const outstanding = Math.floor(Math.random() * 5000000) + 500000;
    const provisionAmount = (outstanding * b.provisionPercent) / 100;

    return {
      id: `prov-${index + 1}`,
      loanBucket: b.bucket,
      outstanding,
      provisionPercent: b.provisionPercent,
      provisionAmount: Math.round(provisionAmount),
    };
  });
};

const generateBankReconciliation = (): BankReconciliation[] => {
  const banks = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank'];
  const reconciliations: BankReconciliation[] = [];

  banks.forEach((bank) => {
    const statementAmount = Math.floor(Math.random() * 10000000) + 1000000;
    const difference = Math.floor(Math.random() * 50000) - 25000; // Can be positive or negative
    const systemAmount = statementAmount + difference;
    
    let status: BankReconciliation['status'];
    if (Math.abs(difference) < 100) {
      status = 'Matched';
    } else if (Math.abs(difference) < 10000) {
      status = 'Pending';
    } else {
      status = 'Discrepancy';
    }

    reconciliations.push({
      id: `bank-${bank}`,
      bank,
      statementAmount,
      systemAmount,
      difference,
      status,
    });
  });

  return reconciliations;
};

const allDaybookEntries = generateDaybookEntries();
const allInterestFees = generateInterestFees();
const allProvisioning = generateProvisioning();
const allBankReconciliation = generateBankReconciliation();

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

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalInterestIncome = allInterestFees.reduce((sum, r) => sum + r.collected, 0);
    const feeIncome = allDaybookEntries
      .filter(e => e.ledgerHead.includes('Fee'))
      .reduce((sum, e) => sum + e.credit, 0);
    const totalDisbursed = allDaybookEntries
      .filter(e => e.ledgerHead.includes('Disbursement'))
      .reduce((sum, e) => sum + e.debit, 0);
    const provisionedAmount = allProvisioning.reduce((sum, p) => sum + p.provisionAmount, 0);
    
    // Net Cash Flow = Total Credits - Total Debits (simplified)
    const totalCredits = allDaybookEntries.reduce((sum, e) => sum + e.credit, 0);
    const totalDebits = allDaybookEntries.reduce((sum, e) => sum + e.debit, 0);
    const netCashFlow = totalCredits - totalDebits;

    return {
      totalInterestIncome,
      feeIncome,
      totalDisbursed,
      provisionedAmount,
      netCashFlow,
    };
  }, []);

  // Chart data
  const cashFlowTrendData = [
    { month: 'Jan', inflow: 2500000, outflow: 1800000, net: 700000 },
    { month: 'Feb', inflow: 2800000, outflow: 2000000, net: 800000 },
    { month: 'Mar', inflow: 3200000, outflow: 2200000, net: 1000000 },
    { month: 'Apr', inflow: 3000000, outflow: 2100000, net: 900000 },
    { month: 'May', inflow: 3500000, outflow: 2400000, net: 1100000 },
    { month: 'Jun', inflow: 3800000, outflow: 2600000, net: 1200000 },
    { month: 'Jul', inflow: 4000000, outflow: 2800000, net: 1200000 },
    { month: 'Aug', inflow: 4200000, outflow: 2900000, net: 1300000 },
    { month: 'Sep', inflow: 4500000, outflow: 3100000, net: 1400000 },
    { month: 'Oct', inflow: 4800000, outflow: 3300000, net: 1500000 },
    { month: 'Nov', inflow: 5000000, outflow: 3500000, net: 1500000 },
    { month: 'Dec', inflow: 5200000, outflow: 3600000, net: 1600000 },
  ];

  const incomeCompositionData = [
    { name: 'Interest Income', value: kpis.totalInterestIncome, color: '#3B82F6' },
    { name: 'Processing Fees', value: kpis.feeIncome, color: '#10B981' },
    { name: 'Penalty Charges', value: Math.floor(kpis.feeIncome * 0.3), color: '#F59E0B' },
    { name: 'Other Income', value: Math.floor(kpis.feeIncome * 0.2), color: '#8B5CF6' },
  ];

  // Filter data
  const filteredDaybook = useMemo(() => {
    let filtered = [...allDaybookEntries];

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(e => new Date(e.date) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(e => new Date(e.date) <= toDate);
    }
    if (filters.ledgerHead) {
      filtered = filtered.filter(e => e.ledgerHead === filters.ledgerHead);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        e =>
          e.ledgerHead.toLowerCase().includes(searchLower) ||
          e.reference?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters]);

  const filteredInterestFees = useMemo(() => {
    let filtered = [...allInterestFees];

    if (filters.product) {
      filtered = filtered.filter(r => r.product === filters.product);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(r => r.product.toLowerCase().includes(searchLower));
    }

    return filtered;
  }, [filters]);

  const filteredBankReconciliation = useMemo(() => {
    let filtered = [...allBankReconciliation];

    if (filters.bank) {
      filtered = filtered.filter(r => r.bank === filters.bank);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(r => r.bank.toLowerCase().includes(searchLower));
    }

    return filtered;
  }, [filters]);

  // Pagination
  const getPaginatedData = (data: any[]) => {
    return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };

  const totalPages = (data: any[]) => Math.ceil(data.length / itemsPerPage);

  // Get unique values for filters
  const uniqueLedgerHeads = Array.from(new Set(allDaybookEntries.map(e => e.ledgerHead))).sort();
  const uniqueProducts = Array.from(new Set(allInterestFees.map(r => r.product))).sort();
  const uniqueBanks = Array.from(new Set(allBankReconciliation.map(r => r.bank))).sort();

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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-5 bg-neutral-50 border border-neutral-200">
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
          <Card className="p-5 bg-neutral-50 border border-neutral-200">
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
          <Card className="p-5 bg-neutral-50 border border-neutral-200">
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
          <Card className="p-5 bg-neutral-50 border border-neutral-200">
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
          <Card className="p-5 bg-neutral-50 border border-neutral-200">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cash Flow Trend */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Cash Flow Trend
            </h3>
            <div className="h-80">
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
            </div>
          </Card>

          {/* Income Composition */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Income Composition
            </h3>
            <div className="h-80">
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
                    {incomeCompositionData.map((entry, index) => (
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
            </div>
          </Card>
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
                  ...uniqueLedgerHeads.map((head) => ({
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
                  ...uniqueProducts.map((product) => ({
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
                  ...uniqueBanks.map((bank) => ({
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
              let dataToExport: any[] = [];
              let filename = 'accounting-reports';
              
              if (activeTab === 'daybook') {
                dataToExport = filteredDaybook;
                filename = 'daybook-summary';
              } else if (activeTab === 'interest') {
                dataToExport = filteredInterestFees;
                filename = 'interest-fees-report';
              } else if (activeTab === 'provisioning') {
                dataToExport = allProvisioning;
                filename = 'provisioning-ecl';
              } else if (activeTab === 'reconciliation') {
                dataToExport = filteredBankReconciliation;
                filename = 'bank-reconciliation';
              }
              
              exportToCSV(dataToExport, `${filename}-${new Date().toISOString().split('T')[0]}`);
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
        <Card className="p-6 bg-white border border-neutral-200">
          <Tabs
            tabs={[
              {
                id: 'daybook',
                label: 'Daybook / GL Summary',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredDaybook)}
                      columns={daybookColumns}
                    />
                    {totalPages(filteredDaybook) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredDaybook.length)} of{' '}
                          {filteredDaybook.length} entries
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredDaybook)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'interest',
                label: 'Interest & Fees Report',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredInterestFees)}
                      columns={interestFeesColumns}
                    />
                    {totalPages(filteredInterestFees) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredInterestFees.length)} of{' '}
                          {filteredInterestFees.length} records
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredInterestFees)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'provisioning',
                label: 'Provisioning & ECL',
                content: (
                  <div className="mt-4">
                    <Table
                      data={allProvisioning}
                      columns={provisioningColumns}
                    />
                  </div>
                ),
              },
              {
                id: 'reconciliation',
                label: 'Bank Reconciliation',
                content: (
                  <div className="mt-4">
                    <Table
                      data={filteredBankReconciliation}
                      columns={bankReconciliationColumns}
                    />
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
                // Save logic here
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

