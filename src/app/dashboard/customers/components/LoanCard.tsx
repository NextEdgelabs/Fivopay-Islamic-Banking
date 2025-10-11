'use client';

import { useState } from 'react';
import { 
  BanknotesIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { CustomerLoan } from '@/types/customer';

interface LoanCardProps {
  loan: CustomerLoan;
  onViewBasic: (loan: CustomerLoan) => void;
  onViewFull: (loan: CustomerLoan) => void;
  className?: string;
}

export default function LoanCard({ loan, onViewBasic, onViewFull, className = '' }: LoanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'Settled':
        return 'bg-blue-100 text-blue-800';
      case 'Default':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'Overdue':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'Default':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <CheckCircleIcon className="w-4 h-4" />;
    }
  };

  const repaymentProgress = loan.totalEmis > 0 ? (loan.paidEmis / loan.totalEmis) * 100 : 0;
  const outstandingPercentage = loan.principalAmount > 0 ? (loan.outstandingAmount / loan.principalAmount) * 100 : 0;

  return (
    <div className={`card hover:shadow-lg transition-shadow ${className}`}>
      <div className="card-content">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <BanknotesIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stripe-text">{loan.accountNumber}</h3>
              <p className="text-sm text-stripe-text-secondary">{loan.loanType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
              {getStatusIcon(loan.status)}
              <span className="ml-1">{loan.status}</span>
            </span>
          </div>
        </div>

        {/* Loan Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-stripe-text-secondary">Principal Amount</label>
            <p className="text-lg font-semibold text-stripe-text">₹{loan.principalAmount.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-stripe-text-secondary">Outstanding Amount</label>
            <p className="text-lg font-semibold text-stripe-text">₹{loan.outstandingAmount.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-stripe-text-secondary">EMI Amount</label>
            <p className="text-sm text-stripe-text">₹{loan.emiAmount.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-stripe-text-secondary">Next EMI Date</label>
            <p className="text-sm text-stripe-text">{new Date(loan.nextEmiDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-stripe-text-secondary mb-1">
            <span>Repayment Progress</span>
            <span>{repaymentProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${repaymentProgress}%` }}
            />
          </div>
        </div>

        {/* EMI Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">{loan.paidEmis}</div>
            <div className="text-xs text-green-600">Paid on Time</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <div className="text-lg font-semibold text-yellow-600">{loan.delayedEmis}</div>
            <div className="text-xs text-yellow-600">Delayed</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="text-lg font-semibold text-red-600">{loan.defaultEmis}</div>
            <div className="text-xs text-red-600">Defaults</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">{loan.totalEmis}</div>
            <div className="text-xs text-blue-600">Total EMIs</div>
          </div>
        </div>

        {/* Loan Officer */}
        {loan.loanOfficerName && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-stripe-text-secondary">Loan Officer</div>
            <div className="text-sm font-medium text-stripe-text">{loan.loanOfficerName}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewBasic(loan)}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-stripe-primary text-white text-sm rounded-lg hover:bg-stripe-primary-dark transition-colors"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            View Basic Details
          </button>
          <button
            onClick={() => onViewFull(loan)}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-stripe-border text-stripe-text text-sm rounded-lg hover:bg-stripe-background transition-colors"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
            View Full Details
          </button>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-stripe-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-stripe-text-secondary">Disbursement Date</label>
                <p className="text-sm text-stripe-text">{new Date(loan.disbursementDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-stripe-text-secondary">Tenure</label>
                <p className="text-sm text-stripe-text">{loan.tenure} months</p>
              </div>
              <div>
                <label className="text-sm font-medium text-stripe-text-secondary">Interest Rate</label>
                <p className="text-sm text-stripe-text">{loan.interestRate || loan.profitRate}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-stripe-text-secondary">Average Delay</label>
                <p className="text-sm text-stripe-text">{loan.averageDelayDays} days</p>
              </div>
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
