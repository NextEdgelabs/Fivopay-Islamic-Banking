"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { UserIcon, ChartBarIcon, PlusIcon, ListBulletIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useAppContext } from "@/app/context/AppContext";

const tabs = [
  { id: "overview", name: "Overview", icon: ChartBarIcon },
  { id: "list", name: "Customer List", icon: ListBulletIcon },
];

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { customers } = useAppContext();

  // Calculate analytics from real customer data
  const analytics = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'Active').length;
    const activeRate = totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0;
    
    // Calculate new customers this month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const newThisMonth = customers.filter(customer => {
      const joinDate = new Date(customer.joinDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;

    // Group customers by account type
    const accountTypes = customers.reduce((acc, customer) => {
      const type = customer.accountType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group customers by KYC status
    const kycStatuses = customers.reduce((acc, customer) => {
      const status = customer.kycStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = customers.filter(customer => {
      if (!customer.lastActivity) return false;
      // Simple check for recent activity based on lastActivity string
      return customer.lastActivity.includes('hour') || 
             customer.lastActivity.includes('minute') || 
             customer.lastActivity.includes('day');
    }).length;

    return {
      totalCustomers,
      activeCustomers,
      activeRate,
      newThisMonth,
      accountTypes,
      kycStatuses,
      recentActivity
    };
  }, [customers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stripe-text">Customer Management</h1>
          <p className="text-stripe-text-secondary">
            Manage customer relationships across multiple touchpoints
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-stripe-border">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-stripe-primary text-stripe-primary"
                    : "border-transparent text-stripe-text-secondary hover:text-stripe-text hover:border-stripe-border"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
              <div className="flex items-center">
                <UserIcon className="h-8 w-8 text-stripe-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stripe-text-secondary">Total Customers</p>
                  <p className="text-2xl font-bold text-stripe-text">{analytics.totalCustomers.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
              <div className="flex items-center">
                <PlusIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stripe-text-secondary">New This Month</p>
                  <p className="text-2xl font-bold text-stripe-text">{analytics.newThisMonth}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stripe-text-secondary">Active Rate</p>
                  <p className="text-2xl font-bold text-stripe-text">{analytics.activeRate}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stripe-text-secondary">Recent Activity</p>
                  <p className="text-2xl font-bold text-stripe-text">{analytics.recentActivity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Types Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
              <h3 className="text-lg font-medium text-stripe-text mb-4">Account Types Distribution</h3>
              <div className="space-y-4">
                {Object.entries(analytics.accountTypes).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stripe-text capitalize">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-stripe-primary h-2 rounded-full"
                          style={{ width: `${(count / analytics.totalCustomers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-stripe-text-secondary w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KYC Status Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
              <h3 className="text-lg font-medium text-stripe-text mb-4">KYC Verification Status</h3>
              <div className="space-y-4">
                {Object.entries(analytics.kycStatuses).map(([status, count]) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'Verified': return 'bg-green-500';
                      case 'Pending': return 'bg-yellow-500';
                      case 'Under Review': return 'bg-blue-500';
                      case 'Rejected': return 'bg-red-500';
                      default: return 'bg-gray-500';
                    }
                  };

                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stripe-text">{status}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`${getStatusColor(status)} h-2 rounded-full`}
                            style={{ width: `${(count / analytics.totalCustomers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-stripe-text-secondary w-8 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Customers */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-stripe-text">Recent Customers</h3>
              <Link
                href="/dashboard/customers/list"
                className="text-sm text-stripe-primary hover:text-stripe-primary/80"
              >
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-stripe-border">
                    <th className="text-left py-2 text-sm font-medium text-stripe-text-secondary">Name</th>
                    <th className="text-left py-2 text-sm font-medium text-stripe-text-secondary">Account Type</th>
                    <th className="text-left py-2 text-sm font-medium text-stripe-text-secondary">Status</th>
                    <th className="text-left py-2 text-sm font-medium text-stripe-text-secondary">Join Date</th>
                    <th className="text-left py-2 text-sm font-medium text-stripe-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.slice(0, 5).map((customer) => (
                    <tr key={customer.id} className="border-b border-stripe-border/50">
                      <td className="py-3 text-sm text-stripe-text">
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-stripe-text-secondary">{customer.email}</div>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-stripe-text capitalize">{customer.accountType}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                          customer.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-stripe-text-secondary">
                        {new Date(customer.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/dashboard/customers/${customer.id}`}
                          className="text-sm text-stripe-primary hover:text-stripe-primary/80"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
            <h2 className="text-lg font-semibold text-stripe-text mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/dashboard/customers/intake"
                className="p-4 border border-stripe-border rounded-lg hover:bg-stripe-background-light transition-colors text-center"
              >
                <UserIcon className="h-8 w-8 text-stripe-primary mx-auto mb-2" />
                <h3 className="font-medium text-stripe-text">Customer Intake</h3>
                <p className="text-sm text-stripe-text-secondary mt-1">Add new customers</p>
              </Link>
              
              <Link
                href="/dashboard/customers/list"
                className="p-4 border border-stripe-border rounded-lg hover:bg-stripe-background-light transition-colors text-center"
              >
                <ListBulletIcon className="h-8 w-8 text-stripe-primary mx-auto mb-2" />
                <h3 className="font-medium text-stripe-text">Customer List</h3>
                <p className="text-sm text-stripe-text-secondary mt-1">Manage existing customers</p>
              </Link>
              
              <div className="p-4 border border-stripe-border rounded-lg bg-stripe-background-light text-center">
                <ChartBarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-stripe-text">Analytics</h3>
                <p className="text-sm text-stripe-text-secondary mt-1">Coming soon</p>
              </div>
              
              <div className="p-4 border border-stripe-border rounded-lg bg-stripe-background-light text-center">
                <UserIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-stripe-text">Reports</h3>
                <p className="text-sm text-stripe-text-secondary mt-1">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "list" && (
        <div className="space-y-6">
          {/* KPIs for Customer List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
              <div className="flex items-center">
                <UserIcon className="h-8 w-8 text-stripe-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stripe-text-secondary">Total Customers</p>
                  <p className="text-2xl font-bold text-stripe-text">{analytics.totalCustomers.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stripe-text-secondary">Active Customers</p>
                  <p className="text-2xl font-bold text-stripe-text">{analytics.activeCustomers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stripe-border">
              <div className="flex items-center">
                <PlusIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-stripe-text-secondary">New This Month</p>
                  <p className="text-2xl font-bold text-stripe-text">{analytics.newThisMonth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white shadow-sm rounded-lg border border-stripe-border overflow-hidden">
            <div className="px-6 py-4 border-b border-stripe-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-stripe-text">Customer List</h3>
                <div className="flex items-center space-x-3">
                  <Link
                    href="/dashboard/customers/intake"
                    className="px-4 py-2 bg-stripe-primary text-white rounded-md hover:bg-stripe-primary/90 text-sm"
                  >
                    Add Customer
                  </Link>
                  <Link
                    href="/dashboard/customers/list"
                    className="px-4 py-2 border border-stripe-border text-stripe-text rounded-md hover:bg-stripe-background-light text-sm"
                  >
                    <ListBulletIcon className="h-4 w-4 mr-2 inline" />
                    View Full List
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-stripe-border">
                <thead className="bg-stripe-background-light">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Account Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      KYC Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stripe-border">
                  {customers.slice(0, 10).map((customer) => (
                    <tr key={customer.id} className="hover:bg-stripe-background-light">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-stripe-primary flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-stripe-text">
                              {customer.name}
                            </div>
                            <div className="text-sm text-stripe-text-secondary">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-stripe-text capitalize">
                          {customer.accountType.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-stripe-text">
                          {customer.accountBalance}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                          customer.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          customer.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.kycStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                          customer.kycStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          customer.kycStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                          customer.kycStatus === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.kycStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text-secondary">
                        {new Date(customer.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/customers/${customer.id}`}
                          className="text-stripe-primary hover:text-stripe-primary/80"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Show more link */}
            {customers.length > 10 && (
              <div className="px-6 py-4 border-t border-stripe-border bg-stripe-background-light">
                <Link
                  href="/dashboard/customers/list"
                  className="text-sm text-stripe-primary hover:text-stripe-primary/80 font-medium"
                >
                  View all {customers.length} customers →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
