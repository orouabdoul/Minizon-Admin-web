import { useState, useEffect, useCallback } from 'react';
import { passengerService } from '../services/passenger_service';
import type { PassengerMetrics } from '../models/passenger.model';

export function usePassengerMetrics() {
  const [metrics, setMetrics] = useState<PassengerMetrics | null>(null);

  const fetch = useCallback(async () => {
    try {
      const { data } = await passengerService.getMetrics();
      setMetrics(data.body);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return metrics;
}
