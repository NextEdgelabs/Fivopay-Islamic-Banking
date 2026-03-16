'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs, Textarea, Badge, Toggle } from '@/components/ui';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { useProductMutations } from '@/hooks/useProductMutations';
import { useToast } from '@/components/ui/Toast';
import { CreateProductDto, ProductType, RepaymentFrequency, LoanProductStatus } from '@/services/products';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useLoanCategories } from '@/hooks/useLoanCategories';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
import { LoanCategory } from '@/services/loan-categories.service';

export default function AddProductPage() {
  const router = useRouter();
  const { createProduct, loading } = useProductMutations();
  const { addToast } = useToast();
  const { organizations } = useOrganizations();
  const { categories } = useLoanCategories();
  const { rateLabel } = useInterestProfitTerm();
  const lastAutoFilledCategory = useRef<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<CreateProductDto>>({
    productName: '',
    description: '',
    organisation: '',
    category: '',
    productType: ProductType.STANDARD,
    minLoanAmount: 0,
    maxLoanAmount: 0,
    interestRate: 0,
    minTenureMonths: 0,
    maxTenureMonths: 0,
    repaymentFrequency: RepaymentFrequency.MONTHLY,
    status: LoanProductStatus.ACTIVE,
    eligibilityCriteria: {
      minAge: undefined,
      maxAge: undefined,
      minIncome: undefined,
      creditScoreMin: undefined,
      requiredDocuments: [],
      employmentType: [],
    },
    processingFee: {
      type: 'percentage',
      value: 0,
    },
    prepaymentCharges: {
      type: 'percentage',
      value: 0,
    },
    latePaymentCharges: {
      type: 'percentage',
      value: 0,
    },
    features: [],
    benefits: [],
    termsAndConditions: '',
    documentsRequired: [],
    applicationProcess: {
      steps: [],
      estimatedTime: '',
      requiredDocuments: [],
    },
    promotionalOffers: [],
  });

  // Auto-fill function to populate form from selected category
  const autoFillFromCategory = (category: LoanCategory, currentFormData: Partial<CreateProductDto>) => {
    const updated: Partial<CreateProductDto> = { ...currentFormData };
    
    // Auto-fill organisation if not already set
    if (category.organisation && !currentFormData.organisation) {
      updated.organisation = category.organisation;
    }
    
    // Auto-fill loan amount range (only if not already set or is 0)
    if (category.minLoanAmount !== undefined && category.minLoanAmount !== null && 
        (currentFormData.minLoanAmount === undefined || currentFormData.minLoanAmount === 0)) {
      updated.minLoanAmount = category.minLoanAmount;
    }
    if (category.maxLoanAmount !== undefined && category.maxLoanAmount !== null && 
        (currentFormData.maxLoanAmount === undefined || currentFormData.maxLoanAmount === 0)) {
      updated.maxLoanAmount = category.maxLoanAmount;
    }
    
    // Auto-fill tenure range (only if not already set or is 0)
    if (category.minTenureMonths !== undefined && category.minTenureMonths !== null && 
        (currentFormData.minTenureMonths === undefined || currentFormData.minTenureMonths === 0)) {
      updated.minTenureMonths = category.minTenureMonths;
    }
    if (category.maxTenureMonths !== undefined && category.maxTenureMonths !== null && 
        (currentFormData.maxTenureMonths === undefined || currentFormData.maxTenureMonths === 0)) {
      updated.maxTenureMonths = category.maxTenureMonths;
    }
    
    // Auto-fill interest rate (optional, only if not already set or is 0)
    if (category.defaultInterestRate !== undefined && category.defaultInterestRate !== null && 
        (currentFormData.interestRate === undefined || currentFormData.interestRate === 0)) {
      updated.interestRate = category.defaultInterestRate;
    }
    
    // Auto-fill processing fee (optional, only if not already set)
    if (category.defaultProcessingFee && 
        (!currentFormData.processingFee || currentFormData.processingFee.value === 0)) {
      updated.processingFee = {
        type: category.defaultProcessingFee.type || 'percentage',
        value: category.defaultProcessingFee.value || 0,
      };
    }
    
    // Auto-fill prepayment charges (optional, only if not already set)
    if (category.defaultPrepaymentCharges && 
        (!currentFormData.prepaymentCharges || currentFormData.prepaymentCharges.value === 0)) {
      updated.prepaymentCharges = {
        type: category.defaultPrepaymentCharges.type || 'percentage',
        value: category.defaultPrepaymentCharges.value || 0,
      };
    }
    
    // Auto-fill late payment charges (optional, only if not already set)
    if (category.defaultLatePaymentCharges && 
        (!currentFormData.latePaymentCharges || currentFormData.latePaymentCharges.value === 0)) {
      updated.latePaymentCharges = {
        type: category.defaultLatePaymentCharges.type || 'percentage',
        value: category.defaultLatePaymentCharges.value || 0,
      };
    }
    
    // Auto-fill eligibility criteria (optional, merge with existing)
    if (category.eligibilityCriteria) {
      updated.eligibilityCriteria = {
        minAge: category.eligibilityCriteria.minAge ?? currentFormData.eligibilityCriteria?.minAge,
        maxAge: category.eligibilityCriteria.maxAge ?? currentFormData.eligibilityCriteria?.maxAge,
        minIncome: category.eligibilityCriteria.minIncome ?? currentFormData.eligibilityCriteria?.minIncome,
        creditScoreMin: category.eligibilityCriteria.creditScoreMin ?? currentFormData.eligibilityCriteria?.creditScoreMin,
        requiredDocuments: category.eligibilityCriteria.requiredDocuments && category.eligibilityCriteria.requiredDocuments.length > 0
          ? [...(category.eligibilityCriteria.requiredDocuments || [])]
          : (currentFormData.eligibilityCriteria?.requiredDocuments || []),
        employmentType: currentFormData.eligibilityCriteria?.employmentType || [],
      };
    }
    
    // Auto-fill features from keyFeatures (optional, only if not already set)
    if (category.keyFeatures && category.keyFeatures.length > 0 && 
        (!currentFormData.features || currentFormData.features.length === 0)) {
      updated.features = [...(category.keyFeatures || [])];
    }
    
    // Auto-fill terms and conditions (optional, only if not already set)
    if (category.termsAndConditions && !currentFormData.termsAndConditions) {
      updated.termsAndConditions = category.termsAndConditions;
    }
    
    // Auto-fill description if empty (optional)
    if (category.description && !currentFormData.description) {
      updated.description = category.description;
    }
    
    return updated;
  };

  // Handle category selection and auto-fill common fields
  useEffect(() => {
    // Reset ref if category is cleared
    if (!formData.category) {
      lastAutoFilledCategory.current = null;
      return;
    }
    
    // Auto-fill when category is selected and hasn't been auto-filled yet
    if (formData.category && categories.length > 0 && formData.category !== lastAutoFilledCategory.current) {
      const selectedCategory = categories.find(cat => cat._id === formData.category);
      if (selectedCategory) {
        lastAutoFilledCategory.current = formData.category;
        setFormData(prev => autoFillFromCategory(selectedCategory, prev));
      }
    }
  }, [formData.category, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for category selection
    if (name === 'category') {
      setFormData(prev => ({ ...prev, [name]: value }));
      // The useEffect will handle auto-filling
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedChange = (field: string, subField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field as keyof CreateProductDto] as any),
        [subField]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.productName || !formData.description || !formData.organisation || !formData.category) {
        addToast({ type: 'error', message: 'Please fill in all required fields' });
        return;
      }

      await createProduct(formData as CreateProductDto);
      addToast({ type: 'success', message: 'Product created successfully' });
      router.push('/products');
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to create product' });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Products', href: '/products' }, { label: 'Add' }]} />
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Add New Loan Product</h1>
          <Button variant="outline" onClick={() => router.push('/products')}><X className="mr-2 h-4 w-4" />Cancel</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Core Details */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Core Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                name="productName" 
                label="Product Name *" 
                value={formData.productName || ''} 
                onChange={handleInputChange} 
                required 
              />
              <Select
                name="organisation"
                label="Organisation *"
                value={formData.organisation || ''}
                onChange={handleInputChange}
                required
                options={[
                  { value: '', label: 'Select Organisation' },
                  ...organizations.map((org:any) => ({ value: org._id, label: org.organisationName })),
                ]}
              />
              <Select
                name="category"
                label="Loan Category *"
                value={formData.category || ''}
                onChange={handleInputChange}
                required
                options={[
                  { value: '', label: 'Select Category' },
                  ...categories.map(cat => ({ value: cat._id, label: cat.categoryName })),
                ]}
              />
              <Select
                name="productType"
                label="Product Type *"
                value={formData.productType || ProductType.STANDARD}
                onChange={handleInputChange}
                required
                options={[
                  { value: ProductType.STANDARD, label: 'Standard' },
                  { value: ProductType.PREMIUM, label: 'Premium' },
                  { value: ProductType.BASIC, label: 'Basic' },
                  { value: ProductType.CUSTOM, label: 'Custom' },
                ]}
              />
              <Select
                name="status"
                label="Status *"
                value={formData.status || LoanProductStatus.ACTIVE}
                onChange={handleInputChange}
                required
                options={[
                  { value: LoanProductStatus.ACTIVE, label: 'Active' },
                  { value: LoanProductStatus.INACTIVE, label: 'Inactive' },
                  { value: LoanProductStatus.SUSPENDED, label: 'Suspended' },
                ]}
              />
            </div>
            <div className="mt-4">
              <Textarea 
                name="description" 
                label="Description *" 
                value={formData.description || ''} 
                onChange={handleInputChange}
                required
              />
            </div>
          </Card>

          {/* Loan Details */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                name="minLoanAmount" 
                label="Min Loan Amount (₹) *" 
                type="number" 
                value={formData.minLoanAmount || 0} 
                onChange={handleInputChange} 
                required
              />
              <Input 
                name="maxLoanAmount" 
                label="Max Loan Amount (₹) *" 
                type="number" 
                value={formData.maxLoanAmount || 0} 
                onChange={handleInputChange} 
                required
              />
              <Input 
                name="interestRate" 
                label={`${rateLabel} (% p.a.) *`} 
                type="number" 
                step="0.01"
                min="0"
                max="100"
                value={formData.interestRate || 0} 
                onChange={handleInputChange} 
                required
              />
              <Input 
                name="minTenureMonths" 
                label="Min Tenure (Months) *" 
                type="number" 
                value={formData.minTenureMonths || 0} 
                onChange={handleInputChange} 
                required
              />
              <Input 
                name="maxTenureMonths" 
                label="Max Tenure (Months) *" 
                type="number" 
                value={formData.maxTenureMonths || 0} 
                onChange={handleInputChange} 
                required
              />
              <Select
                name="repaymentFrequency"
                label="Repayment Frequency *"
                value={formData.repaymentFrequency || RepaymentFrequency.MONTHLY}
                onChange={handleInputChange}
                required
                options={[
                  { value: RepaymentFrequency.MONTHLY, label: 'Monthly' },
                  { value: RepaymentFrequency.QUARTERLY, label: 'Quarterly' },
                  { value: RepaymentFrequency.HALF_YEARLY, label: 'Half Yearly' },
                  { value: RepaymentFrequency.YEARLY, label: 'Yearly' },
                ]}
              />
            </div>
          </Card>

          {/* Fees & Charges */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Fees & Charges</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Processing Fee</label>
                <div className="flex gap-2">
                  <Select
                    value={formData.processingFee?.type || 'percentage'}
                    onChange={(e) => handleNestedChange('processingFee', 'type', e.target.value)}
                    options={[
                      { value: 'percentage', label: '%' },
                      { value: 'fixed', label: 'Fixed' },
                    ]}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.processingFee?.value || 0}
                    onChange={(e) => handleNestedChange('processingFee', 'value', parseFloat(e.target.value) || 0)}
                    placeholder="Value"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Prepayment Charges</label>
                <div className="flex gap-2">
                  <Select
                    value={formData.prepaymentCharges?.type || 'percentage'}
                    onChange={(e) => handleNestedChange('prepaymentCharges', 'type', e.target.value)}
                    options={[
                      { value: 'percentage', label: '%' },
                      { value: 'fixed', label: 'Fixed' },
                    ]}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.prepaymentCharges?.value || 0}
                    onChange={(e) => handleNestedChange('prepaymentCharges', 'value', parseFloat(e.target.value) || 0)}
                    placeholder="Value"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Late Payment Charges</label>
                <div className="flex gap-2">
                  <Select
                    value={formData.latePaymentCharges?.type || 'percentage'}
                    onChange={(e) => handleNestedChange('latePaymentCharges', 'type', e.target.value)}
                    options={[
                      { value: 'percentage', label: '%' },
                      { value: 'fixed', label: 'Fixed' },
                    ]}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.latePaymentCharges?.value || 0}
                    onChange={(e) => handleNestedChange('latePaymentCharges', 'value', parseFloat(e.target.value) || 0)}
                    placeholder="Value"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Eligibility Criteria */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="eligibilityCriteria.minAge"
                label="Min Age"
                type="number"
                value={formData.eligibilityCriteria?.minAge || ''}
                onChange={(e) => handleNestedChange('eligibilityCriteria', 'minAge', e.target.value ? parseInt(e.target.value) : undefined)}
              />
              <Input
                name="eligibilityCriteria.maxAge"
                label="Max Age"
                type="number"
                value={formData.eligibilityCriteria?.maxAge || ''}
                onChange={(e) => handleNestedChange('eligibilityCriteria', 'maxAge', e.target.value ? parseInt(e.target.value) : undefined)}
              />
              <Input
                name="eligibilityCriteria.minIncome"
                label="Min Income (₹)"
                type="number"
                value={formData.eligibilityCriteria?.minIncome || ''}
                onChange={(e) => handleNestedChange('eligibilityCriteria', 'minIncome', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
              <Input
                name="eligibilityCriteria.creditScoreMin"
                label="Min Credit Score"
                type="number"
                value={formData.eligibilityCriteria?.creditScoreMin || ''}
                onChange={(e) => handleNestedChange('eligibilityCriteria', 'creditScoreMin', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Employment Types</label>
              <ArrayEditor
                items={formData.eligibilityCriteria?.employmentType || []}
                setItems={(items) => handleNestedChange('eligibilityCriteria', 'employmentType', items)}
                placeholder="Add employment type"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Required Documents (Eligibility)</label>
              <ArrayEditor
                items={formData.eligibilityCriteria?.requiredDocuments || []}
                setItems={(items) => handleNestedChange('eligibilityCriteria', 'requiredDocuments', items)}
                placeholder="Add required document"
              />
            </div>
          </Card>

          {/* Features & Benefits */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Features & Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <ArrayEditor
                  items={formData.features || []}
                  setItems={(items) => setFormData(prev => ({ ...prev, features: items }))}
                  placeholder="Add feature"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Benefits</label>
                <ArrayEditor
                  items={formData.benefits || []}
                  setItems={(items) => setFormData(prev => ({ ...prev, benefits: items }))}
                  placeholder="Add benefit"
                />
              </div>
            </div>
          </Card>

          {/* Documents Required */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Documents Required</h2>
            <ArrayEditor
              items={formData.documentsRequired || []}
              setItems={(items) => setFormData(prev => ({ ...prev, documentsRequired: items }))}
              placeholder="Add required document"
            />
          </Card>

          {/* Application Process */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Application Process</h2>
            <div className="space-y-4">
              <Input
                name="applicationProcess.estimatedTime"
                label="Estimated Time"
                value={formData.applicationProcess?.estimatedTime || ''}
                onChange={(e) => handleNestedChange('applicationProcess', 'estimatedTime', e.target.value)}
                placeholder="e.g., 3-5 business days"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Steps</label>
                <ArrayEditor
                  items={formData.applicationProcess?.steps || []}
                  setItems={(items) => handleNestedChange('applicationProcess', 'steps', items)}
                  placeholder="Add step"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Required Documents (Application)</label>
                <ArrayEditor
                  items={formData.applicationProcess?.requiredDocuments || []}
                  setItems={(items) => handleNestedChange('applicationProcess', 'requiredDocuments', items)}
                  placeholder="Add required document"
                />
              </div>
            </div>
          </Card>

          {/* Terms & Conditions */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
            <Textarea
              name="termsAndConditions"
              label="Terms & Conditions"
              value={formData.termsAndConditions || ''}
              onChange={handleInputChange}
              rows={6}
            />
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.push('/products')}>Cancel</Button>
            <Button type="submit" loading={loading}><Save className="mr-2 h-4 w-4" /> Save Product</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

// Array Editor Component
const ArrayEditor = ({ items, setItems, placeholder }: { items: string[], setItems: (items: string[]) => void, placeholder: string }) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem && !items.includes(newItem)) {
      setItems([...items, newItem]);
      setNewItem('');
    }
  };

  const removeItem = (itemToRemove: string) => {
    setItems(items.filter(item => item !== itemToRemove));
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Input 
          placeholder={placeholder} 
          value={newItem} 
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
        />
        <Button type="button" onClick={addItem}><Plus className="h-4 w-4" /> Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <Badge key={item} variant="neutral" className="flex items-center gap-1">
            {item}
            <button type="button" onClick={() => removeItem(item)} className="ml-1 font-bold">×</button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
