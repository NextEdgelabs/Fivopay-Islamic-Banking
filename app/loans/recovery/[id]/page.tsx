'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Breadcrumbs,
  Skeleton,
  Table,
} from '@/components/ui';
import {
  ArrowLeft,
  AlertTriangle,
  Mail,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  IndianRupee,
  TrendingUp,
  Calendar,
  User,
  Phone,
  MapPin,
  Percent,
} from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
import { Customer } from '@/services/customers.service';
import { NoticeType, RecoveryStatus, DeliveryMethod, RecoveryDue } from '@/types/recovery';

// Generate dummy recovery data (same as RecoveryTab)
const generateRecoveryDues = (customers: Customer[]): RecoveryDue[] => {
  if (customers.length === 0) return [];

  const deliveryMethods = [
    DeliveryMethod.EMAIL,
    DeliveryMethod.WHATSAPP,
    DeliveryMethod.PHYSICAL,
  ];

  const today = new Date();
  const recoveryDues: RecoveryDue[] = [];

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
    });
  });

  return recoveryDues;
};

// Generate penalty breakdown
const generatePenaltyBreakdown = (due: RecoveryDue) => {
  const monthsOverdue = Math.floor(due.daysOverdue / 30);
  const penaltyRate = 0.02; // 2% per month
  const monthlyPenalty = due.principalAmount * penaltyRate;
  const breakdown = [];

  for (let month = 1; month <= monthsOverdue; month++) {
    const penaltyDate = new Date(due.dueDate);
    penaltyDate.setMonth(penaltyDate.getMonth() + month);
    breakdown.push({
      month,
      date: penaltyDate,
      amount: monthlyPenalty,
      cumulative: monthlyPenalty * month,
    });
  }

  return breakdown;
};

