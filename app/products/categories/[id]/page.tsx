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
import { LoanCategory } from '@/services/loan-categories.service';

export default function LoanCategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;
  const { category, loading, error } = useLoanCategory(categoryId);
  const { deleteLoanCategory, loading: isDeleting } = useLoanCategoryMutations();
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (!category) return;
    if (confirm(`Are you sure you want to delete ${category.categoryName}?`)) {
      try {
        await deleteLoanCategory(category._id);
        addToast({ type: 'success', message: 'Category deleted successfully' });
        router.push('/products/categories');
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to delete category' });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
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
            <InfoItem icon={<DollarSign />} label="Loan Amount" value={`₹${category.minLoanAmount.toLocaleString()} - ₹${category.maxLoanAmount.toLocaleString()}`} />
            <InfoItem icon={<TrendingUp />} label="Interest Rate" value={`${category.interestRate}% per annum`} />
            <InfoItem icon={<Calendar />} label="Tenure" value={`${category.minTenureMonths} - ${category.maxTenureMonths} months`} />
            <InfoItem icon={<CreditCard />} label="Processing Fee" value={category.processingFee.type === 'percentage' ? `${category.processingFee.value}%` : `₹${category.processingFee.value.toLocaleString()}`} />
            <InfoItem icon={<Shield />} label="Prepayment Charges" value={`${category.prepaymentCharges.value}%`} />
            <InfoItem icon={<AlertCircle />} label="Late Payment Charges" value={`${category.latePaymentCharges.value}%`} />
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
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-neutral-600">Min Amount</span>
              <span className="font-semibold">₹{category.minLoanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Max Amount</span>
              <span className="font-semibold">₹{category.maxLoanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Interest Rate</span>
              <span className="font-semibold">{category.interestRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Min Tenure</span>
              <span className="font-semibold">{category.minTenureMonths} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Max Tenure</span>
              <span className="font-semibold">{category.maxTenureMonths} months</span>
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
      <h2 className="text-xl font-semibold p-6 border-b">Eligibility Criteria</h2>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={<Users />} label="Age Range" value={`${category.eligibilityCriteria.minAge} - ${category.eligibilityCriteria.maxAge} years`} />
        <InfoItem icon={<DollarSign />} label="Minimum Income" value={`₹${category.eligibilityCriteria.minIncome.toLocaleString()}`} />
        <InfoItem icon={<CheckCircle />} label="Credit Score" value={`Minimum ${category.eligibilityCriteria.creditScoreMin}`} />
      </div>
    </Card>
    
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
  </div>
);

const CategoryFeaturesTab = ({ category }: { category: LoanCategory }) => (
  <div className="space-y-6 mt-4">
    <Card>
      <h2 className="text-xl font-semibold p-6 border-b">Key Features</h2>
      <div className="p-6">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <Star className="h-5 w-5 text-warning-500 flex-shrink-0" />
              <span className="text-neutral-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  </div>
);

const CategoryTermsTab = ({ category }: { category: LoanCategory }) => (
  <div className="space-y-6 mt-4">
    <Card>
      <h2 className="text-xl font-semibold p-6 border-b">Terms & Conditions</h2>
      <div className="p-6">
        <p className="text-neutral-700 leading-relaxed">{category.termsAndConditions}</p>
      </div>
    </Card>
    
    <Card>
      <h2 className="text-xl font-semibold p-6 border-b">Charges & Fees</h2>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-neutral-600">Processing Fee</span>
          <span className="font-semibold">
            {category.processingFee.type === 'percentage' 
              ? `${category.processingFee.value}%` 
              : `₹${category.processingFee.value.toLocaleString()}`}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-neutral-600">Prepayment Charges</span>
          <span className="font-semibold">{category.prepaymentCharges.value}%</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-neutral-600">Late Payment Charges</span>
          <span className="font-semibold">{category.latePaymentCharges.value}%</span>
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
