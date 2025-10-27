'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', Applications: 40 },
  { name: 'Feb', Applications: 30 },
  { name: 'Mar', Applications: 20 },
  { name: 'Apr', Applications: 27 },
  { name: 'May', Applications: 18 },
  { name: 'Jun', Applications: 23 },
  { name: 'Jul', Applications: 34 },
];

const ProductAnalyticsTab = ({ product }: { product: any }) => {
  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <p className="text-sm text-neutral-600">Active Customers</p>
            <p className="text-3xl font-bold">1,250</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm text-neutral-600">Total Volume</p>
            <p className="text-3xl font-bold">₹5,00,00,000</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm text-neutral-600">Conversion Rate</p>
            <p className="text-3xl font-bold">15%</p>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold p-6 border-b">Application Trend</h3>
        <div className="p-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Applications" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default ProductAnalyticsTab;
