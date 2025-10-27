import { useState, useEffect, useCallback } from 'react';
import { settingsService, OrganizationType } from '@/services/settings';

export const useOrganizationSettings = () => {
  const [organizationType, setOrganizationType] = useState<OrganizationType>('Ethical Banking');
  const [perSharePrice, setPerSharePrice] = useState<number>(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [type, price] = await Promise.all([
        settingsService.getOrganizationType(),
        settingsService.getPerSharePrice(),
      ]);
      setOrganizationType(type);
      setPerSharePrice(price);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const isEthicalBanking = organizationType === 'Ethical Banking';
  const isConventionalBanking = organizationType === 'Conventional Banking';

  return {
    organizationType,
    perSharePrice,
    isEthicalBanking,
    isConventionalBanking,
    loading,
    error,
    refetch: fetchSettings,
  };
};

