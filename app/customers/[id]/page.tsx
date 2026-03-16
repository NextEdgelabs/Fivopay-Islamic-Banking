'use client';

import React from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Avatar,
  Breadcrumbs,
  Table,
  Tabs,
  Modal,
} from '@/components/ui';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  CreditCard,
  FileText,
  User,
  TrendingUp,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Trash2,
  Users,
  UploadCloud,
  AlertTriangle,
} from 'lucide-react';
import { useCustomer } from '@/hooks/useCustomer';
import { useCustomerMutations } from '@/hooks/useCustomerMutations';
import { useToast } from '@/components/ui/Toast';
import { useOrganizationSettings } from '@/hooks/useOrganizationSettings';
import { useInterestProfitTerm } from '@/hooks/useInterestProfitTerm';
import SharePurchaseHistory from '@/components/customers/SharePurchaseHistory';
import { loanService } from '@/services/loans';
import { depositService } from '@/services/deposits';
import Link from 'next/link';
import { customerService, CustomerDocument } from '@/services/customers.service';
import { useProducts } from '@/hooks/useProducts';

// NOTE: The individual tab content components (overviewContent, transactionsContent, etc.)
// will be moved into their own separate components within this file to clean up the main function.

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div>
      <span className="text-sm font-medium text-neutral-600 flex items-center mb-1">{icon} {label}</span>
      <p className="text-neutral-800">{value}</p>
    </div>
  );
};

