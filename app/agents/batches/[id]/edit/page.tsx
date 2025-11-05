'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Input,
  Select,
  Breadcrumbs,
} from '@/components/ui';
import {
  Save,
  ArrowLeft,
  Users,
  Calendar,
  Package,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useBatch } from '@/hooks/useBatch';
import { useBatchMutations } from '@/hooks/useBatchMutations';
import { UpdateBatchDto, BatchStatus, getBatchCustomers } from '@/services/batch.service';
import { useEmployees } from '@/hooks/useEmployees';
import { useCustomers } from '@/hooks/useCustomers';
import { useBranches } from '@/hooks/useBranches';
import { useOrganizations } from '@/hooks/useOrganizations';
import Link from 'next/link';

export default function EditBatchPage() {
  const router = useRouter();
  const params = useParams();
  const batchId = params?.id as string;
  const { addToast } = useToast();
  const { batch, loading: loadingBatch } = useBatch(batchId);
  const { updateBatch, loading: isSubmitting } = useBatchMutations();
  const { employees: allEmployees } = useEmployees();
  const { customers } = useCustomers();
  const { branches } = useBranches();
  const { organizations } = useOrganizations();

  // Filter employees to get agents
  const agentEmployees = useMemo(() => {
    return (allEmployees || []).filter(emp => 
      emp.role?.toLowerCase().includes('agent') || 
      emp.designation?.toLowerCase().includes('agent') ||
      emp.department?.toLowerCase().includes('agent')
    );
  }, [allEmployees]);

  const [formData, setFormData] = useState<Partial<UpdateBatchDto>>({
    batchName: '',
    batchCode: '',
    employeeId: '',
    organisation: '',
    branch: '',
    assignmentDate: '',
    status: BatchStatus.Active,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Fetch batch customers when batch is loaded
  useEffect(() => {
    if (batchId && batch) {
      setLoadingCustomers(true);
      getBatchCustomers(batchId, { page: 1, limit: 1000 })
        .then(response => {
          if (response.success && response.data.customers) {
            const customerIds = response.data.customers.map((c: any) => c._id || c.id || '');
            setSelectedCustomers(customerIds.filter((id: string) => id));
          }
        })
        .catch(err => {
          console.error('Failed to fetch batch customers:', err);
        })
        .finally(() => {
          setLoadingCustomers(false);
        });
    }
  }, [batchId, batch]);

  // Prefill form when batch data is loaded
  useEffect(() => {
    if (batch) {
      setFormData({
        batchName: batch.batchName || '',
        batchCode: batch.batchCode || '',
        employeeId: typeof batch.employeeId === 'string' 
          ? batch.employeeId 
          : (batch.employeeId as any)?._id || (batch.employeeId as any)?.id || '',
        organisation: typeof batch.organisation === 'string' 
          ? batch.organisation 
          : (batch.organisation as any)?._id || (batch.organisation as any)?.id || '',
        branch: typeof batch.branch === 'string' 
          ? batch.branch 
          : (batch.branch as any)?._id || (batch.branch as any)?.id || '',
        assignmentDate: batch.assignmentDate 
          ? (typeof batch.assignmentDate === 'string' 
              ? batch.assignmentDate.split('T')[0] 
              : new Date(batch.assignmentDate).toISOString().split('T')[0])
          : '',
        completionDate: batch.completionDate
          ? (typeof batch.completionDate === 'string'
              ? batch.completionDate.split('T')[0]
              : new Date(batch.completionDate).toISOString().split('T')[0])
          : undefined,
        status: batch.status || BatchStatus.Active,
      });
    }
  }, [batch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.batchName || formData.batchName.trim() === '') {
      newErrors.batchName = 'Batch name is required';
    }
    if (!formData.employeeId || formData.employeeId === '') {
      newErrors.employeeId = 'Employee/Agent is required';
    }
    if (!formData.assignmentDate) {
      newErrors.assignmentDate = 'Assignment date is required';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.entries(newErrors)[0];
      const fieldName = firstError[0] === 'employeeId' ? 'Employee/Agent' : 
                       firstError[0] === 'assignmentDate' ? 'Assignment Date' :
                       firstError[0].charAt(0).toUpperCase() + firstError[0].slice(1);
      addToast({
        type: 'error',
        message: `${fieldName}: ${firstError[1]}`,
      });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updateData: UpdateBatchDto = {
        batchName: formData.batchName,
        batchCode: formData.batchCode,
        employeeId: formData.employeeId,
        organisation: formData.organisation || undefined,
        branch: formData.branch || undefined,
        customers: selectedCustomers.length > 0 ? selectedCustomers : undefined,
        assignmentDate: formData.assignmentDate,
        completionDate: formData.completionDate || undefined,
        status: formData.status,
      };

      await updateBatch(batchId, updateData);
      addToast({
        type: 'success',
        message: 'Batch updated successfully',
      });
      router.push(`/agents/batches/${batchId}`);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to update batch',
      });
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Agents', href: '/agents' },
    { label: 'Batches', href: '/agents' },
    { label: batch?.batchName || 'Edit Batch', href: `/agents/batches/${batchId}` },
    { label: 'Edit', href: `/agents/batches/${batchId}/edit` },
  ];

  if (loadingBatch) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6 animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!batch) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <div className="p-12 text-center">
              <p className="text-error-500 mb-4">Batch not found</p>
              <Link href="/agents">
                <Button variant="primary">Back to Batches</Button>
              </Link>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Edit Batch</h1>
            <p className="text-neutral-600 mt-1">Update batch information</p>
          </div>
          <Link href={`/agents/batches/${batchId}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Batch Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Batch Name *"
                name="batchName"
                value={formData.batchName || ''}
                onChange={handleChange}
                error={errors.batchName}
                required
              />
              <Input
                label="Batch Code"
                name="batchCode"
                value={formData.batchCode || ''}
                onChange={handleChange}
                placeholder="Auto-generated if not provided"
              />
              <Select
                label="Employee/Agent *"
                name="employeeId"
                value={formData.employeeId || ''}
                onChange={handleChange}
                error={errors.employeeId}
                options={[
                  { value: '', label: 'Select Agent' },
                  ...agentEmployees.map(emp => ({ 
                    value: emp._id || emp.id || '', 
                    label: `${emp.fullName} (${emp.employeeId})` 
                  }))
                ]}
                required
              />
              <Select
                label="Status"
                name="status"
                value={formData.status || BatchStatus.Active}
                onChange={handleChange}
                options={[
                  { value: BatchStatus.Active, label: 'Active' },
                  { value: BatchStatus.Inactive, label: 'Inactive' },
                  { value: BatchStatus.Completed, label: 'Completed' },
                  { value: BatchStatus.Closed, label: 'Closed' },
                ]}
              />
            </div>
          </Card>

          {/* Organisation and Branch */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Organisation & Branch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Organization"
                name="organisation"
                value={formData.organisation || ''}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Organization' },
                  ...(organizations || []).map(org => ({ 
                    value: org._id || org.id || '', 
                    label: org.organisationName || org.organizationName || org.name || 'Unknown' 
                  }))
                ]}
              />
              <Select
                label="Branch"
                name="branch"
                value={formData.branch || ''}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Branch' },
                  ...(branches || []).map(b => ({ 
                    value: b._id || b.id || '', 
                    label: b.branchName 
                  }))
                ]}
              />
            </div>
          </Card>

          {/* Assignment Details */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Assignment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Assignment Date *"
                type="date"
                name="assignmentDate"
                value={formData.assignmentDate ? (typeof formData.assignmentDate === 'string' ? formData.assignmentDate : formData.assignmentDate.toISOString().split('T')[0]) : ''}
                onChange={handleChange}
                error={errors.assignmentDate}
                required
              />
              <Input
                label="Completion Date"
                type="date"
                name="completionDate"
                value={formData.completionDate ? (typeof formData.completionDate === 'string' ? formData.completionDate : formData.completionDate.toISOString().split('T')[0]) : ''}
                onChange={handleChange}
              />
            </div>
          </Card>

          {/* Customer Selection */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Select Customers</h3>
              <span className="text-sm text-neutral-600">
                {selectedCustomers.length} customer(s) selected
              </span>
            </div>
            {loadingCustomers ? (
              <div className="p-12 text-center">
                <p className="text-neutral-500">Loading customers...</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto border border-neutral-200 rounded-lg p-4">
                {customers && customers.length > 0 ? (
                  <div className="space-y-2">
                    {customers.map((customer) => (
                      <label
                        key={customer._id || customer.id}
                        className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer._id || customer.id || '')}
                          onChange={() => handleCustomerToggle(customer._id || customer.id || '')}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">{customer.fullName}</p>
                          <p className="text-sm text-neutral-500">
                            {customer.memberId || customer.customerId || customer._id} • {customer.email} • {customer.phone}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-center py-8">No customers available</p>
                )}
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href={`/agents/batches/${batchId}`}>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" type="submit" loading={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              Update Batch
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

