"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UserIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAccountContext, NewAccountFormData } from '../context/AccountContext';

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
      <button onClick={() => onRemove(toast.id)} className="ml-4 text-white hover:text-stripe-text-secondary">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default function AccountCreationPage() {
  const router = useRouter();
  const { addAccount } = useAccountContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [formData, setFormData] = useState<NewAccountFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    accountType: '',
    initialDeposit: '',
    branch: '',
    panCard: '',
    aadharCard: ''
  });

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const steps = [
    { id: 1, name: 'Personal Info', icon: UserIcon },
    { id: 2, name: 'Account Details', icon: CreditCardIcon },
    { id: 3, name: 'KYC Documents', icon: DocumentTextIcon },
    { id: 4, name: 'Review', icon: CheckCircleIcon }
  ];

  const accountTypes = [
    {
      type: 'Savings' as const,
      name: 'Standard Savings Account',
      description: 'Standard savings with competitive interest rates',
      minDeposit: 1000
    },
    {
      type: 'Current' as const,
      name: 'Business Current Account',
      description: 'Business current account with regulatory compliance',
      minDeposit: 5000
    },
    {
      type: 'Investment' as const,
      name: 'Investment Account',
      description: 'High-yield investment account with competitive returns',
      minDeposit: 50000
    },
    {
      type: 'Business' as const,
      name: 'Business Account',
      description: 'Comprehensive business banking solutions',
      minDeposit: 25000
    }
  ];

  const branches = [
    'Mumbai Central',
    'Delhi Main',
    'Bangalore Tech',
    'Chennai South',
    'Kolkata East'
  ];

  const handleInputChange = (field: keyof NewAccountFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    try {
      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
          !formData.accountType || !formData.initialDeposit || !formData.branch || 
          !formData.panCard || !formData.aadharCard) {
        addToast('Please fill in all required fields', 'error');
        return;
      }

      // Validate initial deposit
      const deposit = parseInt(formData.initialDeposit);
      const selectedAccountType = accountTypes.find(type => type.type === formData.accountType);
      if (deposit < (selectedAccountType?.minDeposit || 0)) {
        addToast(`Initial deposit must be at least ₹${selectedAccountType?.minDeposit.toLocaleString()} for ${selectedAccountType?.name}`, 'error');
        return;
      }

      // Add account to context
      addAccount(formData);
      
      // Show success message
      addToast(`Account for ${formData.firstName} ${formData.lastName} has been created successfully`, 'success');
      
      // Redirect to account management page after a short delay
      setTimeout(() => {
        router.push('/dashboard/account-management');
      }, 2000);
      
    } catch {
      addToast('Failed to create account. Please try again.', 'error');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-stripe-text">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 border border-stripe-border text-stripe-text rounded-lg focus:ring-2 focus:ring-stripe-primary"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Account Details</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">Select Account Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accountTypes.map((account) => (
                  <div
                    key={account.type}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.accountType === account.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('accountType', account.type)}
                  >
                    <h3 className="font-semibold text-slate-900">{account.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{account.description}</p>
                    <p className="text-sm font-medium text-green-600 mt-2">
                      Min. Deposit: ₹{account.minDeposit.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Initial Deposit</label>
                <input
                  type="number"
                  value={formData.initialDeposit}
                  onChange={(e) => handleInputChange('initialDeposit', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Branch</label>
                <select
                  value={formData.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">KYC Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">PAN Card Number</label>
                <input
                  type="text"
                  value={formData.panCard}
                  onChange={(e) => handleInputChange('panCard', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter PAN number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Aadhar Card Number</label>
                <input
                  type="text"
                  value={formData.aadharCard}
                  onChange={(e) => handleInputChange('aadharCard', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Aadhar number"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Review & Submit</h2>
            <div className="bg-slate-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900">Personal Information</h3>
                <p className="text-slate-600">{formData.firstName} {formData.lastName}</p>
                <p className="text-slate-600">{formData.email} | {formData.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Account Details</h3>
                <p className="text-slate-600">{formData.accountType} Account</p>
                <p className="text-slate-600">Initial Deposit: ₹{parseInt(formData.initialDeposit || '0').toLocaleString()}</p>
                <p className="text-slate-600">Branch: {formData.branch}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Documents</h3>
                <p className="text-slate-600">PAN: {formData.panCard}</p>
                <p className="text-slate-600">Aadhar: {formData.aadharCard}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/account-management" className="text-slate-500 hover:text-slate-700">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Account Creation</h1>
          <p className="text-slate-600">Create a new banking account</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium mt-2 text-slate-600">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-24 h-1 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
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
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            <span>Next</span>
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            <CheckCircleIcon className="h-4 w-4" />
            <span>Submit Application</span>
          </button>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
} 