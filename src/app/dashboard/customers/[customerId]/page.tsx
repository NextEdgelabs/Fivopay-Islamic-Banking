'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCustomers } from '../context/CustomerContext';
import { Customer, CustomerStatus, RiskRating, CustomerLoan, CustomerDeposit, CustomerActivity, CustomerKYCDetailed, CustomerAddress } from '@/types/customer';
import { CustomerService } from '@/services/customer.service';
import { 
  ArrowLeftIcon,
  PencilIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowPathIcon,
  HomeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import InfoBlock, { InfoRow } from '../components/InfoBlock';
import KYCSection from '../components/KYCSection';
import LoanCard from '../components/LoanCard';
import LoanDetailsModal from '../components/LoanDetailsModal';
import DepositCard from '../components/DepositCard';
import TimelineItem from '../components/TimelineItem';

// Loading skeleton
const CustomerDetailSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="card">
      <div className="card-content">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-stripe-background rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-stripe-background rounded w-1/3"></div>
            <div className="h-4 bg-stripe-background rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card">
          <div className="card-content">
            <div className="h-4 bg-stripe-background rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-stripe-background rounded w-full"></div>
              <div className="h-3 bg-stripe-background rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Status badge component
const StatusBadge = ({ status }: { status: CustomerStatus }) => {
  const getStatusConfig = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.ACTIVE:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: CheckCircleIcon
        };
      case CustomerStatus.INACTIVE:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: ClockIcon
        };
      case CustomerStatus.DORMANT:
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          icon: ClockIcon
        };
      case CustomerStatus.CLOSED:
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: ExclamationTriangleIcon
        };
      case CustomerStatus.BLOCKED:
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: ExclamationTriangleIcon
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: ClockIcon
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

// Risk rating badge component
const RiskRatingBadge = ({ riskRating }: { riskRating: RiskRating }) => {
  const getRiskConfig = (riskRating: RiskRating) => {
    switch (riskRating) {
      case RiskRating.LOW:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: CheckCircleIcon
        };
      case RiskRating.MEDIUM:
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: ExclamationTriangleIcon
        };
      case RiskRating.HIGH:
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: ExclamationTriangleIcon
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: ClockIcon
        };
    }
  };

  const config = getRiskConfig(riskRating);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3 mr-1" />
      {riskRating} Risk
    </span>
  );
};

// Info card component
const InfoCard = ({ 
  title, 
  children, 
  icon: Icon,
  className = ""
}: { 
  title: string; 
  children: React.ReactNode; 
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) => (
  <div className={`card ${className}`}>
    <div className="card-content">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="w-5 h-5 text-stripe-text-secondary mr-2" />}
        <h3 className="text-lg font-semibold text-stripe-text">{title}</h3>
      </div>
      {children}
    </div>
  </div>
);

