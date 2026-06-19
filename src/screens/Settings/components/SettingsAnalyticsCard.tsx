import { SETTINGS_ANALYTICS } from '../../../config/constants';

export function SettingsAnalyticsCard() {
  return (
    <div className="settings-card">
      <p className="settings-card__title">Analytics Business Intelligence</p>
      <div className="settings-analytics-grid">
        {SETTINGS_ANALYTICS.map((item) => (
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
