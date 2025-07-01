'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface NewBranchFormData {
  branchName: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  managerName: string;
  managerPhone: string;
}

interface NewBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewBranchFormData) => void;
}

export default function NewBranchModal({ isOpen, onClose, onSubmit }: NewBranchModalProps) {
  const [formData, setFormData] = useState<NewBranchFormData>({
    branchName: '',
    city: '',
    state: '',
    address: '',
    pincode: '',
    phone: '',
    email: '',
    managerName: '',
    managerPhone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      branchName: '',
      city: '',
      state: '',
      address: '',
      pincode: '',
      phone: '',
      email: '',
      managerName: '',
      managerPhone: '',
    });
  };

  const handleClose = () => {
    onClose();
    // Reset form on close
    setFormData({
      branchName: '',
      city: '',
      state: '',
      address: '',
      pincode: '',
      phone: '',
      email: '',
      managerName: '',
      managerPhone: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Branch</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Branch Name</label>
            <input
              type="text"
              required
              value={formData.branchName}
              onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
              className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter branch name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter city"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter complete address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pincode</label>
            <input
              type="text"
              required
              pattern="[0-9]{6}"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter 6-digit pincode"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="branch@fivopay.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Manager Name</label>
              <input
                type="text"
                required
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter manager name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Manager Phone</label>
              <input
                type="tel"
                required
                value={formData.managerPhone}
                onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 