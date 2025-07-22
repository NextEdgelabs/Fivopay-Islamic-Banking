'use client';

import { useState } from 'react';
import {
  UserIcon,
  UserGroupIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { CustomerAssignment, NewAssignmentFormData } from '../types';

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

// Add Assignment Modal
const AddAssignmentModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: NewAssignmentFormData) => void; 
}) => {
  const [formData, setFormData] = useState<NewAssignmentFormData>({
    agentId: '',
    customerId: '',
    collectionFrequency: 'Weekly',
    assignmentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      agentId: '',
      customerId: '',
      collectionFrequency: 'Weekly',
      assignmentDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add New Assignment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <option value="CUST004">Aisha Khan (CUST004)</option>
              <option value="CUST005">Omar Abdullah (CUST005)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Collection Frequency</label>
            <select
              value={formData.collectionFrequency}
              onChange={(e) => setFormData({...formData, collectionFrequency: e.target.value as 'Daily' | 'Weekly' | 'Monthly' | 'On Demand'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="On Demand">On Demand</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Date</label>
            <input
              type="date"
              value={formData.assignmentDate}
              onChange={(e) => setFormData({...formData, assignmentDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Additional notes about the assignment"
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
              Add Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Assignment Table Component
const AssignmentTable = ({ 
  assignments, 
  onViewDetails, 
  onEdit, 
  onDelete 
}: { 
  assignments: CustomerAssignment[]; 
  onViewDetails: (assignment: CustomerAssignment) => void;
  onEdit: (assignment: CustomerAssignment) => void;
  onDelete: (assignment: CustomerAssignment) => void;
}) => (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assignment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Frequency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Next Collection
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <tr key={assignment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">Assignment #{assignment.id}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(assignment.assignmentDate).toLocaleDateString()}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{assignment.agentName}</div>
                    <div className="text-sm text-gray-500">{assignment.branchName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{assignment.customerName}</div>
                    <div className="text-sm text-gray-500">{assignment.customerPhone}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  assignment.collectionFrequency === 'Daily' ? 'bg-blue-100 text-blue-800' :
                  assignment.collectionFrequency === 'Weekly' ? 'bg-green-100 text-green-800' :
                  assignment.collectionFrequency === 'Monthly' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {assignment.collectionFrequency}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  assignment.status === 'Active' ? 'bg-green-100 text-green-800' :
                  assignment.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {assignment.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {assignment.nextCollectionDate ? 
                    new Date(assignment.nextCollectionDate).toLocaleDateString() : 
                    'Not scheduled'
                  }
                </div>
                <div className="text-sm text-gray-500">
                  AED {assignment.outstandingAmount.toLocaleString()} due
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewDetails(assignment)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(assignment)}
                    className="text-green-600 hover:text-green-900"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(assignment)}
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

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for assignments
  const [assignments, setAssignments] = useState<CustomerAssignment[]>([
    {
      id: '1',
      agentId: 'FA001',
      agentName: 'Rahul Sharma',
      customerId: 'CUST001',
      customerName: 'Ahmed Hassan',
      customerPhone: '+971 50 123 4567',
      customerAddress: 'Andheri East, Mumbai, Maharashtra',
      assignmentDate: '2024-01-15',
      status: 'Active',
      collectionFrequency: 'Weekly',
      lastCollectionDate: '2024-01-18',
      nextCollectionDate: '2024-01-25',
      totalAmountDue: 50000,
      outstandingAmount: 15000,
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      notes: 'Regular weekly collection from residence',
    },
    {
      id: '2',
      agentId: 'FA002',
      agentName: 'Amit Patel',
      customerId: 'CUST002',
      customerName: 'Fatima Al-Zahra',
      customerPhone: '+971 50 234 5678',
      customerAddress: 'Bandra West, Mumbai, Maharashtra',
      assignmentDate: '2024-01-10',
      status: 'Active',
      collectionFrequency: 'Monthly',
      lastCollectionDate: '2024-01-15',
      nextCollectionDate: '2024-02-15',
      totalAmountDue: 75000,
      outstandingAmount: 25000,
      branchId: 'FP002',
      branchName: 'Bandra Branch',
      notes: 'Monthly collection from business premises',
    },
    {
      id: '3',
      agentId: 'FA003',
      agentName: 'Priya Singh',
      customerId: 'CUST003',
      customerName: 'Mohammed Ali',
      customerPhone: '+971 50 345 6789',
      customerAddress: 'Koregaon Park, Pune, Maharashtra',
      assignmentDate: '2024-01-12',
      status: 'Active',
      collectionFrequency: 'Daily',
      lastCollectionDate: '2024-01-19',
      nextCollectionDate: '2024-01-21',
      totalAmountDue: 30000,
      outstandingAmount: 18000,
      branchId: 'FP003',
      branchName: 'Pune Branch',
      notes: 'Daily collection from retail store',
    },
    {
      id: '4',
      agentId: 'FA001',
      agentName: 'Rahul Sharma',
      customerId: 'CUST004',
      customerName: 'Aisha Khan',
      customerPhone: '+971 50 456 7890',
      customerAddress: 'Andheri West, Mumbai, Maharashtra',
      assignmentDate: '2024-01-08',
      status: 'Inactive',
      collectionFrequency: 'On Demand',
      lastCollectionDate: '2024-01-10',
      totalAmountDue: 45000,
      outstandingAmount: 0,
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      notes: 'On-demand collection as needed',
    },
    {
      id: '5',
      agentId: 'FA002',
      agentName: 'Amit Patel',
      customerId: 'CUST005',
      customerName: 'Omar Abdullah',
      customerPhone: '+971 50 567 8901',
      customerAddress: 'Bandra East, Mumbai, Maharashtra',
      assignmentDate: '2024-01-20',
      status: 'Active',
      collectionFrequency: 'Weekly',
      lastCollectionDate: undefined,
      nextCollectionDate: '2024-01-27',
      totalAmountDue: 60000,
      outstandingAmount: 60000,
      branchId: 'FP002',
      branchName: 'Bandra Branch',
      notes: 'New assignment for weekly collection',
    },
  ]);

  // Filter assignments based on search and filters
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
      assignment.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.customerPhone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'all' || assignment.collectionFrequency === frequencyFilter;
    const matchesAgent = agentFilter === 'all' || assignment.agentId === agentFilter;
    
    return matchesSearch && matchesStatus && matchesFrequency && matchesAgent;
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

  const handleAddAssignment = (data: NewAssignmentFormData) => {
    const newAssignment: CustomerAssignment = {
      id: String(assignments.length + 1),
      agentId: data.agentId,
      agentName: data.agentId === 'FA001' ? 'Rahul Sharma' : data.agentId === 'FA002' ? 'Amit Patel' : 'Priya Singh',
      customerId: data.customerId,
      customerName: data.customerId === 'CUST001' ? 'Ahmed Hassan' : 
                   data.customerId === 'CUST002' ? 'Fatima Al-Zahra' : 
                   data.customerId === 'CUST003' ? 'Mohammed Ali' :
                   data.customerId === 'CUST004' ? 'Aisha Khan' : 'Omar Abdullah',
      customerPhone: '+971 50 123 4567',
      customerAddress: 'Mumbai, Maharashtra',
      assignmentDate: data.assignmentDate,
      status: 'Active',
      collectionFrequency: data.collectionFrequency,
      totalAmountDue: 50000,
      outstandingAmount: 50000,
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      notes: data.notes,
    };

    setAssignments(prev => [newAssignment, ...prev]);
    addToast('Assignment added successfully', 'success');
  };

  const handleViewDetails = (assignment: CustomerAssignment) => {
    addToast('View details functionality coming soon', 'info');
  };

  const handleEdit = (assignment: CustomerAssignment) => {
    addToast('Edit functionality coming soon', 'info');
  };

  const handleDelete = (assignment: CustomerAssignment) => {
    setAssignments(prev => prev.filter(a => a.id !== assignment.id));
    addToast('Assignment deleted successfully', 'success');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFrequencyFilter('all');
    setAgentFilter('all');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Assignments</h1>
          <p className="text-gray-600 mt-1">Manage customer-agent assignments and collection schedules</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{assignments.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Assignments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {assignments.filter(a => a.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                AED {assignments.reduce((sum, a) => sum + a.outstandingAmount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due This Week</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {assignments.filter(a => a.nextCollectionDate && 
                  new Date(a.nextCollectionDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-500">
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
                placeholder="Search assignments, agents, customers..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Temporary">Temporary</option>
          </select>
          
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Frequencies</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="On Demand">On Demand</option>
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

      {/* Assignments Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Assignments ({filteredAssignments.length})</h3>
          <div className="text-sm text-gray-500">
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </div>
        </div>
        <AssignmentTable 
          assignments={filteredAssignments} 
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add Assignment Modal */}
      <AddAssignmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAssignment}
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