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
import { LoanCategory, LoanCategoryStatus } from '@/services/loan-categories.service';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function LoanCategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;
  const { category, loading, error } = useLoanCategory(categoryId);
  const { deleteLoanCategory, loading: isDeleting } = useLoanCategoryMutations();
  const { addToast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    if (!category) return;
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!category) return;
    try {
      await deleteLoanCategory(category._id);
      addToast({ type: 'success', message: 'Category deleted successfully' });
      router.push('/products/categories');
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to delete category' });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case LoanCategoryStatus.ACTIVE:
        return <Badge variant="success">Active</Badge>;
      case LoanCategoryStatus.INACTIVE:
        return <Badge variant="neutral">Inactive</Badge>;
      case LoanCategoryStatus.SUSPENDED:
        return <Badge variant="warning">Suspended</Badge>;
      default:
        return <Badge variant="neutral">{status || 'Unknown'}</Badge>;
    }
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
      id: 'eligibility',
      label: 'Eligibility',
      icon: <CheckCircle className="h-4 w-4" />,
      content: <CategoryEligibilityTab category={category} />,
    },
    {
      id: 'features',
      label: 'Features',
      icon: <Star className="h-4 w-4" />,
      content: <CategoryFeaturesTab category={category} />,
    },
    {
      id: 'terms',
      label: 'Terms & Conditions',
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
          { label: category.categoryName }
        ]} />
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">{category.categoryName}</h1>
              <p className="text-neutral-500 capitalize">{category.loanType} Loan</p>
              <div className="mt-2">{getStatusBadge(category.status)}</div>
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

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={category ? `Are you sure you want to delete "${category.categoryName}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </DashboardLayout>
  );
}

const CategoryOverviewTab = ({ category }: { category: LoanCategory }) => (
  <div className="space-y-6 mt-4">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <h2 className="text-xl font-semibold p-6 border-b">Loan Details</h2>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<DollarSign />} label="Loan Amount" value={`₹${(category.minLoanAmount || 0).toLocaleString()} - ₹${(category.maxLoanAmount || 0).toLocaleString()}`} />
            {category.defaultInterestRate && (
              <InfoItem icon={<TrendingUp />} label="Default Interest Rate" value={`${category.defaultInterestRate}% per annum`} />
            )}
            <InfoItem icon={<Calendar />} label="Tenure" value={`${category.minTenureMonths || 0} - ${category.maxTenureMonths || 0} months`} />
            {category.defaultProcessingFee && (
              <InfoItem 
                icon={<CreditCard />} 
                label="Default Processing Fee" 
                value={category.defaultProcessingFee.type === 'percentage' 
                  ? `${category.defaultProcessingFee.value}%` 
                  : `₹${category.defaultProcessingFee.value.toLocaleString()}`} 
              />
            )}
            {category.defaultPrepaymentCharges && (
              <InfoItem 
                icon={<Shield />} 
                label="Default Prepayment Charges" 
                value={category.defaultPrepaymentCharges.type === 'percentage' 
                  ? `${category.defaultPrepaymentCharges.value}%` 
                  : `₹${category.defaultPrepaymentCharges.value.toLocaleString()}`} 
              />
            )}
            {category.defaultLatePaymentCharges && (
              <InfoItem 
                icon={<AlertCircle />} 
                label="Default Late Payment Charges" 
                value={category.defaultLatePaymentCharges.type === 'percentage' 
                  ? `${category.defaultLatePaymentCharges.value}%` 
                  : `₹${category.defaultLatePaymentCharges.value.toLocaleString()}`} 
              />
            )}
          </div>
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold p-6 border-b">Description</h2>
          <div className="p-6">
            <p className="text-neutral-700">{category.description || 'No description available'}</p>
          </div>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-neutral-600">Min Amount</span>
              <span className="font-semibold">₹{(category.minLoanAmount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Max Amount</span>
              <span className="font-semibold">₹{(category.maxLoanAmount || 0).toLocaleString()}</span>
            </div>
            {category.defaultInterestRate && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Default Interest Rate</span>
                <span className="font-semibold">{category.defaultInterestRate}%</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-600">Min Tenure</span>
              <span className="font-semibold">{category.minTenureMonths || 0} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Max Tenure</span>
              <span className="font-semibold">{category.maxTenureMonths || 0} months</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const CategoryEligibilityTab = ({ category }: { category: LoanCategory }) => (
  <div className="space-y-6 mt-4">
    {category.eligibilityCriteria ? (
      <>
        <Card>
          <h2 className="text-xl font-semibold p-6 border-b">Eligibility Criteria</h2>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {(category.eligibilityCriteria.minAge || category.eligibilityCriteria.maxAge) && (
              <InfoItem 
                icon={<Users />} 
                label="Age Range" 
                value={`${category.eligibilityCriteria.minAge || 'N/A'} - ${category.eligibilityCriteria.maxAge || 'N/A'} years`} 
              />
            )}
            {category.eligibilityCriteria.minIncome && (
              <InfoItem 
                icon={<DollarSign />} 
                label="Minimum Income" 
                value={`₹${category.eligibilityCriteria.minIncome.toLocaleString()}`} 
              />
            )}
            {category.eligibilityCriteria.creditScoreMin && (
              <InfoItem 
                icon={<CheckCircle />} 
                label="Credit Score" 
                value={`Minimum ${category.eligibilityCriteria.creditScoreMin}`} 
              />
            )}
          </div>
        </Card>
        
        {category.eligibilityCriteria.requiredDocuments && category.eligibilityCriteria.requiredDocuments.length > 0 && (
          <Card>
            <h2 className="text-xl font-semibold p-6 border-b">Required Documents</h2>
            <div className="p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.eligibilityCriteria.requiredDocuments.map((doc, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-500" />
                    <span className="text-neutral-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}
      </>
    ) : (
      <Card>
        <div className="p-6 text-center text-neutral-500">
          <p>No eligibility criteria defined for this category.</p>
        </div>
      </Card>
    )}
  </div>
);

const CategoryFeaturesTab = ({ category }: { category: LoanCategory }) => (
  <div className="space-y-6 mt-4">
    {category.keyFeatures && category.keyFeatures.length > 0 ? (
      <Card>
        <h2 className="text-xl font-semibold p-6 border-b">Key Features</h2>
        <div className="p-6">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <Star className="h-5 w-5 text-warning-500 flex-shrink-0" />
                <span className="text-neutral-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    ) : (
      <Card>
        <div className="p-6 text-center text-neutral-500">
          <p>No key features defined for this category.</p>
        </div>
      </Card>
    )}
  </div>
);

const CategoryTermsTab = ({ category }: { category: LoanCategory }) => (
  <div className="space-y-6 mt-4">
    <Card>
      <h2 className="text-xl font-semibold p-6 border-b">Terms & Conditions</h2>
      <div className="p-6">
        <p className="text-neutral-700 leading-relaxed">
          {category.termsAndConditions || 'No terms and conditions defined for this category.'}
        </p>
      </div>
    </Card>
    
    {(category.defaultProcessingFee || category.defaultPrepaymentCharges || category.defaultLatePaymentCharges) && (
      <Card>
        <h2 className="text-xl font-semibold p-6 border-b">Default Charges & Fees</h2>
        <div className="p-6 space-y-4">
          {category.defaultProcessingFee && (
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-neutral-600">Default Processing Fee</span>
              <span className="font-semibold">
                {category.defaultProcessingFee.type === 'percentage' 
                  ? `${category.defaultProcessingFee.value}%` 
                  : `₹${category.defaultProcessingFee.value.toLocaleString()}`}
              </span>
            </div>
          )}
          {category.defaultPrepaymentCharges && (
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-neutral-600">Default Prepayment Charges</span>
              <span className="font-semibold">
                {category.defaultPrepaymentCharges.type === 'percentage' 
                  ? `${category.defaultPrepaymentCharges.value}%` 
                  : `₹${category.defaultPrepaymentCharges.value.toLocaleString()}`}
              </span>
            </div>
          )}
          {category.defaultLatePaymentCharges && (
            <div className="flex justify-between items-center py-2">
              <span className="text-neutral-600">Default Late Payment Charges</span>
              <span className="font-semibold">
                {category.defaultLatePaymentCharges.type === 'percentage' 
                  ? `${category.defaultLatePaymentCharges.value}%` 
                  : `₹${category.defaultLatePaymentCharges.value.toLocaleString()}`}
              </span>
            </div>
          )}
        </div>
      </Card>
    )}
  </div>
);

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div>
    <span className="text-sm font-medium text-neutral-600 flex items-center mb-1">{icon} {label}</span>
    <p className="text-neutral-800">{value}</p>
  </div>
);
