"use client";

import React, { useState, useEffect } from "react";
import { Plus, Check, X, Info, Eye, DollarSign, Filter, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { JointLiabilityService, Loan, Group } from "@/lib/joint-liability-service";
import { useToast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function JointLiabilityLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  // Form State
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [memberLimitInfo, setMemberLimitInfo] = useState<string>("");
  const [repayAmount, setRepayAmount] = useState("");

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning'
  });

  const { addToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedGroupId && selectedMemberId) {
        const group = groups.find(g => g.id === selectedGroupId);
        const member = group?.members.find(m => m.id === selectedMemberId);
        if (member && group) {
            // Calculate available credit based on total credit limit (proportional to deposit)
            // If credit has been distributed, use that; otherwise calculate proportional share
            const totalCreditLimit = group.maxCreditLimit;
            const memberProportionalLimit = group.totalDeposit > 0 
              ? (member.depositAmount / group.totalDeposit) * totalCreditLimit
              : 0;
            
            // Use distributed credit if available, otherwise use proportional
            const effectiveCreditLimit = member.availableCredit > 0 
              ? member.availableCredit 
              : memberProportionalLimit;
            
            const available = effectiveCreditLimit - member.currentLoanAmount;
            setMemberLimitInfo(`Available Limit: ₹${Math.max(0, available).toLocaleString()} (Total Limit: ₹${effectiveCreditLimit.toLocaleString()}, Used: ₹${member.currentLoanAmount.toLocaleString()})`);
        }
    } else {
        setMemberLimitInfo("");
    }
  }, [selectedGroupId, selectedMemberId, groups]);

  const loadData = () => {
    setLoading(true);
    try {
      setLoans(JointLiabilityService.getLoans());
      setGroups(JointLiabilityService.getGroups());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getMemberOptions = () => {
    if (!selectedGroupId) return [];
    const group = groups.find(g => g.id === selectedGroupId);
    if (!group) return [];
    return group.members.map(m => {
      // Calculate available credit based on total credit limit (proportional to deposit)
      const totalCreditLimit = group.maxCreditLimit;
      const memberProportionalLimit = group.totalDeposit > 0 
        ? (m.depositAmount / group.totalDeposit) * totalCreditLimit
        : 0;
      
      // Use distributed credit if available, otherwise use proportional
      const effectiveCreditLimit = m.availableCredit > 0 
        ? m.availableCredit 
        : memberProportionalLimit;
      
      const available = effectiveCreditLimit - m.currentLoanAmount;
      return {
        value: m.id,
        label: `${m.name} (Available: ₹${Math.max(0, available).toLocaleString()})`
      };
    });
  };


  const handleApply = () => {
    if (!selectedGroupId || !selectedMemberId || !loanAmount || !loanPurpose) {
      addToast({ type: 'error', message: 'Please fill all fields' });
      return;
    }

    const amount = parseFloat(loanAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast({ type: 'error', message: 'Please enter a valid loan amount' });
      return;
    }

    try {
      JointLiabilityService.applyForLoan(
        selectedGroupId,
        selectedMemberId,
        amount,
        loanPurpose
      );
      setIsApplyModalOpen(false);
      resetForm();
      loadData();
      addToast({ type: 'success', message: 'Loan application submitted successfully!' });
    } catch (error: any) {
      addToast({ type: 'error', message: error.message });
    }
  };

  const resetForm = () => {
    setSelectedGroupId("");
    setSelectedMemberId("");
    setLoanAmount("");
    setLoanPurpose("");
  };

  const handleStatusChange = (loan: Loan, newStatus: Loan['status']) => {
    setConfirmDialog({
      isOpen: true,
      title: `${newStatus === 'approved' ? 'Approve' : 'Reject'} Loan`,
      message: `Are you sure you want to ${newStatus === 'approved' ? 'approve' : 'reject'} this loan of ₹${loan.amount.toLocaleString()}?`,
      variant: newStatus === 'approved' ? 'info' : 'warning',
      onConfirm: () => {
        try {
          JointLiabilityService.updateLoanStatus(loan.id, newStatus);
          loadData();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          addToast({ type: 'success', message: `Loan ${newStatus} successfully!` });
        } catch (error: any) {
          addToast({ type: 'error', message: error.message });
        }
      }
    });
  };

  const handleRepay = () => {
    if (!selectedLoan) return;
    
    const amount = parseFloat(repayAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast({ type: 'error', message: 'Please enter a valid repayment amount' });
      return;
    }

    try {
      JointLiabilityService.repayLoan(selectedLoan.id, amount);
      setIsRepayModalOpen(false);
      setRepayAmount("");
      setSelectedLoan(null);
      loadData();
      addToast({ type: 'success', message: 'Loan repayment recorded successfully!' });
    } catch (error: any) {
      addToast({ type: 'error', message: error.message });
    }
  };

  const openRepayModal = (loan: Loan) => {
    const group = groups.find(g => g.id === loan.groupId);
    const member = group?.members.find(m => m.id === loan.memberId);
    if (member) {
      setRepayAmount(Math.min(member.currentLoanAmount, loan.amount).toString());
    }
    setSelectedLoan(loan);
    setIsRepayModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success" size="sm">Approved</Badge>;
      case 'rejected': return <Badge variant="error" size="sm">Rejected</Badge>;
      case 'repaid': return <Badge variant="primary" size="sm">Repaid</Badge>;
      default: return <Badge variant="warning" size="sm">Pending</Badge>;
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    const matchesGroup = groupFilter === "all" || loan.groupId === groupFilter;

    return matchesSearch && matchesStatus && matchesGroup;
  });

  const stats = {
    total: loans.length,
    pending: loans.filter(l => l.status === 'pending').length,
    approved: loans.filter(l => l.status === 'approved').length,
    totalAmount: loans.reduce((sum, l) => sum + l.amount, 0),
    approvedAmount: loans.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.amount, 0)
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Joint Liability Loans</h1>
            <p className="text-neutral-500">Apply for loans and manage approvals.</p>
          </div>
          <Button onClick={() => setIsApplyModalOpen(true)} icon={<Plus className="h-4 w-4" />}>
            Apply for Loan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card padding="sm" className="bg-neutral-50 border-neutral-100">
            <div className="text-sm text-neutral-600 font-medium">Total Loans</div>
            <div className="text-2xl font-bold text-neutral-900">{stats.total}</div>
          </Card>
          <Card padding="sm" className="bg-yellow-50 border-yellow-100">
            <div className="text-sm text-yellow-700 font-medium">Pending</div>
            <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
          </Card>
          <Card padding="sm" className="bg-green-50 border-green-100">
            <div className="text-sm text-green-700 font-medium">Approved</div>
            <div className="text-2xl font-bold text-green-900">{stats.approved}</div>
          </Card>
          <Card padding="sm" className="bg-primary-50 border-primary-100">
            <div className="text-sm text-primary-700 font-medium">Total Amount</div>
            <div className="text-2xl font-bold text-primary-900">₹{stats.totalAmount.toLocaleString()}</div>
          </Card>
          <Card padding="sm" className="bg-purple-50 border-purple-100">
            <div className="text-sm text-purple-700 font-medium">Approved Amount</div>
            <div className="text-2xl font-bold text-purple-900">₹{stats.approvedAmount.toLocaleString()}</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search loans by member, group, or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
              { value: "repaid", label: "Repaid" }
            ]}
            className="w-48"
          />
          <Select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            options={[
              { value: "all", label: "All Groups" },
              ...groups.map(g => ({ value: g.id, label: g.name }))
            ]}
            className="w-48"
          />
        </div>

        <Table
          data={filteredLoans}
          loading={loading}
          emptyMessage="No loans found."
          columns={[
            { key: "groupName", header: "Group Name", sortable: true },
            { key: "memberName", header: "Member Name", sortable: true },
            { 
              key: "amount", 
              header: "Amount", 
              render: (val: number) => `₹${val.toLocaleString()}`
            },
            { key: "purpose", header: "Purpose" },
            { 
              key: "appliedDate", 
              header: "Applied Date", 
              render: (date: string) => new Date(date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            },
            { 
              key: "status", 
              header: "Status", 
              render: (status: string) => getStatusBadge(status)
            },
            {
              key: "actions",
              header: "Actions",
              render: (_, loan) => (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLoan(loan);
                      setIsDetailsModalOpen(true);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  {loan.status === 'pending' && (
                    <>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 border-none text-white"
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(loan, 'approved'); }}
                      >
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(loan, 'rejected'); }}
                      >
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {loan.status === 'approved' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRepayModal(loan);
                      }}
                    >
                      <DollarSign className="h-3 w-3 mr-1" /> Repay
                    </Button>
                  )}
                </div>
              )
            }
          ]}
        />

        {/* Apply Loan Modal */}
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title="Apply for Joint Liability Loan"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
              <Button onClick={handleApply}>Submit Application</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Select
              label="Select Group"
              placeholder="Choose a group"
              options={groups.map(g => ({ value: g.id, label: g.name }))}
              value={selectedGroupId}
              onChange={(e) => {
                setSelectedGroupId(e.target.value);
                setSelectedMemberId("");
              }}
              required
            />

            <Select
              label="Select Member"
              placeholder="Choose a member"
              disabled={!selectedGroupId}
              options={getMemberOptions()}
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              required
            />
            
            {memberLimitInfo && (
                <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{memberLimitInfo}</p>
                </div>
            )}

            <Input
              label="Loan Amount (₹)"
              type="number"
              placeholder="Enter amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              min="1"
              step="0.01"
              required
            />

            <Input
              label="Purpose"
              placeholder="Reason for loan"
              value={loanPurpose}
              onChange={(e) => setLoanPurpose(e.target.value)}
              required
            />
          </div>
        </Modal>

        {/* Loan Details Modal */}
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title="Loan Details"
          size="md"
        >
          {selectedLoan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-600">Group</label>
                  <p className="text-neutral-900 font-medium">{selectedLoan.groupName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Member</label>
                  <p className="text-neutral-900 font-medium">{selectedLoan.memberName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Amount</label>
                  <p className="text-neutral-900 font-medium">₹{selectedLoan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedLoan.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Applied Date</label>
                  <p className="text-neutral-900">{new Date(selectedLoan.appliedDate).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Purpose</label>
                  <p className="text-neutral-900">{selectedLoan.purpose}</p>
                </div>
              </div>
              {selectedLoan.status === 'approved' && (
                <div className="bg-orange-50 p-3 rounded-md">
                  <p className="text-sm text-orange-700">
                    This loan is approved and active. Use the Repay button to record repayments.
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Repay Loan Modal */}
        <Modal
          isOpen={isRepayModalOpen}
          onClose={() => {
            setIsRepayModalOpen(false);
            setSelectedLoan(null);
            setRepayAmount("");
          }}
          title="Repay Loan"
          footer={
            <>
              <Button variant="outline" onClick={() => {
                setIsRepayModalOpen(false);
                setSelectedLoan(null);
                setRepayAmount("");
              }}>Cancel</Button>
              <Button onClick={handleRepay}>Record Repayment</Button>
            </>
          }
        >
          {selectedLoan && (
            <div className="space-y-4">
              <div className="bg-neutral-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600">Member:</span>
                    <p className="font-medium text-neutral-900">{selectedLoan.memberName}</p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Loan Amount:</span>
                    <p className="font-medium text-neutral-900">₹{selectedLoan.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              {(() => {
                const group = groups.find(g => g.id === selectedLoan.groupId);
                const member = group?.members.find(m => m.id === selectedLoan.memberId);
                const currentLoan = member?.currentLoanAmount || 0;
                return (
                  <>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-blue-700">
                        Current Outstanding: <span className="font-bold">₹{currentLoan.toLocaleString()}</span>
                      </p>
                    </div>
                    <Input
                      label="Repayment Amount (₹)"
                      type="number"
                      placeholder="Enter repayment amount"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
                      min="1"
                      max={currentLoan.toString()}
                      step="0.01"
                      required
                    />
                  </>
                );
              })()}
            </div>
          )}
        </Modal>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          variant={confirmDialog.variant}
          confirmText="Confirm"
          cancelText="Cancel"
        />
      </div>
    </DashboardLayout>
  );
}
