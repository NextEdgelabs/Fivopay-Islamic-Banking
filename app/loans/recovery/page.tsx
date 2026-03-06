'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Table,
  Input,
  Select,
  Badge,
  Breadcrumbs,
  Modal,
  Skeleton,
} from '@/components/ui';
import {
  Search,
  AlertTriangle,
  Mail,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  TrendingUp,
  Download,
  Send,
  Calendar,
  User,
  Phone,
  MapPin,
} from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
import { Customer } from '@/services/customers.service';
import { useToast } from '@/components/ui/Toast';
import { exportToCSV } from '@/lib/utils';
import { NoticeType, RecoveryStatus, DeliveryMethod, RecoveryDue } from '@/types/recovery';

// Generate dummy recovery data
const generateRecoveryDues = (customers: Customer[]): RecoveryDue[] => {
  if (customers.length === 0) return [];

  const statuses = [
    RecoveryStatus.PENDING,
    RecoveryStatus.NOTICE_ISSUED,
    RecoveryStatus.NOTICE_APPROVED,
    RecoveryStatus.NOTICE_SENT,
    RecoveryStatus.PARTIAL_PAYMENT,
    RecoveryStatus.NPA,
  ];

  const noticeTypes = [
    NoticeType.FIRST_NOTICE,
    NoticeType.SECOND_REMINDER,
    NoticeType.LEGAL_NOTICE,
    NoticeType.NPA_CONVERSION,
  ];

  const deliveryMethods = [
    DeliveryMethod.EMAIL,
    DeliveryMethod.WHATSAPP,
    DeliveryMethod.PHYSICAL,
  ];

  const today = new Date();
  const recoveryDues: RecoveryDue[] = [];

  // Generate recovery dues for a subset of customers
  const customersToUse = customers.slice(0, Math.min(50, customers.length));

  customersToUse.forEach((customer, index) => {
    const daysOverdue = [5, 18, 35, 95, 185, 200][index % 6];
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() - daysOverdue);

    const principalAmount = 50000 + Math.random() * 200000;
    const interestAmount = principalAmount * 0.12 * (daysOverdue / 365);
    const monthsOverdue = Math.floor(daysOverdue / 30);
    const penaltyRate = 0.02; // 2% per month
    const penaltyAmount = principalAmount * penaltyRate * monthsOverdue;
    const totalDue = principalAmount + interestAmount + penaltyAmount;

    // Determine status and notice type based on days overdue
    let status = RecoveryStatus.PENDING;
    let noticeType: NoticeType | undefined;
    let isNPA = false;
    let npaDate: Date | undefined;

    if (daysOverdue >= 180) {
      status = RecoveryStatus.NPA;
      noticeType = NoticeType.NPA_CONVERSION;
      isNPA = true;
      npaDate = new Date(dueDate);
      npaDate.setDate(npaDate.getDate() + 180);
    } else if (daysOverdue >= 90) {
      status = RecoveryStatus.NOTICE_SENT;
      noticeType = NoticeType.LEGAL_NOTICE;
    } else if (daysOverdue >= 30) {
      status = RecoveryStatus.NOTICE_APPROVED;
      noticeType = NoticeType.SECOND_REMINDER;
    } else if (daysOverdue >= 15) {
      status = RecoveryStatus.NOTICE_ISSUED;
      noticeType = NoticeType.FIRST_NOTICE;
    }

    const noticeIssuedDate =
      daysOverdue >= 15
        ? new Date(dueDate.getTime() + 15 * 24 * 60 * 60 * 1000)
        : undefined;

    const noticeApprovedDate =
      daysOverdue >= 15 && status !== RecoveryStatus.PENDING
        ? new Date(noticeIssuedDate!.getTime() + 1 * 24 * 60 * 60 * 1000)
        : undefined;

    const noticeSentDate =
      status === RecoveryStatus.NOTICE_SENT || status === RecoveryStatus.NOTICE_APPROVED
        ? new Date(noticeApprovedDate?.getTime() || noticeIssuedDate!.getTime() + 2 * 24 * 60 * 60 * 1000)
        : undefined;

    const nextNoticeDate = (() => {
      if (daysOverdue < 15) {
        return new Date(dueDate.getTime() + 15 * 24 * 60 * 60 * 1000);
      } else if (daysOverdue < 30) {
        return new Date(dueDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else if (daysOverdue < 90) {
        return new Date(dueDate.getTime() + 90 * 24 * 60 * 60 * 1000);
      }
      return undefined;
    })();

    recoveryDues.push({
      id: `REC-${String(index + 1).padStart(6, '0')}`,
      loanId: `LOAN-${String(index + 1).padStart(6, '0')}`,
      customerId: customer._id || customer.id || customer.customerId || '',
      customerName: customer.fullName,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAddress: `${customer.addressLine1}, ${customer.city}, ${customer.state} ${customer.postalCode}`,
      principalAmount,
      interestAmount,
      penaltyAmount,
      totalDue,
      dueDate,
      daysOverdue,
      status,
      noticeType,
      noticeIssuedDate,
      noticeApprovedDate,
      noticeSentDate,
      deliveryMethod:
        status === RecoveryStatus.NOTICE_SENT || status === RecoveryStatus.NOTICE_APPROVED
          ? deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)]
          : undefined,
      isNPA,
      npaDate,
      nextNoticeDate,
    });
  });

  return recoveryDues;
};

