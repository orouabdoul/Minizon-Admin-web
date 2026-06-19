import { useState, useEffect, useCallback } from 'react';
import { platformUserService } from '../services/platform_user_service';
import type { UserMetrics }    from '../models/user.model';

export function useUserMetrics() {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);

  const fetch = useCallback(async () => {
    try {
      const { data } = await platformUserService.getMetrics();
      setMetrics(data.body);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return metrics;
}
