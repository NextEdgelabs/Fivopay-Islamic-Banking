'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Input,
  Textarea,
  Select,
  Toggle,
  Breadcrumbs,
  Skeleton,
} from '@/components/ui';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useLoanCategory } from '@/hooks/useLoanCategory';
import { useLoanCategoryMutations } from '@/hooks/useLoanCategoryMutations';
import { UpdateLoanCategoryDto, LoanSubCategory, LoanCategoryStatus, LoanType } from '@/services/loan-categories.service';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useBranches } from '@/hooks/useBranches';

export default function EditLoanCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;
  const { category, loading: fetchLoading, error: fetchError } = useLoanCategory(categoryId);
  const { updateLoanCategory, loading } = useLoanCategoryMutations();
  const { addToast } = useToast();
  const { organizations } = useOrganizations();
  const { branches } = useBranches();

  const [formData, setFormData] = useState<Partial<UpdateLoanCategoryDto>>({
    _id: categoryId,
    categoryName: '',
    organisation: '',
    description: '',
    loanType: '',
    minLoanAmount: 0,
    maxLoanAmount: 0,
    minTenureMonths: 0,
    maxTenureMonths: 0,
    status: LoanCategoryStatus.ACTIVE,
    defaultInterestRate: undefined,
    eligibilityCriteria: {
      minAge: undefined,
      maxAge: undefined,
      minIncome: undefined,
      requiredDocuments: [],
      creditScoreMin: undefined,
    },
    defaultProcessingFee: {
      type: 'percentage',
      value: 0,
    },
    defaultPrepaymentCharges: {
      type: 'percentage',
      value: 0,
    },
    defaultLatePaymentCharges: {
      type: 'percentage',
      value: 0,
    },
    keyFeatures: [],
    termsAndConditions: '',
  });

  const [subCategories, setSubCategories] = useState<Partial<LoanSubCategory>[]>([]);

  // Populate form when category data loads
  useEffect(() => {
    if (category) {
      setFormData({
        _id: category._id,
        categoryName: category.categoryName || '',
        organisation: category.organisation || '',
        description: category.description || '',
        loanType: category.loanType || '',
        minLoanAmount: category.minLoanAmount || 0,
        maxLoanAmount: category.maxLoanAmount || 0,
        minTenureMonths: category.minTenureMonths || 0,
        maxTenureMonths: category.maxTenureMonths || 0,
        status: category.status || LoanCategoryStatus.ACTIVE,
        defaultInterestRate: category.defaultInterestRate,
        branch: category.branch,
        eligibilityCriteria: category.eligibilityCriteria || {
          minAge: undefined,
          maxAge: undefined,
          minIncome: undefined,
          requiredDocuments: [],
          creditScoreMin: undefined,
        },
        defaultProcessingFee: category.defaultProcessingFee || {
          type: 'percentage',
          value: 0,
        },
        defaultPrepaymentCharges: category.defaultPrepaymentCharges || {
          type: 'percentage',
          value: 0,
        },
        defaultLatePaymentCharges: category.defaultLatePaymentCharges || {
          type: 'percentage',
          value: 0,
        },
        keyFeatures: category.keyFeatures || [],
        termsAndConditions: category.termsAndConditions || '',
      });
    }
  }, [category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleToggleChange = (name: string, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSubCategory = () => {
    setSubCategories(prev => [...prev, {
      name: '',
      description: '',
      isActive: true,
      displayOrder: prev.length + 1,
      interestRateRange: { min: 0, max: 0 },
      tenureRange: { min: 0, max: 0 },
      amountRange: { min: 0, max: 0 },
      eligibilityCriteria: [],
      requiredDocuments: [],
      processingFee: 0,
    }]);
  };

  const updateSubCategory = (index: number, field: string, value: any) => {
    setSubCategories(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeSubCategory = (index: number) => {
    setSubCategories(prev => prev.filter((_, i) => i !== index));
  };

  const addEligibilityCriteria = (subCategoryIndex: number) => {
    updateSubCategory(subCategoryIndex, 'eligibilityCriteria', [
      ...(subCategories[subCategoryIndex].eligibilityCriteria || []),
      ''
    ]);
  };

  const updateEligibilityCriteria = (subCategoryIndex: number, criteriaIndex: number, value: string) => {
    const updatedCriteria = [...(subCategories[subCategoryIndex].eligibilityCriteria || [])];
    updatedCriteria[criteriaIndex] = value;
    updateSubCategory(subCategoryIndex, 'eligibilityCriteria', updatedCriteria);
  };

  const removeEligibilityCriteria = (subCategoryIndex: number, criteriaIndex: number) => {
    const updatedCriteria = [...(subCategories[subCategoryIndex].eligibilityCriteria || [])];
    updatedCriteria.splice(criteriaIndex, 1);
    updateSubCategory(subCategoryIndex, 'eligibilityCriteria', updatedCriteria);
  };

  const addRequiredDocument = (subCategoryIndex: number) => {
    updateSubCategory(subCategoryIndex, 'requiredDocuments', [
      ...(subCategories[subCategoryIndex].requiredDocuments || []),
      ''
    ]);
  };

  const updateRequiredDocument = (subCategoryIndex: number, docIndex: number, value: string) => {
    const updatedDocs = [...(subCategories[subCategoryIndex].requiredDocuments || [])];
    updatedDocs[docIndex] = value;
    updateSubCategory(subCategoryIndex, 'requiredDocuments', updatedDocs);
  };

  const removeRequiredDocument = (subCategoryIndex: number, docIndex: number) => {
    const updatedDocs = [...(subCategories[subCategoryIndex].requiredDocuments || [])];
    updatedDocs.splice(docIndex, 1);
    updateSubCategory(subCategoryIndex, 'requiredDocuments', updatedDocs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Ensure all required fields are present
      if (!formData.categoryName || !formData.description || !formData.loanType || !formData.organisation) {
        addToast({ type: 'error', message: 'Please fill in all required fields' });
        return;
      }

      // Build update payload - only include fields that have values (skip empty strings)
      const categoryData: UpdateLoanCategoryDto = {
        _id: categoryId,
      };

      // Only include non-empty values
      if (formData.categoryName) categoryData.categoryName = formData.categoryName;
      if (formData.organisation) categoryData.organisation = formData.organisation;
      if (formData.description) categoryData.description = formData.description;
      if (formData.loanType) categoryData.loanType = formData.loanType;
      if (formData.minLoanAmount !== undefined) categoryData.minLoanAmount = formData.minLoanAmount;
      if (formData.maxLoanAmount !== undefined) categoryData.maxLoanAmount = formData.maxLoanAmount;
      if (formData.minTenureMonths !== undefined) categoryData.minTenureMonths = formData.minTenureMonths;
      if (formData.maxTenureMonths !== undefined) categoryData.maxTenureMonths = formData.maxTenureMonths;
      if (formData.status) categoryData.status = formData.status;
      if (formData.defaultInterestRate !== undefined) categoryData.defaultInterestRate = formData.defaultInterestRate;
      if (formData.branch) categoryData.branch = formData.branch;
      if (formData.eligibilityCriteria) categoryData.eligibilityCriteria = formData.eligibilityCriteria;
      if (formData.defaultProcessingFee) categoryData.defaultProcessingFee = formData.defaultProcessingFee;
      if (formData.defaultPrepaymentCharges) categoryData.defaultPrepaymentCharges = formData.defaultPrepaymentCharges;
      if (formData.defaultLatePaymentCharges) categoryData.defaultLatePaymentCharges = formData.defaultLatePaymentCharges;
      if (formData.keyFeatures) categoryData.keyFeatures = formData.keyFeatures;
      if (formData.termsAndConditions) categoryData.termsAndConditions = formData.termsAndConditions;
      
      await updateLoanCategory(categoryData);
      addToast({ type: 'success', message: 'Loan category updated successfully' });
      router.push(`/products/categories/${categoryId}`);
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update loan category' });
    }
  };

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError || !category) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div className="text-error-500">
            {fetchError || 'Category not found'}
          </div>
          <Button variant="outline" onClick={() => router.push('/products/categories')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/products' },
          { label: 'Categories', href: '/products/categories' },
          { label: category.categoryName, href: `/products/categories/${categoryId}` },
          { label: 'Edit' }
        ]} />
        
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/products/categories/${categoryId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Loan Category</h1>
            <p className="text-neutral-600 mt-1">Update loan product category details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category Name *
                  </label>
                  <Input
                    name="categoryName"
                    value={formData.categoryName || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Personal Loans"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Organisation *
                  </label>
                  <Select
                    name="organisation"
                    value={formData.organisation || ''}
                    onChange={handleInputChange}
                    required
                    options={[
                      { label: 'Select Organisation', value: '' },
                      ...(organizations || []).map(org => ({
                        value: org._id || org.id || '',
                        label: org.organisationName || org.organizationName || org.name || 'Unknown'
                      }))
                    ]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Branch
                  </label>
                  <Select
                    name="branch"
                    value={formData.branch || ''}
                    onChange={handleInputChange}
                    options={[
                      { label: 'Select Branch (Optional)', value: '' },
                      ...(branches || []).map(b => ({
                        value: b._id || b.id || '',
                        label: b.branchName || 'Unknown'
                      }))
                    ]}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Describe this loan category..."
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Loan Type *
                  </label>
                  <Select
                    name="loanType"
                    value={formData.loanType || ''}
                    onChange={handleInputChange}
                    required
                    options={[
                      { label: 'Select Loan Type', value: '' },
                      { label: 'Personal', value: LoanType.PERSONAL },
                      { label: 'Home', value: LoanType.HOME },
                      { label: 'Car', value: LoanType.CAR },
                      { label: 'Business', value: LoanType.BUSINESS },
                      { label: 'Education', value: LoanType.EDUCATION },
                      { label: 'Gold', value: LoanType.GOLD },
                      { label: 'Agriculture', value: LoanType.AGRICULTURE },
                      { label: 'Medical', value: LoanType.MEDICAL },
                    ]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Status *
                  </label>
                  <Select
                    name="status"
                    value={formData.status || LoanCategoryStatus.ACTIVE}
                    onChange={handleInputChange}
                    required
                    options={[
                      { label: 'Active', value: LoanCategoryStatus.ACTIVE },
                      { label: 'Inactive', value: LoanCategoryStatus.INACTIVE },
                      { label: 'Suspended', value: LoanCategoryStatus.SUSPENDED },
                    ]}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Loan Amount & Interest */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Loan Amount & Interest</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Minimum Loan Amount (₹) *
                  </label>
                  <Input
                    type="number"
                    name="minLoanAmount"
                    value={formData.minLoanAmount || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 50000"
                    required
                    min={0}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Maximum Loan Amount (₹) *
                  </label>
                  <Input
                    type="number"
                    name="maxLoanAmount"
                    value={formData.maxLoanAmount || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000000"
                    required
                    min={0}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default Interest Rate (%)
                  </label>
                  <Input
                    type="number"
                    name="defaultInterestRate"
                    value={formData.defaultInterestRate || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 10.5"
                    min={0}
                    max={100}
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Tenure */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tenure (in months)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Minimum Tenure (months) *
                  </label>
                  <Input
                    type="number"
                    name="minTenureMonths"
                    value={formData.minTenureMonths || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 12"
                    required
                    min={1}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Maximum Tenure (months) *
                  </label>
                  <Input
                    type="number"
                    name="maxTenureMonths"
                    value={formData.maxTenureMonths || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 60"
                    required
                    min={1}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Eligibility Criteria */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Minimum Age
                  </label>
                  <Input
                    type="number"
                    name="eligibilityCriteria.minAge"
                    value={formData.eligibilityCriteria?.minAge || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      eligibilityCriteria: {
                        ...prev.eligibilityCriteria,
                        minAge: e.target.value ? Number(e.target.value) : undefined
                      }
                    }))}
                    placeholder="e.g., 21"
                    min={0}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Maximum Age
                  </label>
                  <Input
                    type="number"
                    name="eligibilityCriteria.maxAge"
                    value={formData.eligibilityCriteria?.maxAge || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      eligibilityCriteria: {
                        ...prev.eligibilityCriteria,
                        maxAge: e.target.value ? Number(e.target.value) : undefined
                      }
                    }))}
                    placeholder="e.g., 65"
                    min={0}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Minimum Income (₹)
                  </label>
                  <Input
                    type="number"
                    name="eligibilityCriteria.minIncome"
                    value={formData.eligibilityCriteria?.minIncome || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      eligibilityCriteria: {
                        ...prev.eligibilityCriteria,
                        minIncome: e.target.value ? Number(e.target.value) : undefined
                      }
                    }))}
                    placeholder="e.g., 25000"
                    min={0}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Minimum Credit Score
                  </label>
                  <Input
                    type="number"
                    name="eligibilityCriteria.creditScoreMin"
                    value={formData.eligibilityCriteria?.creditScoreMin || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      eligibilityCriteria: {
                        ...prev.eligibilityCriteria,
                        creditScoreMin: e.target.value ? Number(e.target.value) : undefined
                      }
                    }))}
                    placeholder="e.g., 650"
                    min={0}
                    max={900}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Required Documents
                  </label>
                  <div className="space-y-2">
                    {(formData.eligibilityCriteria?.requiredDocuments || []).map((doc, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={doc}
                          onChange={(e) => {
                            const updatedDocs = [...(formData.eligibilityCriteria?.requiredDocuments || [])];
                            updatedDocs[index] = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              eligibilityCriteria: {
                                ...prev.eligibilityCriteria,
                                requiredDocuments: updatedDocs
                              }
                            }));
                          }}
                          placeholder="e.g., Identity Proof"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedDocs = [...(formData.eligibilityCriteria?.requiredDocuments || [])];
                            updatedDocs.splice(index, 1);
                            setFormData(prev => ({
                              ...prev,
                              eligibilityCriteria: {
                                ...prev.eligibilityCriteria,
                                requiredDocuments: updatedDocs
                              }
                            }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        eligibilityCriteria: {
                          ...prev.eligibilityCriteria,
                          requiredDocuments: [...(prev.eligibilityCriteria?.requiredDocuments || []), '']
                        }
                      }))}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Fees & Charges */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Fees & Charges</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default Processing Fee Type
                  </label>
                  <Select
                    name="defaultProcessingFee.type"
                    value={formData.defaultProcessingFee?.type || 'percentage'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      defaultProcessingFee: {
                        type: e.target.value as 'percentage' | 'fixed',
                        value: prev.defaultProcessingFee?.value || 0
                      }
                    }))}
                    options={[
                      { label: 'Percentage', value: 'percentage' },
                      { label: 'Fixed Amount', value: 'fixed' },
                    ]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default Processing Fee Value
                  </label>
                  <Input
                    type="number"
                    name="defaultProcessingFee.value"
                    value={formData.defaultProcessingFee?.value || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      defaultProcessingFee: {
                        type: prev.defaultProcessingFee?.type || 'percentage',
                        value: Number(e.target.value)
                      }
                    }))}
                    placeholder={formData.defaultProcessingFee?.type === 'percentage' ? 'e.g., 2.5' : 'e.g., 5000'}
                    min={0}
                    step={formData.defaultProcessingFee?.type === 'percentage' ? '0.1' : '1'}
                  />
                </div>
                
                <div className="flex items-end">
                  <span className="text-sm text-neutral-500">
                    {formData.defaultProcessingFee?.type === 'percentage' ? '%' : '₹'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default Prepayment Charges Type
                  </label>
                  <Select
                    name="defaultPrepaymentCharges.type"
                    value={formData.defaultPrepaymentCharges?.type || 'percentage'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      defaultPrepaymentCharges: {
                        type: e.target.value as 'percentage' | 'fixed',
                        value: prev.defaultPrepaymentCharges?.value || 0
                      }
                    }))}
                    options={[
                      { label: 'Percentage', value: 'percentage' },
                      { label: 'Fixed Amount', value: 'fixed' },
                    ]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default Prepayment Charges Value
                  </label>
                  <Input
                    type="number"
                    name="defaultPrepaymentCharges.value"
                    value={formData.defaultPrepaymentCharges?.value || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      defaultPrepaymentCharges: {
                        type: prev.defaultPrepaymentCharges?.type || 'percentage',
                        value: Number(e.target.value)
                      }
                    }))}
                    placeholder={formData.defaultPrepaymentCharges?.type === 'percentage' ? 'e.g., 2' : 'e.g., 1000'}
                    min={0}
                    step={formData.defaultPrepaymentCharges?.type === 'percentage' ? '0.1' : '1'}
                  />
                </div>
                
                <div className="flex items-end">
                  <span className="text-sm text-neutral-500">
                    {formData.defaultPrepaymentCharges?.type === 'percentage' ? '%' : '₹'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default Late Payment Charges Type
                  </label>
                  <Select
                    name="defaultLatePaymentCharges.type"
                    value={formData.defaultLatePaymentCharges?.type || 'percentage'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      defaultLatePaymentCharges: {
                        type: e.target.value as 'percentage' | 'fixed',
                        value: prev.defaultLatePaymentCharges?.value || 0
                      }
                    }))}
                    options={[
                      { label: 'Percentage', value: 'percentage' },
                      { label: 'Fixed Amount', value: 'fixed' },
                    ]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default Late Payment Charges Value
                  </label>
                  <Input
                    type="number"
                    name="defaultLatePaymentCharges.value"
                    value={formData.defaultLatePaymentCharges?.value || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      defaultLatePaymentCharges: {
                        type: (prev.defaultLatePaymentCharges?.type || 'percentage') as 'percentage' | 'fixed',
                        value: Number(e.target.value)
                      }
                    }))}
                    placeholder={formData.defaultLatePaymentCharges?.type === 'percentage' ? 'e.g., 1.5' : 'e.g., 500'}
                    min={0}
                    step={formData.defaultLatePaymentCharges?.type === 'percentage' ? '0.1' : '1'}
                  />
                </div>
                
                <div className="flex items-end">
                  <span className="text-sm text-neutral-500">
                    {formData.defaultLatePaymentCharges?.type === 'percentage' ? '%' : '₹'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Key Features */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <div className="space-y-2">
                {(formData.keyFeatures || []).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const updatedFeatures = [...(formData.keyFeatures || [])];
                        updatedFeatures[index] = e.target.value;
                        setFormData(prev => ({ ...prev, keyFeatures: updatedFeatures }));
                      }}
                      placeholder="e.g., Quick approval"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedFeatures = [...(formData.keyFeatures || [])];
                        updatedFeatures.splice(index, 1);
                        setFormData(prev => ({ ...prev, keyFeatures: updatedFeatures }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, keyFeatures: [...(prev.keyFeatures || []), ''] }))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </div>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
              <Textarea
                name="termsAndConditions"
                value={formData.termsAndConditions || ''}
                onChange={handleInputChange}
                placeholder="Enter terms and conditions for this loan category..."
                rows={6}
              />
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" onClick={() => router.push(`/products/categories/${categoryId}`)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              Update Category
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