export default function ViewCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const customerId = params?.id as string;
  const tabParam = searchParams?.get('tab');
  const { addToast } = useToast();

  const { customer, transactions, activities, loading, error, refetch } = useCustomer(customerId);
  const { deleteCustomer, approveUser, loading: isDeleting } = useCustomerMutations();
  const { isEthicalBanking } = useOrganizationSettings();
  
  const [customerLoans, setCustomerLoans] = React.useState<any[]>([]);
  const [customerDeposits, setCustomerDeposits] = React.useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showApproveModal, setShowApproveModal] = React.useState(false);
  
  React.useEffect(() => {
    if (customerId) {
      loanService.getCustomerLoans(customerId).then(setCustomerLoans);
      depositService.getCustomerDeposits(customerId).then(setCustomerDeposits);
    }
  }, [customerId]);

  const handleDelete = async () => {
    if (!customer) return;

    try {
      await deleteCustomer(customerId);
      addToast({
        type: 'success',
        message: `${customer.fullName} has been deleted successfully`,
      });
      setShowDeleteModal(false);
      router.push('/customers');
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Failed to delete customer',
      });
    }
  };

  const handleApprove = async () => {
    if (!customer) return;

    try {
      await approveUser(customerId);
      addToast({
        type: 'success',
        message: `${customer.fullName} has been approved successfully`,
      });
      setShowApproveModal(false);
      refetch();
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Failed to approve user',
      });
    }
  };
  
  if (loading) {
    return (
      <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6 animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !customer) {
    return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
          <Card>
            <div className="p-12 text-center">
              <XCircle className="h-16 w-16 text-error-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Failed to Load Customer</h2>
              <p className="text-neutral-600 mb-6">{error || 'Customer not found'}</p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => router.push('/customers')}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Customers
                </Button>
                <Button variant="primary" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const TABS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <User className="h-4 w-4" />,
      content: <CustomerOverviewTab customer={customer} />,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <DollarSign className="h-4 w-4" />,
      content: <CustomerTransactionsTab transactions={transactions} />,
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: <Clock className="h-4 w-4" />,
      content: <CustomerActivityTab activities={activities} />,
    },
    {
      id: 'kyc',
      label: 'KYC Documents',
      icon: <Shield className="h-4 w-4" />,
      content: <CustomerKycTab customer={customer} />,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="h-4 w-4" />,
      content: <CustomerDocumentsTab customer={customer} loans={customerLoans} deposits={customerDeposits} onDocumentUpload={refetch} />,
    },
    ...(isEthicalBanking ? [{
      id: 'shares',
      label: 'Share Purchase History',
      icon: <TrendingUp className="h-4 w-4" />,
      content: <SharePurchaseHistory customerId={customerId} mode="edit" shareholderIdDefault={customer?.memberId || customer?.customerId} />,
    }] : []),
    {
      id: 'loans',
      label: 'Loans',
      icon: <DollarSign className="h-4 w-4" />,
      content: <CustomerLoansTab loans={customerLoans} />,
    },
    {
      id: 'deposits',
      label: 'Deposits',
      icon: <CreditCard className="h-4 w-4" />,
      content: <CustomerDepositsTab deposits={customerDeposits} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/customers' },
          { label: customer.fullName },
        ]} />
        
        {/* Standard Header Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div className="flex items-start gap-4">
              <Avatar size="lg" fallback={customer.fullName} />
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{customer.fullName}</h1>
                <p className="text-neutral-600 mt-1">{customer.memberId || customer.customerId || customer._id} • {customer.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0 mt-4 md:mt-0">
              {!customer.isApproved && (
                <Button variant="primary" onClick={() => setShowApproveModal(true)} loading={isDeleting}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Approve User
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push(`/customers/${customerId}/edit`)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)} loading={isDeleting}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </div>
          </div>
        </Card>

        {/* Top-level Tabs */}
        <Tabs tabs={TABS} defaultTab={tabParam && TABS.some(t => t.id === tabParam) ? tabParam : 'overview'} />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Customer"
          size="md"
          closeOnOverlayClick={false}
          footer={
            <>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Customer
              </Button>
            </>
          }
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-error-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Are you sure you want to delete this customer?
              </h3>
              <p className="text-neutral-600 mb-4">
                This action will permanently delete <span className="font-semibold text-neutral-900">{customer.fullName}</span> and all associated data. This action cannot be undone.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-2">Customer Details:</p>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>Name: <span className="font-medium">{customer.fullName}</span></li>
                  <li>Member ID: <span className="font-medium">{customer.memberId || customer._id || customer.id}</span></li>
                  <li>Email: <span className="font-medium">{customer.email}</span></li>
                  <li>Phone: <span className="font-medium">{customer.phone}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </Modal>

        {/* Approve Confirmation Modal */}
        <Modal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          title="Approve Customer"
          size="md"
          closeOnOverlayClick={false}
          footer={
            <>
              <Button variant="outline" onClick={() => setShowApproveModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleApprove} loading={isDeleting}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Customer
              </Button>
            </>
          }
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Approve Customer Account
              </h3>
              <p className="text-neutral-600 mb-4">
                Are you sure you want to approve <span className="font-semibold text-neutral-900">{customer.fullName}</span>? This will activate their account and grant them full access to banking services.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-2">Customer Details:</p>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>Name: <span className="font-medium">{customer.fullName}</span></li>
                  <li>Member ID: <span className="font-medium">{customer.memberId || customer._id || customer.id}</span></li>
                  <li>Email: <span className="font-medium">{customer.email}</span></li>
                  <li>KYC Status: <span className="font-medium">{customer.kycStatus}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

// NOTE: All tab content components (CustomerOverviewTab, CustomerTransactionsTab, etc.) will be created below.
// For brevity, only the structure of CustomerOverviewTab is shown.

