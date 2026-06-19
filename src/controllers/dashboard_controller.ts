import { useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboard_service';
import type { DashboardData } from '../models/dashboard.model';

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardController() {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await dashboardService.getData();
      setState({ data: data.body, loading: false, error: null });
    } catch {
      setState((s) => ({ ...s, loading: false, error: 'Erreur de chargement du tableau de bord' }));
    }
  }, []);

  return { ...state, fetchData };
}
