import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-stripe border border-border-light p-6 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-error-500 mr-1" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                )}
              >
                {Math.abs(trend.value)}%
              </span>
              {description && (
                <span className="text-sm text-neutral-500 ml-2">
                  {description}
                </span>
              )}
            </div>
          )}
          
          {!trend && description && (
            <p className="text-sm text-neutral-500 mt-2">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className="ml-4 flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center text-primary-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

StatsCard.displayName = 'StatsCard';

export default StatsCard;
