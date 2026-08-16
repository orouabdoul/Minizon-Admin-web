import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth_service';

export interface BannerStat {
  id:          string;
  value:       string;
  label:       string;
  badge:       string;
  badgeColor?: string;
}

// Valeurs statiques affichées immédiatement et tant que l'API n'a pas répondu
const FALLBACK: BannerStat[] = [
  { id: 'users',  value: '500+',   label: 'Utilisateurs actifs',     badge: 'LIVE'                     },
  { id: 'trips',  value: '1 000+', label: 'Trajets réalisés',         badge: 'ALL TIME'                 },
  { id: 'secure', value: '98%',    label: 'Satisfaction client',      badge: 'SECURE'                   },
  { id: 'uptime', value: '100%',   label: 'Disponibilité plateforme', badge: 'UP', badgeColor: '#4ADE80' },
];

// value peut être un nombre (ex: 3) ou une chaîne déjà formatée (ex: "99.0%")
function fmtValue(v: number | string): string {
  if (typeof v === 'string') return v;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return v.toLocaleString('en-US');
  return String(v);
}

export function useBannerStats(): { stats: BannerStat[]; loading: boolean } {
  const [stats,   setStats]   = useState<BannerStat[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res  = await authService.getPlatformStats();
      const body = res.data?.body;
      if (!body) return;

      setStats([
        {
          id:    'users',
          value: fmtValue(body.active_users?.value          ?? FALLBACK[0].value),
          label: body.active_users?.label                   ?? FALLBACK[0].label,
          badge: body.active_users?.badge                   ?? FALLBACK[0].badge,
        },
        {
          id:    'trips',
          value: fmtValue(body.daily_trips?.value           ?? FALLBACK[1].value),
          label: body.daily_trips?.label                    ?? FALLBACK[1].label,
          badge: body.daily_trips?.badge                    ?? FALLBACK[1].badge,
        },
        {
          id:    'secure',
          value: fmtValue(body.secure_transactions?.value   ?? FALLBACK[2].value),
          label: body.secure_transactions?.label            ?? FALLBACK[2].label,
          badge: body.secure_transactions?.badge            ?? FALLBACK[2].badge,
        },
        {
          id:         'uptime',
          value:      fmtValue(body.uptime?.value           ?? FALLBACK[3].value),
          label:      body.uptime?.label                    ?? FALLBACK[3].label,
          badge:      body.uptime?.badge                    ?? FALLBACK[3].badge,
          badgeColor: '#4ADE80',  // couleur fixe non fournie par l'API
        },
      ]);
    } catch {
      // Réseau indisponible → on garde les valeurs actuelles (fallback ou dernier succès)
    } finally {
      setLoading(false);
    }
  }, []);

  // Les données sont maintenant statiques côté API — un seul fetch au montage suffit
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading };
}
