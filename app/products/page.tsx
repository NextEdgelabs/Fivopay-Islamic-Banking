'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Table,
  Input,
  Select,
  Pagination,
  Badge,
  Skeleton,
  Breadcrumbs,
} from '@/components/ui';
import { Search, Plus, Edit, Trash2, Eye, UploadCloud, FolderOpen } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useProducts } from '@/hooks/useProducts';
import { useProductMutations } from '@/hooks/useProductMutations';
import { AnyProduct } from '@/services/products';

export default function ProductsPage() {
  const router = useRouter();
  const { products, loading, error, refetch, filters, setFilters } = useProducts();
  const { deleteProduct, updateProduct, loading: isDeleting } = useProductMutations();
  const { addToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (product: AnyProduct) => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await deleteProduct(product.id);
        addToast({ type: 'success', message: 'Product deleted successfully' });
        refetch();
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to delete product' });
      }
    }
  };
  
  const handleSubmitForApproval = async (product: AnyProduct) => {
    try {
      await updateProduct(product.id, { ...product, status: 'Pending Approval' });
      addToast({ type: 'success', message: 'Product submitted for approval' });
      refetch();
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to submit for approval' });
    }
  };

  const columns = [
    { header: 'Product ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Type', key: 'type' },
    { header: 'Sub-Type', key: 'subType' },
    {
      header: 'Status',
      key: 'status',
      render: (status: string) => (
        <Badge
          variant={
            status === 'Active' ? 'success'
            : status === 'Draft' ? 'warning'
            : status === 'Pending Approval' ? 'primary'
            : status === 'Retired' ? 'error'
            : 'neutral'
          }
        >
          {status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_: any, item: AnyProduct) => (
        <div className="flex gap-2">
          {item.status === 'Draft' && (
            <Button variant="outline" size="sm" onClick={() => handleSubmitForApproval(item)}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Submit for Approval
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => router.push(`/products/${item.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push(`/products/${item.id}/edit`)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(item)} disabled={isDeleting}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-6">
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  if (error)
    return (
      <DashboardLayout>
        <div className="p-6 text-error-500">Error: {error}</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Products' }]} />
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Products</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/products/categories')}>
              <FolderOpen className="mr-2 h-4 w-4" /> Loan Categories
            </Button>
            <Button onClick={() => router.push('/products/add')}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>

        <Card>
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Input
                name="search"
                placeholder="Search by name or ID..."
                value={filters.search || ''}
                onChange={handleFilterChange}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                name="type"
                placeholder="Filter by Type"
                value={filters.type || ''}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'Term Deposit', label: 'Term Deposit' },
                  { value: 'Loan', label: 'Loan' },
                ]}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                name="status"
                placeholder="Filter by Status"
                value={filters.status || ''}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Pending Approval', label: 'Pending Approval' },
                  { value: 'Retired', label: 'Retired' },
                ]}
              />
            </div>
          </div>
          <Table data={paginatedProducts} columns={columns} />
          {products.length > itemsPerPage && (
            <div className="p-4 border-t">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(products.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
