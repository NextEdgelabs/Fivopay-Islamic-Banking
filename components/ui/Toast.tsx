'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const ToastContainer: React.FC<{
  toasts: Toast[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: Toast;
  onClose: () => void;
}> = ({ toast, onClose }) => {
  const variants = {
    success: {
      container: 'bg-success-50 border-success-500 text-success-800',
      icon: <CheckCircle className="h-5 w-5 text-success-500" />,
    },
    error: {
      container: 'bg-error-50 border-error-500 text-error-800',
      icon: <AlertCircle className="h-5 w-5 text-error-500" />,
    },
    warning: {
      container: 'bg-warning-50 border-warning-500 text-warning-800',
      icon: <AlertTriangle className="h-5 w-5 text-warning-500" />,
    },
    info: {
      container: 'bg-primary-50 border-primary-500 text-primary-800',
      icon: <Info className="h-5 w-5 text-primary-500" />,
    },
  };

  const config = variants[toast.type];

  return (
    <div
      className={cn(
        'flex items-start p-4 border-l-4 rounded-stripe shadow-lg backdrop-blur-sm animate-slide-up',
        config.container
      )}
      role="alert"
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <p className="ml-3 text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-3 inline-flex text-current hover:opacity-75 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
