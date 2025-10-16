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
} from 'lucide-react';

export default function ViewCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id as string;

  // Mock customer data - in real app, fetch from API
  const customer = {
    id: customerId,
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+91 98765 43210',
    alternatePhone: '+91 98765 43211',
    accountType: 'Savings',
    accountNumber: 'SA2024001234',
    balance: 348000,
    status: 'Active',
    joinedDate: '2024-01-15',
    dateOfBirth: '1988-05-15',
    gender: 'Male',
    maritalStatus: 'Married',
    fatherName: 'Mohammed Hassan',
    motherName: 'Fatima Hassan',
    occupation: 'Business Owner',
    annualIncome: 1200000,
    address: {
      line1: '123, MG Road',
      line2: 'Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400058',
      country: 'India',
    },
    identification: {
      type: 'Aadhaar',
      number: '1234 5678 9012',
    },
    nominee: {
      name: 'Fatima Hassan',
      relation: 'Spouse',
      phone: '+91 98765 43211',
      address: '123, MG Road, Andheri West, Mumbai, Maharashtra - 400058',
    },
    branch: 'Mumbai Central',
    kyc: {
      aadhaarNumber: '123456789012',
      aadhaarVerified: true,
      panNumber: 'ABCDE1234F',
      panVerified: true,
      passportNumber: 'A1234567',
      drivingLicenseNumber: 'MH1234567890123',
      voterIdNumber: 'ABC1234567',
      addressProofType: 'Utility Bill',
      addressProofNumber: 'UB123456',
      kycStatus: 'Verified',
      kycVerifiedDate: '2024-01-20',
      kycVerifiedBy: 'John Doe (Branch Manager)',
      kycNotes: 'All documents verified successfully',
    },
  };

  // Mock transaction data
  const transactions = [
    {
      id: 'TXN001',
      date: '2024-10-15',
      type: 'Credit',
      description: 'Salary Deposit',
      amount: 50000,
      balance: 348000,
    },
    {
      id: 'TXN002',
      date: '2024-10-14',
      type: 'Debit',
      description: 'Online Purchase',
      amount: -2500,
      balance: 298000,
    },
    {
      id: 'TXN003',
      date: '2024-10-12',
      type: 'Credit',
      description: 'Fund Transfer',
      amount: 15000,
      balance: 300500,
    },
    {
      id: 'TXN004',
      date: '2024-10-10',
      type: 'Debit',
      description: 'ATM Withdrawal',
      amount: -5000,
      balance: 285500,
    },
    {
      id: 'TXN005',
      date: '2024-10-08',
      type: 'Credit',
      description: 'Interest Credit',
      amount: 1200,
      balance: 290500,
    },
  ];

  const transactionColumns = [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
    },
    {
      key: 'id',
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
      key: 'balance',
      header: 'Balance',
      render: (value: number) => (
        <span className="font-semibold text-neutral-900">
          ₹{value.toLocaleString('en-IN')}
        </span>
      ),
    },
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Customers', href: '/customers' },
    { label: customer.name, href: `/customers/${customerId}` },
  ];

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <InfoRow icon={<User />} label="Full Name" value={customer.name} />
                <InfoRow icon={<Mail />} label="Email" value={customer.email} />
                <InfoRow icon={<Phone />} label="Phone" value={customer.phone} />
                <InfoRow icon={<Phone />} label="Alternate Phone" value={customer.alternatePhone} />
                <InfoRow icon={<Calendar />} label="Date of Birth" value={customer.dateOfBirth} />
                <InfoRow icon={<User />} label="Gender" value={customer.gender} />
                <InfoRow label="Marital Status" value={customer.maritalStatus} />
                <InfoRow label="Father's Name" value={customer.fatherName} />
                <InfoRow label="Mother's Name" value={customer.motherName} />
                <InfoRow icon={<Briefcase />} label="Occupation" value={customer.occupation} />
                <InfoRow icon={<DollarSign />} label="Annual Income" value={`₹${customer.annualIncome.toLocaleString('en-IN')}`} />
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Address Information</h3>
              <div className="space-y-3">
                <InfoRow
                  icon={<MapPin />}
                  label="Address"
                  value={`${customer.address.line1}, ${customer.address.line2}`}
                />
                <InfoRow label="City" value={customer.address.city} />
                <InfoRow label="State" value={customer.address.state} />
                <InfoRow label="Postal Code" value={customer.address.postalCode} />
                <InfoRow label="Country" value={customer.address.country} />
              </div>
            </div>
          </Card>

          {/* Account Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <InfoRow icon={<CreditCard />} label="Account Type" value={customer.accountType} />
                <InfoRow label="Account Number" value={customer.accountNumber} />
                <InfoRow
                  icon={<DollarSign />}
                  label="Balance"
                  value={`₹${customer.balance.toLocaleString('en-IN')}`}
                  highlight
                />
                <InfoRow label="Status" value={<Badge variant="success">{customer.status}</Badge>} />
                <InfoRow icon={<Calendar />} label="Joined Date" value={customer.joinedDate} />
                <InfoRow label="Branch" value={customer.branch} />
              </div>
            </div>
          </Card>

          {/* Identification & Nominee */}
          <div className="space-y-6">
            {/* Identification */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Identification</h3>
                <div className="space-y-3">
                  <InfoRow icon={<FileText />} label="ID Type" value={customer.identification.type} />
                  <InfoRow label="ID Number" value={customer.identification.number} />
                </div>
              </div>
            </Card>

            {/* Nominee Information */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Nominee Information</h3>
                <div className="space-y-3">
                  <InfoRow icon={<User />} label="Name" value={customer.nominee.name} />
                  <InfoRow label="Relation" value={customer.nominee.relation} />
                  <InfoRow icon={<Phone />} label="Phone" value={customer.nominee.phone} />
                  <InfoRow icon={<MapPin />} label="Address" value={customer.nominee.address} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      content: (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Recent Transactions</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <Table data={transactions} columns={transactionColumns} />
          </div>
        </Card>
      ),
    },
    {
      id: 'activity',
      label: 'Activity',
      content: (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <ActivityItem
                date="2024-10-15 10:30 AM"
                action="Account Login"
                description="Logged in from Mumbai, Maharashtra"
              />
              <ActivityItem
                date="2024-10-14 3:45 PM"
                action="Transaction"
                description="Online purchase of ₹2,500"
              />
              <ActivityItem
                date="2024-10-12 9:15 AM"
                action="Fund Transfer"
                description="Received ₹15,000 from CUS002"
              />
              <ActivityItem
                date="2024-10-10 2:20 PM"
                action="ATM Withdrawal"
                description="Withdrew ₹5,000 at Mumbai Central Branch"
              />
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: 'kyc',
      label: 'KYC Documents',
      content: (
        <div className="space-y-6">
          {/* KYC Status Card */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-900">KYC Verification Status</h3>
                <Badge variant={customer.kyc.kycStatus === 'Verified' ? 'success' : 'warning'}>
                  {customer.kyc.kycStatus}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow icon={<Calendar />} label="Verified Date" value={customer.kyc.kycVerifiedDate} />
                <InfoRow icon={<User />} label="Verified By" value={customer.kyc.kycVerifiedBy} />
                <div className="md:col-span-2">
                  <InfoRow label="Notes" value={customer.kyc.kycNotes} />
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aadhaar Card */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-neutral-900">Aadhaar Card</h3>
                  </div>
                  {customer.kyc.aadhaarVerified ? (
                    <CheckCircle className="h-5 w-5 text-success-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-error-600" />
                  )}
                </div>
                <div className="space-y-3">
                  <InfoRow label="Aadhaar Number" value={customer.kyc.aadhaarNumber} />
                  <InfoRow 
                    label="Status" 
                    value={
                      <Badge variant={customer.kyc.aadhaarVerified ? 'success' : 'error'}>
                        {customer.kyc.aadhaarVerified ? 'Verified' : 'Not Verified'}
                      </Badge>
                    } 
                  />
                </div>
              </div>
            </Card>

            {/* PAN Card */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-neutral-900">PAN Card</h3>
                  </div>
                  {customer.kyc.panVerified ? (
                    <CheckCircle className="h-5 w-5 text-success-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-error-600" />
                  )}
                </div>
                <div className="space-y-3">
                  <InfoRow label="PAN Number" value={customer.kyc.panNumber} />
                  <InfoRow 
                    label="Status" 
                    value={
                      <Badge variant={customer.kyc.panVerified ? 'success' : 'error'}>
                        {customer.kyc.panVerified ? 'Verified' : 'Not Verified'}
                      </Badge>
                    } 
                  />
                </div>
              </div>
            </Card>

            {/* Passport */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Passport</h3>
                </div>
                <div className="space-y-3">
                  <InfoRow label="Passport Number" value={customer.kyc.passportNumber || 'Not Provided'} />
                </div>
              </div>
            </Card>

            {/* Driving License */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Driving License</h3>
                </div>
                <div className="space-y-3">
                  <InfoRow label="License Number" value={customer.kyc.drivingLicenseNumber || 'Not Provided'} />
                </div>
              </div>
            </Card>

            {/* Voter ID */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Voter ID</h3>
                </div>
                <div className="space-y-3">
                  <InfoRow label="Voter ID Number" value={customer.kyc.voterIdNumber || 'Not Provided'} />
                </div>
              </div>
            </Card>

            {/* Address Proof */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Address Proof</h3>
                </div>
                <div className="space-y-3">
                  <InfoRow label="Proof Type" value={customer.kyc.addressProofType} />
                  <InfoRow label="Document Number" value={customer.kyc.addressProofNumber} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="mt-4 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar size="lg" fallback={customer.name} />
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{customer.name}</h1>
                <p className="text-neutral-600 mt-1">{customer.id} • {customer.accountType} Account</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={customer.status === 'Active' ? 'success' : 'error'}>
                    {customer.status}
                  </Badge>
                  <span className="text-sm text-neutral-500">Joined {customer.joinedDate}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => router.push('/customers')}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button variant="primary" onClick={() => router.push(`/customers/${customerId}/edit`)}>
                <Edit className="h-5 w-5 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="sm">
            <div className="text-center">
              <p className="text-sm text-neutral-600">Current Balance</p>
              <p className="text-2xl font-bold text-primary-600 mt-2">
                ₹{customer.balance.toLocaleString('en-IN')}
              </p>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <p className="text-sm text-neutral-600">Total Deposits</p>
              <p className="text-2xl font-bold text-success-600 mt-2">₹5.2L</p>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <p className="text-sm text-neutral-600">Total Withdrawals</p>
              <p className="text-2xl font-bold text-error-600 mt-2">₹1.8L</p>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <p className="text-sm text-neutral-600">Transactions</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">247</p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} />
      </div>
    </DashboardLayout>
  );
}

// Helper Components
interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

function InfoRow({ icon, label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-border-light last:border-0">
      <div className="flex items-center gap-2 text-sm text-neutral-600">
        {icon && <span className="text-neutral-400">{icon}</span>}
        <span>{label}</span>
      </div>
      <div className={`text-sm font-medium ${highlight ? 'text-primary-600 text-lg' : 'text-neutral-900'} text-right`}>
        {value}
      </div>
    </div>
  );
}

interface ActivityItemProps {
  date: string;
  action: string;
  description: string;
}

function ActivityItem({ date, action, description }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-stripe">
      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-neutral-900">{action}</p>
        <p className="text-sm text-neutral-600 mt-1">{description}</p>
        <p className="text-xs text-neutral-500 mt-2">{date}</p>
      </div>
    </div>
  );
}
