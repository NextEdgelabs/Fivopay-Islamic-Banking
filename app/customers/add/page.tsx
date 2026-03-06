'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  TrendingUp,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useCustomerMutations } from '@/hooks/useCustomerMutations';
import { validateFile, convertToBase64 } from '@/lib/fileUpload';
import { useOrganizationSettings } from '@/hooks/useOrganizationSettings';
import SharePurchaseHistory from '@/components/customers/SharePurchaseHistory';
import { createCustomer } from '@/services/customers.service';
import { getAllBranches } from '@/services/branch.service';
import { getAllOrganizations } from '@/services/organization.service';
import type { Branch } from '@/services/branch.service';
import type { Organization } from '@/services/organization.service';

export default function AddCustomerPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { loading: isSubmitting } = useCustomerMutations();
  const { isEthicalBanking } = useOrganizationSettings();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('primary');

  const [formData, setFormData] = useState({
    // Primary Details
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
    initialDeposit: '',
    branch: '',
    organisation: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineePhone: '',
    nomineeAddress: '',

    // KYC Details
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

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [branchesRes, orgs] = await Promise.all([
          getAllBranches({ limit: 100 }),
          getAllOrganizations(),
        ]);
        const branchList = branchesRes?.data?.branches || [];
        setBranches(branchList);
        setOrganizations(Array.isArray(orgs) ? orgs : []);

        if (orgs?.length && !formData.organisation) {
          const firstOrg = orgs[0];
          const orgId = firstOrg._id || (firstOrg as any).id;
          if (orgId) {
            setFormData((prev) => ({ ...prev, organisation: orgId }));
          }
        }
        if (branchList.length === 1 && !formData.branch) {
          const firstBranch = branchList[0];
          const branchId = firstBranch._id || (firstBranch as any).id;
          if (branchId) {
            setFormData((prev) => ({ ...prev, branch: String(branchId) }));
          }
        }
      } catch {
        setBranches([]);
        setOrganizations([]);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

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

  const validateForm = (): { valid: boolean; firstErrorTab: string; errorKeys: string[] } => {
    const newErrors: Record<string, string> = {};

    // Primary Details Validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else if (new Date(formData.dateOfBirth) > new Date()) newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.accountType) newErrors.accountType = 'Account type is required';
    if (!formData.initialDeposit) {
      newErrors.initialDeposit = 'Initial deposit is required';
    } else if (Number(formData.initialDeposit) < 1000) {
      newErrors.initialDeposit = 'Minimum deposit is ₹1,000';
    }
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (organizations.length > 0 && !formData.organisation) {
      newErrors.organisation = 'Organization is required';
    }

    // KYC Validation - Optional; validate format only when provided
    if (formData.aadhaarNumber?.trim() && formData.aadhaarNumber.length !== 12) {
      newErrors.aadhaarNumber = 'Aadhaar number must be 12 digits';
    }
    if (formData.panNumber?.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
    }

    setErrors(newErrors);

    const primaryFields = ['fullName', 'email', 'phone', 'dateOfBirth', 'gender', 'occupation', 'addressLine1', 'city', 'state', 'postalCode', 'accountType', 'initialDeposit', 'branch', 'organisation'];
    const errorKeys = Object.keys(newErrors);
    const firstErrorKey = errorKeys[0];
    const firstErrorTab = firstErrorKey && primaryFields.includes(firstErrorKey) ? 'primary' : 'kyc';

    return { valid: errorKeys.length === 0, firstErrorTab, errorKeys };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { valid, firstErrorTab, errorKeys } = validateForm();
    if (!valid) {
      setActiveTab(firstErrorTab);
      addToast({
        type: 'error',
        message: `Please fix: ${errorKeys.join(', ')}`,
      });
      return;
    }

    try {
      const customerData: Record<string, unknown> = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        alternatePhone: formData.alternatePhone?.trim() || undefined,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus || undefined,
        fatherName: formData.fatherName?.trim() || undefined,
        motherName: formData.motherName?.trim() || undefined,
        occupation: formData.occupation.trim(),
        annualIncome: formData.annualIncome ? Number(formData.annualIncome) : undefined,
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2?.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country || 'India',
        accountType: formData.accountType,
        initialDeposit: Number(formData.initialDeposit),
        branch: formData.branch,
        organisation: formData.organisation || undefined,
        nomineeName: formData.nomineeName?.trim() || undefined,
        nomineeRelation: formData.nomineeRelation?.trim() || undefined,
        nomineePhone: formData.nomineePhone?.trim() || undefined,
        nomineeAddress: formData.nomineeAddress?.trim() || undefined,
        kycStatus: formData.kycStatus || 'Pending',
        kycNotes: formData.kycNotes?.trim() || undefined,
      };
      if (formData.aadhaarNumber?.trim()) customerData.aadhaarNumber = formData.aadhaarNumber.trim();
      if (formData.panNumber?.trim()) customerData.panNumber = formData.panNumber.trim().toUpperCase();
      if (formData.passportNumber?.trim()) customerData.passportNumber = formData.passportNumber.trim();
      if (formData.drivingLicenseNumber?.trim()) customerData.drivingLicenseNumber = formData.drivingLicenseNumber.trim();
      if (formData.voterIdNumber?.trim()) customerData.voterIdNumber = formData.voterIdNumber.trim();
      if (formData.addressProofType?.trim()) customerData.addressProofType = formData.addressProofType.trim();
      if (formData.addressProofNumber?.trim()) customerData.addressProofNumber = formData.addressProofNumber.trim();

      await createCustomer(customerData as any);
      addToast({
        type: 'success',
        message: `Customer ${formData.fullName} has been added successfully!`,
      });
      router.push('/customers');
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create customer',
      });
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      router.push('/customers');
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Customers', href: '/customers' },
    { label: 'Add New Customer', href: '/customers/add' },
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
            placeholder="+91 XXXXX XXXXX"
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
            max={new Date().toISOString().split('T')[0]}
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
            placeholder="e.g., 500000"
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
              placeholder="House/Flat No., Street Name"
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Area, Landmark (Optional)"
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
            placeholder="6-digit PIN code"
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
          {organizations.length > 0 && (
            <Select
              label="Organization"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              error={errors.organisation}
              required={organizations.length > 0}
              options={[
                { value: '', label: 'Select organization' },
                ...organizations.map((org) => ({
                  value: org._id || (org as any).id || '',
                  label: org.organisationName || org.organizationName || org.name || 'Unknown',
                })),
              ]}
            />
          )}

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

          <Input
            label="Initial Deposit (₹)"
            name="initialDeposit"
            type="number"
            value={formData.initialDeposit}
            onChange={handleChange}
            error={errors.initialDeposit}
            required
            placeholder="Minimum ₹1,000"
          />

          <Select
            label="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            error={errors.branch}
            required
            disabled={loadingData}
            options={[
              { value: '', label: loadingData ? 'Loading branches...' : 'Select branch' },
              ...branches.map((b) => ({
                value: String(b._id || (b as any).id),
                label: `${b.branchName}${b.branchCode ? ` (${b.branchCode})` : ''}`,
              })),
            ]}
          />
        </div>
      </div>

      {/* Nominee Information */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Nominee Information</h2>
          <span className="text-sm text-neutral-500">(Optional)</span>
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
            placeholder="e.g., Spouse, Father, Mother"
          />

          <Input
            label="Nominee Phone"
            name="nomineePhone"
            type="tel"
            value={formData.nomineePhone}
            onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
          />

          <div className="md:col-span-2">
            <Textarea
              label="Nominee Address"
              name="nomineeAddress"
              value={formData.nomineeAddress}
              onChange={handleChange}
              rows={2}
              placeholder="Complete address of nominee"
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
          <span className="text-sm text-neutral-500">(Optional)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Aadhaar Number"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              error={errors.aadhaarNumber}
              placeholder="XXXX XXXX XXXX (12 digits)"
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
          <span className="text-sm text-neutral-500">(Optional)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="PAN Number"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            error={errors.panNumber}
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
          <span className="text-sm text-neutral-500">(Optional)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Passport Number"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={handleChange}
            placeholder="e.g., A1234567"
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
          <span className="text-sm text-neutral-500">(Optional)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="License Number"
            name="drivingLicenseNumber"
            value={formData.drivingLicenseNumber}
            onChange={handleChange}
            placeholder="e.g., MH1234567890123"
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
          <span className="text-sm text-neutral-500">(Optional)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Voter ID Number"
            name="voterIdNumber"
            value={formData.voterIdNumber}
            onChange={handleChange}
            placeholder="e.g., ABC1234567"
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

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-neutral-900">Add New Customer</h1>
            <p className="text-neutral-600 mt-1">Register a new customer account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tabs */}
          <Card>
            <Tabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
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
                        content: <SharePurchaseHistory customerId="" mode="add" />,
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
              {isSubmitting ? 'Creating Account...' : 'Create Customer Account'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
