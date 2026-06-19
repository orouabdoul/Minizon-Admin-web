import { CreditCard, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PassengerKpiCard }  from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import { PAYMENT_KPI_DATA }  from '../../../config/constants';

const ICON_MAP: Record<string, LucideIcon> = {
  creditCard:    CreditCard,
  trendingUp:    TrendingUp,
  checkCircle:   CheckCircle,
  alertTriangle: AlertTriangle,
};

export function PaymentsMetrics() {
  return (
    <div className="payments-metrics">
      {PAYMENT_KPI_DATA.map((kpi) => {
        const Icon = ICON_MAP[kpi.iconId] ?? CreditCard;
        return (
          <PassengerKpiCard
            key={kpi.id}
            label={kpi.label} value={kpi.value} badge={kpi.badge}
            iconBg={kpi.iconBg} iconColor={kpi.iconColor} icon={Icon}
            badgeBg={kpi.badgeBg} badgeColor={kpi.badgeColor}
          />
        );
      })}
    </div>
  );
}
