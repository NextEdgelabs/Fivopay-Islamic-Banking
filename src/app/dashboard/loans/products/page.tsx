"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface LoanProduct {
  id: string;
  name: string;
  type: 'Personal' | 'Business' | 'Home' | 'Vehicle' | 'Education';
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  tenure: string;
  status: 'Active' | 'Inactive' | 'Draft';
  applications: number;
  disbursed: number;
  createdDate: string;
  description: string;
}

export default function ProductManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Mock data - replace with actual API calls
  const products: LoanProduct[] = [
    {
      id: '1',
      name: 'Halal Personal Loan',
      type: 'Personal',
      minAmount: 50000,
      maxAmount: 1000000,
      interestRate: 0, // Islamic banking - no interest
      tenure: '6-36 months',
      status: 'Active',
      applications: 156,
      disbursed: 89,
      createdDate: '2024-01-15',
      description: 'Sharia-compliant personal financing based on Murabaha principles'
    },
    {
      id: '2',
      name: 'Islamic Business Financing',
      type: 'Business',
      minAmount: 500000,
      maxAmount: 10000000,
      interestRate: 0,
      tenure: '12-60 months',
      status: 'Active',
      applications: 78,
      disbursed: 45,
      createdDate: '2024-01-10',
      description: 'Profit-sharing business financing based on Musharakah principles'
    },
    {
      id: '3',
      name: 'Home Purchase Plan',
      type: 'Home',
      minAmount: 1000000,
      maxAmount: 50000000,
      interestRate: 0,
      tenure: '60-240 months',
      status: 'Active',
      applications: 234,
      disbursed: 167,
      createdDate: '2024-01-05',
      description: 'Islamic home financing through Ijara (lease-to-own) structure'
    },
    {
      id: '4',
      name: 'Vehicle Financing',
      type: 'Vehicle',
      minAmount: 200000,
      maxAmount: 5000000,
      interestRate: 0,
      tenure: '12-84 months',
      status: 'Active',
      applications: 123,
      disbursed: 98,
      createdDate: '2023-12-20',
      description: 'Sharia-compliant vehicle financing through Murabaha structure'
    },
    {
      id: '5',
      name: 'Education Financing',
      type: 'Education',
      minAmount: 100000,
      maxAmount: 2000000,
      interestRate: 0,
      tenure: '12-120 months',
      status: 'Draft',
      applications: 0,
      disbursed: 0,
      createdDate: '2024-01-20',
      description: 'Islamic education financing with flexible repayment options'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || product.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'Inactive':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'Draft':
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const totalApplications = products.reduce((sum, p) => sum + p.applications, 0);
  const totalDisbursed = products.reduce((sum, p) => sum + p.disbursed, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
          <p className="text-slate-600">Manage Islamic banking loan products and financing options</p>
        </div>
        <Link 
          href="/dashboard/loans/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Product</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{totalProducts}</p>
              <p className="text-sm font-medium text-slate-600">Total Products</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{activeProducts}</p>
              <p className="text-sm font-medium text-slate-600">Active Products</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{totalApplications.toLocaleString()}</p>
              <p className="text-sm font-medium text-slate-600">Total Applications</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-50 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{totalDisbursed.toLocaleString()}</p>
              <p className="text-sm font-medium text-slate-600">Total Disbursed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="Personal">Personal</option>
              <option value="Business">Business</option>
              <option value="Home">Home</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Education">Education</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                <p className="text-sm text-slate-500">{product.type} Loan</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                {getStatusIcon(product.status)}
                <span className="ml-1">{product.status}</span>
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-4">{product.description}</p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Amount Range</p>
                  <p className="text-sm font-medium text-slate-600">₹{(product.minAmount / 100000).toFixed(1)}L - ₹{(product.maxAmount / 100000).toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tenure</p>
                  <p className="text-sm font-medium text-slate-600">{product.tenure}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Applications</p>
                  <p className="text-sm font-medium text-slate-600">{product.applications}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Disbursed</p>
                  <p className="text-sm font-medium text-slate-600">{product.disbursed}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1">
                <EyeIcon className="h-4 w-4" />
                <span className="text-sm">View</span>
              </button>
              <button className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center space-x-1">
                <PencilIcon className="h-4 w-4" />
                <span className="text-sm">Edit</span>
              </button>
              <button className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or create a new product.</p>
        </div>
      )}
    </div>
  );
} 