import { CreditCard, Shield, CheckCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { PassengerKpiCard } from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import type { LucideIcon }  from 'lucide-react';
import type { PaymentMetrics } from '../../../models/payment.model';

interface Props {
  metrics:  PaymentMetrics | null;
  loading?: boolean;
}

interface KpiDef {
  id:        string;
  label:     string;
  value:     string;
  badge:     string;
  icon:      LucideIcon;
  iconBg:    string;
  iconColor: string;
  badgeBg:   string;
  badgeColor:string;
}

export function PaymentsMetrics({ metrics, loading }: Props) {
  const n = (v?: number) => loading ? '…' : (v ?? 0).toLocaleString('fr-FR');
  const s = (v?: string) => loading ? '…' : (v ?? '—');

  const kpis: KpiDef[] = [
    {
      id: 'total', label: 'Total Paiements',
      value: n(metrics?.total), badge: '',
      icon: CreditCard, iconBg: '#EFF6FF', iconColor: '#3B82F6',
      badgeBg: '#EFF6FF', badgeColor: '#3B82F6',
    },
    {
      id: 'secured', label: 'Sécurisés (Escrow)',
      value: n(metrics?.secured), badge: '',
      icon: Shield, iconBg: '#FFF7ED', iconColor: '#F97316',
      badgeBg: '#FFF7ED', badgeColor: '#F97316',
    },
    {
      id: 'released', label: 'Libérés',
      value: n(metrics?.released), badge: '',
      icon: CheckCircle, iconBg: '#F0FDF4', iconColor: '#00A86B',
      badgeBg: '#F0FDF4', badgeColor: '#00A86B',
    },
    {
      id: 'failed', label: 'Échoués',
      value: n(metrics?.failed), badge: '',
      icon: AlertTriangle, iconBg: '#FEF2F2', iconColor: '#E53935',
      badgeBg: '#FEF2F2', badgeColor: '#E53935',
    },
    {
      id: 'volume', label: 'Volume brut',
      value: s(metrics?.volume), badge: '',
      icon: TrendingUp, iconBg: '#F0FDF4', iconColor: '#00A86B',
      badgeBg: '#F0FDF4', badgeColor: '#00A86B',
    },
    {
      id: 'commission', label: 'Commissions',
      value: s(metrics?.commission), badge: '',
      icon: DollarSign, iconBg: '#FFFBEB', iconColor: '#F59E0B',
      badgeBg: '#FFFBEB', badgeColor: '#F59E0B',
    },
  ];

  return (
    <div className="payments-metrics">
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
