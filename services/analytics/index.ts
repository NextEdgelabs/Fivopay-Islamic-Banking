import { customerService } from '@/services/customers';
import { loanService } from '@/services/loans';
import { depositService } from '@/services/deposits';
import { DateRange } from 'react-day-picker';

export interface PerformanceData {
  newCustomers: { value: number; trend: number };
  totalDeposits: { value: number; trend: number };
  totalLoans: { value: number; trend: number };
  loanRecovery: { value: number; trend: number };
  casaRatio: { value: number; trend: number };
  trendChartData: { name: string; customers: number; deposits: number; loans: number }[];
  productPerformance: {
    loans: { name: string; value: number }[];
    deposits: { name: string; value: number }[];
  };
  portfolioAtRisk: { value: number; trend: number };
}

export type DateRangePreset = 'day' | 'quarter' | 'year';

export const analyticsService = {
  async getBranchPerformanceData(branchId: string, range: DateRange | DateRangePreset | undefined): Promise<PerformanceData> {
    // Mock implementation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          newCustomers: { value: Math.floor(Math.random() * 50), trend: Math.random() * 20 - 10 },
          totalDeposits: { value: Math.floor(Math.random() * 10000000), trend: Math.random() * 20 - 10 },
          totalLoans: { value: Math.floor(Math.random() * 5000000), trend: Math.random() * 20 - 10 },
          loanRecovery: { value: Math.floor(Math.random() * 1000000), trend: Math.random() * 20 - 10 },
          casaRatio: { value: Math.random() * 100, trend: Math.random() * 5 - 2.5 },
          trendChartData: [
            { name: 'Jan', customers: 10, deposits: 200000, loans: 150000 },
            { name: 'Feb', customers: 15, deposits: 250000, loans: 180000 },
            { name: 'Mar', customers: 20, deposits: 300000, loans: 220000 },
          ],
          productPerformance: {
            loans: [
              { name: 'Personal Loan', value: 1500000 },
              { name: 'Home Loan', value: 2500000 },
              { name: 'Education Loan', value: 500000 },
            ],
            deposits: [
              { name: 'Fixed Deposit', value: 5000000 },
              { name: 'Recurring Deposit', value: 2000000 },
            ],
          },
          portfolioAtRisk: { value: Math.random() * 15, trend: Math.random() * 5 - 2.5 },
        });
      }, 500);
    });
  },
};
