"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  UserPlusIcon, 
  ArrowLeftIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { useAppContext, Customer } from "@/app/context/AppContext";

export default function CustomerIntakePage() {
  const router = useRouter();
  const { addCustomer } = useAppContext();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    accountType: "",
    verificationLevel: "Level 1",
    kycStatus: "Pending" as Customer["kycStatus"],
    accountBalance: "0.00",
    status: "Pending" as Customer["status"],
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newCustomerId, setNewCustomerId] = useState<string | null>(null);

  const accountTypes = [
    "Islamic Savings",
    "Islamic Current",
    "Mudarabah Investment",
    "Ijara Financing",
    "Halal Investment",
    "Takaful Insurance",
    "Sukuk Bond",
    "Waqf Endowment"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.accountType) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      // Create new customer object
      const newCustomer = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        accountType: formData.accountType,
        kycStatus: formData.kycStatus,
        verificationLevel: formData.verificationLevel,
        accountBalance: `AED ${formData.accountBalance}`,
        status: formData.status,
        lastActivity: "Just now",
        joinDate: new Date().toISOString().split('T')[0]
      };
      
      // Add customer to context
      const id = addCustomer(newCustomer);
      setNewCustomerId(id);
      
      // Show success message
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          router.push("/dashboard/customers");
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error("Error creating customer:", error);
      setLoading(false);
      alert("An error occurred while creating the customer.");
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Customer Account Created</h2>
          <p className="text-green-700 mb-4">
            The new Islamic banking account has been created and is pending KYC verification.
          </p>
          <p className="text-sm text-green-600">
            Customer ID: {newCustomerId}
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/customers"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              View All Customers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Customer Intake</h1>
          <p className="text-slate-600">
            Register a new customer for Islamic banking services
          </p>
        </div>
        <Link 
          href="/dashboard/customers"
          className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Customers
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Islamic Banking Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-slate-700 mb-1">
                Account Type *
              </label>
              <select
                id="accountType"
                value={formData.accountType}
                onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select account type</option>
                {accountTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="initialDeposit" className="block text-sm font-medium text-slate-700 mb-1">
                Initial Deposit (AED)
              </label>
              <input
                id="initialDeposit"
                type="number"
                min="0"
                step="0.01"
                value={formData.accountBalance}
                onChange={(e) => setFormData(prev => ({ ...prev, accountBalance: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="kycStatus" className="block text-sm font-medium text-slate-700 mb-1">
                KYC Status
              </label>
              <select
                id="kycStatus"
                value={formData.kycStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, kycStatus: e.target.value as Customer["kycStatus"] }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label htmlFor="verificationLevel" className="block text-sm font-medium text-slate-700 mb-1">
                Verification Level
              </label>
              <select
                id="verificationLevel"
                value={formData.verificationLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, verificationLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Level 1">Level 1 (Basic)</option>
                <option value="Level 2">Level 2 (Standard)</option>
                <option value="Level 3">Level 3 (Enhanced)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-700">
                  All accounts are created in compliance with Sharia principles. No interest (riba) will be charged or paid.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Create Customer Account
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 