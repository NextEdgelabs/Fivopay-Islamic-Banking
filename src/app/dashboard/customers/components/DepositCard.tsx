'use client';

import { useState } from 'react';
import { 
  CurrencyDollarIcon, 
  CalendarIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { CustomerDeposit } from '@/types/customer';

interface DepositCardProps {
  deposit: CustomerDeposit;
  bankingMode?: 'conventional' | 'islamic';
  onViewCertificate?: (deposit: CustomerDeposit) => void;
  onPrematureClosure?: (deposit: CustomerDeposit) => void;
  onRenew?: (deposit: CustomerDeposit) => void;
  className?: string;
}

export default function DepositCard({ 
  deposit, 
  bankingMode = 'conventional',
  onViewCertificate,
  onPrematureClosure,
  onRenew,
  className = '' 
}: DepositCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Matured':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'Premature Closure':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'Matured':
        return <ClockIcon className="w-4 h-4" />;
      case 'Closed':
        return <XCircleIcon className="w-4 h-4" />;
      case 'Premature Closure':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <CheckCircleIcon className="w-4 h-4" />;
    }
  };

  const calculateRemainingTenure = () => {
    const now = new Date();
    const maturity = new Date(deposit.maturityDate);
    const diffTime = maturity.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Matured';
    
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    
    return `${months} months ${days} days`;
  };

  const getRateDisplay = () => {
    if (bankingMode === 'islamic') {
      return {
        label: 'Profit Rate',
        value: `${deposit.profitRate || 0}%`,
        subLabel: `Profit Sharing Ratio: ${deposit.profitSharingRatio || 0}%`
      };
    } else {
      return {
        label: 'Interest Rate',
        value: `${deposit.interestRate || 0}%`,
        subLabel: 'Annual Interest Rate'
      };
    }
  };

  const rateInfo = getRateDisplay();
  const remainingTenure = calculateRemainingTenure();
  const isActive = deposit.status === 'Active';
  const isMatured = deposit.status === 'Matured';

  return (
    <div className={`card hover:shadow-lg transition-shadow ${className}`}>
      <div className="card-content">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stripe-text">{deposit.accountNumber}</h3>
              <p className="text-sm text-stripe-text-secondary">{deposit.depositType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`}>
              {getStatusIcon(deposit.status)}
              <span className="ml-1">{deposit.status}</span>
            </span>
          </div>
        </div>

        {/* Deposit Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-stripe-text-secondary">Principal Amount</label>
            <p className="text-lg font-semibold text-stripe-text">₹{deposit.principalAmount.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-stripe-text-secondary">Current Value</label>
            <p className="text-lg font-semibold text-stripe-text">₹{deposit.currentValue.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-stripe-text-secondary">{rateInfo.label}</label>
            <p className="text-sm text-stripe-text">{rateInfo.value}</p>
            <p className="text-xs text-stripe-text-muted">{rateInfo.subLabel}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-stripe-text-secondary">Maturity Amount</label>
            <p className="text-sm text-stripe-text">₹{deposit.maturityAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-stripe-text-secondary">Start Date</label>
            <p className="text-sm text-stripe-text">{new Date(deposit.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-stripe-text-secondary">Maturity Date</label>
            <p className="text-sm text-stripe-text">{new Date(deposit.maturityDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Remaining Tenure */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">Remaining Tenure</span>
            <span className="text-sm font-semibold text-blue-800">{remainingTenure}</span>
          </div>
        </div>

        {/* Interest/Profit Credited */}
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">
              {bankingMode === 'islamic' ? 'Profit Credited' : 'Interest Credited'}
            </span>
            <span className="text-sm font-semibold text-green-800">₹{deposit.interestCredited.toLocaleString()}</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-sm">
            <span className="text-stripe-text-secondary mr-2">Auto Renewal:</span>
            <span className={deposit.autoRenewal ? 'text-green-600' : 'text-red-600'}>
              {deposit.autoRenewal ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-stripe-text-secondary mr-2">Nominee:</span>
            <span className={deposit.nomineeRegistered ? 'text-green-600' : 'text-red-600'}>
              {deposit.nomineeRegistered ? 'Registered' : 'Not Registered'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onViewCertificate && (
            <button
              onClick={() => onViewCertificate(deposit)}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-stripe-primary text-white text-sm rounded-lg hover:bg-stripe-primary-dark transition-colors"
            >
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              View Certificate
            </button>
          )}
          
          {isActive && onPrematureClosure && (
            <button
              onClick={() => onPrematureClosure(deposit)}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-yellow-300 text-yellow-700 text-sm rounded-lg hover:bg-yellow-50 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Premature Closure
            </button>
          )}
          
          {isMatured && onRenew && (
            <button
              onClick={() => onRenew(deposit)}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-stripe-border text-stripe-text text-sm rounded-lg hover:bg-stripe-background transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Renew Deposit
            </button>
          )}
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-stripe-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-stripe-text-secondary">Tenure</label>
                <p className="text-sm text-stripe-text">{deposit.tenure} months</p>
              </div>
              <div>
                <label className="text-sm font-medium text-stripe-text-secondary">Last Interest Date</label>
                <p className="text-sm text-stripe-text">
                  {deposit.lastInterestDate ? new Date(deposit.lastInterestDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              {deposit.prematureClosureCharges && deposit.prematureClosureCharges > 0 && (
                <div>
                  <label className="text-sm font-medium text-stripe-text-secondary">Premature Closure Charges</label>
                  <p className="text-sm text-stripe-text">₹{deposit.prematureClosureCharges.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toggle Expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-2 text-sm text-stripe-text-secondary hover:text-stripe-text transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More Details'}
        </button>
      </div>
    </div>
  );
}
