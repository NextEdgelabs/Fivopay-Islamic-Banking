'use client';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Badge, Breadcrumbs, Skeleton, Tabs, Table, Pagination, Modal, Select, Input } from '@/components/ui';
import { Edit, Trash2, MapPin, Phone, Mail, Clock, Users, Calendar, Award, Star, Building, DollarSign, CreditCard, TrendingUp, BarChart2, AlertCircle, Wallet, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { useBranch } from '@/hooks/useBranch';
import { useBranchMutations } from '@/hooks/useBranchMutations';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';
import BranchKpiCard from '@/components/branches/BranchKpiCard';
import BranchCustomersList from '@/components/branches/BranchCustomersList';
import { useEffect, useState } from 'react';
import { branchService } from '@/services/branch.service';
import { CustomerTransaction } from '@/services/customers.service';
import { loanService, Loan } from '@/services/loans';
import { depositService, Deposit } from '@/services/deposits';
import { analyticsService, PerformanceData } from '@/services/analytics';
import { DateRange as DayPickerDateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import DateRangeFilter from '@/components/analytics/DateRangeFilter';
import KpiCardWithTrend from '@/components/analytics/KpiCardWithTrend';
import PerformanceChart from '@/components/analytics/PerformanceChart';
import ProductPerformance from '@/components/analytics/ProductPerformance';
import { customerService } from '@/services/customers.service';
import { withdrawalRequestService, WithdrawalRequest } from '@/services/withdrawal-requests.service';
import { useBatches } from '@/hooks/useBatches';
import { useEmployees } from '@/hooks/useEmployees';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Textarea } from '@/components/ui';

// Withdrawal Requests Tab Component
const BranchWithdrawalRequestsTab = ({ branchId, branchName }: { branchId: string; branchName: string }) => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const { addToast } = useToast();
  const { batches } = useBatches();
  const { employees } = useEmployees();

  // Filter employees to get agents
  const agents = employees.filter(emp => 
    emp.role?.toLowerCase().includes('agent') || 
    emp.designation?.toLowerCase().includes('agent') ||
    emp.department?.toLowerCase().includes('agent')
  );

  useEffect(() => {
    loadRequests();
  }, [branchId]);

  const loadRequests = () => {
    setLoading(true);
    try {
      const data = withdrawalRequestService.getWithdrawalRequests(branchId);
      setRequests(data);
    } catch (error) {
      console.error('Error loading withdrawal requests:', error);
      addToast({ type: 'error', message: 'Failed to load withdrawal requests' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    
    // Check if customer exists in any batch
    const batchAgent = withdrawalRequestService.findCustomerBatchAgent(request.customerId, batches);
    
    if (batchAgent) {
      // Auto-assign agent from batch
      setSelectedAgentId(batchAgent.agentId);
      addToast({ 
        type: 'info', 
        message: `Customer found in batch "${batchAgent.batchName}". Agent "${batchAgent.agentName}" will be assigned automatically.` 
      });
    } else {
      // No batch found, need manual selection
      setSelectedAgentId('');
    }
    
    setIsApproveModalOpen(true);
  };

  const confirmApprove = () => {
    if (!selectedRequest) return;
    
    if (!selectedAgentId) {
      addToast({ type: 'error', message: 'Please select an agent' });
      return;
    }

    const agent = agents.find(a => (a._id || a.id) === selectedAgentId);
    if (!agent) {
      addToast({ type: 'error', message: 'Selected agent not found' });
      return;
    }

    try {
      const updated = withdrawalRequestService.approveWithdrawalRequest(
        selectedRequest.id,
        selectedAgentId,
        agent.fullName,
        notes
      );

      if (updated) {
        addToast({ type: 'success', message: 'Withdrawal request approved successfully' });
        setIsApproveModalOpen(false);
        setSelectedRequest(null);
        setSelectedAgentId('');
        setNotes('');
        loadRequests();
      } else {
        addToast({ type: 'error', message: 'Failed to approve withdrawal request' });
      }
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to approve withdrawal request' });
    }
  };

  const handleReject = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (!selectedRequest) return;
    
    if (!rejectionReason.trim()) {
      addToast({ type: 'error', message: 'Please provide a rejection reason' });
      return;
    }

    try {
      const updated = withdrawalRequestService.rejectWithdrawalRequest(
        selectedRequest.id,
        rejectionReason
      );

      if (updated) {
        addToast({ type: 'success', message: 'Withdrawal request rejected' });
        setIsRejectModalOpen(false);
        setSelectedRequest(null);
        setRejectionReason('');
        loadRequests();
      } else {
        addToast({ type: 'error', message: 'Failed to reject withdrawal request' });
      }
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to reject withdrawal request' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="error" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      case 'completed':
        return <Badge variant="primary" className="flex items-center gap-1"><UserCheck className="h-3 w-3" /> Completed</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const columns = [
    {
      header: 'Customer',
      key: 'customerName',
      render: (_: any, row: WithdrawalRequest) => (
        <div>
          <p className="font-medium text-neutral-900">{row.customerName}</p>
          <p className="text-sm text-neutral-500">{row.accountNumber || row.customerId}</p>
        </div>
      ),
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-semibold text-neutral-900">₹{amount.toLocaleString()}</span>
      ),
    },
    {
      header: 'Request Date',
      key: 'requestDate',
      render: (date: string) => new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    },
    {
      header: 'Status',
      key: 'status',
      render: (status: string) => getStatusBadge(status),
    },
    {
      header: 'Assigned Agent',
      key: 'assignedAgentName',
      render: (_: any, row: WithdrawalRequest) => (
        row.assignedAgentName ? (
          <div>
            <p className="text-sm font-medium text-neutral-900">{row.assignedAgentName}</p>
            {row.approvedDate && (
              <p className="text-xs text-neutral-500">
                Approved: {new Date(row.approvedDate).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <span className="text-neutral-400 text-sm">Not assigned</span>
        )
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_: any, row: WithdrawalRequest) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(row)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleReject(row)}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </>
          )}
          {row.status === 'approved' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const updated = withdrawalRequestService.completeWithdrawalRequest(row.id);
                if (updated) {
                  addToast({ type: 'success', message: 'Withdrawal marked as completed' });
                  loadRequests();
                }
              }}
            >
              <UserCheck className="h-3 w-3 mr-1" />
              Mark Complete
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <Skeleton className="h-64 w-full" />;

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const totalAmount = requests.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6 mt-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="sm" className="bg-warning-50 border-warning-100">
          <div className="text-sm text-warning-700 font-medium">Pending Requests</div>
          <div className="text-2xl font-bold text-warning-900">{pendingCount}</div>
        </Card>
        <Card padding="sm" className="bg-success-50 border-success-100">
          <div className="text-sm text-success-700 font-medium">Approved</div>
          <div className="text-2xl font-bold text-success-900">{approvedCount}</div>
        </Card>
        <Card padding="sm" className="bg-primary-50 border-primary-100">
          <div className="text-sm text-primary-700 font-medium">Total Amount</div>
          <div className="text-2xl font-bold text-primary-900">₹{totalAmount.toLocaleString()}</div>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">Withdrawal Requests</h3>
        </div>
        <Table data={requests} columns={columns} emptyMessage="No withdrawal requests found." />
      </Card>

      {/* Approve Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setSelectedRequest(null);
          setSelectedAgentId('');
          setNotes('');
        }}
        title="Approve Withdrawal Request"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsApproveModalOpen(false);
              setSelectedRequest(null);
              setSelectedAgentId('');
              setNotes('');
            }}>Cancel</Button>
            <Button onClick={confirmApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Request
            </Button>
          </>
        }
      >
        {selectedRequest && (
          <div className="space-y-4 p-6">
            <div className="bg-neutral-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Customer:</span>
                  <p className="font-medium text-neutral-900">{selectedRequest.customerName}</p>
                </div>
                <div>
                  <span className="text-neutral-600">Amount:</span>
                  <p className="font-medium text-neutral-900">₹{selectedRequest.amount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-neutral-600">Request Date:</span>
                  <p className="font-medium text-neutral-900">
                    {new Date(selectedRequest.requestDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-600">Account:</span>
                  <p className="font-medium text-neutral-900">{selectedRequest.accountNumber || 'N/A'}</p>
                </div>
              </div>
            </div>

            {withdrawalRequestService.findCustomerBatchAgent(selectedRequest.customerId, batches) && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Auto-assigned:</strong> Customer is in a batch. Agent has been pre-selected.
                </p>
              </div>
            )}

            <Select
              label="Assign Agent"
              placeholder="Select an agent"
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              options={[
                { value: '', label: 'Select Agent' },
                ...agents.map(agent => ({
                  value: agent._id || agent.id || '',
                  label: `${agent.fullName} (${agent.employeeId || ''})`
                }))
              ]}
              required
            />

            <Textarea
              label="Notes (Optional)"
              placeholder="Add any notes about this approval"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedRequest(null);
          setRejectionReason('');
        }}
        title="Reject Withdrawal Request"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsRejectModalOpen(false);
              setSelectedRequest(null);
              setRejectionReason('');
            }}>Cancel</Button>
            <Button variant="danger" onClick={confirmReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject Request
            </Button>
          </>
        }
      >
        {selectedRequest && (
          <div className="space-y-4 p-6">
            <div className="bg-neutral-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Customer:</span>
                  <p className="font-medium text-neutral-900">{selectedRequest.customerName}</p>
                </div>
                <div>
                  <span className="text-neutral-600">Amount:</span>
                  <p className="font-medium text-neutral-900">₹{selectedRequest.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Input
              label="Rejection Reason *"
              placeholder="Please provide a reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default function ViewBranchPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = params?.id as string;
  const { branch, loading, error } = useBranch(branchId);
  const { deleteBranch, loading: isDeleting } = useBranchMutations();
  const { addToast } = useToast();

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

  const handleDelete = async () => {
    if (!branch) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Branch',
      message: `Are you sure you want to delete ${branch.branchName}? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteBranch(branch.id || branch._id || '');
          addToast({ type: 'success', message: 'Branch deleted successfully' });
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          router.push('/branches');
        } catch (err) {
          addToast({ type: 'error', message: 'Failed to delete branch' });
        }
      }
    });
  };

  const getStatusBadge = (status: 'Active' | 'Inactive' | 'Under Maintenance') => {
    switch (status) {
      case 'Active': return <Badge variant="success">{status}</Badge>;
      case 'Inactive': return <Badge variant="neutral">{status}</Badge>;
      case 'Under Maintenance': return <Badge variant="warning">{status}</Badge>;
    }
  };

  if (loading) return <DashboardLayout><div className="p-6"><Skeleton className="h-screen w-full" /></div></DashboardLayout>;
  if (error || !branch) return <DashboardLayout><div className="p-6 text-error-500">{error || 'Branch not found'}</div></DashboardLayout>;

  const TABS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Building className="h-4 w-4" />,
      content: <BranchOverviewTab branch={branch} />,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users className="h-4 w-4" />,
      content: <BranchCustomersList branchName={branch.branchName} />,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <TrendingUp className="h-4 w-4" />,
      content: <BranchTransactionsTab branchName={branch.branchName} />,
    },
    {
      id: 'loans',
      label: 'Loans',
      icon: <DollarSign className="h-4 w-4" />,
      content: <BranchLoansTab branchId={branch.id || branch._id || ''} />,
    },
    {
      id: 'deposits',
      label: 'Deposits',
      icon: <CreditCard className="h-4 w-4" />,
      content: <BranchDepositsTab branchId={branch.id || branch._id || ''} />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 className="h-4 w-4" />,
      content: <BranchAnalyticsTab branchId={branch.id || branch._id || ''} />,
    },
    {
      id: 'withdrawals',
      label: 'Withdrawal Requests',
      icon: <Wallet className="h-4 w-4" />,
      content: <BranchWithdrawalRequestsTab branchId={branch.id || branch._id || ''} branchName={branch.branchName} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Branches', href: '/branches' }, { label: branch.branchName }]} />
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">{branch.branchName}</h1>
              <p className="text-neutral-500">{branch.branchCode} - {branch.branchType}</p>
              <div className="mt-2">{getStatusBadge(branch.status)}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" onClick={() => router.push(`/branches/${branch.id || branch._id}/edit`)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </div>
          </div>
        </Card>

        <Tabs tabs={TABS} />

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

const BranchOverviewTab = ({ branch }: { branch: any }) => (
  <div className="space-y-6 mt-4">
    <BranchKpiCard branch={branch} />
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* Location & Contact Card */}
        <Card>
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-600" />
              Location & Contact
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InfoItem 
                  icon={<MapPin className="h-4 w-4" />} 
                  label="Full Address" 
                  value={`${branch.addressLine1 || ''}${branch.addressLine2 ? ', ' + branch.addressLine2 : ''}, ${branch.city || ''}, ${branch.state || ''} ${branch.postalCode || ''}`.trim() || 'N/A'} 
                />
              </div>
              {branch.landmark && (
                <InfoItem 
                  icon={<Star className="h-4 w-4" />} 
                  label="Landmark" 
                  value={branch.landmark} 
                />
              )}
              <InfoItem 
                icon={<Phone className="h-4 w-4" />} 
                label="Branch Phone" 
                value={branch.phone || 'N/A'} 
              />
              <InfoItem 
                icon={<Mail className="h-4 w-4" />} 
                label="Branch Email" 
                value={branch.email || 'N/A'} 
              />
              {branch.latitude && branch.longitude && (
                <div className="md:col-span-2">
                  <InfoItem 
                    icon={<MapPin className="h-4 w-4" />} 
                    label="Coordinates" 
                    value={
                      <Link 
                        href={`https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1"
                      >
                        {branch.latitude}, {branch.longitude}
                        <span className="text-xs">(Open in Maps)</span>
                      </Link>
                    } 
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Services Offered Card */}
        <Card>
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary-600" />
              Services Offered
            </h2>
          </div>
          <div className="p-6">
            {branch.services && branch.services.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {branch.services.map((service: string) => (
                  <Badge 
                    key={service} 
                    variant="primary"
                    className="px-4 py-2 text-sm font-medium"
                  >
                    <Award className="h-3 w-3 mr-2" />
                    {service}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">No services listed</p>
            )}
          </div>
        </Card>
      </div>

      {/* Right Column - Sidebar Information */}
      <div className="space-y-6">
        {/* Manager Details Card */}
        <Card>
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-600" />
              Manager Details
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <InfoItem 
              icon={<Users className="h-4 w-4" />} 
              label="Manager Name" 
              value={branch.managerName || 'N/A'} 
            />
            <InfoItem 
              icon={<Phone className="h-4 w-4" />} 
              label="Manager Phone" 
              value={branch.managerPhone || 'N/A'} 
            />
          </div>
        </Card>

        {/* Operating Details Card */}
        <Card>
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              Operating Details
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <InfoItem 
              icon={<Calendar className="h-4 w-4" />} 
              label="Opening Date" 
              value={branch.openingDate ? new Date(branch.openingDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} 
            />
            <div className="pt-2 border-t border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-neutral-500" />
                Working Hours
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-md">
                  <span className="text-sm font-medium text-neutral-600">Weekdays</span>
                  <span className="text-sm text-neutral-900 font-medium">{branch.workingHours?.weekdays || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-md">
                  <span className="text-sm font-medium text-neutral-600">Saturday</span>
                  <span className="text-sm text-neutral-900 font-medium">{branch.workingHours?.saturday || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-md">
                  <span className="text-sm font-medium text-neutral-600">Sunday</span>
                  <span className="text-sm text-neutral-900 font-medium">{branch.workingHours?.sunday || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | React.ReactNode }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
      <span className="text-neutral-400">{icon}</span>
      <span>{label}</span>
    </div>
    <div className="text-neutral-900 text-sm pl-6">
      {typeof value === 'string' ? <p>{value}</p> : value}
    </div>
  </div>
);

const BranchAnalyticsTab = ({ branchId }: { branchId: string }) => {
  const [range, setRange] = useState<DayPickerDateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // The analytics service will need to be updated to handle the new date range object
      const performanceData = await analyticsService.getBranchPerformanceData(branchId, range);
      setData(performanceData);
      setLoading(false);
    };
    fetchData();
  }, [branchId, range]);

  if (loading) return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;
  if (!data) return <div className="p-6 text-center">No analytics data available.</div>;

  const trendLabel = 'vs previous period'; // This will need to be made dynamic

  return (
    <div className="space-y-6 mt-4">
      <DateRangeFilter selectedRange={range} onChange={setRange} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCardWithTrend title="New Customers" value={data.newCustomers.value.toString()} trend={data.newCustomers.trend} icon={<Users className="h-6 w-6 text-primary-600" />} trendLabel={trendLabel} />
        <KpiCardWithTrend title="Total Deposits" value={`₹${data.totalDeposits.value.toLocaleString()}`} trend={data.totalDeposits.trend} icon={<CreditCard className="h-6 w-6 text-success-600" />} trendLabel={trendLabel} />
        <KpiCardWithTrend title="Total Loans" value={`₹${data.totalLoans.value.toLocaleString()}`} trend={data.totalLoans.trend} icon={<DollarSign className="h-6 w-6 text-info-600" />} trendLabel={trendLabel} />
        <KpiCardWithTrend title="Loan Recovery" value={`₹${data.loanRecovery.value.toLocaleString()}`} trend={data.loanRecovery.trend} icon={<TrendingUp className="h-6 w-6 text-warning-600" />} trendLabel={trendLabel} />
        <KpiCardWithTrend title="CASA Ratio" value={`${data.casaRatio.value.toFixed(2)}%`} trend={data.casaRatio.trend} icon={<Building className="h-6 w-6 text-error-600" />} trendLabel={trendLabel} />
        <KpiCardWithTrend title="Portfolio at Risk" value={`${data.portfolioAtRisk.value.toFixed(2)}%`} trend={data.portfolioAtRisk.trend} icon={<AlertCircle className="h-6 w-6 text-red-600" />} trendLabel={trendLabel} />
      </div>
      <PerformanceChart data={data.trendChartData} chartType="line" />
      <div className="mt-6">
        <ProductPerformance data={data.productPerformance} />
      </div>
      <Card>
        <h3 className="text-lg font-semibold p-6 border-b">Detailed Performance Data</h3>
        <Table
          columns={[
            { header: 'Month', key: 'name' },
            { header: 'New Customers', key: 'customers' },
            { header: 'Total Deposits', key: 'deposits', render: (val: number) => `₹${val.toLocaleString()}` },
            { header: 'Total Loans', key: 'loans', render: (val: number) => `₹${val.toLocaleString()}` },
          ]}
          data={data.trendChartData}
        />
      </Card>
    </div>
  );
};

const BranchTransactionsTab = ({ branchName }: { branchName: string }) => {
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await customerService.getAllTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch branch transactions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [branchName]);

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: 'Date', key: 'date' },
    { header: 'Transaction ID', key: 'transactionId' },
    { header: 'Customer', key: 'customerId' },
    { header: 'Description', key: 'description' },
    { header: 'Type', key: 'type', render: (type: string) => <Badge variant={type === 'Credit' ? 'success' : 'error'}>{type}</Badge> },
    { header: 'Amount', key: 'amount', render: (amount: number) => `₹${amount.toLocaleString()}` },
  ];

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <Card>
      <Table data={paginatedTransactions} columns={columns} />
      {transactions.length > itemsPerPage && (
        <div className="p-4 border-t">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(transactions.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </Card>
  );
};

const BranchLoansTab = ({ branchId }: { branchId: string }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loanService.getLoans({ branchId }).then(data => {
      setLoans(data);
      setLoading(false);
    });
  }, [branchId]);

  const columns = [
    { header: 'Loan ID', key: 'loanId', render: (loanId: string) => loanId || 'N/A' },
    { header: 'Customer', key: 'customerName' },
    { header: 'Loan Type', key: 'loanType' },
    { header: 'Amount', key: 'loanAmount', render: (amount: number) => `₹${amount.toLocaleString()}` },
    { header: 'Status', key: 'status', render: (status: string) => <Badge>{status}</Badge> },
  ];

  if (loading) return <Skeleton className="h-64 w-full" />;
  return <Card><Table data={loans} columns={columns} /></Card>;
};

const BranchDepositsTab = ({ branchId }: { branchId: string }) => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    depositService.getDeposits({ branchId }).then(data => {
      setDeposits(data);
      setLoading(false);
    });
  }, [branchId]);

  const columns = [
    { header: 'Deposit ID', key: 'depositId' },
    { header: 'Customer', key: 'customerName' },
    { header: 'Deposit Type', key: 'depositType' },
    { header: 'Balance', key: 'currentBalance', render: (balance: number) => `₹${balance.toLocaleString()}` },
    { header: 'Status', key: 'status', render: (status: string) => <Badge>{status}</Badge> },
  ];

  if (loading) return <Skeleton className="h-64 w-full" />;
  return <Card><Table data={deposits} columns={columns} /></Card>;
};

