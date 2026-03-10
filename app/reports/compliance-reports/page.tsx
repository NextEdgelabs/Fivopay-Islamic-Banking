'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Search,
  RefreshCw,
  Shield,
  AlertTriangle,
  FileCheck,
  ClipboardList,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  FileSpreadsheet,
  Lock,
  Activity,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import { exportChartAsPNG, exportKPIsAsCSV } from '@/lib/reportExport';
import { reportsService } from '@/services/reports.service';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Type definitions
interface KYCException {
  id: string;
  customerId: string;
  name: string;
  reason: string;
  actionNeeded: string;
  status: 'Pending' | 'In Review' | 'Resolved' | 'Escalated';
}

interface AMLAlert {
  id: string;
  transactionId: string;
  customer: string;
  flagType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  resolution: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'False Positive';
}

interface AuditTrail {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  oldValue: string;
  newValue: string;
  entityType: string;
}

interface RegulatorySubmission {
  id: string;
  reportName: string;
  period: string;
  submittedOn: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  regulator: string;
}

interface SummaryData {
  summary: {
    kycPending: number;
    amlFlags: number;
    transactionsFlagged: number;
    regulatorySubmitted: number;
  };
  charts: {
    severityDistribution: Array<{ name: string; value: number; color: string }>;
    complianceTrends: Array<{ week: string; alerts: number; resolved: number; compliance: number }>;
  };
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ComplianceReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('kyc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    severity: '',
    user: '',
    regulator: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(true);
  const chartsSectionRef = useRef<HTMLDivElement>(null);

  // API data states
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [tabData, setTabData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch summary data (KPIs + charts) — depends only on filters, not page
  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      setError(null);
      const params: Record<string, any> = {};
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.status) params.status = filters.status;
      if (filters.severity) params.severity = filters.severity;
      if (filters.search) params.search = filters.search;
      const response = await reportsService.getComplianceSummary(params);
      setSummaryData(response.data as any);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch compliance summary');
    } finally {
      setSummaryLoading(false);
    }
  }, [filters]);

  // Fetch tab-specific data with server-side pagination
  const fetchTabData = useCallback(async () => {
    try {
      setTabLoading(true);
      setError(null);
      const params: Record<string, any> = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.status) params.status = filters.status;
      if (filters.severity) params.severity = filters.severity;
      if (filters.user) params.user = filters.user;
      if (filters.regulator) params.regulator = filters.regulator;
      if (filters.search) params.search = filters.search;

      switch (activeTab) {
        case 'kyc': {
          const res = await reportsService.getComplianceKycExceptions(params);
          setTabData(res.data.exceptions || []);
          setPagination(res.data.pagination || null);
          break;
        }
        case 'aml': {
          const res = await reportsService.getComplianceAmlAlerts(params);
          setTabData(res.data.alerts || []);
          setPagination(res.data.pagination || null);
          break;
        }
        case 'audit': {
          const res = await reportsService.getComplianceAuditTrail(params);
          setTabData(res.data.auditTrail || []);
          setPagination(res.data.pagination || null);
          break;
        }
        case 'regulatory': {
          const res = await reportsService.getComplianceRegulatorySubmissions(params);
          setTabData(res.data.submissions || []);
          setPagination(res.data.pagination || null);
          break;
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch data');
    } finally {
      setTabLoading(false);
    }
  }, [activeTab, currentPage, filters]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchTabData();
  }, [fetchTabData]);

  // Derived values from API state
  const kpis = summaryData?.summary ?? {
    kycPending: 0,
    amlFlags: 0,
    transactionsFlagged: 0,
    regulatorySubmitted: 0,
  };
  const alertSeverityData = summaryData?.charts?.severityDistribution ?? [];
  const complianceTrendData = summaryData?.charts?.complianceTrends ?? [];

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: '',
      severity: '',
      user: '',
      regulator: '',
      search: '',
    });
    setCurrentPage(1);
  };

  // Table columns
  const kycColumns = [
    {
      key: 'customerId',
      header: 'Customer ID',
      sortable: true,
      width: '140px',
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      width: '180px',
    },
    {
      key: 'reason',
      header: 'Reason',
      sortable: true,
      width: '200px',
    },
    {
      key: 'actionNeeded',
      header: 'Action Needed',
      sortable: true,
      width: '200px',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '140px',
      render: (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'primary'> = {
          'Pending': 'warning',
          'In Review': 'primary',
          'Resolved': 'success',
          'Escalated': 'error',
        };
        return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
      },
    },
  ];

  const amlColumns = [
    {
      key: 'transactionId',
      header: 'Tx ID',
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
      key: 'flagType',
      header: 'Flag Type',
      sortable: true,
      width: '180px',
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      width: '120px',
      render: (severity: string) => {
        const colors: Record<string, string> = {
          'Critical': 'bg-red-100 text-red-700 border-red-200',
          'High': 'bg-orange-100 text-orange-700 border-orange-200',
          'Medium': 'bg-blue-100 text-blue-700 border-blue-200',
          'Low': 'bg-green-100 text-green-700 border-green-200',
        };
        return (
          <Badge className={`${colors[severity] || ''} border`}>{severity}</Badge>
        );
      },
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      sortable: true,
      width: '180px',
    },
    {
      key: 'resolution',
      header: 'Resolution',
      sortable: true,
      width: '200px',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '140px',
      render: (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
          'Open': 'error',
          'Under Investigation': 'warning',
          'Resolved': 'success',
          'False Positive': 'neutral',
        };
        return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
      },
    },
  ];

  const auditColumns = [
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      width: '200px',
    },
    {
      key: 'user',
      header: 'User',
      sortable: true,
      width: '160px',
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      width: '180px',
      render: (timestamp: string) => (
        <div>
          <p className="text-sm text-neutral-900">
            {new Date(timestamp).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs text-neutral-500">
            {new Date(timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ),
    },
    {
      key: 'oldValue',
      header: 'Old Value',
      sortable: true,
      width: '160px',
      render: (value: string) => (
        <span className="text-xs text-neutral-600 font-mono">{value}</span>
      ),
    },
    {
      key: 'newValue',
      header: 'New Value',
      sortable: true,
      width: '160px',
      render: (value: string) => (
        <span className="text-xs text-neutral-900 font-mono">{value}</span>
      ),
    },
  ];

  const regulatoryColumns = [
    {
      key: 'reportName',
      header: 'Report Name',
      sortable: true,
      width: '250px',
    },
    {
      key: 'period',
      header: 'Period',
      sortable: true,
      width: '120px',
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
      key: 'regulator',
      header: 'Regulator',
      sortable: true,
      width: '120px',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '120px',
      render: (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'primary'> = {
          'Draft': 'neutral',
          'Submitted': 'primary',
          'Approved': 'success',
          'Rejected': 'error',
        };
        return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
      },
    },
  ];

  // Pagination helpers for display text
  const paginationStart = pagination ? (pagination.currentPage - 1) * itemsPerPage + 1 : 0;
  const paginationEnd = pagination
    ? Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)
    : 0;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Reports', href: '/reports' },
                { label: 'Compliance & Audit Reports' },
              ]}
            />
            <h1 className="text-3xl font-bold text-neutral-900 mt-2">
              Compliance & Audit Reports
            </h1>
            <p className="text-neutral-600 mt-1">
              Regulatory compliance, KYC verification, and audit trail monitoring
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => exportChartAsPNG(chartsSectionRef.current, 'compliance-charts', 'Compliance Reports')}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Export Charts
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              exportKPIsAsCSV(
                [
                  { label: 'KYC Pending Verifications', value: String(kpis.kycPending) },
                  { label: 'AML Flags Raised', value: String(kpis.amlFlags) },
                  { label: 'Transactions Flagged', value: String(kpis.transactionsFlagged) },
                  { label: 'Regulatory Reports Submitted', value: String(kpis.regulatorySubmitted) },
                ],
                'compliance-reports',
                'Compliance & Audit Reports'
              )
            }
          >
            <Download className="h-4 w-4 mr-2" />
            Export KPIs
          </Button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchSummary();
                fetchTabData();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* KPI Cards */}
        {summaryLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-neutral-600">Loading summary...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 mb-1 font-medium">KYC Pending Verifications</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {kpis.kycPending}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Pending verification
                  </p>
                </div>
                <div className="bg-blue-200 p-3 rounded-lg">
                  <UserCheck className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 mb-1 font-medium">AML Flags Raised</p>
                  <p className="text-2xl font-bold text-red-900">
                    {kpis.amlFlags}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Active investigations
                  </p>
                </div>
                <div className="bg-red-200 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-700" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 mb-1 font-medium">Transactions Flagged</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {kpis.transactionsFlagged}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    For review
                  </p>
                </div>
                <div className="bg-orange-200 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-orange-700" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 mb-1 font-medium">Regulatory Reports Submitted</p>
                  <p className="text-2xl font-bold text-green-900">
                    {kpis.regulatorySubmitted}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Reports filed
                  </p>
                </div>
                <div className="bg-green-200 p-3 rounded-lg">
                  <FileCheck className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div ref={chartsSectionRef} className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Compliance Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alert Severity Donut Chart */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Alert Severity Distribution
            </h3>
            <div className="h-80">
              {summaryLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : alertSeverityData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  No severity data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alertSeverityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={(props: any) => `${props.name}: ${props.value}`}
                    >
                      {alertSeverityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Compliance Trends */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Compliance Trends (Weekly)
            </h3>
            <div className="h-80">
              {summaryLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : complianceTrendData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  No trend data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="alerts" fill="#EF4444" name="Alerts" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="resolved" fill="#10B981" name="Resolved" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="primary" onClick={() => {
            console.log('Create Case');
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Case
          </Button>
          <Button variant="outline" onClick={() => {
            exportToCSV(tabData, `audit-trail-${new Date().toISOString().split('T')[0]}`, [
              { key: 'action', label: 'Action' },
              { key: 'user', label: 'User' },
              { key: 'timestamp', label: 'Timestamp' },
              { key: 'oldValue', label: 'Old Value' },
              { key: 'newValue', label: 'New Value' },
              { key: 'entityType', label: 'Entity Type' },
            ]);
          }}>
            <Download className="h-4 w-4 mr-2" />
            Download Audit Log (CSV)
          </Button>
          <Button variant="outline" onClick={() => {
            let filename = 'compliance-reports';

            if (activeTab === 'kyc') {
              filename = 'kyc-exceptions';
            } else if (activeTab === 'aml') {
              filename = 'aml-alerts';
            } else if (activeTab === 'regulatory') {
              filename = 'regulatory-submissions';
            } else if (activeTab === 'audit') {
              filename = 'audit-trail';
            }

            exportToCSV(tabData, `${filename}-${new Date().toISOString().split('T')[0]}`);
          }}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-white border border-neutral-200">
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
                label="Status"
                placeholder="All Statuses"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'In Review', label: 'In Review' },
                  { value: 'Resolved', label: 'Resolved' },
                  { value: 'Open', label: 'Open' },
                  { value: 'Under Investigation', label: 'Under Investigation' },
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Submitted', label: 'Submitted' },
                  { value: 'Approved', label: 'Approved' },
                ]}
              />
              <Select
                label="Severity"
                placeholder="All Severities"
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                options={[
                  { value: '', label: 'All Severities' },
                  { value: 'Critical', label: 'Critical' },
                  { value: 'High', label: 'High' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Low', label: 'Low' },
                ]}
              />
              <Select
                label="User"
                placeholder="All Users"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                options={[
                  { value: '', label: 'All Users' },
                  { value: 'Admin User', label: 'Admin User' },
                  { value: 'Auditor', label: 'Auditor' },
                  { value: 'Branch Manager', label: 'Branch Manager' },
                  { value: 'Compliance Officer', label: 'Compliance Officer' },
                  { value: 'Loan Officer', label: 'Loan Officer' },
                  { value: 'Supervisor', label: 'Supervisor' },
                  { value: 'System Admin', label: 'System Admin' },
                ]}
              />
              <Select
                label="Regulator"
                placeholder="All Regulators"
                value={filters.regulator}
                onChange={(e) => setFilters({ ...filters, regulator: e.target.value })}
                options={[
                  { value: '', label: 'All Regulators' },
                  { value: 'IRDAI', label: 'IRDAI' },
                  { value: 'Ministry of Finance', label: 'Ministry of Finance' },
                  { value: 'RBI', label: 'RBI' },
                  { value: 'SEBI', label: 'SEBI' },
                ]}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <Input
                  label="Search"
                  placeholder="Search by Customer ID, Transaction ID, Report Name, or User..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Tabs */}
        <Card className="p-6 bg-white border border-neutral-200">
          <Tabs
            tabs={[
              {
                id: 'kyc',
                label: 'KYC Exceptions',
                content: (
                  <div className="mt-4">
                    {tabLoading && activeTab === 'kyc' ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                        <span className="ml-2 text-neutral-600">Loading KYC exceptions...</span>
                      </div>
                    ) : activeTab === 'kyc' && tabData.length === 0 ? (
                      <div className="text-center py-12 text-neutral-500">No KYC exceptions found.</div>
                    ) : activeTab === 'kyc' ? (
                      <>
                        <Table
                          data={tabData}
                          columns={kycColumns}
                          onRowClick={(row) => {
                            console.log('View KYC exception:', row);
                          }}
                        />
                        {pagination && pagination.totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {paginationStart} to{' '}
                              {paginationEnd} of{' '}
                              {pagination.totalItems} exceptions
                            </p>
                            <Pagination
                              currentPage={pagination.currentPage}
                              totalPages={pagination.totalPages}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                ),
              },
              {
                id: 'aml',
                label: 'AML Alerts',
                content: (
                  <div className="mt-4">
                    {tabLoading && activeTab === 'aml' ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                        <span className="ml-2 text-neutral-600">Loading AML alerts...</span>
                      </div>
                    ) : activeTab === 'aml' && tabData.length === 0 ? (
                      <div className="text-center py-12 text-neutral-500">No AML alerts found.</div>
                    ) : activeTab === 'aml' ? (
                      <>
                        <Table
                          data={tabData}
                          columns={amlColumns}
                          onRowClick={(row) => {
                            console.log('View AML alert:', row);
                          }}
                        />
                        {pagination && pagination.totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {paginationStart} to{' '}
                              {paginationEnd} of{' '}
                              {pagination.totalItems} alerts
                            </p>
                            <Pagination
                              currentPage={pagination.currentPage}
                              totalPages={pagination.totalPages}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                ),
              },
              {
                id: 'audit',
                label: 'Audit Trail',
                content: (
                  <div className="mt-4">
                    {tabLoading && activeTab === 'audit' ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                        <span className="ml-2 text-neutral-600">Loading audit trail...</span>
                      </div>
                    ) : activeTab === 'audit' && tabData.length === 0 ? (
                      <div className="text-center py-12 text-neutral-500">No audit entries found.</div>
                    ) : activeTab === 'audit' ? (
                      <>
                        <Table
                          data={tabData}
                          columns={auditColumns}
                          onRowClick={(row) => {
                            console.log('View audit trail:', row);
                          }}
                        />
                        {pagination && pagination.totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {paginationStart} to{' '}
                              {paginationEnd} of{' '}
                              {pagination.totalItems} entries
                            </p>
                            <Pagination
                              currentPage={pagination.currentPage}
                              totalPages={pagination.totalPages}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                ),
              },
              {
                id: 'regulatory',
                label: 'Regulatory Submissions',
                content: (
                  <div className="mt-4">
                    {tabLoading && activeTab === 'regulatory' ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                        <span className="ml-2 text-neutral-600">Loading regulatory submissions...</span>
                      </div>
                    ) : activeTab === 'regulatory' && tabData.length === 0 ? (
                      <div className="text-center py-12 text-neutral-500">No regulatory submissions found.</div>
                    ) : activeTab === 'regulatory' ? (
                      <>
                        <Table
                          data={tabData}
                          columns={regulatoryColumns}
                          onRowClick={(row) => {
                            console.log('View regulatory submission:', row);
                          }}
                        />
                        {pagination && pagination.totalPages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-neutral-600">
                              Showing {paginationStart} to{' '}
                              {paginationEnd} of{' '}
                              {pagination.totalItems} submissions
                            </p>
                            <Pagination
                              currentPage={pagination.currentPage}
                              totalPages={pagination.totalPages}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                ),
              },
            ]}
            defaultTab="kyc"
            onChange={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
            }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
