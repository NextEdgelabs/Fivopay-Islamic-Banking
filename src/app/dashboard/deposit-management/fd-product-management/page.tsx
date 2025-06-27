'use client';

import { useState } from 'react';
import {
  BanknotesIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface FDProduct {
  id: string;
  productName: string;
  productCode: string;
  minAmount: number;
  maxAmount: number;
  tenure: {
    min: number;
    max: number;
    unit: 'months' | 'years';
  };
  profitRate: number;
  compounding: 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Yearly';
  isActive: boolean;
  shariaCompliant: boolean;
  description: string;
  eligibility: string[];
  features: string[];
  createdDate: string;
  totalAccounts: number;
  totalDeposits: number;
}

export default function FDProductManagementPage() {
  const [selectedProduct, setSelectedProduct] = useState<FDProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for FD products
  const fdProducts: FDProduct[] = [
    {
      id: '1',
      productName: 'Mudarabah Fixed Deposit - Premium',
      productCode: 'MFD-PREM',
      minAmount: 100000,
      maxAmount: 10000000,
      tenure: { min: 12, max: 60, unit: 'months' },
      profitRate: 7.5,
      compounding: 'Monthly',
      isActive: true,
      shariaCompliant: true,
      description: 'Premium fixed deposit based on Mudarabah principles with higher profit rates for larger deposits.',
      eligibility: ['Minimum deposit ₹1,00,000', 'Valid KYC documents', 'Age 18-75 years'],
      features: ['Sharia compliant profit sharing', 'Flexible tenure options', 'Premature withdrawal allowed'],
      createdDate: '2023-01-15',
      totalAccounts: 1247,
      totalDeposits: 124700000
    },
    {
      id: '2',
      productName: 'Mudarabah Fixed Deposit - Regular',
      productCode: 'MFD-REG',
      minAmount: 10000,
      maxAmount: 1000000,
      tenure: { min: 6, max: 36, unit: 'months' },
      profitRate: 6.8,
      compounding: 'Quarterly',
      isActive: true,
      shariaCompliant: true,
      description: 'Regular fixed deposit for retail customers based on Islamic profit-sharing principles.',
      eligibility: ['Minimum deposit ₹10,000', 'Valid identification', 'Resident of India'],
      features: ['Competitive profit rates', 'No hidden charges', 'Automatic renewal option'],
      createdDate: '2023-02-20',
      totalAccounts: 3456,
      totalDeposits: 345600000
    },
    {
      id: '3',
      productName: 'Senior Citizen Mudarabah FD',
      productCode: 'SC-MFD',
      minAmount: 5000,
      maxAmount: 500000,
      tenure: { min: 12, max: 24, unit: 'months' },
      profitRate: 8.0,
      compounding: 'Monthly',
      isActive: true,
      shariaCompliant: true,
      description: 'Special fixed deposit scheme for senior citizens with enhanced profit rates.',
      eligibility: ['Age 60 years and above', 'Minimum deposit ₹5,000', 'Valid age proof'],
      features: ['Higher profit rates', 'Monthly profit payout option', 'Medical emergency withdrawal'],
      createdDate: '2023-03-10',
      totalAccounts: 856,
      totalDeposits: 85600000
    },
    {
      id: '4',
      productName: 'Corporate Mudarabah FD',
      productCode: 'CORP-MFD',
      minAmount: 1000000,
      maxAmount: 100000000,
      tenure: { min: 6, max: 24, unit: 'months' },
      profitRate: 7.2,
      compounding: 'Quarterly',
      isActive: false,
      shariaCompliant: true,
      description: 'Fixed deposit scheme for corporate entities with bulk deposit advantages.',
      eligibility: ['Corporate entities only', 'Minimum deposit ₹10,00,000', 'Valid business registration'],
      features: ['Negotiable profit rates', 'Flexible payout options', 'Dedicated relationship manager'],
      createdDate: '2023-04-05',
      totalAccounts: 125,
      totalDeposits: 125000000
    }
  ];

  const filteredProducts = fdProducts.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.isActive) ||
                         (filterStatus === 'inactive' && !product.isActive);
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const openModal = (mode: 'view' | 'create' | 'edit', product?: FDProduct) => {
    setModalMode(mode);
    setSelectedProduct(product || null);
    setShowProductModal(true);
  };

  // Calculate statistics
  const totalProducts = fdProducts.length;
  const activeProducts = fdProducts.filter(p => p.isActive).length;
  const totalAccounts = fdProducts.reduce((sum, p) => sum + p.totalAccounts, 0);
  const totalDeposits = fdProducts.reduce((sum, p) => sum + p.totalDeposits, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FD Product Management</h1>
          <p className="text-gray-600 mt-1">Manage Mudarabah Fixed Deposit products and configurations</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create New Product</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
              <p className="text-sm text-blue-600 mt-1">{activeProducts} active</p>
            </div>
            <BanknotesIcon className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Accounts</p>
              <p className="text-3xl font-bold text-gray-900">{totalAccounts.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">Across all products</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deposits</p>
              <p className="text-3xl font-bold text-gray-900">₹{(totalDeposits / 10000000).toFixed(1)}Cr</p>
              <p className="text-sm text-green-600 mt-1">Portfolio value</p>
            </div>
            <CurrencyRupeeIcon className="w-12 h-12 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Profit Rate</p>
              <p className="text-3xl font-bold text-gray-900">7.1%</p>
              <p className="text-sm text-blue-600 mt-1">Sharia Compliant</p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-64 pl-10"
              />
              <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Products</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {totalProducts} products
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.productName}</h3>
                  <p className="text-sm text-gray-600">{product.productCode}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {product.shariaCompliant && (
                    <ShieldCheckIcon className="w-5 h-5 text-green-600" title="Sharia Compliant" />
                  )}
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.isActive 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profit Rate:</span>
                  <span className="text-sm font-medium text-gray-900">{product.profitRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Min Amount:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(product.minAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tenure:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.tenure.min}-{product.tenure.max} {product.tenure.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Accounts:</span>
                  <span className="text-sm font-medium text-gray-900">{product.totalAccounts.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4 line-clamp-2">{product.description}</p>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {formatCurrency(product.totalDeposits)} deposits
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal('view', product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openModal('edit', product)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Product">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalMode === 'create' ? 'Create New FD Product' : 
                 modalMode === 'edit' ? 'Edit FD Product' : 'FD Product Details'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {modalMode === 'view' && selectedProduct && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.productName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Code</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.productCode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profit Rate</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.profitRate}% per annum</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Compounding</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.compounding}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedProduct.minAmount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedProduct.maxAmount)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Eligibility Criteria</label>
                  <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                    {selectedProduct.eligibility.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Features</label>
                  <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {(modalMode === 'create' || modalMode === 'edit') && (
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.productName || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Code</label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.productCode || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profit Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue={selectedProduct?.profitRate || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Compounding</label>
                    <select
                      defaultValue={selectedProduct?.compounding || 'Monthly'}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Half-yearly">Half-yearly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Amount</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.minAmount || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Amount</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.maxAmount || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    defaultValue={selectedProduct?.description || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={selectedProduct?.isActive ?? true}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active Product</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={selectedProduct?.shariaCompliant ?? true}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Sharia Compliant</span>
                  </label>
                </div>
              </form>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {modalMode !== 'view' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
