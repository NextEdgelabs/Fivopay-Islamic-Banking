'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Breadcrumbs,
  Skeleton,
  Tabs,
  Modal,
} from '@/components/ui';
import {
  Edit,
  Trash2,
  Building,
  DollarSign,
  Users,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Shield,
  CreditCard,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useLoanCategoryMutations } from '@/hooks/useLoanCategoryMutations';
import { useLoanCategory } from '@/hooks/useLoanCategory';
import { LoanCategory } from '@/services/loan-categories.service';

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

export default function LoanCategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;
  const { category, loading, error } = useLoanCategory(categoryId);
  const { deleteLoanCategory, loading: isDeleting } = useLoanCategoryMutations();
  const { addToast } = useToast();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!category) return;
    
    try {
      await deleteLoanCategory(category._id || '');
      addToast({ type: 'success', message: 'Category deleted successfully' });
      router.push('/products/categories');
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to delete category' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="neutral">Inactive</Badge>
    );
  };

  if (loading) return <DashboardLayout><div className="p-6"><Skeleton className="h-96 w-full" /></div></DashboardLayout>;
  if (error || !category) return <DashboardLayout><div className="p-6 text-error-500">{error || 'Category not found'}</div></DashboardLayout>;

  const TABS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Building className="h-4 w-4" />,
      content: <CategoryOverviewTab category={category} />,
    },
    {
      id: 'subcategories',
      label: 'Sub-categories',
      icon: <CheckCircle className="h-4 w-4" />,
      content: <CategoryEligibilityTab category={category} />,
    },
    {
      id: 'details',
      label: 'Details',
      icon: <Star className="h-4 w-4" />,
      content: <CategoryFeaturesTab category={category} />,
    },
    {
      id: 'info',
      label: 'Information',
      icon: <FileText className="h-4 w-4" />,
      content: <CategoryTermsTab category={category} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/products' },
          { label: 'Loan Categories', href: '/products/categories' },
          { label: category.name }
        ]} />
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-neutral-500">Category #{category.displayOrder}</p>
              <div className="mt-2">{getStatusBadge(category.isActive)}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" onClick={() => router.push(`/products/categories/${category._id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </Card>

        <Tabs tabs={TABS} />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="Confirm Delete Category"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-error-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Delete {category?.name}?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                This action cannot be undone. All sub-categories and related data will be permanently deleted.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={isDeleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

const CategoryOverviewTab = ({ category }: { category: LoanCategory }) => (
  <div className="space-y-6 mt-4">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <h2 className="text-xl font-semibold p-6 border-b">Category Details</h2>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<Building />} label="Category Name" value={category.name} />
            <InfoItem icon={<Calendar />} label="Display Order" value={`#${category.displayOrder}`} />
            <InfoItem icon={<CheckCircle />} label="Status" value={category.isActive ? 'Active' : 'Inactive'} />
            <InfoItem icon={<Clock />} label="Created" value={formatDate(category.createdAt)} />
          </div>
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold p-6 border-b">Description</h2>
          <div className="p-6">
            <p className="text-neutral-700">{category.description}</p>
          </div>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Info</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-neutral-600">Category ID</span>
              <span className="font-semibold text-xs">{category._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Display Order</span>
              <span className="font-semibold">{category.displayOrder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Status</span>
              <span className="font-semibold">{category.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Sub-categories</span>
              <span className="font-semibold">{category.subCategories?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Last Updated</span>
              <span className="font-semibold text-xs">{formatDate(category.updatedAt)}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Visual Identity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-neutral-600">Icon:</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                   style={{ backgroundColor: category.color || '#6366f1' }}>
                {category.icon || category.name.charAt(0)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-neutral-600">Color:</span>
              <div className="w-6 h-6 rounded-full border-2 border-neutral-300"
                   style={{ backgroundColor: category.color || '#6366f1' }}></div>
              <span className="text-sm font-mono">{category.color || '#6366f1'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const CategoryEligibilityTab = ({ category }: { category: LoanCategory }) => (
  <div className="space-y-6 mt-4">
    <Card>
      <h2 className="text-xl font-semibold p-6 border-b">Sub-categories</h2>
      <div className="p-6">
        {category.subCategories && category.subCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.subCategories.map((subCategory, index) => (
              <div key={subCategory._id || index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{subCategory.name}</h3>
                  <Badge variant={subCategory.isActive ? 'success' : 'neutral'}>
                    {subCategory.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-neutral-600 text-sm mb-3">{subCategory.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Amount Range:</span>
                    <span>₹{subCategory.amountRange.min.toLocaleString()} - ₹{subCategory.amountRange.max.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Interest Rate:</span>
                    <span>{subCategory.interestRateRange.min}% - {subCategory.interestRateRange.max}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tenure:</span>
                    <span>{subCategory.tenureRange.min} - {subCategory.tenureRange.max} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Processing Fee:</span>
                    <span>{subCategory.processingFee}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <Building className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
            <p>No sub-categories found for this category.</p>
          </div>
        )}
      </div>
    </Card>
  </div>
);

const CategoryFeaturesTab = ({ category }: { category: LoanCategory }) => (
  <div className="space-y-6 mt-4">
    <Card>
      <h2 className="text-xl font-semibold p-6 border-b">Category Information</h2>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={<Building />} label="Category Name" value={category.name} />
            <InfoItem icon={<Calendar />} label="Display Order" value={`#${category.displayOrder}`} />
            <InfoItem icon={<CheckCircle />} label="Status" value={category.isActive ? 'Active' : 'Inactive'} />
            <InfoItem icon={<Clock />} label="Created Date" value={formatDate(category.createdAt)} />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Visual Identity</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-neutral-600">Icon:</span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-semibold"
                   style={{ backgroundColor: category.color || '#6366f1' }}>
                {category.icon || category.name.charAt(0)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-neutral-600">Color:</span>
              <div className="w-8 h-8 rounded-full border-2 border-neutral-300"
                   style={{ backgroundColor: category.color || '#6366f1' }}></div>
              <span className="font-mono text-sm">{category.color || '#6366f1'}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

const CategoryTermsTab = ({ category }: { category: LoanCategory }) => (
  <div className="space-y-6 mt-4">
    <Card>
      <h2 className="text-xl font-semibold p-6 border-b">Category Description</h2>
      <div className="p-6">
        <p className="text-neutral-700 leading-relaxed">{category.description}</p>
      </div>
    </Card>
    
    <Card>
      <h2 className="text-xl font-semibold p-6 border-b">Timestamps</h2>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-neutral-600">Created At</span>
          <span className="font-semibold">
            {formatDate(category.createdAt, 'datetime')}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-neutral-600">Updated At</span>
          <span className="font-semibold">
            {formatDate(category.updatedAt, 'datetime')}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-neutral-600">Category ID</span>
          <span className="font-mono text-sm">{category._id}</span>
        </div>
      </div>
    </Card>
  </div>
);

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div>
    <span className="text-sm font-medium text-neutral-600 flex items-center mb-1">{icon} {label}</span>
    <p className="text-neutral-800">{value}</p>
  </div>
);
