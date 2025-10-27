'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Tabs,
  EmptyState,
} from '@/components/ui';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  Building,
  DollarSign,
  Users,
  Settings,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useLoanCategories } from '@/hooks/useLoanCategories';
import { useLoanCategoryMutations } from '@/hooks/useLoanCategoryMutations';
import { LoanCategory, LoanSubCategory } from '@/services/loan-categories.service';

// Utility function to safely format dates
const formatDate = (dateString: string | undefined, format: 'date' | 'datetime' = 'date'): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format === 'datetime' ? date.toLocaleString() : date.toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
};

export default function LoanCategoriesPage() {
  const router = useRouter();
  const { categories, loading, error, refetch, filters, setFilters } = useLoanCategories();
  const { deleteLoanCategory, deleteLoanSubCategory, loading: isDeleting } = useLoanCategoryMutations();
  const { addToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'category' | 'subcategory'; item: LoanCategory | LoanSubCategory } | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return categories.slice(startIndex, startIndex + itemsPerPage);
  }, [categories, currentPage]);

  const handleDelete = (type: 'category' | 'subcategory', item: LoanCategory | LoanSubCategory) => {
    setItemToDelete({ type, item });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'category') {
        await deleteLoanCategory(itemToDelete.item._id || '');
      } else {
        await deleteLoanSubCategory(itemToDelete.item._id || '');
      }
      addToast({ type: 'success', message: `${itemToDelete.type === 'category' ? 'Category' : 'Sub-category'} deleted successfully` });
      refetch();
    } catch (err) {
      addToast({ type: 'error', message: `Failed to delete ${itemToDelete.type === 'category' ? 'category' : 'sub-category'}` });
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="neutral">Inactive</Badge>
    );
  };

  const columns = [
    {
      header: 'Category',
      key: 'name',
      render: (_: any, row: LoanCategory) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ backgroundColor: row.color || '#6366f1' }}
          >
            {row.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-medium text-neutral-900">{row.name}</p>
            <p className="text-sm text-neutral-500">{row.description}</p>
            <p className="text-xs text-neutral-400">Category #{row.displayOrder}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Sub-categories',
      key: 'subCategories',
      render: (_: any, row: LoanCategory) => (
        <div className="space-y-1">
          <div className="text-sm text-neutral-600">
            {row.subCategories?.length || 0} sub-categories
          </div>
          <div className="text-xs text-neutral-500">
            Display Order: {row.displayOrder}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'isActive',
      render: (_: any, row: LoanCategory) => getStatusBadge(row.isActive),
    },
    {
      header: 'Created',
      key: 'createdAt',
      render: (_: any, row: LoanCategory) => (
        <span className="text-sm text-neutral-600">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_: any, item: LoanCategory) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/products/categories/${item._id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push(`/products/categories/${item._id}/edit`)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete('category', item)} disabled={isDeleting}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Note: Sub-categories are not available in the current API response
  // This function is kept for future use if sub-categories are added
  const renderSubCategories = (category: LoanCategory) => {
    return null;
  };

  if (loading) return <DashboardLayout><div className="p-6"><Skeleton className="h-96 w-full" /></div></DashboardLayout>;
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <Breadcrumbs items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Products', href: '/products' },
            { label: 'Loan Categories' }
          ]} />
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Loan Categories</h1>
              <p className="text-neutral-600 mt-1">Manage loan product categories and sub-categories</p>
            </div>
          </div>

          <EmptyState
            icon={<Building className="h-12 w-12 text-error-400" />}
            title="Failed to load categories"
            description={`Unable to fetch loan categories. ${error}`}
            action={
              <Button onClick={refetch}>
                Try Again
              </Button>
            }
          />
        </div>
      </DashboardLayout>
    );
  }
  if (!categories || categories.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <Breadcrumbs items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Products', href: '/products' },
            { label: 'Loan Categories' }
          ]} />
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Loan Categories</h1>
              <p className="text-neutral-600 mt-1">Manage loan product categories and sub-categories</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/products/categories/add')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>

          <EmptyState
            icon={<Building className="h-12 w-12 text-neutral-400" />}
            title="No loan categories found"
            description="Get started by creating your first loan category to organize your loan products."
            action={
              <Button onClick={() => router.push('/products/categories/add')}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Category
              </Button>
            }
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/products' },
          { label: 'Loan Categories' }
        ]} />
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Loan Categories</h1>
            <p className="text-neutral-600 mt-1">Manage loan product categories and sub-categories</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/products/categories/add')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center">
                <Building className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Categories</p>
                <p className="text-2xl font-bold">{categories.filter(c => c.isActive).length}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Sub-categories</p>
                <p className="text-2xl font-bold">
                  {categories.reduce((acc, c) => acc + (c.subCategories?.length || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-stripe flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Avg Display Order</p>
                <p className="text-2xl font-bold">
                  {categories.length > 0 ? (categories.reduce((acc, c) => acc + c.displayOrder, 0) / categories.length).toFixed(1) : '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-info-100 rounded-stripe flex items-center justify-center">
                <Users className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Search categories..."
                value={filters.search || ''}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                name="isActive"
                value={filters.isActive !== undefined ? (filters.isActive ? 'active' : 'inactive') : ''}
                onChange={e => setFilters(prev => ({ 
                  ...prev, 
                  isActive: e.target.value === '' ? undefined : e.target.value === 'active'
                }))}
                options={[
                  { label: 'All Status', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Categories Table */}
        <Card>
          {paginatedCategories.length === 0 ? (
            <div className="p-8 text-center">
              <EmptyState
                icon={<Search className="h-12 w-12 text-neutral-400" />}
                title="No categories found"
                description="No loan categories match your current search or filter criteria. Try adjusting your search terms or filters."
                action={
                  <Button variant="outline" onClick={() => setFilters({})}>
                    Clear Filters
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <Table data={paginatedCategories} columns={columns} />
              {paginatedCategories.map(category => renderSubCategories(category))}
              
              {categories.length > itemsPerPage && (
                <div className="p-4 border-t flex items-center justify-between">
                  <p className="text-sm text-neutral-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, categories.length)} of{' '}
                    {categories.length} categories
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(categories.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title={`Confirm Delete ${itemToDelete?.type === 'category' ? 'Category' : 'Sub-category'}`}
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-error-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Delete {itemToDelete?.item.name}?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                This action cannot be undone. All {itemToDelete?.type === 'category' ? 'sub-categories and ' : ''}related data will be permanently deleted.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={isDeleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {itemToDelete?.type === 'category' ? 'Category' : 'Sub-category'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
