'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs } from '@/components/ui';
import { Save, X } from 'lucide-react';
import { useDepositMutations } from '@/hooks/useDepositMutations';
import { useCustomers } from '@/hooks/useCustomers';
import { useBranches } from '@/hooks/useBranches';
import { useDepositProducts } from '@/hooks/useDepositProducts';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
import { useToast } from '@/components/ui/Toast';
import { DepositProduct, DepositProductType } from '@/services/deposit-products.service';
import { Customer } from '@/services/customers.service';

const DEPOSIT_TYPE_LABELS: Record<string, string> = {
  [DepositProductType.SAVINGS]: 'Savings Account',
  [DepositProductType.CURRENT]: 'Current Account',
  [DepositProductType.FD]: 'Fixed Deposit',
  [DepositProductType.RD]: 'Recurring Deposit',
};

export default function AddDepositPage() {
  const router = useRouter();
  const { createDeposit, loading: isSubmitting } = useDepositMutations();
  const { customers } = useCustomers();
  const { branches } = useBranches();
  const { products: depositProducts } = useDepositProducts({ status: 'active' });
  const { rateLabel } = useInterestProfitTerm();
  const { addToast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<DepositProduct | null>(null);

  const [formData, setFormData] = useState({
    customerId: '',
    depositType: 'Savings Account' as any,
    depositAmount: '',
    tenure: '',
    interestRate: '',
    branchId: '',
  });

  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === formData.customerId);
  }, [formData.customerId, customers]);

  const tenureOptions = useMemo(() => {
    if (!selectedProduct?.interestRatesByTenure || typeof selectedProduct.interestRatesByTenure !== 'object') return [];
    return Object.keys(selectedProduct.interestRatesByTenure)
      .map((t) => ({ value: t, label: `${t} months` }))
      .sort((a, b) => Number(a.value) - Number(b.value));
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct) {
      const label = DEPOSIT_TYPE_LABELS[selectedProduct.productType] || selectedProduct.productName;
      setFormData(prev => ({
        ...prev,
        depositType: label,
        depositAmount: prev.depositAmount,
        tenure: '',
        interestRate: '',
      }));
    }
  }, [selectedProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const interestRate =
        formData.tenure && selectedProduct?.interestRatesByTenure
          ? selectedProduct.interestRatesByTenure[Number(formData.tenure)]
          : selectedProduct?.defaultInterestRate ?? undefined;
      await createDeposit({
        customerId: formData.customerId,
        depositType: formData.depositType,
        depositAmount: parseFloat(formData.depositAmount),
        tenure: formData.tenure ? parseInt(formData.tenure) : undefined,
        branchId: formData.branchId,
        productId: selectedProduct?._id,
        interestRate,
      });
      router.push('/deposits');
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to create deposit' });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
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
          <Card className="p-4 sm:p-6 space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900">Deposit Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Select Product (Optional)"
                name="productId"
                value={selectedProduct?._id || ''}
                onChange={(e) => {
                  const product = depositProducts.find((p) => p._id === e.target.value) ?? null;
                  setSelectedProduct(product);
                }}
                options={[
                  { value: '', label: 'Select a deposit product' },
                  ...depositProducts.map((p) => ({ value: p._id, label: p.productName })),
                ]}
              />
              <Select
                label="Customer"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Customer' },
                  ...customers.map((c) => ({ value: c.id || '', label: `${c.fullName} - ${c.phone}` })),
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Deposit Type"
                name="depositType"
                value={formData.depositType}
                onChange={handleChange}
                disabled={!!selectedProduct}
                required
              />
              <Select
                label="Branch"
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Branch' },
                  ...branches.map((b) => ({ value: (b as any)._id || b.id || '', label: b.branchName })),
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
                <>
                  <Select
                    label="Tenure (months)"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleChange}
                    placeholder="Select Tenure"
                    options={tenureOptions}
                    disabled={!selectedProduct || tenureOptions.length === 0}
                    required
                  />
                  <Input
                    label={`${rateLabel} (% p.a.)`}
                    name="interestRate"
                    type="number"
                    value={
                      formData.tenure && selectedProduct?.interestRatesByTenure
                        ? selectedProduct.interestRatesByTenure[Number(formData.tenure)] ?? ''
                        : ''
                    }
                    disabled
                  />
                </>
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

