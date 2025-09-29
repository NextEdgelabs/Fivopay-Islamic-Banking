'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext, Customer } from '@/app/context/AppContext';
import { CustomerModal } from '../components';

export default function CustomerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { customers, updateCustomer } = useAppContext();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const customerId = params.customerId as string;

  useEffect(() => {
    // Find customer by ID
    const foundCustomer = customers.find((c: Customer) => c.id === customerId);
    setCustomer(foundCustomer || null);
    setLoading(false);
  }, [customerId, customers]);

  const handleEditCustomer = async (customerData: Partial<Customer>) => {
    if (!customer) return;
    
    console.log('Updating customer:', customerData);
    
    try {
      // Update customer data using AppContext
      const updatedCustomer = { ...customer, ...customerData };
      updateCustomer(updatedCustomer);
      setCustomer(updatedCustomer);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer profile...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Customer Not Found</h1>
          <p className="text-gray-600 mb-4">The customer with ID "{customerId}" could not be found.</p>
          <button
            onClick={() => router.push('/dashboard/customers')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'activity', label: 'Activity Log', icon: '📊' },
  ];

  // Mock transaction data
  const transactions = [
    { id: '1', date: '2024-01-15', description: 'Salary Credit', amount: '+$2,500', type: 'credit' },
    { id: '2', date: '2024-01-14', description: 'Online Transfer', amount: '-$150', type: 'debit' },
    { id: '3', date: '2024-01-13', description: 'ATM Withdrawal', amount: '-$100', type: 'debit' },
    { id: '4', date: '2024-01-12', description: 'Utility Payment', amount: '-$75', type: 'debit' },
    { id: '5', date: '2024-01-10', description: 'Investment Return', amount: '+$200', type: 'credit' },
  ];

  // Mock documents data
  const documents = [
    { id: '1', name: 'National ID Copy', type: 'Identity', status: 'Verified', uploadDate: '2024-01-01' },
    { id: '2', name: 'Proof of Address', type: 'Address', status: 'Verified', uploadDate: '2024-01-01' },
    { id: '3', name: 'Income Statement', type: 'Financial', status: 'Pending Review', uploadDate: '2024-01-05' },
    { id: '4', name: 'Bank Statement', type: 'Financial', status: 'Verified', uploadDate: '2024-01-03' },
  ];

  // Mock activity log
  const activities = [
    { id: '1', action: 'Profile Updated', timestamp: '2024-01-15 10:30 AM', user: 'System' },
    { id: '2', action: 'KYC Document Verified', timestamp: '2024-01-14 3:45 PM', user: 'Admin' },
    { id: '3', action: 'Account Status Changed', timestamp: '2024-01-12 2:15 PM', user: 'Manager' },
    { id: '4', action: 'New Transaction', timestamp: '2024-01-12 11:00 AM', user: 'Customer' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard/customers')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                  👤
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                  <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKycStatusColor(customer.kycStatus)}`}>
                  KYC: {customer.kycStatus}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit Profile
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-sm text-gray-900">{customer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{customer.email}</p>
                  </div>
                  {customer.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{customer.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Join Date</label>
                    <p className="text-sm text-gray-900">{new Date(customer.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account Type</label>
                    <p className="text-sm text-gray-900 capitalize">{customer.accountType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Verification Level</label>
                    <p className="text-sm text-gray-900">{customer.verificationLevel}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account Balance</label>
                    <p className="text-lg font-semibold text-green-600">{customer.accountBalance}</p>
                  </div>
                  {customer.lastActivity && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Last Activity</label>
                      <p className="text-sm text-gray-900">{customer.lastActivity}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    View Transactions
                  </button>
                  <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    Generate Statement
                  </button>
                  <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    Update KYC
                  </button>
                  <button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                    Suspend Account
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {activities.slice(0, 3).map(activity => (
                    <div key={activity.id} className="border-l-4 border-blue-200 pl-3">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map(document => (
                  <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{document.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        document.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {document.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{document.type}</p>
                    <p className="text-xs text-gray-500">Uploaded: {document.uploadDate}</p>
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-xs text-gray-600 hover:text-gray-800">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Activity Log</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                        <span>{activity.timestamp}</span>
                        <span>•</span>
                        <span>by {activity.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <CustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customer={customer}
        mode="edit"
        onSave={handleEditCustomer}
      />
    </div>
  );
}