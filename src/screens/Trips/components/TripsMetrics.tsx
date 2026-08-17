import { Navigation, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { PassengerKpiCard } from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import type { LucideIcon } from 'lucide-react';
import type { TripMetrics } from '../../../models/trip.model';

interface Props {
  metrics:  TripMetrics | null;
  loading?: boolean;
}

interface KpiDef {
  id:         string;
  label:      string;
  value:      string;
  badge:      string;
  icon:       LucideIcon;
  iconBg:     string;
  iconColor:  string;
  badgeBg?:   string;
  badgeColor?:string;
}

export function TripsMetrics({ metrics, loading }: Props) {
  const v = (n?: number) => loading ? '…' : (n ?? 0).toLocaleString('fr-FR');

  const kpis: KpiDef[] = [
    {
      id: 'total', label: 'Total Trajets',
      value: v(metrics?.total), badge: '',
      icon: Navigation, iconBg: '#EFF6FF', iconColor: '#3B82F6',
    },
    {
      id: 'completed', label: 'Trajets Terminés',
      value: v(metrics?.completed), badge: '',
      icon: CheckCircle, iconBg: '#F0FDF4', iconColor: '#1A5FB4',
    },
    {
      id: 'reported', label: 'Trajets Signalés',
      value: v(metrics?.reported), badge: '',
      icon: AlertTriangle, iconBg: '#FFFBEB', iconColor: '#F59E0B',
      badgeBg: '#FFFBEB', badgeColor: '#F59E0B',
    },
    {
      id: 'revenue', label: 'Revenus Générés',
      value: loading ? '…' : `${(metrics?.total_revenue ?? 0).toLocaleString('fr-FR')} FCFA`,
      badge: '',
      icon: TrendingUp, iconBg: '#F0FDF4', iconColor: '#1A5FB4',
    },
  ];

  return (
    <div className="trips-metrics">
      {kpis.map((kpi) => (
        <PassengerKpiCard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          badge={kpi.badge}
          icon={kpi.icon}
          iconBg={kpi.iconBg}
          iconColor={kpi.iconColor}
          badgeBg={kpi.badgeBg}
          badgeColor={kpi.badgeColor}
        />
      ))}
    </div>
  );
}
