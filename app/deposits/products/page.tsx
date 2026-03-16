'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Table,
  Input,
  Select,
  Badge,
  Skeleton,
  Breadcrumbs,
  Modal,
  Tabs,
  EmptyState,
} from '@/components/ui';
import type { TableColumn } from '@/types/components';
import { Plus, Edit, Trash2, Building, Package, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useDepositCategories } from '@/hooks/useDepositCategories';
import { useDepositProducts } from '@/hooks/useDepositProducts';
import { useDepositCategoryMutations } from '@/hooks/useDepositCategoryMutations';
import { useDepositProductMutations } from '@/hooks/useDepositProductMutations';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
import {
  DepositCategory,
  DepositCategoryStatus,
  DepositCategoryType,
  CreateDepositCategoryDto,
} from '@/services/deposit-categories.service';
import {
  DepositProduct,
  DepositProductStatus,
  DepositProductType,
  CreateDepositProductDto,
} from '@/services/deposit-products.service';
import { getOrganisationId } from '@/lib/auth';

const CATEGORY_TYPE_LABELS: Record<string, string> = {
  demand_deposit: 'Demand Deposit (Savings/Current)',
  term_deposit: 'Term Deposit (FD/RD)',
};

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  savings: 'Savings',
  current: 'Current',
  fd: 'Fixed Deposit',
  rd: 'Recurring Deposit',
};

