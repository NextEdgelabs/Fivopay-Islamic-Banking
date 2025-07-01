"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  CalculatorIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  CurrencyRupeeIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface LoanStats {
  activeLoans: number;
  portfolioValue: string;
  pendingApprovals: number;
  totalApplications: number;
  approvalRate: number;
  defaultRate: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'approval' | 'disbursement' | 'payment' | 'default';
  description: string;
  amount?: string;
  time: string;
  status: 'success' | 'pending' | 'warning' | 'error';
}

interface LoanApplication {
  id: string;
  applicantName: string;
  amount: number;
  type: string;
  status: 'Pending Review' | 'Under Assessment' | 'Approved' | 'Rejected';
  submittedDate: string;
  phone: string;
  email: string;
}

interface LoanAccount {
  id: string;
  accountNumber: string;
  customerName: string;
  loanType: string;
  principalAmount: number;
  outstandingAmount: number;
  nextEmiAmount: number;
  nextEmiDate: string;
  status: 'Active' | 'Overdue' | 'Closed';
  tenure: string;
}

interface Disbursement {
  id: string;
  customerName: string;
  loanAccount: string;
  amount: number;
  disbursementDate: string;
  status: 'Pending' | 'Processed' | 'Failed';
  bankAccount: string;
  referenceNumber?: string;
}

interface Collection {
  id: string;
  customerName: string;
  loanAccount: string;
  emiAmount: number;
  dueDate: string;
  paidDate?: string;
  status: 'Paid' | 'Overdue' | 'Pending';
  days: number;
}

interface ProfitProduct {
  type: string;
  rate: string;
  structure: string;
}

const tabs = [
  { id: 'applications', name: 'Loan Applications', icon: DocumentTextIcon },
  { id: 'accounts', name: 'Loan Accounts', icon: BanknotesIcon },
  { id: 'disbursements', name: 'Disbursements', icon: ArrowTrendingUpIcon },
  { id: 'collections', name: 'Collections', icon: ArrowTrendingDownIcon },
  { id: 'profit', name: 'Profit', icon: CalculatorIcon },
  { id: 'reports', name: 'Loan Reports', icon: ChartBarIcon },
];

