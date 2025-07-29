'use client';

import { useState } from 'react';
import {
  BanknotesIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Collection, NewCollectionFormData } from '../types';

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

// Add Collection Modal
const AddCollectionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: NewCollectionFormData) => void; 
}) => {
  const [formData, setFormData] = useState<NewCollectionFormData>({
    agentId: '',
    customerId: '',
    amount: 0,
    collectionType: 'Cash',
    collectionDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    location: '',
    paymentMethod: 'Cash',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      agentId: '',
      customerId: '',
      amount: 0,
      collectionType: 'Cash',
      collectionDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      location: '',
      paymentMethod: 'Cash',
      notes: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add New Collection</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
              <select
                value={formData.agentId}
                onChange={(e) => setFormData({...formData, agentId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Agent</option>
                <option value="FA001">Rahul Sharma (FA001)</option>
                <option value="FA002">Amit Patel (FA002)</option>
                <option value="FA003">Priya Singh (FA003)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Customer</option>
                <option value="CUST001">Ahmed Hassan (CUST001)</option>
                <option value="CUST002">Fatima Al-Zahra (CUST002)</option>
                <option value="CUST003">Mohammed Ali (CUST003)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (INR)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection Type</label>
              <select
                value={formData.collectionType}
                onChange={(e) => setFormData({...formData, collectionType: e.target.value as 'Cash' | 'Cheque' | 'Digital Payment'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Digital Payment">Digital Payment</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date</label>
              <input
                type="date"
                value={formData.collectionDate}
                onChange={(e) => setFormData({...formData, collectionDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Collection location"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Digital Wallet">Digital Wallet</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Additional notes about the collection"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Collection Details Modal
const CollectionDetailsModal = ({ 
  isOpen, 
  collection, 
  onClose 
}: { 
  isOpen: boolean; 
  collection: Collection | null; 
  onClose: () => void; 
}) => {
  if (!isOpen || !collection) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Collection Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Collection Code</label>
              <p className="text-sm text-gray-900 mt-1">{collection.collectionCode}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Receipt Number</label>
              <p className="text-sm text-gray-900 mt-1">{collection.receiptNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Agent</label>
              <p className="text-sm text-gray-900 mt-1">{collection.agentName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <p className="text-sm text-gray-900 mt-1">{collection.customerName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <p className="text-sm text-gray-900 mt-1">INR {collection.amount.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Collection Type</label>
              <p className="text-sm text-gray-900 mt-1">{collection.collectionType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                collection.status === 'Completed' ? 'bg-green-100 text-green-800' :
                collection.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                collection.status === 'Failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {collection.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Verification Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                collection.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                collection.verificationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {collection.verificationStatus}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Collection Date</label>
              <p className="text-sm text-gray-900 mt-1">{new Date(collection.collectionDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <p className="text-sm text-gray-900 mt-1">{new Date(collection.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <p className="text-sm text-gray-900 mt-1">{collection.location}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <p className="text-sm text-gray-900 mt-1">{collection.paymentMethod}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <p className="text-sm text-gray-900 mt-1">{collection.branchName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Phone</label>
              <p className="text-sm text-gray-900 mt-1">{collection.customerPhone}</p>
            </div>
          </div>
          
          {collection.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <p className="text-sm text-gray-900 mt-1">{collection.notes}</p>
            </div>
          )}
          
          {collection.verifiedBy && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Verified By</label>
              <p className="text-sm text-gray-900 mt-1">{collection.verifiedBy}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Collection Table Component
const CollectionTable = ({ 
  collections, 
  onViewDetails, 
  onEdit, 
  onDelete 
}: { 
  collections: Collection[]; 
  onViewDetails: (collection: Collection) => void;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
}) => (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Collection
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {collections.map((collection) => (
            <tr key={collection.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{collection.collectionCode}</div>
                  <div className="text-sm text-gray-500">{collection.receiptNumber}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{collection.agentName}</div>
                  <div className="text-sm text-gray-500">{collection.branchName}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{collection.customerName}</div>
                  <div className="text-sm text-gray-500">{collection.customerPhone}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  INR {collection.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">{collection.collectionType}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    collection.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    collection.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    collection.status === 'Failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {collection.status}
                  </span>
                  {collection.verificationStatus === 'Verified' && (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(collection.collectionDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(collection.collectionDate).toLocaleTimeString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewDetails(collection)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(collection)}
                    className="text-green-600 hover:text-green-900"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(collection)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function CollectionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock data for collections
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: '1',
      collectionCode: 'COL001',
      agentId: 'FA001',
      agentName: 'Rahul Sharma',
      customerId: 'CUST001',
      customerName: 'Ahmed Hassan',
      customerPhone: '+971 50 123 4567',
      amount: 15000,
      collectionType: 'Cash',
      status: 'Completed',
      collectionDate: '2024-01-20T10:30:00Z',
      dueDate: '2024-01-20T00:00:00Z',
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      receiptNumber: 'RCP001234',
      notes: 'Collection from customer residence',
      location: 'Andheri East, Mumbai',
      paymentMethod: 'Cash',
      verificationStatus: 'Verified',
      verifiedBy: 'Priya Desai',
      verificationDate: '2024-01-20T11:00:00Z',
    },
    {
      id: '2',
      collectionCode: 'COL002',
      agentId: 'FA002',
      agentName: 'Amit Patel',
      customerId: 'CUST002',
      customerName: 'Fatima Al-Zahra',
      customerPhone: '+971 50 234 5678',
      amount: 25000,
      collectionType: 'Cheque',
      status: 'Pending',
      collectionDate: '2024-01-20T09:15:00Z',
      dueDate: '2024-01-21T00:00:00Z',
      branchId: 'FP002',
      branchName: 'Bandra Branch',
      receiptNumber: 'RCP001235',
      notes: 'Cheque collection from business premises',
      location: 'Bandra West, Mumbai',
      paymentMethod: 'Cheque',
      verificationStatus: 'Pending',
    },
    {
      id: '3',
      collectionCode: 'COL003',
      agentId: 'FA003',
      agentName: 'Priya Singh',
      customerId: 'CUST003',
      customerName: 'Mohammed Ali',
      customerPhone: '+971 50 345 6789',
      amount: 18000,
      collectionType: 'Digital Payment',
      status: 'Completed',
      collectionDate: '2024-01-20T11:45:00Z',
      dueDate: '2024-01-20T00:00:00Z',
      branchId: 'FP003',
      branchName: 'Pune Branch',
      receiptNumber: 'RCP001236',
      notes: 'Digital payment via mobile wallet',
      location: 'Koregaon Park, Pune',
      paymentMethod: 'Digital Wallet',
      verificationStatus: 'Verified',
      verifiedBy: 'Rajesh Kumar',
      verificationDate: '2024-01-20T12:15:00Z',
    },
  ]);

  // Filter collections based on search and filters
  const filteredCollections = collections.filter(collection => {
    const matchesSearch = searchTerm === '' || 
      collection.collectionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || collection.status === statusFilter;
    const matchesType = typeFilter === 'all' || collection.collectionType === typeFilter;
    const matchesAgent = agentFilter === 'all' || collection.agentId === agentFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesAgent;
  });

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleAddCollection = (data: NewCollectionFormData) => {
    const newCollection: Collection = {
      id: String(collections.length + 1),
      collectionCode: `COL${String(collections.length + 1).padStart(3, '0')}`,
      agentId: data.agentId,
      agentName: data.agentId === 'FA001' ? 'Rahul Sharma' : data.agentId === 'FA002' ? 'Amit Patel' : 'Priya Singh',
      customerId: data.customerId,
      customerName: data.customerId === 'CUST001' ? 'Ahmed Hassan' : data.customerId === 'CUST002' ? 'Fatima Al-Zahra' : 'Mohammed Ali',
      customerPhone: '+971 50 123 4567',
      amount: data.amount,
      collectionType: data.collectionType,
      status: 'Pending',
      collectionDate: data.collectionDate,
      dueDate: data.dueDate,
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      receiptNumber: `RCP${String(Date.now()).slice(-6)}`,
      notes: data.notes,
      location: data.location,
      paymentMethod: data.paymentMethod,
      verificationStatus: 'Pending',
    };

    setCollections(prev => [newCollection, ...prev]);
    addToast('Collection added successfully', 'success');
  };

  const handleViewDetails = (collection: Collection) => {
    setSelectedCollection(collection);
    setShowDetailsModal(true);
  };

  const handleEdit = (collection: Collection) => {
    addToast('Edit functionality coming soon', 'info');
  };

  const handleDelete = (collection: Collection) => {
    setCollections(prev => prev.filter(c => c.id !== collection.id));
    addToast('Collection deleted successfully', 'success');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setAgentFilter('all');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collection Management</h1>
          <p className="text-gray-600 mt-1">Track and manage cash collections from customers</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Collection</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collections</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{collections.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <BanknotesIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                INR {collections.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {collections.filter(c => c.status === 'Completed').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {collections.filter(c => c.status === 'Pending').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search collections, agents, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="Digital Payment">Digital Payment</option>
          </select>
          
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Agents</option>
            <option value="FA001">Rahul Sharma</option>
            <option value="FA002">Amit Patel</option>
            <option value="FA003">Priya Singh</option>
          </select>
          
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Collections Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Collections ({filteredCollections.length})</h3>
          <div className="text-sm text-gray-500">
            Showing {filteredCollections.length} of {collections.length} collections
          </div>
        </div>
        <CollectionTable 
          collections={filteredCollections} 
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add Collection Modal */}
      <AddCollectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCollection}
      />

      {/* Collection Details Modal */}
      <CollectionDetailsModal
        isOpen={showDetailsModal}
        collection={selectedCollection}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCollection(null);
        }}
      />

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
} 