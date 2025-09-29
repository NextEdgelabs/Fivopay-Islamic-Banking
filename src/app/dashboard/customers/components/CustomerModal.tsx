'use client';

import React, { useEffect } from 'react';
import { Customer } from '@/app/context/AppContext';
import CustomerForm from './CustomerForm';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
  mode: 'create' | 'edit' | 'view';
  onSave?: (customerData: Partial<Customer>) => Promise<void>;
}

export default function CustomerModal({ 
  isOpen, 
  onClose, 
  customer, 
  mode,
  onSave 
}: CustomerModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (customerData: Partial<Customer>) => {
    if (!onSave) return;

    setIsLoading(true);
    setError(null);

    try {
      await onSave(customerData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving customer data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Customer';
      case 'edit': return 'Edit Customer';
      case 'view': return 'Customer Details';
      default: return 'Customer';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl transform transition-all">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {mode === 'create' ? '👤' : '📋'}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
                {customer && mode !== 'create' && (
                  <p className="text-sm text-gray-500">ID: {customer.id}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            )}

            {mode === 'view' && customer ? (
              // View Mode - Display customer information
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                    
                    <div className="space-y-3">
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
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Account Type</label>
                        <p className="text-sm text-gray-900 capitalize">{customer.accountType}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500">KYC Status</label>
                        <p className="text-sm text-gray-900">{customer.kycStatus}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Verification Level</label>
                        <p className="text-sm text-gray-900">{customer.verificationLevel}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Account Balance</label>
                        <p className="text-sm font-semibold text-green-600">{customer.accountBalance}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Join Date</label>
                        <p className="text-sm text-gray-900">{new Date(customer.joinDate).toLocaleDateString()}</p>
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

                {/* Action buttons for view mode */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              // Create/Edit Mode - Show form
              <CustomerForm
                customer={customer}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isEdit={mode === 'edit'}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}