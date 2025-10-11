'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  BanknotesIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { CustomerLoan, LoanRepayment } from '@/types/customer';
import { CustomerService } from '@/services/customer.service';

interface LoanDetailsModalProps {
  loan: CustomerLoan | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LoanDetailsModal({ loan, isOpen, onClose }: LoanDetailsModalProps) {
  const [repayments, setRepayments] = useState<LoanRepayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'schedule' | 'history' | 'notes'>('summary');

  useEffect(() => {
    if (loan && isOpen) {
      loadRepaymentHistory();
    }
  }, [loan, isOpen]);

  const loadRepaymentHistory = async () => {
    if (!loan) return;
    
    setLoading(true);
    try {
      const response = await CustomerService.getLoanRepaymentHistory(loan.customerId, loan.loanId);
      if (response.success && response.data) {
        setRepayments(response.data);
      }
    } catch (error) {
      console.error('Failed to load repayment history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !loan) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'Pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'Overdue':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'Waived':
        return <XCircleIcon className="w-4 h-4 text-gray-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-green-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'Overdue':
        return 'text-red-600';
      case 'Waived':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const recentRepayments = repayments.slice(0, 6);
  const upcomingRepayments = repayments.filter(r => r.status === 'Pending').slice(0, 6);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stripe-border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <BanknotesIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stripe-text">Loan Details</h2>
              <p className="text-sm text-stripe-text-secondary">{loan.accountNumber} - {loan.loanType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stripe-background rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-stripe-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-stripe-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'summary', name: 'Summary', icon: BanknotesIcon },
              { id: 'schedule', name: 'Schedule', icon: CalendarIcon },
              { id: 'history', name: 'History', icon: CurrencyDollarIcon },
              { id: 'notes', name: 'Notes', icon: ExclamationTriangleIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-stripe-primary text-stripe-primary'
                    : 'border-transparent text-stripe-text-secondary hover:text-stripe-text hover:border-stripe-border'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Loan Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-stripe-text">Loan Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Principal Amount:</span>
                      <span className="font-medium">₹{loan.principalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Outstanding Amount:</span>
                      <span className="font-medium">₹{loan.outstandingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">EMI Amount:</span>
                      <span className="font-medium">₹{loan.emiAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Interest Rate:</span>
                      <span className="font-medium">{loan.interestRate || loan.profitRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Tenure:</span>
                      <span className="font-medium">{loan.tenure} months</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-stripe-text">Payment Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Total EMIs:</span>
                      <span className="font-medium">{loan.totalEmis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Paid on Time:</span>
                      <span className="font-medium text-green-600">{loan.paidEmis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Delayed:</span>
                      <span className="font-medium text-yellow-600">{loan.delayedEmis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Defaults:</span>
                      <span className="font-medium text-red-600">{loan.defaultEmis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stripe-text-secondary">Avg Delay:</span>
                      <span className="font-medium">{loan.averageDelayDays} days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Officer */}
              {loan.loanOfficerName && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-stripe-text mb-2">Loan Officer</h3>
                  <p className="text-stripe-text">{loan.loanOfficerName}</p>
                  <p className="text-sm text-stripe-text-secondary">ID: {loan.loanOfficerId}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stripe-text">Upcoming EMIs</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stripe-primary mx-auto"></div>
                  <p className="text-stripe-text-secondary mt-2">Loading schedule...</p>
                </div>
              ) : upcomingRepayments.length > 0 ? (
                <div className="space-y-2">
                  {upcomingRepayments.map((repayment) => (
                    <div key={repayment.emiNumber} className="flex items-center justify-between p-3 border border-stripe-border rounded-lg">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-stripe-text">EMI #{repayment.emiNumber}</span>
                        <span className="ml-4 text-sm text-stripe-text-secondary">
                          Due: {new Date(repayment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-stripe-text mr-4">
                          ₹{repayment.amount.toLocaleString()}
                        </span>
                        {getStatusIcon(repayment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-stripe-text-secondary">No upcoming EMIs</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stripe-text">Recent Payment History</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stripe-primary mx-auto"></div>
                  <p className="text-stripe-text-secondary mt-2">Loading history...</p>
                </div>
              ) : recentRepayments.length > 0 ? (
                <div className="space-y-2">
                  {recentRepayments.map((repayment) => (
                    <div key={repayment.emiNumber} className="flex items-center justify-between p-3 border border-stripe-border rounded-lg">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-stripe-text">EMI #{repayment.emiNumber}</span>
                        <span className="ml-4 text-sm text-stripe-text-secondary">
                          {repayment.paidDate ? `Paid: ${new Date(repayment.paidDate).toLocaleDateString()}` : `Due: ${new Date(repayment.dueDate).toLocaleDateString()}`}
                        </span>
                        {repayment.delayDays > 0 && (
                          <span className="ml-2 text-xs text-red-600">({repayment.delayDays} days late)</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-stripe-text mr-4">
                          ₹{repayment.amount.toLocaleString()}
                        </span>
                        <span className={`text-sm font-medium ${getStatusColor(repayment.status)}`}>
                          {repayment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-stripe-text-secondary">No payment history available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stripe-text">Loan Notes & Communications</h3>
              <div className="text-center py-8">
                <p className="text-stripe-text-secondary">No notes or communications recorded</p>
                <button className="mt-2 px-4 py-2 bg-stripe-primary text-white rounded-lg hover:bg-stripe-primary-dark">
                  Add Note
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-stripe-border">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stripe-border text-stripe-text rounded-lg hover:bg-stripe-background"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
