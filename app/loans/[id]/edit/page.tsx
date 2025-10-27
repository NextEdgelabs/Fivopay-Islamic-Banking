'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs, Skeleton } from '@/components/ui';
import { Save, X } from 'lucide-react';
import { useLoan } from '@/hooks/useLoan';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useToast } from '@/components/ui/Toast';

export default function EditLoanPage() {
  const params = useParams();
  const router = useRouter();
  const loanId = params.id as string;
  const { loan, loading: fetchLoading } = useLoan(loanId);
  const { updateLoan, loading: isSubmitting } = useLoanMutations();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    loanAmount: '',
    tenure: '',
    interestRate: '',
    status: '' as any,
  });

  useEffect(() => {
    if (loan) {
      setFormData({
        loanAmount: loan.loanAmount.toString(),
        tenure: loan.tenure.toString(),
        interestRate: loan.interestRate.toString(),
        status: loan.status,
      });
    }
  }, [loan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateLoan(loanId, {
        loanAmount: parseFloat(formData.loanAmount),
        tenure: parseInt(formData.tenure),
        interestRate: parseFloat(formData.interestRate),
        status: formData.status,
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
        <Breadcrumbs items={breadcrumbItems} />

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
                label="Interest Rate (%)"
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

