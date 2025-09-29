"use client";

import { useState } from "react";
import {
  CalculatorIcon,
  DocumentTextIcon,
  BanknotesIcon,
  DocumentChartBarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface BillingItem {
  id: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  dueDate: string;
  type: "service" | "product" | "subscription";
  description: string;
}

interface InvoiceFormData {
  customerName: string;
  amount: number;
  dueDate: string;
  type: "service" | "product" | "subscription";
  description: string;
}

export default function BillingPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BillingItem | null>(null);
  const [formData, setFormData] = useState<InvoiceFormData>({
    customerName: "",
    amount: 0,
    dueDate: "",
    type: "service",
    description: "",
  });

  const [billingItems, setBillingItems] = useState<BillingItem[]>([
    {
      id: "1",
      customerName: "ABC Corporation",
      invoiceNumber: "INV-2024-001",
      amount: 2500.00,
      status: "paid",
      dueDate: "2024-01-15",
      type: "service",
      description: "Monthly banking services",
    },
    {
      id: "2",
      customerName: "XYZ Enterprises",
      invoiceNumber: "INV-2024-002",
      amount: 1800.00,
      status: "pending",
      dueDate: "2024-01-20",
      type: "product",
      description: "Loan processing fees",
    },
    {
      id: "3",
      customerName: "Tech Solutions Ltd",
      invoiceNumber: "INV-2024-003",
      amount: 3200.00,
      status: "overdue",
      dueDate: "2024-01-10",
      type: "subscription",
      description: "Premium banking package",
    },
    {
      id: "4",
      customerName: "Global Industries",
      invoiceNumber: "INV-2024-004",
      amount: 1500.00,
      status: "draft",
      dueDate: "2024-01-25",
      type: "service",
      description: "Account maintenance fees",
    },
  ]);

  const filteredItems = billingItems.filter((item) => {
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateInvoice = () => {
    if (formData.customerName && formData.amount > 0 && formData.dueDate) {
      const newInvoice: BillingItem = {
        id: Date.now().toString(),
        customerName: formData.customerName,
        invoiceNumber: `INV-2024-${String(billingItems.length + 1).padStart(3, '0')}`,
        amount: formData.amount,
        status: "draft",
        dueDate: formData.dueDate,
        type: formData.type,
        description: formData.description,
      };
      setBillingItems([...billingItems, newInvoice]);
      setFormData({
        customerName: "",
        amount: 0,
        dueDate: "",
        type: "service",
        description: "",
      });
      setShowCreateModal(false);
    }
  };

  const handleViewItem = (item: BillingItem) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEditItem = (item: BillingItem) => {
    setSelectedItem(item);
    setFormData({
      customerName: item.customerName,
      amount: item.amount,
      dueDate: item.dueDate,
      type: item.type,
      description: item.description,
    });
    setShowEditModal(true);
  };

  const handleUpdateItem = () => {
    if (selectedItem && formData.customerName && formData.amount > 0 && formData.dueDate) {
      setBillingItems(billingItems.map(item =>
        item.id === selectedItem.id
          ? { ...item, ...formData }
          : item
      ));
      setSelectedItem(null);
      setFormData({
        customerName: "",
        amount: 0,
        dueDate: "",
        type: "service",
        description: "",
      });
      setShowEditModal(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setBillingItems(billingItems.filter(item => item.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: BillingItem["status"]) => {
    setBillingItems(billingItems.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-stripe-background-light text-stripe-text-secondary";
      default:
        return "bg-stripe-background-light text-stripe-text-secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return CheckCircleIcon;
      case "pending":
        return ClockIcon;
      case "overdue":
        return ExclamationTriangleIcon;
      case "draft":
        return DocumentTextIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "service":
        return "bg-blue-100 text-blue-800";
      case "product":
        return "bg-purple-100 text-purple-800";
      case "subscription":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-stripe-background-light text-stripe-text-secondary";
    }
  };

  const totalRevenue = billingItems.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = billingItems.filter(item => item.status === "paid").reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = billingItems.filter(item => item.status === "pending").reduce((sum, item) => sum + item.amount, 0);
  const overdueAmount = billingItems.filter(item => item.status === "overdue").reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stripe-text">Billing Engine</h1>
          <p className="text-stripe-text-secondary">Manage invoices, payments, and billing configurations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Total Revenue</p>
              <p className="text-2xl font-bold text-stripe-text">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stripe-text-secondary">Overdue Amount</p>
              <p className="text-2xl font-bold text-red-600">₹{overdueAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by customer name or invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-stripe-text w-full px-4 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-stripe-text">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-stripe-text px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Billing Items Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-stripe-border">
          <h3 className="text-lg font-semibold text-stripe-text">Billing Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stripe-border">
            <thead className="bg-stripe-background-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stripe-border">
              {filteredItems.map((item) => {
                const StatusIcon = getStatusIcon(item.status);
                return (
                  <tr key={item.id} className="hover:bg-stripe-background-light">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-stripe-text">{item.customerName}</div>
                        <div className="text-sm text-stripe-text-secondary">{item.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text">
                      {item.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stripe-text">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text">
                      {item.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewItem(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="text-stripe-text-secondary hover:text-stripe-text"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-stripe-text mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-stripe-border rounded-lg hover:bg-stripe-background-light transition-colors">
            <CalculatorIcon className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-stripe-text">Configure Billing</div>
              <div className="text-sm text-stripe-text-secondary">Set up billing rules and rates</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-stripe-border rounded-lg hover:bg-stripe-background-light transition-colors">
            <DocumentTextIcon className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-stripe-text">Generate Invoices</div>
              <div className="text-sm text-stripe-text-secondary">Create and send invoices</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-stripe-border rounded-lg hover:bg-stripe-background-light transition-colors">
            <BanknotesIcon className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-stripe-text">Process Payments</div>
              <div className="text-sm text-stripe-text-secondary">Handle payment processing</div>
            </div>
          </button>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-stripe-text">Create New Invoice</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stripe-text-secondary hover:text-stripe-text"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-stripe-text bg-stripe-background-light rounded-lg hover:bg-stripe-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-stripe-text">Invoice Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-stripe-text-secondary hover:text-stripe-text"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text">Customer Name</label>
                <p className="text-stripe-text">{selectedItem.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text">Invoice Number</label>
                <p className="text-stripe-text">{selectedItem.invoiceNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text">Amount</label>
                <p className="text-stripe-text">₹{selectedItem.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                  {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text">Due Date</label>
                <p className="text-stripe-text">{selectedItem.dueDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text">Type</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedItem.type)}`}>
                  {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text">Description</label>
                <p className="text-stripe-text">{selectedItem.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-stripe-text bg-stripe-background-light rounded-lg hover:bg-stripe-border transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-stripe-text">Edit Invoice</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-stripe-text-secondary hover:text-stripe-text"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-stripe-text bg-stripe-background-light rounded-lg hover:bg-stripe-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 