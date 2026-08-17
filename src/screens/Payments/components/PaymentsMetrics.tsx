import {
  CreditCard, Shield, CheckCircle, AlertTriangle, TrendingUp, DollarSign,
} from 'lucide-react';
import { AppIcon }          from '../../../components/Common/AppIcon';
import type { LucideIcon }  from 'lucide-react';
import type { PaymentMetrics } from '../../../models/payment.model';

interface CardDef {
  icon:        LucideIcon;
  label:       string;
  sub:         string;
  iconBg:      string;
  iconColor:   string;
  valueColor?: string;
  value:       (m: PaymentMetrics | null, loading?: boolean) => string;
}

const CARDS: CardDef[] = [
  {
    icon: CreditCard, label: 'Total Paiements', sub: 'toutes transactions',
    iconBg: '#EFF6FF', iconColor: '#1A5FB4',
    value: (m, l) => l ? '…' : (m?.total ?? 0).toLocaleString('fr-FR'),
  },
  {
    icon: Shield, label: 'Sécurisés (Escrow)', sub: 'en attente de libération',
    iconBg: '#FFF7ED', iconColor: '#F97316',
    value: (m, l) => l ? '…' : (m?.secured ?? 0).toLocaleString('fr-FR'),
  },
  {
    icon: CheckCircle, label: 'Libérés', sub: 'transférés aux conducteurs',
    iconBg: '#F0FDF4', iconColor: '#16A34A',
    value: (m, l) => l ? '…' : (m?.released ?? 0).toLocaleString('fr-FR'),
  },
  {
    icon: AlertTriangle, label: 'Échoués', sub: 'incluant remboursements',
    iconBg: '#FEF2F2', iconColor: '#E53935', valueColor: '#E53935',
    value: (m, l) => l ? '…' : (m?.failed ?? 0).toLocaleString('fr-FR'),
  },
  {
    icon: TrendingUp, label: 'Volume Brut', sub: 'total encaissé',
    iconBg: '#F0FDF4', iconColor: '#16A34A',
    value: (m, l) => l ? '…' : (m?.volume ?? '—'),
  },
  {
    icon: DollarSign, label: 'Commissions', sub: 'revenus plateforme',
    iconBg: '#FFFBEB', iconColor: '#D97706',
    value: (m, l) => l ? '…' : (m?.commission ?? '—'),
  },
];

interface Props {
  metrics:  PaymentMetrics | null;
  loading?: boolean;
}

export function PaymentsMetrics({ metrics, loading }: Props) {
  return (
    <div className="payments-metrics">
      {CARDS.map((c) => (
        <div key={c.label} className="payments-kpi">
          <div className="payments-kpi__icon" style={{ background: c.iconBg }}>
            <AppIcon icon={c.icon} size={18} color={c.iconColor} />
          </div>
          <div className="payments-kpi__body">
            <div className="payments-kpi__label">{c.label}</div>
            <div
              className="payments-kpi__value"
              style={c.valueColor ? { color: c.valueColor } : undefined}
            >
              {c.value(metrics, loading)}
            </div>
            <div className="payments-kpi__sub">{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