export default function ManageDepositProductsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { defaultRateLabel } = useInterestProfitTerm();
  const { categories, loading: catLoading, error: catError, refetch: refetchCategories } = useDepositCategories();
  const { products, loading: prodLoading, error: prodError, refetch: refetchProducts } = useDepositProducts();
  const { createDepositCategory, updateDepositCategory, deleteDepositCategory, loading: catMutating } = useDepositCategoryMutations();
  const { createDepositProduct, updateDepositProduct, deleteDepositProduct, loading: prodMutating } = useDepositProductMutations();

  const [activeTab, setActiveTab] = useState('categories');
  const [categoryModal, setCategoryModal] = useState<'add' | 'edit' | null>(null);
  const [productModal, setProductModal] = useState<'add' | 'edit' | null>(null);
  const [editingCategory, setEditingCategory] = useState<DepositCategory | null>(null);
  const [editingProduct, setEditingProduct] = useState<DepositProduct | null>(null);

  const [categoryForm, setCategoryForm] = useState<CreateDepositCategoryDto>({
    categoryName: '',
    categoryType: DepositCategoryType.DEMAND_DEPOSIT,
    description: '',
    status: DepositCategoryStatus.ACTIVE,
  });

  const [productForm, setProductForm] = useState<CreateDepositProductDto & { _id?: string }>({
    productName: '',
    category: '',
    productType: DepositProductType.SAVINGS,
    description: '',
    minAmount: 0,
    maxAmount: 0,
    defaultInterestRate: 0,
    status: DepositProductStatus.ACTIVE,
  });

  const resetCategoryForm = () => {
    setCategoryForm({
      categoryName: '',
      categoryType: DepositCategoryType.DEMAND_DEPOSIT,
      description: '',
      status: DepositCategoryStatus.ACTIVE,
    });
    setEditingCategory(null);
    setCategoryModal(null);
  };

  const openAddCategory = () => {
    setCategoryForm({
      categoryName: '',
      categoryType: DepositCategoryType.DEMAND_DEPOSIT,
      description: '',
      status: DepositCategoryStatus.ACTIVE,
    });
    setEditingCategory(null);
    setCategoryModal('add');
  };

  const resetProductForm = () => {
    setProductForm({
      productName: '',
      category: '',
      productType: DepositProductType.SAVINGS,
      description: '',
      minAmount: 0,
      maxAmount: 0,
      defaultInterestRate: 0,
      status: DepositProductStatus.ACTIVE,
    });
    setEditingProduct(null);
    setProductModal(null);
  };

  const openAddProduct = () => {
    setProductForm({
      productName: '',
      category: categories[0]?._id ?? '',
      productType: DepositProductType.SAVINGS,
      description: '',
      minAmount: 0,
      maxAmount: 0,
      defaultInterestRate: 0,
      status: DepositProductStatus.ACTIVE,
    });
    setEditingProduct(null);
    setProductModal('add');
  };

  const handleSaveCategory = async () => {
    try {
      const orgId = getOrganisationId();
      if (editingCategory) {
        await updateDepositCategory({
          _id: editingCategory._id,
          ...categoryForm,
        });
        addToast({ type: 'success', message: 'Category updated successfully' });
      } else {
        await createDepositCategory({ ...categoryForm, organisation: orgId ?? undefined });
        addToast({ type: 'success', message: 'Category created successfully' });
      }
      refetchCategories();
      resetCategoryForm();
    } catch (e) {
      addToast({ type: 'error', message: e instanceof Error ? e.message : 'Failed to save category' });
    }
  };

  const handleSaveProduct = async () => {
    if (!productForm.category) {
      addToast({ type: 'error', message: 'Please select a category' });
      return;
    }
    try {
      const orgId = getOrganisationId();
      if (editingProduct) {
        await updateDepositProduct({
          _id: editingProduct._id,
          ...productForm,
        });
        addToast({ type: 'success', message: 'Product updated successfully' });
      } else {
        await createDepositProduct({ ...productForm, organisation: orgId ?? undefined });
        addToast({ type: 'success', message: 'Product created successfully' });
      }
      refetchProducts();
      resetProductForm();
    } catch (e) {
      addToast({ type: 'error', message: e instanceof Error ? e.message : 'Failed to save product' });
    }
  };

  const handleDeleteCategory = async (cat: DepositCategory) => {
    if (!confirm(`Delete category "${cat.categoryName}"?`)) return;
    try {
      await deleteDepositCategory(cat._id);
      addToast({ type: 'success', message: 'Category deleted' });
      refetchCategories();
    } catch (e) {
      addToast({ type: 'error', message: e instanceof Error ? e.message : 'Failed to delete category' });
    }
  };

  const handleDeleteProduct = async (prod: DepositProduct) => {
    if (!confirm(`Delete product "${prod.productName}"?`)) return;
    try {
      await deleteDepositProduct(prod._id);
      addToast({ type: 'success', message: 'Product deleted' });
      refetchProducts();
    } catch (e) {
      addToast({ type: 'error', message: e instanceof Error ? e.message : 'Failed to delete product' });
    }
  };

  const categoryColumns = [
    {
      header: 'Category',
      key: 'categoryName',
      render: (_: unknown, row: DepositCategory) => (
        <div>
          <p className="font-medium">{row.categoryName}</p>
          <p className="text-sm text-neutral-500">{row.description}</p>
          <p className="text-xs text-neutral-400">{CATEGORY_TYPE_LABELS[row.categoryType] || row.categoryType}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'categoryType',
      render: (v: string) => <Badge variant="neutral">{CATEGORY_TYPE_LABELS[v] || v}</Badge>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (v: string) => (
        <Badge variant={v === DepositCategoryStatus.ACTIVE ? 'success' : 'neutral'}>{v}</Badge>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_: unknown, row: DepositCategory) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingCategory(row);
              setCategoryForm({
                categoryName: row.categoryName,
                categoryType: row.categoryType as DepositCategoryType,
                description: row.description,
                status: (row.status as DepositCategoryStatus) || DepositCategoryStatus.ACTIVE,
              });
              setCategoryModal('edit');
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(row)} disabled={catMutating}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const productColumns = [
    {
      header: 'Product',
      key: 'productName',
      render: (_: unknown, row: DepositProduct) => (
        <div>
          <p className="font-medium">{row.productName}</p>
          <p className="text-sm text-neutral-500">{row.description}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'productType',
      render: (v: string) => <Badge variant="neutral">{PRODUCT_TYPE_LABELS[v] || v}</Badge>,
    },
    {
      header: 'Category',
      key: 'category',
      render: (cat: DepositCategory | string) =>
        typeof cat === 'object' && cat?.categoryName ? cat.categoryName : cat || '—',
    },
    {
      header: 'Amount / Rate',
      key: 'amounts',
      render: (_: unknown, row: DepositProduct) => (
        <span className="text-sm">
          ₹{(row.minAmount || 0).toLocaleString()} – ₹{(row.maxAmount || 0).toLocaleString()}
          {row.defaultInterestRate != null && row.defaultInterestRate > 0 && ` · ${row.defaultInterestRate}%`}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (v: string) => (
        <Badge variant={v === DepositProductStatus.ACTIVE ? 'success' : 'neutral'}>{v}</Badge>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_: unknown, row: DepositProduct) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingProduct(row);
              const catId = typeof row.category === 'object' ? (row.category as DepositCategory)._id : row.category;
              setProductForm({
                _id: row._id,
                productName: row.productName,
                category: catId,
                productType: row.productType as DepositProductType,
                description: row.description,
                minAmount: row.minAmount ?? 0,
                maxAmount: row.maxAmount ?? 0,
                defaultInterestRate: row.defaultInterestRate ?? 0,
                status: (row.status as DepositProductStatus) || DepositProductStatus.ACTIVE,
              });
              setProductModal('edit');
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(row)} disabled={prodMutating}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const categoriesContent = (
    <>
      {catLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : catError ? (
        <EmptyState
          icon={<Building className="h-12 w-12 text-error-400" />}
          title="Error loading categories"
          description={catError}
          action={<Button onClick={refetchCategories}>Retry</Button>}
        />
      ) : !categories.length ? (
        <EmptyState
          icon={<Building className="h-12 w-12 text-neutral-400" />}
          title="No deposit categories"
          description="Add Demand Deposit (Savings/Current) or Term Deposit (FD/RD) categories first."
          action={
            <Button onClick={openAddCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          }
        />
      ) : (
        <>
          <div className="p-4 flex justify-end">
            <Button onClick={openAddCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table columns={categoryColumns} data={categories} />
          </div>
        </>
      )}
    </>
  );

  const productsContent = (
    <>
      {prodLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : prodError ? (
        <EmptyState
          icon={<Package className="h-12 w-12 text-error-400" />}
          title="Error loading products"
          description={prodError}
          action={<Button onClick={refetchProducts}>Retry</Button>}
        />
      ) : !products.length ? (
        <EmptyState
          icon={<Package className="h-12 w-12 text-neutral-400" />}
          title="No deposit products"
          description="Add products under each category (e.g. Savings, Current, FD, RD)."
          action={
            <Button onClick={openAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          }
        />
      ) : (
        <>
          <div className="p-4 flex justify-end">
            <Button onClick={openAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table columns={productColumns as TableColumn<DepositProduct>[]} data={products} />
          </div>
        </>
      )}
    </>
  );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Deposits', href: '/deposits' },
            { label: 'Manage Deposit Products', href: '/deposits/products' },
          ]}
        />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Deposit Products</h1>
            <p className="text-neutral-600 mt-1">
              Deposit categories (Demand / Term) and products (Savings, Current, FD, RD)
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/deposits')}>
            Back to Deposits
          </Button>
        </div>

        <Card>
          <Tabs
            tabs={[
              { id: 'categories', label: 'Deposit Categories', content: categoriesContent, icon: <Building className="h-4 w-4" /> },
              { id: 'products', label: 'Deposit Products', content: productsContent, icon: <Package className="h-4 w-4" /> },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Card>
      </div>

      <Modal
        isOpen={categoryModal !== null}
        onClose={resetCategoryForm}
        title={categoryModal === 'edit' ? 'Edit Deposit Category' : 'Add Deposit Category'}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={resetCategoryForm}>Cancel</Button>
            <Button onClick={handleSaveCategory} disabled={!categoryForm.categoryName.trim() || !categoryForm.description.trim()}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Category name"
            value={categoryForm.categoryName}
            onChange={(e) => setCategoryForm((p) => ({ ...p, categoryName: e.target.value }))}
            placeholder="e.g. Demand Deposit"
          />
          <Select
            label="Category type"
            value={categoryForm.categoryType}
            onChange={(e) => setCategoryForm((p) => ({ ...p, categoryType: e.target.value as DepositCategoryType }))}
            options={[
              { value: DepositCategoryType.DEMAND_DEPOSIT, label: CATEGORY_TYPE_LABELS.demand_deposit },
              { value: DepositCategoryType.TERM_DEPOSIT, label: CATEGORY_TYPE_LABELS.term_deposit },
            ]}
          />
          <Input
            label="Description"
            value={categoryForm.description}
            onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Short description"
          />
          <Select
            label="Status"
            value={categoryForm.status || DepositCategoryStatus.ACTIVE}
            onChange={(e) => setCategoryForm((p) => ({ ...p, status: e.target.value as DepositCategoryStatus }))}
            options={[
              { value: DepositCategoryStatus.ACTIVE, label: 'Active' },
              { value: DepositCategoryStatus.INACTIVE, label: 'Inactive' },
            ]}
          />
        </div>
      </Modal>

      <Modal
        isOpen={productModal !== null}
        onClose={resetProductForm}
        title={productModal === 'edit' ? 'Edit Deposit Product' : 'Add Deposit Product'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={resetProductForm}>Cancel</Button>
            <Button onClick={handleSaveProduct} disabled={!productForm.productName.trim() || !productForm.category || !productForm.description.trim()}>
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Product name"
            value={productForm.productName}
            onChange={(e) => setProductForm((p) => ({ ...p, productName: e.target.value }))}
            placeholder="e.g. Savings Account"
          />
          <Select
            label="Category"
            value={productForm.category}
            onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}
            options={[
              { value: '', label: 'Select category' },
              ...categories.map((c) => ({ value: c._id, label: c.categoryName })),
            ]}
          />
          <Select
            label="Product type"
            value={productForm.productType}
            onChange={(e) => setProductForm((p) => ({ ...p, productType: e.target.value as DepositProductType }))}
            options={[
              { value: DepositProductType.SAVINGS, label: 'Savings' },
              { value: DepositProductType.CURRENT, label: 'Current' },
              { value: DepositProductType.FD, label: 'Fixed Deposit' },
              { value: DepositProductType.RD, label: 'Recurring Deposit' },
            ]}
          />
          <Input
            label="Description"
            value={productForm.description}
            onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Short description"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Min amount (₹)"
              value={productForm.minAmount ?? ''}
              onChange={(e) => setProductForm((p) => ({ ...p, minAmount: Number(e.target.value) || 0 }))}
            />
            <Input
              type="number"
              label="Max amount (₹)"
              value={productForm.maxAmount ?? ''}
              onChange={(e) => setProductForm((p) => ({ ...p, maxAmount: Number(e.target.value) || 0 }))}
            />
          </div>
          <Input
            type="number"
            label={`${defaultRateLabel} (%)`}
            value={productForm.defaultInterestRate ?? ''}
            onChange={(e) => setProductForm((p) => ({ ...p, defaultInterestRate: Number(e.target.value) || 0 }))}
          />
          <Select
            label="Status"
            value={productForm.status || DepositProductStatus.ACTIVE}
            onChange={(e) => setProductForm((p) => ({ ...p, status: e.target.value as DepositProductStatus }))}
            options={[
              { value: DepositProductStatus.ACTIVE, label: 'Active' },
              { value: DepositProductStatus.INACTIVE, label: 'Inactive' },
            ]}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
}
