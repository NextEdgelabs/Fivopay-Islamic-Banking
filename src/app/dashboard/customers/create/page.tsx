'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomers } from '../context/CustomerContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CreateCustomerPage() {
  const router = useRouter();
  const { createCustomer } = useCustomers();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerType: 'Individual' as 'Individual' | 'Business',
    title: 'Mr',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    primaryMobile: '',
    primaryEmail: '',
    occupation: '',
    annualIncome: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const customerData = {
        ...formData,
        annualIncome: parseFloat(formData.annualIncome) || 0,
        maritalStatus: 'Single' as const,
        nationality: 'Indian',
        preferredLanguage: 'English',
        status: 'Active' as const,
        kycStatus: 'Pending' as const,
        riskRating: 'Low' as const,
        pepStatus: false,
        fatcaApplicable: false,
      };

      await createCustomer(customerData);
      router.push('/dashboard/customers');
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-stripe-background rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-stripe-text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-stripe-text">Add New Customer</h1>
            <p className="text-sm text-stripe-text-secondary mt-1">
              Create a new customer profile
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Customer Type */}
            <div>
              <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                Customer Type *
              </label>
              <select
                value={formData.customerType}
                onChange={(e) => setFormData({ ...formData, customerType: e.target.value as any })}
                className="form-input w-full"
                required
              >
                <option value="Individual">Individual</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                  Title *
                </label>
                <select
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input w-full"
                  required
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="form-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  className="form-input w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="form-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="form-input w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="form-input w-full"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                  Primary Mobile *
                </label>
                <input
                  type="tel"
                  value={formData.primaryMobile}
                  onChange={(e) => setFormData({ ...formData, primaryMobile: e.target.value })}
                  className="form-input w-full"
                  placeholder="+91 XXXXXXXXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                  Primary Email *
                </label>
                <input
                  type="email"
                  value={formData.primaryEmail}
                  onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                  className="form-input w-full"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="form-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stripe-text-secondary mb-2">
                  Annual Income (₹)
                </label>
                <input
                  type="number"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  className="form-input w-full"
                  min="0"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

