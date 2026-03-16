'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Avatar,
  Breadcrumbs,
  Tabs,
} from '@/components/ui';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  CheckCircle,
  XCircle,
  User,
  FileText,
  CreditCard,
  Trash2,
  Building,
} from 'lucide-react';
import { useEmployee } from '@/hooks/useEmployee';
import { useEmployeeMutations } from '@/hooks/useEmployeeMutations';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui';
import { Employee } from '@/services/employee.service';
import { useOrganizations } from '@/hooks/useOrganizations';

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div>
      <span className="text-sm font-medium text-neutral-600 flex items-center mb-1 gap-2">
        {icon}
        {label}
      </span>
      <p className="text-neutral-800">{value}</p>
    </div>
  );
};

export default function ViewEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id as string;
  const { addToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { employee, loading, error, refetch } = useEmployee(employeeId);
  const { deleteEmployee, loading: isDeleting } = useEmployeeMutations();
  const { organizations } = useOrganizations();

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employee) return;

    try {
      await deleteEmployee(employeeId);
      addToast({
        type: 'success',
        message: `${employee.fullName} has been deleted successfully`,
      });
      router.push('/employees');
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Failed to delete employee',
      });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6 animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !employee) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6">
          <Card>
            <div className="p-12 text-center">
              <XCircle className="h-16 w-16 text-error-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Failed to Load Employee</h2>
              <p className="text-neutral-600 mb-6">{error || 'Employee not found'}</p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => router.push('/employees')}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Employees
                </Button>
                <Button variant="primary" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const TABS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <User className="h-4 w-4" />,
      content: <EmployeeOverviewTab employee={employee} organizations={organizations} />,
    },
    {
      id: 'professional',
      label: 'Professional',
      icon: <Briefcase className="h-4 w-4" />,
      content: <EmployeeProfessionalTab employee={employee} />,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="h-4 w-4" />,
      content: <EmployeeDocumentsTab employee={employee} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Employees', href: '/employees' },
          { label: employee.fullName },
        ]} />
        
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div className="flex items-start gap-4">
              <Avatar size="lg" fallback={employee.fullName} />
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{employee.fullName}</h1>
                <p className="text-neutral-600 mt-1">{employee.employeeId} • {employee.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0 mt-4 md:mt-0">
              <Button variant="outline" onClick={() => router.push(`/employees/${employeeId}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs tabs={TABS} defaultTab="overview" />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          title="Confirm Delete Employee"
          size="sm"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-error-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Delete {employee.fullName}?
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  This action cannot be undone. All employee data will be permanently deleted.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Employee
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

const EmployeeOverviewTab = ({ employee, organizations }: { employee: Employee, organizations: any[] }) => {
  const getOrganizationName = () => {
    if (typeof employee.organisation === 'string') {
      const org = organizations.find(o => (o._id || o.id) === employee.organisation);
      return org?.organisationName || org?.organizationName || org?.name || employee.organisation;
    }
    return (employee.organisation as any)?.organisationName || (employee.organisation as any)?.organizationName || (employee.organisation as any)?.name || 'N/A';
  };

  return (
    <div className="space-y-6 mt-4 p-4 sm:p-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-600">Status</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">
              <Badge variant={employee.status === 'active' ? 'success' : employee.status === 'suspended' ? 'warning' : 'error'}>
                {employee.status?.charAt(0).toUpperCase() + employee.status?.slice(1)}
              </Badge>
            </p>
          </div>
          <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-primary-600" />
          </div>
        </div>
      </Card>
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-600">Role</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{employee.role?.replace('_', ' ')}</p>
          </div>
          <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-success-600" />
          </div>
        </div>
      </Card>
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-600">Department</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{employee.department?.replace('_', ' ')}</p>
          </div>
          <div className="w-12 h-12 bg-warning-100 rounded-stripe flex items-center justify-center">
            <Building className="h-6 w-6 text-warning-600" />
          </div>
        </div>
      </Card>
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-600">Admin Access</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">
              {employee.isAdmin ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="w-12 h-12 bg-error-100 rounded-stripe flex items-center justify-center">
            <Shield className="h-6 w-6 text-error-600" />
          </div>
        </div>
      </Card>
    </div>

    {/* Organization & Branch */}
    <Card>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Organization & Branch</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={<Building className="h-4 w-4" />} label="Organization" value={getOrganizationName()} />
        <InfoItem icon={<Building className="h-4 w-4" />} label="Branch" value={typeof employee.branch === 'string' ? employee.branch : (employee.branch as any)?.branchName || 'N/A'} />
      </div>
    </Card>

    {/* Personal Information */}
    <Card>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={employee.email} />
        <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={employee.phone} />
        <InfoItem icon={<Phone className="h-4 w-4" />} label="Alternate Phone" value={employee.alternatePhone} />
        <InfoItem icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : ''} />
        <InfoItem icon={<User className="h-4 w-4" />} label="Gender" value={employee.gender} />
        <InfoItem icon={<User className="h-4 w-4" />} label="Marital Status" value={employee.maritalStatus} />
      </div>
    </Card>

    {/* Address Information */}
    <Card>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Address Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={<MapPin className="h-4 w-4" />} label="Address Line 1" value={employee.addressLine1} />
        <InfoItem icon={<MapPin className="h-4 w-4" />} label="Address Line 2" value={employee.addressLine2} />
        <InfoItem icon={<MapPin className="h-4 w-4" />} label="City" value={employee.city} />
        <InfoItem icon={<MapPin className="h-4 w-4" />} label="State" value={employee.state} />
        <InfoItem icon={<MapPin className="h-4 w-4" />} label="Postal Code" value={employee.postalCode} />
        <InfoItem icon={<MapPin className="h-4 w-4" />} label="Country" value={employee.country} />
      </div>
    </Card>

    {/* Emergency Contact */}
    {(employee.emergencyContactName || employee.emergencyContactPhone) && (
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<User className="h-4 w-4" />} label="Name" value={employee.emergencyContactName} />
          <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={employee.emergencyContactPhone} />
          <InfoItem icon={<User className="h-4 w-4" />} label="Relation" value={employee.emergencyContactRelation} />
        </div>
      </Card>
    )}
  </div>
  );
};

const EmployeeProfessionalTab = ({ employee }: { employee: Employee }) => (
  <div className="space-y-6 mt-4 p-4 sm:p-6">
    <Card>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Professional Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Designation" value={employee.designation} />
        <InfoItem icon={<Building className="h-4 w-4" />} label="Department" value={employee.department?.replace('_', ' ')} />
        <InfoItem icon={<User className="h-4 w-4" />} label="Role" value={employee.role?.replace('_', ' ')} />
        <InfoItem icon={<Calendar className="h-4 w-4" />} label="Date of Joining" value={employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : ''} />
        <InfoItem icon={<Calendar className="h-4 w-4" />} label="Date of Leaving" value={employee.dateOfLeaving ? new Date(employee.dateOfLeaving).toLocaleDateString() : ''} />
        <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Employment Type" value={employee.employmentType ? employee.employmentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'} />
        <InfoItem icon={<User className="h-4 w-4" />} label="Reporting Manager" value={employee.reportingManager} />
        <InfoItem icon={<CreditCard className="h-4 w-4" />} label="Salary" value={employee.salary ? `₹${employee.salary.toLocaleString('en-IN')}` : ''} />
      </div>
    </Card>

    {/* Access & Permissions */}
    <Card>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Access & Permissions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className={`h-5 w-5 ${employee.isAdmin ? 'text-success-600' : 'text-neutral-400'}`} />
          <span className="text-sm text-neutral-700">Admin Access</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className={`h-5 w-5 ${employee.canApproveLoans ? 'text-success-600' : 'text-neutral-400'}`} />
          <span className="text-sm text-neutral-700">Can Approve Loans</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className={`h-5 w-5 ${employee.canViewReports ? 'text-success-600' : 'text-neutral-400'}`} />
          <span className="text-sm text-neutral-700">Can View Reports</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className={`h-5 w-5 ${employee.canManageUsers ? 'text-success-600' : 'text-neutral-400'}`} />
          <span className="text-sm text-neutral-700">Can Manage Users</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className={`h-5 w-5 ${employee.canManageEmployees ? 'text-success-600' : 'text-neutral-400'}`} />
          <span className="text-sm text-neutral-700">Can Manage Employees</span>
        </div>
      </div>
      {employee.accessList && employee.accessList.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-neutral-600 mb-2">Access List:</p>
          <div className="flex flex-wrap gap-2">
            {employee.accessList.map((access, index) => (
              <Badge key={index} variant="neutral">
                {access}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>

    {/* Additional Information */}
    {(employee.qualifications || employee.previousExperience || employee.skills) && (
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Additional Information</h3>
        <div className="space-y-4">
          <InfoItem icon={<FileText className="h-4 w-4" />} label="Qualifications" value={employee.qualifications} />
          <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Previous Experience" value={employee.previousExperience} />
          {employee.skills && employee.skills.length > 0 && (
            <div>
              <span className="text-sm font-medium text-neutral-600 flex items-center mb-2 gap-2">
                <FileText className="h-4 w-4" />
                Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, index) => (
                  <Badge key={index} variant="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    )}
  </div>
);

const EmployeeDocumentsTab = ({ employee }: { employee: Employee }) => (
  <div className="space-y-6 mt-4 p-4 sm:p-6">
    <Card>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Identity Documents</h3>
      <div className="space-y-4">
        <InfoItem icon={<Shield className="h-4 w-4" />} label="Aadhaar Number" value={employee.aadhaarNumber} />
        <InfoItem icon={<FileText className="h-4 w-4" />} label="PAN Number" value={employee.panNumber} />
        <InfoItem icon={<FileText className="h-4 w-4" />} label="Passport Number" value={employee.passportNumber} />
        <InfoItem icon={<FileText className="h-4 w-4" />} label="Driving License Number" value={employee.drivingLicenseNumber} />
      </div>
    </Card>

    {/* Bank Details */}
    {(employee.bankAccountNumber || employee.bankName || employee.ifscCode) && (
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<CreditCard className="h-4 w-4" />} label="Account Number" value={employee.bankAccountNumber} />
          <InfoItem icon={<Building className="h-4 w-4" />} label="Bank Name" value={employee.bankName} />
          <InfoItem icon={<Building className="h-4 w-4" />} label="Branch" value={employee.bankBranch} />
          <InfoItem icon={<CreditCard className="h-4 w-4" />} label="IFSC Code" value={employee.ifscCode} />
        </div>
      </Card>
    )}

    {/* System Information */}
    <Card>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">System Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={<Calendar className="h-4 w-4" />} label="Last Login" value={employee.lastLogin ? new Date(employee.lastLogin).toLocaleString() : ''} />
        <InfoItem icon={<Calendar className="h-4 w-4" />} label="Last Password Change" value={employee.lastPasswordChange ? new Date(employee.lastPasswordChange).toLocaleDateString() : ''} />
        <InfoItem icon={<User className="h-4 w-4" />} label="Login Attempts" value={employee.loginAttempts?.toString()} />
        <InfoItem icon={<CheckCircle className="h-4 w-4" />} label="Password Reset Required" value={employee.passwordResetRequired ? 'Yes' : 'No'} />
      </div>
    </Card>
  </div>
);

