'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Avatar,
  Breadcrumbs,
  Table,
  Tabs,
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
} from 'lucide-react';
import { useCustomer } from '@/hooks/useCustomer';
import { useCustomerMutations } from '@/hooks/useCustomerMutations';
import { useToast } from '@/components/ui/Toast';
import { useOrganizationSettings } from '@/hooks/useOrganizationSettings';
import SharePurchaseHistory from '@/components/customers/SharePurchaseHistory';
import { loanService } from '@/services/loans';
import { depositService } from '@/services/deposits';
import Link from 'next/link';

// NOTE: The individual tab content components (overviewContent, transactionsContent, etc.)
// will be moved into their own separate components within this file to clean up the main function.

export default function ViewCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id as string;
  const { addToast } = useToast();

  const { customer, transactions, activities, loading, error, refetch } = useCustomer(customerId);
  const { deleteCustomer, loading: isDeleting } = useCustomerMutations();
  const { isEthicalBanking } = useOrganizationSettings();
  
  const [customerLoans, setCustomerLoans] = React.useState<any[]>([]);
  const [customerDeposits, setCustomerDeposits] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    if (customerId) {
      loanService.getCustomerLoans(customerId).then(setCustomerLoans);
      depositService.getCustomerDeposits(customerId).then(setCustomerDeposits);
    }
  }, [customerId]);

  const handleDelete = async () => {
    if (!customer) return;

    if (confirm(`Are you sure you want to delete ${customer.fullName}?`)) {
      try {
        await deleteCustomer(customerId);
        addToast({
          type: 'success',
          message: `${customer.fullName} has been deleted successfully`,
        });
        router.push('/customers');
      } catch (err) {
        addToast({
          type: 'error',
          message: 'Failed to delete customer',
        });
      }
    }
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6 animate-pulse">
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
        <div className="p-6">
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
    ...(isEthicalBanking ? [{
      id: 'shares',
      label: 'Share Purchase History',
      icon: <TrendingUp className="h-4 w-4" />,
      content: <SharePurchaseHistory customerId={customerId} mode="view" />,
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
      <div className="p-6 max-w-6xl mx-auto space-y-6">
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
                <p className="text-neutral-600 mt-1">{customer.customerId} • {customer.email}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" onClick={() => router.push(`/customers/${customerId}/edit`)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </div>
          </div>
        </Card>

        {/* Top-level Tabs */}
        <Tabs tabs={TABS} defaultTab="overview" />
      </div>
    </DashboardLayout>
  );
}

// NOTE: All tab content components (CustomerOverviewTab, CustomerTransactionsTab, etc.) will be created below.
// For brevity, only the structure of CustomerOverviewTab is shown.

const CustomerOverviewTab = ({ customer }: { customer: any }) => (
  <div className="space-y-6 mt-4">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
       <Card padding="sm">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-neutral-600">Current Balance</p>
             <p className="text-2xl font-bold text-neutral-900 mt-1">
               ₹{customer.currentBalance.toLocaleString('en-IN')}
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
             <p className="text-2xl font-bold text-neutral-900 mt-1">{customer.accountType}</p>
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
             <p className="text-2xl font-bold text-neutral-900 mt-1">{customer.status}</p>
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
    {/* All other detailed info cards will go here */}
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
    <div className="p-6">
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
    <div className="p-6">
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
  <div className="p-6 space-y-6">
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
              {customer.aadhaarVerified && (
                <Badge variant="success">Verified</Badge>
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
              {customer.panVerified && (
                <Badge variant="success">Verified</Badge>
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

const CustomerLoansTab = ({ loans }: { loans: any[] }) => (
  <div className="p-6">
    {customerLoans.length === 0 ? (
      <div className="text-center py-8 text-neutral-500">
        <p>No loans found for this customer</p>
      </div>
    ) : (
      <div className="space-y-4">
        {customerLoans.map((loan) => (
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
                  <p className="font-semibold">₹{loan.loanAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-neutral-600">EMI</p>
                  <p className="font-semibold">₹{loan.emiAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Outstanding</p>
                  <p className="font-semibold">₹{loan.outstandingAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    )}
  </div>
);

const CustomerDepositsTab = ({ deposits }: { deposits: any[] }) => (
  <div className="p-6">
    {customerDeposits.length === 0 ? (
      <div className="text-center py-8 text-neutral-500">
        <p>No deposits found for this customer</p>
      </div>
    ) : (
      <div className="space-y-4">
        {customerDeposits.map((deposit) => (
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
                  <p className="text-neutral-600">Interest Rate</p>
                  <p className="font-semibold">{deposit.interestRate}%</p>
                </div>
                <div>
                  <p className="text-neutral-600">Interest Earned</p>
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
