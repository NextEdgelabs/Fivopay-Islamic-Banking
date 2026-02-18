'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  FileText,
  CreditCard,
  Users,
  BarChart3,
  PieChart,
  LineChart,
  Receipt,
  ClipboardList,
  UserCheck,
  Calculator,
  Shield,
  Activity,
  ArrowRight,
  Download,
  Image as ImageIcon,
} from 'lucide-react';
import { exportChartAsPNG, exportKPIsAsCSV } from '@/lib/reportExport';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data for charts
const dailyTransactionData = [
  { date: 'Mon', volume: 45000 },
  { date: 'Tue', volume: 52000 },
  { date: 'Wed', volume: 48000 },
  { date: 'Thu', volume: 61000 },
  { date: 'Fri', volume: 55000 },
  { date: 'Sat', volume: 42000 },
  { date: 'Sun', volume: 38000 },
];

const disbursementData = [
  { category: 'Personal', amount: 1250000 },
  { category: 'Business', amount: 2100000 },
  { category: 'Home', amount: 3500000 },
  { category: 'Auto', amount: 850000 },
  { category: 'Education', amount: 650000 },
];

const collectionDistributionData = [
  { name: 'Agent A', value: 35, color: '#635BFF' },
  { name: 'Agent B', value: 28, color: '#00D924' },
  { name: 'Agent C', value: 22, color: '#FFA500' },
  { name: 'Agent D', value: 15, color: '#DF1B41' },
];

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconBg?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  iconBg = 'bg-primary-100',
}) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-success-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-error-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`${iconBg} p-3 rounded-lg`}>{icon}</div>
      </div>
    </Card>
  );
};

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  description,
  icon,
  href,
}) => {
  const router = useRouter();

  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group border border-neutral-200 hover:border-primary-300"
      onClick={() => router.push(href)}
    >
      <div className="flex items-start gap-4">
        <div className="bg-primary-50 p-3 rounded-lg group-hover:bg-primary-100 transition-colors">
          <div className="text-primary-600">{icon}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 mb-3">{description}</p>
          <div className="flex items-center text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
            <span>View Report</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function ReportsPage() {
  const chartsSectionRef = useRef<HTMLDivElement>(null);
  const reportName = 'Reports Overview';

  const kpisForExport = [
    { label: 'Total Deposits', value: '₹2.45 Cr' },
    { label: 'Total Withdrawals', value: '₹1.82 Cr' },
    { label: 'Active Loans', value: '1,247' },
    { label: 'Loan Applications', value: '23' },
    { label: 'Disbursed Amount', value: '₹3.2 Cr' },
    { label: 'Outstanding Principal', value: '₹12.8 Cr' },
    { label: 'Collection Rate', value: '94.2%' },
    { label: 'Agent Cash-in-Hand', value: '₹45.8L' },
    { label: 'NPA / Delinquency', value: '3.8%' },
    { label: 'Net Interest Income', value: '₹28.5L' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Reports</h1>
            <p className="text-neutral-600">
              Comprehensive financial insights and analytics at your fingertips
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportChartAsPNG(chartsSectionRef.current, 'reports-charts', reportName)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 text-sm font-medium"
            >
              <ImageIcon className="h-4 w-4" />
              Export Charts
            </button>
            <button
              type="button"
              onClick={() => exportKPIsAsCSV(kpisForExport, 'reports-overview', reportName)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Export KPIs
            </button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <KPICard
            title="Total Deposits"
            value="₹2.45 Cr"
            subtitle="Today: ₹12.5L"
            icon={<CreditCard className="h-6 w-6 text-primary-600" />}
            trend={{ value: 12.5, isPositive: true }}
            iconBg="bg-primary-100"
          />
          <KPICard
            title="Total Withdrawals"
            value="₹1.82 Cr"
            subtitle="MTD: ₹45.2L"
            icon={<TrendingDown className="h-6 w-6 text-info-600" />}
            trend={{ value: 8.3, isPositive: false }}
            iconBg="bg-info-100"
          />
          <KPICard
            title="Active Loans"
            value="1,247"
            subtitle="YTD: ₹8.5 Cr"
            icon={<FileText className="h-6 w-6 text-success-600" />}
            trend={{ value: 15.2, isPositive: true }}
            iconBg="bg-success-100"
          />
          <KPICard
            title="Loan Applications"
            value="23"
            subtitle="Today"
            icon={<ClipboardList className="h-6 w-6 text-warning-600" />}
            trend={{ value: 22.1, isPositive: true }}
            iconBg="bg-warning-100"
          />
          <KPICard
            title="Disbursed Amount"
            value="₹3.2 Cr"
            subtitle="This Month"
            icon={<IndianRupee className="h-6 w-6 text-primary-600" />}
            trend={{ value: 18.7, isPositive: true }}
            iconBg="bg-primary-100"
          />
          <KPICard
            title="Outstanding Principal"
            value="₹12.8 Cr"
            subtitle="Total Portfolio"
            icon={<BarChart3 className="h-6 w-6 text-neutral-700" />}
            trend={{ value: 5.4, isPositive: false }}
            iconBg="bg-neutral-100"
          />
          <KPICard
            title="Collection Rate"
            value="94.2%"
            subtitle="Current Period"
            icon={<TrendingUp className="h-6 w-6 text-success-600" />}
            trend={{ value: 2.3, isPositive: true }}
            iconBg="bg-success-100"
          />
          <KPICard
            title="Agent Cash-in-Hand"
            value="₹45.8L"
            subtitle="Across All Agents"
            icon={<UserCheck className="h-6 w-6 text-info-600" />}
            trend={{ value: 1.2, isPositive: true }}
            iconBg="bg-info-100"
          />
          <KPICard
            title="NPA / Delinquency"
            value="3.8%"
            subtitle="Portfolio Risk"
            icon={<Shield className="h-6 w-6 text-error-600" />}
            trend={{ value: 0.5, isPositive: true }}
            iconBg="bg-error-100"
          />
          <KPICard
            title="Net Interest Income"
            value="₹28.5L"
            subtitle="MTD"
            icon={<Calculator className="h-6 w-6 text-primary-600" />}
            trend={{ value: 9.6, isPositive: true }}
            iconBg="bg-primary-100"
          />
        </div>

        {/* Charts Section */}
        <div ref={chartsSectionRef} className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Analytics Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Transaction Volume - Line Chart */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <LineChart className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Daily Transaction Volume
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={dailyTransactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#635BFF"
                    strokeWidth={2}
                    dot={{ fill: '#635BFF', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Disbursements by Category - Bar Chart */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Disbursements by Category
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={disbursementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="category"
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                  />
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
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Bar dataKey="amount" fill="#635BFF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Collection Distribution - Pie Chart */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Collection by Agent
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={collectionDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) =>
                      `${props.name}: ${((props.percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {collectionDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          </div>
        </div>

        {/* Quick Access Reports Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Quick Access Reports
            </h2>
            <p className="text-neutral-600">
              Navigate to detailed reports and analytics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickAccessCard
              title="Transactional Reports"
              description="View deposits, withdrawals, and transaction history with detailed filters and export options."
              icon={<Receipt className="h-6 w-6" />}
              href="/reports/transaction-reports"
            />
            <QuickAccessCard
              title="Loan Reports"
              description="Comprehensive loan portfolio analysis, disbursements, and repayment tracking."
              icon={<FileText className="h-6 w-6" />}
              href="/reports/loan-reports"
            />
            <QuickAccessCard
              title="Collections & Agent Reports"
              description="Agent performance metrics, collection efficiency, and field agent analytics."
              icon={<UserCheck className="h-6 w-6" />}
              href="/reports/collection-reports"
            />
            <QuickAccessCard
              title="Accounting Reports"
              description="Financial statements, profit & loss, balance sheets, and accounting summaries."
              icon={<Calculator className="h-6 w-6" />}
              href="/reports/accounting-reports"
            />
            <QuickAccessCard
              title="Compliance & Audit"
              description="Regulatory compliance reports, audit trails, and documentation for inspections."
              icon={<Shield className="h-6 w-6" />}
              href="/reports/compliance-reports"
            />
            <QuickAccessCard
              title="Performance Analytics"
              description="Advanced analytics, trends, forecasting, and business intelligence dashboards."
              icon={<Activity className="h-6 w-6" />}
              href="/reports/performance-analytics"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

