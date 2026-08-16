import { AlertTriangle, Circle, Flame, Clock, Search, CheckCircle } from 'lucide-react';
import { PassengerKpiCard } from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import type { LucideIcon }   from 'lucide-react';
import type { DisputeMetrics } from '../../../models/dispute.model';

interface Props { metrics: DisputeMetrics | null; loading?: boolean; }
interface KpiDef { id: string; label: string; value: string; icon: LucideIcon; iconBg: string; iconColor: string; }

export function DisputesMetrics({ metrics, loading }: Props) {
  const n = (v?: number) => loading ? '…' : (v ?? 0).toLocaleString('fr-FR');

  const kpis: KpiDef[] = [
    { id: 'all',           label: 'Total Litiges', value: n(metrics?.all),           icon: AlertTriangle, iconBg: '#EFF6FF', iconColor: '#3B82F6' },
    { id: 'open',          label: 'Ouverts',       value: n(metrics?.open),          icon: Circle,        iconBg: '#FEF2F2', iconColor: '#E53935' },
    { id: 'critical',      label: 'Critiques',     value: n(metrics?.critical),      icon: Flame,         iconBg: '#FFF1F2', iconColor: '#BE123C' },
    { id: 'pending',       label: 'En attente',    value: n(metrics?.pending),       icon: Clock,         iconBg: '#FFF7ED', iconColor: '#F97316' },
    { id: 'investigating', label: 'En cours',      value: n(metrics?.investigating), icon: Search,        iconBg: '#FFFBEB', iconColor: '#F59E0B' },
    { id: 'resolved',      label: 'Résolus',       value: n(metrics?.resolved),      icon: CheckCircle,   iconBg: '#F0FDF4', iconColor: '#7C3AED' },
  ];

  return (
    <div className="disputes-metrics">
      {kpis.map((kpi) => (
        <PassengerKpiCard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          badge=""
          icon={kpi.icon}
          iconBg={kpi.iconBg}
          iconColor={kpi.iconColor}
          badgeBg=""
          badgeColor=""
        />
      ))}
    </div>
  );
}
