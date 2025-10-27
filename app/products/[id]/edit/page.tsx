'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs, Textarea, Skeleton, Badge } from '@/components/ui';
import { Save, X, Plus, Trash2, GitCommit } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct';
import { useProductMutations } from '@/hooks/useProductMutations';
import { useToast } from '@/components/ui/Toast';
import { UpdateLoanProductDto, CreateLoanProductDto, ProductType, EligibilityRule } from '@/services/products.service';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  // Debug logging to help identify the issue
  console.log('EditProductPage - params:', params);
  console.log('EditProductPage - productId:', productId);
  
  const { product, loading: fetchLoading } = useProduct(productId);
  const { updateProduct, createProduct, loading } = useProductMutations();
  const { addToast } = useToast();
  
  const [productType, setProductType] = useState<ProductType>('Term Deposit');
  const [formData, setFormData] = useState<Partial<UpdateLoanProductDto>>({});

  useEffect(() => {
    if (product) {
      setProductType(product.type);
      setFormData(product);
    }
  }, [product]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Type change is disabled during edit to maintain data integrity
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) {
      addToast({ type: 'error', message: 'Product ID is missing' });
      return;
    }
    
    try {
      const updateData = {
        ...formData,
        _id: productId
      } as UpdateLoanProductDto;
      await updateProduct(updateData);
      addToast({ type: 'success', message: 'Product updated successfully' });
      router.push(`/products/${productId}`);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to update product' });
    }
  };
  
  const handleCreateNewVersion = async () => {
    if (!product) return;
    
    const newVersionData = {
      ...formData,
      version: product.version + 1,
    };
    delete newVersionData.id;

    try {
      const newProduct = await createProduct(newVersionData as CreateLoanProductDto);
      addToast({ type: 'success', message: `Created new version ${newProduct.version}` });
      router.push(`/products/${newProduct.id}/edit`);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to create new version' });
    }
  };

  if (fetchLoading) return <DashboardLayout><Skeleton className="h-screen w-full" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Products', href: '/products' }, { label: product?.name || 'Edit', href: `/products/${productId}` }, { label: 'Edit' }]} />
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/products/${productId}`)}><X className="mr-2 h-4 w-4" />Cancel</Button>
            <Button variant="outline" onClick={handleCreateNewVersion} loading={loading}><GitCommit className="mr-2 h-4 w-4" /> Create New Version</Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Core Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Product Name" value={formData.name || ''} onChange={handleChange} required />
              <Select name="type" label="Product Type" value={productType} onChange={handleTypeChange} disabled options={[{ label: 'Term Deposit', value: 'Term Deposit' }, { label: 'Loan', value: 'Loan' }]} />
            </div>
            <div className="mt-4">
              <Textarea name="description" label="Description" value={formData.description || ''} onChange={handleChange} />
            </div>
            <div className="mt-4 w-full md:w-1/2">
              <Select name="status" label="Status" value={formData.status} onChange={handleChange} options={[{ label: 'Draft', value: 'Draft' }, { label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
            </div>
          </Card>

          {productType === 'Term Deposit' && <TermDepositFields formData={formData} handleChange={handleChange} />}
          {productType === 'Loan' && <LoanFields formData={formData} handleChange={handleChange} />}

          <EligibilityRulesEditor rules={formData.eligibilityRules || []} setRules={(rules) => setFormData(prev => ({ ...prev, eligibilityRules: rules }))} />
          <RequiredDocumentsEditor documents={formData.requiredDocuments || []} setDocuments={(docs) => setFormData(prev => ({ ...prev, requiredDocuments: docs }))} />
          <FeesEditor fees={formData.fees || {}} setFees={(fees) => setFormData(prev => ({ ...prev, fees: fees }))} />

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.push(`/products/${productId}`)}>Cancel</Button>
            <Button type="submit" loading={loading}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

const TermDepositFields = ({ formData, handleChange }: { formData: any, handleChange: any }) => {
    const handleRateChange = (index: number, field: string, value: string) => {
    const rates = { ...(formData.interestRates || {}) };
    const key = Object.keys(rates)[index];
    const rateValue = rates[key];
    delete rates[key];
    rates[field === 'tenure' ? value : key] = field === 'rate' ? value : rateValue;
    handleChange({ target: { name: 'interestRates', value: rates } });
  };
  
  const addRate = () => {
    const rates = { ...(formData.interestRates || {}) };
    rates[''] = '';
    handleChange({ target: { name: 'interestRates', value: rates } });
  };

  const removeRate = (key: string) => {
    const rates = { ...(formData.interestRates || {}) };
    delete rates[key];
    handleChange({ target: { name: 'interestRates', value: rates } });
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Term Deposit Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select name="subType" label="Sub-Type" value={formData.subType || ''} onChange={handleChange} options={[{ label: 'Fixed Deposit', value: 'Fixed Deposit' }, { label: 'Recurring Deposit', value: 'Recurring Deposit' }]} />
        <Select name="compoundingFrequency" label="Compounding Frequency" value={formData.compoundingFrequency || ''} onChange={handleChange} options={[{ label: 'Monthly', value: 'Monthly' }, { label: 'Quarterly', value: 'Quarterly' }, { label: 'Half-Yearly', value: 'Half-Yearly' }, { label: 'Yearly', value: 'Yearly' }]} />
        <Input name="minDeposit" label="Min Deposit (₹)" type="number" value={formData.minDeposit || ''} onChange={handleChange} />
        <Input name="maxDeposit" label="Max Deposit (₹)" type="number" value={formData.maxDeposit || ''} onChange={handleChange} />
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Interest Rates by Tenure</h3>
        <div className="space-y-2">
          {Object.entries(formData.interestRates || {}).map(([tenure, rate], index) => (
            <div key={index} className="flex items-center gap-2">
              <Input placeholder="Tenure (Months)" type="number" value={tenure} onChange={e => handleRateChange(index, 'tenure', e.target.value)} />
              <Input placeholder="Rate (%)" type="number" value={rate as string} onChange={e => handleRateChange(index, 'rate', e.target.value)} />
              <Button variant="danger" size="sm" onClick={() => removeRate(tenure)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-2" onClick={addRate}><Plus className="mr-2 h-4 w-4" /> Add Rate</Button>
      </div>
    </Card>
  );
};

const LoanFields = ({ formData, handleChange }: { formData: any, handleChange: any }) => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select name="subType" label="Sub-Type" value={formData.subType || ''} onChange={handleChange} options={['Business', 'Education', 'Home', 'Personal', 'Emergency'].map(v => ({ label: v, value: v }))} />
      <Input name="interestRate" label="Interest Rate (% p.a.)" type="number" value={formData.interestRate || ''} onChange={handleChange} />
      <Input name="minTenure" label="Min Tenure (Months)" type="number" value={formData.minTenure || ''} onChange={handleChange} />
      <Input name="maxTenure" label="Max Tenure (Months)" type="number" value={formData.maxTenure || ''} onChange={handleChange} />
      <Input name="minAmount" label="Min Amount (₹)" type="number" value={formData.minAmount || ''} onChange={handleChange} />
      <Input name="maxAmount" label="Max Amount (₹)" type="number" value={formData.maxAmount || ''} onChange={handleChange} />
      <Input name="processingFee" label="Processing Fee (%)" type="number" value={formData.processingFee || ''} onChange={handleChange} />
    </div>
  </Card>
);

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
            <Button variant="danger" size="sm" onClick={() => removeRule(index)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="mt-2" onClick={addRule}><Plus className="mr-2 h-4 w-4" /> Add Rule</Button>
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
        <Button onClick={addDocument}><Plus className="h-4 w-4" /> Add</Button>
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
            <Button variant="ghost" size="sm" onClick={() => removeFee(name)}><Trash2 className="h-4 w-4 text-error-500" /></Button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder="Fee Name" value={newFeeName} onChange={e => setNewFeeName(e.target.value)} />
        <Input placeholder="Value" type="number" value={newFeeValue} onChange={e => setNewFeeValue(e.target.value)} />
        <Button onClick={addFee}><Plus className="h-4 w-4" /> Add</Button>
      </div>
    </Card>
  );
};
