import { Users, Navigation, TrendingUp, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PassengerKpiCard } from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import { useUserMetrics }   from '../../../hooks/useUserMetrics';
import type { UserMetrics } from '../../../models/user.model';

const CARDS: {
  key:        keyof UserMetrics;
  label:      string;
  Icon:       LucideIcon;
  iconBg:     string;
  iconColor:  string;
  badge:      (m: UserMetrics) => string;
  badgeBg?:   string;
  badgeColor?:string;
}[] = [
  {
    key: 'total_users', label: 'Total Utilisateurs',
    Icon: Users, iconBg: 'rgba(124,58,237,0.10)', iconColor: '#7C3AED',
    badge: () => 'Tous',
    badgeBg: 'rgba(124,58,237,0.10)', badgeColor: '#7C3AED',
  },
  {
    key: 'total_trips', label: 'Total Trajets',
    Icon: Navigation, iconBg: 'rgba(37,99,235,0.10)', iconColor: '#2563EB',
    badge: () => 'Effectués',
    badgeBg: 'rgba(37,99,235,0.10)', badgeColor: '#2563EB',
  },
  {
    key: 'verification_rate', label: 'Taux de Vérification',
    Icon: TrendingUp, iconBg: '#DCFCE7', iconColor: '#16A34A',
    badge: (m) => `${m.verification_rate}%`,
    badgeBg: '#DCFCE7', badgeColor: '#16A34A',
  },
  {
    key: 'blocked_or_rejected', label: 'Bloqués / Rejetés',
    Icon: AlertTriangle, iconBg: '#FEE2E2', iconColor: '#E53935',
    badge: () => 'Restreints',
    badgeBg: '#FEE2E2', badgeColor: '#E53935',
  },
];

export function UsersMetrics() {
  const metrics = useUserMetrics();

  return (
    <div className="users-metrics-grid">
      {CARDS.map((c) => (
        <PassengerKpiCard
          key={c.key}
          label={c.label}
          value={metrics ? String(metrics[c.key]) : '—'}
          badge={metrics ? c.badge(metrics) : '…'}
          iconBg={c.iconBg}
          iconColor={c.iconColor}
          icon={c.Icon}
          badgeBg={c.badgeBg}
          badgeColor={c.badgeColor}
        />
      ))}
    </div>
  );
}
