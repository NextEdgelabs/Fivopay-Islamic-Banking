'use client';

import { NPAAssetStatistics as NPAAssetStatisticsType } from '../types';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface NPAAssetStatisticsProps {
  statistics: NPAAssetStatisticsType;
}

export default function NPAAssetStatistics({ statistics }: NPAAssetStatisticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
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

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total NPA Assets</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(statistics.totalOutstandingAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estimated Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(statistics.totalEstimatedValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Days Past Due</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.averageDaysPastDue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Classification Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets by Classification</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Substandard</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {statistics.assetsByClassification.substandard}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Doubtful</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {statistics.assetsByClassification.doubtful}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Loss</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {statistics.assetsByClassification.loss}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets by Type</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Real Estate</span>
              <span className="text-sm font-semibold text-gray-900">
                {statistics.assetsByType.realEstate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Vehicle</span>
              <span className="text-sm font-semibold text-gray-900">
                {statistics.assetsByType.vehicle}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Equipment</span>
              <span className="text-sm font-semibold text-gray-900">
                {statistics.assetsByType.equipment}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Securities</span>
              <span className="text-sm font-semibold text-gray-900">
                {statistics.assetsByType.securities}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Other</span>
              <span className="text-sm font-semibold text-gray-900">
                {statistics.assetsByType.other}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recovery Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{statistics.assetsByStatus.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics.assetsByStatus.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.assetsByStatus.recovered}</div>
            <div className="text-sm text-gray-600">Recovered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statistics.assetsByStatus.writtenOff}</div>
            <div className="text-sm text-gray-600">Written Off</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Overall Recovery Rate</span>
            <span className="text-lg font-bold text-green-600">
              {formatPercentage(statistics.recoveryRate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 