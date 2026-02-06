'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Input,
  Select,
  Textarea,
  Breadcrumbs,
  Tabs,
} from '@/components/ui';
import {
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  FileText,
  Shield,
  ArrowLeft,
  Loader,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useCustomer } from '@/hooks/useCustomer';
import { useCustomerMutations } from '@/hooks/useCustomerMutations';
import { validateFile, convertToBase64 } from '@/lib/fileUpload';
import { useOrganizationSettings } from '@/hooks/useOrganizationSettings';
import SharePurchaseHistory from '@/components/customers/SharePurchaseHistory';

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id as string;
  const { addToast } = useToast();

  // Fetch customer data
  const { customer, loading: fetchLoading } = useCustomer(customerId);
  const { updateCustomer, loading: isSubmitting } = useCustomerMutations();
  const { isEthicalBanking } = useOrganizationSettings();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    fatherName: '',
    motherName: '',
    occupation: '',
    annualIncome: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    accountType: '',
    branch: '',
    status: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineePhone: '',
    nomineeAddress: '',
    aadhaarNumber: '',
    panNumber: '',
    passportNumber: '',
    drivingLicenseNumber: '',
    voterIdNumber: '',
    addressProofType: '',
    addressProofNumber: '',
    kycStatus: 'Pending',
    kycNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when customer data loads
  useEffect(() => {
    if (customer) {
      setFormData({
        fullName: customer.fullName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        alternatePhone: customer.alternatePhone || '',
        dateOfBirth: customer.dateOfBirth ? (typeof customer.dateOfBirth === 'string' ? customer.dateOfBirth : customer.dateOfBirth.toISOString().split('T')[0]) : '',
        gender: customer.gender || '',
        maritalStatus: customer.maritalStatus || '',
        fatherName: customer.fatherName || '',
        motherName: customer.motherName || '',
        occupation: customer.occupation || '',
        annualIncome: customer.annualIncome?.toString() || '',
        addressLine1: customer.addressLine1 || '',
        addressLine2: customer.addressLine2 || '',
        city: customer.city || '',
        state: customer.state || '',
        postalCode: customer.postalCode || '',
        country: customer.country || 'India',
        accountType: customer.accountType || '',
        branch: customer.branch || '',
        status: customer.status || '',
        nomineeName: customer.nomineeName || '',
        nomineeRelation: customer.nomineeRelation || '',
        nomineePhone: customer.nomineePhone || '',
        nomineeAddress: customer.nomineeAddress || '',
        aadhaarNumber: customer.aadhaarNumber || '',
        panNumber: customer.panNumber || '',
        passportNumber: customer.passportNumber || '',
        drivingLicenseNumber: customer.drivingLicenseNumber || '',
        voterIdNumber: customer.voterIdNumber || '',
        addressProofType: customer.addressProofType || '',
        addressProofNumber: customer.addressProofNumber || '',
        kycStatus: customer.kycStatus || 'Pending',
        kycNotes: customer.kycNotes || '',
      });
    }
  }, [customer]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle file uploads
    if (type === 'file') {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];

      if (file) {
        const validation = validateFile(file, {
          maxSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ['image/*', 'application/pdf'],
        });

        if (!validation.valid) {
          addToast({
            type: 'error',
            message: validation.error || 'Invalid file',
          });
          return;
        }

        try {
          const base64 = await convertToBase64(file);
          setFormData((prev) => ({ ...prev, [name]: base64 }));
        } catch (err) {
          addToast({
            type: 'error',
            message: 'Failed to process file',
          });
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.accountType) newErrors.accountType = 'Account type is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
        type: 'error',
        message: 'Please fix the errors in the form',
      });
      return;
    }

    try {
      // Transform form data to match UpdateCustomerDto and remove empty strings
      const customerData: any = {};
      
      // Iterate through formData and only include non-empty string values
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof typeof formData];
        
        // Skip empty strings
        if (value === '') {
          return;
        }
        
        // Handle annualIncome specially - convert to number or undefined
        if (key === 'annualIncome') {
          customerData[key] = value ? parseFloat(value as string) : undefined;
        } else {
          customerData[key] = value;
        }
      });

      await updateCustomer(customerId, customerData);
      addToast({
        type: 'success',
        message: `Customer ${formData.fullName} has been updated successfully!`,
      });
      router.push(`/customers/${customerId}`);
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update customer',
      });
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push(`/customers/${customerId}`);
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Customers', href: '/customers' },
    { label: formData.fullName, href: `/customers/${customerId}` },
    { label: 'Edit', href: `/customers/${customerId}/edit` },
  ];

  // Primary Details Tab Content
  const primaryDetailsContent = (
    <div className="p-6 space-y-8">
      {/* Personal Information */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
            leftIcon={<User className="h-4 w-4" />}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            leftIcon={<Mail className="h-4 w-4" />}
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            leftIcon={<Phone className="h-4 w-4" />}
          />

          <Input
            label="Alternate Phone (Optional)"
            name="alternatePhone"
            type="tel"
            value={formData.alternatePhone}
            onChange={handleChange}
            leftIcon={<Phone className="h-4 w-4" />}
            placeholder="+91 XXXXX XXXXX"
          />

          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
            required
          />

          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            error={errors.gender}
            required
            options={[
              { value: '', label: 'Select gender' },
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]}
          />

          <Select
            label="Marital Status"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select marital status' },
              { value: 'Single', label: 'Single' },
              { value: 'Married', label: 'Married' },
              { value: 'Divorced', label: 'Divorced' },
              { value: 'Widowed', label: 'Widowed' },
            ]}
          />

          <Input
            label="Father's Name"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
          />

          <Input
            label="Mother's Name"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
          />

          <Input
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            error={errors.occupation}
            required
            leftIcon={<Briefcase className="h-4 w-4" />}
          />

          <Input
            label="Annual Income (₹)"
            name="annualIncome"
            type="number"
            value={formData.annualIncome}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Address Information */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Address Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              error={errors.addressLine1}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
            />
          </div>

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            required
          />

          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            error={errors.state}
            required
          />

          <Input
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            error={errors.postalCode}
            required
          />

          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled
          />
        </div>
      </div>

      {/* Account Information */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Account Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Account Type"
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            error={errors.accountType}
            required
            options={[
              { value: '', label: 'Select account type' },
              { value: 'Savings', label: 'Savings Account' },
              { value: 'Current', label: 'Current Account' },
              { value: 'Business', label: 'Business Account' },
            ]}
          />

          <Select
            label="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            error={errors.branch}
            required
            options={[
              { value: '', label: 'Select branch' },
              { value: 'Mumbai Central', label: 'Mumbai Central' },
              { value: 'Delhi Main', label: 'Delhi Main' },
              { value: 'Bangalore Tech Park', label: 'Bangalore Tech Park' },
              { value: 'Hyderabad Banjara Hills', label: 'Hyderabad Banjara Hills' },
              { value: 'Pune Koregaon Park', label: 'Pune Koregaon Park' },
            ]}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Blocked', label: 'Blocked' },
            ]}
          />
        </div>
      </div>

      {/* Nominee Information */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Nominee Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nominee Name"
            name="nomineeName"
            value={formData.nomineeName}
            onChange={handleChange}
          />

          <Input
            label="Relation"
            name="nomineeRelation"
            value={formData.nomineeRelation}
            onChange={handleChange}
          />

          <Input
            label="Nominee Phone"
            name="nomineePhone"
            type="tel"
            value={formData.nomineePhone}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Nominee Address"
              name="nomineeAddress"
              value={formData.nomineeAddress}
              onChange={handleChange}
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // KYC Documents Tab Content
  const kycDocumentsContent = (
    <div className="p-6 space-y-8">
      {/* Aadhaar Card */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Aadhaar Card</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Aadhaar Number"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX"
              maxLength={12}
            />
          </div>

          <Input
            label="Aadhaar Front Image"
            name="aadhaarFrontImage"
            type="file"
            onChange={handleChange}
            accept="image/*,.pdf"
          />

          <Input
            label="Aadhaar Back Image"
            name="aadhaarBackImage"
            type="file"
            onChange={handleChange}
            accept="image/*,.pdf"
          />
        </div>
      </div>

      {/* PAN Card */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">PAN Card</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="PAN Number"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            placeholder="ABCDE1234F"
            maxLength={10}
          />

          <Input
            label="PAN Card Image"
            name="panImage"
            type="file"
            onChange={handleChange}
            accept="image/*,.pdf"
          />
        </div>
      </div>

      {/* Passport */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Passport</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Passport Number"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={handleChange}
          />

          <Input
            label="Passport Image"
            name="passportImage"
            type="file"
            onChange={handleChange}
            accept="image/*,.pdf"
          />
        </div>
      </div>

      {/* Driving License */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Driving License</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="License Number"
            name="drivingLicenseNumber"
            value={formData.drivingLicenseNumber}
            onChange={handleChange}
          />

          <Input
            label="License Image"
            name="drivingLicenseImage"
            type="file"
            onChange={handleChange}
            accept="image/*,.pdf"
          />
        </div>
      </div>

      {/* Voter ID */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Voter ID</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Voter ID Number"
            name="voterIdNumber"
            value={formData.voterIdNumber}
            onChange={handleChange}
          />

          <Input
            label="Voter ID Image"
            name="voterIdImage"
            type="file"
            onChange={handleChange}
            accept="image/*,.pdf"
          />
        </div>
      </div>

      {/* Address Proof */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Address Proof</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Address Proof Type"
            name="addressProofType"
            value={formData.addressProofType}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select proof type' },
              { value: 'Utility Bill', label: 'Utility Bill' },
              { value: 'Bank Statement', label: 'Bank Statement' },
              { value: 'Rent Agreement', label: 'Rent Agreement' },
              { value: 'Property Tax Receipt', label: 'Property Tax Receipt' },
            ]}
          />

          <Input
            label="Document Number"
            name="addressProofNumber"
            value={formData.addressProofNumber}
            onChange={handleChange}
          />

          <Input
            label="Address Proof Document"
            name="addressProofImage"
            type="file"
            onChange={handleChange}
            accept="image/*,.pdf"
          />
        </div>
      </div>

      {/* Photograph & Signature */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Photograph & Signature</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Passport Size Photograph"
            name="photographImage"
            type="file"
            onChange={handleChange}
            accept="image/*"
          />

          <Input
            label="Signature Image"
            name="signatureImage"
            type="file"
            onChange={handleChange}
            accept="image/*"
          />
        </div>
      </div>

      {/* KYC Status */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">KYC Status</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="KYC Status"
            name="kycStatus"
            value={formData.kycStatus}
            onChange={handleChange}
            options={[
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Verified', label: 'Verified' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
          />

          <div className="md:col-span-2">
            <Textarea
              label="KYC Notes"
              name="kycNotes"
              value={formData.kycNotes}
              onChange={handleChange}
              rows={3}
              placeholder="Add any notes about KYC verification..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Edit Customer</h1>
              <p className="text-neutral-600 mt-1">Update customer information for {customerId}</p>
            </div>
            <Button variant="outline" onClick={() => router.push(`/customers/${customerId}`)}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Details
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tabs */}
          <Card>
            <Tabs
              tabs={[
                {
                  id: 'primary',
                  label: 'Primary Details',
                  icon: <User className="h-4 w-4" />,
                  content: primaryDetailsContent,
                },
                {
                  id: 'kyc',
                  label: 'KYC Documents',
                  icon: <Shield className="h-4 w-4" />,
                  content: kycDocumentsContent,
                },
                // Conditionally add Share Purchase tab for Ethical Banking
                ...(isEthicalBanking
                  ? [
                      {
                        id: 'shares',
                        label: 'Share Purchase History',
                        icon: <TrendingUp className="h-4 w-4" />,
                        content: <SharePurchaseHistory customerId={customerId} mode="edit" />,
                      },
                    ]
                  : []),
              ]}
              defaultTab="primary"
            />
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              <Save className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
