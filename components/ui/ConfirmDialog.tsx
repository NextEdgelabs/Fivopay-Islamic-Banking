import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const variantStyles = {
    danger: {
      icon: 'bg-error-100 text-error-600',
      button: 'bg-error-500 hover:bg-error-600 text-white',
    },
    warning: {
      icon: 'bg-warning-100 text-warning-600',
      button: 'bg-warning-500 hover:bg-warning-600 text-white',
    },
    info: {
      icon: 'bg-primary-100 text-primary-600',
      button: 'bg-primary-500 hover:bg-primary-600 text-white',
    },
  };

  const style = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={style.button}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 ${style.icon} rounded-full flex items-center justify-center flex-shrink-0`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-neutral-700">{message}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

