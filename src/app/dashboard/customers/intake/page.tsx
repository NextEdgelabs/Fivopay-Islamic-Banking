"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/app/context/AppContext";
import { 
  ArrowLeftIcon, 
  UserPlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  MapPinIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CameraIcon
} from "@heroicons/react/24/outline";

interface CustomerFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  
  // Contact Information
  email: string;
  phone: string;
  alternatePhone: string;
  
  // Address Information
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Identity Documents
  idType: string;
  idNumber: string;
  idExpiryDate: string;
  
  // Banking Information
  accountType: string;
  initialDeposit: string;
  monthlyIncome: string;
  employmentStatus: string;
  employer: string;
  
  // Risk Assessment
  riskProfile: string;
  investmentExperience: string;
  sourceOfFunds: string;
}

const initialFormData: CustomerFormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  email: "",
  phone: "",
  alternatePhone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  idType: "",
  idNumber: "",
  idExpiryDate: "",
  accountType: "",
  initialDeposit: "",
  monthlyIncome: "",
  employmentStatus: "",
  employer: "",
  riskProfile: "",
  investmentExperience: "",
  sourceOfFunds: ""
};

const steps = [
  { id: 1, name: "Personal Info", icon: UserPlusIcon },
  { id: 2, name: "Contact & Address", icon: MapPinIcon },
  { id: 3, name: "Identity Verification", icon: IdentificationIcon },
  { id: 4, name: "Banking Details", icon: BanknotesIcon },
  { id: 5, name: "Risk Assessment", icon: ShieldCheckIcon },
  { id: 6, name: "Review & Submit", icon: CheckCircleIcon },
];

const accountTypes = [
  { value: "savings", label: "Islamic Savings Account", description: "Sharia-compliant savings with profit sharing" },
  { value: "current", label: "Current Account", description: "For daily banking transactions" },
  { value: "investment", label: "Investment Account", description: "Higher returns with Islamic investment principles" },
  { value: "business", label: "Business Account", description: "For business and commercial activities" },
];

const riskProfiles = [
  { value: "conservative", label: "Conservative", description: "Low risk, stable returns" },
  { value: "moderate", label: "Moderate", description: "Balanced risk and return" },
  { value: "aggressive", label: "Aggressive", description: "Higher risk, potentially higher returns" },
];

