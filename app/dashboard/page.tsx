'use client';

import React from 'react';
import {
  Card,
  Tabs,
  Alert,
} from '@/components/ui';
import TotalCustomersCard from '@/components/dashboard/TotalCustomersCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import PendingLoanApplications from '@/components/dashboard/PendingLoanApplications';
import QuickActions from '@/components/dashboard/QuickActions';
import ShareholdersWidget from '@/components/dashboard/ShareholdersWidget';
import DashboardLayout from '@/components/layout/DashboardLayout';

const tabs = [
  {
    id: 'transactions',
    label: 'All Transactions',
    content: (
      <div className="mt-4">
        <p>A full transaction list would be displayed here.</p>
      </div>
    ),
  },
];

export default function DashboardPage() {

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600 mt-1">
            Welcome back! Here&apos;s a summary of your operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TotalCustomersCard />
          {/* Add more stats cards here for Branches, Loans, Deposits later */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RecentTransactions />
          <div className="space-y-6">
            <PendingLoanApplications />
            <QuickActions />
          </div>
        </div>
        
        <ShareholdersWidget />

        <Card>
          <Tabs tabs={tabs} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
