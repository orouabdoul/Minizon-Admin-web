import { USER_PERFORMANCE_METRICS } from '../../../config/constants';
import { perfFill }                  from '../styles';

export function PerformanceCard() {
  return (
    <div className="users-card">
      <div className="users-card__title">Performance</div>
      <div className="perf-list">
        {USER_PERFORMANCE_METRICS.map((m) => (
          <div key={m.id} className="perf-item">
            <div className="perf-bar-row">
              <span className="perf-item__label">{m.label}</span>
              <span className="perf-item__value">{m.value}</span>
            </div>
            <div className="perf-track">
              <div style={perfFill(m.percent, m.color)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
