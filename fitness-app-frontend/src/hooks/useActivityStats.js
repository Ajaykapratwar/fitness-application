import { useCallback, useEffect, useState } from 'react';
import { getActivityStats } from '../services/api';

export function useActivityStats(days = 30) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getActivityStats(days);
      setStats(data);
    } catch (e) {
      setError(e);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}
