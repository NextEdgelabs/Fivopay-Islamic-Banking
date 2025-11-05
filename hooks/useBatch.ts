import { useState, useEffect } from 'react';
import { getBatchById, Batch } from '@/services/batch.service';

export const useBatch = (batchId: string) => {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatch = async () => {
    if (!batchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response:any = await getBatchById(batchId);
      if (response.success) {
        setBatch(response.data);
      } else {
        setError(response.message || 'Failed to fetch batch');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch batch');
      setBatch(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
  }, [batchId]);

  return {
    batch,
    loading,
    error,
    refetch: fetchBatch,
  };
};

