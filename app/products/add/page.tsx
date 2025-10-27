'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs, Textarea, Badge } from '@/components/ui';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { useProductMutations } from '@/hooks/useProductMutations';
import { useToast } from '@/components/ui/Toast';
import { 
  CreateLoanProductDto, 
  ProductType, 
  ProductStatus,
  EligibilityRule,
  TermDepositProduct 
} from '@/services/products.service';

export default function AddProductPage() {
  const router = useRouter();
  const { createProduct, loading, error } = useProductMutations();
  const { addToast } = useToast();
  const [productType, setProductType] = useState<ProductType>(ProductType.TERM_DEPOSIT);
  const [formData, setFormData] = useState<Partial<CreateLoanProductDto>>({
    name: '',
    description: '',
    status: ProductStatus.DRAFT,
    type: ProductType.TERM_DEPOSIT,
    termDeposit: {
      subType: 'Fixed Deposit',
      interestRates: {},
      minDeposit: 0,
      maxDeposit: 0,
      compoundingFrequency: 'Quarterly'
    },
    eligibilityRules: [],
    requiredDocuments: [],
    fees: {},
    createdBy: 'admin', // This should come from auth context
  });

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ProductType;
    setProductType(newType);
    setFormData(prev => ({
      ...prev,
      type: newType,
      termDeposit: newType === ProductType.TERM_DEPOSIT ? {
        subType: 'Fixed Deposit',
        interestRates: {},
        minDeposit: 0,
        maxDeposit: 0,
        compoundingFrequency: 'Quarterly'
      } : undefined,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTermDepositChange = (field: keyof TermDepositProduct, value: any) => {
    setFormData(prev => ({
      ...prev,
      termDeposit: {
        ...prev.termDeposit!,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare the data for API
      const submitData: CreateLoanProductDto = {
        name: formData.name!,
        type: formData.type!,
        description: formData.description,
        status: formData.status,
        createdBy: formData.createdBy!,
        eligibilityRules: formData.eligibilityRules,
        requiredDocuments: formData.requiredDocuments,
        fees: formData.fees,
      };

      // Add term deposit data if it's a term deposit product
      if (formData.type === ProductType.TERM_DEPOSIT && formData.termDeposit) {
        submitData.termDeposit = formData.termDeposit;
      }

      await createProduct(submitData);
      addToast({ type: 'success', message: 'Product created successfully' });
      router.push('/products');
    } catch (err) {
      addToast({ 
        type: 'error', 
        message: error || 'Failed to create product' 
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Products', href: '/products' }, { label: 'Add' }]} />
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <Button variant="outline" onClick={() => router.push('/products')}><X className="mr-2 h-4 w-4" />Cancel</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Core Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                name="name" 
                label="Product Name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
              <Select 
                name="type" 
                label="Product Type" 
                value={productType} 
                onChange={handleTypeChange} 
                options={[
                  { label: 'Term Deposit', value: ProductType.TERM_DEPOSIT }, 
                  { label: 'Loan', value: ProductType.LOAN }
                ]} 
              />
            </div>
            <div className="mt-4">
              <Textarea 
                name="description" 
                label="Description" 
                value={formData.description} 
                onChange={handleChange} 
              />
            </div>
            <div className="mt-4 w-full md:w-1/2">
              <Select 
                name="status" 
                label="Status" 
                value={formData.status} 
                onChange={handleChange} 
                options={[
                  { label: 'Draft', value: ProductStatus.DRAFT }, 
                  { label: 'Active', value: ProductStatus.ACTIVE }, 
                  { label: 'Inactive', value: ProductStatus.INACTIVE },
                  { label: 'Pending Approval', value: ProductStatus.PENDING_APPROVAL },
                  { label: 'Retired', value: ProductStatus.RETIRED }
                ]} 
              />
            </div>
          </Card>

          {productType === ProductType.TERM_DEPOSIT && (
            <TermDepositFields 
              formData={formData} 
              handleChange={handleChange}
              handleTermDepositChange={handleTermDepositChange}
            />
          )}

          <EligibilityRulesEditor 
            rules={formData.eligibilityRules || []} 
            setRules={(rules) => setFormData(prev => ({ ...prev, eligibilityRules: rules }))} 
          />
          <RequiredDocumentsEditor 
            documents={formData.requiredDocuments || []} 
            setDocuments={(docs) => setFormData(prev => ({ ...prev, requiredDocuments: docs }))} 
          />
          <FeesEditor 
            fees={formData.fees || {}} 
            setFees={(fees) => setFormData(prev => ({ ...prev, fees: fees }))} 
          />

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.push('/products')}>Cancel</Button>
            <Button type="submit" loading={loading}><Save className="mr-2 h-4 w-4" /> Save Product</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

const TermDepositFields = ({ 
  formData, 
  handleChange, 
  handleTermDepositChange 
}: { 
  formData: any, 
  handleChange: any,
  handleTermDepositChange: (field: keyof TermDepositProduct, value: any) => void
}) => {
  const interestRates = formData.termDeposit?.interestRates || {};
  const ratesArray = Object.entries(interestRates).map(([tenure, rate]) => ({ tenure, rate }));

  const handleRateChange = (index: number, field: string, value: string) => {
    const newRates = { ...interestRates };
    const currentRate = ratesArray[index];
    
    if (field === 'tenure') {
      // Remove old tenure and add new one
      if (currentRate.tenure) {
        delete newRates[currentRate.tenure];
      }
      if (value) {
        newRates[parseInt(value)] = parseFloat(currentRate.rate) || 0;
      }
    } else if (field === 'rate') {
      if (currentRate.tenure) {
        newRates[parseInt(currentRate.tenure)] = parseFloat(value) || 0;
      }
    }
    
    handleTermDepositChange('interestRates', newRates);
  };
  
  const addRate = () => {
    const newRates = { ...interestRates };
    // Find next available tenure (starting from 12 months)
    let tenure = 12;
    while (newRates[tenure]) {
      tenure += 6; // Increment by 6 months
    }
    newRates[tenure] = 0;
    handleTermDepositChange('interestRates', newRates);
  };

  const removeRate = (index: number) => {
    const newRates = { ...interestRates };
    const tenureToRemove = parseInt(ratesArray[index].tenure);
    delete newRates[tenureToRemove];
    handleTermDepositChange('interestRates', newRates);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Term Deposit Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select 
          name="subType" 
          label="Sub-Type" 
          value={formData.termDeposit?.subType} 
          onChange={(e) => handleTermDepositChange('subType', e.target.value)} 
          options={[
            { label: 'Fixed Deposit', value: 'Fixed Deposit' }, 
            { label: 'Recurring Deposit', value: 'Recurring Deposit' }
          ]} 
        />
        <Select 
          name="compoundingFrequency" 
          label="Compounding Frequency" 
          value={formData.termDeposit?.compoundingFrequency} 
          onChange={(e) => handleTermDepositChange('compoundingFrequency', e.target.value)} 
          options={[
            { label: 'Monthly', value: 'Monthly' }, 
            { label: 'Quarterly', value: 'Quarterly' }, 
            { label: 'Half-Yearly', value: 'Half-Yearly' }, 
            { label: 'Yearly', value: 'Yearly' }
          ]} 
        />
        <Input 
          name="minDeposit" 
          label="Min Deposit (₹)" 
          type="number" 
          value={formData.termDeposit?.minDeposit || ''} 
          onChange={(e) => handleTermDepositChange('minDeposit', parseFloat(e.target.value) || 0)} 
        />
        <Input 
          name="maxDeposit" 
          label="Max Deposit (₹)" 
          type="number" 
          value={formData.termDeposit?.maxDeposit || ''} 
          onChange={(e) => handleTermDepositChange('maxDeposit', parseFloat(e.target.value) || 0)} 
        />
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Interest Rates by Tenure</h3>
        <div className="space-y-2">
          {ratesArray.map((rate: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input 
                placeholder="Tenure (Months)" 
                type="number" 
                value={rate.tenure} 
                onChange={e => handleRateChange(index, 'tenure', e.target.value)} 
              />
              <Input 
                placeholder="Rate (%)" 
                type="number" 
                value={rate.rate} 
                onChange={e => handleRateChange(index, 'rate', e.target.value)} 
              />
              <Button type="button" variant="danger" size="sm" onClick={() => removeRate(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addRate}>
          <Plus className="mr-2 h-4 w-4" /> Add Rate
        </Button>
      </div>
    </Card>
  );
};


const EligibilityRulesEditor = ({ rules, setRules }: { rules: EligibilityRule[], setRules: (rules: EligibilityRule[]) => void }) => {
  const addRule = () => {
    setRules([...rules, { field: 'age', operator: '>=', value: '' }]);
  };

  const updateRule = (index: number, field: keyof EligibilityRule, value: any) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Eligibility Rules</h2>
      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select value={rule.field} onChange={e => updateRule(index, 'field', e.target.value)} options={[{label: 'Age', value: 'age'}, {label: 'Annual Income', value: 'annualIncome'}, {label: 'Occupation', value: 'occupation'}]} />
            <Select value={rule.operator} onChange={e => updateRule(index, 'operator', e.target.value)} options={['==', '!=', '>=', '<=', '>', '<'].map(op => ({label: op, value: op}))} />
            <Input placeholder="Value" value={rule.value} onChange={e => updateRule(index, 'value', e.target.value)} />
            <Button type="button" variant="danger" size="sm" onClick={() => removeRule(index)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addRule}><Plus className="mr-2 h-4 w-4" /> Add Rule</Button>
    </Card>
  );
};

const RequiredDocumentsEditor = ({ documents, setDocuments }: { documents: string[], setDocuments: (docs: string[]) => void }) => {
  const [newDoc, setNewDoc] = useState('');

  const addDocument = () => {
    if (newDoc && !documents.includes(newDoc)) {
      setDocuments([...documents, newDoc]);
      setNewDoc('');
    }
  };

  const removeDocument = (docToRemove: string) => {
    setDocuments(documents.filter(doc => doc !== docToRemove));
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
      <div className="flex items-center gap-2 mb-4">
        <Input placeholder="Enter document name..." value={newDoc} onChange={e => setNewDoc(e.target.value)} />
        <Button type="button" onClick={addDocument}><Plus className="h-4 w-4" /> Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {documents.map(doc => (
          <Badge key={doc} variant="neutral" className="flex items-center gap-1">
            {doc}
            <button onClick={() => removeDocument(doc)} className="ml-1 font-bold">×</button>
          </Badge>
        ))}
      </div>
    </Card>
  );
};

const FeesEditor = ({ fees, setFees }: { fees: { [key: string]: number }, setFees: (fees: { [key: string]: number }) => void }) => {
  const [newFeeName, setNewFeeName] = useState('');
  const [newFeeValue, setNewFeeValue] = useState('');

  const addFee = () => {
    if (newFeeName && newFeeValue) {
      setFees({ ...fees, [newFeeName]: parseFloat(newFeeValue) });
      setNewFeeName('');
      setNewFeeValue('');
    }
  };
  
  const removeFee = (feeName: string) => {
    const newFees = { ...fees };
    delete newFees[feeName];
    setFees(newFees);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Fees & Charges</h2>
      <div className="space-y-2 mb-4">
        {Object.entries(fees).map(([name, value]) => (
          <div key={name} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
            <span>{name}: {value}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeFee(name)}><Trash2 className="h-4 w-4 text-error-500" /></Button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder="Fee Name" value={newFeeName} onChange={e => setNewFeeName(e.target.value)} />
        <Input placeholder="Value" type="number" value={newFeeValue} onChange={e => setNewFeeValue(e.target.value)} />
        <Button type="button" onClick={addFee}><Plus className="h-4 w-4" /> Add</Button>
      </div>
    </Card>
  );
};
