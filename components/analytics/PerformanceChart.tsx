'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface PerformanceChartProps {
  data: any[];
  chartType: 'bar' | 'line';
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, chartType }) => {
  return (
    <Card>
      <div className="p-6 h-96">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="customers" fill="#8884d8" name="New Customers" />
              <Bar dataKey="loans" fill="#82ca9d" name="New Loans" />
              <Bar dataKey="deposits" fill="#ffc658" name="New Deposits" />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="customers" stroke="#8884d8" name="New Customers" />
              <Line type="monotone" dataKey="loans" stroke="#82ca9d" name="New Loans" />
              <Line type="monotone" dataKey="deposits" stroke="#ffc658" name="New Deposits" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PerformanceChart;
