'use client';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Badge, Breadcrumbs, Skeleton, Tabs, Table, Pagination } from '@/components/ui';
import { Edit, Trash2, MapPin, Phone, Mail, Clock, Users, Calendar, Award, Star, Building, DollarSign, CreditCard, TrendingUp, BarChart2, AlertCircle } from 'lucide-react';
import { useBranch } from '@/hooks/useBranch';
import { useBranchMutations } from '@/hooks/useBranchMutations';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';
import BranchKpiCard from '@/components/branches/BranchKpiCard';
import BranchCustomersList from '@/components/branches/BranchCustomersList';
import { useEffect, useState } from 'react';
import { branchService } from '@/services/branch.service';
import { CustomerTransaction } from '@/services/customers.service';
import { loanService, Loan } from '@/services/loans';
import { depositService, Deposit } from '@/services/deposits';
import { analyticsService, PerformanceData } from '@/services/analytics';
import { DateRange as DayPickerDateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import DateRangeFilter from '@/components/analytics/DateRangeFilter';
import KpiCardWithTrend from '@/components/analytics/KpiCardWithTrend';
import PerformanceChart from '@/components/analytics/PerformanceChart';
import ProductPerformance from '@/components/analytics/ProductPerformance';
import { customerService } from '@/services/customers.service';

export default function ViewBranchPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = params?.id as string;
  const { branch, loading, error } = useBranch(branchId);
  const { deleteBranch, loading: isDeleting } = useBranchMutations();
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (!branch) return;
    if (confirm(`Are you sure you want to delete ${branch.branchName}?`)) {
      try {
        await deleteBranch(branch.id || branch._id || '');
        addToast({ type: 'success', message: 'Branch deleted successfully' });
        router.push('/branches');
      } catch (err) {
        addToast({ type: 'error', message: 'Failed to delete branch' });
      }
    }
  };

  const getStatusBadge = (status: 'Active' | 'Inactive' | 'Under Maintenance') => {
    switch (status) {
      case 'Active': return <Badge variant="success">{status}</Badge>;
      case 'Inactive': return <Badge variant="neutral">{status}</Badge>;
      case 'Under Maintenance': return <Badge variant="warning">{status}</Badge>;
    }
  };

  if (loading) return <DashboardLayout><div className="p-6"><Skeleton className="h-screen w-full" /></div></DashboardLayout>;
  if (error || !branch) return <DashboardLayout><div className="p-6 text-error-500">{error || 'Branch not found'}</div></DashboardLayout>;

  const TABS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Building className="h-4 w-4" />,
      content: <BranchOverviewTab branch={branch} />,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users className="h-4 w-4" />,
      content: <BranchCustomersList branchName={branch.branchName} />,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <TrendingUp className="h-4 w-4" />,
      content: <BranchTransactionsTab branchName={branch.branchName} />,
    },
    {
      id: 'loans',
      label: 'Loans',
      icon: <DollarSign className="h-4 w-4" />,
      content: <BranchLoansTab branchId={branch.id || branch._id || ''} />,
    },
    {
      id: 'deposits',
      label: 'Deposits',
      icon: <CreditCard className="h-4 w-4" />,
      content: <BranchDepositsTab branchId={branch.id || branch._id || ''} />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 className="h-4 w-4" />,
      content: <BranchAnalyticsTab branchId={branch.id || branch._id || ''} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Branches', href: '/branches' }, { label: branch.branchName }]} />
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">{branch.branchName}</h1>
              <p className="text-neutral-500">{branch.branchCode} - {branch.branchType}</p>
              <div className="mt-2">{getStatusBadge(branch.status)}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" onClick={() => router.push(`/branches/${branch.id || branch._id}/edit`)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </div>
          </div>
        </Card>

        <Tabs tabs={TABS} />
      </div>
    </DashboardLayout>
  );
}

