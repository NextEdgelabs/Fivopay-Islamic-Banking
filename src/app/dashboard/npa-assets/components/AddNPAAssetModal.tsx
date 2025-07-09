'use client';

import { useState } from 'react';
import { NPAAssetFormData } from '../types';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface AddNPAAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NPAAssetFormData) => void;
}

export default function AddNPAAssetModal({
  isOpen,
  onClose,
  onSubmit,
}: AddNPAAssetModalProps) {
  const [formData, setFormData] = useState<NPAAssetFormData>({
    customerId: '',
    customerName: '',
    loanAccountNumber: '',
    originalLoanAmount: 0,
    outstandingAmount: 0,
    assetType: 'Real Estate',
    assetDescription: '',
    location: '',
    acquisitionDate: '',
    npaDate: '',
    classification: 'Substandard',
    assignedTo: '',
    estimatedValue: 0,
    remarks: '',
  });

  const [errors, setErrors] = useState<Partial<NPAAssetFormData>>({});

  const handleInputChange = (field: keyof NPAAssetFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: Partial<NPAAssetFormData> = {};

    if (!formData.customerId.trim()) {
      newErrors.customerId = 'Customer ID is required';
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.loanAccountNumber.trim()) {
      newErrors.loanAccountNumber = 'Loan account number is required';
    }
    if (formData.originalLoanAmount <= 0) {
      newErrors.originalLoanAmount = 'Original loan amount must be greater than 0';
    }
    if (formData.outstandingAmount <= 0) {
      newErrors.outstandingAmount = 'Outstanding amount must be greater than 0';
    }
    if (!formData.assetDescription.trim()) {
      newErrors.assetDescription = 'Asset description is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.acquisitionDate) {
      newErrors.acquisitionDate = 'Acquisition date is required';
    }
    if (!formData.npaDate) {
      newErrors.npaDate = 'NPA date is required';
    }
    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Assigned to is required';
    }
    if (formData.estimatedValue <= 0) {
      newErrors.estimatedValue = 'Estimated value must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      customerId: '',
      customerName: '',
      loanAccountNumber: '',
      originalLoanAmount: 0,
      outstandingAmount: 0,
      assetType: 'Real Estate',
      assetDescription: '',
      location: '',
      acquisitionDate: '',
      npaDate: '',
      classification: 'Substandard',
      assignedTo: '',
      estimatedValue: 0,
      remarks: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New NPA Asset</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer ID *
                </label>
                <input
                  type="text"
                  value={formData.customerId}
                  onChange={(e) => handleInputChange('customerId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.customerId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter customer ID"
                />
                {errors.customerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Account Number *
                </label>
                <input
                  type="text"
                  value={formData.loanAccountNumber}
                  onChange={(e) => handleInputChange('loanAccountNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.loanAccountNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter loan account number"
                />
                {errors.loanAccountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.loanAccountNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To *
                </label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter assignee name"
                />
                {errors.assignedTo && (
                  <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Loan Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.originalLoanAmount}
                  onChange={(e) => handleInputChange('originalLoanAmount', Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.originalLoanAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.originalLoanAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.originalLoanAmount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outstanding Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.outstandingAmount}
                  onChange={(e) => handleInputChange('outstandingAmount', Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.outstandingAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.outstandingAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.outstandingAmount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Value (₹) *
                </label>
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.estimatedValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.estimatedValue && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimatedValue}</p>
                )}
              </div>
            </div>
          </div>

          {/* Asset Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Type
                </label>
                <select
                  value={formData.assetType}
                  onChange={(e) => handleInputChange('assetType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Real Estate">Real Estate</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Securities">Securities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classification
                </label>
                <select
                  value={formData.classification}
                  onChange={(e) => handleInputChange('classification', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Substandard">Substandard</option>
                  <option value="Doubtful">Doubtful</option>
                  <option value="Loss">Loss</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Description *
                </label>
                <textarea
                  value={formData.assetDescription}
                  onChange={(e) => handleInputChange('assetDescription', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.assetDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Describe the asset in detail"
                />
                {errors.assetDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.assetDescription}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter asset location"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acquisition Date *
                </label>
                <input
                  type="date"
                  value={formData.acquisitionDate}
                  onChange={(e) => handleInputChange('acquisitionDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.acquisitionDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.acquisitionDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.acquisitionDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPA Date *
                </label>
                <input
                  type="date"
                  value={formData.npaDate}
                  onChange={(e) => handleInputChange('npaDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.npaDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.npaDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.npaDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Additional remarks or notes"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add NPA Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 