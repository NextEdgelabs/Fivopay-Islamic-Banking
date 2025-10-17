'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs, Skeleton } from '@/components/ui';
import { Save, X } from 'lucide-react';
import { useDeposit } from '@/hooks/useDeposit';
import { useDepositMutations } from '@/hooks/useDepositMutations';
import { useToast } from '@/components/ui/Toast';

export default function EditDepositPage() {
  const params = useParams();
  const router = useRouter();
  const depositId = params.id as string;
  const { deposit, loading: fetchLoading } = useDeposit(depositId);
  const { updateDeposit, loading: isSubmitting } = useDepositMutations();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    status: '' as any,
  });

  useEffect(() => {
    if (deposit) {
      setFormData({
        status: deposit.status,
      });
    }
  }, [deposit]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateDeposit(depositId, {
        status: formData.status,
      });
      addToast({ type: 'success', message: 'Deposit updated successfully!' });
      router.push(`/deposits/${depositId}`);
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update deposit',
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

  if (!deposit) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="p-6 text-center text-error-500">
            <p>Deposit not found</p>
            <Button onClick={() => router.push('/deposits')} className="mt-4">
              Back to Deposits
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Deposits', href: '/deposits' },
    { label: deposit.depositId, href: `/deposits/${deposit.id}` },
    { label: 'Edit', href: `/deposits/${deposit.id}/edit` },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Edit Deposit</h1>
            <p className="text-neutral-600 mt-1">Update deposit information</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/deposits/${depositId}`)}
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900">Deposit Details</h2>

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Closed', label: 'Closed' },
                { value: 'Matured', label: 'Matured' },
                { value: 'Frozen', label: 'Frozen' },
              ]}
              required
            />
          </Card>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/deposits/${depositId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              <Save className="h-5 w-5 mr-2" />
              Update Deposit
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
