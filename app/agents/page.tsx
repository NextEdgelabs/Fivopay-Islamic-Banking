'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Tabs,
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
  Package,
  UserCheck,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useBatches } from '@/hooks/useBatches';
import { useEmployees } from '@/hooks/useEmployees';
import { Batch, BatchStatus } from '@/services/batch.service';
import { Employee } from '@/services/employee.service';
import { useBatchMutations } from '@/hooks/useBatchMutations';

export default function AgentsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('batches');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });
  const [searchInputValue, setSearchInputValue] = useState(filters.search || '');
  const [agentsSearchInput, setAgentsSearchInput] = useState('');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemsPerPage = 10;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value }));
      setCurrentPage(1);
      searchDebounceRef.current = null;
    }, 1000);
  };

  // Fetch batches
  const { batches, loading: batchesLoading, error: batchesError, refetch: refetchBatches } = useBatches({
    search: filters.search,
    status: filters.status as any,
  });

  // Fetch all employees
  const { employees: allEmployees, loading: employeesLoading } = useEmployees();

  // Filter employees by agent type (role or designation contains "agent")
  const agentEmployeesBase = useMemo(() => {
    return (allEmployees || []).filter(emp =>
      emp.role?.toLowerCase().includes('agent') ||
      emp.designation?.toLowerCase().includes('agent') ||
      emp.department?.toLowerCase().includes('agent')
    );
  }, [allEmployees]);

  // Client-side search for agents/adhoc lists
  const agentEmployees = useMemo(() => {
    if (!agentsSearchInput.trim()) return agentEmployeesBase;
    const q = agentsSearchInput.trim().toLowerCase();
    return agentEmployeesBase.filter(
      (emp) =>
        emp.fullName?.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q) ||
        emp.employeeId?.toLowerCase().includes(q) ||
        emp.phone?.toLowerCase().includes(q)
    );
  }, [agentEmployeesBase, agentsSearchInput]);

  // Filter employees by adhoc type (role or designation contains "adhoc")
  const adhocEmployeesBase = useMemo(() => {
    return (allEmployees || []).filter(emp =>
      emp.role?.toLowerCase().includes('adhoc') ||
      emp.designation?.toLowerCase().includes('adhoc') ||
      emp.department?.toLowerCase().includes('adhoc')
    );
  }, [allEmployees]);

  const adhocEmployees = useMemo(() => {
    if (!agentsSearchInput.trim()) return adhocEmployeesBase;
    const q = agentsSearchInput.trim().toLowerCase();
    return adhocEmployeesBase.filter(
      (emp) =>
        emp.fullName?.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q) ||
        emp.employeeId?.toLowerCase().includes(q) ||
        emp.phone?.toLowerCase().includes(q)
    );
  }, [adhocEmployeesBase, agentsSearchInput]);

  const { deleteBatch } = useBatchMutations();

  // Pagination
  const getPaginatedData = (data: any[]) => {
    const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data?.slice(startIndex, startIndex + itemsPerPage) || [];
    return { paginatedData, totalPages, startIndex };
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset pagination when switching tabs
  };

  const handleDelete = async (batch: Batch) => {
    if (window.confirm(`Are you sure you want to delete batch "${batch.batchName}"?`)) {
      try {
        await deleteBatch(batch._id || batch.id || '');
        addToast({
          type: 'success',
          message: 'Batch deleted successfully',
        });
        refetchBatches();
      } catch (err: any) {
        addToast({
          type: 'error',
          message: err.message || 'Failed to delete batch',
        });
      }
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Agents', href: '/agents' },
  ];

  // Batches Tab Columns
  const batchColumns = [
    {
      key: 'batchName',
      header: 'Batch Name',
      sortable: true,
      render: (_: any, row: Batch) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-stripe flex items-center justify-center">
            <Package className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-neutral-900">{row.batchName}</p>
            <p className="text-sm text-neutral-500">{row.batchCode || row._id || row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'employee',
      header: 'Agent',
      render: (_: any, row: Batch) => {
        const employee = typeof row.employeeId === 'object' ? row.employeeId : 
                         row.employee ? row.employee : null;
        if (employee) {
          const emp = typeof employee === 'string' ? null : employee;
          return emp ? (
            <div className="flex items-center gap-2">
              <Avatar size="sm" fallback={emp.fullName} />
              <div>
                <p className="text-sm font-medium text-neutral-900">{emp.fullName}</p>
                <p className="text-xs text-neutral-500">{emp.employeeId}</p>
              </div>
            </div>
          ) : (
            <span className="text-sm text-neutral-400">No agent assigned</span>
          );
        }
        return <span className="text-sm text-neutral-400">No agent assigned</span>;
      },
    },
    {
      key: 'customers',
      header: 'Customers',
      render: (_: any, row: Batch) => {
        const customersCount = Array.isArray(row.customers) 
          ? row.customers.length 
          : (typeof row.customers === 'object' && row.customers !== null ? 1 : 0);
        const totalCustomers = row.totalCustomers || customersCount;
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-900">{totalCustomers}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value: string) => {
        const status = value as BatchStatus;
        return (
          <Badge
            variant={
              status === BatchStatus.Active ? 'success' :
              status === BatchStatus.Completed ? 'primary' :
              status === BatchStatus.Closed ? 'error' : 'neutral'
            }
          >
            {status || 'N/A'}
          </Badge>
        );
      },
    },
    {
      key: 'assignmentDate',
      header: 'Assignment Date',
      sortable: true,
      render: (value: string | Date) => (
        value ? new Date(value).toLocaleDateString() : 'N/A'
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Batch) => (
        <div className="flex items-center gap-2">
          <IconButton
            icon={<Eye className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/agents/batches/${row._id || row.id}`)}
            ariaLabel="View batch"
          />
          <IconButton
            icon={<Edit className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/agents/batches/${row._id || row.id}/edit`)}
            ariaLabel="Edit batch"
          />
          <IconButton
            icon={<Trash2 className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
            ariaLabel="Delete batch"
          />
        </div>
      ),
    },
  ];

  // Agents Tab Columns
  const agentColumns = [
    {
      key: 'fullName',
      header: 'Agent',
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
        <div>
          <p className="text-sm text-neutral-900 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {row.email}
          </p>
          <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
            <Phone className="h-3 w-3" />
            {row.phone}
          </p>
        </div>
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
        <div className="flex items-center gap-2">
          <IconButton
            icon={<Eye className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/agents/${row._id || row.id}`)}
            ariaLabel="View agent"
          />
        </div>
      ),
    },
  ];

  // Batches Tab Content (table only; search/filters rendered above Tabs)
  const BatchesTab = () => {
    const { paginatedData, totalPages, startIndex } = getPaginatedData(batches || []);

    return (
      <div className="space-y-6">
        <Card>
          {batchesError ? (
            <div className="p-12 text-center">
              <p className="text-error-500 mb-4">Error: {batchesError}</p>
              <Button variant="primary" onClick={() => refetchBatches()}>
                Try Again
              </Button>
            </div>
          ) : (batchesLoading && !(batches?.length)) ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500">Loading batches...</p>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500 mb-4">No batches found</p>
              <p className="text-sm text-neutral-400">Create a new batch to get started</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table data={paginatedData} columns={batchColumns} />
              </div>
              {totalPages > 1 && (
                <div className="p-4 border-t mt-6 flex items-center justify-between">
                  <p className="text-sm text-neutral-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, batches?.length || 0)} of{' '}
                    {batches?.length || 0} batches
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    );
  };

  // Agents Tab Content (stats + table only; search rendered above Tabs)
  const AgentsTab = () => {
    const { paginatedData, totalPages, startIndex } = getPaginatedData(agentEmployees);

    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Agents</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {agentEmployees.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Agents</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {agentEmployees.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Departments</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {new Set(agentEmployees.map(e => e.department)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-info-100 rounded-stripe flex items-center justify-center">
                <Users className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Agents Table */}
        <Card>
          {employeesLoading ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500">Loading agents...</p>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500 mb-4">No agents found</p>
              <p className="text-sm text-neutral-400">No employees with agent type found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table data={paginatedData} columns={agentColumns} />
              </div>
              {totalPages > 1 && (
                <div className="p-4 border-t mt-6 flex items-center justify-between">
                  <p className="text-sm text-neutral-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, agentEmployees.length)} of{' '}
                    {agentEmployees.length} agents
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    );
  };

  // Adhoc Tab Content (stats + table only; search rendered above Tabs)
  const AdhocTab = () => {
    const { paginatedData, totalPages, startIndex } = getPaginatedData(adhocEmployees);

    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Adhoc</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {adhocEmployees.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-stripe flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Adhoc</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {adhocEmployees.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Departments</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {new Set(adhocEmployees.map(e => e.department)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-info-100 rounded-stripe flex items-center justify-center">
                <Users className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Adhoc Table */}
        <Card>
          {employeesLoading ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500">Loading adhoc employees...</p>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500 mb-4">No adhoc employees found</p>
              <p className="text-sm text-neutral-400">No employees with adhoc type found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table data={paginatedData} columns={agentColumns} />
              </div>
              {totalPages > 1 && (
                <div className="p-4 border-t mt-6 flex items-center justify-between">
                  <p className="text-sm text-neutral-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, adhocEmployees.length)} of{' '}
                    {adhocEmployees.length} adhoc employees
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    );
  };

  const TABS = [
    {
      id: 'batches',
      label: 'Batches',
      content: <BatchesTab />,
    },
    {
      id: 'agents',
      label: 'Agents',
      content: <AgentsTab />,
    },
    {
      id: 'adhoc',
      label: 'Adhoc',
      content: <AdhocTab />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Agents</h1>
            <p className="text-neutral-600 mt-1">Manage batches, agents, and adhoc employees</p>
          </div>
          {activeTab === 'batches' && (
            <Button variant="primary" size="lg" onClick={() => router.push('/agents/batches/add')}>
              <Plus className="h-5 w-5 mr-2" />
              Create Batch
            </Button>
          )}
        </div>

        {/* Search bars rendered here so they are not inside tab content and keep focus */}
        {activeTab === 'batches' && (
          <Card>
            <div className="p-4 flex flex-col md:flex-row md:flex-wrap gap-4">
              <div className="w-full md:w-1/3">
                <Input
                  placeholder="Search by batch name or code..."
                  value={searchInputValue}
                  onChange={handleSearchChange}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  name="status"
                  value={filters.status || ''}
                  onChange={handleFilterChange}
                  options={[
                    { value: '', label: 'All Status' },
                    { value: BatchStatus.Active, label: 'Active' },
                    { value: BatchStatus.Inactive, label: 'Inactive' },
                    { value: BatchStatus.Completed, label: 'Completed' },
                    { value: BatchStatus.Closed, label: 'Closed' },
                  ]}
                />
              </div>
              <Button variant="outline" onClick={() => addToast({ type: 'success', message: 'Exporting batch data...' })}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </Card>
        )}
        {(activeTab === 'agents' || activeTab === 'adhoc') && (
          <Card>
            <div className="p-4">
              <Input
                placeholder="Search by name, email, or ID..."
                value={agentsSearchInput}
                onChange={(e) => setAgentsSearchInput(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
          </Card>
        )}

        <Card>
          <Tabs
            tabs={TABS}
            defaultTab={activeTab}
            onChange={handleTabChange}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}

