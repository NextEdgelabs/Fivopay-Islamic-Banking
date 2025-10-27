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
  Modal,
} from '@/components/ui';
import { Search, Plus, Edit, Trash2, Eye, UploadCloud, FolderOpen } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useProducts } from '@/hooks/useProducts';
import { useProductMutations } from '@/hooks/useProductMutations';
import { LoanProductData, ProductType, ProductStatus } from '@/services/products.service';

export default function ProductsPage() {
  const router = useRouter();
  const { products, loading, error, refetch, filters, setFilters, pagination, setPage } = useProducts();
  const { deleteProduct, updateProduct, loading: isDeleting } = useProductMutations();
  const { addToast } = useToast();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<LoanProductData | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = (product: LoanProductData) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete._id!);
      addToast({ type: 'success', message: 'Product deleted successfully' });
      refetch();
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to delete product' });
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };
  
  const handleSubmitForApproval = async (product: LoanProductData) => {
    try {
      await updateProduct({ 
        _id: product._id!, 
        ...product, 
        status: ProductStatus.PENDING_APPROVAL 
      });
      addToast({ type: 'success', message: 'Product submitted for approval' });
      refetch();
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to submit for approval' });
    }
  };

  const columns = [
    { header: 'Product ID', key: '_id' },
    { header: 'Name', key: 'name' },
    { header: 'Type', key: 'type' },
    { 
      header: 'Sub-Type', 
      key: 'subType',
      render: (subType: string, item: LoanProductData) => {
        if (item.type === ProductType.TERM_DEPOSIT && item.termDeposit) {
          return item.termDeposit.subType;
        }
        return subType || 'N/A';
      }
    },
    {
      header: 'Status',
      key: 'status',
      render: (status: ProductStatus) => (
        <Badge
          variant={
            status === ProductStatus.ACTIVE ? 'success'
            : status === ProductStatus.DRAFT ? 'warning'
            : status === ProductStatus.PENDING_APPROVAL ? 'primary'
            : status === ProductStatus.RETIRED ? 'error'
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
      render: (_: any, item: LoanProductData) => (
        <div className="flex gap-2">
          {item.status === ProductStatus.DRAFT && (
            <Button variant="outline" size="sm" onClick={() => handleSubmitForApproval(item)}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Submit for Approval
            </Button>
          )}
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
                name="type"
                placeholder="Filter by Type"
                value={filters.type || ''}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'All Types' },
                  { value: ProductType.TERM_DEPOSIT, label: 'Term Deposit' },
                  { value: ProductType.LOAN, label: 'Loan' },
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
                  { value: ProductStatus.ACTIVE, label: 'Active' },
                  { value: ProductStatus.INACTIVE, label: 'Inactive' },
                  { value: ProductStatus.DRAFT, label: 'Draft' },
                  { value: ProductStatus.PENDING_APPROVAL, label: 'Pending Approval' },
                  { value: ProductStatus.RETIRED, label: 'Retired' },
                ]}
              />
            </div>
          </div>
          <Table data={products} columns={columns} />
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="Confirm Delete Product"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-error-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Delete {productToDelete?.name}?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                This action cannot be undone. The product will be permanently deleted and removed from all related data.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={isDeleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
