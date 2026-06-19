import { Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppIcon }           from '../../../components/Common/AppIcon';
import { UserStatCard }      from '../../../components/DataDisplay/UserStatCard/UserStatCard';
import { useDriverMetrics }  from '../../../hooks/useDriverMetrics';

const CARDS: {
  key:       'total' | 'pending' | 'verified' | 'suspended_rejected';
  label:     string;
  Icon:      LucideIcon;
  iconBg:    string;
  iconColor: string;
  iconId:    string;
  trend:     (m: { total: number; pending: number; verified: number; suspended_rejected: number; validation_rate: number } | null) => string;
  trendColor: string;
}[] = [
  {
    key: 'total', label: 'Total conducteurs',
    Icon: Users, iconId: 'users',
    iconBg: 'rgba(0,168,107,0.10)', iconColor: '#00A86B',
    trend: (m) => m ? `Taux de validation : ${m.validation_rate}%` : '…',
    trendColor: '#00A86B',
  },
  {
    key: 'pending', label: 'En attente',
    Icon: Clock, iconId: 'clock',
    iconBg: 'rgba(245,158,11,0.10)', iconColor: '#F59E0B',
    trend: () => 'Demandes à traiter',
    trendColor: '#F59E0B',
  },
  {
    key: 'verified', label: 'Vérifiés',
    Icon: CheckCircle, iconId: 'check',
    iconBg: 'rgba(37,99,235,0.10)', iconColor: '#2563EB',
    trend: () => 'Conducteurs actifs',
    trendColor: '#2563EB',
  },
  {
    key: 'suspended_rejected', label: 'Suspendus / Rejetés',
    Icon: AlertTriangle, iconId: 'alert',
    iconBg: '#FEE2E2', iconColor: '#E53935',
    trend: () => 'Comptes restreints',
    trendColor: '#E53935',
  },
];

export function DriversMetrics() {
  const metrics = useDriverMetrics();

  return (
    <div className="users-metrics-grid">
      {CARDS.map((c) => (
        <UserStatCard
          key={c.key}
          id={c.key}
          label={c.label}
          value={metrics ? String(metrics[c.key]) : '—'}
          trend={c.trend(metrics)}
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
