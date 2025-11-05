'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs } from '@/components/ui';
import { Save, X } from 'lucide-react';
import { useDepositMutations } from '@/hooks/useDepositMutations';
import { useCustomers } from '@/hooks/useCustomers';
import { useBranches } from '@/hooks/useBranches';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/components/ui/Toast';
import { TermDepositProduct, EligibilityRule } from '@/services/products';
import { Customer } from '@/services/customers.service';
import { Alert } from '@/components/ui';

const checkEligibility = (customer: Customer, rules: EligibilityRule[]): string[] => {
  const warnings = [];
  const customerAge = new Date().getFullYear() - new Date(customer.dateOfBirth).getFullYear();

  for (const rule of rules) {
    let customerValue: any;
    switch (rule.field) {
      case 'age': customerValue = customerAge; break;
      case 'annualIncome': customerValue = customer.annualIncome; break;
      case 'occupation': customerValue = customer.occupation; break;
    }

    let isEligible = false;
    switch (rule.operator) {
      case '==': isEligible = customerValue == rule.value; break;
      case '!=': isEligible = customerValue != rule.value; break;
      case '>=': isEligible = customerValue >= rule.value; break;
      case '<=': isEligible = customerValue <= rule.value; break;
      case '>': isEligible = customerValue > rule.value; break;
      case '<': isEligible = customerValue < rule.value; break;
    }
    
    if (!isEligible) {
      warnings.push(`Customer does not meet the rule: ${rule.field} ${rule.operator} ${rule.value}`);
    }
  }
  return warnings;
};


export default function AddDepositPage() {
  const router = useRouter();
  const { createDeposit, loading: isSubmitting } = useDepositMutations();
  const { customers } = useCustomers();
  const { branches } = useBranches();
  const { products: depositProducts } = useProducts({ type: 'Term Deposit', status: 'Active' });
  const { addToast } = useToast();
  
  const [selectedProduct, setSelectedProduct] = useState<TermDepositProduct | null>(null);
  const [eligibilityWarnings, setEligibilityWarnings] = useState<string[]>([]);

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

  useEffect(() => {
    if (selectedProduct && selectedCustomer) {
      const warnings = checkEligibility(selectedCustomer, selectedProduct.eligibilityRules);
      setEligibilityWarnings(warnings);
    } else {
      setEligibilityWarnings([]);
    }
  }, [selectedProduct, selectedCustomer]);
  
  useEffect(() => {
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        depositType: selectedProduct.subType,
        depositAmount: '',
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Select Product (Optional)"
                name="productId"
                value={selectedProduct?.id || ''}
                onChange={(e) => {
                  const product = depositProducts.find(p => p.id === e.target.value) as TermDepositProduct | undefined;
                  setSelectedProduct(product || null);
                }}
                options={[
                  { value: '', label: 'Select a deposit product' },
                  ...depositProducts.map((p) => ({ value: p.id, label: p.name })),
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
            
            {eligibilityWarnings.length > 0 && (
              <Alert 
                variant="warning" 
                title="Eligibility Warnings"
                message={eligibilityWarnings.map((warning, i) => `${i + 1}. ${warning}`).join(' • ')}
              />
            )}

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
                  ...branches.map((b) => ({ value: b.id || '', label: b.branchName })),
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
                    options={selectedProduct ? Object.keys(selectedProduct.interestRates).map(t => ({ label: `${t} months`, value: t })) : []}
                    disabled={!selectedProduct}
                    required
                  />
                  <Input
                    label="Interest Rate (% p.a.)"
                    name="interestRate"
                    type="number"
                    value={selectedProduct?.interestRates[parseInt(formData.tenure)] || ''}
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

