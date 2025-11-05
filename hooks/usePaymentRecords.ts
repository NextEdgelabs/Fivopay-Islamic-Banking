import { useState, useEffect, useCallback } from 'react';
import {
  paymentRecordService,
  PaymentRecord,
} from '@/services/paymentRecords.service';

interface UsePaymentRecordsResult {
  paymentRecords: PaymentRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UsePaymentRecordsOptions {
  agentId?: string;
  status?: string;
}

export function usePaymentRecords(options?: UsePaymentRecordsOptions): UsePaymentRecordsResult {
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (options?.agentId) {
        response = await paymentRecordService.getByAgent(options.agentId);
      } else {
        response = await paymentRecordService.getAll();
      }

      if (response.success && (response.data || response.result)) {
        let records = response.data || response.result || [];
        
        // Filter by status if provided
        if (options?.status) {
          records = records.filter((record: PaymentRecord) => record.status === options.status);
        }
        
        setPaymentRecords(records);
      } else {
        setError('Invalid response structure from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payment records');
    } finally {
      setLoading(false);
    }
  }, [options?.agentId, options?.status]);

  useEffect(() => {
    fetchPaymentRecords();
  }, [fetchPaymentRecords]);

  return {
    paymentRecords,
    loading,
    error,
    refetch: fetchPaymentRecords,
  };
}

