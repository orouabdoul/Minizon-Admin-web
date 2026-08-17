import { Car, AlertTriangle, Clock, Users, Wrench, Info, RefreshCw, Timer, Search, Flag } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import type { TrackedTrip, IncidentType, TrackingFilter } from '../../../models/tracking.model';

interface Props {
  trips:          TrackedTrip[];
  selectedId:     string | null;
  filter:         TrackingFilter;
  search:         string;
  loading:        boolean;
  onSelect:       (id: string) => void;
  onFilter:       (f: TrackingFilter) => void;
  onSearchChange: (s: string) => void;
  onReport:       (tripId: string, type: IncidentType) => void;
  onResolve:      (tripId: string) => void;
  onRefresh:      () => void;
}

const INCIDENT_COLOR: Record<string, string> = {
  panne:   '#E53935',
  urgence: '#F59E0B',
  autre:   '#1A5FB4',
};

const INCIDENT_LABEL: Record<string, string> = {
  panne:   'Panne',
  urgence: 'Urgence',
  autre:   'Autre',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  actif:      { label: '● En cours',   color: '#1A5FB4', bg: 'rgba(26,95,180,0.10)' },
  en_attente: { label: '◷ En attente', color: '#D97706', bg: '#FEF9C3' },
  retard:     { label: '⚠ Retard',     color: '#E53935', bg: '#FEE2E2' },
  incident:   { label: '✕ Incident',   color: '#E53935', bg: '#FEE2E2' },
  terminé:    { label: '✓ Terminé',    color: '#6B7280', bg: '#F3F4F6' },
  annulé:     { label: '✕ Annulé',     color: '#9CA3AF', bg: '#F3F4F6' },
};

const TABS: { key: TrackingFilter; label: string }[] = [
  { key: 'all',        label: 'Tous'      },
  { key: 'actif',      label: 'En cours'  },
  { key: 'en_attente', label: 'Attente'   },
  { key: 'incident',   label: 'Incidents' },
  { key: 'retard',     label: 'Retard'    },
  { key: 'flagged',    label: 'Signalés'  },
];

