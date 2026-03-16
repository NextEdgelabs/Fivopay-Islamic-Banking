'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Table,
  Badge,
  Button,
  Input,
  Select,
  IconButton,
  Breadcrumbs,
  Pagination,
  Avatar,
  Modal,
} from '@/components/ui';
import {
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Users,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useEmployees } from '@/hooks/useEmployees';
import { useEmployeeMutations } from '@/hooks/useEmployeeMutations';
import { Employee } from '@/services/employee.service';
import { useBranches } from '@/hooks/useBranches';
import { useOrganizations } from '@/hooks/useOrganizations';
import { INDIAN_STATES, CITIES_BY_STATE } from '@/lib/indiaData';

export default function EmployeesPage() {
  const router = useRouter();
  const { employees, loading, error, refetch, filters, setFilters } = useEmployees();
  const { branches } = useBranches();
  const { organizations } = useOrganizations();
  const { addToast } = useToast();
  const { deleteEmployee } = useEmployeeMutations();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [searchInputValue, setSearchInputValue] = useState(filters.search || '');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    setSearchInputValue(filters.search || '');
  }, [filters.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value }));
      searchDebounceRef.current = null;
    }, 300);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setFilters(prev => ({ ...prev, state, city: '' }));
  };

  // Pagination
  const totalPages = Math.ceil((employees?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = employees?.slice(startIndex, startIndex + itemsPerPage) || [];

  const columns = [
    {
      key: 'fullName',
      header: 'Employee',
      sortable: true,
      render: (_: any, row: Employee) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback={row.fullName} />
          <div>
            <p className="font-medium text-neutral-900">{row.fullName}</p>
            <p className="text-sm text-neutral-500">{row.employeeId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (_: any, row: Employee) => (
        <div className="min-w-0 max-w-[220px]">
          <p className="text-sm text-neutral-900 flex items-center gap-1 min-w-0 truncate" title={row.email}>
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{row.email}</span>
          </p>
          <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1 min-w-0 truncate" title={row.phone}>
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{row.phone}</span>
          </p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (value: string) => (
        <Badge variant="primary">
          {value?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: (value: string) => (
        <Badge variant="neutral">
          {value?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-neutral-900">{value}</span>
      ),
    },
    {
      key: 'employmentType',
      header: 'Employment Type',
      sortable: true,
      render: (value: string) => (
        <Badge variant="neutral">
          {value ? value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : value === 'suspended' ? 'warning' : 'error'}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Employee) => (
        <div className="flex flex-nowrap items-center gap-1">
          <IconButton
            icon={<Eye className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); router.push(`/employees/${row._id || row.id}`); }}
            ariaLabel="View employee"
          />
          <IconButton
            icon={<Edit className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); router.push(`/employees/${row._id || row.id}/edit`); }}
            ariaLabel="Edit employee"
          />
          <IconButton
            icon={<Trash2 className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
            ariaLabel="Delete employee"
          />
        </div>
      ),
    },
  ];

  const handleDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      await deleteEmployee(employeeToDelete._id || employeeToDelete.id || '');
      addToast({
        type: 'success',
        message: `${employeeToDelete.fullName} has been deleted successfully`,
      });
      refetch();
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Failed to delete employee',
      });
    } finally {
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleExport = () => {
    if (!employees || employees.length === 0) {
      addToast({
        type: 'warning',
        message: 'No employee data to export.',
      });
      return;
    }

    const headers = [
      'Employee ID',
      'Full Name',
      'Email',
      'Phone',
      'Role',
      'Department',
      'Designation',
      'Employment Type',
      'Status',
      'Branch',
      'Organisation',
    ];

    const escapeCsv = (value: any) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = employees.map((e) => {
      const branchLabel =
        typeof e.branch === 'string'
          ? e.branch
          : e.branch?.branchName ?? e.branch?._id ?? '';
      const organisationLabel =
        typeof e.organisation === 'string'
          ? e.organisation
          : e.organisation?.organisationName ?? e.organisation?._id ?? '';

      return [
        e.employeeId,
        e.fullName,
        e.email,
        e.phone,
        e.role,
        e.department,
        e.designation,
        e.employmentType || '',
        e.status,
        branchLabel,
        organisationLabel,
      ].map(escapeCsv);
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employees_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      message: `Exported ${employees.length} employees to CSV.`,
    });
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Employees', href: '/employees' },
  ];

  // Full-page loading only on initial load so search input stays mounted during refetch
  const isInitialLoad = loading && !(employees?.length);
  if (isInitialLoad) {
    return (
      <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
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

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6">
          <Card>
            <div className="p-12 text-center">
              <p className="text-error-500 mb-4">Error: {error}</p>
              <Button variant="primary" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Employees</h1>
              <p className="text-neutral-600 mt-2">Manage all employee accounts</p>
            </div>
            <Link href="/employees/add">
              <Button variant="primary" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add Employee
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card padding="sm">
            <div className="flex items-center justify-between gap-4 min-h-[72px]">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-neutral-600">Total Employees</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {employees?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between gap-4 min-h-[72px]">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-neutral-600">Active Employees</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {employees?.filter((e) => e.status === 'active').length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <p className="text-xs text-success-600 mt-2">
              {employees?.length > 0 ? ((employees?.filter((e) => e.status === 'active').length / employees?.length) * 100).toFixed(0) : 0}% active rate
            </p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between gap-4 min-h-[72px]">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-neutral-600">Managers</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {employees?.filter((e) => e.role === 'manager' || e.role === 'branch_manager').length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-stripe flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between gap-4 min-h-[72px]">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-neutral-600">Departments</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {new Set(employees?.map(e => e.department)).size || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-info-100 rounded-stripe flex items-center justify-center">
                <Building className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <div className="p-4 flex flex-col md:flex-row md:flex-wrap md:items-center gap-4">
            <div className="w-full md:flex-1 md:min-w-[200px] md:max-w-sm">
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchInputValue}
                onChange={handleSearchChange}
                leftIcon={<Search className="h-4 w-4" />}
                className="min-h-[40px]"
              />
            </div>
            <div className="w-full sm:w-[180px] md:w-[200px]">
              <Select
                name="organisation"
                value={filters.organisation || ''}
                onChange={handleFilterChange}
                className="min-h-[40px] py-2.5 leading-normal"
                options={[
                  { value: '', label: 'All Organizations' },
                  ...organizations.map(org => ({ value: org._id || org.id || '', label: org.organisationName || org.organizationName || org.name || 'Unknown' }))
                ]}
              />
            </div>
            <div className="w-full sm:w-[180px] md:w-[200px]">
              <Select
                name="branch"
                value={filters.branch || ''}
                onChange={handleFilterChange}
                className="min-h-[40px] py-2.5 leading-normal"
                options={[
                  { value: '', label: 'All Branches' },
                  ...branches.map((b) => ({
                    value: b._id ?? b.id ?? '',
                    label: b.branchName ?? b.branchCode ?? 'Unknown',
                  })),
                ]}
              />
            </div>
            <div className="w-full sm:w-[180px] md:w-[200px]">
              <Select
                name="department"
                value={filters.department || ''}
                onChange={handleFilterChange}
                className="min-h-[40px] py-2.5 leading-normal"
                options={[
                  { value: '', label: 'All Departments' },
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
            </div>
            <div className="w-full sm:w-[160px] md:w-[180px]">
              <Select
                name="status"
                value={filters.status || ''}
                onChange={handleFilterChange}
                className="min-h-[40px] py-2.5 leading-normal"
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'terminated', label: 'Terminated' },
                ]}
              />
            </div>
            <div className="w-full md:w-auto flex-shrink-0">
              <Button variant="outline" onClick={handleExport} className="w-full md:w-auto min-h-[40px]">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Employee Table */}
        <Card>
          {employees?.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500 mb-4">No employees found</p>
              <p className="text-sm text-neutral-400">Check filters or add a new employee</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                data={paginatedEmployees}
                columns={columns}
              />
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-neutral-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, employees?.length || 0)} of{' '}
                {employees?.length || 0} employees
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>
      </div>

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
                Delete {employeeToDelete?.fullName}?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                This action cannot be undone. All employee data and related records will be permanently deleted.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={cancelDelete}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Employee
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

