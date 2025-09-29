"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  UserPlusIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useAppContext, Customer } from "@/app/context/AppContext";

export default function CustomerListPage() {
  const { customers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kycFilter, setKycFilter] = useState<string>("all");
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Customer>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
      const matchesKyc = kycFilter === "all" || customer.kycStatus === kycFilter;
      const matchesAccountType = accountTypeFilter === "all" || customer.accountType === accountTypeFilter;

      return matchesSearch && matchesStatus && matchesKyc && matchesAccountType;
    });

    // Sort customers
    filtered.sort((a, b) => {
      // Handle special sorting cases
      if (sortField === "accountBalance") {
        const aValue = parseFloat(a.accountBalance.replace(/[^0-9.-]+/g, "")) || 0;
        const bValue = parseFloat(b.accountBalance.replace(/[^0-9.-]+/g, "")) || 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else if (sortField === "joinDate") {
        const aValue = new Date(a.joinDate).getTime();
        const bValue = new Date(b.joinDate).getTime();
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        // String comparison for other fields
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";
        return sortDirection === "asc" 
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    });

    return filtered;
  }, [customers, searchTerm, statusFilter, kycFilter, accountTypeFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredAndSortedCustomers.slice(startIndex, startIndex + itemsPerPage);

  // Utility functions
  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedCustomers.map(customer => customer.id));
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const exportToCSV = () => {
    const csvData = filteredAndSortedCustomers.map(customer => ({
      ID: customer.id,
      Name: customer.name,
      Email: customer.email,
      Phone: customer.phone || "N/A",
      AccountType: customer.accountType,
      KYCStatus: customer.kycStatus,
      Status: customer.status,
      AccountBalance: customer.accountBalance,
      JoinDate: customer.joinDate,
    }));

    const headers = Object.keys(csvData[0]).join(",");
    const csv = [headers, ...csvData.map(row => Object.values(row).join(","))].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Inactive: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors] || colors.Inactive;
  };

  const getKycBadge = (status: string) => {
    const colors = {
      Verified: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      "Under Review": "bg-blue-100 text-blue-800",
      Rejected: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || colors.Pending;
  };

  // Get unique values for filters
  const uniqueAccountTypes = Array.from(new Set(customers.map(c => c.accountType)));
  const uniqueStatuses = Array.from(new Set(customers.map(c => c.status)));
  const uniqueKycStatuses = Array.from(new Set(customers.map(c => c.kycStatus)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/customers"
            className="p-2 hover:bg-stripe-background-light rounded-md transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-stripe-text-secondary" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-stripe-text">Customer Management</h1>
            <p className="text-stripe-text-secondary">
              Manage and view customer information ({filteredAndSortedCustomers.length} customers)
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-stripe-border text-stripe-text bg-white rounded-md hover:bg-stripe-background-light transition-colors"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </button>
          <Link
            href="/dashboard/customers/intake"
            className="inline-flex items-center px-4 py-2 bg-stripe-primary text-white rounded-md hover:bg-stripe-primary/90 transition-colors"
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add Customer
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stripe-text-secondary" />
              <input
                type="text"
                placeholder="Search customers by name, email, ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
            >
              <option value="all">All KYC Status</option>
              {uniqueKycStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={accountTypeFilter}
              onChange={(e) => setAccountTypeFilter(e.target.value)}
              className="px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
            >
              <option value="all">All Account Types</option>
              {uniqueAccountTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setKycFilter("all");
                setAccountTypeFilter("all");
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-stripe-border text-stripe-text rounded-md hover:bg-stripe-background-light transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                {selectedCustomers.length} customer(s) selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Send Message
              </button>
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                Update Status
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow-sm border border-stripe-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stripe-border">
            <thead className="bg-stripe-background-light">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={paginatedCustomers.length > 0 && selectedCustomers.length === paginatedCustomers.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-stripe-primary focus:ring-stripe-primary border-stripe-border rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center space-x-1 hover:text-stripe-text"
                  >
                    <span>Customer</span>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("accountType")}
                    className="flex items-center space-x-1 hover:text-stripe-text"
                  >
                    <span>Account Type</span>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("accountBalance")}
                    className="flex items-center space-x-1 hover:text-stripe-text"
                  >
                    <span>Balance</span>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("joinDate")}
                    className="flex items-center space-x-1 hover:text-stripe-text"
                  >
                    <span>Join Date</span>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stripe-border">
              {paginatedCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className={`hover:bg-stripe-background-light transition-colors ${
                    selectedCustomers.includes(customer.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="h-4 w-4 text-stripe-primary focus:ring-stripe-primary border-stripe-border rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-stripe-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-stripe-primary">
                            {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-stripe-text">{customer.name}</div>
                        <div className="text-sm text-stripe-text-secondary">{customer.email}</div>
                        <div className="text-xs text-stripe-text-secondary">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text">
                    {customer.accountType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKycBadge(customer.kycStatus)}`}>
                      {customer.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stripe-text">
                    {customer.accountBalance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text-secondary">
                    {new Date(customer.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        title="View Details"
                        className="text-stripe-primary hover:text-stripe-primary/80 p-1"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <button
                        title="Edit Customer"
                        onClick={() => console.log('Edit customer', customer.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        title="Delete Customer"
                        onClick={() => console.log('Delete customer', customer.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-stripe-border sm:px-6">
          <div className="flex-1 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-stripe-text-secondary">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-stripe-border rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-stripe-text-secondary">per page</span>
            </div>

            <div className="text-sm text-stripe-text-secondary">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedCustomers.length)} of {filteredAndSortedCustomers.length} results
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-stripe-border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stripe-background-light"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  Math.abs(page - currentPage) <= 2
                )
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return [
                      <span key={`ellipsis-${page}`} className="px-2 text-stripe-text-secondary">...</span>,
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded text-sm ${
                          currentPage === page
                            ? "bg-stripe-primary text-white border-stripe-primary"
                            : "border-stripe-border hover:bg-stripe-background-light"
                        }`}
                      >
                        {page}
                      </button>
                    ];
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === page
                          ? "bg-stripe-primary text-white border-stripe-primary"
                          : "border-stripe-border hover:bg-stripe-background-light"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })
              }

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-stripe-border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stripe-background-light"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSortedCustomers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-stripe-border p-12 text-center">
          <FunnelIcon className="h-12 w-12 text-stripe-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stripe-text mb-2">No customers found</h3>
          <p className="text-stripe-text-secondary mb-6">
            Try adjusting your search criteria or filters to find what you're looking for.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setKycFilter("all");
                setAccountTypeFilter("all");
              }}
              className="px-4 py-2 border border-stripe-border text-stripe-text rounded-md hover:bg-stripe-background-light"
            >
              Clear Filters
            </button>
            <Link
              href="/dashboard/customers/intake"
              className="px-4 py-2 bg-stripe-primary text-white rounded-md hover:bg-stripe-primary/90"
            >
              Add Customer
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
