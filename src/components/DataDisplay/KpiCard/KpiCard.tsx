import type { ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import type { KpiCardData } from '../../../config/constants';

interface KpiCardProps extends KpiCardData {
  icon: ReactNode;
}

export function KpiCard({ label, value, badge, badgeVariant, iconBg, iconColor: _iconColor, icon }: KpiCardProps) {
  return (
    <div className="dash-kpi-card">
      <div className="dash-kpi-card__top">
        <div className="dash-kpi-card__icon-box" style={{ background: iconBg }}>
          {icon}
        </div>
        <Badge label={badge} variant={badgeVariant} />
      </div>
      <div className="dash-kpi-card__value">{value}</div>
      <div className="dash-kpi-card__label">{label}</div>
    </div>
  );
}
