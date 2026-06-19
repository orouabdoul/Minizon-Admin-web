import { Users, Navigation, TrendingUp, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppIcon }        from '../../../components/Common/AppIcon';
import { UserStatCard }   from '../../../components/DataDisplay/UserStatCard/UserStatCard';
import { useUserMetrics } from '../../../hooks/useUserMetrics';
import type { UserMetrics } from '../../../models/user.model';

const CARDS: {
  key:        keyof UserMetrics;
  id:         string;
  label:      string;
  Icon:       LucideIcon;
  iconBg:     string;
  iconColor:  string;
  iconId:     string;
  trend:      (m: UserMetrics) => string;
  trendColor: string;
}[] = [
  {
    key: 'total_users', id: 'total-users', label: 'Total Utilisateurs',
    Icon: Users, iconId: 'users',
    iconBg: 'rgba(0,168,107,0.10)', iconColor: '#00A86B',
    trend: () => 'Conducteurs & passagers',
    trendColor: '#00A86B',
  },
  {
    key: 'total_trips', id: 'total-trips', label: 'Total Trajets',
    Icon: Navigation, iconId: 'route',
    iconBg: 'rgba(37,99,235,0.10)', iconColor: '#2563EB',
    trend: () => 'Trajets effectués',
    trendColor: '#2563EB',
  },
  {
    key: 'verification_rate', id: 'verif-rate', label: 'Taux de Vérification',
    Icon: TrendingUp, iconId: 'trending',
    iconBg: '#DCFCE7', iconColor: '#16A34A',
    trend: (m) => `${m.verification_rate}% des comptes vérifiés`,
    trendColor: '#16A34A',
  },
  {
    key: 'blocked_or_rejected', id: 'blocked', label: 'Bloqués / Rejetés',
    Icon: AlertTriangle, iconId: 'alert',
    iconBg: '#FEE2E2', iconColor: '#E53935',
    trend: () => 'Comptes restreints',
    trendColor: '#E53935',
  },
];

export function UsersMetrics() {
  const metrics = useUserMetrics();

  return (
    <div className="users-metrics-grid">
      {CARDS.map((c) => (
        <UserStatCard
          key={c.key}
          id={c.id}
          label={c.label}
          value={metrics ? String(metrics[c.key]) : '—'}
          trend={metrics ? c.trend(metrics) : '…'}
          trendColor={c.trendColor}
          iconBg={c.iconBg}
          iconColor={c.iconColor}
          iconId={c.iconId}
          icon={<AppIcon icon={c.Icon} size={24} color={c.iconColor} />}
        />
      ))}
    </div>
  );
}
