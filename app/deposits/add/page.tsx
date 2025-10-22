'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs } from '@/components/ui';
import { Save, X } from 'lucide-react';
import { useDepositMutations } from '@/hooks/useDepositMutations';
import { useCustomers } from '@/hooks/useCustomers';
import { useBranches } from '@/hooks/useBranches';
import { useToast } from '@/components/ui/Toast';

export default function AddDepositPage() {
  const router = useRouter();
  const { createDeposit, loading: isSubmitting } = useDepositMutations();
  const { customers } = useCustomers();
  const { branches } = useBranches();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    customerId: '',
    depositType: 'Savings Account' as any,
    depositAmount: '',
    tenure: '',
    branchId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createDeposit({
        customerId: formData.customerId,
        depositType: formData.depositType,
        depositAmount: parseFloat(formData.depositAmount),
        tenure: formData.tenure ? parseInt(formData.tenure) : undefined,
        branchId: formData.branchId,
      });
      addToast({ type: 'success', message: 'Deposit created successfully!' });
      router.push('/deposits');
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to create deposit' });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Deposits', href: '/deposits' },
          { label: 'Add Deposit', href: '/deposits/add' },
        ]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">New Deposit Account</h1>
            <p className="text-neutral-600 mt-1">Create a new deposit account</p>
          </div>
          <Button variant="outline" icon={<X className="h-5 w-5" />} onClick={() => router.push('/deposits')}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900">Deposit Details</h2>

            <Select
              label="Customer"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select Customer' },
                ...customers.map((c: any) => ({ value: c._id || c.id || '', label: `${c.fullName} - ${c.phone}` })),
              ]}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Deposit Type"
                name="depositType"
                value={formData.depositType}
                onChange={handleChange}
                options={[
                  { value: 'Savings Account', label: 'Savings Account' },
                  { value: 'Fixed Deposit', label: 'Fixed Deposit' },
                  { value: 'Recurring Deposit', label: 'Recurring Deposit' },
                  { value: 'Current Account', label: 'Current Account' },
                ]}
                required
              />
              <Select
                label="Branch"
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Branch' },
                  ...branches.map((b) => ({ value: b.id, label: b.branchName })),
                ]}
                required
              />
              <Input
                label="Deposit Amount (₹)"
                name="depositAmount"
                type="number"
                value={formData.depositAmount}
                onChange={handleChange}
                placeholder="e.g., 100000"
                required
              />
              {(formData.depositType === 'Fixed Deposit' || formData.depositType === 'Recurring Deposit') && (
                <Input
                  label="Tenure (months)"
                  name="tenure"
                  type="number"
                  value={formData.tenure}
                  onChange={handleChange}
                  placeholder="e.g., 36"
                  required
                />
              )}
            </div>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.push('/deposits')}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} icon={<Save className="h-5 w-5" />}>
              Create Deposit
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