export default function CustomerIntakePage() {
  const router = useRouter();
  const { addCustomer } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState("pending");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [newCustomerId, setNewCustomerId] = useState<string | null>(null);

  const updateFormData = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    // Required field validation
    if (!formData.firstName.trim()) errors.push("First name is required");
    if (!formData.lastName.trim()) errors.push("Last name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.phone.trim()) errors.push("Phone number is required");
    if (!formData.accountType) errors.push("Account type is required");
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push("Invalid email format");
    }
    
    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.push("Invalid phone number format");
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Validate form
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create customer object matching the AppContext Customer type
      const newCustomer = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone || undefined,
        accountType: formData.accountType,
        kycStatus: "Pending" as const,
        verificationLevel: "Level 1",
        joinDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        lastActivity: "Just now",
        accountBalance: formData.initialDeposit ? `$${formData.initialDeposit}` : "$0",
        status: "Pending" as const,
      };
      
      // Save to AppContext
      const customerId = addCustomer(newCustomer);
      
      // Update states
      setKycStatus("submitted");
      setSubmissionSuccess(true);
      setNewCustomerId(customerId);
      
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Failed to submit customer application");
      setKycStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewCustomer = () => {
    if (newCustomerId) {
      router.push(`/dashboard/customers/${newCustomerId}`);
    }
  };

  const handleCreateAnother = () => {
    // Reset form
    setFormData(initialFormData);
    setCurrentStep(1);
    setKycStatus("pending");
    setSubmissionSuccess(false);
    setSubmissionError(null);
    setNewCustomerId(null);
    setTwoFactorEnabled(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-stripe-text">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateFormData("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stripe-text mb-2">Nationality *</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => updateFormData("nationality", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                  placeholder="Enter nationality"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-stripe-text">Contact & Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">
                  <PhoneIcon className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stripe-text mb-2">Street Address *</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => updateFormData("street", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                  placeholder="Enter street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">State/Province *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateFormData("state", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                  placeholder="Enter state or province"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-stripe-text">Identity Verification</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <IdentificationIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">KYC Requirements</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Please provide valid identification documents for verification purposes.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">ID Type *</label>
                <select
                  value={formData.idType}
                  onChange={(e) => updateFormData("idType", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                >
                  <option value="">Select ID type</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="driving_license">Driving License</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">ID Number *</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => updateFormData("idNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                  placeholder="Enter ID number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stripe-text mb-2">Document Upload</label>
                <div className="border-2 border-dashed border-stripe-border rounded-lg p-6 text-center">
                  <CameraIcon className="h-12 w-12 text-stripe-text-secondary mx-auto mb-2" />
                  <p className="text-sm text-stripe-text-secondary">
                    Upload a clear photo of your identification document
                  </p>
                  <button className="mt-2 px-4 py-2 bg-stripe-primary text-white rounded-md hover:bg-stripe-primary/90">
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-stripe-text">Banking Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-3">Account Type *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accountTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.accountType === type.value
                          ? "border-stripe-primary bg-stripe-primary/5"
                          : "border-stripe-border hover:border-stripe-primary/50"
                      }`}
                      onClick={() => updateFormData("accountType", type.value)}
                    >
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          checked={formData.accountType === type.value}
                          onChange={() => updateFormData("accountType", type.value)}
                          className="h-4 w-4 text-stripe-primary"
                        />
                        <label className="ml-3 font-medium text-stripe-text">{type.label}</label>
                      </div>
                      <p className="text-sm text-stripe-text-secondary">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stripe-text mb-2">Initial Deposit *</label>
                  <input
                    type="number"
                    value={formData.initialDeposit}
                    onChange={(e) => updateFormData("initialDeposit", e.target.value)}
                    className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                    placeholder="Enter initial deposit amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stripe-text mb-2">Monthly Income *</label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => updateFormData("monthlyIncome", e.target.value)}
                    className="w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                    placeholder="Enter monthly income"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-stripe-text">Risk Assessment</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Risk Profile Assessment</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This helps us recommend suitable Islamic banking products for you.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stripe-text mb-3">Risk Profile *</label>
              <div className="space-y-3">
                {riskProfiles.map((profile) => (
                  <div
                    key={profile.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.riskProfile === profile.value
                        ? "border-stripe-primary bg-stripe-primary/5"
                        : "border-stripe-border hover:border-stripe-primary/50"
                    }`}
                    onClick={() => updateFormData("riskProfile", profile.value)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.riskProfile === profile.value}
                        onChange={() => updateFormData("riskProfile", profile.value)}
                        className="h-4 w-4 text-stripe-primary"
                      />
                      <div className="ml-3">
                        <label className="font-medium text-stripe-text">{profile.label}</label>
                        <p className="text-sm text-stripe-text-secondary">{profile.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-stripe-text">Review & Submit</h3>
            <div className="bg-stripe-background-light rounded-lg p-6">
              <h4 className="font-medium text-stripe-text mb-4">Application Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-stripe-text-secondary">Name:</span>
                  <span className="ml-2 text-stripe-text">{formData.firstName} {formData.lastName}</span>
                </div>
                <div>
                  <span className="text-stripe-text-secondary">Email:</span>
                  <span className="ml-2 text-stripe-text">{formData.email}</span>
                </div>
                <div>
                  <span className="text-stripe-text-secondary">Account Type:</span>
                  <span className="ml-2 text-stripe-text">{accountTypes.find(t => t.value === formData.accountType)?.label}</span>
                </div>
                <div>
                  <span className="text-stripe-text-secondary">Risk Profile:</span>
                  <span className="ml-2 text-stripe-text">{formData.riskProfile}</span>
                </div>
              </div>
            </div>
            
            {/* 2FA Setup */}
            <div className="bg-white border border-stripe-border rounded-lg p-6">
              <h4 className="font-medium text-stripe-text mb-4">Security Setup</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stripe-text">Two-Factor Authentication</p>
                  <p className="text-sm text-stripe-text-secondary">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-stripe-primary focus:ring-offset-2 ${
                    twoFactorEnabled ? 'bg-stripe-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/customers"
            className="p-2 hover:bg-stripe-background-light rounded-md transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-stripe-text-secondary" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-stripe-text">Customer Intake</h1>
            <p className="text-stripe-text-secondary">
              Complete customer onboarding with Islamic banking compliance
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                      ? "bg-stripe-primary border-stripe-primary text-white"
                      : "bg-white border-stripe-border text-stripe-text-secondary"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${isActive || isCompleted ? "text-stripe-text" : "text-stripe-text-secondary"}`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${isCompleted ? "bg-green-500" : "bg-stripe-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-stripe-border">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 border rounded-md transition-colors ${
              currentStep === 1
                ? "border-stripe-border text-stripe-text-secondary cursor-not-allowed"
                : "border-stripe-border text-stripe-text hover:bg-stripe-background-light"
            }`}
          >
            Previous
          </button>

          {currentStep === steps.length ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-stripe-primary text-white rounded-md hover:bg-stripe-primary/90 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-stripe-primary text-white rounded-md hover:bg-stripe-primary/90"
            >
              Next Step
            </button>
          )}
        </div>
      </div>

      {/* Success Status */}
      {submissionSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start">
            <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3 mt-1" />
            <div className="flex-1">
              <h4 className="text-lg font-medium text-green-800 mb-2">Customer Created Successfully!</h4>
              <p className="text-sm text-green-700 mb-4">
                The new customer has been added to the system with ID: <strong>{newCustomerId}</strong>. 
                The customer status is set to "Pending" and will be updated after KYC verification is completed.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleViewCustomer}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  View Customer Profile
                </button>
                <button
                  onClick={handleCreateAnother}
                  className="px-4 py-2 bg-white text-green-700 text-sm font-medium border border-green-300 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Create Another Customer
                </button>
                <Link
                  href="/dashboard/customers"
                  className="px-4 py-2 bg-white text-green-700 text-sm font-medium border border-green-300 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Go to Customer Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Status */}
      {submissionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 mt-1" />
            <div className="flex-1">
              <h4 className="text-lg font-medium text-red-800 mb-2">Submission Failed</h4>
              <p className="text-sm text-red-700 mb-4">
                {submissionError}
              </p>
              <button
                onClick={() => setSubmissionError(null)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
