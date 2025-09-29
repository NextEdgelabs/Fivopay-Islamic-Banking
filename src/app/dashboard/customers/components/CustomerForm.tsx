'use client';

import React, { useState, useEffect } from 'react';
import { Customer } from '@/app/context/AppContext';

interface CustomerFormProps {
  customer?: Partial<Customer>;
  onSubmit: (customerData: Partial<Customer>) => void;
  onCancel: () => void;
  isEdit?: boolean;
  isLoading?: boolean;
}

export default function CustomerForm({ 
  customer = {}, 
  onSubmit, 
  onCancel, 
  isEdit = false,
  isLoading = false
}: CustomerFormProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    accountType: 'savings',
    kycStatus: 'Pending',
    verificationLevel: 'Basic',
    accountBalance: '$0',
    status: 'Pending',
    ...customer
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      accountType: 'savings',
      kycStatus: 'Pending',
      verificationLevel: 'Basic',
      accountBalance: '$0',
      status: 'Pending',
      ...customer
    });
  }, [customer]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!formData.accountType) {
      newErrors.accountType = 'Account type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof Customer, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300 focus:border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter customer's full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300 focus:border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="customer@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-300 focus:border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          
          <div>
            <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-2">
              Account Type *
            </label>
            <select
              id="accountType"
              value={formData.accountType || ''}
              onChange={(e) => handleInputChange('accountType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.accountType ? 'border-red-300 focus:border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select account type</option>
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
              <option value="investment">Investment Account</option>
              <option value="business">Business Account</option>
            </select>
            {errors.accountType && <p className="mt-1 text-sm text-red-600">{errors.accountType}</p>}
          </div>

          <div>
            <label htmlFor="kycStatus" className="block text-sm font-medium text-gray-700 mb-2">
              KYC Status
            </label>
            <select
              id="kycStatus"
              value={formData.kycStatus || ''}
              onChange={(e) => handleInputChange('kycStatus', e.target.value as Customer['kycStatus'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label htmlFor="verificationLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Level
            </label>
            <select
              id="verificationLevel"
              value={formData.verificationLevel || ''}
              onChange={(e) => handleInputChange('verificationLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Enhanced">Enhanced</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <select
              id="status"
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value as Customer['status'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {isEdit && (
            <div>
              <label htmlFor="accountBalance" className="block text-sm font-medium text-gray-700 mb-2">
                Account Balance
              </label>
              <input
                type="text"
                id="accountBalance"
                value={formData.accountBalance || ''}
                onChange={(e) => handleInputChange('accountBalance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
            </div>
          ) : (
            isEdit ? 'Update Customer' : 'Create Customer'
          )}
        </button>
      </div>
    </form>
  );
}