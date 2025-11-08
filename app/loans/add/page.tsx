'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs } from '@/components/ui';
import { Save, X } from 'lucide-react';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useCustomers } from '@/hooks/useCustomers';
import { useBranches } from '@/hooks/useBranches';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/components/ui/Toast';
import { LoanProduct, EligibilityRule } from '@/services/products';
import { Customer } from '@/services/customers.service';
import { Alert } from '@/components/ui';

const checkEligibility = (customer: Customer, rules: EligibilityRule[]): string[] => {
  const warnings = [];
  const customerAge = new Date().getFullYear() - new Date(customer.dateOfBirth || '').getFullYear();

  for (const rule of rules) {
    let customerValue: any;
    switch (rule.field) {
      case 'age': customerValue = customerAge; break;
      case 'annualIncome': customerValue = customer.annualIncome || 0; break;
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

export default function AddLoanPage() {
  const router = useRouter();
  const { createLoan, loading: isSubmitting } = useLoanMutations();
  const { customers } = useCustomers();
  const { branches } = useBranches();
  const { products: loanProducts } = useProducts({ productType: 'Loan', status: 'Active' });
  const { addToast } = useToast();
  
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [eligibilityWarnings, setEligibilityWarnings] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    customerId: '',
    loanType: 'Personal Loan' as any,
    loanAmount: '',
    tenure: '',
    interestRate: '',
    branchId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const selectedCustomer = useMemo(() => {
    return customers.find((c:any) => c.id === formData.customerId);
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
        loanType: selectedProduct.subType,
        interestRate: selectedProduct.interestRate.toString(),
        loanAmount: '',
        tenure: '',
      }));
    }
  }, [selectedProduct]);

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
    
    if (selectedProduct) {
      const amount = parseFloat(formData.loanAmount);
      const tenure = parseInt(formData.tenure);
      if (amount < selectedProduct.minAmount) newErrors.loanAmount = `Amount must be at least ₹${selectedProduct.minAmount}`;
      if (amount > selectedProduct.maxAmount) newErrors.loanAmount = `Amount cannot exceed ₹${selectedProduct.maxAmount}`;
      if (tenure < selectedProduct.minTenure) newErrors.tenure = `Tenure must be at least ${selectedProduct.minTenure} months`;
      if (tenure > selectedProduct.maxTenure) newErrors.tenure = `Tenure cannot exceed ${selectedProduct.maxTenure} months`;
    }

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
        category: formData.loanType,
        amount: parseFloat(formData.loanAmount),
        tenure: parseInt(formData.tenure),
        branchId: formData.branchId,
        userId: '',
        product: '',
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Select Product (Optional)"
                name="productId"
                value={selectedProduct?.id || ''}
                onChange={(e) => {
                  const product = loanProducts.find((p:any) => p._id === e.target.value) as LoanProduct | undefined;
                  setSelectedProduct(product || null);
                }}
                options={[
                  { value: '', label: 'Select a loan product' },
                  ...loanProducts.map((p:any) => ({ value: p._id, label: p.productName })),
                ]}
              />
              <Select
                label="Customer"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                error={errors.customerId}
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
                label="Loan Type"
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                disabled={!!selectedProduct}
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
                  ...branches.map((b) => ({ value: b.id || '', label: b.branchName })),
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
              <Input
                label="Interest Rate (% p.a.)"
                name="interestRate"
                type="number"
                value={formData.interestRate}
                onChange={handleChange}
                error={errors.interestRate}
                placeholder="e.g., 9.5"
                disabled={!!selectedProduct}
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

