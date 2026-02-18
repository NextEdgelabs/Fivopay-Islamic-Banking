'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Select,
  Pagination,
  Input,
} from '@/components/ui';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Package,
  Users,
  CheckCircle,
  XCircle,
  User,
  Trash2,
  Building,
  TrendingUp,
  Search,
} from 'lucide-react';
import { useBatch } from '@/hooks/useBatch';
import { useBatchMutations } from '@/hooks/useBatchMutations';
import { useToast } from '@/components/ui/Toast';
import { Batch, BatchStatus } from '@/services/batch.service';
import { getBatchCustomers } from '@/services/batch.service';
import { Customer } from '@/services/customers.service';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useBranches } from '@/hooks/useBranches';
import Link from 'next/link';

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

export default function ViewBatchPage() {
  const router = useRouter();
  const params = useParams();
  const batchId = params?.id as string;
  const { addToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<BatchStatus>(BatchStatus.Active);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerSearch, setCustomerSearch] = useState('');
  const itemsPerPage = 10;

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase().trim();
    return customers.filter(
      (c) =>
        (c.fullName || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.memberId || '').toLowerCase().includes(q) ||
        ((c as any).customerId || '').toLowerCase().includes(q)
    );
  }, [customers, customerSearch]);

  const { batch, loading, error, refetch } = useBatch(batchId);
  const { deleteBatch, updateBatchStatus, loading: isDeleting } = useBatchMutations();
  const { organizations } = useOrganizations();
  const { branches } = useBranches();

  // Fetch batch customers
  useEffect(() => {
    if (batchId) {
      setCustomersLoading(true);
      getBatchCustomers(batchId, { page: currentPage, limit: itemsPerPage })
        .then(response => {
          if (response.success) {
            setCustomers(response.data.customers || []);
          }
        })
        .catch(err => {
          console.error('Failed to fetch batch customers:', err);
        })
        .finally(() => {
          setCustomersLoading(false);
        });
    }
  }, [batchId, currentPage]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!batch) return;

    try {
      await deleteBatch(batchId);
      addToast({
        type: 'success',
        message: `Batch "${batch.batchName}" has been deleted successfully`,
      });
      router.push('/agents');
    } catch (err: any) {
      addToast({
        type: 'error',
        message: err.message || 'Failed to delete batch',
      });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleStatusUpdate = () => {
    if (!batch) return;
    setNewStatus(batch.status);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!batch) return;

    try {
      await updateBatchStatus(batchId, newStatus);
      addToast({
        type: 'success',
        message: `Batch status updated to ${newStatus}`,
      });
      refetch();
      setShowStatusModal(false);
    } catch (err: any) {
      addToast({
        type: 'error',
        message: err.message || 'Failed to update batch status',
      });
    }
  };

  const getOrganizationName = (orgId?: string | { _id: string; organisationName?: string; organizationName?: string; name?: string }) => {
    if (!orgId) return 'N/A';
    if (typeof orgId === 'string') {
      const org = organizations.find(o => (o._id || o.id) === orgId);
      return org?.organisationName || org?.organizationName || org?.name || 'N/A';
    }
    return orgId.organisationName || orgId.organizationName || orgId.name || 'N/A';
  };

  const getBranchName = (branchId?: string | { _id: string; branchName: string }) => {
    if (!branchId) return 'N/A';
    if (typeof branchId === 'string') {
      const branch = branches.find(b => (b._id || b.id) === branchId);
      return branch?.branchName || 'N/A';
    }
    return branchId.branchName || 'N/A';
  };

  const getEmployeeName = () => {
    if (!batch) return 'N/A';
    const employee = typeof batch.employeeId === 'object' ? batch.employeeId : batch.employee;
    if (!employee || typeof employee === 'string') return 'N/A';
    return `${employee.fullName} (${employee.employeeId})`;
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

  if (error || !batch) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <div className="p-12 text-center">
              <XCircle className="h-16 w-16 text-error-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Failed to Load Batch</h2>
              <p className="text-neutral-600 mb-6">{error || 'Batch not found'}</p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => router.push('/agents')}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Batches
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

  // Customer columns for table
  const customerColumns = [
    {
      key: 'fullName',
      header: 'Customer',
      sortable: true,
      render: (_: any, row: Customer) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback={row.fullName} />
          <div>
            <p className="font-medium text-neutral-900">{row.fullName}</p>
            <p className="text-sm text-neutral-500">{row.memberId || row.customerId || row._id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (_: any, row: Customer) => (
        <div>
          <p className="text-sm text-neutral-900 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {row.email}
          </p>
          <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
            <Phone className="h-3 w-3" />
            {row.phone}
          </p>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Location',
      render: (_: any, row: Customer) => (
        <div>
          <p className="text-sm text-neutral-900">
            {row.city && row.state ? `${row.city}, ${row.state}` : 'N/A'}
          </p>
          <p className="text-sm text-neutral-500">
            {row.postalCode || 'N/A'}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'success' : value === 'Pending' ? 'warning' : 'error'}>
          {value || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Customer) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/customers/${row._id || row.id}`)}
          >
            <User className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      ),
    },
  ];

  // Overview Tab
  const BatchOverviewTab = ({ batch }: { batch: Batch }) => {
    const employee = typeof batch.employeeId === 'object' ? batch.employeeId : batch.employee;
    const employeeObj = employee && typeof employee !== 'string' ? employee : null;

    return (
      <div className="space-y-6 mt-4">
        {/* Batch Information */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Batch Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<Package className="h-4 w-4" />} label="Batch Name" value={batch.batchName} />
            <InfoItem icon={<Package className="h-4 w-4" />} label="Batch Code" value={batch.batchCode || 'N/A'} />
            <InfoItem 
              icon={<Calendar className="h-4 w-4" />} 
              label="Assignment Date" 
              value={batch.assignmentDate ? new Date(batch.assignmentDate).toLocaleDateString() : 'N/A'} 
            />
            <InfoItem 
              icon={<Calendar className="h-4 w-4" />} 
              label="Completion Date" 
              value={batch.completionDate ? new Date(batch.completionDate).toLocaleDateString() : 'N/A'} 
            />
            <div>
              <span className="text-sm font-medium text-neutral-600 flex items-center mb-1 gap-2">
                <CheckCircle className="h-4 w-4" />
                Status
              </span>
              <Badge
                variant={
                  batch.status === BatchStatus.Active ? 'success' :
                  batch.status === BatchStatus.Completed ? 'primary' :
                  batch.status === BatchStatus.Closed ? 'error' : 'neutral'
                }
              >
                {batch.status}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Employee/Agent Information */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Assigned Employee/Agent</h3>
          {employeeObj ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Avatar size="md" fallback={employeeObj.fullName} />
                <div>
                  <p className="font-medium text-neutral-900">{employeeObj.fullName}</p>
                  <p className="text-sm text-neutral-500">{employeeObj.employeeId}</p>
                </div>
              </div>
              <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={employeeObj.email} />
              <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={employeeObj.phone} />
              <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Department" value={employeeObj.department?.replace('_', ' ')} />
              <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Designation" value={employeeObj.designation} />
            </div>
          ) : (
            <p className="text-neutral-500">No employee assigned</p>
          )}
        </Card>

        {/* Organisation & Branch */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Organisation & Branch</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<Building className="h-4 w-4" />} label="Organization" value={getOrganizationName(batch.organisation)} />
            <InfoItem icon={<Building className="h-4 w-4" />} label="Branch" value={getBranchName(batch.branch)} />
          </div>
        </Card>

        {/* Statistics */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-neutral-900">{batch.totalCustomers || 0}</p>
              <p className="text-sm text-neutral-600">Total Customers</p>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-success-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-neutral-900">{batch.processedCustomers || 0}</p>
              <p className="text-sm text-neutral-600">Processed Customers</p>
            </div>
            <div className="text-center p-4 bg-info-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-info-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-neutral-900">
                {batch.totalCustomers ? Math.round((batch.processedCustomers || 0) / batch.totalCustomers * 100) : 0}%
              </p>
              <p className="text-sm text-neutral-600">Completion Rate</p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Customers Tab
  const BatchCustomersTab = () => {
    const displayCustomers = filteredCustomers;
    const totalPages = Math.ceil(displayCustomers.length / itemsPerPage) || 1;
    const paginatedCustomers = displayCustomers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
      <div className="space-y-6 mt-4">
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-neutral-900">Customers in Batch</h3>
              <Badge variant="neutral">
                {customers.length} of {batch?.totalCustomers || 0} customers
              </Badge>
            </div>
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search customers..."
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setCurrentPage(1);
                }}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
          </div>
          
          {customersLoading ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500">Loading customers...</p>
            </div>
          ) : displayCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500 mb-4">
                {customerSearch.trim() ? 'No customers match your search' : 'No customers in this batch'}
              </p>
              {!customerSearch.trim() && (
                <p className="text-sm text-neutral-400">Add customers to this batch to get started</p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table data={paginatedCustomers} columns={customerColumns} />
              </div>
              {totalPages > 1 && (
                <div className="p-4 border-t mt-6 flex items-center justify-between">
                  <p className="text-sm text-neutral-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, displayCustomers.length)} of{' '}
                    {displayCustomers.length} customers
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    );
  };

  const TABS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Package className="h-4 w-4" />,
      content: <BatchOverviewTab batch={batch} />,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users className="h-4 w-4" />,
      content: <BatchCustomersTab />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Agents', href: '/agents' },
          { label: 'Batches', href: '/agents' },
          { label: batch.batchName },
        ]} />
        
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-stripe flex items-center justify-center">
                <Package className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{batch.batchName}</h1>
                <p className="text-neutral-600 mt-1">
                  {batch.batchCode || batch._id || batch.id} • {getEmployeeName()}
                </p>
                <div className="mt-2">
                  <Badge
                    variant={
                      batch.status === BatchStatus.Active ? 'success' :
                      batch.status === BatchStatus.Completed ? 'primary' :
                      batch.status === BatchStatus.Closed ? 'error' : 'neutral'
                    }
                  >
                    {batch.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" onClick={handleStatusUpdate}>
                <CheckCircle className="mr-2 h-4 w-4" /> Update Status
              </Button>
              <Button variant="outline" onClick={() => router.push(`/agents/batches/${batchId}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs tabs={TABS} defaultTab="overview" />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          title="Confirm Delete Batch"
          size="sm"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-error-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Delete {batch.batchName}?
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  This action cannot be undone. All batch data and customer assignments will be permanently deleted.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Batch
              </Button>
            </div>
          </div>
        </Modal>

        {/* Status Update Modal */}
        <Modal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title="Update Batch Status"
          size="sm"
        >
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                New Status
              </label>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as BatchStatus)}
                options={[
                  { value: BatchStatus.Active, label: 'Active' },
                  { value: BatchStatus.Inactive, label: 'Inactive' },
                  { value: BatchStatus.Completed, label: 'Completed' },
                  { value: BatchStatus.Closed, label: 'Closed' },
                ]}
              />
            </div>
            
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmStatusUpdate}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

