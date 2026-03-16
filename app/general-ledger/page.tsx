'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
import {
  Card,
  Button,
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
  RefreshCw,
  Loader2,
} from 'lucide-react';
import {
  ledgerService,
  LedgerAccount,
  JournalEntry,
  FinancialSummary,
  JournalEntryFilters,
} from '@/services/ledger.service';

export default function GeneralLedgerPage() {
  const { incomeLabel, feeIncomeLabel, netLabel } = useInterestProfitTerm();
  const displayAccountName = (accountName: string) =>
    accountName === 'Profit Income' ? incomeLabel : accountName === 'Profit Fee Income' ? feeIncomeLabel : accountName;

  const [accounts, setAccounts] = useState<LedgerAccount[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<JournalEntryFilters>({
    dateFrom: '',
    dateTo: '',
    accountId: '',
    search: '',
  });

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await ledgerService.getAllAccounts({ status: 'active' });
      if (res.success && res.result?.accounts) {
        setAccounts(res.result.accounts);
      }
    } catch {
      // accounts fetch failure is non-critical for the page
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await ledgerService.getFinancialSummary();
      if (res.success && res.result) {
        setFinancialSummary(res.result);
      }
    } catch {
      // summary failure handled by error state
    }
  }, []);

  const fetchJournalEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ledgerService.getAllJournalEntries(filters);
      if (res.success && res.result?.journalEntries) {
        setJournalEntries(res.result.journalEntries);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAccounts();
    fetchSummary();
  }, [fetchAccounts, fetchSummary]);

  useEffect(() => {
    fetchJournalEntries();
  }, [fetchJournalEntries]);

  const tableData = useMemo(() => {
    const accountBalances: Record<string, number> = {};
    accounts.forEach(acc => {
      accountBalances[acc.accountId] = acc.balance;
    });

    const chronologicalEntries = [...journalEntries].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const lineBalanceMap = new Map<string, number>();
    const runningBalances: Record<string, number> = { ...accountBalances };

    chronologicalEntries.forEach(entry => {
      entry.entries.forEach((line, idx) => {
        const account = accounts.find(acc => acc.accountId === (line.accountName || ''));
        const accountType = account?.accountType || 'Asset';
        const lineKey = `${entry._id}-${idx}`;

        if (accountType === 'Asset' || accountType === 'Expense') {
          runningBalances[line.accountName || ''] = (runningBalances[line.accountName || ''] || 0) + (line.debit || 0) - (line.credit || 0);
        } else {
          runningBalances[line.accountName || ''] = (runningBalances[line.accountName || ''] || 0) + (line.credit || 0) - (line.debit || 0);
        }

        lineBalanceMap.set(lineKey, runningBalances[line.accountName || '']);
      });
    });

    const displayEntries = [...journalEntries].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const flattened: any[] = [];
    displayEntries.forEach(entry => {
      entry.entries.forEach((line, index) => {
        const lineKey = `${entry._id}-${index}`;
        flattened.push({
          id: lineKey,
          transactionId: index === 0 ? entry.transactionId : '',
          date: index === 0 ? entry.date : '',
          description: index === 0 ? entry.description : '',
          accountId: line.accountName || '',
          accountName: line.accountName || '',
          debit: line.debit || 0,
          credit: line.credit || 0,
          balance: lineBalanceMap.get(lineKey) || 0,
          isMainEntry: line.isMainEntry,
          transactionGroup: entry._id,
          isSubEntry: !line.isMainEntry,
        });
      });
    });
    return flattened;
  }, [journalEntries, accounts]);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
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
                <p className="text-sm text-purple-700 mb-1 font-medium">{netLabel} (P&L)</p>
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
          {accounts.length === 0 ? (
            <p className="text-sm text-neutral-500">No accounts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {accounts.map((account) => (
                <Card key={account._id} className="p-5 bg-white border border-neutral-200">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-1 h-16 rounded-full"
                      style={{ backgroundColor: account.color || '#3B82F6' }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-900">
                        Account {account.accountId} - {displayAccountName(account.accountName)}
                      </p>
                      <p className="text-xl font-bold text-neutral-900 mt-1">
                        ₹{account.balance.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {account.description || ''}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
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
              value={filters.dateFrom || ''}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
            <Input
              type="date"
              label="Date To"
              value={filters.dateTo || ''}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
            <Select
              label="Account"
              placeholder="All Accounts"
              value={filters.accountId || ''}
              onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
              options={[
                { value: '', label: 'All Accounts' },
                ...accounts.map((acc) => ({
                  value: acc.accountName,
                  label: `${acc.accountId} - ${displayAccountName(acc.accountName)}`,
                })),
              ]}
            />
            <Input
              label="Search"
              placeholder="Search transactions..."
              value={filters.search || ''}
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

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-3 text-neutral-600">Loading journal entries...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchJournalEntries}>
                Retry
              </Button>
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-neutral-500">No journal entries found.</p>
            </div>
          ) : (
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
                              <span className="text-sm text-neutral-400">&nbsp;&nbsp;└─</span>
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
                                  dayLabel = 'Yesterday';
                                } else {
                                  dayLabel = dateObj.toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  });
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
                              {displayAccountName(row.accountName)} ({row.accountId})
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
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
