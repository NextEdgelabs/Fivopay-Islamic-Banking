'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Badge, Breadcrumbs, Skeleton, Tabs, Modal } from '@/components/ui';
import { Edit, Trash2, CheckCircle, XCircle, Archive, ArrowLeft, Building, Package, Tag, Info, Clock, User, GitCommit, Shield, FileText, DollarSign, BarChart2 } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct';
import { useProductMutations } from '@/hooks/useProductMutations';
import { useToast } from '@/components/ui/Toast';
import { LoanProductData, ProductType, ProductStatus } from '@/services/products.service';
import ProductAnalyticsTab from './analytics/page';

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { product, loading, error, refetch } = useProduct(productId);
  const { deleteProduct, updateProduct, loading: isDeleting } = useProductMutations();
  const { addToast } = useToast();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStatusChange = async (status: ProductStatus) => {
    if (!product) return;
    try {
      await updateProduct({ 
        _id: product._id!, 
        ...product, 
        status 
      });
      addToast({ type: 'success', message: `Product status updated to ${status}` });
      refetch();
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to update status' });
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!product) return;
    
    try {
      await deleteProduct(product._id!);
      addToast({ type: 'success', message: 'Product deleted successfully' });
      router.push('/products');
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to delete product' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };
  
  if (loading) return <DashboardLayout><Skeleton className="h-screen w-full" /></DashboardLayout>;
  if (error || !product) return <DashboardLayout><div className="p-6 text-error-500">{error || 'Product not found'}</div></DashboardLayout>;

  const TABS = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <>
          <div className="border-t p-6 space-y-4">
            <InfoItem icon={<Package />} label="Product Type" value={product.type} />
            <InfoItem icon={<Tag />} label="Sub-Type" value={
              product.type === ProductType.TERM_DEPOSIT && product.termDeposit 
                ? product.termDeposit.subType 
                : 'N/A'
            } />
            <InfoItem icon={<Info />} label="Description" value={product.description} />
          </div>
          
          {product.type === ProductType.TERM_DEPOSIT && <TermDepositDetails product={product} />}
          
          <AdvancedDetails product={product} />
          
          <div className="border-t bg-neutral-50 p-6 text-sm text-neutral-600 space-y-2">
             <InfoItem icon={<Clock />} label="Created At" value={product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'} />
             <InfoItem icon={<Clock />} label="Last Updated" value={product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'} />
             <InfoItem icon={<User />} label="Created By" value={product.createdBy} />
             <InfoItem icon={<GitCommit />} label="Version" value={product.version?.toString() || '1'} />
          </div>
        </>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 className="h-4 w-4" />,
      content: <ProductAnalyticsTab product={product} />
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Products', href: '/products' }, { label: product.name }]} />
        
        <Card>
          <div className="p-6 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-neutral-500">{product._id}</p>
              <div className="mt-2">
                <Badge
                  variant={
                    product.status === ProductStatus.ACTIVE ? 'success'
                    : product.status === ProductStatus.DRAFT ? 'warning'
                    : product.status === ProductStatus.PENDING_APPROVAL ? 'primary'
                    : product.status === ProductStatus.RETIRED ? 'error'
                    : 'neutral'
                  }
                >
                  {product.status}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.status === ProductStatus.PENDING_APPROVAL && (
                <>
                  <Button variant="primary" onClick={() => handleStatusChange(ProductStatus.ACTIVE)}><CheckCircle className="mr-2 h-4 w-4" /> Approve</Button>
                  <Button variant="danger" onClick={() => handleStatusChange(ProductStatus.DRAFT)}><XCircle className="mr-2 h-4 w-4" /> Reject</Button>
                </>
              )}
              {product.status === ProductStatus.INACTIVE && (
                  <Button variant="outline" onClick={() => handleStatusChange(ProductStatus.RETIRED)}><Archive className="mr-2 h-4 w-4" /> Retire</Button>
              )}
              <Button variant="outline" onClick={() => router.push(`/products/${product._id}/edit`)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </div>
          </div>
          
          <Tabs tabs={TABS} />
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
                Delete {product?.name}?
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

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 w-40 text-neutral-600 font-medium flex items-center gap-2">{icon}{label}</div>
    <div className="flex-1 text-neutral-800">{value}</div>
  </div>
);

const TermDepositDetails = ({ product }: { product: LoanProductData }) => {
  if (!product.termDeposit) return null;
  
  return (
    <div className="border-t p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800">Deposit Details</h3>
      <InfoItem icon={<Building />} label="Min Deposit" value={`₹${product.termDeposit.minDeposit.toLocaleString()}`} />
      <InfoItem icon={<Building />} label="Max Deposit" value={`₹${product.termDeposit.maxDeposit.toLocaleString()}`} />
      <InfoItem icon={<Building />} label="Compounding" value={product.termDeposit.compoundingFrequency} />
      <div>
          <h4 className="font-medium text-neutral-600 mb-2">Interest Rates</h4>
          <div className="pl-6">
              <ul className="list-disc space-y-1">
                  {Object.entries(product.termDeposit.interestRates).map(([tenure, rate]) => (
                      <li key={tenure}>
                          <span className="font-semibold">{tenure} months:</span> {rate}%
                      </li>
                  ))}
              </ul>
          </div>
      </div>
    </div>
  );
};


const AdvancedDetails = ({ product }: { product: LoanProductData }) => (
  <>
    <div className="border-t p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2"><Shield /> Eligibility Rules</h3>
      <div className="pl-6">
        <ul className="list-disc space-y-1">
          {product.eligibilityRules?.map((rule, index) => (
            <li key={index}>
              {rule.field} {rule.operator} {rule.value}
            </li>
          ))}
          {(!product.eligibilityRules || product.eligibilityRules.length === 0) && <p className="text-neutral-500">No eligibility rules defined.</p>}
        </ul>
      </div>
    </div>
    <div className="border-t p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2"><FileText /> Required Documents</h3>
      <div className="pl-6">
        <ul className="list-disc space-y-1">
          {product.requiredDocuments?.map(doc => <li key={doc}>{doc}</li>)}
          {(!product.requiredDocuments || product.requiredDocuments.length === 0) && <p className="text-neutral-500">No documents required.</p>}
        </ul>
      </div>
    </div>
    <div className="border-t p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2"><DollarSign /> Fees & Charges</h3>
       <div className="pl-6">
        <ul className="list-disc space-y-1">
            {product.fees && Object.entries(product.fees).map(([name, value]) => (
                <li key={name}>
                    <span className="font-semibold">{name}:</span> {value}{typeof value === 'number' && name.includes('Fee') ? '%' : ''}
                </li>
            ))}
            {(!product.fees || Object.keys(product.fees).length === 0) && <p className="text-neutral-500">No fees defined.</p>}
        </ul>
       </div>
    </div>
  </>
);
