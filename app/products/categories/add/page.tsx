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
import { createLoanCategory, CreateLoanCategoryDto, LoanSubCategory } from '@/services/loan-categories.service';

export default function AddLoanCategoryPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CreateLoanCategoryDto>({
    name: '',
    description: '',
    isActive: true,
    displayOrder: 1,
    icon: '',
    color: '#6366f1',
    subCategories: [],
  });

  const [subCategories, setSubCategories] = useState<Partial<LoanSubCategory>[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
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
      setLoading(true);
      
      const categoryData: CreateLoanCategoryDto = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        displayOrder: formData.displayOrder,
        icon: formData.icon,
        color: formData.color,
        subCategories: subCategories.map((sub, index) => ({
          name: sub.name || '',
          description: sub.description || '',
          isActive: sub.isActive !== undefined ? sub.isActive : true,
          displayOrder: index + 1,
          interestRateRange: sub.interestRateRange || { min: 0, max: 0 },
          tenureRange: sub.tenureRange || { min: 0, max: 0 },
          amountRange: sub.amountRange || { min: 0, max: 0 },
          eligibilityCriteria: sub.eligibilityCriteria || [],
          requiredDocuments: sub.requiredDocuments || [],
          processingFee: sub.processingFee || 0,
        }))
      };
      
      const response = await createLoanCategory(categoryData);
      
      if (response.success) {
        addToast({ type: 'success', message: 'Loan category created successfully' });
        router.push('/products/categories');
      } else {
        addToast({ type: 'error', message: 'Failed to create loan category' });
      }
    } catch (err: any) {
      console.error('Error creating loan category:', err);
      addToast({ 
        type: 'error', 
        message: err.message || 'Failed to create loan category' 
      });
    } finally {
      setLoading(false);
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
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Personal Loans"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Display Order
                  </label>
                  <Input
                    name="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    placeholder="1"
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
                    Icon
                  </label>
                  <Input
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="e.g., home, car, business"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      name="color"
                      type="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-16 h-10"
                    />
                    <Input
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="#6366f1"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Toggle
                      id="category-active-toggle"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <label className="text-sm font-medium text-neutral-700">
                      Active Category
                    </label>
                  </div>
                </div>
              </div>
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
                        id={`subcategory-active-toggle-${index}`}
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
