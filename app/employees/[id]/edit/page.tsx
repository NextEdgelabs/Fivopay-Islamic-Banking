'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Input,
  Select,
  Breadcrumbs,
} from '@/components/ui';
import {
  Save,
  ArrowLeft,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useEmployee } from '@/hooks/useEmployee';
import { useEmployeeMutations } from '@/hooks/useEmployeeMutations';
import { UpdateEmployeeDto } from '@/services/employee.service';
import { useBranches } from '@/hooks/useBranches';
import { useOrganizations } from '@/hooks/useOrganizations';
import { INDIAN_STATES, CITIES_BY_STATE } from '@/lib/indiaData';
import Link from 'next/link';

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id as string;
  const { addToast } = useToast();
  const { employee, loading: loadingEmployee } = useEmployee(employeeId);
  const { updateEmployee, loading: isSubmitting } = useEmployeeMutations();
  const { branches } = useBranches();
  const { organizations } = useOrganizations();

  const [formData, setFormData] = useState<Partial<UpdateEmployeeDto>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        organisation: typeof employee.organisation === 'string' ? employee.organisation : (employee.organisation as any)?._id || (employee.organisation as any)?.id || '',
        branch: typeof employee.branch === 'string' ? employee.branch : (employee.branch as any)?._id || (employee.branch as any)?.id || '',
        firstName: employee.firstName,
        lastName: employee.lastName,
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        alternatePhone: employee.alternatePhone,
        dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
        gender: employee.gender,
        maritalStatus: employee.maritalStatus,
        addressLine1: employee.addressLine1,
        addressLine2: employee.addressLine2,
        city: employee.city,
        state: employee.state,
        postalCode: employee.postalCode,
        country: employee.country || 'India',
        role: employee.role,
        department: employee.department,
        designation: employee.designation,
        dateOfJoining: employee.dateOfJoining ? new Date(employee.dateOfJoining).toISOString().split('T')[0] : '',
        salary: employee.salary,
        employmentType: employee.employmentType || 'full_time',
        reportingManager: employee.reportingManager,
        status: employee.status,
        isAdmin: employee.isAdmin,
        canApproveLoans: employee.canApproveLoans,
        canViewReports: employee.canViewReports,
        canManageUsers: employee.canManageUsers,
        canManageEmployees: employee.canManageEmployees,
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.organisation || formData.organisation === '') newErrors.organisation = 'Organization is required';
    if (!formData.branch || formData.branch === '') newErrors.branch = 'Branch is required';
    if (!formData.firstName || formData.firstName?.trim() === '') newErrors.firstName = 'First name is required';
    if (!formData.lastName || formData.lastName?.trim() === '') newErrors.lastName = 'Last name is required';
    if (!formData.email || formData.email?.trim() === '') newErrors.email = 'Email is required';
    if (!formData.phone || formData.phone?.trim() === '') newErrors.phone = 'Phone is required';
    if (!formData.addressLine1 || formData.addressLine1?.trim() === '') newErrors.addressLine1 = 'Address is required';
    if (!formData.city || formData.city === '') newErrors.city = 'City is required';
    if (!formData.state || formData.state === '') newErrors.state = 'State is required';
    if (!formData.postalCode || formData.postalCode?.trim() === '') newErrors.postalCode = 'Postal code is required';
    if (!formData.designation || formData.designation?.trim() === '') newErrors.designation = 'Designation is required';
    if (!formData.salary || formData.salary <= 0) newErrors.salary = 'Salary must be greater than 0';

    setErrors(newErrors);
    
    // Show specific error messages
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.entries(newErrors)[0];
      const fieldName = firstError[0] === 'organisation' ? 'Organization' : 
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
      const updateData: UpdateEmployeeDto = {
        ...formData,
        salary: Number(formData.salary),
      };

      await updateEmployee(employeeId, updateData);
      addToast({
        type: 'success',
        message: 'Employee updated successfully',
      });
      router.push(`/employees/${employeeId}`);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to update employee',
      });
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Employees', href: '/employees' },
    { label: employee?.fullName || 'Employee', href: `/employees/${employeeId}` },
    { label: 'Edit', href: `/employees/${employeeId}/edit` },
  ];

  if (loadingEmployee) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6 animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <div className="p-12 text-center">
              <p className="text-error-500 mb-4">Employee not found</p>
              <Link href="/employees">
                <Button variant="primary">Back to Employees</Button>
              </Link>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Edit Employee</h1>
            <p className="text-neutral-600 mt-1">Update employee information</p>
          </div>
          <Link href={`/employees/${employeeId}`}>
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
                value={formData.firstName || ''}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name *"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
              <Input
                label="Full Name *"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleChange}
                disabled
              />
              <Input
                label="Email *"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <Input
                label="Phone *"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                error={errors.phone}
                required
              />
              <Input
                label="Alternate Phone"
                name="alternatePhone"
                value={formData.alternatePhone || ''}
                onChange={handleChange}
              />
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ''}
                onChange={handleChange}
              />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender || 'male'}
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
                value={formData.maritalStatus || 'single'}
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
                  value={formData.addressLine1 || ''}
                  onChange={handleChange}
                  error={errors.addressLine1}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Address Line 2"
                  name="addressLine2"
                  value={formData.addressLine2 || ''}
                  onChange={handleChange}
                />
              </div>
              <Select
                label="State *"
                name="state"
                value={formData.state || ''}
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
                value={formData.city || ''}
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
                value={formData.postalCode || ''}
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
                label="Role"
                name="role"
                value={formData.role || 'junior_officer'}
                onChange={handleChange}
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
                ]}
              />
              <Select
                label="Department"
                name="department"
                value={formData.department || 'administration'}
                onChange={handleChange}
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
                ]}
              />
              <Input
                label="Designation *"
                name="designation"
                value={formData.designation || ''}
                onChange={handleChange}
                error={errors.designation}
                required
              />
              <Input
                label="Date of Joining"
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining || ''}
                onChange={handleChange}
              />
              <Input
                label="Salary *"
                type="number"
                name="salary"
                value={formData.salary || ''}
                onChange={handleChange}
                error={errors.salary}
                required
              />
              <Select
                label="Employment Type"
                name="employmentType"
                value={formData.employmentType || 'full_time'}
                onChange={handleChange}
                options={[
                  { value: 'full_time', label: 'Full Time' },
                  { value: 'part_time', label: 'Part Time' },
                  { value: 'contract', label: 'Contract' },
                ]}
              />
              <Select
                label="Status"
                name="status"
                value={formData.status || 'active'}
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

          {/* Permissions */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Permissions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={formData.isAdmin || false}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm text-neutral-700">Admin</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="canApproveLoans"
                  checked={formData.canApproveLoans || false}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm text-neutral-700">Approve Loans</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="canViewReports"
                  checked={formData.canViewReports || false}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm text-neutral-700">View Reports</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="canManageUsers"
                  checked={formData.canManageUsers || false}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm text-neutral-700">Manage Users</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="canManageEmployees"
                  checked={formData.canManageEmployees || false}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm text-neutral-700">Manage Employees</span>
              </label>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href={`/employees/${employeeId}`}>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" type="submit" loading={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              Update Employee
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