const CustomerOverviewTab = ({ customer }: { customer: any }) => (
  <div className="space-y-6 mt-4 p-4 sm:p-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
       <Card padding="sm">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-neutral-600">Current Balance</p>
             <p className="text-2xl font-bold text-neutral-900 mt-1">
               ₹{(customer?.accountBalance || customer?.currentBalance || 0).toLocaleString('en-IN')}
             </p>
           </div>
           <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center">
             <DollarSign className="h-6 w-6 text-primary-600" />
           </div>
         </div>
       </Card>
       <Card padding="sm">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-neutral-600">Account Type</p>
             <p className="text-2xl font-bold text-neutral-900 mt-1">
               {customer.accountType || 'N/A'}
             </p>
           </div>
           <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
             <CreditCard className="h-6 w-6 text-success-600" />
           </div>
         </div>
       </Card>
       <Card padding="sm">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-neutral-600">Status</p>
             <p className="text-2xl font-bold text-neutral-900 mt-1">
               {customer.status || (customer.isActive ? 'Active' : 'Inactive')}
             </p>
           </div>
           <div className="w-12 h-12 bg-warning-100 rounded-stripe flex items-center justify-center">
             <CheckCircle className="h-6 w-6 text-warning-600" />
           </div>
         </div>
       </Card>
       <Card padding="sm">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-neutral-600">KYC Status</p>
             <p className="text-2xl font-bold text-neutral-900 mt-1">{customer.kycStatus}</p>
           </div>
           <div className="w-12 h-12 bg-error-100 rounded-stripe flex items-center justify-center">
             <Shield className="h-6 w-6 text-error-600" />
           </div>
         </div>
       </Card>
    </div>

    {/* Shareholder Information Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
       <Card padding="sm">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-neutral-600">Total Shares Purchased</p>
             <p className="text-2xl font-bold text-neutral-900 mt-1">
               {customer?.totalSharesPurchased?.toLocaleString('en-IN') || '0'}
             </p>
           </div>
           <div className="w-12 h-12 bg-info-100 rounded-stripe flex items-center justify-center">
             <TrendingUp className="h-6 w-6 text-info-600" />
           </div>
         </div>
       </Card>
       <Card padding="sm">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-neutral-600">Is Shareholder</p>
             <p className="text-2xl font-bold text-neutral-900 mt-1">
               {customer?.isShareHolder ? (
                 <Badge variant="success">Yes</Badge>
               ) : (
                 <Badge variant="neutral">No</Badge>
               )}
             </p>
           </div>
           <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
             <Users className="h-6 w-6 text-success-600" />
           </div>
         </div>
       </Card>
       <Card padding="sm">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-neutral-600">Approval Status</p>
             <p className="text-2xl font-bold text-neutral-900 mt-1">
               {customer?.isApproved ? (
                 <Badge variant="success">Approved</Badge>
               ) : (
                 <Badge variant="warning">Pending</Badge>
               )}
             </p>
           </div>
           <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center">
             <CheckCircle className="h-6 w-6 text-primary-600" />
           </div>
         </div>
       </Card>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h2 className="text-xl font-semibold p-6 border-b">Personal Information</h2>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<User className="h-4 w-4 mr-2" />} label="Gender" value={customer.gender} />
          <InfoItem 
            icon={<Calendar className="h-4 w-4 mr-2" />} 
            label="Date of Birth" 
            value={
              customer.dateOfBirth 
                ? typeof customer.dateOfBirth === 'string' 
                  ? new Date(customer.dateOfBirth).toLocaleDateString('en-IN')
                  : customer.dateOfBirth instanceof Date
                  ? customer.dateOfBirth.toLocaleDateString('en-IN')
                  : String(customer.dateOfBirth)
                : null
            }
          />
          <InfoItem icon={<Briefcase className="h-4 w-4 mr-2" />} label="Occupation" value={customer.occupation} />
          <InfoItem icon={<TrendingUp className="h-4 w-4 mr-2" />} label="Annual Income" value={
            customer.annualIncome 
              ? `₹${customer.annualIncome.toLocaleString('en-IN')}`
              : null
          } />
          <InfoItem icon={<User className="h-4 w-4 mr-2" />} label="Father's Name" value={customer.fatherName} />
          <InfoItem icon={<User className="h-4 w-4 mr-2" />} label="Mother's Name" value={customer.motherName} />
          <InfoItem icon={<User className="h-4 w-4 mr-2" />} label="Marital Status" value={customer.maritalStatus} />
        </div>
      </Card>
      
      <Card>
        <h2 className="text-xl font-semibold p-6 border-b">Address & Contact</h2>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem 
            icon={<MapPin className="h-4 w-4 mr-2" />} 
            label="Address" 
            value={
              customer.addressLine1 
                ? `${customer.addressLine1}${customer.addressLine2 ? ', ' + customer.addressLine2 : ''}${customer.city ? ', ' + customer.city : ''}${customer.state ? ', ' + customer.state : ''}${customer.postalCode ? ' - ' + customer.postalCode : ''}${customer.country && !customer.addressLine1.includes(customer.country) ? ', ' + customer.country : ''}`
                : 'N/A'
            }
          />
          <InfoItem icon={<Phone className="h-4 w-4 mr-2" />} label="Phone" value={customer.phone} />
          <InfoItem icon={<Phone className="h-4 w-4 mr-2" />} label="Alternate Phone (Optional)" value={customer.alternatePhone} />
          <InfoItem icon={<Mail className="h-4 w-4 mr-2" />} label="Email" value={customer.email} />
          <InfoItem icon={<MapPin className="h-4 w-4 mr-2" />} label="Country" value={customer.country} />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold p-6 border-b">Account Details</h2>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<User className="h-4 w-4 mr-2" />} label="Member ID" value={customer.memberId || customer._id || customer.id} />
          <InfoItem icon={<CreditCard className="h-4 w-4 mr-2" />} label="Account Number" value={customer.accountNumber} />
          <InfoItem icon={<Briefcase className="h-4 w-4 mr-2" />} label="Branch" value={customer.branch} />
          <InfoItem icon={<Calendar className="h-4 w-4 mr-2" />} label="Joined Date" value={
            customer.joinedDate 
              ? new Date(customer.joinedDate).toLocaleDateString('en-IN')
              : customer.createdAt 
              ? new Date(customer.createdAt).toLocaleDateString('en-IN')
              : 'N/A'
          } />
        </div>
      </Card>

      {customer.nomineeName && (
        <Card>
          <h2 className="text-xl font-semibold p-6 border-b">Nominee Information</h2>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<User className="h-4 w-4 mr-2" />} label="Nominee Name" value={customer.nomineeName} />
            <InfoItem icon={<Users className="h-4 w-4 mr-2" />} label="Relation" value={customer.nomineeRelation} />
            <InfoItem icon={<Phone className="h-4 w-4 mr-2" />} label="Nominee Phone" value={customer.nomineePhone} />
            <InfoItem 
              icon={<MapPin className="h-4 w-4 mr-2" />} 
              label="Nominee Address" 
              value={customer.nomineeAddress} 
            />
          </div>
        </Card>
      )}
    </div>
  </div>
);

const CustomerTransactionsTab = ({ transactions }: { transactions: any[] }) => {
  const transactionColumns = [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
    },
    {
      key: 'description',
      header: 'Description',
    },
    {
      key: 'type',
      header: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'Credit' ? 'success' : 'error'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value: number) => (
        <span className={`font-semibold ${value > 0 ? 'text-success-600' : 'text-error-600'}`}>
          {value > 0 ? '+' : ''}₹{Math.abs(value).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'balanceAfter',
      header: 'Balance',
      render: (value: number) => (
        <span className="font-semibold text-neutral-900">
          ₹{value.toLocaleString('en-IN')}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <Table data={transactions} columns={transactionColumns} />
        </div>
      ) : (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">No transactions found</p>
        </div>
      )}
    </div>
  );
};

const CustomerActivityTab = ({ activities }: { activities: any[] }) => {
  return (
    <div className="p-4 sm:p-6">
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 pb-4 border-b border-neutral-200 last:border-0">
              <div className="flex-shrink-0">
                {activity.type === 'account_created' && (
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                )}
                {activity.type === 'kyc_verified' && (
                  <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                  </div>
                )}
                {activity.type === 'profile_updated' && (
                  <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                    <Edit className="h-5 w-5 text-warning-600" />
                  </div>
                )}
                {activity.type === 'transaction' && (
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                  </div>
                )}
                {activity.type === 'document_uploaded' && (
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-neutral-600" />
                  </div>
                )}
                {activity.type === 'status_changed' && (
                  <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-error-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-900">{activity.title}</h4>
                <p className="text-sm text-neutral-600">{activity.description}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(activity.date).toLocaleString('en-IN')}
                  {activity.user && ` • ${activity.user}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">No activity found</p>
        </div>
      )}
    </div>
  );
};

const CustomerKycTab = ({ customer }: { customer: any }) => (
  <div className="p-4 sm:p-6 space-y-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">KYC Verification Status</h3>
        <p className="text-sm text-neutral-600">
          Status:{' '}
          <Badge
            variant={
              customer.kycStatus === 'Verified'
                ? 'success'
                : customer.kycStatus === 'Rejected'
                ? 'error'
                : customer.kycStatus === 'In Progress'
                ? 'warning'
                : 'neutral'
            }
          >
            {customer.kycStatus}
          </Badge>
        </p>
      </div>
      {customer.kycVerifiedDate && (
        <div className="text-right">
          <p className="text-sm text-neutral-500">Verified on</p>
          <p className="font-medium text-neutral-900">{customer.kycVerifiedDate}</p>
          {customer.kycVerifiedBy && (
            <p className="text-xs text-neutral-500">{customer.kycVerifiedBy}</p>
          )}
        </div>
      )}
    </div>

    {customer.kycNotes && (
      <Card className="bg-neutral-50">
        <div className="flex items-start gap-2">
          <FileText className="h-5 w-5 text-neutral-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-neutral-900">Notes</p>
            <p className="text-sm text-neutral-600">{customer.kycNotes}</p>
          </div>
        </div>
      </Card>
    )}

    <div className="space-y-4">
      {/* Aadhaar */}
      {customer.aadhaarNumber && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">Aadhaar Card</p>
                <p className="text-sm text-neutral-600">{customer.aadhaarNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {customer.aadharVerificationStatus === true && (
                <Badge variant="success">Verified</Badge>
              )}
              {customer.aadharVerificationStatus === false && (
                <Badge variant="warning">Pending Verification</Badge>
              )}
              {customer.aadhaarFrontImage && (
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* PAN */}
      {customer.panNumber && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">PAN Card</p>
                <p className="text-sm text-neutral-600">{customer.panNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {customer.panVerificationStatus && (
                <Badge variant="success">Verified</Badge>
              )}
              {customer.panVerificationStatus === false && (
                <Badge variant="warning">Pending</Badge>
              )}
              {customer.panImage && (
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Passport */}
      {customer.passportNumber && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">Passport</p>
                <p className="text-sm text-neutral-600">{customer.passportNumber}</p>
              </div>
            </div>
            {customer.passportImage && (
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Driving License */}
      {customer.drivingLicenseNumber && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">Driving License</p>
                <p className="text-sm text-neutral-600">{customer.drivingLicenseNumber}</p>
              </div>
            </div>
            {customer.drivingLicenseImage && (
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Voter ID */}
      {customer.voterIdNumber && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">Voter ID</p>
                <p className="text-sm text-neutral-600">{customer.voterIdNumber}</p>
              </div>
            </div>
            {customer.voterIdImage && (
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Address Proof */}
      {customer.addressProofType && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">Address Proof</p>
                <p className="text-sm text-neutral-600">
                  {customer.addressProofType}
                  {customer.addressProofNumber && ` - ${customer.addressProofNumber}`}
                </p>
              </div>
            </div>
            {customer.addressProofImage && (
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  </div>
);

const CustomerDocumentsTab = ({ customer, loans, deposits, onDocumentUpload }: { customer: any, loans: any[], deposits: any[], onDocumentUpload: () => void }) => {
  const { products: loanProducts } = useProducts({ productType: 'Loan' });
  const { products: depositProducts } = useProducts({ productType: 'Term Deposit' });
  const { addToast } = useToast();
  const [uploading, setUploading] = React.useState<string | null>(null);

  const requiredDocs = React.useMemo(() => {
    const docs = new Set<string>();
    
    loans.forEach((loan:any) => {
      const product = loanProducts.find((p:any) => p.subType === loan.loanType);
      product?.documentsRequired?.forEach((doc:any) => docs.add(doc));
    });
    
    deposits.forEach((deposit:any) => {
      const product = depositProducts.find((p:any) => p.subType === deposit.depositType);
      product?.documentsRequired?.forEach((doc:any) => docs.add(doc));
    });

    return Array.from(docs);
  }, [loans, deposits, loanProducts, depositProducts]);

  const allDocumentItems = React.useMemo(() => {
    const items: (CustomerDocument & { isRequired: boolean })[] = [];
    // Safety check: ensure documents is an array
    const documents = customer?.documents || [];
    const customerDocsMap = new Map(documents.map((d: CustomerDocument) => [d.type, d]));

    requiredDocs.forEach(docType => {
      const existingDoc = customerDocsMap.get(docType);
      if (existingDoc) {
        items.push({ ...existingDoc, isRequired: true } as CustomerDocument & { isRequired: boolean });
        customerDocsMap.delete(docType);
      } else {
        items.push({ id: `missing-${docType}`, type: docType, status: 'Missing', isRequired: true });
      }
    });

    customerDocsMap.forEach(doc => {
      if (doc && (doc as any).id && (doc as any).type && (doc as any).status) {
        items.push({ ...doc, isRequired: false } as CustomerDocument & { isRequired: boolean });
      }
    });

    return items;
  }, [requiredDocs, customer?.documents]);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(docType);
    try {
      await customerService.uploadCustomerDocument(customer.id, docType, file);
      addToast({ type: 'success', message: `${docType} uploaded successfully.` });
      onDocumentUpload();
    } catch (error) {
      addToast({ type: 'error', message: `Failed to upload ${docType}.` });
    } finally {
      setUploading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified': return <Badge variant="success">{status}</Badge>;
      case 'Uploaded': return <Badge variant="primary">{status}</Badge>;
      case 'Rejected': return <Badge variant="error">{status}</Badge>;
      case 'Missing': return <Badge variant="neutral">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <div className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold">Document Center</h2>
        <p className="text-neutral-600 mt-1">Manage and verify customer documents.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Document Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">File</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {allDocumentItems.map(doc => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                  {doc.type} {doc.isRequired && <span className="text-error-500">*</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(doc.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{doc.fileName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {doc.status === 'Missing' || doc.status === 'Rejected' ? (
                     <Button variant="outline" size="sm" loading={uploading === doc.type}>
                       <UploadCloud className="mr-2 h-4 w-4" />
                       Upload
                       <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.type)} />
                     </Button>
                  ) : (
                    <Button variant="ghost" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Card>
    </div>
  );
};

const CustomerLoansTab = ({ loans }: { loans: any[] }) => (
  <div className="p-4 sm:p-6">
    {loans.length === 0 ? (
      <div className="text-center py-8 text-neutral-500">
        <p>No loans found for this customer</p>
      </div>
    ) : (
      <div className="space-y-4">
        {loans.map((loan: any) => (
          <Link key={loan.id} href={`/loans/${loan.id}`}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-neutral-900">{loan.loanId}</h3>
                  <p className="text-sm text-neutral-600">{loan.loanType}</p>
                </div>
                <Badge variant={loan.status === 'Active' ? 'success' : 'neutral'}>{loan.status}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-neutral-600">Amount</p>
                  <p className="font-semibold">₹{(loan.loanAmount || loan.amount || 0).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-neutral-600">EMI</p>
                  <p className="font-semibold">₹{(loan.emiAmount || 0).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Outstanding</p>
                  <p className="font-semibold">₹{(loan.outstandingAmount || loan.amount || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    )}
  </div>
);

const CustomerDepositsTab = ({ deposits }: { deposits: any[] }) => {
  const { rateLabel, earnedLabel } = useInterestProfitTerm();
  return (
    <div className="p-4 sm:p-6">
      {deposits.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <p>No deposits found for this customer</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deposits.map((deposit: any) => (
            <Link key={deposit.id} href={`/deposits/${deposit.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-neutral-900">{deposit.depositId}</h3>
                    <p className="text-sm text-neutral-600">{deposit.depositType}</p>
                  </div>
                  <Badge variant={deposit.status === 'Active' ? 'success' : 'neutral'}>{deposit.status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-600">Balance</p>
                    <p className="font-semibold">₹{deposit.currentBalance.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">{rateLabel}</p>
                    <p className="font-semibold">{deposit.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">{earnedLabel}</p>
                    <p className="font-semibold">₹{deposit.interestEarned.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
