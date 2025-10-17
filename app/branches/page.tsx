'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Table, Input, Select, Pagination, Badge, Skeleton, Breadcrumbs } from '@/components/ui';
import { Search, Plus, Edit, Trash2, View } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { useBranchMutations } from '@/hooks/useBranchMutations';
import { useToast } from '@/components/ui/Toast';
import { INDIAN_STATES } from '@/lib/indiaData';
import { Branch } from '@/services/branches';

export default function BranchesPage() {
  const router = useRouter();
  const { branches, loading, error, refetch, setFilters } = useBranches();
  const { deleteBranch, loading: isDeleting } = useBranchMutations();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, setFilters]);

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
    { header: 'Customers', key: 'totalCustomers' },
    {
      header: 'Actions',
      key: 'actions',
      render: (_: any, item: Branch) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/branches/${item.id}`)}><View className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => router.push(`/branches/${item.id}/edit`)}><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id, item.branchName)} disabled={isDeleting}><Trash2 className="h-4 w-4" /></Button>
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
          <h1 className="text-3xl font-bold">Branches</h1>
          <Button onClick={() => router.push('/branches/add')}><Plus className="mr-2 h-4 w-4" /> Add Branch</Button>
        </div>
        <Card>
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <Input className="w-full md:w-1/3" placeholder="Search by name, code..." value={searchTerm} onChange={handleSearch} leftIcon={<Search className="h-4 w-4" />} />
            <Select 
              className="w-full md:w-auto"
              placeholder="Filter by State" 
              options={[{label: 'All States', value: ''}, ...INDIAN_STATES.map(s => ({ label: s, value: s }))]} 
              onChange={e => setFilters(prev => ({ ...prev, state: e.target.value }))} 
            />
            <Select
              className="w-full md:w-auto"
              placeholder="Filter by Type"
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
              placeholder="Filter by Status"
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Under Maintenance', value: 'Under Maintenance' },
              ]}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value as Branch['status'] }))}
            />
          </div>
          <Table data={paginatedBranches} columns={columns} />
          {branches.length > itemsPerPage && (
            <div className="p-4 border-t">
              <Pagination currentPage={currentPage} totalPages={Math.ceil(branches.length / itemsPerPage)} onPageChange={setCurrentPage} />
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

