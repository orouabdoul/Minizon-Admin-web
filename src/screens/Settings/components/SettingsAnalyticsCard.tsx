import type { AnalyticsItem } from '../../../models/settings.model';

interface Props {
  analytics: AnalyticsItem[];
  loading:   boolean;
}

const PLACEHOLDER: AnalyticsItem[] = Array.from({ length: 4 }, (_, i) => ({
  id: i, label: '…', value: '…', valueColor: '#D1D5DB', period: '…',
}));

export function SettingsAnalyticsCard({ analytics, loading }: Props) {
  const display = loading || analytics.length === 0 ? PLACEHOLDER : analytics;

  return (
    <div className="settings-card">
      <p className="settings-card__title">Analytics Business Intelligence</p>
      <div className="settings-analytics-grid">
        {display.map((item) => (
          <div key={item.id} className="settings-analytics-card">
            <p className="settings-analytics-card__label">{item.label}</p>
            <p className="settings-analytics-card__value" style={{ color: item.valueColor }}>{item.value}</p>
            <p className="settings-analytics-card__period">{item.period}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