export default function RecoveryPage() {
  const { customers, loading: customersLoading } = useCustomers();
  const { amountLabel, termCapitalized } = useInterestProfitTerm();
  const { addToast } = useToast();

  const [recoveryDues, setRecoveryDues] = useState<RecoveryDue[]>([]);
  const [filteredDues, setFilteredDues] = useState<RecoveryDue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [noticeTypeFilter, setNoticeTypeFilter] = useState<string>('all');
  const [daysOverdueFilter, setDaysOverdueFilter] = useState<string>('all');
  const [selectedDue, setSelectedDue] = useState<RecoveryDue | null>(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod>(
    DeliveryMethod.EMAIL
  );

  // Generate recovery dues when customers are loaded
  useEffect(() => {
    if (!customersLoading && customers.length > 0) {
      const dues = generateRecoveryDues(customers);
      setRecoveryDues(dues);
      setFilteredDues(dues);
    }
  }, [customers, customersLoading]);

  // Filter recovery dues
  useEffect(() => {
    let filtered = [...recoveryDues];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (due) =>
          due.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          due.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          due.customerPhone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((due) => due.status === statusFilter);
    }

    // Notice type filter
    if (noticeTypeFilter !== 'all') {
      filtered = filtered.filter((due) => due.noticeType === noticeTypeFilter);
    }

    // Days overdue filter
    if (daysOverdueFilter !== 'all') {
      if (daysOverdueFilter === '0-15') {
        filtered = filtered.filter((due) => due.daysOverdue >= 0 && due.daysOverdue < 15);
      } else if (daysOverdueFilter === '15-30') {
        filtered = filtered.filter((due) => due.daysOverdue >= 15 && due.daysOverdue < 30);
      } else if (daysOverdueFilter === '30-90') {
        filtered = filtered.filter((due) => due.daysOverdue >= 30 && due.daysOverdue < 90);
      } else if (daysOverdueFilter === '90-180') {
        filtered = filtered.filter((due) => due.daysOverdue >= 90 && due.daysOverdue < 180);
      } else if (daysOverdueFilter === '180+') {
        filtered = filtered.filter((due) => due.daysOverdue >= 180);
      }
    }

    setFilteredDues(filtered);
  }, [searchTerm, statusFilter, noticeTypeFilter, daysOverdueFilter, recoveryDues]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = recoveryDues.length;
    const totalDue = recoveryDues.reduce((sum, due) => sum + due.totalDue, 0);
    const pendingNotices = recoveryDues.filter(
      (due) => due.daysOverdue >= 15 && due.status === RecoveryStatus.PENDING
    ).length;
    const npaCount = recoveryDues.filter((due) => due.isNPA).length;
    const avgDaysOverdue =
      recoveryDues.length > 0
        ? recoveryDues.reduce((sum, due) => sum + due.daysOverdue, 0) / recoveryDues.length
        : 0;

    return {
      total,
      totalDue,
      pendingNotices,
      npaCount,
      avgDaysOverdue,
    };
  }, [recoveryDues]);

  // Get status badge
  const getStatusBadge = (status: RecoveryStatus) => {
    const variants: Record<string, any> = {
      [RecoveryStatus.PENDING]: 'warning',
      [RecoveryStatus.NOTICE_ISSUED]: 'neutral',
      [RecoveryStatus.NOTICE_APPROVED]: 'primary',
      [RecoveryStatus.NOTICE_SENT]: 'success',
      [RecoveryStatus.PARTIAL_PAYMENT]: 'warning',
      [RecoveryStatus.SETTLED]: 'success',
      [RecoveryStatus.NPA]: 'error',
    };
    return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
  };

  // Get notice type badge
  const getNoticeTypeBadge = (noticeType?: NoticeType) => {
    if (!noticeType) return null;
    const variants: Record<string, any> = {
      [NoticeType.FIRST_NOTICE]: 'warning',
      [NoticeType.SECOND_REMINDER]: 'warning',
      [NoticeType.LEGAL_NOTICE]: 'error',
      [NoticeType.NPA_CONVERSION]: 'error',
    };
    return <Badge variant={variants[noticeType] || 'neutral'}>{noticeType}</Badge>;
  };

  // Handle issue notice
  const handleIssueNotice = (due: RecoveryDue) => {
    setSelectedDue(due);
    setShowNoticeModal(true);
  };

  // Handle approve notice
  const handleApproveNotice = (due: RecoveryDue) => {
    setSelectedDue(due);
    setShowApprovalModal(true);
  };

  // Handle send notice
  const handleSendNotice = (due: RecoveryDue) => {
    setSelectedDue(due);
    setShowSendModal(true);
  };

  // Confirm issue notice
  const confirmIssueNotice = () => {
    if (!selectedDue) return;

    const updatedDues = recoveryDues.map((due) => {
      if (due.id === selectedDue.id) {
        return {
          ...due,
          status: RecoveryStatus.NOTICE_ISSUED,
          noticeType: NoticeType.FIRST_NOTICE,
          noticeIssuedDate: new Date(),
        };
      }
      return due;
    });

    setRecoveryDues(updatedDues);
    setShowNoticeModal(false);
    setSelectedDue(null);
    addToast({
      type: 'success',
      message: 'Notice issued successfully. Awaiting approval.',
    });
  };

  // Confirm approve notice
  const confirmApproveNotice = () => {
    if (!selectedDue) return;

    const updatedDues = recoveryDues.map((due) => {
      if (due.id === selectedDue.id) {
        return {
          ...due,
          status: RecoveryStatus.NOTICE_APPROVED,
          noticeApprovedDate: new Date(),
        };
      }
      return due;
    });

    setRecoveryDues(updatedDues);
    setShowApprovalModal(false);
    setSelectedDue(null);
    addToast({
      type: 'success',
      message: 'Notice approved. You can now send it to the customer.',
    });
  };

  // Confirm send notice
  const confirmSendNotice = () => {
    if (!selectedDue) return;

    const updatedDues = recoveryDues.map((due) => {
      if (due.id === selectedDue.id) {
        return {
          ...due,
          status: RecoveryStatus.NOTICE_SENT,
          noticeSentDate: new Date(),
          deliveryMethod: selectedDeliveryMethod,
        };
      }
      return due;
    });

    setRecoveryDues(updatedDues);
    setShowSendModal(false);
    setSelectedDue(null);
    addToast({
      type: 'success',
      message: `Notice sent successfully via ${selectedDeliveryMethod}.`,
    });
  };

  // Check if notice should be prompted (15 days overdue)
  const shouldPromptNotice = (due: RecoveryDue): boolean => {
    return due.daysOverdue >= 15 && due.status === RecoveryStatus.PENDING;
  };

  // Check if notice should be approved
  const canApproveNotice = (due: RecoveryDue): boolean => {
    return due.status === RecoveryStatus.NOTICE_ISSUED;
  };

  // Check if notice can be sent
  const canSendNotice = (due: RecoveryDue): boolean => {
    return due.status === RecoveryStatus.NOTICE_APPROVED;
  };

  // Table columns
  const columns = [
    { header: 'Customer Name', key: 'customerName' },
    { header: 'Loan ID', key: 'loanId' },
    { header: 'Total Due', key: 'totalDue', render: (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
    { header: 'Days Overdue', key: 'daysOverdue', render: (value: number) => `${value} days` },
    { header: 'Status', key: 'status', render: (status: RecoveryStatus) => getStatusBadge(status) },
    { header: 'Notice Type', key: 'noticeType', render: (noticeType?: NoticeType) => getNoticeTypeBadge(noticeType) || 'N/A' },
    { header: 'Next Action', key: 'nextAction', render: (_: any, row: RecoveryDue) => {
      if (shouldPromptNotice(row)) {
        return <Button size="sm" variant="primary" onClick={() => handleIssueNotice(row)}>Issue Notice</Button>;
      } else if (canApproveNotice(row)) {
        return <Button size="sm" variant="primary" onClick={() => handleApproveNotice(row)}>Approve</Button>;
      } else if (canSendNotice(row)) {
        return <Button size="sm" variant="primary" onClick={() => handleSendNotice(row)}>Send Notice</Button>;
      } else if (row.isNPA) {
        return <Badge variant="error">NPA - Follow SOP</Badge>;
      }
      return <span className="text-neutral-500">-</span>;
    }},
  ];

  if (customersLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Recovery', href: '/recovery' },
          ]}
        />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Recovery Management</h1>
            <p className="text-neutral-600 mt-1">Track and manage pending dues and recovery notices</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              exportToCSV(filteredDues, `recovery-dues-${new Date().toISOString().split('T')[0]}`, [
                { key: 'customerName', label: 'Customer Name' },
                { key: 'loanId', label: 'Loan ID' },
                { key: 'totalDue', label: 'Total Due' },
                { key: 'principalAmount', label: 'Principal Amount' },
                { key: 'interestAmount', label: amountLabel },
                { key: 'penaltyAmount', label: 'Penalty Amount' },
                { key: 'daysOverdue', label: 'Days Overdue' },
                { key: 'status', label: 'Status' },
                { key: 'noticeType', label: 'Notice Type' },
                { key: 'dueDate', label: 'Due Date' },
              ]);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Pending Dues</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-warning-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Amount Due</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">
                    ₹{stats.totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 text-error-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Pending Notices</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.pendingNotices}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">NPA Accounts</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.npaCount}</p>
                </div>
                <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-error-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Avg Days Overdue</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">
                    {Math.round(stats.avgDaysOverdue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-neutral-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-end gap-4">
              {/* Search Input */}
              <div className="flex-1 w-full md:min-w-[280px]">
                <Input
                  placeholder="Search by customer name, loan ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="h-4 w-4 text-neutral-400" />}
                />
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-[160px]">
                <Select
                  label=""
                  placeholder="All Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: RecoveryStatus.PENDING, label: 'Pending' },
                    { value: RecoveryStatus.NOTICE_ISSUED, label: 'Notice Issued' },
                    { value: RecoveryStatus.NOTICE_APPROVED, label: 'Notice Approved' },
                    { value: RecoveryStatus.NOTICE_SENT, label: 'Notice Sent' },
                    { value: RecoveryStatus.PARTIAL_PAYMENT, label: 'Partial Payment' },
                    { value: RecoveryStatus.NPA, label: 'NPA' },
                  ]}
                />
              </div>

              {/* Notice Type Filter */}
              <div className="w-full md:w-[160px]">
                <Select
                  label=""
                  placeholder="All Types"
                  value={noticeTypeFilter}
                  onChange={(e) => setNoticeTypeFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: NoticeType.FIRST_NOTICE, label: 'First Notice' },
                    { value: NoticeType.SECOND_REMINDER, label: 'Second Reminder' },
                    { value: NoticeType.LEGAL_NOTICE, label: 'Legal Notice' },
                    { value: NoticeType.NPA_CONVERSION, label: 'NPA Conversion' },
                  ]}
                />
              </div>

              {/* Days Overdue Filter */}
              <div className="w-full md:w-[160px]">
                <Select
                  label=""
                  placeholder="All Periods"
                  value={daysOverdueFilter}
                  onChange={(e) => setDaysOverdueFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Periods' },
                    { value: '0-15', label: '0-15 days' },
                    { value: '15-30', label: '15-30 days' },
                    { value: '30-90', label: '30-90 days' },
                    { value: '90-180', label: '90-180 days' },
                    { value: '180+', label: '180+ days (NPA)' },
                  ]}
                />
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || statusFilter !== 'all' || noticeTypeFilter !== 'all' || daysOverdueFilter !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setNoticeTypeFilter('all');
                    setDaysOverdueFilter('all');
                  }}
                  className="whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Recovery Dues Table */}
        <Card>
          <div className="p-4">
            <Table
              data={filteredDues}
              columns={columns}
              emptyMessage="No recovery dues found"
            />
          </div>
        </Card>

        {/* Issue Notice Modal */}
        <Modal
          isOpen={showNoticeModal}
          onClose={() => {
            setShowNoticeModal(false);
            setSelectedDue(null);
          }}
          title="Issue Recovery Notice"
          size="lg"
        >
          {selectedDue && (
            <div className="space-y-4">
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-warning-900">Notice Required</p>
                    <p className="text-sm text-warning-700 mt-1">
                      This account is {selectedDue.daysOverdue} days overdue. A recovery notice must be issued.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">Customer Name</p>
                    <p className="font-semibold text-neutral-900">{selectedDue.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Loan ID</p>
                    <p className="font-semibold text-neutral-900">{selectedDue.loanId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Total Due</p>
                    <p className="font-semibold text-neutral-900">
                      ₹{selectedDue.totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Days Overdue</p>
                    <p className="font-semibold text-neutral-900">{selectedDue.daysOverdue} days</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm text-neutral-600 mb-2">Breakdown:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Principal:</span>
                      <span className="font-medium">₹{selectedDue.principalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">{termCapitalized}:</span>
                      <span className="font-medium">₹{selectedDue.interestAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Penalty (2% per month):</span>
                      <span className="font-medium">₹{selectedDue.penaltyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowNoticeModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={confirmIssueNotice}>
                  <FileText className="h-4 w-4 mr-2" />
                  Issue Notice
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Approve Notice Modal */}
        <Modal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedDue(null);
          }}
          title="Approve Recovery Notice"
          size="lg"
        >
          {selectedDue && (
            <div className="space-y-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-primary-900">Approve Notice for Sending</p>
                    <p className="text-sm text-primary-700 mt-1">
                      Once approved, you can send this notice via Email, WhatsApp, or Physical Copy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">Customer Name</p>
                    <p className="font-semibold text-neutral-900">{selectedDue.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Notice Type</p>
                    <p className="font-semibold text-neutral-900">{selectedDue.noticeType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Issued Date</p>
                    <p className="font-semibold text-neutral-900">
                      {selectedDue.noticeIssuedDate?.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Total Due</p>
                    <p className="font-semibold text-neutral-900">
                      ₹{selectedDue.totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={confirmApproveNotice}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Notice
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Send Notice Modal */}
        <Modal
          isOpen={showSendModal}
          onClose={() => {
            setShowSendModal(false);
            setSelectedDue(null);
          }}
          title="Send Recovery Notice"
          size="lg"
        >
          {selectedDue && (
            <div className="space-y-4">
              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Send className="h-5 w-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-success-900">Send Notice to Customer</p>
                    <p className="text-sm text-success-700 mt-1">
                      Choose the delivery method for sending the recovery notice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">Customer Name</p>
                    <p className="font-semibold text-neutral-900">{selectedDue.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Phone</p>
                    <p className="font-semibold text-neutral-900">{selectedDue.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Email</p>
                    <p className="font-semibold text-neutral-900">{selectedDue.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Address</p>
                    <p className="font-semibold text-neutral-900 text-sm">{selectedDue.customerAddress}</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Delivery Method
                  </label>
                  <div className="space-y-2">
                    {Object.values(DeliveryMethod).map((method) => (
                      <label
                        key={method}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value={method}
                          checked={selectedDeliveryMethod === method}
                          onChange={(e) => setSelectedDeliveryMethod(e.target.value as DeliveryMethod)}
                          className="w-4 h-4 text-primary-600"
                        />
                        <div className="flex items-center gap-2">
                          {method === DeliveryMethod.EMAIL && <Mail className="h-4 w-4 text-neutral-600" />}
                          {method === DeliveryMethod.WHATSAPP && <MessageSquare className="h-4 w-4 text-neutral-600" />}
                          {method === DeliveryMethod.PHYSICAL && <FileText className="h-4 w-4 text-neutral-600" />}
                          <span className="font-medium">{method}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowSendModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={confirmSendNotice}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notice
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}

