"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  UserIcon, 
  PlusIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  ListBulletIcon,
  ChartBarIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  BuildingStorefrontIcon
} from "@heroicons/react/24/outline";

const tabs = [
  { id: "overview", name: "Overview", icon: ChartBarIcon },
  { id: "intake", name: "Customer Intake", icon: UserIcon },
  { id: "routing", name: "Request Routing", icon: ArrowPathIcon },
  { id: "cases", name: "Case Management", icon: ClipboardDocumentListIcon },
  { id: "list", name: "Customer List", icon: ListBulletIcon },
  { id: "analytics", name: "Analytics", icon: ChartBarIcon },
];

const recentIntakes = [
  {
    id: "INT-001",
    customerName: "Ahmad Hassan",
    channel: "Web Portal",
    requestType: "Account Inquiry", 
    priority: "Medium",
    status: "Pending",
    timestamp: "2 hours ago",
  },
  {
    id: "INT-002", 
    customerName: "Fatima Al-Zahra",
    channel: "Mobile App",
    requestType: "Islamic Loan Query",
    priority: "High",
    status: "In Progress",
    timestamp: "4 hours ago",
  },
  {
    id: "INT-003",
    customerName: "Omar Ibrahim", 
    channel: "Call Center",
    requestType: "Card Issue",
    priority: "Low",
    status: "Resolved",
    timestamp: "1 day ago",
  },
];

const channelStats = [
  {
    name: "Web Portal",
    icon: ComputerDesktopIcon,
    requests: 234,
    change: "+12%",
    color: "blue",
  },
  {
    name: "Mobile App", 
    icon: DevicePhoneMobileIcon,
    requests: 189,
    change: "+8%",
    color: "green",
  },
  {
    name: "Call Center",
    icon: PhoneIcon,
    requests: 156,
    change: "+5%", 
    color: "purple",
  },
  {
    name: "Branch Visit",
    icon: BuildingStorefrontIcon,
    requests: 98,
    change: "-2%",
    color: "orange",
  },
];

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-slate-600">
            Manage customer relationships and requests across all channels
          </p>
        </div>
        <Link 
          href="/dashboard/customers/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Customer
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Channel Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {channelStats.map((channel) => (
              <div key={channel.name} className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${
                      channel.color === 'blue' ? 'bg-blue-50' :
                      channel.color === 'green' ? 'bg-green-50' :
                      channel.color === 'purple' ? 'bg-purple-50' :
                      'bg-orange-50'
                    }`}>
                      <channel.icon className={`h-6 w-6 ${
                        channel.color === 'blue' ? 'text-blue-600' :
                        channel.color === 'green' ? 'text-green-600' :
                        channel.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{channel.requests}</p>
                    <p className={`text-sm ${
                      channel.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {channel.change}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-600">{channel.name}</p>
              </div>
            ))}
          </div>

          {/* Recent Intake Requests */}
          <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Recent Intake Requests</h3>
                <Link href="/dashboard/customers/intake" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Intakes
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Request Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentIntakes.map((intake) => (
                    <tr key={intake.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {intake.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {intake.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {intake.channel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {intake.requestType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          intake.priority === 'High' ? 'bg-red-100 text-red-800' :
                          intake.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {intake.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          intake.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          intake.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {intake.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {intake.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/customers/intake" className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <UserIcon className="h-8 w-8 text-blue-600 mb-4" />
              <h4 className="font-semibold text-slate-900 mb-2">Customer Intake</h4>
              <p className="text-sm text-slate-600">Process new customer requests from multiple channels</p>
            </Link>

            <Link href="/dashboard/customers/cases" className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <ClipboardDocumentListIcon className="h-8 w-8 text-green-600 mb-4" />
              <h4 className="font-semibold text-slate-900 mb-2">Manage Cases</h4>
              <p className="text-sm text-slate-600">Track and resolve customer service cases</p>
            </Link>

            <Link href="/dashboard/customers/analytics" className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <ChartBarIcon className="h-8 w-8 text-purple-600 mb-4" />
              <h4 className="font-semibold text-slate-900 mb-2">View Analytics</h4>
              <p className="text-sm text-slate-600">Customer insights and performance metrics</p>
            </Link>
          </div>
        </div>
      )}

      {/* Other tab contents can be implemented here */}
      {activeTab !== "overview" && (
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-slate-200 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {tabs.find(tab => tab.id === activeTab)?.name}
            </h3>
            <p className="text-slate-600 mb-6">
              This section is under development. Please use the dedicated pages for full functionality.
            </p>
            <div className="space-y-2">
              <Link 
                href={`/dashboard/customers/${activeTab}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Go to {tabs.find(tab => tab.id === activeTab)?.name}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 