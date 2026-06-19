import { Settings, Link2, ShieldCheck, Banknote } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppIcon }          from '../../../components/Common/AppIcon';
import { SETTINGS_SUMMARY_DATA } from '../../../config/constants';

const ICON_MAP: Record<string, LucideIcon> = {
  settings:    Settings,
  link2:       Link2,
  shieldCheck: ShieldCheck,
  banknote:    Banknote,
};

export function SettingsSummary() {
  return (
    <div className="settings-summary">
      {SETTINGS_SUMMARY_DATA.map((item) => {
        const Icon = ICON_MAP[item.iconId] ?? Settings;
        return (
          <div key={item.id} className="settings-summary-card">
            <div className="settings-summary-card__body">
              <span className="settings-summary-card__label">{item.label}</span>
              <span
                className="settings-summary-card__value"
                style={item.valueColor ? { color: item.valueColor } : undefined}
              >
                {item.value}
              </span>
            </div>
            <div className="settings-summary-card__icon" style={{ background: item.iconBg }}>
              <AppIcon icon={Icon} size={18} color={item.iconColor} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