const BranchOverviewTab = ({ branch }: { branch: any }) => (
  <div className="space-y-6 mt-4">
    <BranchKpiCard branchId={branch.id || branch._id} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <h2 className="text-xl font-semibold p-6 border-b">Location & Contact</h2>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<MapPin />} label="Address" value={`${branch.addressLine1}${branch.addressLine2 ? ', ' + branch.addressLine2 : ''}, ${branch.city}, ${branch.state} ${branch.postalCode}`} />
            <InfoItem icon={<Phone />} label="Branch Phone" value={branch.phone} />
            <InfoItem icon={<Mail />} label="Branch Email" value={branch.email} />
            {branch.landmark && <InfoItem icon={<Star />} label="Landmark" value={branch.landmark} />}
            {branch.latitude && branch.longitude && 
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-neutral-600 flex items-center mb-1"><MapPin className="mr-2 h-4 w-4" /> Coordinates</span>
                <Link 
                  href={`https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  {branch.latitude}, {branch.longitude} (Open in Maps)
                </Link>
              </div>
            }
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold p-6 border-b">Services Offered</h2>
          <div className="p-6">
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
              {branch.services.map((service: string) => (
                <li key={service} className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary-500" />
                  <span className="text-neutral-700">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Manager Details</h2>
          <InfoItem icon={<Users />} label="Manager Name" value={branch.managerName} />
          <InfoItem icon={<Phone />} label="Manager Phone" value={branch.managerPhone} />
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Operating Details</h2>
          <InfoItem icon={<Calendar />} label="Opening Date" value={new Date(branch.openingDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} />
          <div className="mt-4">
            <h3 className="text-sm font-medium text-neutral-600 flex items-center mb-2"><Clock className="mr-2 h-4 w-4" /> Working Hours</h3>
            <div className="text-sm space-y-1 text-neutral-800">
              <p><strong>Weekdays:</strong> {branch.workingHours.weekdays}</p>
              <p><strong>Saturday:</strong> {branch.workingHours.saturday}</p>
              <p><strong>Sunday:</strong> {branch.workingHours.sunday}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div>
    <span className="text-sm font-medium text-neutral-600 flex items-center mb-1">{icon} {label}</span>
    <p className="text-neutral-800">{value}</p>
  </div>
);

const BranchAnalyticsTab = ({ branchId }: { branchId: string }) => {
  const [range, setRange] = useState<DayPickerDateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // The analytics service will need to be updated to handle the new date range object
      const performanceData = await analyticsService.getBranchPerformanceData(branchId, range);
      setData(performanceData);
      setLoading(false);
    };
    fetchData();
  }, [branchId, range]);

  if (loading) return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;
  if (!data) return <div className="p-6 text-center">No analytics data available.</div>;

  const trendLabel = 'vs previous period'; // This will need to be made dynamic

  return (
    <div className="space-y-6 mt-4">
      <DateRangeFilter selectedRange={range} onChange={setRange} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCardWithTrend title="New Customers" value={data.newCustomers.value.toString()} trend={data.newCustomers.trend} icon={<Users className="h-6 w-6 text-primary-600" />} trendLabel={trendLabel} />
        <KpiCardWithTrend title="Total Deposits" value={`₹${data.totalDeposits.value.toLocaleString()}`} trend={data.totalDeposits.trend} icon={<CreditCard className="h-6 w-6 text-success-600" />} trendLabel={trendLabel} />
        <KpiCardWithTrend title="Total Loans" value={`₹${data.totalLoans.value.toLocaleString()}`} trend={data.totalLoans.trend} icon={<DollarSign className="h-6 w-6 text-info-600" />} trendLabel={trendLabel} />
        <KpiCardWithTrend title="Loan Recovery" value={`₹${data.loanRecovery.value.toLocaleString()}`} trend={data.loanRecovery.trend} icon={<TrendingUp className="h-6 w-6 text-warning-600" />} trendLabel={trendLabel} />
        <KpiCardWithTrend title="CASA Ratio" value={`${data.casaRatio.value.toFixed(2)}%`} trend={data.casaRatio.trend} icon={<Building className="h-6 w-6 text-error-600" />} trendLabel={trendLabel} />
        <KpiCardWithTrend title="Portfolio at Risk" value={`${data.portfolioAtRisk.value.toFixed(2)}%`} trend={data.portfolioAtRisk.trend} icon={<AlertCircle className="h-6 w-6 text-red-600" />} trendLabel={trendLabel} />
      </div>
      <PerformanceChart data={data.trendChartData} chartType="line" />
      <div className="mt-6">
        <ProductPerformance data={data.productPerformance} />
      </div>
      <Card>
        <h3 className="text-lg font-semibold p-6 border-b">Detailed Performance Data</h3>
        <Table
          columns={[
            { header: 'Month', key: 'name' },
            { header: 'New Customers', key: 'customers' },
            { header: 'Total Deposits', key: 'deposits', render: (val: number) => `₹${val.toLocaleString()}` },
            { header: 'Total Loans', key: 'loans', render: (val: number) => `₹${val.toLocaleString()}` },
          ]}
          data={data.trendChartData}
        />
      </Card>
    </div>
  );
};

const BranchTransactionsTab = ({ branchName }: { branchName: string }) => {
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await customerService.getAllTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch branch transactions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [branchName]);

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: 'Date', key: 'date' },
    { header: 'Transaction ID', key: 'transactionId' },
    { header: 'Customer', key: 'customerId' },
    { header: 'Description', key: 'description' },
    { header: 'Type', key: 'type', render: (type: string) => <Badge variant={type === 'Credit' ? 'success' : 'error'}>{type}</Badge> },
    { header: 'Amount', key: 'amount', render: (amount: number) => `₹${amount.toLocaleString()}` },
  ];

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <Card>
      <Table data={paginatedTransactions} columns={columns} />
      {transactions.length > itemsPerPage && (
        <div className="p-4 border-t">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(transactions.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </Card>
  );
};

const BranchLoansTab = ({ branchId }: { branchId: string }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loanService.getLoans({ branchId }).then(data => {
      setLoans(data);
      setLoading(false);
    });
  }, [branchId]);

  const columns = [
    { header: 'Loan ID', key: 'loanId' },
    { header: 'Customer', key: 'customerName' },
    { header: 'Loan Type', key: 'loanType' },
    { header: 'Amount', key: 'loanAmount', render: (amount: number) => `₹${amount.toLocaleString()}` },
    { header: 'Status', key: 'status', render: (status: string) => <Badge>{status}</Badge> },
  ];

  if (loading) return <Skeleton className="h-64 w-full" />;
  return <Card><Table data={loans} columns={columns} /></Card>;
};

const BranchDepositsTab = ({ branchId }: { branchId: string }) => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    depositService.getDeposits({ branchId }).then(data => {
      setDeposits(data);
      setLoading(false);
    });
  }, [branchId]);

  const columns = [
    { header: 'Deposit ID', key: 'depositId' },
    { header: 'Customer', key: 'customerName' },
    { header: 'Deposit Type', key: 'depositType' },
    { header: 'Balance', key: 'currentBalance', render: (balance: number) => `₹${balance.toLocaleString()}` },
    { header: 'Status', key: 'status', render: (status: string) => <Badge>{status}</Badge> },
  ];

  if (loading) return <Skeleton className="h-64 w-full" />;
  return <Card><Table data={deposits} columns={columns} /></Card>;
};

