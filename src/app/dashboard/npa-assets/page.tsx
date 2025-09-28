'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { NPAAsset, NPAAssetFormData, NPAAssetStatistics as NPAAssetStatisticsType, NPAAssetFilters as NPAAssetFiltersType, NPARecoveryAction } from './types';
import NPAAssetStatistics from './components/NPAAssetStatistics';
import NPAAssetTable from './components/NPAAssetTable';
import NPAAssetFilters from './components/NPAAssetFilters';
import AddNPAAssetModal from './components/AddNPAAssetModal';

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
      <button onClick={() => onRemove(toast.id)} className="ml-4 text-white hover:text-stripe-text-secondary">
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
        <h3 className="text-lg font-semibold text-stripe-text mb-2">{title}</h3>
        <p className="text-stripe-text-secondary mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stripe-border text-stripe-text rounded-lg hover:bg-stripe-background-light"
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

export default function NPAAssetsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<NPAAsset | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    assetId: '', 
    assetName: '',
    action: 'delete'
  });

  // Mock data for NPA assets
  const [npaAssets, setNpaAssets] = useState<NPAAsset[]>([
    {
      id: '1',
      assetId: 'NPA001',
      customerId: 'CUST001',
      customerName: 'Rajesh Kumar',
      loanAccountNumber: 'LA001234',
      originalLoanAmount: 5000000,
      outstandingAmount: 4500000,
      assetType: 'Real Estate',
      assetDescription: 'Commercial property in Andheri East, Mumbai',
      location: 'Andheri East, Mumbai, Maharashtra',
      acquisitionDate: '2020-03-15',
      npaDate: '2023-06-15',
      daysPastDue: 180,
      classification: 'Substandard',
      recoveryStatus: 'In Progress',
      assignedTo: 'Legal Team A',
      estimatedValue: 4200000,
      lastValuationDate: '2024-01-10',
      legalStatus: 'Case Filed',
      remarks: 'Property under legal proceedings for auction',
      documents: ['property_deed.pdf', 'valuation_report.pdf'],
      createdAt: '2023-06-20',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      assetId: 'NPA002',
      customerId: 'CUST002',
      customerName: 'Priya Sharma',
      loanAccountNumber: 'LA001235',
      originalLoanAmount: 2500000,
      outstandingAmount: 2200000,
      assetType: 'Vehicle',
      assetDescription: 'Commercial truck - Tata 407',
      location: 'Pune, Maharashtra',
      acquisitionDate: '2021-01-10',
      npaDate: '2023-08-20',
      daysPastDue: 150,
      classification: 'Doubtful',
      recoveryStatus: 'Pending',
      assignedTo: 'Recovery Team B',
      estimatedValue: 1800000,
      lastValuationDate: '2024-01-05',
      legalStatus: 'Notice Sent',
      remarks: 'Vehicle located, recovery in progress',
      documents: ['vehicle_rc.pdf', 'insurance_policy.pdf'],
      createdAt: '2023-08-25',
      updatedAt: '2024-01-10'
    },
    {
      id: '3',
      assetId: 'NPA003',
      customerId: 'CUST003',
      customerName: 'Amit Patel',
      loanAccountNumber: 'LA001236',
      originalLoanAmount: 8000000,
      outstandingAmount: 7500000,
      assetType: 'Real Estate',
      assetDescription: 'Residential apartment in Bandra West',
      location: 'Bandra West, Mumbai, Maharashtra',
      acquisitionDate: '2019-11-20',
      npaDate: '2023-05-10',
      daysPastDue: 250,
      classification: 'Loss',
      recoveryStatus: 'Written Off',
      assignedTo: 'Legal Team C',
      estimatedValue: 6500000,
      lastValuationDate: '2023-12-15',
      legalStatus: 'Auction Scheduled',
      remarks: 'Property scheduled for auction in March 2024',
      documents: ['apartment_deed.pdf', 'auction_notice.pdf'],
      createdAt: '2023-05-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '4',
      assetId: 'NPA004',
      customerId: 'CUST004',
      customerName: 'Sunita Gupta',
      loanAccountNumber: 'LA001237',
      originalLoanAmount: 1200000,
      outstandingAmount: 1100000,
      assetType: 'Equipment',
      assetDescription: 'Industrial machinery - CNC machines',
      location: 'Delhi, NCR',
      acquisitionDate: '2020-07-05',
      npaDate: '2023-09-30',
      daysPastDue: 110,
      classification: 'Substandard',
      recoveryStatus: 'Recovered',
      assignedTo: 'Recovery Team A',
      estimatedValue: 950000,
      lastValuationDate: '2024-01-08',
      legalStatus: 'No Legal Action',
      remarks: 'Successfully recovered through settlement',
      documents: ['machinery_invoice.pdf', 'settlement_agreement.pdf'],
      createdAt: '2023-10-05',
      updatedAt: '2024-01-12'
    },
    {
      id: '5',
      assetId: 'NPA005',
      customerId: 'CUST005',
      customerName: 'Vikram Singh',
      loanAccountNumber: 'LA001238',
      originalLoanAmount: 3500000,
      outstandingAmount: 3200000,
      assetType: 'Securities',
      assetDescription: 'Stock portfolio and mutual funds',
      location: 'Mumbai, Maharashtra',
      acquisitionDate: '2021-03-12',
      npaDate: '2023-07-25',
      daysPastDue: 170,
      classification: 'Doubtful',
      recoveryStatus: 'In Progress',
      assignedTo: 'Legal Team B',
      estimatedValue: 2800000,
      lastValuationDate: '2024-01-03',
      legalStatus: 'Court Order',
      remarks: 'Securities under court custody, liquidation in progress',
      documents: ['portfolio_statement.pdf', 'court_order.pdf'],
      createdAt: '2023-08-01',
      updatedAt: '2024-01-18'
    }
  ]);

  const [filters, setFilters] = useState<NPAAssetFiltersType>({
    classification: '',
    assetType: '',
    recoveryStatus: '',
    assignedTo: '',
    dateRange: {
      start: '',
      end: '',
    },
    amountRange: {
      min: 0,
      max: 0,
    },
    searchTerm: '',
  });

  // Calculate statistics
  const calculateStatistics = (): NPAAssetStatisticsType => {
    const totalAssets = npaAssets.length;
    const totalOutstandingAmount = npaAssets.reduce((sum, asset) => sum + asset.outstandingAmount, 0);
    const totalEstimatedValue = npaAssets.reduce((sum, asset) => sum + asset.estimatedValue, 0);
    
    const assetsByClassification = {
      substandard: npaAssets.filter(a => a.classification === 'Substandard').length,
      doubtful: npaAssets.filter(a => a.classification === 'Doubtful').length,
      loss: npaAssets.filter(a => a.classification === 'Loss').length,
    };
    
    const assetsByType = {
      realEstate: npaAssets.filter(a => a.assetType === 'Real Estate').length,
      vehicle: npaAssets.filter(a => a.assetType === 'Vehicle').length,
      equipment: npaAssets.filter(a => a.assetType === 'Equipment').length,
      securities: npaAssets.filter(a => a.assetType === 'Securities').length,
      other: npaAssets.filter(a => a.assetType === 'Other').length,
    };
    
    const assetsByStatus = {
      pending: npaAssets.filter(a => a.recoveryStatus === 'Pending').length,
      inProgress: npaAssets.filter(a => a.recoveryStatus === 'In Progress').length,
      recovered: npaAssets.filter(a => a.recoveryStatus === 'Recovered').length,
      writtenOff: npaAssets.filter(a => a.recoveryStatus === 'Written Off').length,
    };
    
    const averageDaysPastDue = npaAssets.length > 0 
      ? Math.round(npaAssets.reduce((sum, asset) => sum + asset.daysPastDue, 0) / npaAssets.length)
      : 0;
    
    const recoveryRate = totalAssets > 0 
      ? ((assetsByStatus.recovered + assetsByStatus.inProgress) / totalAssets) * 100
      : 0;

    return {
      totalAssets,
      totalOutstandingAmount,
      totalEstimatedValue,
      assetsByClassification,
      assetsByType,
      assetsByStatus,
      recoveryRate,
      averageDaysPastDue,
    };
  };

  // Filter assets based on current filters
  const getFilteredAssets = (): NPAAsset[] => {
    return npaAssets.filter(asset => {
      // Search term filter
      if (filters.searchTerm && !(
        asset.assetId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        asset.customerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        asset.loanAccountNumber.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )) {
        return false;
      }

      // Classification filter
      if (filters.classification && asset.classification !== filters.classification) {
        return false;
      }

      // Asset type filter
      if (filters.assetType && asset.assetType !== filters.assetType) {
        return false;
      }

      // Recovery status filter
      if (filters.recoveryStatus && asset.recoveryStatus !== filters.recoveryStatus) {
        return false;
      }

      // Assigned to filter
      if (filters.assignedTo && !asset.assignedTo.toLowerCase().includes(filters.assignedTo.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start && new Date(asset.npaDate) < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && new Date(asset.npaDate) > new Date(filters.dateRange.end)) {
        return false;
      }

      // Amount range filter
      if (filters.amountRange.min > 0 && asset.outstandingAmount < filters.amountRange.min) {
        return false;
      }
      if (filters.amountRange.max > 0 && asset.outstandingAmount > filters.amountRange.max) {
        return false;
      }

      return true;
    });
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const openConfirm = (assetId: string, assetName: string, action: 'delete') => {
    setConfirmDialog({
      isOpen: true,
      assetId,
      assetName,
      action,
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.action === 'delete') {
      setNpaAssets(prev => prev.filter(asset => asset.id !== confirmDialog.assetId));
      addToast(`NPA Asset "${confirmDialog.assetName}" has been deleted successfully.`);
    }
    setConfirmDialog({ isOpen: false, assetId: '', assetName: '', action: 'delete' });
  };

  const generateAssetId = () => {
    const existingIds = npaAssets.map(asset => asset.assetId);
    let counter = 1;
    let newId = `NPA${counter.toString().padStart(3, '0')}`;
    while (existingIds.includes(newId)) {
      counter++;
      newId = `NPA${counter.toString().padStart(3, '0')}`;
    }
    return newId;
  };

  const handleAddAsset = (data: NPAAssetFormData) => {
    const newAsset: NPAAsset = {
      id: Date.now().toString(),
      assetId: generateAssetId(),
      customerId: data.customerId,
      customerName: data.customerName,
      loanAccountNumber: data.loanAccountNumber,
      originalLoanAmount: data.originalLoanAmount,
      outstandingAmount: data.outstandingAmount,
      assetType: data.assetType,
      assetDescription: data.assetDescription,
      location: data.location,
      acquisitionDate: data.acquisitionDate,
      npaDate: data.npaDate,
      daysPastDue: Math.floor((Date.now() - new Date(data.npaDate).getTime()) / (1000 * 60 * 60 * 24)),
      classification: data.classification,
      recoveryStatus: 'Pending',
      assignedTo: data.assignedTo,
      estimatedValue: data.estimatedValue,
      lastValuationDate: new Date().toISOString().split('T')[0],
      legalStatus: 'No Legal Action',
      remarks: data.remarks,
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNpaAssets(prev => [newAsset, ...prev]);
    addToast(`NPA Asset "${newAsset.assetId}" has been added successfully.`);
  };

  const handleViewAsset = (asset: NPAAsset) => {
    setSelectedAsset(asset);
    // In a real application, you would open a detailed view modal
    addToast(`Viewing details for asset ${asset.assetId}`, 'info');
  };

  const handleEditAsset = (asset: NPAAsset) => {
    // In a real application, you would open an edit modal
    addToast(`Edit functionality for asset ${asset.assetId} would open here`, 'info');
  };

  const handleDeleteAsset = (assetId: string) => {
    const asset = npaAssets.find(a => a.id === assetId);
    if (asset) {
      openConfirm(assetId, asset.assetId, 'delete');
    }
  };

  const handleAddRecoveryAction = (asset: NPAAsset) => {
    // In a real application, you would open a recovery action modal
    addToast(`Add recovery action for asset ${asset.assetId} would open here`, 'info');
  };

  const handleExportData = () => {
    const filteredAssets = getFilteredAssets();
    const csvContent = [
      ['Asset ID', 'Customer Name', 'Outstanding Amount', 'Asset Type', 'Classification', 'Recovery Status', 'Days Past Due'],
      ...filteredAssets.map(asset => [
        asset.assetId,
        asset.customerName,
        asset.outstandingAmount.toString(),
        asset.assetType,
        asset.classification,
        asset.recoveryStatus,
        asset.daysPastDue.toString(),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `npa-assets-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    addToast('NPA Assets data exported successfully.');
  };

  const handleClearFilters = () => {
    setFilters({
      classification: '',
      assetType: '',
      recoveryStatus: '',
      assignedTo: '',
      dateRange: {
        start: '',
        end: '',
      },
      amountRange: {
        min: 0,
        max: 0,
      },
      searchTerm: '',
    });
  };

  const filteredAssets = getFilteredAssets();
  const statistics = calculateStatistics();

  return (
    <div className="min-h-screen bg-stripe-background-light">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, assetId: '', assetName: '', action: 'delete' })}
        onConfirm={handleConfirmAction}
        title="Confirm Action"
        message={`Are you sure you want to delete NPA Asset "${confirmDialog.assetName}"? This action cannot be undone.`}
      />

      {/* Add NPA Asset Modal */}
      <AddNPAAssetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAsset}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stripe-text">NPA Assets Management</h1>
              <p className="mt-2 text-stripe-text-secondary">
                Manage and track non-performing assets across all branches
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 border border-stripe-border text-stripe-text rounded-md hover:bg-stripe-background-light"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add NPA Asset
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-stripe-primary text-stripe-primary'
                  : 'border-transparent text-stripe-text-secondary hover:text-stripe-text hover:border-stripe-border'
              }`}
            >
              <ChartBarIcon className="h-5 w-5 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assets'
                  ? 'border-stripe-primary text-stripe-primary'
                  : 'border-transparent text-stripe-text-secondary hover:text-stripe-text hover:border-stripe-border'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 inline mr-2" />
              Assets ({filteredAssets.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            <NPAAssetStatistics statistics={statistics} />
          </div>
        ) : (
          <div className="space-y-6">
            <NPAAssetFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />
            <NPAAssetTable
              assets={filteredAssets}
              onViewAsset={handleViewAsset}
              onEditAsset={handleEditAsset}
              onDeleteAsset={handleDeleteAsset}
              onAddRecoveryAction={handleAddRecoveryAction}
            />
          </div>
        )}
      </div>
    </div>
  );
}
