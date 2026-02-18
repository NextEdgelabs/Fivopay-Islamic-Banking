'use client';

import React, { useState, useMemo, useRef } from 'react';
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
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import { exportChartAsPNG, exportKPIsAsCSV } from '@/lib/reportExport';
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

// Generate dummy data
const generateKYCExceptions = (): KYCException[] => {
  const exceptions: KYCException[] = [];
  const customers = [
    'Ramesh Kumar', 'Sunita Devi', 'Anil Mehta', 'Kavita Singh', 'Mohammed Ali',
    'Lakshmi Nair', 'Suresh Reddy', 'Geeta Patel', 'Ravi Shankar', 'Priya Desai',
    'Vikram Mehta', 'Anjali Joshi', 'Rajesh Iyer', 'Meera Nair', 'Kiran Shetty'
  ];
  const reasons = [
    'Incomplete Address Proof',
    'PAN Verification Failed',
    'Aadhaar Mismatch',
    'Photo Quality Issue',
    'Document Expired',
    'Signature Mismatch',
    'Missing Nominee Details',
    'Incomplete KYC Form',
  ];
  const actions = [
    'Resubmit Documents',
    'Update PAN Details',
    'Verify Aadhaar',
    'Upload Clear Photo',
    'Renew Documents',
    'Match Signature',
    'Complete Nominee Form',
    'Fill KYC Form',
  ];
  const statuses: KYCException['status'][] = ['Pending', 'In Review', 'Resolved', 'Escalated'];

  customers.forEach((customer, index) => {
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    exceptions.push({
      id: `kyc-${index + 1}`,
      customerId: `CUST${String(index + 1).padStart(6, '0')}`,
      name: customer,
      reason,
      actionNeeded: action,
      status,
    });
  });

  return exceptions;
};

