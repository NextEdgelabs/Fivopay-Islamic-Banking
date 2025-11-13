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
  CheckCircle,
  IndianRupee,
  Users,
  MapPin,
  Award,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Type definitions
interface AgentCollectionSummary {
  id: string;
  agentId: string;
  name: string;
  branch: string;
  totalCollected: number;
  deposited: number;
  pending: number;
  visits: number;
  successRate: number; // percentage
}

interface CollectionLog {
  id: string;
  transactionId: string;
  loanId: string;
  customer: string;
  agent: string;
  date: string;
  amount: number;
  mode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  status: 'Collected' | 'Pending' | 'Verified' | 'Rejected';
  receipt: string;
}

interface ReconciliationReport {
  id: string;
  agent: string;
  period: string;
  collected: number;
  deposited: number;
  variance: number;
  verifiedBy: string;
  verifiedDate?: string;
}

// Generate dummy data
const generateAgentSummaries = (): AgentCollectionSummary[] => {
  const agents: AgentCollectionSummary[] = [];
  const agentNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh',
    'Anjali Desai', 'Rohit Mehta', 'Kavita Nair', 'Suresh Iyer', 'Meera Joshi',
    'Arjun Rao', 'Divya Menon', 'Kiran Shetty', 'Pooja Gupta', 'Nikhil Verma'
  ];
  const branches = ['Main Branch', 'Downtown Branch', 'City Center', 'Suburban Branch', 'North Branch'];

  agentNames.forEach((name, index) => {
    const totalCollected = Math.floor(Math.random() * 500000) + 100000;
    const deposited = Math.floor(totalCollected * (0.7 + Math.random() * 0.25)); // 70-95% deposited
    const pending = totalCollected - deposited;
    const visits = Math.floor(Math.random() * 50) + 20;
    const successRate = 60 + Math.random() * 35; // 60-95%

    agents.push({
      id: `agent-${index + 1}`,
      agentId: `AGT${String(index + 1).padStart(4, '0')}`,
      name,
      branch: branches[Math.floor(Math.random() * branches.length)],
      totalCollected,
      deposited,
      pending,
      visits,
      successRate: parseFloat(successRate.toFixed(1)),
    });
  });

  return agents.sort((a, b) => b.totalCollected - a.totalCollected);
};

