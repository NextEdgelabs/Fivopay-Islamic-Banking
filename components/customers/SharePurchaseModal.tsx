'use client';

import React, { useState, useEffect } from 'react';
import { useSharePurchaseMutations } from '@/hooks/useSharePurchaseMutations';
import { useOrganizationSettings } from '@/hooks/useOrganizationSettings';
import { Input, Select, Textarea, Button } from '@/components/ui';
import { X, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { SharePurchase, CreateSharePurchaseDto, UpdateSharePurchaseDto } from '@/services/customers.service';

interface SharePurchaseModalProps {
  customerId: string;
  purchase?: SharePurchase | null;
  onClose: (shouldRefresh?: boolean) => void;
}

export default function SharePurchaseModal({ customerId, purchase, onClose }: SharePurchaseModalProps) {
  const { createSharePurchase, updateSharePurchase, loading } = useSharePurchaseMutations();
  const { perSharePrice } = useOrganizationSettings();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    quantity: '',
    purchaseDate: '',
    pricePerShare: '',
    certificateNumber: '',
    shareholderId: '',
    paymentMethod: '',
    transactionReference: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Set default price per share from settings
    if (!purchase) {
      setFormData((prev) => ({
        ...prev,
        pricePerShare: perSharePrice.toString(),
      }));
    }
  }, [perSharePrice, purchase]);

  useEffect(() => {
    if (purchase) {
      setFormData({
        quantity: purchase.quantity.toString(),
        purchaseDate: purchase.purchaseDate,
        pricePerShare: purchase.pricePerShare.toString(),
        certificateNumber: purchase.certificateNumber || '',
        shareholderId: purchase.shareholderId || '',
        paymentMethod: purchase.paymentMethod,
        transactionReference: purchase.transactionReference || '',
        notes: purchase.notes || '',
      });
    }
  }, [purchase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }

    if (!formData.pricePerShare.trim()) {
      newErrors.pricePerShare = 'Price per share is required';
    } else if (parseFloat(formData.pricePerShare) <= 0) {
      newErrors.pricePerShare = 'Price per share must be greater than 0';
    }

    if (!formData.certificateNumber.trim()) {
      newErrors.certificateNumber = 'Certificate number is required';
    }

    if (!formData.shareholderId.trim()) {
      newErrors.shareholderId = 'Shareholder ID is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    if (!formData.transactionReference.trim()) {
      newErrors.transactionReference = 'Transaction reference is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
        type: 'error',
        message: 'Please fix the errors in the form',
      });
      return;
    }

    try {
      const shareData = {
        customerId,
        quantity: parseFloat(formData.quantity),
        purchaseDate: formData.purchaseDate,
        pricePerShare: parseFloat(formData.pricePerShare),
        certificateNumber: formData.certificateNumber,
        shareholderId: formData.shareholderId,
        paymentMethod: formData.paymentMethod as 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online',
        transactionReference: formData.transactionReference,
        notes: formData.notes,
      };

      if (purchase) {
        await updateSharePurchase(purchase.id || '', shareData as UpdateSharePurchaseDto);
        addToast({
          type: 'success',
          message: 'Share purchase updated successfully',
        });
      } else {
        await createSharePurchase(shareData as CreateSharePurchaseDto);
        addToast({
          type: 'success',
          message: 'Share purchase created successfully',
        });
      }

      onClose(true);
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save share purchase',
      });
    }
  };

  const totalAmount = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.pricePerShare) || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border-light p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">
            {purchase ? 'Edit Share Purchase' : 'Add Share Purchase'}
          </h2>
          <button
            onClick={() => onClose()}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Share Details */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Share Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity}
                required
                min="1"
                step="1"
              />

              <Input
                label="Purchase Date"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                error={errors.purchaseDate}
                required
              />

              <Input
                label="Price per Share (₹)"
                name="pricePerShare"
                type="number"
                value={formData.pricePerShare}
                onChange={handleChange}
                error={errors.pricePerShare}
                required
                min="1"
                step="0.01"
                helperText={`Default: ₹${perSharePrice}`}
              />

              <Input
                label="Certificate Number"
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={handleChange}
                error={errors.certificateNumber}
                required
                placeholder="CERT-2024-XXX"
              />

              <Input
                label="Shareholder ID"
                name="shareholderId"
                value={formData.shareholderId}
                onChange={handleChange}
                error={errors.shareholderId}
                required
                placeholder="SH001"
              />

              <Select
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                error={errors.paymentMethod}
                required
                options={[
                  { value: '', label: 'Select payment method' },
                  { value: 'Cash', label: 'Cash' },
                  { value: 'Bank Transfer', label: 'Bank Transfer' },
                  { value: 'Cheque', label: 'Cheque' },
                  { value: 'Online', label: 'Online' },
                ]}
              />
            </div>
          </div>

          {/* Transaction Details */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Transaction Details</h3>
            <div className="space-y-4">
              <Input
                label="Transaction Reference"
                name="transactionReference"
                value={formData.transactionReference}
                onChange={handleChange}
                error={errors.transactionReference}
                required
                placeholder="TXN-2024-XXX"
              />

              <Textarea
                label="Notes (Optional)"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes or comments"
              />
            </div>
          </div>

          {/* Total Amount Display */}
          <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Total Amount</span>
              <span className="text-2xl font-bold text-primary-600">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              {formData.quantity || 0} shares × ₹{formData.pricePerShare || 0}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
            <Button variant="secondary" onClick={() => onClose()} type="button">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {purchase ? 'Update' : 'Create'} Share Purchase
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

