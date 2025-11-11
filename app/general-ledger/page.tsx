'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Input,
  Select,
  Breadcrumbs,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  Wallet,
  Coins,
  Building2,
  TrendingUp,
  Search,
  Download,
  FileText,
  RefreshCw,
} from 'lucide-react';

// Type definitions
interface ChartOfAccount {
  id: string;
  accountId: string;
  accountName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  balance: number;
  description: string;
  color: string;
}

interface JournalEntry {
  id: string;
  transactionId: string;
  date: string;
  description: string;
  entries: JournalEntryLine[];
}

interface JournalEntryLine {
  id: string;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  isMainEntry: boolean;
}

interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  netProfit: number;
  assetsChange: number;
}

// Chart of Accounts Data
const chartOfAccounts: ChartOfAccount[] = [
  {
    id: 'acc-1000',
    accountId: '1000',
    accountName: 'Cash',
    accountType: 'Asset',
    balance: 1245600,
    description: 'This is the company\'s operational cash',
    color: '#3B82F6',
  },
  {
    id: 'acc-1010',
    accountId: '1010',
    accountName: 'Loans Receivable',
    accountType: 'Asset',
    balance: 8105000,
    description: 'Total principal owed by all customers',
    color: '#10B981',
  },
  {
    id: 'acc-3000',
    accountId: '3000',
    accountName: 'Share Capital',
    accountType: 'Equity',
    balance: 1500000,
    description: 'Total value of all member shares',
    color: '#8B5CF6',
  },
  {
    id: 'acc-4000',
    accountId: '4000',
    accountName: 'Interest Income',
    accountType: 'Income',
    balance: 5100,
    description: 'Revenue earned this period',
    color: '#F59E0B',
  },
  {
    id: 'acc-5000',
    accountId: '5000',
    accountName: 'Rent Expense',
    accountType: 'Expense',
    balance: 25000,
    description: 'Branch rent payments',
    color: '#EF4444',
  },
  {
    id: 'acc-2000',
    accountId: '2000',
    accountName: 'Customer Deposits',
    accountType: 'Liability',
    balance: 500000,
    description: 'Total deposits from customers',
    color: '#EC4899',
  },
  {
    id: 'acc-5001',
    accountId: '5001',
    accountName: 'Salary Expense',
    accountType: 'Expense',
    balance: 120000,
    description: 'Employee salary payments',
    color: '#F97316',
  },
  {
    id: 'acc-4001',
    accountId: '4001',
    accountName: 'Processing Fee Income',
    accountType: 'Income',
    balance: 15000,
    description: 'Fees collected from loan processing',
    color: '#14B8A6',
  },
];

