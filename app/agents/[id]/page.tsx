'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Avatar,
  Breadcrumbs,
  Table,
  Tabs,
  Modal,
} from '@/components/ui';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Eye,
  Download,
  Image as ImageIcon,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useEmployee } from '@/hooks/useEmployee';
import { usePaymentRecords } from '@/hooks/usePaymentRecords';
import { usePaymentRecordMutations } from '@/hooks/usePaymentRecordMutations';
import { useToast } from '@/components/ui/Toast';
import { PaymentRecord, PaymentStatus, PaymentType } from '@/services/paymentRecords.service';
import { Employee } from '@/services/employee.service';

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div>
      <span className="text-sm font-medium text-neutral-600 flex items-center mb-1 gap-2">
        {icon}
        {label}
      </span>
      <p className="text-neutral-800">{value}</p>
    </div>
  );
};

export default function ViewAgentPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = params?.id as string;
  const { addToast } = useToast();

  const { employee, loading, error, refetch } = useEmployee(agentId);
  const { paymentRecords: allPaymentRecords, loading: paymentRecordsLoading, refetch: refetchPaymentRecords } = usePaymentRecords({ agentId });
  const { updatePaymentStatus, loading: mutationLoading } = usePaymentRecordMutations();

  // Filter settled and unsettled collections
  const settledCollections = React.useMemo(() => {
    return allPaymentRecords.filter(record => record.status === PaymentStatus.Collected);
  }, [allPaymentRecords]);

  const unsettledCollections = React.useMemo(() => {
    return allPaymentRecords.filter(record => 
      record.status === PaymentStatus.Pending || 
      record.status === PaymentStatus.Verified || 
      record.status === PaymentStatus.Rejected
    );
  }, [allPaymentRecords]);

  // Calculate totals
  const settledTotal = React.useMemo(() => {
    return settledCollections.reduce((sum, record) => sum + (record.amount || 0), 0);
  }, [settledCollections]);

  const unsettledTotal = React.useMemo(() => {
    return unsettledCollections.reduce((sum, record) => sum + (record.amount || 0), 0);
  }, [unsettledCollections]);

  const handleVerify = async (recordId: string) => {
    try {
      await updatePaymentStatus(recordId, {
        status: PaymentStatus.Verified,
      });
      refetchPaymentRecords();
    } catch (err) {
      // Error handled in mutation hook
    }
  };

  const handleReject = async (recordId: string, reason: string) => {
    try {
      await updatePaymentStatus(recordId, {
        status: PaymentStatus.Rejected,
        rejectionReason: reason,
      });
      refetchPaymentRecords();
    } catch (err) {
      // Error handled in mutation hook
    }
  };

  const handleCollect = async (recordId: string) => {
    try {
      await updatePaymentStatus(recordId, {
        status: PaymentStatus.Collected,
      });
      refetchPaymentRecords();
    } catch (err) {
      // Error handled in mutation hook
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6 animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !employee) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <div className="p-12 text-center">
              <XCircle className="h-16 w-16 text-error-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Failed to Load Agent</h2>
              <p className="text-neutral-600 mb-6">{error || 'Agent not found'}</p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => router.push('/agents')}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Agents
                </Button>
                <Button variant="primary" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const TABS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <User className="h-4 w-4" />,
      content: <AgentOverviewTab employee={employee} settledTotal={settledTotal} unsettledTotal={unsettledTotal} />,
    },
    {
      id: 'settled',
      label: 'Settled Collection',
      icon: <CheckCircle className="h-4 w-4" />,
      content: (
        <SettledCollectionTab
          records={settledCollections}
          loading={paymentRecordsLoading}
          onRefetch={refetchPaymentRecords}
        />
      ),
    },
    {
      id: 'unsettled',
      label: 'Unsettled Collection',
      icon: <Clock className="h-4 w-4" />,
      content: (
        <UnsettledCollectionTab
          records={unsettledCollections}
          loading={paymentRecordsLoading}
          onRefetch={refetchPaymentRecords}
          onVerify={handleVerify}
          onReject={handleReject}
          onCollect={handleCollect}
          mutationLoading={mutationLoading}
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Agents', href: '/agents' },
          { label: employee.fullName },
        ]} />
        
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div className="flex items-start gap-4">
              <Avatar size="lg" fallback={employee.fullName} />
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{employee.fullName}</h1>
                <p className="text-neutral-600 mt-1">{employee.employeeId} • {employee.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={employee.status === 'active' ? 'success' : 'warning'}>
                    {employee.status}
                  </Badge>
                  <Badge variant="neutral">{employee.department}</Badge>
                  <Badge variant="neutral">{employee.designation}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" onClick={() => router.push(`/employees/${agentId}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs tabs={TABS} defaultTab="overview" />
      </div>
    </DashboardLayout>
  );
}

