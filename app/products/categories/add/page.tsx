'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Input,
  Textarea,
  Select,
  Toggle,
  Breadcrumbs,
} from '@/components/ui';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useLoanCategoryMutations } from '@/hooks/useLoanCategoryMutations';
import { CreateLoanCategoryDto, LoanSubCategory, LoanCategoryStatus, LoanType } from '@/services/loan-categories.service';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useBranches } from '@/hooks/useBranches';

export default function AddLoanCategoryPage() {
  const router = useRouter();
  const { createLoanCategory, loading } = useLoanCategoryMutations();
  const { addToast } = useToast();
  const { organizations } = useOrganizations();
  const { branches } = useBranches();

  const [formData, setFormData] = useState<Partial<CreateLoanCategoryDto>>({
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

      const categoryData: CreateLoanCategoryDto = {
        categoryName: formData.categoryName,
        organisation: formData.organisation,
        description: formData.description || '',
        loanType: formData.loanType,
        minLoanAmount: formData.minLoanAmount || 0,
        maxLoanAmount: formData.maxLoanAmount || 0,
        minTenureMonths: formData.minTenureMonths || 0,
        maxTenureMonths: formData.maxTenureMonths || 0,
        status: formData.status || LoanCategoryStatus.ACTIVE,
        defaultInterestRate: formData.defaultInterestRate,
        branch: formData.branch,
        eligibilityCriteria: formData.eligibilityCriteria,
        defaultProcessingFee: formData.defaultProcessingFee,
        defaultPrepaymentCharges: formData.defaultPrepaymentCharges,
        defaultLatePaymentCharges: formData.defaultLatePaymentCharges,
        keyFeatures: formData.keyFeatures || [],
        termsAndConditions: formData.termsAndConditions || '',
      };
      
      await createLoanCategory(categoryData);
      addToast({ type: 'success', message: 'Loan category created successfully' });
      router.push('/products/categories');
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to create loan category' });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/products' },
          { label: 'Categories', href: '/products/categories' },
          { label: 'Add Category' }
        ]} />
        
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add Loan Category</h1>
            <p className="text-neutral-600 mt-1">Create a new loan product category</p>
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
                    value={formData.description}
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
                        minAge: Number(e.target.value)
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
                        maxAge: Number(e.target.value)
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
                        minIncome: Number(e.target.value)
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
                        creditScoreMin: Number(e.target.value)
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

          {/* Sub-categories */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Sub-categories</h2>
                <Button type="button" variant="outline" onClick={addSubCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sub-category
                </Button>
              </div>
              
              {subCategories.map((subCategory, index) => (
                <div key={index} className="border border-neutral-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Sub-category {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubCategory(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Name *
                      </label>
                      <Input
                        value={subCategory.name || ''}
                        onChange={(e) => updateSubCategory(index, 'name', e.target.value)}
                        placeholder="e.g., Home Loan"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Display Order
                      </label>
                      <Input
                        type="number"
                        value={subCategory.displayOrder || ''}
                        onChange={(e) => updateSubCategory(index, 'displayOrder', Number(e.target.value))}
                        placeholder="1"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Description *
                      </label>
                      <Textarea
                        value={subCategory.description || ''}
                        onChange={(e) => updateSubCategory(index, 'description', e.target.value)}
                        placeholder="Describe this sub-category..."
                        rows={2}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Min Interest Rate (%)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={subCategory.interestRateRange?.min || ''}
                        onChange={(e) => updateSubCategory(index, 'interestRateRange', {
                          ...subCategory.interestRateRange,
                          min: Number(e.target.value)
                        })}
                        placeholder="8.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Max Interest Rate (%)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={subCategory.interestRateRange?.max || ''}
                        onChange={(e) => updateSubCategory(index, 'interestRateRange', {
                          ...subCategory.interestRateRange,
                          max: Number(e.target.value)
                        })}
                        placeholder="12.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Processing Fee (%)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={subCategory.processingFee || ''}
                        onChange={(e) => updateSubCategory(index, 'processingFee', Number(e.target.value))}
                        placeholder="1.5"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Min Amount (₹)
                      </label>
                      <Input
                        type="number"
                        value={subCategory.amountRange?.min || ''}
                        onChange={(e) => updateSubCategory(index, 'amountRange', {
                          ...subCategory.amountRange,
                          min: Number(e.target.value)
                        })}
                        placeholder="50000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Max Amount (₹)
                      </label>
                      <Input
                        type="number"
                        value={subCategory.amountRange?.max || ''}
                        onChange={(e) => updateSubCategory(index, 'amountRange', {
                          ...subCategory.amountRange,
                          max: Number(e.target.value)
                        })}
                        placeholder="5000000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Min Tenure (months)
                      </label>
                      <Input
                        type="number"
                        value={subCategory.tenureRange?.min || ''}
                        onChange={(e) => updateSubCategory(index, 'tenureRange', {
                          ...subCategory.tenureRange,
                          min: Number(e.target.value)
                        })}
                        placeholder="12"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Max Tenure (months)
                      </label>
                      <Input
                        type="number"
                        value={subCategory.tenureRange?.max || ''}
                        onChange={(e) => updateSubCategory(index, 'tenureRange', {
                          ...subCategory.tenureRange,
                          max: Number(e.target.value)
                        })}
                        placeholder="60"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Eligibility Criteria
                      </label>
                      <div className="space-y-2">
                        {(subCategory.eligibilityCriteria || []).map((criteria, criteriaIndex) => (
                          <div key={criteriaIndex} className="flex items-center gap-2">
                            <Input
                              value={criteria}
                              onChange={(e) => updateEligibilityCriteria(index, criteriaIndex, e.target.value)}
                              placeholder="e.g., Minimum age 21 years"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEligibilityCriteria(index, criteriaIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addEligibilityCriteria(index)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Criteria
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Required Documents
                      </label>
                      <div className="space-y-2">
                        {(subCategory.requiredDocuments || []).map((doc, docIndex) => (
                          <div key={docIndex} className="flex items-center gap-2">
                            <Input
                              value={doc}
                              onChange={(e) => updateRequiredDocument(index, docIndex, e.target.value)}
                              placeholder="e.g., Identity Proof"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRequiredDocument(index, docIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addRequiredDocument(index)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Document
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={subCategory.isActive || false}
                        onChange={(e) => updateSubCategory(index, 'isActive', e.target.checked)}
                      />
                      <label className="text-sm font-medium text-neutral-700">
                        Active Sub-category
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
