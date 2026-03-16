'use client';

import React, { useMemo, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
import {
  Card,
  Button,
  Breadcrumbs,
  Input,
  Select,
} from '@/components/ui';
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  Coins,
  Filter,
  RefreshCw,
  Search,
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

// Chart of Accounts Data (same as General Ledger)
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
    id: 'acc-2000',
    accountId: '2000',
    accountName: 'Customer Deposits',
    accountType: 'Liability',
    balance: 500000,
    description: 'Total deposits from customers',
    color: '#EC4899',
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
    accountName: 'Profit Income', // display overridden by useInterestProfitTerm in component
    accountType: 'Income',
    balance: 5100,
    description: 'Revenue earned this period',
    color: '#F59E0B',
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
    id: 'acc-5001',
    accountId: '5001',
    accountName: 'Salary Expense',
    accountType: 'Expense',
    balance: 120000,
    description: 'Employee salary payments',
    color: '#F97316',
  },
];

const PRINT_STYLES = `
  @media print {
    body {
      margin: 0;
    }
    body * {
      visibility: hidden;
    }
    #balance-sheet-print,
    #balance-sheet-print * {
      visibility: visible;
    }
    #balance-sheet-print {
      position: absolute;
      inset: 0;
      margin: 0;
      padding: 24px;
    }
  }
`;