const AgentOverviewTab = ({ employee, settledTotal, unsettledTotal }: { employee: Employee, settledTotal: number, unsettledTotal: number }) => {
  return (
    <div className="space-y-6 mt-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Status</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                <Badge variant={employee.status === 'active' ? 'success' : employee.status === 'suspended' ? 'warning' : 'error'}>
                  {employee.status?.charAt(0).toUpperCase() + employee.status?.slice(1)}
                </Badge>
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Settled Collection</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                ₹{settledTotal.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Unsettled Collection</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                ₹{unsettledTotal.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-stripe flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Collection</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                ₹{(settledTotal + unsettledTotal).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Personal Information */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={employee.email} />
          <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={employee.phone} />
          <InfoItem icon={<Phone className="h-4 w-4" />} label="Alternate Phone" value={employee.alternatePhone} />
          <InfoItem 
            icon={<Calendar className="h-4 w-4" />} 
            label="Date of Birth" 
            value={employee.dateOfBirth ? (typeof employee.dateOfBirth === 'string' ? new Date(employee.dateOfBirth).toLocaleDateString('en-IN') : employee.dateOfBirth.toLocaleDateString('en-IN')) : null}
          />
          <InfoItem icon={<User className="h-4 w-4" />} label="Gender" value={employee.gender} />
          <InfoItem icon={<User className="h-4 w-4" />} label="Marital Status" value={employee.maritalStatus} />
        </div>
      </Card>

      {/* Address Information */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem 
            icon={<MapPin className="h-4 w-4" />} 
            label="Address" 
            value={`${employee.addressLine1}${employee.addressLine2 ? ', ' + employee.addressLine2 : ''}, ${employee.city}, ${employee.state} - ${employee.postalCode}, ${employee.country}`}
          />
        </div>
      </Card>

      {/* Professional Information */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Role" value={employee.role?.replace('_', ' ')} />
          <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Department" value={employee.department?.replace('_', ' ')} />
          <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Designation" value={employee.designation} />
          <InfoItem 
            icon={<Calendar className="h-4 w-4" />} 
            label="Date of Joining" 
            value={employee.dateOfJoining ? (typeof employee.dateOfJoining === 'string' ? new Date(employee.dateOfJoining).toLocaleDateString('en-IN') : employee.dateOfJoining.toLocaleDateString('en-IN')) : null}
          />
        </div>
      </Card>
    </div>
  );
};

const SettledCollectionTab = ({ records, loading, onRefetch }: { records: PaymentRecord[], loading: boolean, onRefetch: () => void }) => {
  const columns = [
    {
      key: 'id',
      header: 'Payment ID',
      render: (_: any, row: PaymentRecord) => (
        <span className="font-mono text-sm">{row.id || row._id}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (value: PaymentType) => (
        <Badge variant={value === PaymentType.Loan ? 'primary' : 'neutral'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value: number) => (
        <span className="font-semibold">₹{value.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: PaymentStatus) => (
        <Badge variant="success">{value}</Badge>
      ),
    },
    {
      key: 'verifiedAt',
      header: 'Verified At',
      render: (value: string | Date | undefined) => (
        value ? new Date(value).toLocaleDateString('en-IN') : 'N/A'
      ),
    },
    {
      key: 'createdAt',
      header: 'Collected At',
      render: (value: string | Date | undefined) => (
        value ? new Date(value).toLocaleDateString('en-IN') : 'N/A'
      ),
    },
    {
      key: 'photoproof_url',
      header: 'Photo Proof',
      render: (value: string | undefined) => (
        value ? (
          <Button variant="ghost" size="sm" onClick={() => window.open(value, '_blank')}>
            <ImageIcon className="h-4 w-4" />
          </Button>
        ) : 'N/A'
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (value: string | undefined) => value || 'N/A',
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-neutral-500">Loading settled collections...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Settled Collections</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Total: {records.length} records • ₹{records.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {records.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">No settled collections found</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table data={records} columns={columns} />
          </div>
        </Card>
      )}
    </div>
  );
};

const UnsettledCollectionTab = ({ 
  records, 
  loading, 
  onRefetch, 
  onVerify, 
  onReject, 
  onCollect,
  mutationLoading 
}: { 
  records: PaymentRecord[], 
  loading: boolean, 
  onRefetch: () => void,
  onVerify: (id: string) => void,
  onReject: (id: string, reason: string) => void,
  onCollect: (id: string) => void,
  mutationLoading: boolean,
}) => {
  const [verifyModalOpen, setVerifyModalOpen] = React.useState(false);
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [collectModalOpen, setCollectModalOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<PaymentRecord | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');

  const handleVerifyClick = (record: PaymentRecord) => {
    setSelectedRecord(record);
    setVerifyModalOpen(true);
  };

  const handleVerifyConfirm = async () => {
    if (selectedRecord) {
      await onVerify(selectedRecord.id || selectedRecord._id || '');
      setVerifyModalOpen(false);
      setSelectedRecord(null);
    }
  };

  const handleRejectClick = (record: PaymentRecord) => {
    setSelectedRecord(record);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (selectedRecord && rejectionReason.trim()) {
      await onReject(selectedRecord.id || selectedRecord._id || '', rejectionReason);
      setRejectModalOpen(false);
      setSelectedRecord(null);
      setRejectionReason('');
    }
  };

  const handleCollectClick = (record: PaymentRecord) => {
    setSelectedRecord(record);
    setCollectModalOpen(true);
  };

  const handleCollectConfirm = async () => {
    if (selectedRecord) {
      await onCollect(selectedRecord.id || selectedRecord._id || '');
      setCollectModalOpen(false);
      setSelectedRecord(null);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Pending:
        return <Badge variant="warning">{status}</Badge>;
      case PaymentStatus.Verified:
        return <Badge variant="primary">{status}</Badge>;
      case PaymentStatus.Rejected:
        return <Badge variant="error">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Payment ID',
      render: (_: any, row: PaymentRecord) => (
        <span className="font-mono text-sm">{row.id || row._id}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (value: PaymentType) => (
        <Badge variant={value === PaymentType.Loan ? 'primary' : 'neutral'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value: number) => (
        <span className="font-semibold">₹{value.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: PaymentStatus) => getStatusBadge(value),
    },
    {
      key: 'photoproof_url',
      header: 'Photo Proof',
      render: (value: string | undefined) => (
        value ? (
          <Button variant="ghost" size="sm" onClick={() => window.open(value, '_blank')}>
            <ImageIcon className="h-4 w-4" />
          </Button>
        ) : 'N/A'
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (value: string | undefined) => value || 'N/A',
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (value: string | Date | undefined) => (
        value ? new Date(value).toLocaleDateString('en-IN') : 'N/A'
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: PaymentRecord) => (
        <div className="flex items-center gap-2">
          {row.status === PaymentStatus.Pending && (
            <>
              <Button variant="primary" size="sm" onClick={() => handleVerifyClick(row)} loading={mutationLoading}>
                Verify
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleRejectClick(row)} loading={mutationLoading}>
                Reject
              </Button>
            </>
          )}
          {row.status === PaymentStatus.Verified && (
            <Button variant="primary" size="sm" onClick={() => handleCollectClick(row)} loading={mutationLoading}>
              Collect
            </Button>
          )}
          {row.status === PaymentStatus.Rejected && row.rejectionReason && (
            <span className="text-sm text-neutral-600" title={row.rejectionReason}>
              Rejected
            </span>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-neutral-500">Loading unsettled collections...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Unsettled Collections</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Total: {records.length} records • ₹{records.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {records.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <Clock className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">No unsettled collections found</p>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="overflow-x-auto">
              <Table data={records} columns={columns} />
            </div>
          </Card>

          {/* Verify Confirmation Modal */}
          <Modal
            isOpen={verifyModalOpen}
            onClose={() => {
              setVerifyModalOpen(false);
              setSelectedRecord(null);
            }}
            title="Verify Payment Record"
            size="md"
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setVerifyModalOpen(false);
                    setSelectedRecord(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleVerifyConfirm}
                  loading={mutationLoading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Verify
                </Button>
              </>
            }
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Verify Payment Record?
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Are you sure you want to verify this payment record? This will mark it as verified and ready for collection.
                  </p>
                  {selectedRecord && (
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-600 mb-2">Payment Details:</p>
                      <ul className="text-sm text-neutral-700 space-y-1">
                        <li>Payment ID: <span className="font-medium">{selectedRecord.id || selectedRecord._id}</span></li>
                        <li>Type: <span className="font-medium">{selectedRecord.type}</span></li>
                        <li>Amount: <span className="font-medium">₹{selectedRecord.amount?.toLocaleString('en-IN')}</span></li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>

          {/* Reject Modal */}
          <Modal
            isOpen={rejectModalOpen}
            onClose={() => {
              setRejectModalOpen(false);
              setSelectedRecord(null);
              setRejectionReason('');
            }}
            title="Reject Payment Record"
            size="md"
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRejectModalOpen(false);
                    setSelectedRecord(null);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRejectConfirm}
                  disabled={!rejectionReason.trim()}
                  loading={mutationLoading}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Payment
                </Button>
              </>
            }
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-error-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Reject Payment Record?
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Please provide a reason for rejecting this payment record. This action cannot be undone.
                  </p>
                  {selectedRecord && (
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-neutral-600 mb-2">Payment Details:</p>
                      <ul className="text-sm text-neutral-700 space-y-1">
                        <li>Payment ID: <span className="font-medium">{selectedRecord.id || selectedRecord._id}</span></li>
                        <li>Type: <span className="font-medium">{selectedRecord.type}</span></li>
                        <li>Amount: <span className="font-medium">₹{selectedRecord.amount?.toLocaleString('en-IN')}</span></li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                />
              </div>
            </div>
          </Modal>

          {/* Collect Confirmation Modal */}
          <Modal
            isOpen={collectModalOpen}
            onClose={() => {
              setCollectModalOpen(false);
              setSelectedRecord(null);
            }}
            title="Collect Payment"
            size="md"
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCollectModalOpen(false);
                    setSelectedRecord(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCollectConfirm}
                  loading={mutationLoading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Collect
                </Button>
              </>
            }
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-success-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Collect Payment?
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Are you sure you want to mark this payment as collected? This will finalize the payment record and move it to settled collections.
                  </p>
                  {selectedRecord && (
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-600 mb-2">Payment Details:</p>
                      <ul className="text-sm text-neutral-700 space-y-1">
                        <li>Payment ID: <span className="font-medium">{selectedRecord.id || selectedRecord._id}</span></li>
                        <li>Type: <span className="font-medium">{selectedRecord.type}</span></li>
                        <li>Amount: <span className="font-medium">₹{selectedRecord.amount?.toLocaleString('en-IN')}</span></li>
                        <li>Status: <span className="font-medium">{selectedRecord.status}</span></li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

