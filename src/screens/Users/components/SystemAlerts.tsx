import { USER_SYSTEM_ALERTS } from '../../../config/constants';

export function SystemAlerts() {
  return (
    <div className="users-card">
      <div className="users-card__title">Alertes Système</div>
      <div className="alerts-list">
        {USER_SYSTEM_ALERTS.map((alert) => (
          <div key={alert.id} className="alert-item">
            <span className="alert-item__dot" style={{ background: alert.dotColor }} />
            <div className="alert-item__text">
              <div className="alert-item__title">{alert.title}</div>
              <div className="alert-item__time">{alert.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
