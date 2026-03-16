'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
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
  Wallet,
  Building2,
  Coins,
  Loader2,
} from 'lucide-react';
import {
  ledgerService,
  LedgerAccount,
  LedgerAccountFilters,
  AccountType,
} from '@/services/ledger.service';

interface ChartOfAccount {
  id: string;
  accountId: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
  description: string;
  color: string;
  isActive?: boolean;
}

const accountTypeColors: Record<string, string> = {
  Asset: 'bg-blue-100 text-blue-700 border-blue-200',
  Liability: 'bg-pink-100 text-pink-700 border-pink-200',
  Equity: 'bg-purple-100 text-purple-700 border-purple-200',
  Income: 'bg-green-100 text-green-700 border-green-200',
  Expense: 'bg-red-100 text-red-700 border-red-200',
};

const mapToLocal = (acc: LedgerAccount): ChartOfAccount => ({
  id: acc._id,
  accountId: acc.accountId,
  accountName: acc.accountName,
  accountType: acc.accountType,
  balance: acc.balance,
  description: acc.description || '',
  color: acc.color || '#3B82F6',
  isActive: acc.isActive,
});

export default function AccountManagementPage() {
  const { incomeLabel, feeIncomeLabel, revenueEarnedDescription } = useInterestProfitTerm();
  const displayAccountName = (accountName: string) =>
    accountName === 'Profit Income' ? incomeLabel : accountName === 'Profit Fee Income' ? feeIncomeLabel : accountName;

  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState<LedgerAccountFilters>({
    search: '',
    accountType: '',
    status: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null);
  const [formData, setFormData] = useState<Partial<ChartOfAccount>>({
    accountId: '',
    accountName: '',
    accountType: 'Asset',
    description: '',
    color: '#3B82F6',
    balance: 0,
    isActive: true,
  });

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ledgerService.getAllAccounts(filters);
      if (res.success && res.result?.accounts) {
        setAccounts(res.result.accounts.map(mapToLocal));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const stats = useMemo(() => {
    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter(acc => acc.isActive).length;
    const totalBalance = accounts
      .filter(acc => acc.accountType === 'Asset' || acc.accountType === 'Liability' || acc.accountType === 'Equity')
      .reduce((sum, acc) => sum + acc.balance, 0);
    return { totalAccounts, activeAccounts, totalBalance };
  }, [accounts]);

  const handleAddAccount = async () => {
    try {
      setSaving(true);
      await ledgerService.createAccount({
        accountId: formData.accountId || '',
        accountName: formData.accountName || '',
        accountType: (formData.accountType as AccountType) || 'Asset',
        description: formData.description || '',
        color: formData.color || '#3B82F6',
        balance: formData.balance || 0,
        isActive: formData.isActive ?? true,
      });
      setShowAddModal(false);
      resetForm();
      await fetchAccounts();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create account');
    } finally {
      setSaving(false);
    }
  };

  const handleEditAccount = async () => {
    if (!selectedAccount) return;
    try {
      setSaving(true);
      await ledgerService.updateAccount(selectedAccount.id, {
        accountId: formData.accountId,
        accountName: formData.accountName,
        accountType: formData.accountType as AccountType,
        description: formData.description,
        color: formData.color,
        balance: formData.balance,
        isActive: formData.isActive,
      });
      setShowEditModal(false);
      setSelectedAccount(null);
      resetForm();
      await fetchAccounts();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update account');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    try {
      setSaving(true);
      await ledgerService.deleteAccount(selectedAccount.id);
      setShowDeleteModal(false);
      setSelectedAccount(null);
      await fetchAccounts();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete account');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (account: ChartOfAccount) => {
    setSelectedAccount(account);
    setFormData({
      accountId: account.accountId,
      accountName: account.accountName,
      accountType: account.accountType,
      description: account.description,
      color: account.color,
      balance: account.balance,
      isActive: account.isActive,
    });
    setShowEditModal(true);
  };

  const openViewModal = (account: ChartOfAccount) => {
    setSelectedAccount(account);
    setShowViewModal(true);
  };

  const openDeleteModal = (account: ChartOfAccount) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      accountId: '',
      accountName: '',
      accountType: 'Asset',
      description: '',
      color: '#3B82F6',
      balance: 0,
      isActive: true,
    });
  };

  const handleToggleStatus = async (account: ChartOfAccount) => {
    try {
      await ledgerService.toggleAccountStatus(account.id);
      await fetchAccounts();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to toggle status');
    }
  };

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
                { label: 'Ledger Management' },
              ]}
            />
            <h1 className="text-3xl font-bold text-neutral-900 mt-2">
              Ledger Management
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage Chart of Ledger Accounts
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
              Add Ledger Account
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1 font-medium">Total Ledgers</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.totalAccounts}
                </p>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1 font-medium">Active Ledgers</p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.activeAccounts}
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1 font-medium">Total Balance</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{stats.totalBalance.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-purple-200 p-3 rounded-lg">
                <Coins className="h-6 w-6 text-purple-700" />
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
              placeholder="Search accounts..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              leftIcon={<Search className="h-4 w-4" />}
              className="flex-1 min-w-[200px]"
            />
            <Select
              label=""
              placeholder="All Types"
              value={filters.accountType || ''}
              onChange={(e) => setFilters({ ...filters, accountType: e.target.value })}
              options={[
                { value: '', label: 'All Types' },
                { value: 'Asset', label: 'Asset' },
                { value: 'Liability', label: 'Liability' },
                { value: 'Equity', label: 'Equity' },
                { value: 'Income', label: 'Income' },
                { value: 'Expense', label: 'Expense' },
              ]}
              className="min-w-[150px]"
            />
            <Select
              label=""
              placeholder="All Status"
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              className="min-w-[150px]"
            />
            {(filters.search || filters.accountType || filters.status) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ search: '', accountType: '', status: '' })}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </Card>

        {/* Accounts Table */}
        <Card className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-3 text-neutral-600">Loading accounts...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchAccounts}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-border-light">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Ledger ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Ledger Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Balance
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
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <p className="text-sm text-neutral-500">
                          No ledger accounts found matching your filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-neutral-900">
                            {account.accountId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: account.color }}
                            />
                            <span className="text-sm font-medium text-neutral-900">
                              {displayAccountName(account.accountName)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="neutral"
                            className={cn('text-xs', accountTypeColors[account.accountType])}
                          >
                            {account.accountType}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-semibold text-neutral-900">
                            ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(account)}
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                              account.isActive
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            )}
                          >
                            {account.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openViewModal(account)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(account)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Ledger Account"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(account)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Ledger Account"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Add Ledger Account Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
          title="Add New Ledger Account"
          size="md"
        >
          <div className="p-6 space-y-4">
            <Input
              label="Ledger Account ID"
              placeholder="e.g., 1020"
              value={formData.accountId || ''}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              required
            />
            <Input
              label="Ledger Account Name"
              placeholder="e.g., Bank Account"
              value={formData.accountName || ''}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              required
            />
            <Select
              label="Ledger Account Type"
              value={formData.accountType || 'Asset'}
              onChange={(e) => setFormData({ ...formData, accountType: e.target.value as any })}
              options={[
                { value: 'Asset', label: 'Asset' },
                { value: 'Liability', label: 'Liability' },
                { value: 'Equity', label: 'Equity' },
                { value: 'Income', label: 'Income' },
                { value: 'Expense', label: 'Expense' },
              ]}
              required
            />
            <Textarea
              label="Ledger Account Description"
              placeholder="Enter account description..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Ledger Account Opening Balance"
                placeholder="0.00"
                value={formData.balance || 0}
                onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color || '#3B82F6'}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border-light cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive ?? true}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm text-neutral-700">
                Account is Active
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddAccount} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Add Ledger Account
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Account Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAccount(null);
            resetForm();
          }}
          title="Edit Ledger Account"
          size="md"
        >
          <div className="p-6 space-y-4">
            <Input
              label="Ledger Account ID"
              value={formData.accountId || ''}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              required
            />
            <Input
              label="Ledger Account Name"
              value={formData.accountName || ''}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              required
            />
            <Select
              label="Ledger Account Type"
              value={formData.accountType || 'Asset'}
              onChange={(e) => setFormData({ ...formData, accountType: e.target.value as any })}
              options={[
                { value: 'Asset', label: 'Asset' },
                { value: 'Liability', label: 'Liability' },
                { value: 'Equity', label: 'Equity' },
                { value: 'Income', label: 'Income' },
                { value: 'Expense', label: 'Expense' },
              ]}
              required
            />
            <Textarea
              label="Ledger Account Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Ledger Account Balance"
                value={formData.balance || 0}
                onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color || '#3B82F6'}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border-light cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActiveEdit"
                checked={formData.isActive ?? true}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActiveEdit" className="text-sm text-neutral-700">
                Account is Active
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAccount(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditAccount} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>

        {/* View Account Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedAccount(null);
          }}
          title="Ledger Account Details"
          size="md"
        >
          {selectedAccount && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-border-light">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: selectedAccount.color + '20' }}
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: selectedAccount.color }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900">
                    {displayAccountName(selectedAccount.accountName)}
                  </h3>
                  <p className="text-sm text-neutral-500 font-mono">
                    Account ID: {selectedAccount.accountId}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Ledger Account Type</p>
                  <Badge
                    variant="neutral"
                    className={cn('text-xs', accountTypeColors[selectedAccount.accountType])}
                  >
                    {selectedAccount.accountType}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Status</p>
                  <span
                    className={cn(  
                      'px-3 py-1 rounded-full text-xs font-medium',
                      selectedAccount.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-neutral-100 text-neutral-600'
                    )}
                  >
                    {selectedAccount.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-neutral-500 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    ₹{selectedAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-neutral-500 mb-1">Description</p>
                  <p className="text-sm text-neutral-700">
                    {selectedAccount.accountId === '4000' ? revenueEarnedDescription : (selectedAccount.description || 'No description provided')}
                  </p>
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
            setSelectedAccount(null);
          }}
          title="Delete Account"
          size="sm"
        >
          {selectedAccount && (
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Are you sure you want to delete this account?
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-medium text-neutral-900">
                  {displayAccountName(selectedAccount.accountName)}
                </p>
                <p className="text-xs text-neutral-500 font-mono">
                  Account ID: {selectedAccount.accountId}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Balance: ₹{selectedAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedAccount(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteAccount} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
