"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CogIcon
} from "@heroicons/react/24/outline";

interface ProductFormData {
  name: string;
  type: 'Personal' | 'Business' | 'Home' | 'Vehicle' | 'Education' | '';
  minAmount: string;
  maxAmount: string;
  profitRate: string;
  tenure: string;
  description: string;
  
  // Islamic Banking Specific Fields
  shariaStructure: 'Murabaha' | 'Musharakah' | 'Ijara' | 'Istisna' | 'Salam' | '';
  profitSharingRatio: string;
  
  // Eligibility Criteria
  minAge: string;
  maxAge: string;
  minIncome: string;
  employmentType: string[];
  creditScore: string;
  
  // Documentation Requirements
  requiredDocuments: string[];
  
  // Terms and Conditions
  processingFee: string;
  prepaymentCharges: string;
  latePaymentPenalty: string;
  
  // Product Status
  status: 'Draft' | 'Active' | 'Inactive';
}

export default function CreateProductPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    type: '',
    minAmount: '',
    maxAmount: '',
    profitRate: '',
    tenure: '',
    description: '',
    shariaStructure: '',
    profitSharingRatio: '',
    minAge: '18',
    maxAge: '65',
    minIncome: '',
    employmentType: [],
    creditScore: '',
    requiredDocuments: [],
    processingFee: '',
    prepaymentCharges: '',
    latePaymentPenalty: '',
    status: 'Draft'
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productTypes = [
    { value: 'Personal', label: 'Personal Financing', description: 'Individual consumer financing' },
    { value: 'Business', label: 'Business Financing', description: 'Commercial and SME financing' },
    { value: 'Home', label: 'Home Financing', description: 'Residential property purchase' },
    { value: 'Vehicle', label: 'Vehicle Financing', description: 'Auto and vehicle purchase' },
    { value: 'Education', label: 'Education Financing', description: 'Educational expenses and fees' }
  ];

  const shariaStructures = [
    { value: 'Murabaha', label: 'Murabaha', description: 'Cost-plus profit arrangement' },
    { value: 'Musharakah', label: 'Musharakah', description: 'Profit and loss sharing partnership' },
    { value: 'Ijara', label: 'Ijara', description: 'Lease-to-own arrangement' },
    { value: 'Istisna', label: 'Istisna', description: 'Manufacturing/construction contract' },
    { value: 'Salam', label: 'Salam', description: 'Forward purchase contract' }
  ];

  const employmentTypes = [
    'Salaried Employee',
    'Self Employed',
    'Business Owner',
    'Professional',
    'Government Employee',
    'Retired'
  ];

  const documentOptions = [
    'PAN Card',
    'Aadhar Card',
    'Income Tax Returns',
    'Salary Slips',
    'Bank Statements',
    'Property Documents',
    'Business Registration',
    'Financial Statements',
    'Employment Certificate',
    'Address Proof'
  ];

  const handleInputChange = (field: keyof ProductFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleArrayToggle = (field: keyof ProductFormData, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleInputChange(field, newArray);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.type) newErrors.type = 'Product type is required';
    if (!formData.minAmount || parseFloat(formData.minAmount) <= 0) newErrors.minAmount = 'Valid minimum amount is required';
    if (!formData.maxAmount || parseFloat(formData.maxAmount) <= 0) newErrors.maxAmount = 'Valid maximum amount is required';
    if (parseFloat(formData.maxAmount) <= parseFloat(formData.minAmount)) newErrors.maxAmount = 'Maximum amount must be greater than minimum';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.shariaStructure) newErrors.shariaStructure = 'Sharia structure is required';
    if (!formData.tenure.trim()) newErrors.tenure = 'Tenure is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally send the data to your API
      console.log('Creating product:', formData);
      
      // Redirect back to products page or show success message
      // For now, we'll just log success
      alert('Product created successfully!');
      
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/loans/products"
          className="text-slate-500 hover:text-slate-700"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Product</h1>
          <p className="text-slate-600">Create a new Islamic banking loan product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center space-x-2 mb-6">
            <BanknotesIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Product Type *</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select product type</option>
                {productTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Amount (₹) *</label>
              <input
                type="number"
                value={formData.minAmount}
                onChange={(e) => handleInputChange('minAmount', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.minAmount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="50000"
              />
              {errors.minAmount && <p className="text-red-500 text-xs mt-1">{errors.minAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Maximum Amount (₹) *</label>
              <input
                type="number"
                value={formData.maxAmount}
                onChange={(e) => handleInputChange('maxAmount', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.maxAmount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1000000"
              />
              {errors.maxAmount && <p className="text-red-500 text-xs mt-1">{errors.maxAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tenure</label>
              <input
                type="text"
                value={formData.tenure}
                onChange={(e) => handleInputChange('tenure', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 6-36 months"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the loan product features and benefits"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Islamic Banking Configuration */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center space-x-2 mb-6">
            <DocumentTextIcon className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-slate-900">Islamic Banking Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sharia Structure *</label>
              <select
                value={formData.shariaStructure}
                onChange={(e) => handleInputChange('shariaStructure', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.shariaStructure ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Sharia structure</option>
                {shariaStructures.map((structure) => (
                  <option key={structure.value} value={structure.value}>{structure.label}</option>
                ))}
              </select>
              {errors.shariaStructure && <p className="text-red-500 text-xs mt-1">{errors.shariaStructure}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Profit Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.profitRate}
                onChange={(e) => handleInputChange('profitRate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              <p className="text-xs text-slate-500 mt-1">Leave blank for profit-sharing products</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Profit Sharing Ratio (%)</label>
              <input
                type="number"
                value={formData.profitSharingRatio}
                onChange={(e) => handleInputChange('profitSharingRatio', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="60"
              />
              <p className="text-xs text-slate-500 mt-1">For Musharakah products</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Sharia Compliance</h4>
                <p className="text-sm text-green-700 mt-1">
                  This product will be reviewed by our Sharia Advisory Board to ensure full compliance 
                  with Islamic banking principles before activation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center space-x-2 mb-6">
            <CogIcon className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-slate-900">Eligibility Criteria</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Age</label>
              <input
                type="number"
                value={formData.minAge}
                onChange={(e) => handleInputChange('minAge', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="18"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Maximum Age</label>
              <input
                type="number"
                value={formData.maxAge}
                onChange={(e) => handleInputChange('maxAge', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="65"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Income (₹)</label>
              <input
                type="number"
                value={formData.minIncome}
                onChange={(e) => handleInputChange('minIncome', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25000"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">Employment Types</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {employmentTypes.map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.employmentType.includes(type)}
                    onChange={() => handleArrayToggle('employmentType', type)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">Required Documents</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {documentOptions.map((doc) => (
                <label key={doc} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requiredDocuments.includes(doc)}
                    onChange={() => handleArrayToggle('requiredDocuments', doc)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">{doc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Terms and Conditions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Processing Fee (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.processingFee}
                onChange={(e) => handleInputChange('processingFee', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Prepayment Charges (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.prepaymentCharges}
                onChange={(e) => handleInputChange('prepaymentCharges', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Late Payment Penalty (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.latePaymentPenalty}
                onChange={(e) => handleInputChange('latePaymentPenalty', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.50"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center">
          <Link
            href="/dashboard/loans/products"
            className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Cancel
          </Link>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => handleInputChange('status', 'Draft')}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 