'use client';

import { Card } from '@/components/ui';
import { useProducts } from '@/hooks/useProducts';
import { useLoans } from '@/hooks/useLoans';
import { useDeposits } from '@/hooks/useDeposits';
import { Package, IndianRupee, Landmark } from 'lucide-react';
import React from 'react';

const ProductKpiWidget = () => {
  const { products } = useProducts({ status: 'Active' });
  const { loans } = useLoans();
  const { deposits } = useDeposits();

  const totalLoanValue = loans.reduce((acc, loan) => acc + (loan.loanAmount || 0), 0);
  const totalDepositValue = deposits.reduce((acc, deposit) => acc + deposit.currentBalance, 0);

  return (
    <Card>
      <h2 className="text-xl font-semibold p-6 border-b">Product KPIs</h2>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center">
            <Package className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-600">Active Products</p>
            <p className="text-2xl font-bold text-neutral-900">{products.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center">
            <IndianRupee className="h-6 w-6 text-success-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-600">Total Loan Value</p>
            <p className="text-2xl font-bold text-neutral-900">₹{totalLoanValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-info-100 rounded-stripe flex items-center justify-center">
            <Landmark className="h-6 w-6 text-info-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-600">Total Deposit Value</p>
            <p className="text-2xl font-bold text-neutral-900">₹{totalDepositValue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductKpiWidget;
