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
  BuildingStorefrontIcon,
  UserPlusIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  TrashIcon,
  PencilSquareIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
import { useAppContext, Customer } from "@/app/context/AppContext";

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
    requestType: "Loan Query",
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

// Customer List Component
const CustomerListComponent = () => {
  const { customers, deleteCustomer } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Filter and sort customers
  const filteredCustomers = customers.filter(customer => {
    // Apply search filter
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    if (filter === "all") return matchesSearch;
    return matchesSearch && customer.status.toLowerCase() === filter.toLowerCase();
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let valueA: string | number | Date, valueB: string | number | Date;
    
    // Determine which property to sort by
    switch (sortBy) {
      case "name":
        valueA = a.name;
        valueB = b.name;
        break;
      case "date":
        valueA = new Date(a.joinDate);
        valueB = new Date(b.joinDate);
        break;
      case "balance":
        valueA = parseFloat(a.accountBalance.replace(/[^0-9.-]+/g, "")) || 0;
        valueB = parseFloat(b.accountBalance.replace(/[^0-9.-]+/g, "")) || 0;
        break;
      default:
        valueA = a[sortBy as keyof Customer] || "";
        valueB = b[sortBy as keyof Customer] || "";
    }
    
    // Determine sort direction
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Export functions
  const exportToCSV = (data: Customer[], filename: string) => {
    const headers = [
      'Customer ID',
      'Name',
      'Email',
      'Phone',
      'Account Type',
      'Account Balance',
      'Status',
      'KYC Status',
      'Verification Level',
      'Join Date',
      'Last Activity'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(customer => [
        customer.id,
        `"${customer.name}"`,
        customer.email,
        customer.phone,
        customer.accountType,
        customer.accountBalance,
        customer.status,
        customer.kycStatus,
        customer.verificationLevel,
        customer.joinDate,
        customer.lastActivity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data: Customer[], filename: string) => {
    // For Excel export, we'll use a simple CSV format that Excel can open
    // In a real application, you might want to use a library like xlsx
    exportToCSV(data, filename.replace('.xlsx', '.csv'));
  };

  const handleExport = (format: 'csv' | 'excel', exportAll: boolean = false) => {
    const dataToExport = exportAll ? customers : sortedCustomers;
    const timestamp = new Date().toISOString().split('T')[0];
    const count = dataToExport.length;
    
    if (format === 'csv') {
      exportToCSV(dataToExport, `customers_${exportAll ? 'all' : 'filtered'}_${timestamp}.csv`);
    } else {
      exportToExcel(dataToExport, `customers_${exportAll ? 'all' : 'filtered'}_${timestamp}.xlsx`);
    }
    
    setShowExportMenu(false);
  };

  // Toggle sort direction
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Handle customer selection
  const toggleSelectCustomer = (id: string) => {
    setSelectedCustomers(prev => 
      prev.includes(id) 
        ? prev.filter(customerId => customerId !== id)
        : [...prev, id]
    );
  };

  // Handle bulk selection
  const toggleSelectAll = () => {
    if (selectedCustomers.length === sortedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(sortedCustomers.map(customer => customer.id));
    }
  };

  // Handle customer deletion
  const handleDeleteCustomer = (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteCustomer = () => {
    if (confirmDelete) {
      deleteCustomer(confirmDelete);
      setConfirmDelete(null);
      setSelectedCustomers(prev => prev.filter(id => id !== confirmDelete));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCustomers.length} customers?`)) {
      selectedCustomers.forEach(id => deleteCustomer(id));
      setSelectedCustomers([]);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: Customer["status"] }) => {
    let bgColor = "bg-slate-100 text-slate-800";
    
    switch (status) {
      case "Active":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "Inactive":
        bgColor = "bg-red-100 text-red-800";
        break;
      case "Pending":
        bgColor = "bg-yellow-100 text-yellow-800";
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {status}
      </span>
    );
  };

  // KYC badge component
  const KycBadge = ({ status }: { status: Customer["kycStatus"] }) => {
    let bgColor = "bg-slate-100 text-slate-800";
    
    switch (status) {
      case "Verified":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "Rejected":
        bgColor = "bg-red-100 text-red-800";
        break;
      case "Pending":
        bgColor = "bg-yellow-100 text-yellow-800";
        break;
      case "Under Review":
        bgColor = "bg-blue-100 text-blue-800";
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white shadow-md rounded-lg p-4 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-48">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilter("all");
              }}
              className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200"
            >
              <ArrowPathIcon className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Export and Actions Bar */}
      <div className="bg-white shadow-md rounded-lg p-4 border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">
              Showing {sortedCustomers.length} of {customers.length} customers
            </span>
            {selectedCustomers.length > 0 && (
              <span className="text-sm text-blue-600 font-medium">
                {selectedCustomers.length} selected
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-200 z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Export Current View
                    </div>
                    <button
                      onClick={() => handleExport('csv', false)}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('excel', false)}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Export as Excel
                    </button>
                    
                    <div className="border-t border-slate-200 my-1"></div>
                    
                    <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Export All Customers
                    </div>
                    <button
                      onClick={() => handleExport('csv', true)}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Export All as CSV
                    </button>
                    <button
                      onClick={() => handleExport('excel', true)}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Export All as Excel
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <Link
              href="/dashboard/customers/intake"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Add Customer
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white shadow-lg rounded-lg border border-slate-200 overflow-hidden">
        {sortedCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.length === sortedCustomers.length && sortedCustomers.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Customer
                      <ChevronDownIcon className={`h-4 w-4 ml-1 transform ${sortBy === "name" && sortDirection === "desc" ? "rotate-180" : ""}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("accountType")}
                  >
                    <div className="flex items-center">
                      Account Type
                      <ChevronDownIcon className={`h-4 w-4 ml-1 transform ${sortBy === "accountType" && sortDirection === "desc" ? "rotate-180" : ""}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("kycStatus")}
                  >
                    <div className="flex items-center">
                      KYC Status
                      <ChevronDownIcon className={`h-4 w-4 ml-1 transform ${sortBy === "kycStatus" && sortDirection === "desc" ? "rotate-180" : ""}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("balance")}
                  >
                    <div className="flex items-center">
                      Balance
                      <ChevronDownIcon className={`h-4 w-4 ml-1 transform ${sortBy === "balance" && sortDirection === "desc" ? "rotate-180" : ""}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      <ChevronDownIcon className={`h-4 w-4 ml-1 transform ${sortBy === "status" && sortDirection === "desc" ? "rotate-180" : ""}`} />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {sortedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => toggleSelectCustomer(customer.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-slate-600 font-medium">{customer.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{customer.name}</div>
                          <div className="text-sm text-slate-500">{customer.email}</div>
                          <div className="text-xs text-slate-400">{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{customer.accountType}</div>
                      <div className="text-xs text-slate-500">Since {customer.joinDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <KycBadge status={customer.kycStatus} />
                      <div className="text-xs text-slate-500 mt-1">{customer.verificationLevel}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{customer.accountBalance}</div>
                      <div className="text-xs text-slate-500">Last activity: {customer.lastActivity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="p-1 rounded-md hover:bg-slate-100"
                          title="View customer details"
                        >
                          <EyeIcon className="h-5 w-5 text-blue-600" />
                        </button>
                        <button 
                          className="p-1 rounded-md hover:bg-slate-100"
                          title="Edit customer"
                        >
                          <PencilSquareIcon className="h-5 w-5 text-slate-600" />
                        </button>
                        <button 
                          className="p-1 rounded-md hover:bg-slate-100"
                          title="Delete customer"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <TrashIcon className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <UserPlusIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No customers found</h3>
            <p className="text-slate-500 mb-4">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Get started by adding your first customer"}
            </p>
            {searchTerm || filter !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
              >
                Clear filters
              </button>
            ) : (
              <Link
                href="/dashboard/customers/intake"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Add Customer
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="text-sm text-blue-700">
            <span className="font-medium">{selectedCustomers.length}</span> customers selected
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Deletion</h3>
            <p className="text-slate-600 mb-4">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCustomer}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
};

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stripe-text">Customer Management</h1>
          <p className="text-stripe-text-secondary">
            Manage customer relationships and requests across all channels
          </p>
        </div>
        <Link 
          href="/dashboard/customers/create"
          className="btn btn-primary inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Customer
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-stripe-border">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-stripe-primary text-stripe-primary"
                  : "border-transparent text-stripe-text-secondary hover:text-stripe-text hover:border-stripe-border"
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
              <div key={channel.name} className="card">
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
                    <p className="text-2xl font-bold text-stripe-text">{channel.requests}</p>
                    <p className={`text-sm ${
                      channel.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {channel.change}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-stripe-text-secondary">{channel.name}</p>
              </div>
            ))}
          </div>

          {/* Recent Intake Requests */}
          <div className="card p-0 overflow-hidden">
            <div className="p-6 border-b border-stripe-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-stripe-text">Recent Intake Requests</h3>
                <Link href="/dashboard/customers/intake" className="text-stripe-primary hover:text-stripe-primary-dark text-sm font-medium">
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

      {/* Customer List Tab */}
      {activeTab === "list" && (
        <CustomerListComponent />
      )}

      {/* Other tab contents can be implemented here */}
      {activeTab !== "overview" && activeTab !== "list" && (
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