import {
  Users, Car, Navigation, TrendingUp, CreditCard,
  AlertCircle, Star, UserCheck,
} from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import { KpiCard } from '../../../components/DataDisplay/KpiCard/KpiCard';
import type { DashboardData } from '../../../models/dashboard.model';

interface Props {
  data: DashboardData | null;
}

function formatFcfa(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  if (amount >= 1_000)     return `${(amount / 1_000).toFixed(0)}K FCFA`;
  return `${amount} FCFA`;
}

export function DashboardKpis({ data }: Props) {
  const kpis = [
    {
      id: 'total-users', iconId: 'users',
      label: 'Utilisateurs Totaux',
      value: data ? String(data.users.total) : '—',
      badge: data ? `+${data.users.new_this_month} ce mois` : '...',
      badgeVariant: 'success' as const,
      iconBg: '#DBEAFE', iconColor: '#2563EB',
      icon: <AppIcon icon={Users} size={24} color="#2563EB" />,
    },
    {
      id: 'drivers', iconId: 'car',
      label: 'Conducteurs Actifs',
      value: data ? String(data.users.drivers) : '—',
      badge: data ? `${data.users.drivers} actifs` : '...',
      badgeVariant: 'success' as const,
      iconBg: '#DCFCE7', iconColor: '#00A86B',
      icon: <AppIcon icon={Car} size={24} color="#00A86B" />,
    },
    {
      id: 'trips-active', iconId: 'route',
      label: 'Trajets Actifs',
      value: data ? String(data.trips.active) : '—',
      badge: data ? `${data.trips.this_month} ce mois` : '...',
      badgeVariant: 'success' as const,
      iconBg: '#F3E8FF', iconColor: '#9333EA',
      icon: <AppIcon icon={Navigation} size={24} color="#9333EA" />,
    },
    {
      id: 'revenue', iconId: 'trending',
      label: 'Revenus Plateforme',
      value: data ? formatFcfa(data.payments.platform_revenue_fcfa) : '—',
      badge: data ? `Vol: ${formatFcfa(data.payments.total_volume_fcfa)}` : '...',
      badgeVariant: 'success' as const,
      iconBg: '#FEF9C3', iconColor: '#F4B400',
      icon: <AppIcon icon={TrendingUp} size={24} color="#F4B400" />,
    },
    {
      id: 'passengers', iconId: 'usercheck',
      label: 'Passagers Actifs',
      value: data ? String(data.users.passengers) : '—',
      badge: data ? `KYC: ${data.users.pending_kyc}` : '...',
      badgeVariant: 'success' as const,
      iconBg: '#E0E7FF', iconColor: '#4F46E5',
      icon: <AppIcon icon={UserCheck} size={24} color="#4F46E5" />,
    },
    {
      id: 'bookings', iconId: 'credit',
      label: 'Réservations',
      value: data ? String(data.bookings.total) : '—',
      badge: data ? `${data.bookings.pending} en attente` : '...',
      badgeVariant: 'success' as const,
      iconBg: '#CCFBF1', iconColor: '#0D9488',
      icon: <AppIcon icon={CreditCard} size={24} color="#0D9488" />,
    },
    {
      id: 'disputes', iconId: 'alert',
      label: 'Litiges',
      value: data ? String(data.disputes.total) : '—',
      badge: data ? `${data.disputes.pending} ouverts` : '...',
      badgeVariant: (data && data.disputes.pending > 0 ? 'error' : 'success') as 'error' | 'success',
      iconBg: '#FEE2E2', iconColor: '#E53935',
      icon: <AppIcon icon={AlertCircle} size={24} color="#E53935" />,
    },
    {
      id: 'trips-completed', iconId: 'star',
      label: 'Trajets Terminés',
      value: data ? String(data.trips.completed) : '—',
      badge: data ? `${data.trips.cancelled} annulés` : '...',
      badgeVariant: 'success' as const,
      iconBg: '#DCFCE7', iconColor: '#00A86B',
      icon: <AppIcon icon={Star} size={24} color="#00A86B" />,
    },
  ];

  return (
    <div className="dash-kpi-grid">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} {...kpi} />
      ))}
    </div>
  );
}