export default function BalanceSheetPage() {
  const { incomeLabel, netLabel } = useInterestProfitTerm();
  const today = new Date().toISOString().split('T')[0];
  const [filters, setFilters] = useState({
    dateFrom: today,
    dateTo: today,
    accountType: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(true);

  const handlePrintOrExport = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  // Calculate Balance Sheet Data
  const balanceSheetData = useMemo(() => {
    let filteredAccounts = [...chartOfAccounts];

    if (filters.accountType) {
      filteredAccounts = filteredAccounts.filter(acc => acc.accountType === filters.accountType);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredAccounts = filteredAccounts.filter(
        acc =>
          acc.accountName.toLowerCase().includes(searchLower) ||
          acc.accountId.toLowerCase().includes(searchLower)
      );
    }

    const displayAccountName = (acc: ChartOfAccount) =>
      (acc.accountId === '4000' ? incomeLabel : acc.accountName);

    // Assets
    const currentAssets = filteredAccounts
      .filter(acc => acc.accountType === 'Asset')
      .map(acc => ({
        accountId: acc.accountId,
        accountName: displayAccountName(acc),
        balance: acc.balance,
        color: acc.color,
      }));

    const totalAssets = currentAssets.reduce((sum, acc) => sum + acc.balance, 0);

    // Liabilities
    const currentLiabilities = filteredAccounts
      .filter(acc => acc.accountType === 'Liability')
      .map(acc => ({
        accountId: acc.accountId,
        accountName: displayAccountName(acc),
        balance: acc.balance,
        color: acc.color,
      }));

    const totalLiabilities = currentLiabilities.reduce((sum, acc) => sum + acc.balance, 0);

    // Equity
    const shareCapital = filteredAccounts
      .filter(acc => acc.accountType === 'Equity')
      .map(acc => ({
        accountId: acc.accountId,
        accountName: displayAccountName(acc),
        balance: acc.balance,
        color: acc.color,
      }));

    // Calculate Net Income (Income - Expenses)
    const totalIncome = filteredAccounts
      .filter(acc => acc.accountType === 'Income')
      .reduce((sum, acc) => sum + acc.balance, 0);

    const totalExpenses = filteredAccounts
      .filter(acc => acc.accountType === 'Expense')
      .reduce((sum, acc) => sum + acc.balance, 0);

    const netIncome = totalIncome - totalExpenses;

    // Retained Earnings (calculated to balance the sheet: Assets - Liabilities - Share Capital)
    const retainedEarnings = totalAssets - totalLiabilities - shareCapital.reduce((sum, acc) => sum + acc.balance, 0);

    const totalEquity = shareCapital.reduce((sum, acc) => sum + acc.balance, 0) + retainedEarnings;

    // Verify: Assets = Liabilities + Equity
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
    const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

    return {
      currentAssets,
      totalAssets,
      currentLiabilities,
      totalLiabilities,
      shareCapital,
      retainedEarnings,
      netIncome,
      totalIncome,
      totalExpenses,
      totalEquity,
      totalLiabilitiesAndEquity,
      isBalanced,
    };
  }, [filters, incomeLabel]);

  const dateRangeDisplay =
    filters.dateFrom && filters.dateTo
      ? filters.dateFrom === filters.dateTo
        ? new Date(filters.dateTo).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : `${new Date(filters.dateFrom).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })} – ${new Date(filters.dateTo).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}`
      : new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

  const resetFilters = () => {
    const now = new Date().toISOString().split('T')[0];
    setFilters({
      dateFrom: now,
      dateTo: now,
      accountType: '',
      search: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header (hidden in PDF) */}
        <div className="flex items-center justify-between print:hidden">
          <div>
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Financials', href: '#' },
                { label: 'Balance Sheet' },
              ]}
            />
            <h1 className="text-3xl font-bold text-neutral-900 mt-2">
              Balance Sheet
            </h1>
            <p className="text-neutral-600 mt-1">
              {filters.dateFrom === filters.dateTo ? `As of ${dateRangeDisplay}` : `Period: ${dateRangeDisplay}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrintOrExport}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filters (not included in PDF) */}
        <Card className="p-6 print:hidden">
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
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
              <Input
                type="date"
                label="Date To"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
              <Select
                label="Account Type"
                placeholder="All Types"
                value={filters.accountType}
                onChange={(e) => setFilters({ ...filters, accountType: e.target.value })}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'Asset', label: 'Asset' },
                  { value: 'Liability', label: 'Liability' },
                  { value: 'Equity', label: 'Equity' },
                  { value: 'Income', label: 'Income' },
                  { value: 'Expense', label: 'Expense' },
                ]}
              />
              <div className="md:col-span-2 lg:col-span-2">
                <Input
                  label="Search"
                  placeholder="Search by account name or ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Printable content */}
        <div id="balance-sheet-print" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1 font-medium">Total Assets</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₹{balanceSheetData.totalAssets.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
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
                  ₹{balanceSheetData.totalLiabilities.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
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
                  ₹{balanceSheetData.totalEquity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-green-700" />
              </div>
            </div>
            </Card>
          </div>

          {/* Balance Sheet Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assets Section */}
            <Card className="p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">ASSETS</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
                  Current Assets
                </h3>
                <div className="space-y-2">
                  {balanceSheetData.currentAssets.map((asset) => (
                    <div
                      key={asset.accountId}
                      className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg border-l-4"
                      style={{ borderLeftColor: asset.color }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: asset.color }}
                        />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {asset.accountName}
                          </p>
                          <p className="text-xs text-neutral-500 font-mono">
                            Account {asset.accountId}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-mono font-semibold text-neutral-900">
                        ₹{asset.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t-2 border-neutral-300">
                <div className="flex items-center justify-between py-3 px-3 bg-blue-50 rounded-lg">
                  <p className="text-base font-bold text-blue-900">Total Assets</p>
                  <p className="text-base font-mono font-bold text-blue-900">
                    ₹{balanceSheetData.totalAssets.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Liabilities & Equity Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">LIABILITIES & EQUITY</h2>
            <div className="space-y-4">
              {/* Liabilities */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
                  Current Liabilities
                </h3>
                <div className="space-y-2">
                  {balanceSheetData.currentLiabilities.map((liability) => (
                    <div
                      key={liability.accountId}
                      className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg border-l-4"
                      style={{ borderLeftColor: liability.color }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: liability.color }}
                        />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {liability.accountName}
                          </p>
                          <p className="text-xs text-neutral-500 font-mono">
                            Account {liability.accountId}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-mono font-semibold text-neutral-900">
                        ₹{liability.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <div className="flex items-center justify-between py-2 px-3">
                    <p className="text-sm font-semibold text-neutral-700">Total Liabilities</p>
                    <p className="text-sm font-mono font-semibold text-neutral-900">
                      ₹{balanceSheetData.totalLiabilities.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Equity */}
              <div className="pt-4 border-t border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
                  Equity
                </h3>
                <div className="space-y-2">
                  {balanceSheetData.shareCapital.map((equity) => (
                    <div
                      key={equity.accountId}
                      className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg border-l-4"
                      style={{ borderLeftColor: equity.color }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: equity.color }}
                        />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {equity.accountName}
                          </p>
                          <p className="text-xs text-neutral-500 font-mono">
                            Account {equity.accountId}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-mono font-semibold text-neutral-900">
                        ₹{equity.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          Retained Earnings
                        </p>
                        <p className="text-xs text-neutral-500">
                          {netLabel}: ₹{balanceSheetData.netIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-mono font-semibold text-neutral-900">
                      ₹{balanceSheetData.retainedEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <div className="flex items-center justify-between py-2 px-3">
                    <p className="text-sm font-semibold text-neutral-700">Total Equity</p>
                    <p className="text-sm font-mono font-semibold text-neutral-900">
                      ₹{balanceSheetData.totalEquity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Liabilities & Equity */}
              <div className="pt-4 border-t-2 border-neutral-300">
                <div className="flex items-center justify-between py-3 px-3 bg-green-50 rounded-lg">
                  <p className="text-base font-bold text-green-900">Total Liabilities & Equity</p>
                  <p className="text-base font-mono font-bold text-green-900">
                    ₹{balanceSheetData.totalLiabilitiesAndEquity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Balance Verification */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {balanceSheetData.isBalanced ? (
                <>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-700">Balance Sheet is Balanced</p>
                    <p className="text-xs text-green-600">
                      Assets (₹{balanceSheetData.totalAssets.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) = 
                      Liabilities + Equity (₹{balanceSheetData.totalLiabilitiesAndEquity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-error-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-error-700">Balance Sheet is Not Balanced</p>
                    <p className="text-xs text-error-600">
                      Difference: ₹{Math.abs(balanceSheetData.totalAssets - balanceSheetData.totalLiabilitiesAndEquity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 mb-1">{netLabel} (P&L)</p>
              <p className={`text-lg font-bold ${balanceSheetData.netIncome >= 0 ? 'text-green-600' : 'text-error-600'}`}>
                {balanceSheetData.netIncome >= 0 ? '+' : ''}₹{balanceSheetData.netIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {incomeLabel}: ₹{balanceSheetData.totalIncome.toLocaleString('en-IN')} - 
                Expenses: ₹{balanceSheetData.totalExpenses.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      </div>
    </DashboardLayout>
  );
}

