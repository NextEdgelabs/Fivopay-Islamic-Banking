import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, style, ...props }, ref) => {
    const variantClasses = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-stripe',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-neutral-200',
          variantClasses[variant],
          variant === 'text' && 'h-4',
          className
        )}
        style={{
          width,
          height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;

// Pre-built skeleton components
export const SkeletonCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="bg-white rounded-stripe border border-border-light p-6 space-y-3">
    <Skeleton variant="text" width="60%" height={20} />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" width={i === lines - 1 ? '80%' : '100%'} />
    ))}
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="bg-white rounded-stripe border border-border-light overflow-hidden">
    <div className="p-4 border-b border-border-light flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={16} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="p-4 border-b border-border-light flex gap-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} variant="text" width={`${100 / columns}%`} />
        ))}
      </div>
    ))}
  </div>
);
