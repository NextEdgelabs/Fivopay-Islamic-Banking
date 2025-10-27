import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  ariaLabel: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'ghost',
      size = 'md',
      loading = false,
      ariaLabel,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    };

    const variantClasses = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600',
      secondary: 'bg-white text-primary-600 border-2 border-primary-500 hover:bg-primary-50',
      danger: 'bg-error-500 text-white hover:bg-error-600',
      ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-stripe transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