// Generate Journal Entries with dummy data
const generateJournalEntries = (): JournalEntry[] => {
  const entries: JournalEntry[] = [
    {
      id: 'je-1',
      transactionId: 'T1',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Day 1
      description: 'Rajesh Share Purchase',
      entries: [
        {
          id: 'je-1-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 100.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-1-2',
          accountId: '3000',
          accountName: 'Share Capital',
          debit: 0,
          credit: 100.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-2',
      transactionId: 'T2',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Day 1
      description: 'Rajesh Loan LN-7890',
      entries: [
        {
          id: 'je-2-1',
          accountId: '1010',
          accountName: 'Loans Receivable',
          debit: 50000.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-2-2',
          accountId: '1000',
          accountName: 'Cash',
          debit: 0,
          credit: 50000.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-3',
      transactionId: 'T3',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Day 1
      description: 'Customer Deposit - Meera',
      entries: [
        {
          id: 'je-3-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 100000.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-3-2',
          accountId: '2000',
          accountName: 'Customer Deposits',
          debit: 0,
          credit: 100000.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-4',
      transactionId: 'T4',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Day 1
      description: 'Loan Processing Fee - LN-7890',
      entries: [
        {
          id: 'je-4-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 2500.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-4-2',
          accountId: '4001',
          accountName: 'Processing Fee Income',
          debit: 0,
          credit: 2500.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-5',
      transactionId: 'T5',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Day 2
      description: 'Rajesh EMI Pmt',
      entries: [
        {
          id: 'je-5-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 4500.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-5-2',
          accountId: '1010',
          accountName: 'Loans Receivable',
          debit: 0,
          credit: 4000.00,
          isMainEntry: false,
        },
        {
          id: 'je-5-3',
          accountId: '4000',
          accountName: 'Interest Income',
          debit: 0,
          credit: 500.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-6',
      transactionId: 'T6',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Day 2
      description: 'Suresh EMI Pmt',
      entries: [
        {
          id: 'je-6-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 3200.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-6-2',
          accountId: '1010',
          accountName: 'Loans Receivable',
          debit: 0,
          credit: 2800.00,
          isMainEntry: false,
        },
        {
          id: 'je-6-3',
          accountId: '4000',
          accountName: 'Interest Income',
          debit: 0,
          credit: 400.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-7',
      transactionId: 'T7',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Day 2
      description: 'Branch Rent Payment',
      entries: [
        {
          id: 'je-7-1',
          accountId: '5000',
          accountName: 'Rent Expense',
          debit: 25000.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-7-2',
          accountId: '1000',
          accountName: 'Cash',
          debit: 0,
          credit: 25000.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-8',
      transactionId: 'T8',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Day 2
      description: 'Monthly Salary Payment',
      entries: [
        {
          id: 'je-8-1',
          accountId: '5001',
          accountName: 'Salary Expense',
          debit: 120000.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-8-2',
          accountId: '1000',
          accountName: 'Cash',
          debit: 0,
          credit: 120000.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-9',
      transactionId: 'T9',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Day 2
      description: 'Kavita Loan LN-7892',
      entries: [
        {
          id: 'je-9-1',
          accountId: '1010',
          accountName: 'Loans Receivable',
          debit: 60000.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-9-2',
          accountId: '1000',
          accountName: 'Cash',
          debit: 0,
          credit: 60000.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-10',
      transactionId: 'T10',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Day 2
      description: 'Loan Processing Fee - LN-7892',
      entries: [
        {
          id: 'je-10-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 3000.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-10-2',
          accountId: '4001',
          accountName: 'Processing Fee Income',
          debit: 0,
          credit: 3000.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-11',
      transactionId: 'T11',
      date: new Date().toISOString(), // Today
      description: 'Priya Share Purchase',
      entries: [
        {
          id: 'je-11-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 500.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-11-2',
          accountId: '3000',
          accountName: 'Share Capital',
          debit: 0,
          credit: 500.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-12',
      transactionId: 'T12',
      date: new Date().toISOString(), // Today
      description: 'Anil Loan LN-7891',
      entries: [
        {
          id: 'je-12-1',
          accountId: '1010',
          accountName: 'Loans Receivable',
          debit: 75000.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-12-2',
          accountId: '1000',
          accountName: 'Cash',
          debit: 0,
          credit: 75000.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-13',
      transactionId: 'T13',
      date: new Date().toISOString(), // Today
      description: 'Loan Processing Fee - LN-7891',
      entries: [
        {
          id: 'je-13-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 3750.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-13-2',
          accountId: '4001',
          accountName: 'Processing Fee Income',
          debit: 0,
          credit: 3750.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-14',
      transactionId: 'T14',
      date: new Date().toISOString(), // Today
      description: 'Ravi EMI Pmt',
      entries: [
        {
          id: 'je-14-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 5500.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-14-2',
          accountId: '1010',
          accountName: 'Loans Receivable',
          debit: 0,
          credit: 5000.00,
          isMainEntry: false,
        },
        {
          id: 'je-14-3',
          accountId: '4000',
          accountName: 'Interest Income',
          debit: 0,
          credit: 500.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-15',
      transactionId: 'T15',
      date: new Date().toISOString(), // Today
      description: 'Customer Deposit - Vikram',
      entries: [
        {
          id: 'je-15-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 50000.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-15-2',
          accountId: '2000',
          accountName: 'Customer Deposits',
          debit: 0,
          credit: 50000.00,
          isMainEntry: false,
        },
      ],
    },
    {
      id: 'je-16',
      transactionId: 'T16',
      date: new Date().toISOString(), // Today
      description: 'Additional Interest Income',
      entries: [
        {
          id: 'je-16-1',
          accountId: '1000',
          accountName: 'Cash',
          debit: 1200.00,
          credit: 0,
          isMainEntry: true,
        },
        {
          id: 'je-16-2',
          accountId: '4000',
          accountName: 'Interest Income',
          debit: 0,
          credit: 1200.00,
          isMainEntry: false,
        },
      ],
    },
  ];

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const allJournalEntries = generateJournalEntries();

// Calculate Financial Summary
const calculateFinancialSummary = (): FinancialSummary => {
  const assets = chartOfAccounts
    .filter(acc => acc.accountType === 'Asset')
    .reduce((sum, acc) => sum + acc.balance, 0);
  
  const liabilities = chartOfAccounts
    .filter(acc => acc.accountType === 'Liability')
    .reduce((sum, acc) => sum + acc.balance, 0);
  
  const equity = chartOfAccounts
    .filter(acc => acc.accountType === 'Equity')
    .reduce((sum, acc) => sum + acc.balance, 0);
  
  const income = chartOfAccounts
    .filter(acc => acc.accountType === 'Income')
    .reduce((sum, acc) => sum + acc.balance, 0);
  
  const expenses = chartOfAccounts
    .filter(acc => acc.accountType === 'Expense')
    .reduce((sum, acc) => sum + acc.balance, 0);
  
  const netProfit = income - expenses;
  const assetsChange = 2.5; // Percentage change

  return {
    totalAssets: assets,
    totalLiabilities: liabilities,
    totalEquity: equity,
    netProfit,
    assetsChange,
  };
};

export default function GeneralLedgerPage() {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    accountId: '',
    search: '',
  });

  const financialSummary = useMemo(() => calculateFinancialSummary(), []);

  // Filter journal entries
  const filteredEntries = useMemo(() => {
    let filtered = [...allJournalEntries];

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(entry => new Date(entry.date) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(entry => new Date(entry.date) <= toDate);
    }
    if (filters.accountId) {
      filtered = filtered.filter(entry =>
        entry.entries.some(e => e.accountId === filters.accountId)
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.transactionId.toLowerCase().includes(searchLower) ||
        entry.description.toLowerCase().includes(searchLower) ||
        entry.entries.some(e => e.accountName.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [filters]);

  // Flatten journal entries for table display with grouping and calculate balances
  const tableData = useMemo(() => {
    // Initialize balances from chart of accounts (starting balances)
    const accountBalances: Record<string, number> = {};
    chartOfAccounts.forEach(acc => {
      accountBalances[acc.accountId] = acc.balance;
    });

    // Process entries chronologically (oldest first) to calculate running balances
    const chronologicalEntries = [...filteredEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Build a map of entry line ID to balance
    const lineBalanceMap = new Map<string, number>();
    const runningBalances: Record<string, number> = { ...accountBalances };

    chronologicalEntries.forEach(entry => {
      entry.entries.forEach((line) => {
        const account = chartOfAccounts.find(acc => acc.accountId === line.accountId);
        const accountType = account?.accountType || 'Asset';
        
        // Update running balance based on account type
        if (accountType === 'Asset' || accountType === 'Expense') {
          runningBalances[line.accountId] = (runningBalances[line.accountId] || 0) + line.debit - line.credit;
        } else {
          runningBalances[line.accountId] = (runningBalances[line.accountId] || 0) + line.credit - line.debit;
        }
        
        // Store balance for this line
        lineBalanceMap.set(line.id, runningBalances[line.accountId]);
      });
    });

    // Flatten entries in display order (newest first) with balances
    const flattened: any[] = [];
    filteredEntries.forEach(entry => {
      entry.entries.forEach((line, index) => {
        flattened.push({
          id: line.id,
          transactionId: index === 0 ? entry.transactionId : '',
          date: index === 0 ? entry.date : '',
          description: index === 0 ? entry.description : '',
          accountId: line.accountId,
          accountName: line.accountName,
          debit: line.debit,
          credit: line.credit,
          balance: lineBalanceMap.get(line.id) || 0,
          isMainEntry: line.isMainEntry,
          transactionGroup: entry.id,
          isSubEntry: !line.isMainEntry,
        });
      });
    });
    return flattened;
  }, [filteredEntries]);

  // Table columns
  const columns = [
    {
      key: 'transactionId',
      header: 'TXN ID',
      sortable: true,
      width: '100px',
      render: (_: any, row: any) => (
        row.transactionId ? (
          <span className="font-mono text-sm font-semibold text-neutral-900">
            {row.transactionId}
          </span>
        ) : (
          <span className="text-sm text-neutral-300">└─</span>
        )
      ),
    },
    {
      key: 'date',
      header: 'DATE',
      sortable: true,
      width: '120px',
      render: (date: string, row: any) => {
        if (!date) return <span></span>;
        const dateObj = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dayLabel = '';
        if (dateObj.toDateString() === today.toDateString()) {
          dayLabel = 'Today';
        } else if (dateObj.toDateString() === yesterday.toDateString()) {
          dayLabel = 'Day 2';
        } else {
          const diffDays = Math.floor((today.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
          dayLabel = `Day ${diffDays + 1}`;
        }

        return (
          <span className="text-sm text-neutral-700">{dayLabel}</span>
        );
      },
    },
    {
      key: 'description',
      header: 'DESCRIPTION',
      sortable: true,
      width: '250px',
      render: (desc: string, row: any) => (
        <span className={`text-sm ${row.isMainEntry ? 'font-semibold text-neutral-900' : 'text-neutral-600'}`}>
          {desc || ''}
        </span>
      ),
    },
    {
      key: 'accountName',
      header: 'ACCOUNT (ID)',
      sortable: true,
      width: '200px',
      render: (_: any, row: any) => (
        <span className={`text-sm ${row.isMainEntry ? 'font-medium text-neutral-900' : 'text-neutral-600'}`}>
          {row.accountName} ({row.accountId})
        </span>
      ),
    },
    {
      key: 'debit',
      header: 'DEBIT (DR)',
      sortable: true,
      width: '140px',
      render: (debit: number) => (
        <span className="text-sm font-mono text-neutral-900">
          {debit > 0 ? `₹${debit.toFixed(2)}` : '-'}
        </span>
      ),
    },
    {
      key: 'credit',
      header: 'CREDIT (CR)',
      sortable: true,
      width: '140px',
      render: (credit: number) => (
        <span className="text-sm font-mono text-neutral-900">
          {credit > 0 ? `₹${credit.toFixed(2)}` : '-'}
        </span>
      ),
    },
  ];

  // Key Account Balances (all accounts)
  const keyAccounts = chartOfAccounts;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Financials', href: '#' },
                { label: 'General Ledger' },
              ]}
            />
            <h1 className="text-3xl font-bold text-neutral-900 mt-2">
              Financial Dashboard
            </h1>
            <p className="text-neutral-600 mt-1">
              General Ledger and Chart of Accounts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1 font-medium">Total Assets</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₹{financialSummary.totalAssets.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-600">
                    +{financialSummary.assetsChange}% vs last month
                  </span>
                </div>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 mb-1 font-medium">Total Liabilities</p>
                <p className="text-2xl font-bold text-orange-900">
                  ₹{financialSummary.totalLiabilities.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-orange-600 mt-1">(e.g., Deposits)</p>
              </div>
              <div className="bg-orange-200 p-3 rounded-lg">
                <Coins className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1 font-medium">Total Equity</p>
                <p className="text-2xl font-bold text-green-900">
                  ₹{financialSummary.totalEquity.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-green-600 mt-1">(Share Capital)</p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1 font-medium">Net Profit (P&L)</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{financialSummary.netProfit.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-purple-600 mt-1">This Month</p>
              </div>
              <div className="bg-purple-200 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </Card>
        </div>

        {/* Key Account Balances (CGL) */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Key Account Balances (CGL)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyAccounts.map((account) => (
              <Card key={account.id} className="p-5 bg-white border border-neutral-200">
                <div className="flex items-start gap-3">
                  <div
                    className="w-1 h-16 rounded-full"
                    style={{ backgroundColor: account.color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-900">
                      Account {account.accountId} - {account.accountName}
                    </p>
                    <p className="text-xl font-bold text-neutral-900 mt-1">
                      ₹{account.balance.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {account.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
            <Button variant="outline" size="sm" onClick={() => setFilters({
              dateFrom: '',
              dateTo: '',
              accountId: '',
              search: '',
            })}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              label="Account"
              placeholder="All Accounts"
              value={filters.accountId}
              onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
              options={[
                { value: '', label: 'All Accounts' },
                ...chartOfAccounts.map((acc) => ({
                  value: acc.accountId,
                  label: `${acc.accountId} - ${acc.accountName}`,
                })),
              ]}
            />
            <Input
              label="Search"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </Card>

        {/* Live General Journal */}
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Live General Journal (Recent Transactions)
            </h2>
            <p className="text-sm text-neutral-600">
              This is the real-time &apos;engine log&apos; of all financial events. Every event creates a balanced entry.
            </p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <div className="bg-white rounded-stripe border border-border-light overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-border-light">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      TXN ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      DATE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      DESCRIPTION
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      ACCOUNT (ID)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      DEBIT (DR)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      CREDIT (CR)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      BALANCE
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {tableData.map((row, rowIndex) => {
                    const prevRow = rowIndex > 0 ? tableData[rowIndex - 1] : null;
                    const isNewTransaction = prevRow?.transactionGroup !== row.transactionGroup;
                    const isSubEntry = row.isSubEntry;

                    return (
                      <tr
                        key={row.id}
                        className={cn(
                          'transition-colors',
                          isNewTransaction && 'border-t-2 border-neutral-200',
                          isSubEntry && 'bg-neutral-50/50'
                        )}
                      >
                        <td className="px-6 py-3">
                          {row.transactionId ? (
                            <span className="font-mono text-sm font-semibold text-neutral-900">
                              {row.transactionId}
                            </span>
                          ) : (
                            <span className="text-sm text-neutral-400">└─</span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {row.date ? (
                            (() => {
                              const dateObj = new Date(row.date);
                              const today = new Date();
                              const yesterday = new Date(today);
                              yesterday.setDate(yesterday.getDate() - 1);
                              
                              let dayLabel = '';
                              if (dateObj.toDateString() === today.toDateString()) {
                                dayLabel = 'Today';
                              } else if (dateObj.toDateString() === yesterday.toDateString()) {
                                dayLabel = 'Day 2';
                              } else {
                                const diffDays = Math.floor((today.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
                                dayLabel = `Day ${diffDays + 1}`;
                              }
                              return <span className="text-sm text-neutral-700">{dayLabel}</span>;
                            })()
                          ) : (
                            <span></span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-sm ${row.isMainEntry ? 'font-semibold text-neutral-900' : 'text-neutral-600'}`}>
                            {row.description || ''}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-sm ${row.isMainEntry ? 'font-medium text-neutral-900' : 'text-neutral-600'}`}>
                            {row.accountName} ({row.accountId})
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-sm font-mono text-neutral-900">
                            {row.debit > 0 ? `₹${row.debit.toFixed(2)}` : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-sm font-mono text-neutral-900">
                            {row.credit > 0 ? `₹${row.credit.toFixed(2)}` : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-sm font-mono font-semibold ${
                            row.balance >= 0 ? 'text-neutral-900' : 'text-error-600'
                          }`}>
                            ₹{row.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

