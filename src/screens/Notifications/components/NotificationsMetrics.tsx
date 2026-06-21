import { Bell, Mail, AlertTriangle, Cpu } from 'lucide-react';
import { PassengerKpiCard }  from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import type { LucideIcon }   from 'lucide-react';
import type { NotifMetrics } from '../../../models/notification.model';

interface Props { metrics: NotifMetrics | null; loading?: boolean; }
interface KpiDef { id: string; label: string; value: string; icon: LucideIcon; iconBg: string; iconColor: string; }

export function NotificationsMetrics({ metrics, loading }: Props) {
  const n = (v?: number) => loading ? '…' : (v ?? 0).toLocaleString('fr-FR');

  const kpis: KpiDef[] = [
    { id: 'all',    label: 'Total',     value: n(metrics?.all),    icon: Bell,          iconBg: '#DBEAFE', iconColor: '#2563EB' },
    { id: 'unread', label: 'Non lues',  value: n(metrics?.unread), icon: Mail,          iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { id: 'urgent', label: 'Urgentes',  value: n(metrics?.urgent), icon: AlertTriangle, iconBg: '#FEF9C3', iconColor: '#CA8A04' },
    { id: 'system', label: 'Système',   value: n(metrics?.system), icon: Cpu,           iconBg: '#F3E8FF', iconColor: '#9333EA' },
  ];

  return (
    <div className="notif-summary">
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
