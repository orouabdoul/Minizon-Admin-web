import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon }          from 'lucide-react';
import { AppIcon }                  from '../../Common/AppIcon';

interface DisputeKpiCardProps {
  label:      string;
  value:      string;
  trend:      string;
  trendColor: string;
  suffix:     string;
  iconBg:     string;
  iconColor:  string;
  icon:       LucideIcon;
}

export function DisputeKpiCard({ label, value, trend, trendColor, suffix, iconBg, iconColor, icon }: DisputeKpiCardProps) {
  const TrendIcon = trend.startsWith('+') ? TrendingUp : TrendingDown;

  return (
    <div className="dispute-kpi-card">
      <div className="dispute-kpi-card__top">
        <span className="dispute-kpi-card__label">{label}</span>
        <div className="dispute-kpi-card__icon-box" style={{ background: iconBg }}>
          <AppIcon icon={icon} size={16} color={iconColor} />
        </div>
      </div>
      <p className="dispute-kpi-card__value">{value}</p>
      <div className="dispute-kpi-card__footer">
        <span className="dispute-kpi-card__trend" style={{ color: trendColor }}>
          <AppIcon icon={TrendIcon} size={12} color={trendColor} />
          {trend}
        </span>
        <span className="dispute-kpi-card__suffix">{suffix}</span>
      </div>
    </div>
  );
}
