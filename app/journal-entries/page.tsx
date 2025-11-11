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
  Modal,
  Textarea,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  X,
  Save,
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar,
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
    accountName: 'Interest Income',
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

// Initial Journal Entries (sample data)
const initialJournalEntries: JournalEntry[] = [
  {
    id: 'je-1',
    transactionId: 'T1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
];

export default function JournalEntriesPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    accountId: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    entries: [
      { id: 'line-1', accountId: '', accountName: '', debit: 0, credit: 0, isMainEntry: true },
      { id: 'line-2', accountId: '', accountName: '', debit: 0, credit: 0, isMainEntry: false },
    ],
  });

  // Filter journal entries
  const filteredEntries = useMemo(() => {
    return journalEntries.filter(entry => {
      const matchesSearch = 
        entry.transactionId.toLowerCase().includes(filters.search.toLowerCase()) ||
        entry.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesDateFrom = !filters.dateFrom || new Date(entry.date) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || new Date(entry.date) <= new Date(filters.dateTo);
      
      const matchesAccount = !filters.accountId || 
        entry.entries.some(e => e.accountId === filters.accountId);

      return matchesSearch && matchesDateFrom && matchesDateTo && matchesAccount;
    });
  }, [journalEntries, filters]);

  // Statistics
  const stats = useMemo(() => {
    const totalEntries = journalEntries.length;
    const totalDebits = journalEntries.reduce((sum, entry) => 
      sum + entry.entries.reduce((s, e) => s + e.debit, 0), 0
    );
    const totalCredits = journalEntries.reduce((sum, entry) => 
      sum + entry.entries.reduce((s, e) => s + e.credit, 0), 0
    );
    
    return { totalEntries, totalDebits, totalCredits };
  }, [journalEntries]);

  // Validate entry (debits must equal credits)
  const validateEntry = (entries: JournalEntryLine[]): { isValid: boolean; error?: string } => {
    const totalDebits = entries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredits = entries.reduce((sum, e) => sum + e.credit, 0);
    
    if (entries.length < 2) {
      return { isValid: false, error: 'At least 2 entry lines are required' };
    }
    
    if (entries.some(e => !e.accountId)) {
      return { isValid: false, error: 'All accounts must be selected' };
    }
    
    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      return { isValid: false, error: `Debits (₹${totalDebits.toFixed(2)}) must equal Credits (₹${totalCredits.toFixed(2)})` };
    }
    
    return { isValid: true };
  };

  // Handle Add Entry
  const handleAddEntry = () => {
    const validation = validateEntry(formData.entries || []);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const newEntry: JournalEntry = {
      id: `je-${Date.now()}`,
      transactionId: formData.transactionId || `T${journalEntries.length + 1}`,
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      description: formData.description || '',
      entries: (formData.entries || []).map((line, index) => {
        const account = chartOfAccounts.find(acc => acc.accountId === line.accountId);
        return {
          id: `line-${index + 1}`,
          accountId: line.accountId,
          accountName: account?.accountName || '',
          debit: line.debit || 0,
          credit: line.credit || 0,
          isMainEntry: index === 0,
        };
      }),
    };
    
    setJournalEntries([newEntry, ...journalEntries]);
    setShowAddModal(false);
    resetForm();
  };

  // Handle Edit Entry
  const handleEditEntry = () => {
    if (!selectedEntry) return;
    
    const validation = validateEntry(formData.entries || []);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const updatedEntry: JournalEntry = {
      ...selectedEntry,
      transactionId: formData.transactionId || selectedEntry.transactionId,
      date: formData.date ? new Date(formData.date).toISOString() : selectedEntry.date,
      description: formData.description || selectedEntry.description,
      entries: (formData.entries || []).map((line, index) => {
        const account = chartOfAccounts.find(acc => acc.accountId === line.accountId);
        return {
          id: line.id || `line-${index + 1}`,
          accountId: line.accountId,
          accountName: account?.accountName || '',
          debit: line.debit || 0,
          credit: line.credit || 0,
          isMainEntry: index === 0,
        };
      }),
    };
    
    setJournalEntries(journalEntries.map(entry => 
      entry.id === selectedEntry.id ? updatedEntry : entry
    ));
    setShowEditModal(false);
    setSelectedEntry(null);
    resetForm();
  };

  // Handle Delete Entry
  const handleDeleteEntry = () => {
    if (!selectedEntry) return;
    
    setJournalEntries(journalEntries.filter(entry => entry.id !== selectedEntry.id));
    setShowDeleteModal(false);
    setSelectedEntry(null);
  };

  // Open Edit Modal
  const openEditModal = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setFormData({
      transactionId: entry.transactionId,
      date: entry.date.split('T')[0],
      description: entry.description,
      entries: entry.entries.map(e => ({ ...e })),
    });
    setShowEditModal(true);
  };

  // Open View Modal
  const openViewModal = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowViewModal(true);
  };

  // Open Delete Modal
  const openDeleteModal = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowDeleteModal(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      transactionId: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      entries: [
        { id: 'line-1', accountId: '', accountName: '', debit: 0, credit: 0, isMainEntry: true },
        { id: 'line-2', accountId: '', accountName: '', debit: 0, credit: 0, isMainEntry: false },
      ],
    });
  };

  // Add Entry Line
  const addEntryLine = () => {
    setFormData({
      ...formData,
      entries: [
        ...(formData.entries || []),
        { id: `line-${Date.now()}`, accountId: '', accountName: '', debit: 0, credit: 0, isMainEntry: false },
      ],
    });
  };

  // Remove Entry Line
  const removeEntryLine = (lineId: string) => {
    setFormData({
      ...formData,
      entries: (formData.entries || []).filter(line => line.id !== lineId),
    });
  };

  // Update Entry Line
  const updateEntryLine = (lineId: string, field: keyof JournalEntryLine, value: any) => {
    setFormData({
      ...formData,
      entries: (formData.entries || []).map(line => {
        if (line.id === lineId) {
          const updated = { ...line, [field]: value };
          if (field === 'accountId') {
            const account = chartOfAccounts.find(acc => acc.accountId === value);
            updated.accountName = account?.accountName || '';
          }
          return updated;
        }
        return line;
      }),
    });
  };

  // Calculate totals for current form
  const formTotals = useMemo(() => {
    const entries = formData.entries || [];
    const totalDebits = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
    const totalCredits = entries.reduce((sum, e) => sum + (e.credit || 0), 0);
    return { totalDebits, totalCredits, isBalanced: Math.abs(totalDebits - totalCredits) < 0.01 };
  }, [formData.entries]);

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
                { label: 'Journal Entries' },
              ]}
            />
            <h1 className="text-3xl font-bold text-neutral-900 mt-2">
              Journal Entries
            </h1>
            <p className="text-neutral-600 mt-1">
              Create and manage double-entry journal entries
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1 font-medium">Total Entries</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.totalEntries}
                </p>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1 font-medium">Total Debits</p>
                <p className="text-2xl font-bold text-green-900">
                  ₹{stats.totalDebits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 mb-1 font-medium">Total Credits</p>
                <p className="text-2xl font-bold text-orange-900">
                  ₹{stats.totalCredits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-orange-200 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-semibold text-neutral-700">Filters:</span>
            </div>
            <Input
              label=""
              placeholder="Search entries..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              leftIcon={<Search className="h-4 w-4" />}
              className="flex-1 min-w-[200px]"
            />
            <Input
              type="date"
              label=""
              placeholder="Date From"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="min-w-[150px]"
            />
            <Input
              type="date"
              label=""
              placeholder="Date To"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="min-w-[150px]"
            />
            <Select
              label=""
              placeholder="All Accounts"
              value={filters.accountId}
              onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
              options={[
                { value: '', label: 'All Accounts' },
                ...chartOfAccounts.map(acc => ({
                  value: acc.accountId,
                  label: `${acc.accountId} - ${acc.accountName}`,
                })),
              ]}
              className="min-w-[200px]"
            />
            {(filters.search || filters.dateFrom || filters.dateTo || filters.accountId) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ search: '', dateFrom: '', dateTo: '', accountId: '' })}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </Card>

        {/* Journal Entries Table */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-border-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Accounts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Debits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <p className="text-sm text-neutral-500">
                        No journal entries found matching your filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => {
                    const totalDebits = entry.entries.reduce((sum, e) => sum + e.debit, 0);
                    const totalCredits = entry.entries.reduce((sum, e) => sum + e.credit, 0);
                    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;
                    const entryDate = new Date(entry.date);
                    const formattedDate = entryDate.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <tr key={entry.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-neutral-900">
                            {entry.transactionId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-neutral-400" />
                            <span className="text-sm text-neutral-700">{formattedDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-neutral-900">
                            {entry.description}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {entry.entries.slice(0, 2).map((line) => (
                              <span key={line.id} className="text-xs text-neutral-600">
                                {line.accountName} ({line.accountId})
                              </span>
                            ))}
                            {entry.entries.length > 2 && (
                              <span className="text-xs text-neutral-400">
                                +{entry.entries.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-semibold text-green-700">
                            ₹{totalDebits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-semibold text-orange-700">
                            ₹{totalCredits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isBalanced ? (
                            <Badge variant="success" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Balanced
                            </Badge>
                          ) : (
                            <Badge variant="error" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Unbalanced
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openViewModal(entry)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(entry)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Entry"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(entry)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Entry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add/Edit Entry Modal */}
        {(showAddModal || showEditModal) && (
          <Modal
            isOpen={showAddModal || showEditModal}
            onClose={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setSelectedEntry(null);
              resetForm();
            }}
            title={showAddModal ? 'Create Journal Entry' : 'Edit Journal Entry'}
            size="lg"
          >
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Transaction ID"
                  placeholder="e.g., T1"
                  value={formData.transactionId || ''}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                />
                <Input
                  type="date"
                  label="Date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <Textarea
                label="Description"
                placeholder="Enter transaction description..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                required
              />
              
              <div className="border-t border-border-light pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Entry Lines</h3>
                  <Button variant="outline" size="sm" onClick={addEntryLine}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Line
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {(formData.entries || []).map((line, index) => (
                    <div key={line.id} className="p-4 bg-neutral-50 rounded-lg border border-border-light">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-neutral-600">
                          Line {index + 1} {line.isMainEntry && '(Main Entry)'}
                        </span>
                        {(formData.entries || []).length > 2 && (
                          <button
                            onClick={() => removeEntryLine(line.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <Select
                          label="Account"
                          value={line.accountId}
                          onChange={(e) => updateEntryLine(line.id, 'accountId', e.target.value)}
                          options={[
                            { value: '', label: 'Select Account' },
                            ...chartOfAccounts.map(acc => ({
                              value: acc.accountId,
                              label: `${acc.accountId} - ${acc.accountName}`,
                            })),
                          ]}
                          className="col-span-2"
                          required
                        />
                        <Input
                          type="number"
                          label="Debit"
                          placeholder="0.00"
                          value={line.debit || 0}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            updateEntryLine(line.id, 'debit', value);
                            updateEntryLine(line.id, 'credit', 0);
                          }}
                          min="0"
                          step="0.01"
                        />
                        <Input
                          type="number"
                          label="Credit"
                          placeholder="0.00"
                          value={line.credit || 0}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            updateEntryLine(line.id, 'credit', value);
                            updateEntryLine(line.id, 'debit', 0);
                          }}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-4 p-4 bg-neutral-100 rounded-lg border-2 border-neutral-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Total Debits</p>
                        <p className="text-sm font-mono font-semibold text-green-700">
                          ₹{formTotals.totalDebits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Total Credits</p>
                        <p className="text-sm font-mono font-semibold text-orange-700">
                          ₹{formTotals.totalCredits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {formTotals.isBalanced ? (
                        <Badge variant="success" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Balanced
                        </Badge>
                      ) : (
                        <Badge variant="error" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Difference: ₹{Math.abs(formTotals.totalDebits - formTotals.totalCredits).toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedEntry(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={showAddModal ? handleAddEntry : handleEditEntry}
                  disabled={!formTotals.isBalanced}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {showAddModal ? 'Create Entry' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* View Entry Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedEntry(null);
          }}
          title="Journal Entry Details"
          size="lg"
        >
          {selectedEntry && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border-light">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Transaction ID</p>
                  <p className="text-sm font-mono font-semibold text-neutral-900">
                    {selectedEntry.transactionId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Date</p>
                  <p className="text-sm text-neutral-900">
                    {new Date(selectedEntry.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-neutral-500 mb-1">Description</p>
                  <p className="text-sm text-neutral-900">{selectedEntry.description}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Entry Lines</h3>
                <div className="space-y-2">
                  {selectedEntry.entries.map((line) => (
                    <div key={line.id} className="p-3 bg-neutral-50 rounded-lg border border-border-light">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">
                            {line.accountName} ({line.accountId})
                          </p>
                          {line.isMainEntry && (
                            <Badge variant="neutral" className="text-xs mt-1">
                              Main Entry
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-neutral-500">Debit</p>
                            <p className="text-sm font-mono font-semibold text-green-700">
                              {line.debit > 0 ? `₹${line.debit.toFixed(2)}` : '-'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-neutral-500">Credit</p>
                            <p className="text-sm font-mono font-semibold text-orange-700">
                              {line.credit > 0 ? `₹${line.credit.toFixed(2)}` : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-light">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Total Debits</p>
                      <p className="text-lg font-mono font-bold text-green-700">
                        ₹{selectedEntry.entries.reduce((sum, e) => sum + e.debit, 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Total Credits</p>
                      <p className="text-lg font-mono font-bold text-orange-700">
                        ₹{selectedEntry.entries.reduce((sum, e) => sum + e.credit, 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  {Math.abs(
                    selectedEntry.entries.reduce((sum, e) => sum + e.debit, 0) -
                    selectedEntry.entries.reduce((sum, e) => sum + e.credit, 0)
                  ) < 0.01 ? (
                    <Badge variant="success">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Balanced
                    </Badge>
                  ) : (
                    <Badge variant="error">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Unbalanced
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedEntry(null);
          }}
          title="Delete Journal Entry"
          size="sm"
        >
          {selectedEntry && (
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Are you sure you want to delete this entry?
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-medium text-neutral-900">
                  {selectedEntry.transactionId}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {selectedEntry.description}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Date: {new Date(selectedEntry.date).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedEntry(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteEntry}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Entry
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}

