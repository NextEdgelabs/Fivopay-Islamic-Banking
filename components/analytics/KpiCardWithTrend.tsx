'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface KpiCardWithTrendProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  trendLabel: string;
}

const KpiCardWithTrend: React.FC<KpiCardWithTrendProps> = ({ title, value, trend, icon, trendLabel }) => {
  const isPositive = trend >= 0;
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div>
              <p className="text-sm text-neutral-600">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center justify-end text-sm font-semibold ${isPositive ? 'text-success-600' : 'text-error-600'}`}>
              {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(trend).toFixed(1)}%
            </div>
            <p className="text-xs text-neutral-500">{trendLabel}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KpiCardWithTrend;