const generateCollectionLogs = (): CollectionLog[] => {
  const logs: CollectionLog[] = [];
  const agents = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Anjali Desai', 'Rohit Mehta'];
  const customers = ['Ramesh Kumar', 'Sunita Devi', 'Anil Mehta', 'Kavita Singh', 'Mohammed Ali', 'Lakshmi Nair', 'Suresh Reddy', 'Geeta Patel', 'Ravi Shankar'];
  const modes: CollectionLog['mode'][] = ['Cash', 'UPI', 'Bank Transfer', 'Cheque'];
  const statuses: CollectionLog['status'][] = ['Collected', 'Pending', 'Verified', 'Rejected'];

  for (let i = 0; i < 200; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    logs.push({
      id: `log-${i + 1}`,
      transactionId: `TXN${String(i + 1).padStart(8, '0')}`,
      loanId: `LOAN${String(Math.floor(Math.random() * 1000)).padStart(6, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      agent: agents[Math.floor(Math.random() * agents.length)],
      date: date.toISOString(),
      amount: Math.floor(Math.random() * 50000) + 1000,
      mode: modes[Math.floor(Math.random() * modes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      receipt: `RCP${String(i + 1).padStart(8, '0')}`,
    });
  }

  return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateReconciliationReports = (): ReconciliationReport[] => {
  const reports: ReconciliationReport[] = [];
  const agents = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Anjali Desai', 'Rohit Mehta'];
  const verifiers = ['Manager A', 'Manager B', 'Manager C', 'Supervisor X', 'Supervisor Y'];
  const months = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'];

  agents.forEach((agent, agentIndex) => {
    months.forEach((month, monthIndex) => {
      const collected = Math.floor(Math.random() * 300000) + 50000;
      const deposited = Math.floor(collected * (0.85 + Math.random() * 0.1)); // 85-95% deposited
      const variance = collected - deposited;
      const verifiedDate = new Date();
      verifiedDate.setMonth(verifiedDate.getMonth() - (months.length - monthIndex));

      reports.push({
        id: `recon-${agentIndex}-${monthIndex}`,
        agent,
        period: month,
        collected,
        deposited,
        variance,
        verifiedBy: verifiers[Math.floor(Math.random() * verifiers.length)],
        verifiedDate: verifiedDate.toISOString(),
      });
    });
  });

  return reports;
};

const allAgentSummaries = generateAgentSummaries();
const allCollectionLogs = generateCollectionLogs();
const allReconciliationReports = generateReconciliationReports();

// Heatmap component for Collections by Region
const RegionHeatmap: React.FC<{ data: { region: string; amount: number; color: string }[] }> = ({ data }) => {
  const maxAmount = Math.max(...data.map(d => d.amount));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((item) => {
        const intensity = (item.amount / maxAmount) * 100;
        const opacity = Math.max(0.3, intensity / 100);

        return (
          <div
            key={item.region}
            className="p-4 rounded-lg border-2 transition-all hover:shadow-md"
            style={{
              backgroundColor: `${item.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`,
              borderColor: item.color,
            }}
          >
            <div className="text-sm font-medium text-neutral-700 mb-1">{item.region}</div>
            <div className="text-lg font-bold text-neutral-900">
              ₹{item.amount.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-neutral-600 mt-1">
              {((item.amount / maxAmount) * 100).toFixed(0)}% of max
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function CollectionReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 15;

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    agent: '',
    branch: '',
    loanType: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(true);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCollections = allCollectionLogs.filter(
      log => new Date(log.date) >= today && log.status !== 'Rejected'
    ).reduce((sum, log) => sum + log.amount, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const mtdCollections = allCollectionLogs.filter(
      log => new Date(log.date) >= monthStart && log.status !== 'Rejected'
    ).reduce((sum, log) => sum + log.amount, 0);

    const totalDeposited = allAgentSummaries.reduce((sum, agent) => sum + agent.deposited, 0);
    const totalPending = allAgentSummaries.reduce((sum, agent) => sum + agent.pending, 0);

    const activeAgentsToday = allAgentSummaries.filter(agent => {
      // Simulate active agents (agents with collections today)
      return Math.random() > 0.3; // 70% active
    }).length;

    const avgSuccessRate = allAgentSummaries.reduce((sum, agent) => sum + agent.successRate, 0) / allAgentSummaries.length;

    return {
      todayCollections,
      mtdCollections,
      totalDeposited,
      totalPending,
      activeAgentsToday,
      avgSuccessRate: parseFloat(avgSuccessRate.toFixed(1)),
    };
  }, []);

  // Collections by Agent chart data
  const collectionsByAgentData = useMemo(() => {
    return allAgentSummaries
      .slice(0, 10) // Top 10 agents
      .map(agent => ({
        name: agent.name.split(' ')[0], // First name only for chart
        collected: agent.totalCollected,
        deposited: agent.deposited,
      }))
      .sort((a, b) => b.collected - a.collected);
  }, []);

  // Collections by Region heatmap data
  const regionData = useMemo(() => {
    const regions = [
      { region: 'North Zone', amount: 1250000, color: '#3B82F6' },
      { region: 'South Zone', amount: 980000, color: '#10B981' },
      { region: 'East Zone', amount: 750000, color: '#F59E0B' },
      { region: 'West Zone', amount: 1100000, color: '#EF4444' },
      { region: 'Central Zone', amount: 650000, color: '#8B5CF6' },
      { region: 'Northeast Zone', amount: 420000, color: '#EC4899' },
      { region: 'Coastal Zone', amount: 580000, color: '#06B6D4' },
      { region: 'Metro Zone', amount: 1500000, color: '#6366F1' },
    ];
    return regions.sort((a, b) => b.amount - a.amount);
  }, []);

  // Filter data
  const filteredSummaries = useMemo(() => {
    let filtered = [...allAgentSummaries];

    if (filters.agent) {
      filtered = filtered.filter(a => a.name === filters.agent);
    }
    if (filters.branch) {
      filtered = filtered.filter(a => a.branch === filters.branch);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.agentId.toLowerCase().includes(searchLower) ||
          a.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters]);

  const filteredLogs = useMemo(() => {
    let filtered = [...allCollectionLogs];

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(log => new Date(log.date) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(log => new Date(log.date) <= toDate);
    }
    if (filters.agent) {
      filtered = filtered.filter(log => log.agent === filters.agent);
    }
    if (filters.branch) {
      // Filter by branch indirectly through agent
      const branchAgents = allAgentSummaries.filter(a => a.branch === filters.branch).map(a => a.name);
      filtered = filtered.filter(log => branchAgents.includes(log.agent));
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.transactionId.toLowerCase().includes(searchLower) ||
          log.loanId.toLowerCase().includes(searchLower) ||
          log.customer.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters]);

  const filteredReconciliation = useMemo(() => {
    let filtered = [...allReconciliationReports];

    if (filters.agent) {
      filtered = filtered.filter(r => r.agent === filters.agent);
    }
    if (filters.dateFrom || filters.dateTo) {
      // Filter by period
      // Simplified - in real app would parse period string
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.agent.toLowerCase().includes(searchLower) ||
          r.period.toLowerCase().includes(searchLower)
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
  const uniqueAgents = Array.from(new Set(allAgentSummaries.map(a => a.name))).sort();
  const uniqueBranches = Array.from(new Set(allAgentSummaries.map(a => a.branch))).sort();
  const loanTypes = ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Vehicle Loan', 'Gold Loan'];

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      agent: '',
      branch: '',
      loanType: '',
      search: '',
    });
  };

  // Table columns
  const summaryColumns = [
    {
      key: 'agentId',
      header: 'Agent ID',
      sortable: true,
      width: '120px',
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      width: '180px',
      render: (_: any, row: AgentCollectionSummary) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-600">
              {row.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="font-medium text-neutral-900">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'branch',
      header: 'Branch',
      sortable: true,
      width: '140px',
    },
    {
      key: 'totalCollected',
      header: 'Total Collected',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'deposited',
      header: 'Deposited',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm text-success-600 font-medium">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'pending',
      header: 'Pending',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm text-warning-600 font-medium">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'visits',
      header: 'No. of Visits',
      sortable: true,
      width: '120px',
      render: (visits: number) => (
        <span className="text-sm text-neutral-700">{visits}</span>
      ),
    },
    {
      key: 'successRate',
      header: 'Success Rate',
      sortable: true,
      width: '120px',
      render: (rate: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-neutral-200 rounded-full h-2">
            <div
              className="bg-success-500 h-2 rounded-full"
              style={{ width: `${rate}%` }}
            />
          </div>
          <span className="text-sm font-medium text-neutral-700">{rate}%</span>
        </div>
      ),
    },
  ];

  const logColumns = [
    {
      key: 'transactionId',
      header: 'Tx ID',
      sortable: true,
      width: '140px',
    },
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
      key: 'agent',
      header: 'Agent',
      sortable: true,
      width: '140px',
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      width: '120px',
      render: (date: string) => new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      width: '120px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'mode',
      header: 'Mode',
      sortable: true,
      width: '120px',
      render: (mode: string) => (
        <Badge variant="neutral" className="text-xs">
          {mode}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '120px',
      render: (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
          'Collected': 'success',
          'Pending': 'warning',
          'Verified': 'success',
          'Rejected': 'error',
        };
        return <Badge variant={variants[status] || 'neutral'}>{status}</Badge>;
      },
    },
    {
      key: 'receipt',
      header: 'Receipt',
      sortable: true,
      width: '120px',
      render: (receipt: string) => (
        <span className="text-xs text-neutral-500 font-mono">{receipt}</span>
      ),
    },
  ];

  const reconciliationColumns = [
    {
      key: 'agent',
      header: 'Agent',
      sortable: true,
      width: '180px',
    },
    {
      key: 'period',
      header: 'Period',
      sortable: true,
      width: '120px',
    },
    {
      key: 'collected',
      header: 'Collected',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm font-semibold text-neutral-900">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'deposited',
      header: 'Deposited',
      sortable: true,
      width: '140px',
      render: (amount: number) => (
        <span className="text-sm text-success-600 font-medium">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'variance',
      header: 'Variance',
      sortable: true,
      width: '140px',
      render: (variance: number) => (
        <span
          className={`text-sm font-medium ${
            variance > 0 ? 'text-warning-600' : variance < 0 ? 'text-error-600' : 'text-neutral-600'
          }`}
        >
          {variance > 0 ? '+' : ''}₹{variance.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'verifiedBy',
      header: 'Verified By',
      sortable: true,
      width: '140px',
    },
    {
      key: 'verifiedDate',
      header: 'Verified Date',
      sortable: true,
      width: '140px',
      render: (date: string | undefined) =>
        date ? (
          new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        ) : (
          <span className="text-sm text-neutral-400">Not verified</span>
        ),
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
              { label: 'Collections & Agent Reports' },
            ]}
          />
          <h1 className="text-3xl font-bold text-neutral-900 mt-2">
            Collections & Agent Reports
          </h1>
          <p className="text-neutral-600 mt-1">
            Track loan recovery and field agent performance
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Collections</p>
                <p className="text-2xl font-bold text-neutral-900">
                  ₹{kpis.todayCollections.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  MTD: ₹{kpis.mtdCollections.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <IndianRupee className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Cash Deposited vs Pending</p>
                <p className="text-lg font-bold text-success-600">
                  ₹{kpis.totalDeposited.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-warning-600 mt-1">
                  Pending: ₹{kpis.totalPending.toLocaleString('en-IN')}
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
                <p className="text-sm text-neutral-600 mb-1">Agents Active Today</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.activeAgentsToday}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  of {allAgentSummaries.length} total agents
                </p>
              </div>
              <div className="bg-info-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-info-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Avg Collection Success Rate</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {kpis.avgSuccessRate}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success-600" />
                  <span className="text-xs text-success-600">+2.5% vs last month</span>
                </div>
              </div>
              <div className="bg-warning-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collections by Agent */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Collections by Agent
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionsByAgentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
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
                    formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <Legend />
                  <Bar dataKey="collected" fill="#635BFF" name="Total Collected" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="deposited" fill="#10B981" name="Deposited" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Collections by Region Heatmap */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Collections by Region
            </h3>
            <RegionHeatmap data={regionData} />
          </Card>
        </div>

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
                label="Agent"
                placeholder="All Agents"
                value={filters.agent}
                onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
                options={[
                  { value: '', label: 'All Agents' },
                  ...uniqueAgents.map((agent) => ({
                    value: agent,
                    label: agent,
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
              <Select
                label="Loan Type"
                placeholder="All Types"
                value={filters.loanType}
                onChange={(e) => setFilters({ ...filters, loanType: e.target.value })}
                options={[
                  { value: '', label: 'All Types' },
                  ...loanTypes.map((type) => ({
                    value: type,
                    label: type,
                  })),
                ]}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <Input
                  label="Search"
                  placeholder="Search by Agent ID, Transaction ID, Loan ID, or Customer..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedRows.size > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Mark as Verified:', Array.from(selectedRows));
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Verified ({selectedRows.size})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Approve Commission:', Array.from(selectedRows));
                  }}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Approve Commission ({selectedRows.size})
                </Button>
              </>
            )}
          </div>
          <Button 
            variant="primary"
            onClick={() => {
              let dataToExport: any[] = [];
              let filename = 'collection-reports';
              
              if (activeTab === 'summary') {
                dataToExport = filteredSummaries;
                filename = 'agent-collection-summary';
              } else if (activeTab === 'log') {
                dataToExport = filteredLogs;
                filename = 'collection-log';
              } else if (activeTab === 'reconciliation') {
                dataToExport = filteredReconciliation;
                filename = 'reconciliation-report';
              }
              
              exportToCSV(dataToExport, `${filename}-${new Date().toISOString().split('T')[0]}`);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report PDF
          </Button>
        </div>

        {/* Tabs */}
        <Card className="p-6">
          <Tabs
            tabs={[
              {
                id: 'summary',
                label: 'Agent Collection Summary',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredSummaries)}
                      columns={summaryColumns}
                      onRowClick={(row) => {
                        console.log('View agent:', row);
                      }}
                    />
                    {totalPages(filteredSummaries) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredSummaries.length)} of{' '}
                          {filteredSummaries.length} agents
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredSummaries)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'log',
                label: 'Collection Log',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredLogs)}
                      columns={logColumns}
                      onRowClick={(row) => {
                        console.log('View collection:', row);
                      }}
                    />
                    {totalPages(filteredLogs) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{' '}
                          {filteredLogs.length} collections
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredLogs)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'reconciliation',
                label: 'Reconciliation Report',
                content: (
                  <div className="mt-4">
                    <Table
                      data={getPaginatedData(filteredReconciliation)}
                      columns={reconciliationColumns}
                      onRowClick={(row) => {
                        console.log('View reconciliation:', row);
                      }}
                    />
                    {totalPages(filteredReconciliation) > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredReconciliation.length)} of{' '}
                          {filteredReconciliation.length} records
                        </p>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages(filteredReconciliation)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
            defaultTab="summary"
            onChange={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
              setSelectedRows(new Set());
            }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}

