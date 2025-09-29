
'use client';

import { useState } from 'react';
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { Branch } from '../types';

interface BranchReportModalProps {
  isOpen: boolean;
  branch: Branch | null;
  onClose: () => void;
}

export default function BranchReportModal({
  isOpen,
  branch,
  onClose
}: BranchReportModalProps) {
  const [reportType, setReportType] = useState<'performance' | 'financial' | 'operational'>('performance');
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });

  if (!isOpen || !branch) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const downloadReport = (format: 'pdf' | 'excel') => {
    // In a real application, this would generate and download the actual report
    
    // Simulate download
    const reportData = {
      branchCode: branch.branchCode,
      branchName: branch.branchName,
      reportType,
      dateRange,
      data: getReportData()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${branch.branchCode}_${reportType}_report.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const printReport = () => {
    // In a real application, this would open a print-friendly version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatePrintableReport());
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generatePrintableReport = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Branch Report - ${branch.branchName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin: 20px 0; }
            .metric { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FivoPay Branch Report</h1>
            <h2>${branch.branchName} (${branch.branchCode})</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h3>Branch Information</h3>
            <table>
              <tr><th>Manager</th><td>${branch.managerName}</td></tr>
              <tr><th>Location</th><td>${branch.city}, ${branch.state}</td></tr>
              <tr><th>Status</th><td>${branch.status}</td></tr>
              <tr><th>Established</th><td>${branch.establishedDate}</td></tr>
            </table>
          </div>
          
          <div class="section">
            <h3>Key Metrics</h3>
            <div class="metric">
              <strong>Employees:</strong> ${branch.employeeCount}
            </div>
            <div class="metric">
              <strong>Customers:</strong> ${branch.customerCount}
            </div>
            <div class="metric">
              <strong>Deposits:</strong> ${formatCurrency(branch.totalDeposits)}
            </div>
            <div class="metric">
              <strong>Loans:</strong> ${formatCurrency(branch.totalLoans)}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const getReportData = () => {
    switch (reportType) {
      case 'performance':
        return {
          customerGrowth: [
            { month: 'Jan', customers: 1200, growth: 5.2 },
            { month: 'Feb', customers: 1250, growth: 4.2 },
            { month: 'Mar', customers: 1300, growth: 4.0 },
          ],
          depositGrowth: [
            { month: 'Jan', amount: branch.totalDeposits * 0.85, growth: 12.5 },
            { month: 'Feb', amount: branch.totalDeposits * 0.92, growth: 8.2 },
            { month: 'Mar', amount: branch.totalDeposits, growth: 8.7 },
          ],
        };
      case 'financial':
        return {
          revenue: branch.totalDeposits * 0.05,
          expenses: branch.totalDeposits * 0.03,
          profit: branch.totalDeposits * 0.02,
          loanPortfolio: branch.totalLoans,
          npa: branch.totalLoans * 0.02,
        };
      case 'operational':
        return {
          employeeUtilization: 85,
          customerSatisfaction: 4.2,
          transactionVolume: 15420,
          branchEfficiency: 92,
        };
      default:
        return {};
    }
  };

  const renderReportContent = () => {
    const data = getReportData();

    switch (reportType) {
      case 'performance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <UserGroupIcon className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-stripe-text-secondary">Total Customers</p>
                    <p className="text-2xl font-bold text-stripe-text">{branch.customerCount}</p>
                    <p className="text-sm text-green-600">+8.3% this month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CurrencyRupeeIcon className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-stripe-text-secondary">Total Deposits</p>
                    <p className="text-2xl font-bold text-stripe-text">{formatCurrency(branch.totalDeposits)}</p>
                    <p className="text-sm text-green-600">+12.5% this month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <ChartBarIcon className="w-8 h-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-stripe-text-secondary">Total Loans</p>
                    <p className="text-2xl font-bold text-stripe-text">{formatCurrency(branch.totalLoans)}</p>
                    <p className="text-sm text-blue-600">+6.7% this month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <UserGroupIcon className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-stripe-text-secondary">Employees</p>
                    <p className="text-2xl font-bold text-stripe-text">{branch.employeeCount}</p>
                    <p className="text-sm text-stripe-text-secondary">Active staff</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stripe-background-light p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-stripe-text mb-3">Performance Trends</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stripe-text-secondary">Customer Acquisition Rate</span>
                  <span className="text-sm font-bold text-green-600">+5.2% this month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stripe-text-secondary">Deposit Growth Rate</span>
                  <span className="text-sm font-bold text-green-600">+8.7% this month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stripe-text-secondary">Loan Disbursement</span>
                  <span className="text-sm font-bold text-blue-600">+6.7% this month</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-stripe-text-secondary">Revenue</h4>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(branch.totalDeposits * 0.05)}</p>
                <p className="text-sm text-stripe-text-secondary">Monthly average</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-stripe-text-secondary">Expenses</h4>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(branch.totalDeposits * 0.03)}</p>
                <p className="text-sm text-stripe-text-secondary">Monthly average</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-stripe-text-secondary">Net Profit</h4>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(branch.totalDeposits * 0.02)}</p>
                <p className="text-sm text-stripe-text-secondary">Monthly average</p>
              </div>
            </div>

            <div className="bg-stripe-background-light p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-stripe-text mb-3">Financial Health</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stripe-text-secondary">Loan Portfolio</span>
                  <span className="text-sm font-bold text-stripe-text">{formatCurrency(branch.totalLoans)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stripe-text-secondary">Non-Performing Assets (NPA)</span>
                  <span className="text-sm font-bold text-red-600">{formatCurrency(branch.totalLoans * 0.02)} (2%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stripe-text-secondary">Deposit-to-Loan Ratio</span>
                  <span className="text-sm font-bold text-blue-600">{((branch.totalLoans / branch.totalDeposits) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'operational':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-stripe-text-secondary">Employee Utilization</p>
                <p className="text-3xl font-bold text-blue-600">85%</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-stripe-text-secondary">Customer Satisfaction</p>
                <p className="text-3xl font-bold text-green-600">4.2/5</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-stripe-text-secondary">Daily Transactions</p>
                <p className="text-3xl font-bold text-yellow-600">1,542</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-stripe-text-secondary">Branch Efficiency</p>
                <p className="text-3xl font-bold text-purple-600">92%</p>
              </div>
            </div>

            <div className="bg-stripe-background-light p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-stripe-text mb-3">Operational Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stripe-text-secondary">Average Service Time</span>
                  <span className="text-sm font-bold text-stripe-text">3.2 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stripe-text-secondary">Queue Length (Peak Hours)</span>
                  <span className="text-sm font-bold text-stripe-text">8 customers</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stripe-text-secondary">System Uptime</span>
                  <span className="text-sm font-bold text-green-600">99.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stripe-text-secondary">Customer Complaints</span>
                  <span className="text-sm font-bold text-red-600">3 this month</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-stripe-text">Branch Report</h3>
            <p className="text-stripe-text-secondary">{branch.branchName} ({branch.branchCode})</p>
          </div>
          <button
            onClick={onClose}
            className="text-stripe-text-secondary hover:text-stripe-text-secondary"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Report Controls */}
        <div className="mb-6 p-4 bg-stripe-background-light rounded-lg">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-stripe-text">Report Type:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as typeof reportType)}
                className="border border-stripe-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="performance">Performance Report</option>
                <option value="financial">Financial Report</option>
                <option value="operational">Operational Report</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-stripe-text">Period:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="border border-stripe-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-stripe-text-secondary">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="border border-stripe-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => downloadReport('pdf')}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => downloadReport('excel')}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>Excel</span>
              </button>
              <button
                onClick={printReport}
                className="bg-stripe-primary text-white px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2 text-sm"
              >
                <PrinterIcon className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-stripe-text capitalize">
              {reportType} Report - {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-stripe-text-secondary">
              <CalendarIcon className="w-4 h-4" />
              <span>Generated on {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          {renderReportContent()}
        </div>

        {/* Branch Details Summary */}
        <div className="mb-6 p-4 bg-stripe-background-light rounded-lg">
          <h4 className="text-md font-semibold text-stripe-text mb-3">Branch Information</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium text-stripe-text-secondary">Manager</p>
              <p className="text-stripe-text">{branch.managerName}</p>
            </div>
            <div>
              <p className="font-medium text-stripe-text-secondary">Location</p>
              <p className="text-stripe-text">{branch.city}, {branch.state}</p>
            </div>
            <div>
              <p className="font-medium text-stripe-text-secondary">Status</p>
              <p className="text-stripe-text">{branch.status}</p>
            </div>
            <div>
              <p className="font-medium text-stripe-text-secondary">Last Inspection</p>
              <p className="text-stripe-text">{branch.lastInspection}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stripe-border rounded-lg text-stripe-text hover:bg-stripe-background-light transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 