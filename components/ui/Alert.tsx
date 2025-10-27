import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const variants = {
    success: {
      container: 'bg-success-50 border-success-200 text-success-800',
      icon: <CheckCircle className="h-5 w-5 text-success-500" />,
    },
    error: {
      container: 'bg-error-50 border-error-200 text-error-800',
      icon: <AlertCircle className="h-5 w-5 text-error-500" />,
    },
    warning: {
      container: 'bg-warning-50 border-warning-200 text-warning-800',
      icon: <AlertTriangle className="h-5 w-5 text-warning-500" />,
    },
    info: {
      container: 'bg-primary-50 border-primary-200 text-primary-800',
      icon: <Info className="h-5 w-5 text-primary-500" />,
    },
  };

  const config = variants[variant];

  return (
    <div
      className={cn(
        'flex items-start p-4 border rounded-stripe',
        config.container,
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="ml-3 flex-1">
        {title && <h3 className="text-sm font-semibold mb-1">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-3 inline-flex text-current hover:opacity-75 transition-opacity"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';

export default Alert;
