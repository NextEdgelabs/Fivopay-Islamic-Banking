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
import { Search, Plus, Edit, Trash2, Eye, FolderOpen } from 'lucide-react';
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
    if (confirm(`Are you sure you want to delete ${product.productName}?`)) {
      try {
        await deleteProduct(product._id);
        addToast({ type: 'success', message: 'Product deleted successfully' });
        refetch();
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to delete product' });
      }
    }
  };

  const columns = [
    { header: 'Product ID', key: '_id' },
    { header: 'Product Name', key: 'productName' },
    { 
      header: 'Product Type', 
      key: 'productType',
      render: (type: string) => (
        <Badge
          variant={
            type === 'standard' ? 'primary'
            : type === 'premium' ? 'warning'
            : type === 'basic' ? 'success'
            : 'neutral'
          }
        >
          {type}
        </Badge>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (category: any) => {
        // Handle if category is a populated object
        if (typeof category === 'object' && category !== null) {
          return category.categoryName || category.name || 'N/A';
        }
        // Handle if category is just an ID string
        return category || 'N/A';
      },
    },
    {
      header: 'Loan Amount',
      key: 'loanAmount',
      render: (_: any, item: AnyProduct) => (
        <span>
          ₹{(item.minLoanAmount || 0).toLocaleString()} - ₹{(item.maxLoanAmount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Interest Rate',
      key: 'interestRate',
      render: (rate: number) => `${rate || 0}%`,
    },
    {
      header: 'Status',
      key: 'status',
      render: (status: string) => (
        <Badge
          variant={
            status === 'active' ? 'success'
            : status === 'inactive' ? 'warning'
            : status === 'suspended' ? 'error'
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
          <Button variant="ghost" size="sm" onClick={() => router.push(`/products/${item._id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push(`/products/${item._id}/edit`)}>
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
                name="productType"
                placeholder="Filter by Product Type"
                value={filters.productType || ''}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'premium', label: 'Premium' },
                  { value: 'basic', label: 'Basic' },
                  { value: 'custom', label: 'Custom' },
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
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' },
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
