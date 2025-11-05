import { useState, useEffect, useCallback } from 'react';
import { shareTransactionService, SharePurchase } from '@/services/shareTransactions.service';

export const useSharePurchases = (customerId: string) => {
  const [sharePurchases, setSharePurchases] = useState<SharePurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSharePurchases = useCallback(async () => {
    if (!customerId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await shareTransactionService.getCustomerSharePurchases(customerId);
      setSharePurchases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch share purchases');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchSharePurchases();
  }, [fetchSharePurchases]);

  return { sharePurchases, loading, error, refetch: fetchSharePurchases };
};

