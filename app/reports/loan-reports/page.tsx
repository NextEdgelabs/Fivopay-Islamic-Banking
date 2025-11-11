'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Table,
  Tabs,
  Pagination,
  Input,
  Select,
  Breadcrumbs,
} from '@/components/ui';
import {
  Filter,
  Download,
  FileText,
  TrendingUp,
  Search,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Type definitions
interface LoanApplication {
  id: string;
  applicationId: string;
  applicantName: string;
  product: string;
  status: 'Applied' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed' | 'Closed';
  submittedOn: string;
  reviewer: string;
  timeInStage: number; // days
}

interface DisbursedLoan {
  id: string;
  loanId: string;
  customer: string;
  principal: number;
  disbursedDate: string;
  tenure: number; // months
  interest: number; // rate
  emi: number;
  nextPayment: string;
}

interface LoanAging {
  id: string;
  loanId: string;
  customer: string;
  daysOverdue: number;
  outstandingPrincipal: number;
  bucket: '0-30' | '31-60' | '61-90' | '90+';
}

// Generate dummy data
const generateLoanApplications = (): LoanApplication[] => {
  const applications: LoanApplication[] = [];
  const products = ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Vehicle Loan', 'Gold Loan'];
  const statuses: LoanApplication['status'][] = ['Applied', 'Under Review', 'Approved', 'Rejected', 'Disbursed', 'Closed'];
  const reviewers = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh'];
  const applicants = ['Ramesh Kumar', 'Sunita Devi', 'Anil Mehta', 'Kavita Singh', 'Mohammed Ali', 'Lakshmi Nair', 'Suresh Reddy', 'Geeta Patel', 'Ravi Shankar'];

  for (let i = 0; i < 120; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    applications.push({
      id: `app-${i + 1}`,
      applicationId: `APP${String(i + 1).padStart(6, '0')}`,
      applicantName: applicants[Math.floor(Math.random() * applicants.length)],
      product: products[Math.floor(Math.random() * products.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      submittedOn: date.toISOString(),
      reviewer: reviewers[Math.floor(Math.random() * reviewers.length)],
      timeInStage: Math.floor(Math.random() * 30) + 1,
    });
  }

  return applications.sort((a, b) => new Date(b.submittedOn).getTime() - new Date(a.submittedOn).getTime());
};

const generateDisbursedLoans = (): DisbursedLoan[] => {
  const loans: DisbursedLoan[] = [];
  const customers = ['Ramesh Kumar', 'Sunita Devi', 'Anil Mehta', 'Kavita Singh', 'Mohammed Ali', 'Lakshmi Nair', 'Suresh Reddy', 'Geeta Patel', 'Ravi Shankar', 'Priya Desai'];

  for (let i = 0; i < 80; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    const nextPayment = new Date(date);
    nextPayment.setMonth(nextPayment.getMonth() + 1);

    const principal = Math.floor(Math.random() * 2000000) + 50000;
    const interest = 8 + Math.random() * 6; // 8-14%
    const tenure = [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)];
    const monthlyRate = interest / 100 / 12;
    const emi = principal * (monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);

    loans.push({
      id: `loan-${i + 1}`,
      loanId: `LOAN${String(i + 1).padStart(6, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      principal,
      disbursedDate: date.toISOString(),
      tenure,
      interest: parseFloat(interest.toFixed(2)),
      emi: Math.round(emi),
      nextPayment: nextPayment.toISOString(),
    });
  }

  return loans.sort((a, b) => new Date(b.disbursedDate).getTime() - new Date(a.disbursedDate).getTime());
};

const generateLoanAging = (): LoanAging[] => {
  const aging: LoanAging[] = [];
  const customers = ['Ramesh Kumar', 'Sunita Devi', 'Anil Mehta', 'Kavita Singh', 'Mohammed Ali', 'Lakshmi Nair', 'Suresh Reddy', 'Geeta Patel', 'Ravi Shankar'];

  for (let i = 0; i < 45; i++) {
    const daysOverdue = Math.floor(Math.random() * 120);
    let bucket: LoanAging['bucket'];
    if (daysOverdue <= 30) bucket = '0-30';
    else if (daysOverdue <= 60) bucket = '31-60';
    else if (daysOverdue <= 90) bucket = '61-90';
    else bucket = '90+';

    aging.push({
      id: `aging-${i + 1}`,
      loanId: `LOAN${String(i + 1).padStart(6, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      daysOverdue,
      outstandingPrincipal: Math.floor(Math.random() * 1500000) + 100000,
      bucket,
    });
  }

  return aging.sort((a, b) => b.daysOverdue - a.daysOverdue);
};

const allApplications = generateLoanApplications();
const allDisbursedLoans = generateDisbursedLoans();
const allLoanAging = generateLoanAging();

// Funnel component
const LoanPipelineFunnel: React.FC<{ data: { stage: string; count: number; color: string }[] }> = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const widthPercent = (item.count / maxCount) * 100;
        const isFirst = index === 0;
        const isLast = index === data.length - 1;

        return (
          <div key={item.stage} className="flex items-center gap-4">
            <div className="w-32 text-sm font-medium text-neutral-700">{item.stage}</div>
            <div className="flex-1 relative">
              <div
                className="h-12 rounded-lg transition-all duration-500 flex items-center justify-between px-4"
                style={{
                  width: `${Math.max(widthPercent, 15)}%`,
                  backgroundColor: item.color,
                }}
              >
                <span className="text-white font-semibold text-sm">{item.count}</span>
                <span className="text-white text-xs opacity-90">
                  {((item.count / maxCount) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function LoanReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('applications');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    loanProduct: '',
    status: '',
    approvalManager: '',
    branch: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(true);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const applicationsReceived = allApplications.length;
    const approved = allApplications.filter(a => a.status === 'Approved' || a.status === 'Disbursed' || a.status === 'Closed').length;
    const disbursed = allDisbursedLoans.length;
    const activeLoans = allDisbursedLoans.filter(l => {
      const maturityDate = new Date(l.disbursedDate);
      maturityDate.setMonth(maturityDate.getMonth() + l.tenure);
      return maturityDate > new Date();
    }).length;

    return { applicationsReceived, approved, disbursed, activeLoans };
  }, []);

  // Pipeline funnel data
  const pipelineData = useMemo(() => {
    const applied = allApplications.filter(a => a.status === 'Applied').length;
    const underReview = allApplications.filter(a => a.status === 'Under Review').length;
    const approved = allApplications.filter(a => a.status === 'Approved').length;
    const disbursed = allApplications.filter(a => a.status === 'Disbursed').length;
    const closed = allApplications.filter(a => a.status === 'Closed').length;

    return [
      { stage: 'Applied', count: applied, color: '#8B5CF6' },
      { stage: 'Under Review', count: underReview, color: '#3B82F6' },
      { stage: 'Approved', count: approved, color: '#10B981' },
      { stage: 'Disbursed', count: disbursed, color: '#F59E0B' },
      { stage: 'Closed', count: closed, color: '#6B7280' },
    ];
  }, []);

  // Filter data
  const filteredApplications = useMemo(() => {
    let filtered = [...allApplications];

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(a => new Date(a.submittedOn) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(a => new Date(a.submittedOn) <= toDate);
    }
    if (filters.loanProduct) {
      filtered = filtered.filter(a => a.product === filters.loanProduct);
    }
    if (filters.status) {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    if (filters.approvalManager) {
      filtered = filtered.filter(a => a.reviewer === filters.approvalManager);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.applicationId.toLowerCase().includes(searchLower) ||
          a.applicantName.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters]);

  const filteredDisbursed = useMemo(() => {
    let filtered = [...allDisbursedLoans];

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(l => new Date(l.disbursedDate) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(l => new Date(l.disbursedDate) <= toDate);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        l =>
          l.loanId.toLowerCase().includes(searchLower) ||
          l.customer.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters]);

  const filteredAging = useMemo(() => {
    let filtered = [...allLoanAging];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.loanId.toLowerCase().includes(searchLower) ||
          a.customer.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters]);

  // Pagination
  const getPaginatedData = (data: any[]) => {
    return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };

  const totalPages = (data: any[]) => Math.ceil(data.length / itemsPerPage);

  // Chart data
  const loansByProductData = useMemo(() => {
    const productCounts: Record<string, number> = {};
    allApplications
      .filter(app => app.status === 'Disbursed' || app.status === 'Closed')
      .forEach(app => {
        productCounts[app.product] = (productCounts[app.product] || 0) + 1;
      });

    return Object.entries(productCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const disbursementTrendData = [
    { month: 'Jan', amount: 2500000 },
    { month: 'Feb', amount: 3200000 },
    { month: 'Mar', amount: 2800000 },
    { month: 'Apr', amount: 3500000 },
    { month: 'May', amount: 4100000 },
    { month: 'Jun', amount: 3800000 },
    { month: 'Jul', amount: 4200000 },
    { month: 'Aug', amount: 3900000 },
    { month: 'Sep', amount: 4500000 },
    { month: 'Oct', amount: 4800000 },
    { month: 'Nov', amount: 4400000 },
    { month: 'Dec', amount: 5000000 },
  ];

  // Get unique values for filters
  const uniqueProducts = Array.from(new Set(allApplications.map(a => a.product))).sort();
  const uniqueReviewers = Array.from(new Set(allApplications.map(a => a.reviewer))).sort();
  const uniqueBranches = ['Main Branch', 'Downtown Branch', 'City Center', 'Suburban Branch', 'North Branch'];

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      loanProduct: '',
      status: '',
      approvalManager: '',
      branch: '',
      search: '',
    });
  };

  // Table columns
  const applicationsColumns = [
    {
      key: 'applicationId',
      header: 'Application ID',
      sortable: true,
      width: '140px',
    },
    {
      key: 'applicantName',
      header: 'Applicant Name',
      sortable: true,
      width: '180px',
    },
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      width: '140px',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '140px',
      render: (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'primary'> = {
          'Applied': 'primary',
          'Under Review': 'warning',
          'Approved': 'success',
          'Rejected': 'error',
          'Disbursed': 'success',
          'Closed': 'neutral',
        };
        return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
      },
    },
    {
      key: 'submittedOn',
      header: 'Submitted On',
      sortable: true,
      width: '140px',
      render: (date: string) => new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    },
    {
      key: 'reviewer',
      header: 'Reviewer',
      sortable: true,
      width: '140px',
    },
    {
      key: 'timeInStage',
      header: 'Time in Stage',
      sortable: true,
      width: '120px',
      render: (days: number) => (
        <span className="text-sm text-neutral-700">{days} days</span>
      ),
    },
  ];

  const disbursedColumns = [
    {
      key: 'loanId',
      header: 'Loan ID',
      sortable: true,
      width: '140px',
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      width: '180px',
    },
    {
      key: 'principal',
      header: 'Principal',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'disbursedDate',
      header: 'Disbursed Date',
      sortable: true,
      width: '140px',
      render: (date: string) => new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    },
    {
      key: 'tenure',
      header: 'Tenure',
      sortable: true,
      width: '100px',
      render: (months: number) => (
        <span className="text-sm text-neutral-700">{months} months</span>
      ),
    },
    {
      key: 'interest',
      header: 'Interest',
      sortable: true,
      width: '100px',
      render: (rate: number) => (
        <span className="text-sm text-neutral-700">{rate}%</span>
      ),
    },
    {
      key: 'emi',
      header: 'EMI',
      sortable: true,
      width: '120px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'nextPayment',
      header: 'Next Payment',
      sortable: true,
      width: '140px',
      render: (date: string) => new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    },
  ];

  const agingColumns = [
    {
      key: 'loanId',
      header: 'Loan ID',
      sortable: true,
      width: '140px',
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      width: '180px',
    },
    {
      key: 'daysOverdue',
      header: 'Days Overdue',
      sortable: true,
      width: '140px',
      render: (days: number) => (
        <Badge variant={days > 90 ? 'error' : days > 60 ? 'warning' : 'neutral'}>
          {days} days
        </Badge>
      ),
    },
    {
      key: 'outstandingPrincipal',
      header: 'Outstanding Principal',
      sortable: true,
      width: '180px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'bucket',
      header: 'Bucket',
      sortable: true,
      width: '120px',
      render: (bucket: string) => {
        const colors: Record<string, string> = {
          '0-30': 'bg-blue-100 text-blue-700',
          '31-60': 'bg-yellow-100 text-yellow-700',
          '61-90': 'bg-orange-100 text-orange-700',
          '90+': 'bg-red-100 text-red-700',
        };
        return (
          <Badge className={colors[bucket] || ''}>{bucket}</Badge>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Reports', href: '/reports' },
              { label: 'Loan Reports' },
            ]}
          />
          <h1 className="text-3xl font-bold text-neutral-900 mt-2">
            Loan Lifecycle Reports
          </h1>
          <p className="text-neutral-600 mt-1">
            Track loan flow from application to closure
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Applications Received</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.applicationsReceived.toLocaleString()}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.approved.toLocaleString()}
                </p>
              </div>
              <div className="bg-success-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Disbursed</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.disbursed.toLocaleString()}
                </p>
              </div>
              <div className="bg-info-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Active Loans</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.activeLoans.toLocaleString()}
                </p>
              </div>
              <div className="bg-warning-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Loan Pipeline Funnel */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Loan Pipeline Funnel
          </h2>
          <LoanPipelineFunnel data={pipelineData} />
        </Card>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-neutral-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                type="date"
                label="Date From"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
              <Input
                type="date"
                label="Date To"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
              <Select
                label="Loan Product"
                placeholder="All Products"
                value={filters.loanProduct}
                onChange={(e) => setFilters({ ...filters, loanProduct: e.target.value })}
                options={[
                  { value: '', label: 'All Products' },
                  ...uniqueProducts.map((product) => ({
                    value: product,
                    label: product,
                  })),
                ]}
              />
              <Select
                label="Status"
                placeholder="All Statuses"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'Applied', label: 'Applied' },
                  { value: 'Under Review', label: 'Under Review' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Rejected', label: 'Rejected' },
                  { value: 'Disbursed', label: 'Disbursed' },
                  { value: 'Closed', label: 'Closed' },
                ]}
              />
              <Select
                label="Approval Manager"
                placeholder="All Managers"
                value={filters.approvalManager}
                onChange={(e) => setFilters({ ...filters, approvalManager: e.target.value })}
                options={[
                  { value: '', label: 'All Managers' },
                  ...uniqueReviewers.map((reviewer) => ({
                    value: reviewer,
                    label: reviewer,
                  })),
                ]}
              />
              <Select
                label="Branch"
                placeholder="All Branches"
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                options={[
                  { value: '', label: 'All Branches' },
                  ...uniqueBranches.map((branch) => ({
                    value: branch,
                    label: branch,
                  })),
                ]}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <Input
                  label="Search"
                  placeholder="Search by Application ID, Loan ID, or Customer Name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Tabs */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Reports</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                let dataToExport: any[] = [];
                let filename = 'loan-reports';
                
                if (activeTab === 'applications') {
                  dataToExport = filteredApplications;
                  filename = 'loan-applications-pipeline';
                } else if (activeTab === 'disbursed') {
                  dataToExport = filteredDisbursed;
                  filename = 'disbursed-loans';
                } else if (activeTab === 'aging') {
                  dataToExport = filteredAging;
                  filename = 'loan-aging-report';
                }
                
                exportToCSV(dataToExport, `${filename}-${new Date().toISOString().split('T')[0]}`);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          <Tabs
            tabs={[
              {
                id: 'applications',
                label: 'Applications Pipeline',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredApplications)}
                      columns={applicationsColumns}
                      onRowClick={(row) => {
                        console.log('View application:', row);
                        router.push(`/loans/${row.id}`);
                      }}
                    />
                    {totalPages(filteredApplications) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of{' '}
                          {filteredApplications.length} applications
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredApplications)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'disbursed',
                label: 'Disbursed Loans',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredDisbursed)}
                      columns={disbursedColumns}
                      onRowClick={(row) => {
                        console.log('View loan:', row);
                        router.push(`/loans/${row.id}`);
                      }}
                    />
                    {totalPages(filteredDisbursed) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredDisbursed.length)} of{' '}
                          {filteredDisbursed.length} loans
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredDisbursed)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'aging',
                label: 'Loan Aging Report',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredAging)}
                      columns={agingColumns}
                      onRowClick={(row) => {
                        console.log('View loan:', row);
                        router.push(`/loans/${row.id}`);
                      }}
                    />
                    {totalPages(filteredAging) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredAging.length)} of{' '}
                          {filteredAging.length} loans
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredAging)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
            defaultTab="applications"
            onChange={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
            }}
          />
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loans by Product Type */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Loans by Product Type
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loansByProductData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#635BFF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Loan Disbursements Over Time */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Loan Disbursements Over Time
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={disbursementTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#635BFF"
                    strokeWidth={2}
                    name="Disbursed Amount"
                    dot={{ fill: '#635BFF', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

