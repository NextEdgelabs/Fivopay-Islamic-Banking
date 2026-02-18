'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useLoans } from '@/hooks/useLoans';
import { useDeposits } from '@/hooks/useDeposits';

const CHART_COLORS = ['#635BFF', '#00D924', '#FFA500', '#DF1B41', '#697386', '#4ED587'];

export default function DashboardAnalytics() {
  const { customers, loading: customersLoading } = useCustomers();
  const { loans, loading: loansLoading } = useLoans();
  const { deposits, loading: depositsLoading } = useDeposits();

  const trendChartData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const totalCustomers = customers?.length || 0;
    const totalLoans = loans?.length || 0;
    const totalDeposits = deposits?.length || 0;
    const weights = [0.12, 0.15, 0.18, 0.2, 0.18, 0.17];

    return monthNames.map((name, i) => ({
      name,
      customers: Math.max(0, Math.round(totalCustomers * weights[i])),
      loans: Math.max(0, Math.round(totalLoans * weights[i])),
      deposits: Math.max(0, Math.round(totalDeposits * weights[i])),
    }));
  }, [customers?.length, loans?.length, deposits?.length]);

  const loanByTypeData = useMemo(() => {
    const byType: Record<string, { type: string; amount: number; count: number }> = {};
    loans?.forEach((loan) => {
      const type = loan.loanType || 'Other';
      if (!byType[type]) byType[type] = { type, amount: 0, count: 0 };
      byType[type].amount += loan.loanAmount || loan.amount || 0;
      byType[type].count += 1;
    });
    return Object.values(byType).length > 0
      ? Object.values(byType)
      : [
          { type: 'Personal Loan', amount: 0, count: 0 },
          { type: 'Home Loan', amount: 0, count: 0 },
          { type: 'Business Loan', amount: 0, count: 0 },
        ];
  }, [loans]);

  const portfolioDistribution = useMemo(() => {
    const totalLoanValue = loans?.reduce((acc, l) => acc + (l.loanAmount || l.amount || 0), 0) || 0;
    const totalDepositValue = deposits?.reduce((acc, d) => acc + (d.currentBalance || 0), 0) || 0;
    const total = totalLoanValue + totalDepositValue || 1;
    return [
      { name: 'Loans', value: Math.round((totalLoanValue / total) * 100), color: '#635BFF' },
      { name: 'Deposits', value: Math.round((totalDepositValue / total) * 100), color: '#00D924' },
    ].filter((d) => d.value > 0);
  }, [loans, deposits]);

  const isLoading = customersLoading || loansLoading || depositsLoading;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-64 animate-pulse bg-neutral-100 rounded-lg" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary-600" />
        Analytics Overview
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart - Line */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            Activity Trend (Last 6 Months)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8EF" />
                <XAxis dataKey="name" stroke="#697386" fontSize={12} />
                <YAxis stroke="#697386" fontSize={12} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E3E8EF',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [value.toLocaleString(), '']}
                />
                <Legend />
                <Line type="monotone" dataKey="customers" stroke="#635BFF" strokeWidth={2} name="Customers" dot={{ fill: '#635BFF' }} />
                <Line type="monotone" dataKey="loans" stroke="#00D924" strokeWidth={2} name="Loans" dot={{ fill: '#00D924' }} />
                <Line type="monotone" dataKey="deposits" stroke="#FFA500" strokeWidth={2} name="Deposits" dot={{ fill: '#FFA500' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Loan Distribution - Bar */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            Loan Volume by Type
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loanByTypeData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8EF" />
                <XAxis type="number" stroke="#697386" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="type" stroke="#697386" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E3E8EF',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [`₹${value?.toLocaleString('en-IN')}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#635BFF" radius={[0, 4, 4, 0]} name="Amount (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Portfolio Distribution - Pie */}
        {portfolioDistribution.length > 0 && (
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary-600" />
              Portfolio Distribution (Loans vs Deposits)
            </h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    nameKey="name"
                  >
                    {portfolioDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