export default function LoansDashboard() {
  const [activeTab, setActiveTab] = useState('applications');
  const [showProfitCalculator, setShowProfitCalculator] = useState(false);
  const [showRateManager, setShowRateManager] = useState(false);
  const [showUpdateRate, setShowUpdateRate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProfitProduct | null>(null);

  // Profit Calculator State
  const [calculatorData, setCalculatorData] = useState({
    principal: '',
    tenure: '',
    rate: '',
    structure: 'Murabaha'
  });

  // Rate Manager State
  const [rateData, setRateData] = useState({
    productType: '',
    newRate: '',
    effectiveDate: '',
    reason: ''
  });

  // Mock data - replace with actual API calls
  const stats: LoanStats = {
    activeLoans: 1247,
    portfolioValue: "₹12,45,67,890",
    pendingApprovals: 23,
    totalApplications: 156,
    approvalRate: 87.5,
    defaultRate: 2.3
  };

  const loanApplications: LoanApplication[] = [
    {
      id: '1',
      applicantName: 'Ahmed Hassan',
      amount: 500000,
      type: 'Personal Financing',
      status: 'Pending Review',
      submittedDate: '2024-01-25',
      phone: '+91 9876543210',
      email: 'ahmed.hassan@email.com'
    },
    {
      id: '2',
      applicantName: 'Fatima Al-Zahra',
      amount: 350000,
      type: 'Home Financing',
      status: 'Under Assessment',
      submittedDate: '2024-01-24',
      phone: '+91 9876543211',
      email: 'fatima.zahra@email.com'
    },
    {
      id: '3',
      applicantName: 'Mohammad Ali',
      amount: 750000,
      type: 'Business Financing',
      status: 'Approved',
      submittedDate: '2024-01-23',
      phone: '+91 9876543212',
      email: 'mohammad.ali@email.com'
    },
    {
      id: '4',
      applicantName: 'Sarah Khan',
      amount: 200000,
      type: 'Vehicle Financing',
      status: 'Pending Review',
      submittedDate: '2024-01-22',
      phone: '+91 9876543213',
      email: 'sarah.khan@email.com'
    }
  ];

  const loanAccounts: LoanAccount[] = [
    {
      id: '1',
      accountNumber: 'LN001001',
      customerName: 'Ahmad Abdullah',
      loanType: 'Personal Financing',
      principalAmount: 800000,
      outstandingAmount: 450000,
      nextEmiAmount: 25000,
      nextEmiDate: '2024-02-05',
      status: 'Active',
      tenure: '36 months'
    },
    {
      id: '2',
      accountNumber: 'LN001002',
      customerName: 'Zara Sheikh',
      loanType: 'Home Financing',
      principalAmount: 2500000,
      outstandingAmount: 2100000,
      nextEmiAmount: 45000,
      nextEmiDate: '2024-02-08',
      status: 'Active',
      tenure: '180 months'
    },
    {
      id: '3',
      accountNumber: 'LN001003',
      customerName: 'Omar Malik',
      loanType: 'Business Financing',
      principalAmount: 1200000,
      outstandingAmount: 980000,
      nextEmiAmount: 35000,
      nextEmiDate: '2024-01-28',
      status: 'Overdue',
      tenure: '48 months'
    }
  ];

  const disbursements: Disbursement[] = [
    {
      id: '1',
      customerName: 'Mohammad Ali',
      loanAccount: 'LN001004',
      amount: 750000,
      disbursementDate: '2024-01-25',
      status: 'Processed',
      bankAccount: '****1234',
      referenceNumber: 'DISB001234567'
    },
    {
      id: '2',
      customerName: 'Aisha Rahman',
      loanAccount: 'LN001005',
      amount: 400000,
      disbursementDate: '2024-01-26',
      status: 'Pending',
      bankAccount: '****5678'
    },
    {
      id: '3',
      customerName: 'Hassan Ahmed',
      loanAccount: 'LN001006',
      amount: 600000,
      disbursementDate: '2024-01-24',
      status: 'Failed',
      bankAccount: '****9012'
    }
  ];

  const collections: Collection[] = [
    {
      id: '1',
      customerName: 'Ahmad Abdullah',
      loanAccount: 'LN001001',
      emiAmount: 25000,
      dueDate: '2024-01-05',
      paidDate: '2024-01-05',
      status: 'Paid',
      days: 0
    },
    {
      id: '2',
      customerName: 'Omar Malik',
      loanAccount: 'LN001003',
      emiAmount: 35000,
      dueDate: '2024-01-28',
      status: 'Overdue',
      days: 3
    },
    {
      id: '3',
      customerName: 'Zara Sheikh',
      loanAccount: 'LN001002',
      emiAmount: 45000,
      dueDate: '2024-02-08',
      status: 'Pending',
      days: 0
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'application',
      description: 'New loan application submitted by Ahmed Hassan',
      amount: '₹5,00,000',
      time: '5 min ago',
      status: 'pending'
    },
    {
      id: '2',
      type: 'approval',
      description: 'Loan approved for Fatima Al-Zahra',
      amount: '₹3,50,000',
      time: '15 min ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'disbursement',
      description: 'Funds disbursed to Mohammad Ali',
      amount: '₹7,50,000',
      time: '1 hour ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'payment',
      description: 'EMI payment received from Sarah Khan',
      amount: '₹25,000',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: '5',
      type: 'default',
      description: 'Payment overdue for Ibrahim Sheikh',
      amount: '₹45,000',
      time: '3 hours ago',
      status: 'error'
    }
  ];

  const profitProducts: ProfitProduct[] = [
    { type: 'Personal Financing', rate: '8.5%', structure: 'Murabaha' },
    { type: 'Home Financing', rate: '7.2%', structure: 'Ijara' },
    { type: 'Business Financing', rate: '60:40', structure: 'Musharakah' },
    { type: 'Vehicle Financing', rate: '9.1%', structure: 'Murabaha' }
  ];

  const calculateProfit = () => {
    const principal = parseFloat(calculatorData.principal);
    const tenure = parseInt(calculatorData.tenure);
    const rate = parseFloat(calculatorData.rate);
    
    if (principal && tenure && rate) {
      const monthlyRate = rate / 12 / 100;
      const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
      const totalPayment = emi * tenure;
      const profit = totalPayment - principal;
      
      alert(`Profit Calculation Results:\n\nPrincipal: ₹${principal.toLocaleString()}\nTenure: ${tenure} months\nRate: ${rate}%\nMonthly EMI: ₹${emi.toFixed(2)}\nTotal Profit: ₹${profit.toFixed(2)}`);
    } else {
      alert('Please fill in all fields for calculation');
    }
  };

  const updateProductRate = (product: ProfitProduct) => {
    setSelectedProduct(product);
    setShowUpdateRate(true);
  };

  const handleRateUpdate = () => {
    if (rateData.newRate && rateData.effectiveDate) {
      alert(`Rate updated successfully!\n\nProduct: ${selectedProduct?.type}\nNew Rate: ${rateData.newRate}%\nEffective Date: ${rateData.effectiveDate}`);
      setShowUpdateRate(false);
      setRateData({ productType: '', newRate: '', effectiveDate: '', reason: '' });
      setSelectedProduct(null);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return DocumentTextIcon;
      case 'approval': return CheckCircleIcon;
      case 'disbursement': return ArrowTrendingUpIcon;
      case 'payment': return ArrowTrendingDownIcon;
      case 'default': return ExclamationTriangleIcon;
      default: return ClipboardDocumentListIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Assessment':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisbursementStatusBadge = (status: string) => {
    switch (status) {
      case 'Processed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCollectionStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'applications':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Loan Applications</h3>
              <Link 
                href="/dashboard/loans/applications"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Application
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loanApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{application.applicantName}</div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ₹{application.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApplicationStatusBadge(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.submittedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Active Loan Accounts</h3>
              <div className="flex space-x-2">
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Export
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loanAccounts.map((account) => (
                <div key={account.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{account.accountNumber}</h4>
                      <p className="text-sm text-gray-500">{account.customerName}</p>
                      <p className="text-xs text-gray-400">{account.loanType}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountStatusBadge(account.status)}`}>
                      {account.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Principal:</span>
                      <span className="font-medium">₹{account.principalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Outstanding:</span>
                      <span className="font-medium">₹{account.outstandingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next EMI:</span>
                      <span className="font-medium">₹{account.nextEmiAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Due Date:</span>
                      <span className="font-medium">{account.nextEmiDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tenure:</span>
                      <span className="font-medium">{account.tenure}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-xs hover:bg-blue-100 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded text-xs hover:bg-green-100 transition-colors">
                      Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'disbursements':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Loan Disbursements</h3>
              <Link 
                href="/dashboard/loans/disbursement"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Process Disbursement
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {disbursements.map((disbursement) => (
                    <tr key={disbursement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {disbursement.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {disbursement.loanAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ₹{disbursement.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {disbursement.bankAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {disbursement.disbursementDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDisbursementStatusBadge(disbursement.status)}`}>
                          {disbursement.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {disbursement.status === 'Pending' && (
                          <button className="text-green-600 hover:text-green-900" title="Process">
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'collections':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">EMI Collections</h3>
              <div className="flex space-x-2">
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Generate Notices
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Bulk Collection
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collections.map((collection) => (
                    <tr key={collection.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {collection.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {collection.loanAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ₹{collection.emiAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {collection.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {collection.status === 'Overdue' && (
                          <span className="text-red-600 font-medium">{collection.days} days</span>
                        )}
                        {collection.status === 'Paid' && (
                          <span className="text-green-600">On time</span>
                        )}
                        {collection.status === 'Pending' && (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCollectionStatusBadge(collection.status)}`}>
                          {collection.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {collection.status !== 'Paid' && (
                          <button className="text-green-600 hover:text-green-900" title="Collect">
                            <CurrencyRupeeIcon className="h-4 w-4" />
                          </button>
                        )}
                        {collection.status === 'Overdue' && (
                          <button className="text-red-600 hover:text-red-900" title="Send Notice">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'profit':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Profit Rate Management</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowProfitCalculator(true)}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Calculate Profit
                </button>
                <button 
                  onClick={() => setShowRateManager(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Rates
                </button>
              </div>
            </div>

            {/* Profit Rate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {profitProducts.map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{product.type}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Rate:</span>
                      <span className="text-lg font-bold text-blue-600">{product.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Structure:</span>
                      <span className="text-sm font-medium text-gray-700">{product.structure}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateProductRate(product)}
                    className="w-full mt-4 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors"
                  >
                    Update Rate
                  </button>
                </div>
              ))}
            </div>

            {/* Profit Calculation Tools */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Profit Calculation Tools</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <CalculatorIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h5 className="font-medium text-gray-900 mb-2">EMI Calculator</h5>
                  <p className="text-sm text-gray-600 mb-4">Calculate monthly payments based on Islamic financing principles</p>
                  <button 
                    onClick={() => setShowProfitCalculator(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open Calculator
                  </button>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <ChartBarIcon className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h5 className="font-medium text-gray-900 mb-2">Profit Analytics</h5>
                  <p className="text-sm text-gray-600 mb-4">Analyze profit distribution and portfolio performance</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    View Analytics
                  </button>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <DocumentTextIcon className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h5 className="font-medium text-gray-900 mb-2">Sharia Compliance</h5>
                  <p className="text-sm text-gray-600 mb-4">Ensure all financing structures comply with Islamic law</p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Review Compliance
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Loan Reports & Analytics</h3>
              <div className="flex space-x-2">
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <PrinterIcon className="h-4 w-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Report Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Portfolio Overview',
                  description: 'Complete loan portfolio analysis with key metrics',
                  icon: ChartBarIcon,
                  color: 'blue'
                },
                {
                  title: 'Application Reports',
                  description: 'Loan application statistics and approval rates',
                  icon: DocumentTextIcon,
                  color: 'green'
                },
                {
                  title: 'Collection Reports',
                  description: 'EMI collection status and overdue analysis',
                  icon: ArrowTrendingDownIcon,
                  color: 'purple'
                },
                {
                  title: 'Disbursement Reports',
                  description: 'Loan disbursement tracking and statistics',
                  icon: ArrowTrendingUpIcon,
                  color: 'orange'
                },
                {
                  title: 'Profit Analysis',
                  description: 'Islamic financing profit distribution and performance',
                  icon: CalculatorIcon,
                  color: 'teal'
                },
                {
                  title: 'Risk Assessment',
                  description: 'Credit risk analysis and default predictions',
                  icon: ExclamationTriangleIcon,
                  color: 'red'
                }
              ].map((report, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`p-3 bg-${report.color}-50 rounded-lg w-fit mb-4`}>
                    <report.icon className={`h-6 w-6 text-${report.color}-600`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{report.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  <div className="flex space-x-2">
                    <button className={`flex-1 bg-${report.color}-50 text-${report.color}-600 px-3 py-2 rounded text-sm hover:bg-${report.color}-100 transition-colors`}>
                      View Report
                    </button>
                    <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Quick Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">₹12.4Cr</p>
                  <p className="text-sm text-gray-500">Total Disbursed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">156</p>
                  <p className="text-sm text-gray-500">Applications</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">87.5%</p>
                  <p className="text-sm text-gray-500">Approval Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">2.3%</p>
                  <p className="text-sm text-gray-500">Default Rate</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{tabs.find(t => t.id === activeTab)?.name}</h3>
            <p className="text-gray-500">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loan Management Dashboard</h1>
          <p className="text-slate-600">Manage and monitor all loan operations</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <Link 
            href="/dashboard/loans/applications"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Loan
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Loans */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BanknotesIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{stats.activeLoans.toLocaleString()}</p>
              <p className="text-sm font-medium text-slate-600">Active Loans</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+12% from last month</span>
          </div>
        </div>

        {/* Portfolio Value */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{stats.portfolioValue}</p>
              <p className="text-sm font-medium text-slate-600">Portfolio Value</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+8.5% growth</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{stats.pendingApprovals}</p>
              <p className="text-sm font-medium text-slate-600">Pending Approvals</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600 font-medium">Requires attention</span>
          </div>
        </div>

        {/* Approval Rate */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{stats.approvalRate}%</p>
              <p className="text-sm font-medium text-slate-600">Approval Rate</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+2.1% improvement</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabs Section */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    {activity.amount && (
                      <p className="text-sm text-gray-600 font-semibold">{activity.amount}</p>
                    )}
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all activities →
            </button>
          </div>
        </div>
      </div>

      {/* Profit Calculator Modal */}
      {showProfitCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Profit Calculator</h3>
              <button 
                onClick={() => setShowProfitCalculator(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Principal Amount (₹)</label>
                <input
                  type="number"
                  value={calculatorData.principal}
                  onChange={(e) => setCalculatorData({...calculatorData, principal: e.target.value})}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter principal amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (months)</label>
                <input
                  type="number"
                  value={calculatorData.tenure}
                  onChange={(e) => setCalculatorData({...calculatorData, tenure: e.target.value})}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tenure in months"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profit Rate (%)</label>
                <input
                  type="number"
                  value={calculatorData.rate}
                  onChange={(e) => setCalculatorData({...calculatorData, rate: e.target.value})}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter profit rate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Financing Structure</label>
                <select
                  value={calculatorData.structure}
                  onChange={(e) => setCalculatorData({...calculatorData, structure: e.target.value})}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Murabaha">Murabaha</option>
                  <option value="Ijara">Ijara</option>
                  <option value="Musharakah">Musharakah</option>
                  <option value="Mudarabah">Mudarabah</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={calculateProfit}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Calculate
                </button>
                <button
                  onClick={() => setShowProfitCalculator(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rate Manager Modal */}
      {showRateManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Profit Rates</h3>
              <button 
                onClick={() => setShowRateManager(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profitProducts.map((product, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{product.type}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Current Rate: {product.rate}</span>
                      <button
                        onClick={() => updateProductRate(product)}
                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowRateManager(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Rate Modal */}
      {showUpdateRate && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Rate</h3>
              <button 
                onClick={() => setShowUpdateRate(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <input
                  type="text"
                  value={selectedProduct.type}
                  disabled
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 "
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Rate</label>
                <input
                  type="text"
                  value={selectedProduct.rate}
                  disabled
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 "
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Rate (%)</label>
                <input
                  type="number"
                  value={rateData.newRate}
                  onChange={(e) => setRateData({...rateData, newRate: e.target.value})}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new rate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                <input
                  type="date"
                  value={rateData.effectiveDate}
                  onChange={(e) => setRateData({...rateData, effectiveDate: e.target.value})}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Change</label>
                <textarea
                  value={rateData.reason}
                  onChange={(e) => setRateData({...rateData, reason: e.target.value})}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter reason for rate change"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleRateUpdate}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Rate
                </button>
                <button
                  onClick={() => setShowUpdateRate(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 