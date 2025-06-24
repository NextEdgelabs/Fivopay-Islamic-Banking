"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserIcon,
  BanknotesIcon,
  HomeIcon,
  TruckIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  InformationCircleIcon,
  CloudArrowUpIcon,
  EyeIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface ApplicationFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Employment Information
  employmentType: string;
  companyName: string;
  jobTitle: string;
  monthlyIncome: string;
  workExperience: string;
  
  // Loan Information
  loanType: string;
  loanAmount: string;
  loanPurpose: string;
  tenure: string;
  
  // Documents
  documents: {
    panCard: File | null;
    aadharCard: File | null;
    salarySlips: File | null;
    bankStatements: File | null;
    incomeProof: File | null;
  };
}

interface LoanApplication {
  id: string;
  applicantName: string;
  loanType: string;
  amount: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  submittedDate: string;
  lastUpdate: string;
}

export default function LoanApplicationsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'form' | 'list'>('list');
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: 'Indian',
    address: '',
    city: '',
    state: '',
    pincode: '',
    employmentType: '',
    companyName: '',
    jobTitle: '',
    monthlyIncome: '',
    workExperience: '',
    loanType: '',
    loanAmount: '',
    loanPurpose: '',
    tenure: '',
    documents: {
      panCard: null,
      aadharCard: null,
      salarySlips: null,
      bankStatements: null,
      incomeProof: null,
    }
  });

  // Mock applications data
  const applications: LoanApplication[] = [
    {
      id: 'APP001',
      applicantName: 'Ahmed Hassan',
      loanType: 'Personal Financing',
      amount: 500000,
      status: 'Under Review',
      submittedDate: '2024-01-25',
      lastUpdate: '2024-01-26'
    },
    {
      id: 'APP002',
      applicantName: 'Fatima Al-Zahra',
      loanType: 'Home Financing',
      amount: 2500000,
      status: 'Approved',
      submittedDate: '2024-01-24',
      lastUpdate: '2024-01-25'
    },
    {
      id: 'APP003',
      applicantName: 'Mohammad Ali',
      loanType: 'Business Financing',
      amount: 750000,
      status: 'Submitted',
      submittedDate: '2024-01-23',
      lastUpdate: '2024-01-23'
    }
  ];

  const loanTypes = [
    { 
      value: 'personal', 
      label: 'Personal Financing', 
      description: 'Sharia-compliant personal financing for individual needs',
      icon: UserIcon,
      minAmount: 50000,
      maxAmount: 1000000,
      structure: 'Murabaha'
    },
    { 
      value: 'home', 
      label: 'Home Financing', 
      description: 'Islamic home purchase financing through Ijara structure',
      icon: HomeIcon,
      minAmount: 1000000,
      maxAmount: 50000000,
      structure: 'Ijara'
    },
    { 
      value: 'vehicle', 
      label: 'Vehicle Financing', 
      description: 'Sharia-compliant vehicle financing with flexible terms',
      icon: TruckIcon,
      minAmount: 200000,
      maxAmount: 5000000,
      structure: 'Murabaha'
    },
    { 
      value: 'business', 
      label: 'Business Financing', 
      description: 'Islamic business financing through Musharakah principles',
      icon: BuildingOfficeIcon,
      minAmount: 500000,
      maxAmount: 10000000,
      structure: 'Musharakah'
    },
    { 
      value: 'education', 
      label: 'Education Financing', 
      description: 'Educational financing with flexible repayment options',
      icon: AcademicCapIcon,
      minAmount: 100000,
      maxAmount: 2000000,
      structure: 'Murabaha'
    }
  ];

  const steps = [
    { id: 1, name: 'Personal Information', icon: UserIcon },
    { id: 2, name: 'Loan Details', icon: BanknotesIcon },
    { id: 3, name: 'Documents', icon: DocumentTextIcon },
    { id: 4, name: 'Review & Submit', icon: CheckCircleIcon }
  ];

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (documentType: keyof ApplicationFormData['documents'], file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nationality</label>
                <select
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Indian">Indian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter complete address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">PIN Code *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter PIN code"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type *</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select employment type</option>
                    <option value="Salaried">Salaried Employee</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income (₹) *</label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter monthly income"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Work Experience (years)</label>
                  <input
                    type="number"
                    value={formData.workExperience}
                    onChange={(e) => handleInputChange('workExperience', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter work experience"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Select Loan Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loanTypes.map((type) => (
                <div
                  key={type.value}
                  onClick={() => handleInputChange('loanType', type.value)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.loanType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      formData.loanType === type.value ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <type.icon className={`h-6 w-6 ${
                        formData.loanType === type.value ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{type.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Amount: ₹{(type.minAmount / 100000).toFixed(1)}L - ₹{(type.maxAmount / 100000).toFixed(1)}L</p>
                        <p>Structure: {type.structure}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.loanType && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Loan Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Loan Amount (₹) *</label>
                    <input
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter loan amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tenure (months) *</label>
                    <select
                      value={formData.tenure}
                      onChange={(e) => handleInputChange('tenure', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select tenure</option>
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                      <option value="48">48 months</option>
                      <option value="60">60 months</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Loan Purpose *</label>
                  <textarea
                    value={formData.loanPurpose}
                    onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the purpose of the loan"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Upload Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'panCard', label: 'PAN Card', required: true },
                { key: 'aadharCard', label: 'Aadhar Card', required: true },
                { key: 'salarySlips', label: 'Salary Slips (Last 3 months)', required: true },
                { key: 'bankStatements', label: 'Bank Statements (Last 6 months)', required: true },
                { key: 'incomeProof', label: 'Income Proof', required: false }
              ].map((doc) => (
                <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-slate-700">
                      {doc.label} {doc.required && <span className="text-red-500">*</span>}
                    </label>
                    {formData.documents[doc.key as keyof ApplicationFormData['documents']] && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {formData.documents[doc.key as keyof ApplicationFormData['documents']]
                        ? formData.documents[doc.key as keyof ApplicationFormData['documents']]?.name
                        : 'Click to upload or drag and drop'
                      }
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(doc.key as keyof ApplicationFormData['documents'], e.target.files[0])}
                      className="hidden"
                      id={doc.key}
                    />
                    <label
                      htmlFor={doc.key}
                      className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Document Guidelines</h4>
                  <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
                    <li>All documents should be clear and legible</li>
                    <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
                    <li>Maximum file size: 5MB per document</li>
                    <li>Documents should not be older than 6 months</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Review Your Application</h3>
            
            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-semibold text-slate-900 mb-4">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Name:</span>
                  <span className="ml-2 font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>
                  <span className="ml-2 font-medium">{formData.email}</span>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>
                  <span className="ml-2 font-medium">{formData.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500">Monthly Income:</span>
                  <span className="ml-2 font-medium">₹{formData.monthlyIncome}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-semibold text-slate-900 mb-4">Loan Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Loan Type:</span>
                  <span className="ml-2 font-medium">
                    {loanTypes.find(t => t.value === formData.loanType)?.label}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Amount:</span>
                  <span className="ml-2 font-medium">₹{Number(formData.loanAmount).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500">Tenure:</span>
                  <span className="ml-2 font-medium">{formData.tenure} months</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-semibold text-slate-900 mb-4">Documents Uploaded</h4>
              <div className="space-y-2">
                {Object.entries(formData.documents).map(([key, file]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      {key === 'panCard' ? 'PAN Card' :
                       key === 'aadharCard' ? 'Aadhar Card' :
                       key === 'salarySlips' ? 'Salary Slips' :
                       key === 'bankStatements' ? 'Bank Statements' :
                       'Income Proof'}
                    </span>
                    {file ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        <span>Uploaded</span>
                      </div>
                    ) : (
                      <span className="text-red-600">Not uploaded</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Islamic Banking Compliance</h4>
                  <p className="text-sm text-green-700 mt-1">
                    This application will be processed according to Islamic banking principles and Sharia law compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (viewMode === 'form') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode('list')}
            className="text-slate-500 hover:text-slate-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">New Loan Application</h1>
            <p className="text-slate-600">Apply for Islamic banking loan products</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium mt-2 text-slate-600">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg ${
                currentStep === 1 ? 'bg-slate-300 text-slate-600' : 'bg-slate-300 text-slate-600 hover:bg-slate-800'
              }`}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/loans"
            className="text-slate-500 hover:text-slate-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Loan Applications</h1>
            <p className="text-slate-600">Manage and track loan applications</p>
          </div>
        </div>
        <button
          onClick={() => setViewMode('form')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          New Application
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {application.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.applicantName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.loanType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ₹{application.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900" title="View">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="Edit">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
