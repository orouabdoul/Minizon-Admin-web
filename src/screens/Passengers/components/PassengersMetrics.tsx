import {
  Users, UserCheck, UserPlus, Calendar, TrendingDown, AlertCircle, Star, UserX,
} from 'lucide-react';
import type { LucideIcon }       from 'lucide-react';
import { PassengerKpiCard }      from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import { usePassengerMetrics }   from '../../../hooks/usePassengerMetrics';
import type { PassengerMetrics } from '../../../models/passenger.model';

const CARDS: {
  key:        keyof PassengerMetrics;
  label:      string;
  Icon:       LucideIcon;
  iconBg:     string;
  iconColor:  string;
  badge:      (m: PassengerMetrics) => string;
  badgeBg?:   string;
  badgeColor?:string;
}[] = [
  {
    key: 'total', label: 'Total Passagers',
    Icon: Users, iconBg: 'rgba(26,95,180,0.10)', iconColor: '#1A5FB4',
    badge: (m) => String(m.total),
  },
  {
    key: 'active', label: 'Actifs',
    Icon: UserCheck, iconBg: 'rgba(26,95,180,0.10)', iconColor: '#1A5FB4',
    badge: () => 'Actifs',
  },
  {
    key: 'new_this_month', label: 'Nouvelles Inscriptions',
    Icon: UserPlus, iconBg: 'rgba(168,85,247,0.10)', iconColor: '#A855F7',
    badge: (m) => `+${m.new_this_month}`,
  },
  {
    key: 'bookings_month', label: 'Réservations ce mois',
    Icon: Calendar, iconBg: 'rgba(249,115,22,0.10)', iconColor: '#F97316',
    badge: (m) => String(m.bookings_month),
  },
  {
    key: 'cancellation_rate', label: 'Taux Annulation',
    Icon: TrendingDown, iconBg: 'rgba(229,57,53,0.10)', iconColor: '#E53935',
    badge: (m) => `${m.cancellation_rate}%`,
    badgeBg: 'rgba(229,57,53,0.10)', badgeColor: '#E53935',
  },
  {
    key: 'incidents', label: 'Incidents',
    Icon: AlertCircle, iconBg: 'rgba(244,180,0,0.10)', iconColor: '#F4B400',
    badge: (m) => String(m.incidents),
  },
  {
    key: 'avg_rating', label: 'Note Moyenne',
    Icon: Star, iconBg: 'rgba(34,197,94,0.10)', iconColor: '#22C55E',
    badge: (m) => m.avg_rating != null ? String(m.avg_rating) : '—',
  },
  {
    key: 'suspended', label: 'Suspendus',
    Icon: UserX, iconBg: 'rgba(107,114,128,0.10)', iconColor: '#6B7280',
    badge: (m) => String(m.suspended),
  },
];

export function PassengersMetrics() {
  const metrics = usePassengerMetrics();

  return (
    <div className="passengers-metrics">
      {CARDS.map((c) => (
        <PassengerKpiCard
          key={c.key}
          label={c.label}
          value={metrics ? String(metrics[c.key] ?? '—') : '—'}
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
