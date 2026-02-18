'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Input,
  Select,
  Textarea,
  Breadcrumbs,
} from '@/components/ui';
import {
  Save,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useEmployeeMutations } from '@/hooks/useEmployeeMutations';
import { CreateEmployeeDto, employeeService } from '@/services/employee.service';
import { useBranches } from '@/hooks/useBranches';
import { useOrganizations } from '@/hooks/useOrganizations';
import { INDIAN_STATES, CITIES_BY_STATE } from '@/lib/indiaData';
import Link from 'next/link';

export default function AddEmployeePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { createEmployee, loading: isSubmitting } = useEmployeeMutations();
  const { branches } = useBranches();
  const { organizations } = useOrganizations();

  const [formData, setFormData] = useState<Partial<CreateEmployeeDto>>({
    employeeId: '',
    branch: '',
    organisation: '',
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: 'male',
    maritalStatus: 'single',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    role: 'junior_officer',
    department: 'administration',
    designation: '',
    dateOfJoining: '',
    salary: 0,
    employmentType: 'full_time',
    reportingManager: '',
    status: 'active',
    password: '',
    accessList: [],
    isAdmin: false,
    canApproveLoans: false,
    canViewReports: false,
    canManageUsers: false,
    canManageEmployees: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedState, setSelectedState] = useState('');
  const [isGeneratingId, setIsGeneratingId] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'firstName' || name === 'lastName') {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        const fullName = name === 'firstName' 
          ? `${value} ${prev.lastName || ''}`.trim()
          : `${prev.firstName || ''} ${value}`.trim();
        return { ...newData, fullName };
      });
    } else if (name === 'state') {
      setSelectedState(value);
      setFormData(prev => ({ ...prev, [name]: value, city: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGenerateEmployeeId = async () => {
    setIsGeneratingId(true);
    try {
      const res = await employeeService.getNextEmployeeId();
      if (res?.data?.employeeId) {
        setFormData(prev => ({ ...prev, employeeId: res.data.employeeId }));
        if (errors.employeeId) setErrors(prev => ({ ...prev, employeeId: '' }));
      }
    } catch (error: any) {
      addToast({ type: 'error', message: error.message || 'Failed to generate employee ID' });
    } finally {
      setIsGeneratingId(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId || formData.employeeId.trim() === '') newErrors.employeeId = 'Employee ID is required';
    if (!formData.branch || formData.branch === '') newErrors.branch = 'Branch is required';
    if (!formData.organisation || formData.organisation === '') newErrors.organisation = 'Organization is required';
    if (!formData.firstName || formData.firstName.trim() === '') newErrors.firstName = 'First name is required';
    if (!formData.lastName || formData.lastName.trim() === '') newErrors.lastName = 'Last name is required';
    if (!formData.email || formData.email.trim() === '') newErrors.email = 'Email is required';
    if (!formData.phone || formData.phone.trim() === '') newErrors.phone = 'Phone is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.addressLine1 || formData.addressLine1.trim() === '') newErrors.addressLine1 = 'Address is required';
    if (!formData.city || formData.city === '') newErrors.city = 'City is required';
    if (!formData.state || formData.state === '') newErrors.state = 'State is required';
    if (!formData.postalCode || formData.postalCode.trim() === '') newErrors.postalCode = 'Postal code is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.designation || formData.designation.trim() === '') newErrors.designation = 'Designation is required';
    if (!formData.dateOfJoining) newErrors.dateOfJoining = 'Date of joining is required';
    if (!formData.salary || formData.salary <= 0) newErrors.salary = 'Salary must be greater than 0';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    
    // Show specific error messages
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.entries(newErrors)[0];
      const fieldName = firstError[0] === 'employeeId' ? 'Employee ID' : 
                       firstError[0] === 'organisation' ? 'Organization' : 
                       firstError[0] === 'addressLine1' ? 'Address' :
                       firstError[0] === 'dateOfBirth' ? 'Date of Birth' :
                       firstError[0] === 'dateOfJoining' ? 'Date of Joining' :
                       firstError[0].charAt(0).toUpperCase() + firstError[0].slice(1).replace(/([A-Z])/g, ' $1');
      addToast({
        type: 'error',
        message: `${fieldName}: ${firstError[1]}`,
      });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const employeeData: CreateEmployeeDto = {
        ...formData,
        salary: Number(formData.salary),
        accessList: formData.accessList || [],
      } as CreateEmployeeDto;

      await createEmployee(employeeData);
      addToast({
        type: 'success',
        message: 'Employee created successfully',
      });
      router.push('/employees');
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to create employee',
      });
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Employees', href: '/employees' },
    { label: 'Add Employee', href: '/employees/add' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Add Employee</h1>
            <p className="text-neutral-600 mt-1">Create a new employee account</p>
          </div>
          <Link href="/employees">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    label="Employee ID *"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    error={errors.employeeId}
                    required
                  />
                </div>
                <div className="flex items-end pb-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateEmployeeId}
                    loading={isGeneratingId}
                    className="whitespace-nowrap"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>
              <Select
                label="Organization *"
                name="organisation"
                value={formData.organisation || ''}
                onChange={handleChange}
                error={errors.organisation}
                options={[
                  { value: '', label: 'Select Organization' },
                  ...(organizations || []).map(org => ({ value: org._id || org.id || '', label: org.organisationName || org.organizationName || org.name || 'Unknown' }))
                ]}
                required
              />
              <Select
                label="Branch *"
                name="branch"
                value={formData.branch || ''}
                onChange={handleChange}
                error={errors.branch}
                options={[
                  { value: '', label: 'Select Branch' },
                  ...(branches || []).map(b => ({ value: b._id || b.id || '', label: b.branchName }))
                ]}
                required
              />
              <Input
                label="First Name *"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name *"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
              <Input
                label="Full Name *"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled
              />
              <Input
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <Input
                label="Phone *"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />
              <Input
                label="Alternate Phone"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
              />
              <Input
                label="Date of Birth *"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth?.toString() || ''}
                onChange={handleChange}
                error={errors.dateOfBirth}
                required
              />
              <Select
                label="Gender *"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              <Select
                label="Marital Status"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                options={[
                  { value: 'single', label: 'Single' },
                  { value: 'married', label: 'Married' },
                  { value: 'divorced', label: 'Divorced' },
                  { value: 'widowed', label: 'Widowed' },
                ]}
              />
            </div>
          </Card>

          {/* Address Information */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Address Line 1 *"
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
              <Select
                label="State *"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={errors.state}
                options={[
                  { value: '', label: 'Select State' },
                  ...INDIAN_STATES.map(s => ({ value: s, label: s }))
                ]}
                required
              />
              <Select
                label="City *"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                disabled={!formData.state}
                options={[
                  { value: '', label: 'Select City' },
                  ...(CITIES_BY_STATE[formData.state || ''] || []).map(c => ({ value: c, label: c }))
                ]}
                required
              />
              <Input
                label="Postal Code *"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                error={errors.postalCode}
                required
              />
              <Input
                label="Country"
                name="country"
                value={formData.country || 'India'}
                onChange={handleChange}
              />
            </div>
          </Card>

          {/* Professional Information */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Role *"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'loan_officer', label: 'Loan Officer' },
                  { value: 'customer_service', label: 'Customer Service' },
                  { value: 'accountant', label: 'Accountant' },
                  { value: 'hr', label: 'HR' },
                  { value: 'it_support', label: 'IT Support' },
                  { value: 'branch_manager', label: 'Branch Manager' },
                  { value: 'senior_officer', label: 'Senior Officer' },
                  { value: 'junior_officer', label: 'Junior Officer' },
                  { value: 'agent', label: 'Agent' },
                ]}
                required
              />
              <Select
                label="Department *"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
                options={[
                  { value: 'administration', label: 'Administration' },
                  { value: 'loan_department', label: 'Loan Department' },
                  { value: 'customer_service', label: 'Customer Service' },
                  { value: 'accounting', label: 'Accounting' },
                  { value: 'human_resources', label: 'Human Resources' },
                  { value: 'information_technology', label: 'IT' },
                  { value: 'operations', label: 'Operations' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'compliance', label: 'Compliance' },
                  { value: 'risk_management', label: 'Risk Management' },
                  { value: 'agent_department', label: 'Agent Department' },
                ]}
                required
              />
              <Input
                label="Designation *"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                error={errors.designation}
                required
              />
              <Input
                label="Date of Joining *"
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining?.toString() || ''}
                onChange={handleChange}
                error={errors.dateOfJoining}
                required
              />
              <Input
                label="Salary *"
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                error={errors.salary}
                required
              />
              <Select
                label="Employment Type *"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                options={[
                  { value: 'full_time', label: 'Full Time' },
                  { value: 'part_time', label: 'Part Time' },
                  { value: 'contract', label: 'Contract' },
                ]}
                required
              />
              <Select
                label="Status *"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'terminated', label: 'Terminated' },
                ]}
              />
            </div>
          </Card>

          {/* Authentication */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Authentication</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Password *"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm text-neutral-700">Admin</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="canApproveLoans"
                    checked={formData.canApproveLoans}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm text-neutral-700">Approve Loans</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="canViewReports"
                    checked={formData.canViewReports}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm text-neutral-700">View Reports</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="canManageUsers"
                    checked={formData.canManageUsers}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm text-neutral-700">Manage Users</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="canManageEmployees"
                    checked={formData.canManageEmployees}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm text-neutral-700">Manage Employees</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/employees">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" type="submit" loading={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              Create Employee
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

