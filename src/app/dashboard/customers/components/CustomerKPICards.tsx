'use client';

import { ReactNode } from 'react';
import { 
  UserCircleIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

function KPICard({ title, value, icon: Icon, trend, subtitle, className = '' }: KPICardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="card-content">
        <div className="flex items-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-2xl font-bold text-stripe-text">{value}</p>
            <p className="text-sm font-medium text-stripe-text-secondary">{title}</p>
            {subtitle && (
              <p className="text-xs text-stripe-text-muted mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            {trend.isPositive ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface CustomerKPICardsProps {
  stats: {
    totalCustomers: number;
    activeCustomers: number;
    kycPending: number;
    highRiskCustomers: number;
  };
  className?: string;
}

export default function CustomerKPICards({ stats, className = '' }: CustomerKPICardsProps) {
  const kpiCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: UserCircleIcon,
      trend: {
        value: '+12% from last month',
        isPositive: true
      }
    },
    {
      title: 'Active Customers',
      value: stats.activeCustomers.toLocaleString(),
      icon: CheckCircleIcon,
      subtitle: stats.totalCustomers > 0 
        ? `${((stats.activeCustomers / stats.totalCustomers) * 100).toFixed(1)}% of total`
        : '0% of total',
      trend: {
        value: '+8.5% growth',
        isPositive: true
      }
    },
    {
      title: 'Pending KYC',
      value: stats.kycPending.toLocaleString(),
      icon: ClockIcon,
      subtitle: 'Requires verification',
      trend: {
        value: 'Needs attention',
        isPositive: false
      }
    },
    {
      title: 'High Risk',
      value: stats.highRiskCustomers.toLocaleString(),
      icon: ExclamationTriangleIcon,
      subtitle: 'Needs attention',
      trend: {
        value: 'Monitor closely',
        isPositive: false
      }
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {kpiCards.map((card, index) => (
        <KPICard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          trend={card.trend}
          subtitle={card.subtitle}
        />
      ))}
    </div>
  );
}
