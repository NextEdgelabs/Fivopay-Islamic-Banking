import { useState } from 'react';
import { settingsService, OrganizationType } from '@/services/settings';

export const useOrganizationMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrganizationType = async (type: OrganizationType): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await settingsService.updateOrganizationType(type);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePerSharePrice = async (price: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await settingsService.updatePerSharePrice(price);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update per share price');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateOrganizationType, updatePerSharePrice, loading, error };
};

