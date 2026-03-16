'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Search,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useBatchMutations } from '@/hooks/useBatchMutations';
import { CreateBatchDto, BatchStatus } from '@/services/batch.service';
import { useEmployees } from '@/hooks/useEmployees';
import { useCustomers } from '@/hooks/useCustomers';
import { useBranches } from '@/hooks/useBranches';
import { useOrganizations } from '@/hooks/useOrganizations';
import { getOrganisationId, getBranchId, isAdmin } from '@/lib/auth';
import Link from 'next/link';

function extractBranchId(ref: unknown): string {
  if (!ref) return '';
  if (typeof ref === 'string') return ref;
  const obj = ref as Record<string, unknown>;
  const id = obj?._id ?? obj?.id ?? (obj as any)?.$oid;
  if (typeof id === 'string') return id;
  if (id && typeof (id as any)?.toString === 'function') return (id as any).toString();
  return '';
}

export default function AddBatchPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { createBatch, loading: isSubmitting } = useBatchMutations();
  const { employees: allEmployees } = useEmployees({ limit: 500 });
  const { customers } = useCustomers();
  const { branches, setFilters: setBranchFilters } = useBranches();
  const { organizations } = useOrganizations();

  const [formData, setFormData] = useState<Partial<CreateBatchDto>>({
    batchName: '',
    batchCode: '',
    employeeId: '',
    organisation: '',
    branch: '',
    customers: [],
    assignmentDate: new Date().toISOString().split('T')[0],
    status: BatchStatus.Active,
  });

  // Filter employees to get agents for the selected branch
  const agentEmployees = useMemo(() => {
    const branchId = formData.branch ? String(formData.branch) : '';
    return (allEmployees || []).filter(emp => {
      const isAgent =
        emp.role?.toLowerCase().includes('agent') ||
        emp.designation?.toLowerCase().includes('agent') ||
        emp.department?.toLowerCase().includes('agent');
      if (!isAgent) return false;
      if (!branchId) return true;
      const empBranchId = extractBranchId(emp.branch as any);
      return empBranchId === branchId;
    });
  }, [allEmployees, formData.branch]);

  const isUserAdmin = isAdmin();

  // Filter branches by selected organisation
  useEffect(() => {
    const orgId = formData.organisation || getOrganisationId() || '';
    setBranchFilters(prev => ({ ...prev, organisationId: orgId || undefined }));
  }, [formData.organisation, setBranchFilters]);

  // Preselect organisation and branch from user profile (default for all)
  useEffect(() => {
    const orgId = getOrganisationId();
    const branchId = getBranchId();
    setFormData(prev => ({
      ...prev,
      ...(orgId && { organisation: orgId }),
      ...(branchId && { branch: branchId }),
    }));
  }, []);

  // For admins: if no organisation set from profile, default to first organisation once loaded
  useEffect(() => {
    if (!isUserAdmin) return;
    if (formData.organisation) return;
    if (!organizations || organizations.length === 0) return;
    const first = organizations[0];
    const firstId = String(first._id || first.id || '');
    if (!firstId) return;
    setFormData(prev => ({ ...prev, organisation: firstId, branch: '' }));
  }, [isUserAdmin, organizations, formData.organisation]);

  // Branch: auto-select for non-admin from selected employee
  useEffect(() => {
    if (isUserAdmin) return;
    if (!formData.employeeId || !agentEmployees.length) return;
    const empId = String(formData.employeeId);
    const emp = agentEmployees.find(e => String(e._id || e.id) === empId);
    const branchId = emp ? extractBranchId(emp.branch) : '';
    const authBranchId = getBranchId();
    const fallbackBranchId = branchId || authBranchId || '';
    setFormData(prev => ({ ...prev, branch: fallbackBranchId }));
  }, [formData.employeeId, agentEmployees, isUserAdmin]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
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
    if (!formData.organisation || formData.organisation === '') {
      newErrors.organisation = 'Organization is required';
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
      const fieldName =
        firstError[0] === 'employeeId'
          ? 'Employee/Agent'
          : firstError[0] === 'assignmentDate'
          ? 'Assignment Date'
          : firstError[0] === 'organisation'
          ? 'Organization'
          : firstError[0].charAt(0).toUpperCase() + firstError[0].slice(1);
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
      const batchData: CreateBatchDto = {
        batchName: formData.batchName!,
        batchCode: formData.batchCode,
        employeeId: formData.employeeId!,
        organisation: formData.organisation || undefined,
        branch: formData.branch || undefined,
        customers: selectedCustomers.length > 0 ? selectedCustomers : undefined,
        assignmentDate: formData.assignmentDate!,
        status: formData.status || BatchStatus.Active,
      };

      await createBatch(batchData);
      addToast({
        type: 'success',
        message: 'Batch created successfully',
      });
      router.push('/agents');
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to create batch',
      });
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Agents', href: '/agents' },
    { label: 'Create Batch', href: '/agents/batches/add' },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Create Batch</h1>
            <p className="text-neutral-600 mt-1">Create a new customer batch and assign an agent</p>
          </div>
          <Link href="/agents">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organisation and Branch */}
        <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Organisation & Branch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Organization"
                name="organisation"
                value={formData.organisation || ''}
                onChange={handleChange}
                disabled
                error={errors.organisation}
                options={
                  isUserAdmin
                    ? [
                        { value: '', label: 'Select Organization' },
                        ...(organizations || []).map(org => ({
                          value: org._id || org.id || '',
                          label:
                            org.organisationName ||
                            org.organizationName ||
                            org.name ||
                            'Unknown',
                        })),
                      ]
                    : (() => {
                        const currentId = formData.organisation || getOrganisationId() || '';
                        const match =
                          (organizations || []).find(
                            org => String(org._id || org.id) === String(currentId)
                          ) || null;
                        if (!match) {
                          return currentId
                            ? [{ value: String(currentId), label: 'Current Organization' }]
                            : [{ value: '', label: 'Select Organization' }];
                        }
                        return [
                          {
                            value: String(match._id || match.id),
                            label:
                              match.organisationName ||
                              match.organizationName ||
                              match.name ||
                              'Unknown',
                          },
                        ];
                      })()
                }
                required
              />
              <Select
                label="Branch"
                name="branch"
                value={formData.branch || ''}
                onChange={handleChange}
                disabled={!isUserAdmin}
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

          

          {/* Assignment Date */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Assignment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Assignment Date *"
                type="date"
                name="assignmentDate"
                value={typeof formData.assignmentDate === 'string' ? formData.assignmentDate : 
                       formData.assignmentDate instanceof Date ? formData.assignmentDate.toISOString().split('T')[0] : 
                       new Date().toISOString().split('T')[0]}
                onChange={handleChange}
                error={errors.assignmentDate}
                required
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
            <div className="mb-4">
              <Input
                placeholder="Search by name, email, phone, or member ID..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="max-h-96 overflow-y-auto border border-neutral-200 rounded-lg p-4">
              {filteredCustomers && filteredCustomers.length > 0 ? (
                <div className="space-y-2">
                  {filteredCustomers.map((customer) => (
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
                <p className="text-neutral-500 text-center py-8">
                  {customerSearch.trim() ? 'No customers match your search' : 'No customers available'}
                </p>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/agents">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" type="submit" loading={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              Create Batch
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

