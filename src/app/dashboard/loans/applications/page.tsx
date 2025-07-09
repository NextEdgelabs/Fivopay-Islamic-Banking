"use client";
import { useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/app/context/AppContext";
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
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Toast notification state
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Toast component
const Toast = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const bgColor = toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}>
      <span>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="ml-4 text-white hover:text-gray-200">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

// Confirmation dialog component
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

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

export default function LoanApplicationsPage() {
  const { applications, addApplication, updateApplication, deleteApplication } = useAppContext();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'form' | 'list'>('list');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    applicationId: '', 
    applicationName: '' 
  });
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

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Confirmation dialog functions
  const openDeleteConfirm = (id: string, name: string) => {
    setConfirmDialog({ isOpen: true, applicationId: id, applicationName: name });
  };

  const handleConfirmDelete = () => {
    deleteApplication(confirmDialog.applicationId);
    addToast(`Application for ${confirmDialog.applicationName} has been deleted successfully`, 'success');
    setConfirmDialog({ isOpen: false, applicationId: '', applicationName: '' });
  };

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

  const handleSubmitApplication = () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.loanType || !formData.loanAmount || !formData.employmentType || !formData.monthlyIncome) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    // Create application object
    const newApplication = {
      applicantName: `${formData.firstName} ${formData.lastName}`,
      loanType: formData.loanType,
      amount: parseInt(formData.loanAmount),
      status: 'Submitted' as const,
      email: formData.email,
      phone: formData.phone,
      employmentType: formData.employmentType,
      monthlyIncome: parseInt(formData.monthlyIncome),
      loanPurpose: formData.loanPurpose,
      tenure: formData.tenure
    };

    // Add to context
    addApplication(newApplication);

    // Reset form and return to list view
    setFormData({
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
    setCurrentStep(1);
    setViewMode('list');
    
    addToast(`Application for ${formData.firstName} ${formData.lastName} submitted successfully!`, 'success');
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
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Indian">Indian</option>
                  <option value="UAE">UAE</option>
                  <option value="Saudi">Saudi</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-800">Address Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-800">Employment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select employment type</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Freelancer">Freelancer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income *
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter monthly income"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Financing Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loanTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.value}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.loanType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => handleInputChange('loanType', type.value)}
                    >
                      <IconComponent className="h-8 w-8 text-blue-600 mb-2" />
                      <h4 className="font-medium text-gray-900">{type.label}</h4>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                      <div className="mt-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {type.structure}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount *
                </label>
                <input
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter loan amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenure
                </label>
                <select
                  value={formData.tenure}
                  onChange={(e) => handleInputChange('tenure', e.target.value)}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tenure</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                  <option value="24 months">24 months</option>
                  <option value="36 months">36 months</option>
                  <option value="48 months">48 months</option>
                  <option value="60 months">60 months</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Purpose
                </label>
                <textarea
                  value={formData.loanPurpose}
                  onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
                  rows={3}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the purpose of this financing"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData.documents).map(([key, file]) => (
                <div key={key} className="border border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                          handleFileUpload(key as keyof ApplicationFormData['documents'], selectedFile);
                        }
                      }}
                      className="flex-1"
                    />
                    <CloudArrowUpIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  {file && (
                    <p className="text-sm text-green-600 mt-2">✓ {file.name}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h3>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Applicant Name</label>
                  <p className="text-gray-900">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{formData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{formData.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employment Type</label>
                  <p className="text-gray-900">{formData.employmentType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Monthly Income</label>
                  <p className="text-gray-900">₹{parseInt(formData.monthlyIncome || '0').toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Loan Type</label>
                  <p className="text-gray-900">{loanTypes.find(t => t.value === formData.loanType)?.label}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Loan Amount</label>
                  <p className="text-gray-900">₹{parseInt(formData.loanAmount || '0').toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tenure</label>
                  <p className="text-gray-900">{formData.tenure}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-500">Loan Purpose</label>
                <p className="text-gray-900">{formData.loanPurpose}</p>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-500">Documents Uploaded</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(formData.documents).map(([key, file]) => (
                    <div key={key} className={`text-sm ${file ? 'text-green-600' : 'text-red-600'}`}>
                      {file ? '✓' : '✗'} {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Islamic Banking Compliance</h4>
              <p className="text-sm text-blue-800">
                This application will be processed according to Sharia-compliant banking principles. 
                No interest will be charged, and the financing structure will follow Islamic banking guidelines.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (viewMode === 'form') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Applications
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`ml-4 w-16 h-0.5 ${
                      currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep === steps.length ? (
              <button
                onClick={handleSubmitApplication}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Application
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, applicationId: '', applicationName: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Application"
        message={`Are you sure you want to delete the application for ${confirmDialog.applicationName}? This action cannot be undone.`}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loan Applications</h1>
          <p className="text-slate-600">Manage and track Islamic banking loan applications</p>
        </div>
        <button
          onClick={() => setViewMode('form')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <UserIcon className="h-5 w-5" />
          <span>New Application</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
              <p className="text-sm text-slate-600">Total Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-700">{applications.filter(app => app.status === 'Approved').length}</p>
              <p className="text-sm text-slate-600">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center">
            <InformationCircleIcon className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-yellow-700">{applications.filter(app => app.status === 'Under Review').length}</p>
              <p className="text-sm text-slate-600">Under Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center">
            <BanknotesIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-purple-700">
                ₹{applications.reduce((sum, app) => sum + app.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">Total Amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{application.applicantName}</div>
                      <div className="text-sm text-gray-500">{application.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.loanType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{application.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
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
