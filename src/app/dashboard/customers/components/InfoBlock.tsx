'use client';

import { ReactNode } from 'react';

interface InfoBlockProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export default function InfoBlock({ 
  title, 
  icon: Icon, 
  children, 
  className = '',
  headerAction 
}: InfoBlockProps) {
  return (
    <div className={`card ${className}`}>
      <div className="card-content">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {Icon && (
              <div className="p-2 bg-stripe-background rounded-lg mr-3">
                <Icon className="w-5 h-5 text-stripe-text-secondary" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-stripe-text">{title}</h3>
          </div>
          {headerAction && (
            <div className="flex items-center">
              {headerAction}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string | ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function InfoRow({ label, value, icon: Icon, className = '' }: InfoRowProps) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-stripe-border last:border-b-0 ${className}`}>
      <div className="flex items-center">
        {Icon && <Icon className="w-4 h-4 text-stripe-text-muted mr-2" />}
        <span className="text-sm font-medium text-stripe-text-secondary">{label}</span>
      </div>
      <div className="text-sm text-stripe-text text-right max-w-[60%]">
        {value}
      </div>
    </div>
  );
}
