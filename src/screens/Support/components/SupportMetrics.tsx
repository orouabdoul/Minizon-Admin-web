import { Inbox, FolderOpen, Sparkles, Clock, CheckCircle, Archive } from 'lucide-react';
import { PassengerKpiCard } from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import type { LucideIcon }   from 'lucide-react';
import type { SupportMetrics } from '../../../models/support.model';

interface Props { metrics: SupportMetrics | null; loading?: boolean; }
interface KpiDef { id: string; label: string; value: string; icon: LucideIcon; iconBg: string; iconColor: string; }

export function SupportMetrics({ metrics, loading }: Props) {
  const n = (v?: number) => loading ? '…' : (v ?? 0).toLocaleString('fr-FR');

  const kpis: KpiDef[] = [
    { id: 'total',       label: 'Total Tickets', value: n(metrics?.total),       icon: Inbox,       iconBg: '#EFF6FF', iconColor: '#3B82F6' },
    { id: 'open',        label: 'Ouverts',       value: n(metrics?.open),        icon: FolderOpen,  iconBg: '#FFF7ED', iconColor: '#F97316' },
    { id: 'new',         label: 'Nouveaux',      value: n(metrics?.new),         icon: Sparkles,    iconBg: '#FEF9C3', iconColor: '#CA8A04' },
    { id: 'in_progress', label: 'En cours',      value: n(metrics?.in_progress), icon: Clock,       iconBg: '#D6E8F7', iconColor: '#1A5FB4' },
    { id: 'resolved',    label: 'Résolus',       value: n(metrics?.resolved),    icon: CheckCircle, iconBg: '#DCFCE7', iconColor: '#16A34A' },
    { id: 'closed',      label: 'Clôturés',      value: n(metrics?.closed),      icon: Archive,     iconBg: '#F3F4F6', iconColor: '#6B7280' },
  ];

  return (
    <div className="support-metrics">
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
