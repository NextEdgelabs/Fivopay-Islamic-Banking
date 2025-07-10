"use client";

import { useState } from "react";
import {
  BanknotesIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  CreditCardIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Payment {
  id: string;
  paymentId: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: "credit_card" | "bank_transfer" | "cash" | "digital_wallet";
  date: string;
  description: string;
}

interface PaymentFormData {
  customerName: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: "credit_card" | "bank_transfer" | "cash" | "digital_wallet";
  description: string;
}

export default function PaymentProcessingPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    customerName: "",
    invoiceNumber: "",
    amount: 0,
    paymentMethod: "credit_card",
    description: "",
  });

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      paymentId: "PAY-2024-001",
      customerName: "ABC Corporation",
      invoiceNumber: "INV-2024-001",
      amount: 2500.00,
      status: "completed",
      paymentMethod: "credit_card",
      date: "2024-01-15",
      description: "Monthly banking services",
    },
    {
      id: "2",
      paymentId: "PAY-2024-002",
      customerName: "XYZ Enterprises",
      invoiceNumber: "INV-2024-002",
      amount: 1800.00,
      status: "pending",
      paymentMethod: "bank_transfer",
      date: "2024-01-16",
      description: "Loan processing fees",
    },
    {
      id: "3",
      paymentId: "PAY-2024-003",
      customerName: "Tech Solutions Ltd",
      invoiceNumber: "INV-2024-003",
      amount: 3200.00,
      status: "failed",
      paymentMethod: "digital_wallet",
      date: "2024-01-14",
      description: "Premium banking package",
    },
    {
      id: "4",
      paymentId: "PAY-2024-004",
      customerName: "Global Industries",
      invoiceNumber: "INV-2024-004",
      amount: 1500.00,
      status: "completed",
      paymentMethod: "cash",
      date: "2024-01-13",
      description: "Account maintenance fees",
    },
  ]);

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = selectedStatus === "all" || payment.status === selectedStatus;
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleProcessPayment = () => {
    if (formData.customerName && formData.invoiceNumber && formData.amount > 0) {
      const newPayment: Payment = {
        id: Date.now().toString(),
        paymentId: `PAY-2024-${String(payments.length + 1).padStart(3, '0')}`,
        customerName: formData.customerName,
        invoiceNumber: formData.invoiceNumber,
        amount: formData.amount,
        status: "pending",
        paymentMethod: formData.paymentMethod,
        date: new Date().toISOString().split('T')[0],
        description: formData.description,
      };
      setPayments([...payments, newPayment]);
      setFormData({
        customerName: "",
        invoiceNumber: "",
        amount: 0,
        paymentMethod: "credit_card",
        description: "",
      });
      setShowProcessModal(false);
    }
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      customerName: payment.customerName,
      invoiceNumber: payment.invoiceNumber,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      description: payment.description,
    });
    setShowEditModal(true);
  };

  const handleUpdatePayment = () => {
    if (selectedPayment && formData.customerName && formData.invoiceNumber && formData.amount > 0) {
      setPayments(payments.map(payment =>
        payment.id === selectedPayment.id
          ? { ...payment, ...formData }
          : payment
      ));
      setSelectedPayment(null);
      setFormData({
        customerName: "",
        invoiceNumber: "",
        amount: 0,
        paymentMethod: "credit_card",
        description: "",
      });
      setShowEditModal(false);
    }
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: Payment["status"]) => {
    setPayments(payments.map(payment =>
      payment.id === id ? { ...payment, status: newStatus } : payment
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircleIcon;
      case "pending":
        return ClockIcon;
      case "failed":
        return ExclamationTriangleIcon;
      case "refunded":
        return BanknotesIcon;
      default:
        return ClockIcon;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "credit_card":
        return "bg-purple-100 text-purple-800";
      case "bank_transfer":
        return "bg-blue-100 text-blue-800";
      case "cash":
        return "bg-green-100 text-green-800";
      case "digital_wallet":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPayments = payments.length;
  const completedPayments = payments.filter(p => p.status === "completed").length;
  const pendingPayments = payments.filter(p => p.status === "pending").length;
  const failedPayments = payments.filter(p => p.status === "failed").length;
  const totalAmount = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Processing</h1>
          <p className="text-gray-600">Manage and track payment processing</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowProcessModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Process Payment</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{totalPayments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedPayments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-green-600" />
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
              placeholder="Search by customer name or payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Process Payment Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Process New Payment</h3>
              <button
                onClick={() => setShowProcessModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter invoice number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="digital_wallet">Digital Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowProcessModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payment Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => {
                const StatusIcon = getStatusIcon(payment.status);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.paymentId}</div>
                        <div className="text-sm text-gray-500">{payment.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(payment.paymentMethod)}`}>
                        {payment.paymentMethod.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewPayment(payment)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditPayment(payment)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePayment(payment.id)}
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

      {/* View Payment Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment ID</label>
                <p className="text-gray-900">{selectedPayment.paymentId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <p className="text-gray-900">{selectedPayment.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <p className="text-gray-900">{selectedPayment.invoiceNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <p className="text-gray-900">₹{selectedPayment.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                  {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(selectedPayment.paymentMethod)}`}>
                  {selectedPayment.paymentMethod.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="text-gray-900">{selectedPayment.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900">{selectedPayment.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {showEditModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Payment</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="digital_wallet">Digital Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 