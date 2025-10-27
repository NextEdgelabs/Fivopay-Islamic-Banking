import { useState, useEffect, useCallback } from 'react';
import { customerService, ShareholderSummary } from '@/services/customers.service';

export const useShareholders = () => {
  const [shareholders, setShareholders] = useState<ShareholderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShareholders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getAllShareholders();
      setShareholders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shareholders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShareholders();
  }, [fetchShareholders]);

  return { shareholders, loading, error, refetch: fetchShareholders };
};

