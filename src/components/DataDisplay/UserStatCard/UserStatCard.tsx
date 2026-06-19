import type { ReactNode } from 'react';
import type { UserPageMetric } from '../../../config/constants';

interface UserStatCardProps extends UserPageMetric {
  icon: ReactNode;
}

export function UserStatCard({ label, value, trend, trendColor, iconBg, icon }: UserStatCardProps) {
  return (
    <div className="user-stat-card">
      <div className="user-stat-card__body">
        <div className="user-stat-card__label">{label}</div>
        <div className="user-stat-card__value">{value}</div>
        <div className="user-stat-card__trend" style={{ color: trendColor }}>{trend}</div>
      </div>
      <div className="user-stat-card__icon-box" style={{ background: iconBg }}>
        {icon}
      </div>
    </div>
  );
}
