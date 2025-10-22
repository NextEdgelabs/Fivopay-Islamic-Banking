'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Table, Input, Select, Pagination, Badge, Skeleton, Breadcrumbs } from '@/components/ui';
import { Search, Plus, Edit, Trash2, Download, Users, Building, AlertCircle, Eye } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { useBranchMutations } from '@/hooks/useBranchMutations';
import { useToast } from '@/components/ui/Toast';
import { INDIAN_STATES } from '@/lib/indiaData';
import { Branch } from '@/services/branches';

export default function BranchesPage() {
  const router = useRouter();
  const { branches, loading, error, refetch, filters, setFilters } = useBranches();
  const { deleteBranch, loading: isDeleting } = useBranchMutations();
  const { addToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const paginatedBranches = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return branches.slice(startIndex, startIndex + itemsPerPage);
  }, [branches, currentPage]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteBranch(id);
        addToast({ type: 'success', message: 'Branch deleted successfully' });
        refetch();
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to delete branch' });
      }
    }
  };

  const getStatusBadge = (status: 'Active' | 'Inactive' | 'Under Maintenance') => {
    switch (status) {
      case 'Active': return <Badge variant="success">{status}</Badge>;
      case 'Inactive': return <Badge variant="neutral">{status}</Badge>;
      case 'Under Maintenance': return <Badge variant="warning">{status}</Badge>;
    }
  };

  const columns = [
    { header: 'Branch Code', key: 'branchCode' },
    { header: 'Branch Name', key: 'branchName' },
    { header: 'Branch Type', key: 'branchType' },
    { header: 'City', key: 'city' },
    { header: 'State', key: 'state' },
    { header: 'Status', key: 'status', render: (status: Branch['status']) => getStatusBadge(status) },
    { header: 'Customers', key: 'totalCustomers', render: (value: number) => <div className="text-center">{value}</div> },
    {
      header: 'Actions',
      key: 'actions',
      render: (_: any, item: Branch) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/branches/${item.id}`)}}><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/branches/${item.id}/edit`)}}><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.branchName)}} disabled={isDeleting}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  if (loading) return <DashboardLayout><div className="p-6"><Skeleton className="h-96 w-full" /></div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="p-6 text-error-500">{error}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Branches' }]} />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Branches</h1>
            <p className="text-neutral-600 mt-1">Manage all bank branches</p>
          </div>
          <Button onClick={() => router.push('/branches/add')}><Plus className="mr-2 h-4 w-4" /> Add Branch</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Branches</p>
                <p className="text-2xl font-bold">{branches.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center"><Building className="h-6 w-6 text-primary-600" /></div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Customers</p>
                <p className="text-2xl font-bold">{branches.reduce((acc, b) => acc + b.totalCustomers, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center"><Users className="h-6 w-6 text-success-600" /></div>
            </div>
          </Card>
           <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Under Maintenance</p>
                <p className="text-2xl font-bold">{branches.filter(b => b.status === 'Under Maintenance').length}</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-stripe flex items-center justify-center"><AlertCircle className="h-6 w-6 text-warning-600" /></div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <Input className="w-full md:w-1/3" placeholder="Search by name, code..." value={filters.search || ''} onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))} leftIcon={<Search className="h-4 w-4" />} />
            <Select 
              className="w-full md:w-auto"
              name="state"
              value={filters.state || ''}
              options={[{label: 'All States', value: ''}, ...INDIAN_STATES.map(s => ({ label: s, value: s }))]} 
              onChange={e => setFilters(prev => ({ ...prev, state: e.target.value }))} 
            />
            <Select
              className="w-full md:w-auto"
              name="branchType"
              value={filters.branchType || ''}
              options={[
                { label: 'All Types', value: '' },
                { label: 'Main Branch', value: 'Main Branch' },
                { label: 'Sub Branch', value: 'Sub Branch' },
                { label: 'Extension Counter', value: 'Extension Counter' },
              ]}
              onChange={e => setFilters(prev => ({ ...prev, branchType: e.target.value as Branch['branchType'] }))}
            />
            <Select
              className="w-full md:w-auto"
              name="status"
              value={filters.status || ''}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Under Maintenance', value: 'Under Maintenance' },
              ]}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value as Branch['status'] }))}
            />
             <Button variant="outline" onClick={() => { /* Implement Export */ }}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <Table data={paginatedBranches} columns={columns} onRowClick={(row) => router.push(`/branches/${row.id}`)} />
          {branches.length > itemsPerPage && (
            <div className="p-4 border-t flex items-center justify-between">
               <p className="text-sm text-neutral-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, branches.length)} of {branches.length} branches
              </p>
              <Pagination currentPage={currentPage} totalPages={Math.ceil(branches.length / itemsPerPage)} onPageChange={setCurrentPage} />
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

