import { Car, AlertTriangle, Clock, Users, Wrench, Info, RefreshCw } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import type { TrackedTrip, IncidentType } from '../../../models/tracking.model';

interface Props {
  trips:      TrackedTrip[];
  selectedId: string | null;
  filter:     'all' | 'actif' | 'incident';
  loading:    boolean;
  onSelect:   (id: string) => void;
  onFilter:   (f: 'all' | 'actif' | 'incident') => void;
  onReport:   (tripId: string, type: IncidentType) => void;
  onResolve:  (tripId: string) => void;
  onRefresh:  () => void;
}

const INCIDENT_COLOR: Record<string, string> = {
  panne:   '#E53935',
  urgence: '#F59E0B',
  autre:   '#2563EB',
};

const INCIDENT_LABEL: Record<string, string> = {
  panne:   '🔧 Panne',
  urgence: '🚨 Urgence',
  autre:   'ℹ️ Autre',
};

export function TripListPanel({
  trips, selectedId, filter, loading,
  onSelect, onFilter, onReport, onResolve, onRefresh,
}: Props) {
  return (
    <div className="tracking-panel">
      {/* Panel header */}
      <div className="tracking-panel__header">
        <div className="tracking-panel__title-row">
          <p className="tracking-panel__title">Trajets Actifs</p>
          <button type="button" className="tracking-panel__refresh" onClick={onRefresh} title="Actualiser">
            <AppIcon icon={RefreshCw} size={14} color="#6B7280" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="tracking-panel__tabs">
          {(['all', 'actif', 'incident'] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`tracking-panel__tab${filter === f ? ' tracking-panel__tab--active' : ''}`}
              onClick={() => onFilter(f)}
            >
              {f === 'all' ? 'Tous' : f === 'actif' ? '🟢 Actifs' : '🔴 Incidents'}
            </button>
          ))}
        </div>
      </div>

      {/* Trip list */}
      <div className="tracking-panel__list">
        {loading ? (
          <div className="tracking-panel__empty">
            <p style={{ color: '#9CA3AF', fontSize: 13 }}>Chargement…</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="tracking-panel__empty">
            <AppIcon icon={Car} size={32} color="#D1D5DB" />
            <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 8 }}>Aucun trajet</p>
          </div>
        ) : trips.map((t) => {
          const isSelected = t.id === selectedId;
          const hasIncident = !!t.incident && !t.incident.resolved;
          const incColor = hasIncident ? INCIDENT_COLOR[t.incident!.type] : '#00A86B';

          return (
            <div
              key={t.id}
              className={`tracking-trip-card${isSelected ? ' tracking-trip-card--selected' : ''}`}
              onClick={() => onSelect(t.id)}
              style={{ borderLeft: `3px solid ${incColor}` }}
            >
              {/* Card header */}
              <div className="tracking-trip-card__head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={t.driverAvatar} alt={t.driverName} className="tracking-trip-card__avatar" />
                  <div>
                    <div className="tracking-trip-card__driver">{t.driverName}</div>
                    <div className="tracking-trip-card__tripid">{t.tripId}</div>
                  </div>
                </div>
                <span
                  className="tracking-trip-card__status"
                  style={{ background: incColor + '18', color: incColor }}
                >
                  {hasIncident ? INCIDENT_LABEL[t.incident!.type] : '● Actif'}
                </span>
              </div>

              {/* Route */}
              <div className="tracking-trip-card__route">
                <span>{t.from}</span>
                <span className="tracking-trip-card__route-arrow">→</span>
                <span>{t.to}</span>
              </div>

              {/* Meta */}
              <div className="tracking-trip-card__meta">
                <span><AppIcon icon={Users} size={11} color="#9CA3AF" /> {t.passengerCount} passager{t.passengerCount > 1 ? 's' : ''}</span>
                <span><AppIcon icon={Clock} size={11} color="#9CA3AF" /> Arr. {t.estimatedArrival}</span>
                {t.position.speed ? <span>🏎 {t.position.speed} km/h</span> : null}
              </div>

              {/* Active incident */}
              {hasIncident && (
                <div
                  className="tracking-trip-card__incident"
                  style={{ background: INCIDENT_COLOR[t.incident!.type] + '10', borderColor: INCIDENT_COLOR[t.incident!.type] + '40' }}
                >
                  <div className="tracking-trip-card__incident-head">
                    <AppIcon icon={AlertTriangle} size={12} color={INCIDENT_COLOR[t.incident!.type]} />
                    <span style={{ color: INCIDENT_COLOR[t.incident!.type], fontWeight: 700, fontSize: 12 }}>
                      {INCIDENT_LABEL[t.incident!.type]}
                    </span>
                  </div>
                  {t.incident!.notes && (
                    <p className="tracking-trip-card__incident-notes">{t.incident!.notes}</p>
                  )}
                  <button
                    type="button"
                    className="tracking-trip-card__resolve-btn"
                    onClick={(e) => { e.stopPropagation(); onResolve(t.id); }}
                  >
                    ✓ Marquer comme résolu
                  </button>
                </div>
              )}

              {/* Incident action buttons */}
              {!hasIncident && (
                <div className="tracking-trip-card__actions" onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: 11, color: '#9CA3AF', marginRight: 4 }}>Signaler :</span>
                  <button type="button" className="tracking-trip-card__action-btn tracking-trip-card__action-btn--panne"   onClick={() => onReport(t.id, 'panne')}>
                    <AppIcon icon={Wrench} size={11} color="#E53935" /> Panne
                  </button>
                  <button type="button" className="tracking-trip-card__action-btn tracking-trip-card__action-btn--urgence" onClick={() => onReport(t.id, 'urgence')}>
                    <AppIcon icon={AlertTriangle} size={11} color="#F59E0B" /> Urgence
                  </button>
                  <button type="button" className="tracking-trip-card__action-btn tracking-trip-card__action-btn--autre"   onClick={() => onReport(t.id, 'autre')}>
                    <AppIcon icon={Info} size={11} color="#2563EB" /> Autre
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
