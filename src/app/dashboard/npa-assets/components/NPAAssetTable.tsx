'use client';

import Table, { Column } from '@/app/dashboard/components/Table';
import { NPAAsset } from '../types';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface NPAAssetTableProps {
  assets: NPAAsset[];
  onViewAsset: (asset: NPAAsset) => void;
  onEditAsset: (asset: NPAAsset) => void;
  onDeleteAsset: (assetId: string) => void;
  onAddRecoveryAction: (asset: NPAAsset) => void;
}

export default function NPAAssetTable({
  assets,
  onViewAsset,
  onEditAsset,
  onDeleteAsset,
  onAddRecoveryAction,
}: NPAAssetTableProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Substandard':
        return 'text-yellow-600 bg-yellow-100';
      case 'Doubtful':
        return 'text-orange-600 bg-orange-100';
      case 'Loss':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'In Progress':
        return 'text-blue-600 bg-blue-100';
      case 'Recovered':
        return 'text-green-600 bg-green-100';
      case 'Written Off':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDaysPastDueColor = (days: number) => {
    if (days <= 30) return 'text-green-600';
    if (days <= 90) return 'text-yellow-600';
    if (days <= 180) return 'text-orange-600';
    return 'text-red-600';
  };

  const columns: Column<NPAAsset>[] = [
    {
      accessor: 'assetId',
      header: 'Asset ID',
      render: (asset) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{asset.assetId}</div>
          <div className="text-sm text-gray-500">{asset.loanAccountNumber}</div>
        </div>
      ),
    },
    {
      accessor: 'customerName',
      header: 'Customer',
      render: (asset) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{asset.customerName}</div>
          <div className="text-sm text-gray-500">{asset.customerId}</div>
        </div>
      ),
    },
    {
      accessor: 'outstandingAmount',
      header: 'Outstanding Amount',
      render: (asset) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {formatCurrency(asset.outstandingAmount)}
          </div>
          <div className="text-sm text-gray-500">
            Est: {formatCurrency(asset.estimatedValue)}
          </div>
        </div>
      ),
    },
    {
      accessor: 'assetType',
      header: 'Asset Type',
      render: (asset) => (
        <div>
          <div className="text-sm text-gray-900">{asset.assetType}</div>
          <div className="text-sm text-gray-500">{asset.location}</div>
        </div>
      ),
    },
    {
      accessor: 'classification',
      header: 'Classification',
      render: (asset) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClassificationColor(asset.classification)}`}>
          {asset.classification}
        </span>
      ),
    },
    {
      accessor: 'recoveryStatus',
      header: 'Recovery Status',
      render: (asset) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.recoveryStatus)}`}>
          {asset.recoveryStatus}
        </span>
      ),
    },
    {
      accessor: 'daysPastDue',
      header: 'Days Past Due',
      render: (asset) => (
        <div>
          <div className={`text-sm font-medium ${getDaysPastDueColor(asset.daysPastDue)}`}>
            {asset.daysPastDue} days
          </div>
          <div className="text-sm text-gray-500">
            NPA: {formatDate(asset.npaDate)}
          </div>
        </div>
      ),
    },
    {
      accessor: 'assignedTo',
      header: 'Assigned To',
    },
  ];

  const renderActions = (asset: NPAAsset) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onViewAsset(asset)}
        className="text-blue-600 hover:text-blue-900 p-1 rounded"
        title="View Details"
      >
        <EyeIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => onEditAsset(asset)}
        className="text-green-600 hover:text-green-900 p-1 rounded"
        title="Edit Asset"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => onAddRecoveryAction(asset)}
        className="text-purple-600 hover:text-purple-900 p-1 rounded"
        title="Add Recovery Action"
      >
        <DocumentTextIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDeleteAsset(asset.id)}
        className="text-red-600 hover:text-red-900 p-1 rounded"
        title="Delete Asset"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table columns={columns} data={assets} renderActions={renderActions} />
      {assets.length === 0 && (
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No NPA assets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new NPA asset.
          </p>
        </div>
      )}
    </div>
  );
} 