// Detail row component
const DetailRow = ({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: string | React.ReactNode; 
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="flex items-center justify-between py-2 border-b border-stripe-border last:border-b-0">
    <div className="flex items-center">
      {Icon && <Icon className="w-4 h-4 text-stripe-text-muted mr-2" />}
      <span className="text-sm font-medium text-stripe-text-secondary">{label}</span>
    </div>
    <div className="text-sm text-stripe-text">{value}</div>
  </div>
);

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchCustomerById, loading, errors } = useCustomers();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [kycDetails, setKycDetails] = useState<CustomerKYCDetailed | null>(null);
  const [loans, setLoans] = useState<CustomerLoan[]>([]);
  const [deposits, setDeposits] = useState<CustomerDeposit[]>([]);
  const [activities, setActivities] = useState<CustomerActivity[]>([]);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dataLoading, setDataLoading] = useState({
    customer: true,
    kyc: true,
    loans: true,
    deposits: true,
    activities: true,
    addresses: true
  });
  const [selectedLoan, setSelectedLoan] = useState<CustomerLoan | null>(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<string>('all');
  const [timelineSearch, setTimelineSearch] = useState('');

  const customerId = params.customerId as string;

  useEffect(() => {
    const loadCustomerData = async () => {
      if (customerId) {
        console.log('📄 DetailPage: Loading customer with ID:', customerId);
        setIsLoading(true);
        
        try {
          // Load all data in parallel
          const [
            customerRes,
            kycRes,
            loansRes,
            depositsRes,
            activitiesRes,
            addressesRes
          ] = await Promise.allSettled([
            fetchCustomerById(customerId),
            CustomerService.getCustomerKYCDetails(customerId),
            CustomerService.getCustomerLoans(customerId),
            CustomerService.getCustomerDeposits(customerId),
            CustomerService.getCustomerActivities(customerId),
            CustomerService.getCustomerAddresses(customerId)
          ]);

          // Handle customer data
          if (customerRes.status === 'fulfilled' && customerRes.value) {
            console.log('✅ DetailPage: Customer data loaded');
            setCustomer(customerRes.value);
            setDataLoading(prev => ({ ...prev, customer: false }));
          } else {
            console.error('❌ DetailPage: Failed to load customer data');
          }

          // Handle KYC data
          if (kycRes.status === 'fulfilled' && kycRes.value.success) {
            console.log('✅ DetailPage: KYC data loaded');
            setKycDetails(kycRes.value.data!);
            setDataLoading(prev => ({ ...prev, kyc: false }));
          }

          // Handle loans data
          if (loansRes.status === 'fulfilled' && loansRes.value.success) {
            console.log('✅ DetailPage: Loans data loaded');
            setLoans(loansRes.value.data || []);
            setDataLoading(prev => ({ ...prev, loans: false }));
          }

          // Handle deposits data
          if (depositsRes.status === 'fulfilled' && depositsRes.value.success) {
            console.log('✅ DetailPage: Deposits data loaded');
            setDeposits(depositsRes.value.data || []);
            setDataLoading(prev => ({ ...prev, deposits: false }));
          }

          // Handle activities data
          if (activitiesRes.status === 'fulfilled' && activitiesRes.value.success) {
            console.log('✅ DetailPage: Activities data loaded');
            setActivities(activitiesRes.value.data || []);
            setDataLoading(prev => ({ ...prev, activities: false }));
          }

          // Handle addresses data
          if (addressesRes.status === 'fulfilled' && addressesRes.value.success) {
            console.log('✅ DetailPage: Addresses data loaded');
            setAddresses(addressesRes.value.data || []);
            setDataLoading(prev => ({ ...prev, addresses: false }));
          }

        } catch (error) {
          console.error('❌ DetailPage: Error loading customer data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCustomerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  // Loan handlers
  const handleViewBasicLoan = (loan: CustomerLoan) => {
    setSelectedLoan(loan);
    setShowLoanModal(true);
  };

  const handleViewFullLoan = (loan: CustomerLoan) => {
    // Navigate to loans page with loan filter
    router.push(`/dashboard/loans?loanId=${loan.loanId}`);
  };

  const handleCloseLoanModal = () => {
    setShowLoanModal(false);
    setSelectedLoan(null);
  };

  // Deposit handlers
  const handleViewCertificate = (deposit: CustomerDeposit) => {
    console.log('View certificate for deposit:', deposit.depositId);
    // TODO: Implement certificate viewing
  };

  const handlePrematureClosure = (deposit: CustomerDeposit) => {
    console.log('Premature closure for deposit:', deposit.depositId);
    // TODO: Implement premature closure
  };

  const handleRenewDeposit = (deposit: CustomerDeposit) => {
    console.log('Renew deposit:', deposit.depositId);
    // TODO: Implement deposit renewal
  };

  // Timeline filtering
  const filteredActivities = activities.filter(activity => {
    const matchesFilter = timelineFilter === 'all' || activity.activityType.toLowerCase() === timelineFilter;
    const matchesSearch = !timelineSearch || 
      activity.title.toLowerCase().includes(timelineSearch.toLowerCase()) ||
      activity.description.toLowerCase().includes(timelineSearch.toLowerCase()) ||
      activity.performedBy.toLowerCase().includes(timelineSearch.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return <CustomerDetailSkeleton />;
  }

  if (errors.customers) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="card-content text-center py-12">
            <ExclamationTriangleIcon className="w-12 h-12 text-stripe-error mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stripe-text mb-2">Error Loading Customer</h3>
            <p className="text-stripe-text-secondary mb-4">{errors.customers}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="card-content text-center py-12">
            <UserCircleIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stripe-text mb-2">Customer Not Found</h3>
            <p className="text-stripe-text-secondary mb-4">The customer you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/dashboard/customers')}
              className="btn btn-primary"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Customers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserCircleIcon },
    { id: 'kyc', name: 'KYC Details', icon: ShieldCheckIcon },
    { id: 'loans', name: 'Loans', icon: BanknotesIcon },
    { id: 'deposits', name: 'Term Deposits', icon: CurrencyDollarIcon },
    { id: 'timeline', name: 'Timeline', icon: ClockIcon },
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
    { id: 'accounts', name: 'Accounts', icon: BanknotesIcon },
    { id: 'addresses', name: 'Addresses', icon: MapPinIcon },
    { id: 'nominees', name: 'Nominees', icon: UserGroupIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/customers')}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-stripe-text">Customer Details</h1>
            <p className="text-stripe-text-secondary">View and manage customer information</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push(`/dashboard/customers/${customerId}/edit`)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Edit Customer</span>
          </button>
        </div>
      </div>

      {/* Customer Header Card */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xl">
                {(customer.firstName?.charAt(0) || 'U').toUpperCase()}{(customer.lastName?.charAt(0) || 'U').toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h2 className="text-2xl font-semibold text-stripe-text">
                  {customer.fullName || `${customer.title || ''} ${customer.firstName || 'Unknown'} ${customer.middleName || ''} ${customer.lastName || 'Customer'}`.trim()}
                </h2>
                <StatusBadge status={customer.status} />
                <RiskRatingBadge riskRating={customer.riskRating} />
              </div>
              <div className="flex items-center space-x-6 text-sm text-stripe-text-secondary">
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-1" />
                  {customer.primaryMobile || 'Not provided'}
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 mr-1" />
                  {customer.primaryEmail || 'Not provided'}
                </div>
                <div className="flex items-center">
                  <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                  {customer.customerType || 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-stripe-border">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-stripe-primary text-stripe-primary'
                      : 'border-transparent text-stripe-text-secondary hover:text-stripe-text hover:border-stripe-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Block */}
              <InfoBlock title="Personal Information" icon={UserCircleIcon}>
                <InfoRow label="Customer Type" value={customer.customerType || 'Not specified'} />
                <InfoRow label="Title" value={customer.title || 'Not specified'} />
                <InfoRow label="Full Name" value={`${customer.title || ''} ${customer.firstName || ''} ${customer.middleName || ''} ${customer.lastName || ''}`.trim() || 'Not provided'} />
                <InfoRow label="Father's Name" value={customer.fatherName || 'Not provided'} />
                <InfoRow label="Mother's Name" value={customer.motherName || 'Not provided'} />
                <InfoRow label="Spouse Name" value={customer.spouseName || 'Not applicable'} />
                <InfoRow label="Date of Birth" value={customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : 'Not provided'} icon={CalendarIcon} />
                <InfoRow label="Gender" value={customer.gender || 'Not specified'} />
                <InfoRow label="Marital Status" value={customer.maritalStatus || 'Not specified'} />
                <InfoRow label="Nationality" value={customer.nationality || 'Not specified'} />
              </InfoBlock>

              {/* Contact Information Block */}
              <InfoBlock title="Contact Information" icon={PhoneIcon}>
                <InfoRow label="Primary Mobile" value={customer.primaryMobile || 'Not provided'} icon={PhoneIcon} />
                <InfoRow label="Secondary Mobile" value={customer.secondaryMobile || 'Not provided'} />
                <InfoRow label="Primary Email" value={customer.primaryEmail || 'Not provided'} icon={EnvelopeIcon} />
                <InfoRow label="Secondary Email" value={customer.secondaryEmail || 'Not provided'} />
                <InfoRow label="Preferred Language" value={customer.preferredLanguage || 'Not specified'} />
              </InfoBlock>

              {/* Address Information Block */}
              <InfoBlock title="Address Information" icon={HomeIcon}>
                {addresses.length > 0 ? (
                  addresses.map((address, index) => (
                    <div key={address.addressId} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-stripe-text">{address.addressType} Address</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          address.verificationStatus === 'Verified' 
                            ? 'bg-green-100 text-green-800' 
                            : address.verificationStatus === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {address.verificationStatus}
                        </span>
                      </div>
                      <div className="text-sm text-stripe-text-secondary space-y-1">
                        <div>{address.addressLine1}</div>
                        {address.addressLine2 && <div>{address.addressLine2}</div>}
                        <div>{address.city}, {address.state} - {address.pincode}</div>
                        <div>{address.country}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-stripe-text-muted">No addresses found</div>
                )}
              </InfoBlock>

              {/* Professional Information Block */}
              <InfoBlock title="Professional Information" icon={BriefcaseIcon}>
                <InfoRow label="Occupation" value={customer.occupation || 'Not specified'} />
                <InfoRow label="Annual Income" value={customer.annualIncome ? `₹${customer.annualIncome.toLocaleString()}` : 'Not specified'} icon={CurrencyDollarIcon} />
                <InfoRow label="Income Source" value={customer.incomeSource || 'Not specified'} />
                <InfoRow label="Customer Segment" value={customer.customerSegment || 'Not specified'} />
                <InfoRow label="Customer Category" value={customer.customerCategory || 'Not specified'} />
              </InfoBlock>

              {/* Account Information Block */}
              <InfoBlock title="Account Information" icon={ShieldCheckIcon}>
                <InfoRow label="Customer ID" value={customer.customerId || 'Not provided'} />
                <InfoRow label="Customer Type" value={customer.customerType || 'Not specified'} />
                <InfoRow label="Risk Rating" value={<RiskRatingBadge riskRating={customer.riskRating} />} />
                <InfoRow label="PEP Status" value={customer.pepStatus ? 'Yes' : 'No'} />
                <InfoRow label="Onboarding Date" value={customer.onboardingDate ? new Date(customer.onboardingDate).toLocaleDateString() : 'Not provided'} icon={CalendarIcon} />
                <InfoRow label="Last Login" value={customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString() : 'Never'} />
              </InfoBlock>

              {/* Banking Preferences Block */}
              <InfoBlock title="Banking Preferences" icon={GlobeAltIcon}>
                <InfoRow label="Preferred Branch" value={customer.preferredBranchId || 'Not specified'} />
                <InfoRow label="Communication Preferences" value="Email & SMS" />
                <InfoRow label="Account Preferences" value="Standard" />
                <InfoRow label="Service Preferences" value="Full Service" />
              </InfoBlock>
            </div>
          )}

          {activeTab === 'kyc' && (
            <KYCSection 
              kycDetails={kycDetails}
              onVerify={(field) => {
                console.log(`Verifying ${field} for customer ${customerId}`);
                // TODO: Implement verification logic
              }}
              onReject={(field, reason) => {
                console.log(`Rejecting ${field} for customer ${customerId}, reason: ${reason}`);
                // TODO: Implement rejection logic
              }}
            />
          )}

          {activeTab === 'loans' && (
            <div className="space-y-6">
              {dataLoading.loans ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stripe-primary mx-auto mb-4"></div>
                  <p className="text-stripe-text-secondary">Loading loan information...</p>
                </div>
              ) : loans.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {loans.map((loan) => (
                    <LoanCard
                      key={loan.loanId}
                      loan={loan}
                      onViewBasic={handleViewBasicLoan}
                      onViewFull={handleViewFullLoan}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BanknotesIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stripe-text mb-2">No Loans Found</h3>
                  <p className="text-stripe-text-secondary mb-4">This customer doesn't have any active loans.</p>
                  <button className="px-4 py-2 bg-stripe-primary text-white rounded-lg hover:bg-stripe-primary-dark">
                    Create New Loan
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'deposits' && (
            <div className="space-y-6">
              {dataLoading.deposits ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stripe-primary mx-auto mb-4"></div>
                  <p className="text-stripe-text-secondary">Loading deposit information...</p>
                </div>
              ) : deposits.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {deposits.map((deposit) => (
                    <DepositCard
                      key={deposit.depositId}
                      deposit={deposit}
                      bankingMode="conventional" // TODO: Get from context or props
                      onViewCertificate={handleViewCertificate}
                      onPrematureClosure={handlePrematureClosure}
                      onRenew={handleRenewDeposit}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CurrencyDollarIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stripe-text mb-2">No Deposits Found</h3>
                  <p className="text-stripe-text-secondary mb-4">This customer doesn't have any term deposits.</p>
                  <button className="px-4 py-2 bg-stripe-primary text-white rounded-lg hover:bg-stripe-primary-dark">
                    Open New Deposit
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Timeline Filters */}
              <div className="card">
                <div className="card-content">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label htmlFor="timelineSearch" className="block text-sm font-medium text-stripe-text-secondary mb-2">
                        Search Activities
                      </label>
                      <input
                        id="timelineSearch"
                        type="text"
                        value={timelineSearch}
                        onChange={(e) => setTimelineSearch(e.target.value)}
                        placeholder="Search activities..."
                        className="w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                      />
                    </div>
                    <div className="md:w-48">
                      <label htmlFor="timelineFilter" className="block text-sm font-medium text-stripe-text-secondary mb-2">
                        Filter by Type
                      </label>
                      <select
                        id="timelineFilter"
                        value={timelineFilter}
                        onChange={(e) => setTimelineFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                      >
                        <option value="all">All Activities</option>
                        <option value="account">Account</option>
                        <option value="loan">Loan</option>
                        <option value="deposit">Deposit</option>
                        <option value="communication">Communication</option>
                        <option value="team">Team</option>
                        <option value="request">Request</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Content */}
              {dataLoading.activities ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stripe-primary mx-auto mb-4"></div>
                  <p className="text-stripe-text-secondary">Loading activity timeline...</p>
                </div>
              ) : filteredActivities.length > 0 ? (
                <div className="space-y-4">
                  {filteredActivities.map((activity) => (
                    <TimelineItem
                      key={activity.activityId}
                      activity={activity}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ClockIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stripe-text mb-2">No Activities Found</h3>
                  <p className="text-stripe-text-secondary">
                    {activities.length === 0 
                      ? 'No activities recorded for this customer yet.'
                      : 'No activities match your current filters.'
                    }
                  </p>
                  {activities.length > 0 && (
                    <button
                      onClick={() => {
                        setTimelineFilter('all');
                        setTimelineSearch('');
                      }}
                      className="mt-4 px-4 py-2 bg-stripe-primary text-white rounded-lg hover:bg-stripe-primary-dark"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stripe-text mb-2">Documents</h3>
              <p className="text-stripe-text-secondary">Customer documents will be displayed here</p>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="text-center py-12">
              <BanknotesIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stripe-text mb-2">Accounts</h3>
              <p className="text-stripe-text-secondary">Customer accounts will be displayed here</p>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="text-center py-12">
              <MapPinIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stripe-text mb-2">Addresses</h3>
              <p className="text-stripe-text-secondary">Customer addresses will be displayed here</p>
            </div>
          )}

          {activeTab === 'nominees' && (
            <div className="text-center py-12">
              <UserGroupIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stripe-text mb-2">Nominees</h3>
              <p className="text-stripe-text-secondary">Customer nominees will be displayed here</p>
            </div>
          )}
        </div>
      </div>

      {/* Loan Details Modal */}
      <LoanDetailsModal
        loan={selectedLoan}
        isOpen={showLoanModal}
        onClose={handleCloseLoanModal}
      />
    </div>
  );
}