'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCustomers } from '../../context/CustomerContext';
import { Customer, CustomerType, Gender, MaritalStatus, CustomerStatus, RiskRating } from '@/types/customer';
import { 
  ArrowLeftIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
  BriefcaseIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// ============================================================================
// VALIDATION SCHEMA - Single unified schema
// ============================================================================
const customerFormSchema = z.object({
  // Basic Information
  customerType: z.nativeEnum(CustomerType),
  title: z.string().optional(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  fatherName: z.string().min(2, 'Father\'s name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.nativeEnum(Gender),
  maritalStatus: z.nativeEnum(MaritalStatus).optional(),
  nationality: z.string().min(2, 'Nationality is required'),
  
  // Contact Information
  primaryMobile: z.string().min(10, 'Valid mobile number is required'),
  secondaryMobile: z.string().optional(),
  primaryEmail: z.string().email('Valid email is required'),
  secondaryEmail: z.string().email().optional().or(z.literal('')),
  preferredLanguage: z.string().min(2, 'Preferred language is required'),
  
  // Professional Information
  occupation: z.string().optional(),
  annualIncome: z.number().min(0, 'Annual income cannot be negative').optional(),
  incomeSource: z.string().optional(),
  customerSegment: z.string().optional(),
  customerCategory: z.string().optional(),
  
  // Risk & Status
  pepStatus: z.boolean(),
  riskRating: z.nativeEnum(RiskRating),
  status: z.nativeEnum(CustomerStatus)
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return dateString.split('T')[0];
  }
};

const convertCustomerToFormData = (customer: Customer): CustomerFormData => {
  return {
    customerType: customer.customerType as CustomerType,
    title: customer.title || '',
    firstName: customer.firstName,
    middleName: customer.middleName || '',
    lastName: customer.lastName,
    fatherName: customer.fatherName,
    dateOfBirth: formatDateForInput(customer.dateOfBirth),
    gender: customer.gender as Gender,
    maritalStatus: (customer.maritalStatus as MaritalStatus) || MaritalStatus.SINGLE,
    nationality: customer.nationality,
    primaryMobile: customer.primaryMobile,
    secondaryMobile: customer.secondaryMobile || '',
    primaryEmail: customer.primaryEmail,
    secondaryEmail: customer.secondaryEmail || '',
    preferredLanguage: customer.preferredLanguage,
    occupation: customer.occupation || '',
    annualIncome: Number(customer.annualIncome) || 0,
    incomeSource: customer.incomeSource || '',
    customerSegment: customer.customerSegment || '',
    customerCategory: customer.customerCategory || '',
    pepStatus: Boolean(customer.pepStatus),
    riskRating: customer.riskRating as RiskRating,
    status: customer.status as CustomerStatus
  };
};

// ============================================================================
// FORM FIELD COMPONENT
// ============================================================================
interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

const FormField = ({ label, error, children, required = false, icon: Icon }: FormFieldProps) => (
  <div className="space-y-2">
    <label className="form-label flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2 text-stripe-text-secondary" />}
      {label}
      {required && <span className="text-stripe-error ml-1">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-sm text-stripe-error flex items-center">
        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

// ============================================================================
// LOADING SKELETON
// ============================================================================
const EditFormSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="card">
      <div className="card-content">
        <div className="h-6 bg-stripe-background rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-stripe-background rounded w-1/3"></div>
              <div className="h-10 bg-stripe-background rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchCustomerById, updateCustomer, loading, errors, clearErrors } = useCustomers();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(true);

  const customerId = params.customerId as string;

  // Initialize form with default values
  const methods = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    mode: 'onChange',
    defaultValues: {
      customerType: CustomerType.INDIVIDUAL,
      title: '',
      firstName: '',
      middleName: '',
      lastName: '',
      fatherName: '',
      dateOfBirth: '',
      gender: Gender.MALE,
      maritalStatus: MaritalStatus.SINGLE,
      nationality: '',
      primaryMobile: '',
      secondaryMobile: '',
      primaryEmail: '',
      secondaryEmail: '',
      preferredLanguage: 'en',
      occupation: '',
      annualIncome: 0,
      incomeSource: '',
      customerSegment: '',
      customerCategory: '',
      pepStatus: false,
      riskRating: RiskRating.LOW,
      status: CustomerStatus.ACTIVE
    }
  });

  const { register, handleSubmit, formState: { errors: formErrors }, reset, watch } = methods;

  // Load customer data
  useEffect(() => {
    const loadCustomer = async () => {
      if (!customerId) return;
      
      try {
        setIsLoadingCustomer(true);
        console.log('📡 Loading customer:', customerId);
        
        const customerData = await fetchCustomerById(customerId);
        
        if (customerData) {
          console.log('✅ Customer loaded:', customerData);
          setCustomer(customerData);
          
          // Convert and populate form
          const formData = convertCustomerToFormData(customerData);
          console.log('📝 Populating form with:', formData);
          
          reset(formData);
          
          // Verify after a brief delay
          setTimeout(() => {
            const currentValues = methods.getValues();
            console.log('🔍 Form values after reset:', currentValues);
            
            if (currentValues.firstName) {
              console.log('✅ Form successfully populated!');
            } else {
              console.error('❌ Form population failed!');
            }
          }, 100);
        } else {
          console.error('❌ No customer data received');
        }
      } catch (error) {
        console.error('❌ Error loading customer:', error);
      } finally {
        setIsLoadingCustomer(false);
      }
    };

    loadCustomer();
  }, [customerId, fetchCustomerById, reset, methods]);

  // Handle form submission
  const onSubmit = useCallback(async (data: CustomerFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      clearErrors();

      console.log('📤 Submitting customer update:', data);
      
      const result = await updateCustomer(customerId, { ...data, customerId });
      
      if (result) {
        console.log('✅ Customer updated successfully');
        setSubmitSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/customers/${customerId}`);
        }, 2000);
      } else {
        setSubmitError('Failed to update customer. Please try again.');
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [customerId, updateCustomer, clearErrors, router]);

  // Loading state
  if (loading.customers || isLoadingCustomer) {
    return <EditFormSkeleton />;
  }

  // Error state
  if (errors.customers) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="card-content text-center py-12">
            <ExclamationTriangleIcon className="w-12 h-12 text-stripe-error mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stripe-text mb-2">Error Loading Customer</h3>
            <p className="text-stripe-text-secondary mb-4">{errors.customers}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Customer not found
  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="card-content text-center py-12">
            <UserCircleIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stripe-text mb-2">Customer Not Found</h3>
            <p className="text-stripe-text-secondary mb-4">
              Customer ID: <code className="px-2 py-1 bg-stripe-background rounded">{customerId}</code>
            </p>
            <button onClick={() => router.push('/dashboard/customers')} className="btn btn-primary">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Customers
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="btn btn-secondary">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-stripe-text">Edit Customer</h1>
              <p className="text-stripe-text-secondary">
                Editing: {customer.firstName} {customer.lastName} ({customer.customerId})
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="card border-green-200 bg-green-50">
            <div className="card-content">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Customer Updated Successfully</h3>
                  <p className="text-sm text-green-700 mt-1">Redirecting to customer details...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="card border-red-200 bg-red-50">
            <div className="card-content">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Update Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
                <button onClick={() => setSubmitError(null)} className="text-red-600 hover:text-red-800">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Debug Panel */}
        <div className="card border-blue-200 bg-blue-50">
          <div className="card-content">
            <details>
              <summary className="cursor-pointer font-semibold text-blue-800 mb-2">
                🔍 Debug Info - Current Form State
              </summary>
              <div className="mt-2 space-y-2 text-xs">
                <div>
                  <strong>Form Values:</strong>
                  <pre className="mt-1 p-2 bg-white rounded overflow-auto max-h-60">
                    {JSON.stringify(watch(), null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card">
            <div className="card-content">
              <h2 className="text-lg font-semibold text-stripe-text mb-6">Customer Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Type */}
                <FormField label="Customer Type" error={formErrors.customerType?.message} required>
                  <select {...register('customerType')} className="form-input">
                    <option value={CustomerType.INDIVIDUAL}>Individual</option>
                    <option value={CustomerType.BUSINESS}>Business</option>
                    <option value={CustomerType.NRI}>NRI</option>
                  </select>
                </FormField>

                {/* Title */}
                <FormField label="Title" error={formErrors.title?.message}>
                  <select {...register('title')} className="form-input">
                    <option value="">Select Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </FormField>

                {/* First Name */}
                <FormField label="First Name" error={formErrors.firstName?.message} required icon={UserCircleIcon}>
                  <input {...register('firstName')} type="text" className="form-input" placeholder="Enter first name" />
                </FormField>

                {/* Middle Name */}
                <FormField label="Middle Name" error={formErrors.middleName?.message} icon={UserCircleIcon}>
                  <input {...register('middleName')} type="text" className="form-input" placeholder="Enter middle name" />
                </FormField>

                {/* Last Name */}
                <FormField label="Last Name" error={formErrors.lastName?.message} required icon={UserCircleIcon}>
                  <input {...register('lastName')} type="text" className="form-input" placeholder="Enter last name" />
                </FormField>

                {/* Father's Name */}
                <FormField label="Father's Name" error={formErrors.fatherName?.message} required icon={UserCircleIcon}>
                  <input {...register('fatherName')} type="text" className="form-input" placeholder="Enter father's name" />
                </FormField>

                {/* Date of Birth */}
                <FormField label="Date of Birth" error={formErrors.dateOfBirth?.message} required icon={CalendarIcon}>
                  <input {...register('dateOfBirth')} type="date" className="form-input" />
                </FormField>

                {/* Gender */}
                <FormField label="Gender" error={formErrors.gender?.message} required>
                  <select {...register('gender')} className="form-input">
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                    <option value={Gender.OTHER}>Other</option>
                  </select>
                </FormField>

                {/* Marital Status */}
                <FormField label="Marital Status" error={formErrors.maritalStatus?.message}>
                  <select {...register('maritalStatus')} className="form-input">
                    <option value="">Select Marital Status</option>
                    <option value={MaritalStatus.SINGLE}>Single</option>
                    <option value={MaritalStatus.MARRIED}>Married</option>
                    <option value={MaritalStatus.DIVORCED}>Divorced</option>
                    <option value={MaritalStatus.WIDOWED}>Widowed</option>
                  </select>
                </FormField>

                {/* Nationality */}
                <FormField label="Nationality" error={formErrors.nationality?.message} required>
                  <input {...register('nationality')} type="text" className="form-input" placeholder="Enter nationality" />
                </FormField>

                {/* Primary Mobile */}
                <FormField label="Primary Mobile" error={formErrors.primaryMobile?.message} required icon={PhoneIcon}>
                  <input {...register('primaryMobile')} type="tel" className="form-input" placeholder="Enter mobile number" />
                </FormField>

                {/* Secondary Mobile */}
                <FormField label="Secondary Mobile" error={formErrors.secondaryMobile?.message} icon={PhoneIcon}>
                  <input {...register('secondaryMobile')} type="tel" className="form-input" placeholder="Enter secondary mobile" />
                </FormField>

                {/* Primary Email */}
                <FormField label="Primary Email" error={formErrors.primaryEmail?.message} required icon={EnvelopeIcon}>
                  <input {...register('primaryEmail')} type="email" className="form-input" placeholder="Enter email address" />
                </FormField>

                {/* Secondary Email */}
                <FormField label="Secondary Email" error={formErrors.secondaryEmail?.message} icon={EnvelopeIcon}>
                  <input {...register('secondaryEmail')} type="email" className="form-input" placeholder="Enter secondary email" />
                </FormField>

                {/* Preferred Language */}
                <FormField label="Preferred Language" error={formErrors.preferredLanguage?.message} required>
                  <select {...register('preferredLanguage')} className="form-input">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ur">Urdu</option>
                    <option value="bn">Bengali</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                    <option value="mr">Marathi</option>
                    <option value="gu">Gujarati</option>
                  </select>
                </FormField>

                {/* Occupation */}
                <FormField label="Occupation" error={formErrors.occupation?.message} icon={BriefcaseIcon}>
                  <input {...register('occupation')} type="text" className="form-input" placeholder="Enter occupation" />
                </FormField>

                {/* Annual Income */}
                <FormField label="Annual Income" error={formErrors.annualIncome?.message} icon={CurrencyDollarIcon}>
                  <input {...register('annualIncome', { valueAsNumber: true })} type="number" className="form-input" placeholder="Enter annual income" />
                </FormField>

                {/* Income Source */}
                <FormField label="Income Source" error={formErrors.incomeSource?.message}>
                  <input {...register('incomeSource')} type="text" className="form-input" placeholder="Enter income source" />
                </FormField>

                {/* Customer Segment */}
                <FormField label="Customer Segment" error={formErrors.customerSegment?.message}>
                  <select {...register('customerSegment')} className="form-input">
                    <option value="">Select Segment</option>
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </FormField>

                {/* Customer Category */}
                <FormField label="Customer Category" error={formErrors.customerCategory?.message}>
                  <select {...register('customerCategory')} className="form-input">
                    <option value="">Select Category</option>
                    <option value="Regular">Regular</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Professional">Professional</option>
                    <option value="Student">Student</option>
                    <option value="High Net Worth">High Net Worth</option>
                  </select>
                </FormField>

                {/* PEP Status */}
                <FormField label="PEP Status" error={formErrors.pepStatus?.message}>
                  <select {...register('pepStatus', { setValueAs: v => v === 'true' })} className="form-input">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </FormField>

                {/* Risk Rating */}
                <FormField label="Risk Rating" error={formErrors.riskRating?.message} required icon={ShieldCheckIcon}>
                  <select {...register('riskRating')} className="form-input">
                    <option value={RiskRating.LOW}>Low</option>
                    <option value={RiskRating.MEDIUM}>Medium</option>
                    <option value={RiskRating.HIGH}>High</option>
                  </select>
                </FormField>

                {/* Status */}
                <FormField label="Status" error={formErrors.status?.message} required>
                  <select {...register('status')} className="form-input">
                    <option value={CustomerStatus.ACTIVE}>Active</option>
                    <option value={CustomerStatus.INACTIVE}>Inactive</option>
                    <option value={CustomerStatus.DORMANT}>Dormant</option>
                    <option value={CustomerStatus.CLOSED}>Closed</option>
                    <option value={CustomerStatus.BLOCKED}>Blocked</option>
                  </select>
                </FormField>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-stripe-border">
                <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary flex items-center space-x-2">
                  {isSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Update Customer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
