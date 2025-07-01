'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Branch } from '../types';

interface EditBranchModalProps {
  isOpen: boolean;
  branch: Branch | null;
  onClose: () => void;
  onSave: (updatedBranch: Branch) => void;
}

export default function EditBranchModal({
  isOpen,
  branch,
  onClose,
  onSave
}: EditBranchModalProps) {
  const [formData, setFormData] = useState<Branch | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (branch) {
      setFormData({ ...branch });
      setErrors({});
    }
  }, [branch]);

  if (!isOpen || !formData) return null;

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.managerName.trim()) {
      newErrors.managerName = 'Manager name is required';
    }
    if (!formData.managerPhone.trim()) {
      newErrors.managerPhone = 'Manager phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof Branch, value: string | number) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Edit Branch Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={(e) => handleInputChange('branchName', e.target.value)}
                className={`text-gray-700 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.branchName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter branch name"
              />
              {errors.branchName && <p className="text-red-500 text-sm mt-1">{errors.branchName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Code
              </label>
              <input
                type="text"
                value={formData.branchCode}
                onChange={(e) => handleInputChange('branchCode', e.target.value)}
                className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                placeholder="Branch code"
                disabled
              />
              <p className="text-gray-500 text-sm mt-1">Branch code cannot be changed</p>
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`text-gray-700 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal</option>
              </select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`text-gray-700 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter city"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`text-gray-700 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className={`text-gray-700 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter pincode"
              />
              {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`text-gray-700 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`text-gray-700 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Manager Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.managerName}
                onChange={(e) => handleInputChange('managerName', e.target.value)}
                className={`text-gray-700 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.managerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter manager name"
              />
              {errors.managerName && <p className="text-red-500 text-sm mt-1">{errors.managerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.managerPhone}
                onChange={(e) => handleInputChange('managerPhone', e.target.value)}
                className={`text-gray-700 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.managerPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter manager phone"
              />
              {errors.managerPhone && <p className="text-red-500 text-sm mt-1">{errors.managerPhone}</p>}
            </div>
          </div>

          {/* Operational Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Count
              </label>
              <input
                type="number"
                value={formData.employeeCount}
                onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value) || 0)}
                className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter employee count"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Count
              </label>
              <input
                type="number"
                value={formData.customerCount}
                onChange={(e) => handleInputChange('customerCount', parseInt(e.target.value) || 0)}
                className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter customer count"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as Branch['status'])}
                className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Deposits (₹)
              </label>
              <input
                type="number"
                value={formData.totalDeposits}
                onChange={(e) => handleInputChange('totalDeposits', parseInt(e.target.value) || 0)}
                className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter total deposits"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Loans (₹)
              </label>
              <input
                type="number"
                value={formData.totalLoans}
                onChange={(e) => handleInputChange('totalLoans', parseInt(e.target.value) || 0)}
                className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter total loans"
                min="0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 