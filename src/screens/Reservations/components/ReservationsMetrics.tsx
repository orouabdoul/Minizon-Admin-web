import { Calendar, CheckCircle, XCircle, TrendingUp, Star } from 'lucide-react';
import { PassengerKpiCard } from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import type { LucideIcon } from 'lucide-react';
import type { ReservationMetrics } from '../../../models/reservation.model';

interface Props {
  metrics:  ReservationMetrics | null;
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

export function ReservationsMetrics({ metrics, loading }: Props) {
  const v = (n?: number) => loading ? '…' : (n ?? 0).toLocaleString('fr-FR');

  const kpis: KpiDef[] = [
    {
      id: 'total', label: 'Total Réservations',
      value: v(metrics?.total), badge: '',
      icon: Calendar, iconBg: '#EFF6FF', iconColor: '#3B82F6',
    },
    {
      id: 'confirmed', label: 'Confirmées',
      value: v(metrics?.confirmed), badge: '',
      icon: CheckCircle, iconBg: '#F0FDF4', iconColor: '#7C3AED',
    },
    {
      id: 'cancelled', label: 'Annulées',
      value: v(metrics?.cancelled), badge: '',
      icon: XCircle, iconBg: '#FEF2F2', iconColor: '#E53935',
      badgeBg: '#FEF2F2', badgeColor: '#E53935',
    },
    {
      id: 'revenue', label: "Chiffre d'affaires",
      value: loading ? '…' : String(metrics?.total_revenue ?? '0 FCFA'), badge: '',
      icon: TrendingUp, iconBg: '#F0FDF4', iconColor: '#7C3AED',
    },
    {
      id: 'rating', label: 'Note Moyenne',
      value: loading ? '…' : `${(metrics?.average_rating ?? 0).toFixed(1)} ★`, badge: '',
      icon: Star, iconBg: '#FFFBEB', iconColor: '#F59E0B',
    },
  ];

  return (
    <div className="reservations-metrics">
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
