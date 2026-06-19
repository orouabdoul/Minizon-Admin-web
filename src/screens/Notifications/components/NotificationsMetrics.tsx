import { Bell, AlertTriangle, CheckCircle, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppIcon }          from '../../../components/Common/AppIcon';
import { NOTIF_SUMMARY_DATA } from '../../../config/constants';

const ICON_MAP: Record<string, LucideIcon> = {
  bell:          Bell,
  mail:          Mail,
  alertTriangle: AlertTriangle,
  checkCircle:   CheckCircle,
};

export function NotificationsMetrics() {
  return (
    <div className="notif-summary">
      {NOTIF_SUMMARY_DATA.map((item) => {
        const Icon = ICON_MAP[item.iconId] ?? Bell;
        return (
          <div key={item.id} className="notif-summary-card">
            <div className="notif-summary-card__body">
              <span className="notif-summary-card__label">{item.label}</span>
              <span
                className="notif-summary-card__value"
                style={item.valueColor ? { color: item.valueColor } : undefined}
              >
                {item.value}
              </span>
            </div>
            <div className="notif-summary-card__icon" style={{ background: item.iconBg }}>
              <AppIcon icon={Icon} size={18} color={item.iconColor} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
