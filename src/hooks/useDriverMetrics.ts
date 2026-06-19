import { useState, useEffect, useCallback } from 'react';
import { driverService } from '../services/driver_service';
import type { DriverMetrics } from '../models/driver.model';

export function useDriverMetrics() {
  const [metrics, setMetrics] = useState<DriverMetrics | null>(null);

  const fetch = useCallback(async () => {
    try {
      const { data } = await driverService.getMetrics();
      setMetrics(data.body);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return metrics;
}
