"use client";
import { useState } from "react";
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface InsurancePolicy {
  id: string;
  policyNumber: string;
  customerName: string;
  customerId: string;
  productName: string;
  productCategory: "health" | "life" | "motor" | "property" | "travel" | "business";
  status: "active" | "expired" | "cancelled" | "pending";
  premium: number;
  coverage: number;
  startDate: string;
  endDate: string;
  nextPaymentDate: string;
  totalPayments: number;
  claimsCount: number;
  createdAt: string;
}

interface NewPolicyForm {
  customerName: string;
  customerId: string;
  productName: string;
  productCategory: "health" | "life" | "motor" | "property" | "travel" | "business";
  premium: number;
  coverage: number;
  startDate: string;
  endDate: string;
}

export default function InsurancePolicyPage() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([
    {
      id: "1",
      policyNumber: "POL-2024-001",
      customerName: "John Smith",
      customerId: "CUST-001",
      productName: "Takaful Health Plus",
      productCategory: "health",
      status: "active",
      premium: 250,
      coverage: 50000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      nextPaymentDate: "2024-02-01",
      totalPayments: 250,
      claimsCount: 0,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      policyNumber: "POL-2024-002",
      customerName: "Sarah Johnson",
      customerId: "CUST-002",
      productName: "Takaful Life Protection",
      productCategory: "life",
      status: "active",
      premium: 180,
      coverage: 100000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      nextPaymentDate: "2024-02-01",
      totalPayments: 180,
      claimsCount: 1,
      createdAt: "2024-01-01",
    },
    {
      id: "3",
      policyNumber: "POL-2024-003",
      customerName: "Mike Wilson",
      customerId: "CUST-003",
      productName: "Takaful Motor Shield",
      productCategory: "motor",
      status: "active",
      premium: 320,
      coverage: 75000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      nextPaymentDate: "2024-02-01",
      totalPayments: 320,
      claimsCount: 2,
      createdAt: "2024-01-01",
    },
    {
      id: "4",
      policyNumber: "POL-2024-004",
      customerName: "Emily Davis",
      customerId: "CUST-004",
      productName: "Takaful Property Guard",
      productCategory: "property",
      status: "active",
      premium: 150,
      coverage: 200000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      nextPaymentDate: "2024-02-01",
      totalPayments: 150,
      claimsCount: 0,
      createdAt: "2024-01-01",
    },
    {
      id: "5",
      policyNumber: "POL-2024-005",
      customerName: "David Brown",
      customerId: "CUST-005",
      productName: "Takaful Travel Safe",
      productCategory: "travel",
      status: "expired",
      premium: 45,
      coverage: 25000,
      startDate: "2023-06-01",
      endDate: "2023-12-31",
      nextPaymentDate: "2023-07-01",
      totalPayments: 270,
      claimsCount: 0,
      createdAt: "2023-06-01",
    },
    {
      id: "6",
      policyNumber: "POL-2024-006",
      customerName: "Lisa Anderson",
      customerId: "CUST-006",
      productName: "Takaful Health Plus",
      productCategory: "health",
      status: "pending",
      premium: 250,
      coverage: 50000,
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      nextPaymentDate: "2024-02-01",
      totalPayments: 0,
      claimsCount: 0,
      createdAt: "2024-01-15",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPolicy, setNewPolicy] = useState<NewPolicyForm>({
    customerName: "",
    customerId: "",
    productName: "",
    productCategory: "health",
    premium: 0,
    coverage: 0,
    startDate: "",
    endDate: "",
  });

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "cancelled", label: "Cancelled" },
    { value: "pending", label: "Pending" },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "health", label: "Health" },
    { value: "life", label: "Life" },
    { value: "motor", label: "Motor" },
    { value: "property", label: "Property" },
    { value: "travel", label: "Travel" },
    { value: "business", label: "Business" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "expired":
        return <XCircleIcon className="h-4 w-4" />;
      case "cancelled":
        return <XCircleIcon className="h-4 w-4" />;
      case "pending":
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "bg-green-100 text-green-800";
      case "life":
        return "bg-blue-100 text-blue-800";
      case "motor":
        return "bg-yellow-100 text-yellow-800";
      case "property":
        return "bg-purple-100 text-purple-800";
      case "travel":
        return "bg-orange-100 text-orange-800";
      case "business":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || policy.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "all" || policy.productCategory === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const policyNumber = `POL-${new Date().getFullYear()}-${String(policies.length + 1).padStart(3, '0')}`;
    const nextPaymentDate = new Date(newPolicy.startDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    
    const newPolicyData: InsurancePolicy = {
      id: (policies.length + 1).toString(),
      policyNumber,
      ...newPolicy,
      status: "pending",
      totalPayments: 0,
      claimsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
    };
    setPolicies([...policies, newPolicyData]);
    setShowAddModal(false);
    setNewPolicy({
      customerName: "",
      customerId: "",
      productName: "",
      productCategory: "health",
      premium: 0,
      coverage: 0,
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Insurance Policies
          </h1>
          <p className="text-slate-600">
            Manage and track insurance policies
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Policy
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-700 w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-gray-700 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-gray-700 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              {filteredPolicies.length} policies
            </span>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Policy Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Coverage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Next Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredPolicies.map((policy) => {
                const daysUntilExpiry = getDaysUntilExpiry(policy.endDate);
                const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                const isExpired = daysUntilExpiry < 0;

                return (
                  <tr key={policy.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {policy.policyNumber}
                        </div>
                        <div className="text-sm text-slate-500">
                          Created {new Date(policy.createdAt).toLocaleDateString()}
                        </div>
                        {isExpiringSoon && (
                          <div className="flex items-center mt-1">
                            <ExclamationTriangleIcon className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="text-xs text-yellow-600">
                              Expires in {daysUntilExpiry} days
                            </span>
                          </div>
                        )}
                        {isExpired && (
                          <div className="flex items-center mt-1">
                            <XCircleIcon className="h-3 w-3 text-red-500 mr-1" />
                            <span className="text-xs text-red-600">
                              Expired {Math.abs(daysUntilExpiry)} days ago
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-slate-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">
                            {policy.customerName}
                          </div>
                          <div className="text-sm text-slate-500">
                            {policy.customerId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {policy.productName}
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            policy.productCategory
                          )}`}
                        >
                          {policy.productCategory.charAt(0).toUpperCase() +
                            policy.productCategory.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          policy.status
                        )}`}
                      >
                        {getStatusIcon(policy.status)}
                        <span className="ml-1 capitalize">{policy.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        ${policy.premium}/month
                      </div>
                      <div className="text-sm text-slate-500">
                        Total: ${policy.totalPayments}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        ${policy.coverage.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">
                        {policy.claimsCount} claims
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {new Date(policy.nextPaymentDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(policy.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-slate-600 hover:text-slate-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredPolicies.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium text-slate-900">
            No policies found
          </h3>
          <p className="mt-2 text-slate-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Create New Insurance Policy
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newPolicy.customerName}
                    onChange={(e) => setNewPolicy({...newPolicy, customerName: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    required
                    value={newPolicy.customerId}
                    onChange={(e) => setNewPolicy({...newPolicy, customerId: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter customer ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newPolicy.productName}
                    onChange={(e) => setNewPolicy({...newPolicy, productName: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Category
                  </label>
                  <select
                    required
                    value={newPolicy.productCategory}
                    onChange={(e) => setNewPolicy({...newPolicy, productCategory: e.target.value as any})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="health">Health</option>
                    <option value="life">Life</option>
                    <option value="motor">Motor</option>
                    <option value="property">Property</option>
                    <option value="travel">Travel</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Premium ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newPolicy.premium}
                    onChange={(e) => setNewPolicy({...newPolicy, premium: Number(e.target.value)})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Coverage Amount ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newPolicy.coverage}
                    onChange={(e) => setNewPolicy({...newPolicy, coverage: Number(e.target.value)})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newPolicy.startDate}
                    onChange={(e) => setNewPolicy({...newPolicy, startDate: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newPolicy.endDate}
                    onChange={(e) => setNewPolicy({...newPolicy, endDate: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
