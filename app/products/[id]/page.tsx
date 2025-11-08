'use client';

import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Badge, Breadcrumbs, Skeleton, Tabs } from '@/components/ui';
import { Edit, Trash2, ArrowLeft, Package, Tag, Info, Clock, DollarSign, Calendar, TrendingUp, CreditCard, Shield, AlertCircle, FileText, CheckCircle, XCircle, Users, Building } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct';
import { useProductMutations } from '@/hooks/useProductMutations';
import { useToast } from '@/components/ui/Toast';
import { LoanProduct, LoanProductStatus, ProductType, RepaymentFrequency } from '@/services/products';
import ProductAnalyticsTab from './components/ProductAnalyticsTab';

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { product, loading, error, refetch } = useProduct(productId);
  const { deleteProduct, updateProduct, loading: isDeleting } = useProductMutations();
  const { addToast } = useToast();

  const handleStatusChange = async (status: LoanProductStatus | string) => {
    if (!product) return;
    try {
      await updateProduct(product._id, { ...product, status });
      addToast({ type: 'success', message: `Product status updated to ${status}` });
      refetch();
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to update status' });
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (confirm(`Are you sure you want to delete ${product.productName}?`)) {
      try {
        await deleteProduct(product._id);
        addToast({ type: 'success', message: 'Product deleted successfully' });
        router.push('/products');
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to delete product' });
      }
    }
  };
  
  if (loading) return <DashboardLayout><Skeleton className="h-screen w-full" /></DashboardLayout>;
  if (error || !product) return <DashboardLayout><div className="p-6 text-error-500">{error || 'Product not found'}</div></DashboardLayout>;

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'primary'> = {
      [LoanProductStatus.ACTIVE]: 'success',
      [LoanProductStatus.INACTIVE]: 'warning',
      [LoanProductStatus.SUSPENDED]: 'error',
    };
    return statusMap[status] || 'neutral';
  };

  const getProductTypeBadge = (type: string) => {
    const typeMap: Record<string, 'primary' | 'warning' | 'success' | 'neutral'> = {
      [ProductType.STANDARD]: 'primary',
      [ProductType.PREMIUM]: 'warning',
      [ProductType.BASIC]: 'success',
      [ProductType.CUSTOM]: 'neutral',
    };
    return typeMap[type] || 'neutral';
  };

  const TABS = [
    {
      id: 'overview',
      label: 'Overview',
      content: <ProductOverviewTab product={product} />,
    },
    {
      id: 'eligibility',
      label: 'Eligibility',
      content: <ProductEligibilityTab product={product} />,
    },
    {
      id: 'fees',
      label: 'Fees & Charges',
      content: <ProductFeesTab product={product} />,
    },
    {
      id: 'features',
      label: 'Features & Benefits',
      content: <ProductFeaturesTab product={product} />,
    },
    {
      id: 'application',
      label: 'Application Process',
      content: <ProductApplicationTab product={product} />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <DollarSign className="h-4 w-4" />,
      content: <ProductAnalyticsTab product={product} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Products', href: '/products' }, { label: product.productName }]} />
        
        <Card>
          <div className="p-6 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{product.productName}</h1>
              <p className="text-neutral-500 mt-1">{product._id}</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                <Badge variant={getStatusBadge(product.status)}>
                  {product.status}
                </Badge>
                <Badge variant={getProductTypeBadge(product.productType)}>
                  {product.productType}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.status === LoanProductStatus.INACTIVE && (
                <Button variant="primary" onClick={() => handleStatusChange(LoanProductStatus.ACTIVE)}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Activate
                </Button>
              )}
              {product.status === LoanProductStatus.ACTIVE && (
                <Button variant="secondary" onClick={() => handleStatusChange(LoanProductStatus.SUSPENDED)}>
                  <XCircle className="mr-2 h-4 w-4" /> Suspend
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push(`/products/${product._id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
          
          <Tabs tabs={TABS} />
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Overview Tab
const ProductOverviewTab = ({ product }: { product: LoanProduct }) => (
  <div className="space-y-6 mt-4">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary-600" />
              Product Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <InfoItem icon={<Package />} label="Product Name" value={product.productName} />
            <InfoItem icon={<Tag />} label="Product Type" value={product.productType} />
            <InfoItem icon={<Info />} label="Description" value={product.description || 'N/A'} />
            {product.category && (
              <InfoItem 
                icon={<Building />} 
                label="Category" 
                value={
                  typeof product.category === 'object' && product.category !== null
                    ? ((product.category as any).categoryName || (product.category as any).name || 'N/A')
                    : (product.category || 'N/A')
                } 
              />
            )}
            {product.organisation && (
              <InfoItem 
                icon={<Building />} 
                label="Organisation" 
                value={
                  typeof product.organisation === 'object' && product.organisation !== null
                    ? ((product.organisation as any).organisationName || (product.organisation as any).name || 'N/A')
                    : (product.organisation || 'N/A')
                } 
              />
            )}
          </div>
        </Card>

        <Card>
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary-600" />
              Loan Details
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem 
              icon={<DollarSign />} 
              label="Loan Amount Range" 
              value={`₹${(product.minLoanAmount || 0).toLocaleString()} - ₹${(product.maxLoanAmount || 0).toLocaleString()}`} 
            />
            <InfoItem 
              icon={<TrendingUp />} 
              label="Interest Rate" 
              value={`${product.interestRate || 0}% per annum`} 
            />
            <InfoItem 
              icon={<Calendar />} 
              label="Tenure Range" 
              value={`${product.minTenureMonths || 0} - ${product.maxTenureMonths || 0} months`} 
            />
            <InfoItem 
              icon={<Clock />} 
              label="Repayment Frequency" 
              value={product.repaymentFrequency || 'N/A'} 
            />
          </div>
        </Card>

        {product.termsAndConditions && (
          <Card>
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-600" />
                Terms & Conditions
              </h2>
            </div>
            <div className="p-6">
              <p className="text-neutral-700 whitespace-pre-wrap">{product.termsAndConditions}</p>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              Quick Stats
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-neutral-600">Min Amount</span>
              <span className="font-semibold">₹{(product.minLoanAmount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Max Amount</span>
              <span className="font-semibold">₹{(product.maxLoanAmount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Interest Rate</span>
              <span className="font-semibold">{product.interestRate || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Min Tenure</span>
              <span className="font-semibold">{product.minTenureMonths || 0} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Max Tenure</span>
              <span className="font-semibold">{product.maxTenureMonths || 0} months</span>
            </div>
            {product.createdAt && (
              <div className="flex justify-between pt-4 border-t">
                <span className="text-neutral-600">Created At</span>
                <span className="font-semibold text-sm">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {product.updatedAt && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Last Updated</span>
                <span className="font-semibold text-sm">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  </div>
);

// Eligibility Tab
const ProductEligibilityTab = ({ product }: { product: LoanProduct }) => (
  <div className="p-6 space-y-6">
    <Card>
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-600" />
          Eligibility Criteria
        </h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.eligibilityCriteria?.minAge && (
          <InfoItem icon={<Users />} label="Min Age" value={product.eligibilityCriteria.minAge.toString()} />
        )}
        {product.eligibilityCriteria?.maxAge && (
          <InfoItem icon={<Users />} label="Max Age" value={product.eligibilityCriteria.maxAge.toString()} />
        )}
        {product.eligibilityCriteria?.minIncome && (
          <InfoItem icon={<DollarSign />} label="Min Income" value={`₹${product.eligibilityCriteria.minIncome.toLocaleString()}`} />
        )}
        {product.eligibilityCriteria?.creditScoreMin && (
          <InfoItem icon={<Shield />} label="Min Credit Score" value={product.eligibilityCriteria.creditScoreMin.toString()} />
        )}
      </div>
      {product.eligibilityCriteria?.employmentType && product.eligibilityCriteria.employmentType.length > 0 && (
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-3">Employment Types</h3>
          <div className="flex flex-wrap gap-2">
            {product.eligibilityCriteria.employmentType.map((type, index) => (
              <Badge key={index} variant="primary">{type}</Badge>
            ))}
          </div>
        </div>
      )}
      {product.eligibilityCriteria?.requiredDocuments && product.eligibilityCriteria.requiredDocuments.length > 0 && (
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-3">Required Documents (Eligibility)</h3>
          <ul className="list-disc list-inside space-y-1">
            {product.eligibilityCriteria.requiredDocuments.map((doc, index) => (
              <li key={index} className="text-neutral-700">{doc}</li>
            ))}
          </ul>
        </div>
      )}
      {!product.eligibilityCriteria && (
        <div className="p-6 text-center text-neutral-500">No eligibility criteria defined</div>
      )}
    </Card>
  </div>
);

// Fees Tab
const ProductFeesTab = ({ product }: { product: LoanProduct }) => (
  <div className="p-6 space-y-6">
    <Card>
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary-600" />
          Fees & Charges
        </h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {product.processingFee && (
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-semibold mb-2">Processing Fee</h3>
            <p className="text-2xl font-bold text-primary-600">
              {product.processingFee.type === 'percentage'
                ? `${product.processingFee.value}%`
                : `₹${product.processingFee.value.toLocaleString()}`}
            </p>
          </div>
        )}
        {product.prepaymentCharges && (
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-semibold mb-2">Prepayment Charges</h3>
            <p className="text-2xl font-bold text-warning-600">
              {product.prepaymentCharges.type === 'percentage'
                ? `${product.prepaymentCharges.value}%`
                : `₹${product.prepaymentCharges.value.toLocaleString()}`}
            </p>
          </div>
        )}
        {product.latePaymentCharges && (
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-semibold mb-2">Late Payment Charges</h3>
            <p className="text-2xl font-bold text-error-600">
              {product.latePaymentCharges.type === 'percentage'
                ? `${product.latePaymentCharges.value}%`
                : `₹${product.latePaymentCharges.value.toLocaleString()}`}
            </p>
          </div>
        )}
      </div>
      {!product.processingFee && !product.prepaymentCharges && !product.latePaymentCharges && (
        <div className="p-6 text-center text-neutral-500">No fees and charges defined</div>
      )}
    </Card>
  </div>
);

// Features Tab
const ProductFeaturesTab = ({ product }: { product: LoanProduct }) => (
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary-600" />
            Features
          </h2>
        </div>
        <div className="p-6">
          {product.features && product.features.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="text-neutral-700">{feature}</li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500">No features listed</p>
          )}
        </div>
      </Card>
      <Card>
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-600" />
            Benefits
          </h2>
        </div>
        <div className="p-6">
          {product.benefits && product.benefits.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {product.benefits.map((benefit, index) => (
                <li key={index} className="text-neutral-700">{benefit}</li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500">No benefits listed</p>
          )}
        </div>
      </Card>
    </div>
    {product.documentsRequired && product.documentsRequired.length > 0 && (
      <Card>
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            Documents Required
          </h2>
        </div>
        <div className="p-6">
          <ul className="list-disc list-inside space-y-2">
            {product.documentsRequired.map((doc, index) => (
              <li key={index} className="text-neutral-700">{doc}</li>
            ))}
          </ul>
        </div>
      </Card>
    )}
  </div>
);

// Application Process Tab
const ProductApplicationTab = ({ product }: { product: LoanProduct }) => (
  <div className="p-6 space-y-6">
    <Card>
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-600" />
          Application Process
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {product.applicationProcess?.estimatedTime && (
          <InfoItem 
            icon={<Clock />} 
            label="Estimated Time" 
            value={product.applicationProcess.estimatedTime} 
          />
        )}
        {product.applicationProcess?.steps && product.applicationProcess.steps.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Steps</h3>
            <ol className="list-decimal list-inside space-y-2">
              {product.applicationProcess.steps.map((step, index) => (
                <li key={index} className="text-neutral-700">{step}</li>
              ))}
            </ol>
          </div>
        )}
        {product.applicationProcess?.requiredDocuments && product.applicationProcess.requiredDocuments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Required Documents</h3>
            <ul className="list-disc list-inside space-y-2">
              {product.applicationProcess.requiredDocuments.map((doc, index) => (
                <li key={index} className="text-neutral-700">{doc}</li>
              ))}
            </ul>
          </div>
        )}
        {!product.applicationProcess && (
          <p className="text-neutral-500">No application process defined</p>
        )}
      </div>
    </Card>
    {product.promotionalOffers && product.promotionalOffers.length > 0 && (
      <Card>
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary-600" />
            Promotional Offers
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {product.promotionalOffers.map((offer, index) => (
            <div key={index} className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
              <p className="text-neutral-700 mb-2">{offer.description}</p>
              <div className="flex gap-4 text-sm text-neutral-600">
                <span>Valid From: {new Date(offer.validFrom).toLocaleDateString()}</span>
                <span>Valid To: {new Date(offer.validTo).toLocaleDateString()}</span>
              </div>
              {(offer.discountPercentage || offer.discountAmount) && (
                <div className="mt-2">
                  <Badge variant="primary">
                    {offer.discountPercentage ? `${offer.discountPercentage}% off` : `₹${offer.discountAmount} off`}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    )}
  </div>
);

// Info Item Component
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 text-neutral-500 mt-1">{icon}</div>
    <div className="flex-1">
      <div className="text-sm font-medium text-neutral-600 mb-1">{label}</div>
      <div className="text-neutral-900">{value}</div>
    </div>
  </div>
);
