'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs, Skeleton } from '@/components/ui';
import { BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { Save, X } from 'lucide-react';
import { useLoan } from '@/hooks/useLoan';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
import { useToast } from '@/components/ui/Toast';
import { useBranches } from '@/hooks/useBranches';
import { useOrganizations } from '@/hooks/useOrganizations';
import { getOrganisationId, isAdmin } from '@/lib/auth';

function extractId(ref: unknown): string {
  if (!ref) return '';
  if (typeof ref === 'string') return ref;
  const obj = ref as Record<string, unknown>;
  const id = obj?._id ?? obj?.id;
  if (typeof id === 'string') return id;
  if (id && typeof id === 'object' && '$oid' in (id as object)) return (id as { $oid: string }).$oid;
  return '';
}

export default function EditLoanPage() {
  const params = useParams();
  const router = useRouter();
  const loanId = params.id as string;
  const { loan, loading: fetchLoading } = useLoan(loanId);
  const { updateLoan, loading: isSubmitting } = useLoanMutations();
  const { rateLabel } = useInterestProfitTerm();
  const { addToast } = useToast();
  const { branches, setFilters: setBranchFilters } = useBranches();
  const { organizations } = useOrganizations();
  const isUserAdmin = isAdmin();

  const [formData, setFormData] = useState({
    loanAmount: '',
    tenure: '',
    interestRate: '',
    status: '' as any,
    loanSource: 'online' as 'walkin' | 'online',
    organisation: '',
    branchId: '',
  });

  useEffect(() => {
    if (loan) {
      const orgId = isUserAdmin
        ? (extractId((loan as any).organisation) || extractId((loan as any).organization) || getOrganisationId() || '')
        : (getOrganisationId() || extractId((loan as any).organisation) || extractId((loan as any).organization) || '');
      const branchId = isUserAdmin
        ? (extractId((loan as any).branchId) || extractId((loan as any).branch) || '')
        : (extractId((loan as any).branchId) || extractId((loan as any).branch) || '');
      setFormData({
        loanAmount: loan?.loanAmount?.toString() || loan?.amount?.toString() || '',
        tenure: loan?.tenure?.toString() || '',
        interestRate: loan?.interestRate?.toString() || '',
        status: loan.status,
        loanSource: (loan?.loanSource || 'online') as 'walkin' | 'online',
        organisation: orgId,
        branchId,
      });
    }
  }, [loan, isUserAdmin]);

  // Filter branches by selected organisation
  useEffect(() => {
    const orgId = formData.organisation || getOrganisationId() || '';
    setBranchFilters(prev => ({ ...prev, organisationId: orgId || undefined }));
  }, [formData.organisation, setBranchFilters]);

  // For admins: if no organisation after prefill, default to first organisation once loaded
  useEffect(() => {
    if (!isUserAdmin) return;
    if (formData.organisation) return;
    if (!organizations || organizations.length === 0) return;
    const first = organizations[0];
    const firstId = String(first._id || first.id || '');
    if (!firstId) return;
    setFormData(prev => ({ ...prev, organisation: firstId, branchId: '' }));
  }, [isUserAdmin, organizations, formData.organisation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'organisation') {
      setFormData((prev) => ({ ...prev, [name]: value, branchId: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateLoan(loanId, {
        amount: parseFloat(formData.loanAmount),
        tenure: parseInt(formData.tenure),
        interestRate: parseFloat(formData.interestRate),
        status: formData.status as any,
        loanSource: formData.loanSource,
        branchId: formData.branchId || undefined,
        organisation: formData.organisation || undefined,
      });
      addToast({ type: 'success', message: 'Loan updated successfully!' });
      router.push(`/loans/${loanId}`);
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update loan',
      });
    }
  };

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!loan) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="p-6 text-center text-error-500">
            <p>Loan not found</p>
            <Button onClick={() => router.push('/loans')} className="mt-4">
              Back to Loans
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Loans', href: '/loans' },
    { label: loan.loanId, href: `/loans/${loan.id}` },
    { label: 'Edit', href: `/loans/${loan.id}/edit` },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={breadcrumbItems as BreadcrumbItem[]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Edit Loan</h1>
            <p className="text-neutral-600 mt-1">Update loan information</p>
          </div>
          <Button
            variant="outline"
            icon={<X className="h-5 w-5" />}
            onClick={() => router.push(`/loans/${loanId}`)}
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900">Loan Details</h2>

            {(organizations?.length ?? 0) > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Organization"
                  name="organisation"
                  value={formData.organisation || ''}
                  onChange={handleChange}
                  disabled={true}
                  options={
                    isUserAdmin
                      ? [
                          { value: '', label: 'Select Organization' },
                          ...(organizations || []).map((org) => ({
                            value: String(org._id || (org as any).id || ''),
                            label: org.organisationName || (org as any).organizationName || org.name || 'Unknown',
                          })),
                        ]
                      : (() => {
                          const currentId = formData.organisation || getOrganisationId() || '';
                          const match = (organizations || []).find((o) => String(o._id || o.id) === String(currentId));
                          return match
                            ? [{ value: String(match._id || match.id), label: match.organisationName || (match as any).organizationName || match.name || 'Unknown' }]
                            : currentId ? [{ value: String(currentId), label: 'Current Organization' }] : [{ value: '', label: 'Select Organization' }];
                        })()
                  }
                />
                <Select
                  label="Branch"
                  name="branchId"
                  value={formData.branchId || ''}
                  onChange={handleChange}
                  disabled={!isUserAdmin}
                  options={[
                    { value: '', label: 'Select Branch' },
                    ...(branches || []).map((b) => ({
                      value: String(b._id || (b as any).id || ''),
                      label: b.branchName,
                    })),
                  ]}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Loan Amount (₹)"
                name="loanAmount"
                type="number"
                value={formData.loanAmount}
                onChange={handleChange}
                required
              />
              <Input
                label="Tenure (months)"
                name="tenure"
                type="number"
                value={formData.tenure}
                onChange={handleChange}
                required
              />
              <Input
                label={`${rateLabel} (%)`}
                name="interestRate"
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={handleChange}
                required
              />
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Under Review', label: 'Under Review' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Rejected', label: 'Rejected' },
                  { value: 'Disbursed', label: 'Disbursed' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Closed', label: 'Closed' },
                ]}
                required
              />
              <Select
                label="Loan Status (Channel)"
                name="loanSource"
                value={formData.loanSource}
                onChange={handleChange}
                options={[
                  { value: 'walkin', label: 'Walk-in' },
                  { value: 'online', label: 'Online' },
                ]}
              />
            </div>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/loans/${loanId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} icon={<Save className="h-5 w-5" />}>
              Update Loan
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

