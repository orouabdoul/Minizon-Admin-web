import { Settings, Link2, ShieldCheck, Banknote } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppIcon }         from '../../../components/Common/AppIcon';
import type { SettingsSummaryItem } from '../../../models/settings.model';

interface Props {
  items:    SettingsSummaryItem[];
  loading?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  settings:    Settings,
  link2:       Link2,
  shieldCheck: ShieldCheck,
  banknote:    Banknote,
};

const PLACEHOLDER: SettingsSummaryItem[] = Array.from({ length: 4 }, (_, i) => ({
  id: i, label: '…', value: '…', iconId: 'settings',
  iconBg: '#F3F4F6', iconColor: '#D1D5DB', valueColor: null,
}));

export function SettingsSummary({ items, loading }: Props) {
  const display = loading || items.length === 0 ? PLACEHOLDER : items;

  return (
    <div className="settings-summary">
      {display.map((item) => {
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
