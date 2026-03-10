import { useState, useEffect, useRef } from 'react';
import { getAllBatches, BatchFilters, Batch } from '@/services/batch.service';

export const useBatches = (filters?: BatchFilters) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchBatches = async () => {
    if (!hasFetchedRef.current) setLoading(true);
    setError(null);
    try {
      const response = await getAllBatches(filters);
      if (response.success) {
        setBatches(response.data?.batches || []);
        hasFetchedRef.current = true;
      } else {
        setError(response.message || 'Failed to fetch batches');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch batches');
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [filters?.search, filters?.status]);

  return {
    batches,
    loading,
    error,
    refetch: fetchBatches,
  };
};

