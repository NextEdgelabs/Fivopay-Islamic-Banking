'use client';

import { useState } from 'react';
import {
  BanknotesIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface RDProduct {
  id: string;
  productName: string;
  productCode: string;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  tenure: {
    min: number;
    max: number;
    unit: 'months' | 'years';
  };
  profitRate: number;
  maturityBenefit: string;
  isActive: boolean;
  shariaCompliant: boolean;
  description: string;
  eligibility: string[];
  features: string[];
  createdDate: string;
  totalAccounts: number;
  totalDeposits: number;
  avgMonthlyDeposit: number;
}

export default function RDProductManagementPage() {
  const [selectedProduct, setSelectedProduct] = useState<RDProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for RD products
  const rdProducts: RDProduct[] = [
    {
      id: '1',
      productName: 'Mudarabah Recurring Deposit - Growth',
      productCode: 'MRD-GROW',
      minMonthlyAmount: 1000,
      maxMonthlyAmount: 50000,
      tenure: { min: 12, max: 60, unit: 'months' },
      profitRate: 7.2,
      maturityBenefit: 'Profit sharing based on bank performance',
      isActive: true,
      shariaCompliant: true,
      description: 'Systematic savings plan based on Mudarabah principles for wealth accumulation over time.',
      eligibility: ['Minimum monthly deposit ₹1,000', 'Valid KYC documents', 'Regular income proof'],
      features: ['Flexible monthly deposits', 'Profit sharing mechanism', 'Partial withdrawal after 1 year'],
      createdDate: '2023-01-20',
      totalAccounts: 2340,
      totalDeposits: 234000000,
      avgMonthlyDeposit: 3500
    },
    {
      id: '2',
      productName: 'Child Education Mudarabah RD',
      productCode: 'CE-MRD',
      minMonthlyAmount: 500,
      maxMonthlyAmount: 25000,
      tenure: { min: 60, max: 180, unit: 'months' },
      profitRate: 7.8,
      maturityBenefit: 'Higher profit rates for long-term savings',
      isActive: true,
      shariaCompliant: true,
      description: 'Special recurring deposit scheme for children education planning with enhanced benefits.',
      eligibility: ['Child age up to 15 years', 'Minimum monthly deposit ₹500', 'Parent/Guardian as nominee'],
      features: ['Higher profit rates', 'Education loan against deposits', 'Tax benefits under 80C'],
      createdDate: '2023-02-15',
      totalAccounts: 1876,
      totalDeposits: 187600000,
      avgMonthlyDeposit: 2800
    },
    {
      id: '3',
      productName: 'Senior Citizen Mudarabah RD',
      productCode: 'SC-MRD',
      minMonthlyAmount: 500,
      maxMonthlyAmount: 20000,
      tenure: { min: 12, max: 36, unit: 'months' },
      profitRate: 8.5,
      maturityBenefit: 'Enhanced profit with health insurance coverage',
      isActive: true,
      shariaCompliant: true,
      description: 'Tailored recurring deposit for senior citizens with additional health benefits.',
      eligibility: ['Age 60 years and above', 'Minimum monthly deposit ₹500', 'Health checkup certificate'],
      features: ['Highest profit rates', 'Free health insurance', 'Emergency withdrawal facility'],
      createdDate: '2023-03-05',
      totalAccounts: 1245,
      totalDeposits: 124500000,
      avgMonthlyDeposit: 2200
    },
    {
      id: '4',
      productName: 'Women Empowerment Mudarabah RD',
      productCode: 'WE-MRD',
      minMonthlyAmount: 200,
      maxMonthlyAmount: 15000,
      tenure: { min: 24, max: 60, unit: 'months' },
      profitRate: 7.5,
      maturityBenefit: 'Skill development program participation',
      isActive: true,
      shariaCompliant: true,
      description: 'Special scheme for women to promote financial inclusion and empowerment.',
      eligibility: ['Female applicants only', 'Minimum monthly deposit ₹200', 'Basic financial literacy'],
      features: ['Lower minimum amount', 'Skill development programs', 'Micro-enterprise loan facility'],
      createdDate: '2023-04-01',
      totalAccounts: 3456,
      totalDeposits: 345600000,
      avgMonthlyDeposit: 1800
    },
    {
      id: '5',
      productName: 'Corporate Employee RD',
      productCode: 'EMP-RD',
      minMonthlyAmount: 2000,
      maxMonthlyAmount: 75000,
      tenure: { min: 12, max: 48, unit: 'months' },
      profitRate: 6.8,
      maturityBenefit: 'Salary deduction convenience',
      isActive: false,
      shariaCompliant: true,
      description: 'Payroll-based recurring deposit for corporate employees with convenience features.',
      eligibility: ['Corporate employee', 'Salary account required', 'Employer partnership needed'],
      features: ['Automatic salary deduction', 'Competitive rates', 'Instant loan facility'],
      createdDate: '2023-05-10',
      totalAccounts: 567,
      totalDeposits: 56700000,
      avgMonthlyDeposit: 4500
    }
  ];

  const filteredProducts = rdProducts.filter(product => {
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

  const openModal = (mode: 'view' | 'create' | 'edit', product?: RDProduct) => {
    setModalMode(mode);
    setSelectedProduct(product || null);
    setShowProductModal(true);
  };

  // Calculate statistics
  const totalProducts = rdProducts.length;
  const activeProducts = rdProducts.filter(p => p.isActive).length;
  const totalAccounts = rdProducts.reduce((sum, p) => sum + p.totalAccounts, 0);
  const totalDeposits = rdProducts.reduce((sum, p) => sum + p.totalDeposits, 0);
  const avgProfitRate = rdProducts.reduce((sum, p) => sum + p.profitRate, 0) / rdProducts.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RD Product Management</h1>
          <p className="text-gray-600 mt-1">Manage Mudarabah Recurring Deposit products and configurations</p>
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
              <p className="text-sm text-green-600 mt-1">Monthly savers</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deposits</p>
              <p className="text-3xl font-bold text-gray-900">₹{(totalDeposits / 10000000).toFixed(1)}Cr</p>
              <p className="text-sm text-green-600 mt-1">Recurring portfolio</p>
            </div>
            <CurrencyRupeeIcon className="w-12 h-12 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Profit Rate</p>
              <p className="text-3xl font-bold text-gray-900">{avgProfitRate.toFixed(1)}%</p>
              <p className="text-sm text-blue-600 mt-1">Sharia Compliant</p>
            </div>
            <ArrowTrendingUpIcon className="w-12 h-12 text-red-600" />
          </div>
        </div>
      </div>

      {/* Monthly Deposits Trend */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Deposits Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">₹18.7 L</p>
            <p className="text-sm text-gray-600">This Month Collections</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">₹2,840</p>
            <p className="text-sm text-gray-600">Average Monthly Deposit</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">95.2%</p>
            <p className="text-sm text-gray-600">Collection Efficiency</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Profit Rate</p>
                  <p className="text-lg font-semibold text-gray-900">{product.profitRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monthly Range</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.minMonthlyAmount)} - {formatCurrency(product.maxMonthlyAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tenure</p>
                  <p className="text-sm font-medium text-gray-900">
                    {product.tenure.min}-{product.tenure.max} {product.tenure.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Accounts</p>
                  <p className="text-sm font-medium text-gray-900">{product.totalAccounts.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-xs text-gray-500">Maturity Benefit</p>
                <p className="text-sm font-medium text-gray-700">{product.maturityBenefit}</p>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Avg: {formatCurrency(product.avgMonthlyDeposit)}/month
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
                {modalMode === 'create' ? 'Create New RD Product' : 
                 modalMode === 'edit' ? 'Edit RD Product' : 'RD Product Details'}
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
                    <label className="block text-sm font-medium text-gray-700">Maturity Benefit</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.maturityBenefit}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Monthly Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedProduct.minMonthlyAmount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Monthly Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedProduct.maxMonthlyAmount)}</p>
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

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Accounts</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.totalAccounts.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Average Monthly Deposit</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedProduct.avgMonthlyDeposit)}</p>
                  </div>
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
                    <label className="block text-sm font-medium text-gray-700">Maturity Benefit</label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.maturityBenefit || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Monthly Amount</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.minMonthlyAmount || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Monthly Amount</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.maxMonthlyAmount || ''}
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
