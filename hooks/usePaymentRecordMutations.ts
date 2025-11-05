import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import {
  paymentRecordService,
  CreatePaymentRecordDto,
  UpdatePaymentRecordDto,
  UpdatePaymentStatusDto,
  PaymentRecord,
} from '@/services/paymentRecords.service';

export function usePaymentRecordMutations() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const createPaymentRecord = async (data: CreatePaymentRecordDto): Promise<PaymentRecord> => {
    try {
      setLoading(true);
      const response = await paymentRecordService.create(data);
      if (response.success && response.data) {
        addToast({
          type: 'success',
          message: 'Payment record created successfully',
        });
        return response.data;
      }
      throw new Error(response.message || 'Failed to create payment record');
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to create payment record',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentRecord = async (id: string, data: UpdatePaymentRecordDto): Promise<PaymentRecord> => {
    try {
      setLoading(true);
      const response = await paymentRecordService.update(id, data);
      if (response.success && response.data) {
        addToast({
          type: 'success',
          message: 'Payment record updated successfully',
        });
        return response.data;
      }
      throw new Error(response.message || 'Failed to update payment record');
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to update payment record',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPaymentRecord = async (id: string): Promise<PaymentRecord> => {
    try {
      setLoading(true);
      const response = await paymentRecordService.verify(id);
      if (response.success && response.data) {
        addToast({
          type: 'success',
          message: 'Payment record verified successfully',
        });
        return response.data;
      }
      throw new Error(response.message || 'Failed to verify payment record');
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to verify payment record',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectPaymentRecord = async (id: string, rejectionReason: string): Promise<PaymentRecord> => {
    try {
      setLoading(true);
      const response = await paymentRecordService.reject(id, rejectionReason);
      if (response.success && response.data) {
        addToast({
          type: 'success',
          message: 'Payment record rejected successfully',
        });
        return response.data;
      }
      throw new Error(response.message || 'Failed to reject payment record');
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to reject payment record',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const collectPaymentRecord = async (id: string): Promise<PaymentRecord> => {
    try {
      setLoading(true);
      const response = await paymentRecordService.collect(id);
      if (response.success && response.data) {
        addToast({
          type: 'success',
          message: 'Payment record collected successfully',
        });
        return response.data;
      }
      throw new Error(response.message || 'Failed to collect payment record');
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to collect payment record',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentRecord = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await paymentRecordService.delete(id);
      addToast({
        type: 'success',
        message: 'Payment record deleted successfully',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to delete payment record',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id: string, data: UpdatePaymentStatusDto): Promise<PaymentRecord> => {
    try {
      setLoading(true);
      const response = await paymentRecordService.updateStatus(id, data);
      if (response.success && response.data) {
        const statusMessages: Record<string, string> = {
          'Verified': 'Payment record verified successfully',
          'Rejected': 'Payment record rejected successfully',
          'Collected': 'Payment record collected successfully',
          'Pending': 'Payment record status updated successfully',
        };
        addToast({
          type: 'success',
          message: statusMessages[data.status] || 'Payment record status updated successfully',
        });
        return response.data;
      }
      throw new Error(response.message || 'Failed to update payment status');
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to update payment status',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPaymentRecord,
    updatePaymentRecord,
    updatePaymentStatus,
    verifyPaymentRecord,
    rejectPaymentRecord,
    collectPaymentRecord,
    deletePaymentRecord,
    loading,
  };
}

