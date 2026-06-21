import { Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PassengerKpiCard } from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import { useDriverMetrics }  from '../../../hooks/useDriverMetrics';

type DriverMetricsShape = {
  total: number; pending: number; verified: number;
  suspended_rejected: number; validation_rate: number;
};

const CARDS: {
  key:        keyof Omit<DriverMetricsShape, 'validation_rate'>;
  label:      string;
  Icon:       LucideIcon;
  iconBg:     string;
  iconColor:  string;
  badge:      (m: DriverMetricsShape) => string;
  badgeBg?:   string;
  badgeColor?:string;
}[] = [
  {
    key: 'total', label: 'Total conducteurs',
    Icon: Users, iconBg: 'rgba(0,168,107,0.10)', iconColor: '#00A86B',
    badge: (m) => `${m.validation_rate}%`,
    badgeBg: 'rgba(0,168,107,0.10)', badgeColor: '#00A86B',
  },
  {
    key: 'pending', label: 'En attente',
    Icon: Clock, iconBg: 'rgba(245,158,11,0.10)', iconColor: '#F59E0B',
    badge: () => 'À traiter',
    badgeBg: 'rgba(245,158,11,0.10)', badgeColor: '#F59E0B',
  },
  {
    key: 'verified', label: 'Vérifiés',
    Icon: CheckCircle, iconBg: 'rgba(37,99,235,0.10)', iconColor: '#2563EB',
    badge: () => 'Actifs',
    badgeBg: 'rgba(37,99,235,0.10)', badgeColor: '#2563EB',
  },
  {
    key: 'suspended_rejected', label: 'Suspendus / Rejetés',
    Icon: AlertTriangle, iconBg: '#FEE2E2', iconColor: '#E53935',
    badge: () => 'Restreints',
    badgeBg: '#FEE2E2', badgeColor: '#E53935',
  },
];

export function DriversMetrics() {
  const metrics = useDriverMetrics();

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
