import {
  Calendar, CheckCircle, TrendingUp, Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PassengerKpiCard }   from '../../../components/DataDisplay/PassengerKpiCard/PassengerKpiCard';
import { RESERVATION_KPI_DATA } from '../../../config/constants';

const ICON_MAP: Record<string, LucideIcon> = {
  calendar:    Calendar,
  checkCircle: CheckCircle,
  trendingUp:  TrendingUp,
  star:        Star,
};

export function ReservationsMetrics() {
  return (
    <div className="reservations-metrics">
      {RESERVATION_KPI_DATA.map((kpi) => {
        const Icon = ICON_MAP[kpi.iconId] ?? Calendar;
        return (
          <PassengerKpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            badge={kpi.badge}
            iconBg={kpi.iconBg}
            iconColor={kpi.iconColor}
            icon={Icon}
            badgeBg={kpi.badgeBg}
            badgeColor={kpi.badgeColor}
          />
        );
      })}
    </div>
  );
}
