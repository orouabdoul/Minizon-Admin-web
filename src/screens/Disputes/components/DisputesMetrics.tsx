import { AlertTriangle, Lock, Clock } from 'lucide-react';
import type { LucideIcon }            from 'lucide-react';
import { DisputeKpiCard }             from '../../../components/DataDisplay/DisputeKpiCard/DisputeKpiCard';
import { DISPUTE_KPI_DATA }           from '../../../config/constants';

const ICON_MAP: Record<string, LucideIcon> = {
  alertTriangle: AlertTriangle,
  lock:          Lock,
  clock:         Clock,
};

export function DisputesMetrics() {
  return (
    <div className="disputes-metrics">
      {DISPUTE_KPI_DATA.map((kpi) => {
        const Icon = ICON_MAP[kpi.iconId] ?? AlertTriangle;
        return (
          <DisputeKpiCard
            key={kpi.id}
            label={kpi.label}   value={kpi.value}
            trend={kpi.trend}   trendColor={kpi.trendColor}
            suffix={kpi.suffix} iconBg={kpi.iconBg}
            iconColor={kpi.iconColor} icon={Icon}
          />
        );
      })}
    </div>
  );
}