const generateAMLAlerts = (): AMLAlert[] => {
  const alerts: AMLAlert[] = [];
  const customers = [
    'Ramesh Kumar', 'Sunita Devi', 'Anil Mehta', 'Kavita Singh', 'Mohammed Ali',
    'Lakshmi Nair', 'Suresh Reddy', 'Geeta Patel', 'Ravi Shankar', 'Priya Desai'
  ];
  const flagTypes = [
    'Large Transaction',
    'Unusual Pattern',
    'Multiple Small Transactions',
    'Cross-Border Transfer',
    'High-Risk Country',
    'PEP Match',
    'Sanctions List Match',
    'Rapid Movement',
  ];
  const severities: AMLAlert['severity'][] = ['Low', 'Medium', 'High', 'Critical'];
  const assignees = ['Compliance Officer A', 'Compliance Officer B', 'AML Analyst X', 'AML Analyst Y'];
  const resolutions = [
    'Verified - Legitimate',
    'False Positive',
    'Escalated to Authorities',
    'Account Frozen',
    'Under Investigation',
    'Pending Review',
  ];
  const statuses: AMLAlert['status'][] = ['Open', 'Under Investigation', 'Resolved', 'False Positive'];

  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    alerts.push({
      id: `aml-${i + 1}`,
      transactionId: `TXN${String(i + 1).padStart(8, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      flagType: flagTypes[Math.floor(Math.random() * flagTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
      resolution: resolutions[Math.floor(Math.random() * resolutions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return alerts.sort((a, b) => {
    const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
};

const generateAuditTrail = (): AuditTrail[] => {
  const trails: AuditTrail[] = [];
  const actions = [
    'Created', 'Updated', 'Deleted', 'Approved', 'Rejected',
    'Status Changed', 'Amount Modified', 'Document Uploaded', 'KYC Verified', 'Account Activated'
  ];
  const users = [
    'Admin User', 'Compliance Officer', 'Loan Officer', 'Branch Manager',
    'System Admin', 'Auditor', 'Supervisor'
  ];
  const entityTypes = ['Customer', 'Loan', 'Transaction', 'Account', 'Document', 'KYC'];

  for (let i = 0; i < 200; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    const action = actions[Math.floor(Math.random() * actions.length)];
    const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];

    trails.push({
      id: `audit-${i + 1}`,
      action: `${action} ${entityType}`,
      user: users[Math.floor(Math.random() * users.length)],
      timestamp: date.toISOString(),
      oldValue: action.includes('Created') ? '-' : `Old ${entityType} Value`,
      newValue: `New ${entityType} Value`,
      entityType,
    });
  }

  return trails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateRegulatorySubmissions = (): RegulatorySubmission[] => {
  const submissions: RegulatorySubmission[] = [];
  const reportNames = [
    'Monthly Transaction Report',
    'KYC Compliance Report',
    'AML Suspicious Activity Report',
    'Quarterly Financial Statement',
    'Annual Compliance Report',
    'Customer Due Diligence Report',
    'Risk Assessment Report',
    'Regulatory Filing - RBI',
  ];
  const periods = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Q1 2024', 'Q2 2024', 'FY 2023-24'];
  const regulators = ['RBI', 'SEBI', 'IRDAI', 'Ministry of Finance'];
  const statuses: RegulatorySubmission['status'][] = ['Draft', 'Submitted', 'Approved', 'Rejected'];

  reportNames.forEach((report, index) => {
    const period = periods[Math.floor(Math.random() * periods.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    submissions.push({
      id: `reg-${index + 1}`,
      reportName: report,
      period,
      submittedOn: date.toISOString(),
      status,
      regulator: regulators[Math.floor(Math.random() * regulators.length)],
    });
  });

  return submissions.sort((a, b) => new Date(b.submittedOn).getTime() - new Date(a.submittedOn).getTime());
};

const allKYCExceptions = generateKYCExceptions();
const allAMLAlerts = generateAMLAlerts();
const allAuditTrail = generateAuditTrail();
const allRegulatorySubmissions = generateRegulatorySubmissions();

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

  // Calculate KPIs
  const kpis = useMemo(() => {
    const kycPending = allKYCExceptions.filter(e => e.status === 'Pending' || e.status === 'In Review').length;
    const amlFlags = allAMLAlerts.filter(a => a.status === 'Open' || a.status === 'Under Investigation').length;
    const transactionsFlagged = allAMLAlerts.length;
    const regulatorySubmitted = allRegulatorySubmissions.filter(s => s.status === 'Submitted' || s.status === 'Approved').length;

    return {
      kycPending,
      amlFlags,
      transactionsFlagged,
      regulatorySubmitted,
    };
  }, []);

  // Chart data
  const alertSeverityData = useMemo(() => {
    const severityCounts = {
      Critical: allAMLAlerts.filter(a => a.severity === 'Critical').length,
      High: allAMLAlerts.filter(a => a.severity === 'High').length,
      Medium: allAMLAlerts.filter(a => a.severity === 'Medium').length,
      Low: allAMLAlerts.filter(a => a.severity === 'Low').length,
    };

    return [
      { name: 'Critical', value: severityCounts.Critical, color: '#DC2626' },
      { name: 'High', value: severityCounts.High, color: '#F59E0B' },
      { name: 'Medium', value: severityCounts.Medium, color: '#3B82F6' },
      { name: 'Low', value: severityCounts.Low, color: '#10B981' },
    ];
  }, []);

  const complianceTrendData = [
    { week: 'Week 1', alerts: 12, resolved: 8, compliance: 95 },
    { week: 'Week 2', alerts: 15, resolved: 12, compliance: 92 },
    { week: 'Week 3', alerts: 18, resolved: 15, compliance: 94 },
    { week: 'Week 4', alerts: 10, resolved: 9, compliance: 96 },
    { week: 'Week 5', alerts: 14, resolved: 11, compliance: 93 },
    { week: 'Week 6', alerts: 16, resolved: 14, compliance: 95 },
    { week: 'Week 7', alerts: 13, resolved: 10, compliance: 94 },
    { week: 'Week 8', alerts: 11, resolved: 9, compliance: 97 },
  ];

  // Filter data
  const filteredKYC = useMemo(() => {
    let filtered = [...allKYCExceptions];

    if (filters.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        e =>
          e.customerId.toLowerCase().includes(searchLower) ||
          e.name.toLowerCase().includes(searchLower) ||
          e.reason.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters]);

  const filteredAML = useMemo(() => {
    let filtered = [...allAMLAlerts];

    if (filters.severity) {
      filtered = filtered.filter(a => a.severity === filters.severity);
    }
    if (filters.status) {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.transactionId.toLowerCase().includes(searchLower) ||
          a.customer.toLowerCase().includes(searchLower) ||
          a.flagType.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters]);

  const filteredAudit = useMemo(() => {
    let filtered = [...allAuditTrail];

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(t => new Date(t.timestamp) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => new Date(t.timestamp) <= toDate);
    }
    if (filters.user) {
      filtered = filtered.filter(t => t.user === filters.user);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.action.toLowerCase().includes(searchLower) ||
          t.user.toLowerCase().includes(searchLower) ||
          t.entityType.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters]);

  const filteredRegulatory = useMemo(() => {
    let filtered = [...allRegulatorySubmissions];

    if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    if (filters.regulator) {
      filtered = filtered.filter(s => s.regulator === filters.regulator);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.reportName.toLowerCase().includes(searchLower) ||
          s.regulator.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters]);

  // Pagination
  const getPaginatedData = (data: any[]) => {
    return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };

  const totalPages = (data: any[]) => Math.ceil(data.length / itemsPerPage);

  // Get unique values for filters
  const uniqueUsers = Array.from(new Set(allAuditTrail.map(t => t.user))).sort();
  const uniqueRegulators = Array.from(new Set(allRegulatorySubmissions.map(s => s.regulator))).sort();

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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1 font-medium">KYC Pending Verifications</p>
                <p className="text-2xl font-bold text-blue-900">
                  {kpis.kycPending}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {allKYCExceptions.length} total exceptions
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
                  {allAMLAlerts.length} total alerts
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
                  {allRegulatorySubmissions.length} total reports
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <FileCheck className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </Card>
        </div>

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
            </div>
          </Card>

          {/* Compliance Trends */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Compliance Trends (Weekly)
            </h3>
            <div className="h-80">
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
            exportToCSV(filteredAudit, `audit-trail-${new Date().toISOString().split('T')[0]}`, [
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
            let dataToExport: any[] = [];
            let filename = 'compliance-reports';
            
            if (activeTab === 'kyc') {
              dataToExport = filteredKYC;
              filename = 'kyc-exceptions';
            } else if (activeTab === 'aml') {
              dataToExport = filteredAML;
              filename = 'aml-alerts';
            } else if (activeTab === 'regulatory') {
              dataToExport = filteredRegulatory;
              filename = 'regulatory-submissions';
            }
            
            exportToCSV(dataToExport, `${filename}-${new Date().toISOString().split('T')[0]}`);
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
                  ...uniqueUsers.map((user) => ({
                    value: user,
                    label: user,
                  })),
                ]}
              />
              <Select
                label="Regulator"
                placeholder="All Regulators"
                value={filters.regulator}
                onChange={(e) => setFilters({ ...filters, regulator: e.target.value })}
                options={[
                  { value: '', label: 'All Regulators' },
                  ...uniqueRegulators.map((regulator) => ({
                    value: regulator,
                    label: regulator,
                  })),
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
                    <Table
                      data={getPaginatedData(filteredKYC)}
                      columns={kycColumns}
                      onRowClick={(row) => {
                        console.log('View KYC exception:', row);
                      }}
                    />
                    {totalPages(filteredKYC) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredKYC.length)} of{' '}
                          {filteredKYC.length} exceptions
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredKYC)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'aml',
                label: 'AML Alerts',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredAML)}
                      columns={amlColumns}
                      onRowClick={(row) => {
                        console.log('View AML alert:', row);
                      }}
                    />
                    {totalPages(filteredAML) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredAML.length)} of{' '}
                          {filteredAML.length} alerts
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredAML)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'audit',
                label: 'Audit Trail',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredAudit)}
                      columns={auditColumns}
                      onRowClick={(row) => {
                        console.log('View audit trail:', row);
                      }}
                    />
                    {totalPages(filteredAudit) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredAudit.length)} of{' '}
                          {filteredAudit.length} entries
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredAudit)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'regulatory',
                label: 'Regulatory Submissions',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredRegulatory)}
                      columns={regulatoryColumns}
                      onRowClick={(row) => {
                        console.log('View regulatory submission:', row);
                      }}
                    />
                    {totalPages(filteredRegulatory) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredRegulatory.length)} of{' '}
                          {filteredRegulatory.length} submissions
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredRegulatory)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
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