function fmtScheduled(iso?: string) {
  if (!iso) return null;
  if (/^\d{2}:\d{2}/.test(iso)) return iso;
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function TripListPanel({
  trips, selectedId, filter, search, loading,
  onSelect, onFilter, onSearchChange, onReport, onResolve, onRefresh,
}: Props) {
  return (
    <div className="tracking-panel">
      {/* Panel header */}
      <div className="tracking-panel__header">
        <div className="tracking-panel__title-row">
          <p className="tracking-panel__title">
            Trajets publiés
            {trips.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', marginLeft: 6 }}>
                ({trips.length})
              </span>
            )}
          </p>
          <button type="button" className="tracking-panel__refresh" onClick={onRefresh} title="Actualiser">
            <AppIcon icon={RefreshCw} size={14} color="#6B7280" />
          </button>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#F3F4F6', borderRadius: 8, padding: '7px 10px', marginBottom: 8 }}>
          <AppIcon icon={Search} size={13} color="#9CA3AF" />
          <input
            style={{ border: 'none', background: 'transparent', fontSize: 12, color: '#374151', outline: 'none', flex: 1 }}
            placeholder="Conducteur, ville, ID trajet…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: '#9CA3AF', padding: 0, lineHeight: 1 }}
              onClick={() => onSearchChange('')}
            >×</button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="tracking-panel__tabs" style={{ flexWrap: 'wrap', gap: 4 }}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`tracking-panel__tab${filter === key ? ' tracking-panel__tab--active' : ''}`}
              onClick={() => onFilter(key)}
              style={{ flex: 'none', minWidth: 'auto', padding: '3px 8px', fontSize: 10 }}
            >
              {label}
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
          const isSelected  = t.id === selectedId;
          const hasIncident = !!t.incident && !t.incident.resolved;
          const statusCfg   = hasIncident
            ? { label: INCIDENT_LABEL[t.incident!.type] ?? 'Incident', color: INCIDENT_COLOR[t.incident!.type], bg: INCIDENT_COLOR[t.incident!.type] + '18' }
            : STATUS_CONFIG[t.status] ?? STATUS_CONFIG.actif;

          const isDelayed   = t.status === 'retard';
          const isPending   = t.status === 'en_attente';
          const borderColor = t.isFlagged ? '#1A5FB4'
            : hasIncident ? INCIDENT_COLOR[t.incident!.type]
            : statusCfg.color;

          return (
            <div
              key={t.id}
              className={`tracking-trip-card${isSelected ? ' tracking-trip-card--selected' : ''}`}
              onClick={() => onSelect(t.id)}
              style={{ borderLeft: `3px solid ${borderColor}` }}
            >
              {/* Card header */}
              <div className="tracking-trip-card__head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={t.driverAvatar} alt={t.driverName} className="tracking-trip-card__avatar" />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div className="tracking-trip-card__driver">{t.driverName}</div>
                      {t.isFlagged && <AppIcon icon={Flag} size={11} color="#1A5FB4" />}
                    </div>
                    <div className="tracking-trip-card__tripid">{t.tripId}</div>
                  </div>
                </div>
                <span className="tracking-trip-card__status" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                  {statusCfg.label}
                </span>
              </div>

              {/* Route */}
              <div className="tracking-trip-card__route">
                <span>{t.from}</span>
                <span className="tracking-trip-card__route-arrow">→</span>
                <span>{t.to}</span>
              </div>

              {/* Meta row */}
              <div className="tracking-trip-card__meta">
                <span>
                  <AppIcon icon={Users} size={11} color="#9CA3AF" />
                  {t.passengerCount}{t.totalSeats ? `/${t.totalSeats}` : ''} passager{t.passengerCount !== 1 ? 's' : ''}
                </span>
                {isPending && t.scheduledAt && (
                  <span style={{ color: '#D97706' }}>
                    <AppIcon icon={Clock} size={11} color="#D97706" />
                    Prévu {fmtScheduled(t.scheduledAt)}
                  </span>
                )}
                {!isPending && t.estimatedArrival && (
                  <span>
                    <AppIcon icon={Clock} size={11} color="#9CA3AF" />
                    Arr. {t.estimatedArrival}
                  </span>
                )}
                {t.status === 'actif' && t.position.speed != null && (
                  <span>{t.position.speed} km/h</span>
                )}
              </div>

              {/* Delay banner */}
              {isDelayed && t.delayMinutes != null && t.delayMinutes > 0 && (
                <div className="tracking-trip-card__delay">
                  <AppIcon icon={Timer} size={12} color="#E53935" />
                  <span>Retard : <strong>{t.delayMinutes} min</strong> — départ non effectué</span>
                </div>
              )}

              {/* Moderation note */}
              {t.isFlagged && t.moderationNote && (
                <div style={{ marginTop: 5, padding: '4px 8px', background: '#F3E8FF', borderRadius: 6, fontSize: 11, color: '#1A5FB4' }}>
                  <AppIcon icon={Flag} size={11} color="#1A5FB4" /> {t.moderationNote}
                </div>
              )}

              {/* Active incident detail */}
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
                    {t.incident!.reportedAt && (
                      <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 'auto' }}>{t.incident!.reportedAt}</span>
                    )}
                  </div>
                  {t.incident!.notes && <p className="tracking-trip-card__incident-notes">{t.incident!.notes}</p>}
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
              {!hasIncident && t.status !== 'terminé' && t.status !== 'annulé' && (
                <div className="tracking-trip-card__actions" onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: 10, color: '#9CA3AF', marginRight: 2 }}>Signaler :</span>
                  <button type="button" className="tracking-trip-card__action-btn tracking-trip-card__action-btn--panne" onClick={() => onReport(t.id, 'panne')}>
                    <AppIcon icon={Wrench} size={10} color="#E53935" /> Panne
                  </button>
                  <button type="button" className="tracking-trip-card__action-btn tracking-trip-card__action-btn--urgence" onClick={() => onReport(t.id, 'urgence')}>
                    <AppIcon icon={AlertTriangle} size={10} color="#F59E0B" /> Urgence
                  </button>
                  <button type="button" className="tracking-trip-card__action-btn tracking-trip-card__action-btn--autre" onClick={() => onReport(t.id, 'autre')}>
                    <AppIcon icon={Info} size={10} color="#1A5FB4" /> Autre
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
