
'use client';

import { useState } from 'react';
import { useDepositContext, FDProduct } from '../context/DepositContext';
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
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Toast notification state
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Toast component
const Toast = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const bgColor = toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}>
      <span>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="ml-4 text-white hover:text-gray-200">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

// Confirmation dialog component
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Form data interface for creating/editing products
interface ProductFormData {
  name: string;
  minAmount: number;
  maxAmount: number;
  profitRate: number;
  tenure: {
    years: number;
    months: number;
  };
  status: 'Active' | 'Inactive';
  description: string;
}

export default function FDProductManagementPage() {
  const { fdProducts, addFDProduct, updateFDProduct, deleteFDProduct } = useDepositContext();
  
  const [selectedProduct, setSelectedProduct] = useState<FDProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    productId: '', 
    productName: '',
    action: '' as 'delete' | 'activate' | 'deactivate'
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    minAmount: 0,
    maxAmount: 0,
    profitRate: 0,
    tenure: { years: 0, months: 0 },
    status: 'Active',
    description: ''
  });

  const filteredProducts = fdProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.status === 'Active') ||
                         (filterStatus === 'inactive' && product.status === 'Inactive');
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
    
    if (mode === 'create') {
      setFormData({
        name: '',
        minAmount: 0,
        maxAmount: 0,
        profitRate: 0,
        tenure: { years: 0, months: 0 },
        status: 'Active',
        description: ''
      });
    } else if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        profitRate: product.profitRate,
        tenure: product.tenure,
        status: product.status,
        description: product.description
      });
    }
    
    setShowProductModal(true);
  };

  // Calculate statistics
  const totalProducts = fdProducts.length;
  const activeProducts = fdProducts.filter(p => p.status === 'Active').length;
  const totalAccounts = 0; // This would come from actual account data
  const totalDeposits = 0; // This would come from actual deposit data

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Confirmation dialog functions
  const openDeleteConfirm = (id: string, name: string, action: 'delete' | 'activate' | 'deactivate') => {
    setConfirmDialog({ isOpen: true, productId: id, productName: name, action });
  };

  const handleConfirmAction = () => {
    const { action, productId, productName } = confirmDialog;
    
    if (action === 'delete') {
      deleteFDProduct(productId);
      addToast(`Product "${productName}" has been deleted successfully`, 'success');
    } else if (action === 'activate') {
      updateFDProduct(productId, { status: 'Active' });
      addToast(`Product "${productName}" has been activated successfully`, 'success');
    } else if (action === 'deactivate') {
      updateFDProduct(productId, { status: 'Inactive' });
      addToast(`Product "${productName}" has been deactivated successfully`, 'success');
    }
    
    setConfirmDialog({ isOpen: false, productId: '', productName: '', action: 'delete' });
  };

  // Form handling
  const handleFormChange = (field: keyof ProductFormData, value: string | number | 'Active' | 'Inactive') => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTenureChange = (field: 'years' | 'months', value: number) => {
    setFormData(prev => ({
      ...prev,
      tenure: {
        ...prev.tenure,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      addToast('Product name is required', 'error');
      return;
    }
    if (formData.minAmount <= 0) {
      addToast('Minimum amount must be greater than 0', 'error');
      return;
    }
    if (formData.maxAmount <= formData.minAmount) {
      addToast('Maximum amount must be greater than minimum amount', 'error');
      return;
    }
    if (formData.profitRate <= 0) {
      addToast('Profit rate must be greater than 0', 'error');
      return;
    }
    if (formData.tenure.years === 0 && formData.tenure.months === 0) {
      addToast('Tenure must be at least 1 month', 'error');
      return;
    }
    if (!formData.description.trim()) {
      addToast('Description is required', 'error');
      return;
    }

    if (modalMode === 'create') {
      addFDProduct(formData);
      addToast('Product created successfully', 'success');
    } else if (modalMode === 'edit' && selectedProduct) {
      updateFDProduct(selectedProduct.id, formData);
      addToast('Product updated successfully', 'success');
    }
    
    setShowProductModal(false);
  };

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
              <p className="text-3xl font-bold text-gray-900">
                {fdProducts.length > 0 
                  ? (fdProducts.reduce((sum, p) => sum + p.profitRate, 0) / fdProducts.length).toFixed(1)
                  : '0.0'
                }%
              </p>
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
                className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 w-64 pl-10"
              />
              <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2"
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
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">ID: {product.id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" title="Sharia Compliant" />
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.status === 'Active'
                      ? 'text-green-600 bg-green-100' 
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {product.status}
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
                  <span className="text-sm text-gray-600">Max Amount:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(product.maxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tenure:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.tenure.years > 0 && `${product.tenure.years} year${product.tenure.years > 1 ? 's' : ''} `}
                    {product.tenure.months > 0 && `${product.tenure.months} month${product.tenure.months > 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4 line-clamp-2">{product.description}</p>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Created: {new Date().toLocaleDateString()}
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
                  <button 
                    onClick={() => openDeleteConfirm(product.id, product.name, 'delete')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    title="Delete Product"
                  >
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
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {modalMode === 'view' && selectedProduct && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profit Rate</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.profitRate}% per annum</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.status}</p>
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
              </div>
            )}

            {(modalMode === 'create' || modalMode === 'edit') && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profit Rate (%) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.profitRate}
                      onChange={(e) => handleFormChange('profitRate', parseFloat(e.target.value) || 0)}
                      className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter profit rate"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Amount *</label>
                    <input
                      type="number"
                      value={formData.minAmount}
                      onChange={(e) => handleFormChange('minAmount', parseInt(e.target.value) || 0)}
                      className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter minimum amount"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Amount *</label>
                    <input
                      type="number"
                      value={formData.maxAmount}
                      onChange={(e) => handleFormChange('maxAmount', parseInt(e.target.value) || 0)}
                      className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter maximum amount"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tenure (Years)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.tenure.years}
                      onChange={(e) => handleTenureChange('years', parseInt(e.target.value) || 0)}
                      className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tenure (Months)</label>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={formData.tenure.months}
                      onChange={(e) => handleTenureChange('months', parseInt(e.target.value) || 0)}
                      className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Months"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product description"
                    required
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.status === 'Active'}
                      onChange={(e) => handleFormChange('status', e.target.checked ? 'Active' : 'Inactive')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active Product</span>
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, productId: '', productName: '', action: 'delete' })}
        onConfirm={handleConfirmAction}
        title={`Confirm ${confirmDialog.action}`}
        message={`Are you sure you want to ${confirmDialog.action} the product "${confirmDialog.productName}"? This action cannot be undone.`}
      />
    </div>
  );
}
