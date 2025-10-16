'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  StatsCard,
  Card,
  Table,
  Badge,
  Button,
  Tabs,
  Avatar,
  ProgressBar,
  Alert,
} from '@/components/ui';
import {
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  CreditCard,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Search,
  Settings,
  LogOut,
  Home,
  UserCircle,
  Briefcase,
  PiggyBank,
  Package,
  Menu,
} from 'lucide-react';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample data for recent transactions
  const recentTransactions = [
    {
      id: 'TXN001',
      customer: 'Ahmed Hassan',
      type: 'Deposit',
      amount: 385000, // ₹3,85,000
      date: '2025-10-15',
      status: 'Completed',
    },
    {
      id: 'TXN002',
      customer: 'Fatima Ali',
      type: 'Withdrawal',
      amount: -192500, // -₹1,92,500
      date: '2025-10-15',
      status: 'Completed',
    },
    {
      id: 'TXN003',
      customer: 'Mohammed Khan',
      type: 'Transfer',
      amount: 1155000, // ₹11,55,000
      date: '2025-10-14',
      status: 'Pending',
    },
    {
      id: 'TXN004',
      customer: 'Aisha Rahman',
      type: 'Deposit',
      amount: 577500, // ₹5,77,500
      date: '2025-10-14',
      status: 'Completed',
    },
  ];

  const transactionColumns = [
    {
      key: 'id',
      header: 'Transaction ID',
      sortable: true,
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
    },
    {
      key: 'type',
      header: 'Type',
      render: (value: string) => (
        <Badge
          variant={
            value === 'Deposit'
              ? 'success'
              : value === 'Withdrawal'
              ? 'warning'
              : 'primary'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value: number) => (
        <span
          className={`font-semibold ${
            value > 0 ? 'text-success-600' : 'text-error-600'
          }`}
        >
          ₹{Math.abs(value).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Completed' ? 'success' : 'warning'}>
          {value}
        </Badge>
      ),
    },
  ];

  // Sample pending loan applications
  const pendingLoans = [
    { name: 'Sarah Ahmed', amount: 3850000, type: 'Business Loan', days: 2 }, // ₹38,50,000
    { name: 'Omar Yusuf', amount: 1925000, type: 'Personal Loan', days: 5 }, // ₹19,25,000
    { name: 'Layla Ibrahim', amount: 7700000, type: 'Home Finance', days: 7 }, // ₹77,00,000
  ];

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <OverviewTab />,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      content: (
        <div className="mt-4">
          <Table
            data={recentTransactions}
            columns={transactionColumns}
            onRowClick={(row) => console.log('Transaction clicked:', row)}
          />
        </div>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: <AnalyticsTab />,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-border-light transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-light">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-stripe flex items-center justify-center">
                <span className="text-sm font-bold text-white">FP</span>
              </div>
              <span className="font-bold text-neutral-900">FivoPay</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary-500 rounded-stripe flex items-center justify-center mx-auto">
              <span className="text-sm font-bold text-white">FP</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-neutral-500 hover:text-neutral-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<Home />} label="Dashboard" active sidebarOpen={sidebarOpen} />
          <NavItem icon={<Users />} label="Customers" sidebarOpen={sidebarOpen} href="/customers" />
          <NavItem icon={<Building />} label="Branches" sidebarOpen={sidebarOpen} href="/branches" />
          <NavItem icon={<Briefcase />} label="Loans" sidebarOpen={sidebarOpen} href="/loans" />
          <NavItem icon={<PiggyBank />} label="Deposits" sidebarOpen={sidebarOpen} href="/deposits" />
          <NavItem icon={<Package />} label="Products" sidebarOpen={sidebarOpen} href="/products" />
          <NavItem icon={<Settings />} label="Settings" sidebarOpen={sidebarOpen} href="/settings" />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border-light">
          <div className="flex items-center gap-3">
            <Avatar size="md" fallback="Admin User" />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">Admin User</p>
                <p className="text-xs text-neutral-500 truncate">admin@fivopay.com</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <Link href="/login">
              <Button variant="outline" size="sm" fullWidth className="mt-3">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-neutral-500 hover:text-neutral-700 hidden lg:block"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search customers, transactions..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-stripe text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-stripe transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
            </button>
            <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-stripe transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Alert */}
          <div className="mb-6">
            <Alert
              variant="info"
              title="System Update"
              message="A new version of the system will be deployed tonight at 11 PM. Expected downtime: 15 minutes."
              dismissible
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Deposits"
              value="₹18.5 Cr"
              icon={<DollarSign className="h-6 w-6" />}
              trend={{ value: 12.5, isPositive: true }}
              description="vs last month"
            />
            <StatsCard
              title="Active Customers"
              value="3,847"
              icon={<Users className="h-6 w-6" />}
              trend={{ value: 8.2, isPositive: true }}
              description="vs last month"
            />
            <StatsCard
              title="Active Loans"
              value="156"
              icon={<FileText className="h-6 w-6" />}
              trend={{ value: 3.1, isPositive: false }}
              description="vs last month"
            />
            <StatsCard
              title="Total Branches"
              value="24"
              icon={<Building className="h-6 w-6" />}
              description="across regions"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Recent Transactions</h3>
                  <Link href="/transactions">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <Table data={recentTransactions} columns={transactionColumns} />
              </Card>
            </div>

            {/* Pending Loan Applications */}
            <div>
              <Card>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Pending Loan Applications
                </h3>
                <div className="space-y-4">
                  {pendingLoans.map((loan, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 hover:bg-neutral-50 rounded-stripe transition-colors cursor-pointer"
                    >
                      <Avatar size="sm" fallback={loan.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {loan.name}
                        </p>
                        <p className="text-xs text-neutral-500">{loan.type}</p>
                        <p className="text-sm font-semibold text-primary-600 mt-1">
                          ₹{loan.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <Badge variant="warning" size="sm">
                        {loan.days}d
                      </Badge>
                    </div>
                  ))}
                  <Link href="/loans">
                    <Button variant="outline" size="sm" fullWidth>
                      Review All Applications
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="primary" fullWidth>
                    <Users className="h-4 w-4 mr-2" />
                    Add New Customer
                  </Button>
                  <Button variant="outline" fullWidth>
                    <Briefcase className="h-4 w-4 mr-2" />
                    New Loan Application
                  </Button>
                  <Button variant="outline" fullWidth>
                    <PiggyBank className="h-4 w-4 mr-2" />
                    Open Deposit Account
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Tabs Section */}
          <Card>
            <Tabs tabs={tabs} />
          </Card>
        </main>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({
  icon,
  label,
  active = false,
  sidebarOpen,
  href = '#',
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  sidebarOpen: boolean;
  href?: string;
}) {
  const content = (
    <>
      <span className={`${active ? 'text-primary-600' : 'text-neutral-600'}`}>{icon}</span>
      {sidebarOpen && (
        <span className={active ? 'text-primary-600 font-medium' : 'text-neutral-700'}>
          {label}
        </span>
      )}
    </>
  );

  const className = `flex items-center gap-3 px-3 py-2 rounded-stripe transition-colors ${
    active
      ? 'bg-primary-50 text-primary-600'
      : 'text-neutral-700 hover:bg-neutral-100'
  } ${!sidebarOpen ? 'justify-center' : ''}`;

  if (href === '#') {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

// Overview Tab Component
function OverviewTab() {
  return (
    <div className="mt-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-neutral-700 mb-4">Loan Portfolio Distribution</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">Business Loans</span>
                <span className="text-sm font-semibold text-neutral-900">45%</span>
              </div>
              <ProgressBar value={45} variant="primary" size="sm" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">Personal Loans</span>
                <span className="text-sm font-semibold text-neutral-900">30%</span>
              </div>
              <ProgressBar value={30} variant="success" size="sm" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">Home Finance</span>
                <span className="text-sm font-semibold text-neutral-900">25%</span>
              </div>
              <ProgressBar value={25} variant="warning" size="sm" />
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-neutral-700 mb-4">Monthly Growth</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-stripe">
              <div>
                <p className="text-sm text-neutral-600">New Customers</p>
                <p className="text-2xl font-bold text-success-700">+284</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-success-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-stripe">
              <div>
                <p className="text-sm text-neutral-600">Deposits</p>
                <p className="text-2xl font-bold text-primary-700">₹1.2 Cr</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-primary-500" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  return (
    <div className="mt-4">
      <Card>
        <h4 className="text-lg font-semibold text-neutral-900 mb-4">Performance Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-border-light rounded-stripe">
            <p className="text-sm text-neutral-600 mb-2">Approval Rate</p>
            <p className="text-3xl font-bold text-success-600">87%</p>
            <p className="text-xs text-neutral-500 mt-1">+5% from last month</p>
          </div>
          <div className="text-center p-4 border border-border-light rounded-stripe">
            <p className="text-sm text-neutral-600 mb-2">Avg. Processing Time</p>
            <p className="text-3xl font-bold text-primary-600">2.4d</p>
            <p className="text-xs text-neutral-500 mt-1">-0.3d from last month</p>
          </div>
          <div className="text-center p-4 border border-border-light rounded-stripe">
            <p className="text-sm text-neutral-600 mb-2">Customer Satisfaction</p>
            <p className="text-3xl font-bold text-warning-600">4.8</p>
            <p className="text-xs text-neutral-500 mt-1">+0.2 from last month</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
