"use client";

import React, { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet, RefreshCcw, Filter, Search, Download, ArrowDownCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJointLiabilityTransactions } from "@/hooks/useJointLiabilityTransactions";
import type { Transaction, Group } from "@/services/joint-liability";
import { useToast } from "@/components/ui/Toast";

export default function JointLiabilityTransactionsPage() {
  const {
    groups,
    transactions,
    loading,
    refetch,
    addDepositToMember,
  } = useJointLiabilityTransactions();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  
  // Deposit Form State
  const [depositMemberId, setDepositMemberId] = useState("");
  const [depositGroupId, setDepositGroupId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);

  const { addToast } = useToast();

  // Get all unique members across all groups for deposit
  const getAllMembers = () => {
    const memberMap = new Map<string, { id: string; name: string; groups: Group[] }>();
    
    groups.forEach(group => {
      group.members.forEach(member => {
        if (!memberMap.has(member.id)) {
          memberMap.set(member.id, {
            id: member.id,
            name: member.name,
            groups: []
          });
        }
        const memberData = memberMap.get(member.id)!;
        memberData.groups.push(group);
      });
    });

    return Array.from(memberMap.values());
  };

  const handleMemberSelectForDeposit = (memberId: string) => {
    setDepositMemberId(memberId);
    const allMembers = getAllMembers();
    const selectedMember = allMembers.find(m => m.id === memberId);
    if (selectedMember) {
      setAvailableGroups(selectedMember.groups);
      // Auto-select first group if only one
      if (selectedMember.groups.length === 1) {
        setDepositGroupId(selectedMember.groups[0].id);
      } else {
        setDepositGroupId("");
      }
    } else {
      setAvailableGroups([]);
      setDepositGroupId("");
    }
  };

  const handleAddDeposit = async () => {
    if (!depositMemberId || !depositGroupId || !depositAmount) {
      addToast({ type: 'error', message: 'Please fill all fields' });
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast({ type: 'error', message: 'Please enter a valid deposit amount' });
      return;
    }

    try {
      await addDepositToMember(depositGroupId, depositMemberId, amount);
      setIsDepositModalOpen(false);
      setDepositMemberId("");
      setDepositGroupId("");
      setDepositAmount("");
      setAvailableGroups([]);
      await refetch();
      addToast({ type: 'success', message: 'Deposit added successfully!' });
    } catch (error: unknown) {
      addToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to add deposit' });
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'distribution': return <Wallet className="h-4 w-4 text-purple-600" />;
      case 'loan_disbursement': return <ArrowUpRight className="h-4 w-4 text-orange-600" />;
      case 'loan_repayment': return <RefreshCcw className="h-4 w-4 text-blue-600" />;
      default: return <Wallet className="h-4 w-4 text-neutral-600" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
        case 'deposit': return 'Deposit';
        case 'distribution': return 'Credit Distribution';
        case 'loan_disbursement': return 'Loan Disbursement';
        case 'loan_repayment': return 'Loan Repayment';
        default: return type;
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'deposit': return <Badge variant="success" size="sm">Deposit</Badge>;
      case 'distribution': return <Badge variant="primary" size="sm">Distribution</Badge>;
      case 'loan_disbursement': return <Badge variant="warning" size="sm">Disbursement</Badge>;
      case 'loan_repayment': return <Badge variant="primary" size="sm">Repayment</Badge>;
      default: return <Badge variant="neutral" size="sm">{type}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      (tx.memberName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    const matchesGroup = groupFilter === "all" || tx.groupId === groupFilter;
    
    const matchesDate = (() => {
      if (!dateFrom && !dateTo) return true;
      const txDate = new Date(tx.date);
      if (dateFrom && txDate < new Date(dateFrom)) return false;
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (txDate > toDate) return false;
      }
      return true;
    })();

    return matchesSearch && matchesType && matchesGroup && matchesDate;
  });

  const stats = {
    total: transactions.length,
    deposits: transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
    distributions: transactions.filter(t => t.type === 'distribution').length,
    disbursements: transactions.filter(t => t.type === 'loan_disbursement').reduce((sum, t) => sum + t.amount, 0),
    repayments: transactions.filter(t => t.type === 'loan_repayment').reduce((sum, t) => sum + t.amount, 0)
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Type', 'Member', 'Amount', 'Description', 'Group'].join(','),
      ...filteredTransactions.map(tx => {
        const group = groups.find(g => g.id === tx.groupId);
        return [
          new Date(tx.date).toLocaleString(),
          getTransactionTypeLabel(tx.type),
          tx.memberName || 'N/A',
          tx.amount,
          tx.description,
          group?.name || 'N/A'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `joint-liability-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setGroupFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Joint Liability Transactions</h1>
            <p className="text-neutral-500">History of deposits, distributions, and loan activities.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsDepositModalOpen(true)} 
              variant="secondary"
              icon={<ArrowDownCircle className="h-4 w-4" />}
            >
              Add Deposit
            </Button>
            <Button onClick={handleExport} variant="secondary" icon={<Download className="h-4 w-4" />}>
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card padding="sm" className="bg-neutral-50 border-neutral-100">
            <div className="text-sm text-neutral-600 font-medium">Total Transactions</div>
            <div className="text-2xl font-bold text-neutral-900">{stats.total}</div>
          </Card>
          <Card padding="sm" className="bg-green-50 border-green-100">
            <div className="text-sm text-green-700 font-medium">Total Deposits</div>
            <div className="text-2xl font-bold text-green-900">₹{stats.deposits.toLocaleString()}</div>
          </Card>
          <Card padding="sm" className="bg-purple-50 border-purple-100">
            <div className="text-sm text-purple-700 font-medium">Distributions</div>
            <div className="text-2xl font-bold text-purple-900">{stats.distributions}</div>
          </Card>
          <Card padding="sm" className="bg-orange-50 border-orange-100">
            <div className="text-sm text-orange-700 font-medium">Loan Disbursements</div>
            <div className="text-2xl font-bold text-orange-900">₹{stats.disbursements.toLocaleString()}</div>
          </Card>
          <Card padding="sm" className="bg-blue-50 border-blue-100">
            <div className="text-sm text-blue-700 font-medium">Loan Repayments</div>
            <div className="text-2xl font-bold text-blue-900">₹{stats.repayments.toLocaleString()}</div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "deposit", label: "Deposits" },
                  { value: "distribution", label: "Distributions" },
                  { value: "loan_disbursement", label: "Loan Disbursements" },
                  { value: "loan_repayment", label: "Loan Repayments" }
                ]}
              />
              
              <Select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Groups" },
                  ...groups.map(g => ({ value: g.id, label: g.name }))
                ]}
              />
              
              <Input
                type="date"
                label="From Date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              
              <Input
                type="date"
                label="To Date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <div className="overflow-x-auto">
          <Table
            data={filteredTransactions}
          loading={loading}
          emptyMessage="No transactions recorded yet."
          columns={[
            { 
              key: "date", 
              header: "Date & Time", 
              render: (date: string) => (
                <div className="flex flex-col">
                  <span className="font-medium">{new Date(date).toLocaleDateString('en-IN')}</span>
                  <span className="text-xs text-neutral-500">{new Date(date).toLocaleTimeString('en-IN')}</span>
                </div>
              ),
              sortable: true
            },
            { 
              key: "type", 
              header: "Type", 
              render: (type: string) => (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-neutral-100 rounded-full">
                    {getTransactionIcon(type)}
                  </div>
                  {getTransactionBadge(type)}
                </div>
              )
            },
            { 
              key: "amount", 
              header: "Amount", 
              render: (val: number, row) => (
                <span className={
                  row.type === 'deposit' || row.type === 'loan_repayment' 
                  ? 'text-green-600 font-medium' 
                  : 'text-neutral-900 font-medium'
                }>
                  {row.type === 'deposit' || row.type === 'loan_repayment' ? '+' : '-'}
                  ₹{val.toLocaleString()}
                </span>
              )
            },
            { 
              key: "memberName", 
              header: "Member",
              render: (name: string) => name || <span className="text-neutral-400">N/A</span>
            },
            { 
              key: "description", 
              header: "Description",
              render: (desc: string) => (
                <span className="max-w-md truncate block" title={desc}>{desc}</span>
              )
            },
            {
              key: "group",
              header: "Group",
              render: (_, row: Transaction) => {
                const group = groups.find(g => g.id === row.groupId);
                return group ? group.name : <span className="text-neutral-400">N/A</span>;
              }
            }
          ]}
        />
        </div>

        {/* Add Deposit Modal */}
        <Modal
          isOpen={isDepositModalOpen}
          onClose={() => {
            setIsDepositModalOpen(false);
            setDepositMemberId("");
            setDepositGroupId("");
            setDepositAmount("");
            setAvailableGroups([]);
          }}
          title="Add Deposit"
          footer={
            <>
              <Button variant="outline" onClick={() => {
                setIsDepositModalOpen(false);
                setDepositMemberId("");
                setDepositGroupId("");
                setDepositAmount("");
                setAvailableGroups([]);
              }}>Cancel</Button>
              <Button onClick={handleAddDeposit}>Add Deposit</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Select
              label="Select Member"
              placeholder="Choose a member"
              options={getAllMembers().map(m => ({
                value: m.id,
                label: `${m.name} (${m.groups.length} group${m.groups.length > 1 ? 's' : ''})`
              }))}
              value={depositMemberId}
              onChange={(e) => handleMemberSelectForDeposit(e.target.value)}
              required
            />

            {depositMemberId && availableGroups.length > 0 && (
              <>
                <Select
                  label="Select Group"
                  placeholder="Choose a group"
                  options={availableGroups.map(g => ({
                    value: g.id,
                    label: `${g.name} (Current Deposit: ₹${g.members.find(m => m.id === depositMemberId)?.depositAmount.toLocaleString() || 0})`
                  }))}
                  value={depositGroupId}
                  onChange={(e) => setDepositGroupId(e.target.value)}
                  required
                />

                {depositGroupId && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>
                        <span className="font-medium">Member:</span> {getAllMembers().find(m => m.id === depositMemberId)?.name}
                      </p>
                      <p>
                        <span className="font-medium">Group:</span> {availableGroups.find(g => g.id === depositGroupId)?.name}
                      </p>
                      <p>
                        <span className="font-medium">Current Deposit:</span> ₹{
                          availableGroups
                            .find(g => g.id === depositGroupId)
                            ?.members.find(m => m.id === depositMemberId)
                            ?.depositAmount.toLocaleString() || 0
                        }
                      </p>
                    </div>
                  </div>
                )}

                <Input
                  label="Deposit Amount (₹)"
                  type="number"
                  placeholder="Enter deposit amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </>
            )}

            {depositMemberId && availableGroups.length === 0 && (
              <div className="bg-yellow-50 p-3 rounded-md">
                <p className="text-sm text-yellow-700">
                  This member is not part of any groups. Please add them to a group first.
                </p>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
