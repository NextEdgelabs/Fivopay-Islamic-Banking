'use client';

import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Badge, Breadcrumbs, Skeleton, Tabs } from '@/components/ui';
import { Edit, Trash2, CheckCircle, XCircle, Archive, ArrowLeft, Building, Package, Tag, Info, Clock, User, GitCommit, Shield, FileText, DollarSign, BarChart2 } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct';
import { useProductMutations } from '@/hooks/useProductMutations';
import { useToast } from '@/components/ui/Toast';
import { AnyProduct, TermDepositProduct, LoanProduct } from '@/services/products';
import ProductAnalyticsTab from './components/ProductAnalyticsTab';

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { product, loading, error, refetch } = useProduct(productId);
  const { deleteProduct, updateProduct, loading: isDeleting } = useProductMutations();
  const { addToast } = useToast();

  const handleStatusChange = async (status: AnyProduct['status']) => {
    if (!product) return;
    try {
      await updateProduct(product.id, { ...product, status });
      addToast({ type: 'success', message: `Product status updated to ${status}` });
      refetch();
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to update status' });
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await deleteProduct(product.id);
        addToast({ type: 'success', message: 'Product deleted successfully' });
        router.push('/products');
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to delete product' });
      }
    }
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
            <InfoItem icon={<Tag />} label="Sub-Type" value={product.subType} />
            <InfoItem icon={<Info />} label="Description" value={product.description} />
          </div>
          
          {product.type === 'Term Deposit' && <TermDepositDetails product={product as TermDepositProduct} />}
          {product.type === 'Loan' && <LoanDetails product={product as LoanProduct} />}
          
          <AdvancedDetails product={product} />
          
          <div className="border-t bg-neutral-50 p-6 text-sm text-neutral-600 space-y-2">
             <InfoItem icon={<Clock />} label="Created At" value={new Date(product.createdAt).toLocaleString()} />
             <InfoItem icon={<Clock />} label="Last Updated" value={new Date(product.updatedAt).toLocaleString()} />
             <InfoItem icon={<User />} label="Created By" value={product.createdBy} />
             <InfoItem icon={<GitCommit />} label="Version" value={product.version.toString()} />
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
              <p className="text-neutral-500">{product.id}</p>
              <div className="mt-2">
                <Badge
                  variant={
                    product.status === 'Active' ? 'success'
                    : product.status === 'Draft' ? 'warning'
                    : product.status === 'Pending Approval' ? 'primary'
                    : product.status === 'Retired' ? 'error'
                    : 'neutral'
                  }
                >
                  {product.status}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.status === 'Pending Approval' && (
                <>
                  <Button variant="primary" onClick={() => handleStatusChange('Active')}><CheckCircle className="mr-2 h-4 w-4" /> Approve</Button>
                  <Button variant="danger" onClick={() => handleStatusChange('Draft')}><XCircle className="mr-2 h-4 w-4" /> Reject</Button>
                </>
              )}
              {product.status === 'Inactive' && (
                  <Button variant="primary" onClick={() => handleStatusChange('Retired')}><Archive className="mr-2 h-4 w-4" /> Retire</Button>
              )}
              <Button variant="outline" onClick={() => router.push(`/products/${product.id}/edit`)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </div>
          </div>
          
          <Tabs tabs={TABS} />
        </Card>
      </div>
    </DashboardLayout>
  );
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 w-40 text-neutral-600 font-medium flex items-center gap-2">{icon}{label}</div>
    <div className="flex-1 text-neutral-800">{value}</div>
  </div>
);

const TermDepositDetails = ({ product }: { product: TermDepositProduct }) => (
  <div className="border-t p-6 space-y-4">
    <h3 className="text-lg font-semibold text-neutral-800">Deposit Details</h3>
    <InfoItem icon={<Building />} label="Min Deposit" value={`₹${product.minDeposit.toLocaleString()}`} />
    <InfoItem icon={<Building />} label="Max Deposit" value={`₹${product.maxDeposit.toLocaleString()}`} />
    <InfoItem icon={<Building />} label="Compounding" value={product.compoundingFrequency} />
    <div>
        <h4 className="font-medium text-neutral-600 mb-2">Interest Rates</h4>
        <div className="pl-6">
            <ul className="list-disc space-y-1">
                {Object.entries(product.interestRates).map(([tenure, rate]) => (
                    <li key={tenure}>
                        <span className="font-semibold">{tenure} months:</span> {rate}%
                    </li>
                ))}
            </ul>
        </div>
    </div>
  </div>
);

const LoanDetails = ({ product }: { product: LoanProduct }) => (
  <div className="border-t p-6 space-y-4">
    <h3 className="text-lg font-semibold text-neutral-800">Loan Details</h3>
    <InfoItem icon={<Building />} label="Interest Rate" value={`${product.interestRate}% p.a.`} />
    <InfoItem icon={<Building />} label="Tenure" value={`${product.minTenure} - ${product.maxTenure} months`} />
    <InfoItem icon={<Building />} label="Amount Range" value={`₹${product.minAmount.toLocaleString()} - ₹${product.maxAmount.toLocaleString()}`} />
    <InfoItem icon={<Building />} label="Processing Fee" value={`${product.processingFee}%`} />
  </div>
);

const AdvancedDetails = ({ product }: { product: AnyProduct }) => (
  <>
    <div className="border-t p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2"><Shield /> Eligibility Rules</h3>
      <div className="pl-6">
        <ul className="list-disc space-y-1">
          {product.eligibilityRules.map((rule, index) => (
            <li key={index}>
              {rule.field} {rule.operator} {rule.value}
            </li>
          ))}
          {product.eligibilityRules.length === 0 && <p className="text-neutral-500">No eligibility rules defined.</p>}
        </ul>
      </div>
    </div>
    <div className="border-t p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2"><FileText /> Required Documents</h3>
      <div className="pl-6">
        <ul className="list-disc space-y-1">
          {product.requiredDocuments.map(doc => <li key={doc}>{doc}</li>)}
          {product.requiredDocuments.length === 0 && <p className="text-neutral-500">No documents required.</p>}
        </ul>
      </div>
    </div>
    <div className="border-t p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2"><DollarSign /> Fees & Charges</h3>
       <div className="pl-6">
        <ul className="list-disc space-y-1">
            {Object.entries(product.fees).map(([name, value]) => (
                <li key={name}>
                    <span className="font-semibold">{name}:</span> {value}{typeof value === 'number' && name.includes('Fee') ? '%' : ''}
                </li>
            ))}
            {Object.keys(product.fees).length === 0 && <p className="text-neutral-500">No fees defined.</p>}
        </ul>
       </div>
    </div>
  </>
);