export default function RecoveryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recoveryId = params?.id as string;
  const { customers, loading: customersLoading } = useCustomers();
  const { amountLabel } = useInterestProfitTerm();

  const [recoveryDue, setRecoveryDue] = useState<RecoveryDue | null>(null);

  useEffect(() => {
    if (!customersLoading && customers.length > 0) {
      const dues = generateRecoveryDues(customers);
      const found = dues.find((due) => due.id === recoveryId);
      setRecoveryDue(found || null);
    }
  }, [customers, customersLoading, recoveryId]);

  const penaltyBreakdown = useMemo(() => {
    if (!recoveryDue) return [];
    return generatePenaltyBreakdown(recoveryDue);
  }, [recoveryDue]);

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

  if (customersLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!recoveryDue) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Recovery Due Not Found</h2>
            <p className="text-neutral-600 mb-4">The recovery due you are looking for does not exist.</p>
            <Button variant="outline" onClick={() => router.push('/loans')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Loans
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const monthsOverdue = Math.floor(recoveryDue.daysOverdue / 30);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Loans', href: '/loans' },
            { label: 'Recovery', href: '/loans' },
            { label: 'Recovery Details', href: '#' },
          ]}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Recovery Details</h1>
              <p className="text-neutral-600 mt-1">Complete information about the recovery due</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Amount Due</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1 break-words">
                    ₹{recoveryDue.totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  <p className="text-sm text-neutral-600">Total Penalty</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">
                    ₹{recoveryDue.penaltyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                  <Percent className="h-6 w-6 text-warning-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Months Overdue</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{monthsOverdue}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Days Overdue</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{recoveryDue.daysOverdue}</p>
                </div>
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-neutral-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600">Customer Name</p>
                  <p className="font-semibold text-neutral-900">{recoveryDue.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </p>
                  <p className="font-semibold text-neutral-900">{recoveryDue.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="font-semibold text-neutral-900">{recoveryDue.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </p>
                  <p className="font-semibold text-neutral-900 text-sm">{recoveryDue.customerAddress}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Loan Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Loan Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600">Loan ID</p>
                  <p className="font-semibold text-neutral-900">{recoveryDue.loanId}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Recovery ID</p>
                  <p className="font-semibold text-neutral-900">{recoveryDue.id}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Due Date</p>
                  <p className="font-semibold text-neutral-900">
                    {recoveryDue.dueDate.toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Status</p>
                  <div className="mt-1">{getStatusBadge(recoveryDue.status)}</div>
                </div>
                {recoveryDue.noticeType && (
                  <div>
                    <p className="text-sm text-neutral-600">Notice Type</p>
                    <div className="mt-1">{getNoticeTypeBadge(recoveryDue.noticeType)}</div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Amount Breakdown */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Amount Breakdown
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-neutral-600">Principal Amount</span>
                  <span className="font-semibold text-neutral-900">
                    ₹{recoveryDue.principalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-neutral-600">{amountLabel}</span>
                  <span className="font-semibold text-neutral-900">
                    ₹{recoveryDue.interestAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-neutral-600">Penalty Amount ({monthsOverdue} months @ 2%)</span>
                  <span className="font-semibold text-warning-600">
                    ₹{recoveryDue.penaltyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold text-neutral-900">Total Due</span>
                  <span className="text-lg font-bold text-error-600">
                    ₹{recoveryDue.totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Penalty Breakdown Table */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Penalty Breakdown ({penaltyBreakdown.length} Penalty{penaltyBreakdown.length !== 1 ? 'ies' : ''} Applied)
            </h2>
            <p className="text-sm text-neutral-600 mb-4">
              Automatic penalty of 2% per month applied on delayed payment. Each month overdue adds a new penalty.
            </p>
            {penaltyBreakdown.length > 0 ? (
              <Table
                data={penaltyBreakdown.map((item, index) => ({ ...item, seriesNumber: index + 1 }))}
                columns={[
                  { header: 'S.No.', key: 'seriesNumber', render: (value: number) => value },
                  { header: 'Penalty Date', key: 'date', render: (value: Date) => {
                    const date = new Date(value);
                    const day = date.getDate();
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const month = monthNames[date.getMonth()];
                    const year = date.getFullYear();
                    return `${day} ${month} ${year}`;
                  }},
                  { header: 'Monthly Penalty (2%)', key: 'amount', render: (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                  { header: 'Cumulative Penalty', key: 'cumulative', render: (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                ]}
                emptyMessage="No penalties applied"
              />
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <Clock className="h-12 w-12 mx-auto mb-2 text-neutral-400" />
                <p>No penalties applied yet. Penalties are added automatically after each month of delay.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Notice Information */}
        {(recoveryDue.noticeIssuedDate || recoveryDue.noticeApprovedDate || recoveryDue.noticeSentDate) && (
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notice Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recoveryDue.noticeIssuedDate && (
                  <div>
                    <p className="text-sm text-neutral-600">Notice Issued Date</p>
                    <p className="font-semibold text-neutral-900">
                      {recoveryDue.noticeIssuedDate.toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
                {recoveryDue.noticeApprovedDate && (
                  <div>
                    <p className="text-sm text-neutral-600">Notice Approved Date</p>
                    <p className="font-semibold text-neutral-900">
                      {recoveryDue.noticeApprovedDate.toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
                {recoveryDue.noticeSentDate && (
                  <div>
                    <p className="text-sm text-neutral-600">Notice Sent Date</p>
                    <p className="font-semibold text-neutral-900">
                      {recoveryDue.noticeSentDate.toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
                {recoveryDue.deliveryMethod && (
                  <div>
                    <p className="text-sm text-neutral-600">Delivery Method</p>
                    <p className="font-semibold text-neutral-900">{recoveryDue.deliveryMethod}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* NPA Information */}
        {recoveryDue.isNPA && recoveryDue.npaDate && (
          <Card>
            <div className="p-6">
              <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-error-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-error-900">Non-Performing Asset (NPA)</p>
                    <p className="text-sm text-error-700 mt-1">
                      This account was converted to NPA on {recoveryDue.npaDate.toLocaleDateString('en-IN')}. 
                      Please follow the standard operating procedure for NPA recovery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

