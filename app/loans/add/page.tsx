'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs } from '@/components/ui';
import { Save, X } from 'lucide-react';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useCustomers } from '@/hooks/useCustomers';
import { useBranches } from '@/hooks/useBranches';
import { useToast } from '@/components/ui/Toast';

export default function AddLoanPage() {
  const router = useRouter();
  const { createLoan, loading: isSubmitting } = useLoanMutations();
  const { customers } = useCustomers();
  const { branches } = useBranches();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    customerId: '',
    loanType: 'Personal Loan' as any,
    loanAmount: '',
    tenure: '',
    branchId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
    if (!formData.tenure) newErrors.tenure = 'Tenure is required';
    if (!formData.branchId) newErrors.branchId = 'Branch is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    try {
      await createLoan({
        customerId: formData.customerId,
        loanType: formData.loanType,
        loanAmount: parseFloat(formData.loanAmount),
        tenure: parseInt(formData.tenure),
        branchId: formData.branchId,
      });
      addToast({ type: 'success', message: 'Loan application created successfully!' });
      router.push('/loans');
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create loan',
      });
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Loans', href: '/loans' },
    { label: 'Add Loan', href: '/loans/add' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">New Loan Application</h1>
            <p className="text-neutral-600 mt-1">Create a new loan application</p>
          </div>
          <Button variant="outline" icon={<X className="h-5 w-5" />} onClick={() => router.push('/loans')}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900">Loan Details</h2>

            <Select
              label="Customer"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              error={errors.customerId}
              options={[
                { value: '', label: 'Select Customer' },
                ...customers.map((c: any) => ({ value: c._id || c.id || '', label: `${c.fullName} - ${c.phone}` })),
              ]}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Loan Type"
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                options={[
                  { value: 'Personal Loan', label: 'Personal Loan' },
                  { value: 'Home Loan', label: 'Home Loan' },
                  { value: 'Business Loan', label: 'Business Loan' },
                  { value: 'Education Loan', label: 'Education Loan' },
                  { value: 'Vehicle Loan', label: 'Vehicle Loan' },
                  { value: 'Gold Loan', label: 'Gold Loan' },
                ]}
                required
              />
              <Select
                label="Branch"
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                error={errors.branchId}
                options={[
                  { value: '', label: 'Select Branch' },
                  ...branches.map((b) => ({ value: b.id, label: b.branchName })),
                ]}
                required
              />
              <Input
                label="Loan Amount (₹)"
                name="loanAmount"
                type="number"
                value={formData.loanAmount}
                onChange={handleChange}
                error={errors.loanAmount}
                placeholder="e.g., 500000"
                required
              />
              <Input
                label="Tenure (months)"
                name="tenure"
                type="number"
                value={formData.tenure}
                onChange={handleChange}
                error={errors.tenure}
                placeholder="e.g., 60"
                required
              />
            </div>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.push('/loans')}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} icon={<Save className="h-5 w-5" />}>
              Create Loan
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

