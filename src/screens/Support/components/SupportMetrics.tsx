import { AlertTriangle, MessageCircle, CheckCircle } from 'lucide-react';
import type { LucideIcon }   from 'lucide-react';
import { AppIcon }           from '../../../components/Common/AppIcon';
import { UserStatCard }      from '../../../components/DataDisplay/UserStatCard/UserStatCard';
import { SUPPORT_KPI_DATA }  from '../../../config/constants';

const ICON_MAP: Record<string, LucideIcon> = {
  alertTriangle: AlertTriangle,
  messageCircle: MessageCircle,
  checkCircle:   CheckCircle,
};

export function SupportMetrics() {
  return (
    <div className="support-metrics">
      {SUPPORT_KPI_DATA.map((kpi) => {
        const Icon = ICON_MAP[kpi.iconId] ?? AlertTriangle;
        return (
          <UserStatCard
            key={kpi.id}
            {...kpi}
            icon={<AppIcon icon={Icon} size={22} color={kpi.iconColor} />}
          />
        );
      })}
    </div>
  );
}
