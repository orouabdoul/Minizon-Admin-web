import {
  Phone, MapPin, Users, Clock, AlertTriangle, MessageSquare,
  Navigation, ChevronDown, ChevronUp, Loader, Flag, Car, CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import { AppIcon } from '../../../components/Common/AppIcon';
import type { TrackedTrip, PassengerStop } from '../../../models/tracking.model';

interface Props {
  trip:               TrackedTrip | null;
  loadingDetail:      boolean;
  onAlertDriver:      (trip: TrackedTrip) => void;
  onReportIncident:   (tripId: string) => void;
  onResolveIncident:  (tripId: string) => void;
  onFlagTrip:         (tripId: string, flag: boolean, note?: string) => void;
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  actif:      { label: 'En cours',   color: '#00A86B', bg: 'rgba(0,168,107,0.12)' },
  en_attente: { label: 'En attente', color: '#D97706', bg: '#FEF9C3' },
  retard:     { label: 'Retard',     color: '#E53935', bg: '#FEE2E2' },
  incident:   { label: 'Incident',   color: '#E53935', bg: '#FEE2E2' },
  terminé:    { label: 'Terminé',    color: '#00A86B', bg: '#D1FAE5' },
  annulé:     { label: 'Annulé',     color: '#9CA3AF', bg: '#F3F4F6' },
};

const BOOKING_CFG: Record<string, { color: string; label: string }> = {
  confirmé:   { color: '#00A86B', label: 'Confirmé'   },
  en_attente: { color: '#D97706', label: 'En attente' },
  annulé:     { color: '#E53935', label: 'Annulé'     },
};

// ── Passenger card ─────────────────────────────────────────────────────────────

function PassengerCard({ p }: { p: PassengerStop }) {
  const [open, setOpen] = useState(false);
  const bc = BOOKING_CFG[p.bookingStatus] ?? BOOKING_CFG.confirmé;

  // Resolve coords from either API shape (pickup.lat/lng) or tuple
  const pCoords = p.pickup ?? (p.pickupCoords  ? { lat: p.pickupCoords[0],  lng: p.pickupCoords[1]  } : null);
  const dCoords = p.dropoff ?? (p.dropoffCoords ? { lat: p.dropoffCoords[0], lng: p.dropoffCoords[1] } : null);

  return (
    <div className="trk-detail-passenger">
      <div className="trk-detail-passenger__head" onClick={() => setOpen((v) => !v)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {p.avatar ? (
            <img src={p.avatar} alt={p.name} className="trk-detail-passenger__avatar" />
          ) : (
            <div className="trk-detail-passenger__avatar trk-detail-passenger__avatar--placeholder">
              {p.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{p.name}</div>
            {p.phone && <div style={{ fontSize: 11, color: '#6B7280' }}>{p.phone}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          {p.pickedUp != null && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 9999,
              color: p.pickedUp ? '#00A86B' : '#9CA3AF',
              background: p.pickedUp ? 'rgba(0,168,107,0.10)' : '#F3F4F6' }}>
              {p.pickedUp ? '✓ Embarqué' : '⏳ Attente'}
            </span>
          )}
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 9999, color: bc.color, background: bc.color + '18' }}>
            {bc.label}
          </span>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{p.seats} place{p.seats > 1 ? 's' : ''}</span>
          <AppIcon icon={open ? ChevronUp : ChevronDown} size={14} color="#9CA3AF" />
        </div>
      </div>

      {open && (
        <div className="trk-detail-passenger__stops">
          <div className="trk-detail-passenger__stop trk-detail-passenger__stop--pickup">
            <AppIcon icon={MapPin} size={13} color="#00A86B" />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#00A86B', textTransform: 'uppercase', letterSpacing: 0.3 }}>Prise en charge</div>
              <div style={{ fontSize: 12, color: '#374151' }}>{p.pickupAddress}</div>
              {pCoords && <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>{pCoords.lat.toFixed(5)}, {pCoords.lng.toFixed(5)}</div>}
            </div>
          </div>
          <div className="trk-detail-passenger__stop-connector" />
          <div className="trk-detail-passenger__stop trk-detail-passenger__stop--dropoff">
            <AppIcon icon={MapPin} size={13} color="#E53935" />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#E53935', textTransform: 'uppercase', letterSpacing: 0.3 }}>Dépose</div>
              <div style={{ fontSize: 12, color: '#374151' }}>{p.dropoffAddress}</div>
              {dCoords && <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>{dCoords.lat.toFixed(5)}, {dCoords.lng.toFixed(5)}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Flag modal ─────────────────────────────────────────────────────────────────

function FlagModal({ tripId: _tripId, current, onClose, onSave }: {
  tripId: string; current: boolean;
  onClose: () => void;
  onSave: (flag: boolean, note: string) => void;
}) {
  const [note, setNote] = useState('');
  return (
    <div className="trk-modal-backdrop" onClick={onClose}>
      <div className="trk-modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <div className="trk-modal__header">
          <span style={{ fontSize: 14, fontWeight: 700, color: current ? '#7C3AED' : '#374151' }}>
            {current ? 'Retirer le signalement' : 'Signaler ce trajet'}
          </span>
          <button type="button" className="trk-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="trk-modal__body">
          {!current && (
            <textarea
              style={{ width: '100%', height: 80, padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: 9, fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              placeholder="Note de modération (optionnel)…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          )}
          {current && <p style={{ fontSize: 13, color: '#6B7280' }}>Confirmer le retrait du signalement sur ce trajet ?</p>}
        </div>
        <div className="trk-modal__footer">
          <button type="button" className="trk-modal__cancel-btn" onClick={onClose}>Annuler</button>
          <button
            type="button"
            className="trk-modal__send-btn"
            style={{ background: current ? '#6B7280' : '#7C3AED' }}
            onClick={() => { onSave(!current, note); onClose(); }}
          >
            {current ? 'Retirer le signalement' : 'Signaler'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtTime(iso?: string) {
  if (!iso) return '—';
  if (/^\d{2}:\d{2}/.test(iso)) return iso;
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function fmtDate(iso?: string) {
  if (!iso) return '—';
  if (/^\d{2}:\d{2}/.test(iso)) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtFull(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyDetail() {
  return (
    <div className="trk-detail-empty">
      <Navigation size={40} color="#D1D5DB" />
      <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 12, textAlign: 'center' }}>
        Sélectionnez un trajet<br />pour afficher les détails
      </p>
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────────

export function TripDetailPanel({ trip, loadingDetail, onAlertDriver, onReportIncident, onResolveIncident, onFlagTrip }: Props) {
  const [flagOpen, setFlagOpen] = useState(false);

  if (!trip) return (
    <div className="trk-detail-panel"><EmptyDetail /></div>
  );

  const statusCfg   = STATUS_CFG[trip.status] ?? STATUS_CFG.actif;
  const hasIncident = !!trip.incident && !trip.incident.resolved;

  return (
    <div className="trk-detail-panel">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="trk-detail-header">
        <img src={trip.driverAvatar} alt={trip.driverName} className="trk-detail-avatar" />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{trip.driverName}</span>
            {trip.isFlagged && <AppIcon icon={Flag} size={14} color="#7C3AED" />}
          </div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>{trip.tripId}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 9999, color: statusCfg.color, background: statusCfg.bg }}>
            {statusCfg.label}
          </span>
          {trip.delayMinutes != null && trip.delayMinutes > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#E53935' }}>+{trip.delayMinutes} min</span>
          )}
        </div>
      </div>

      {/* ── Scrollable body ──────────────────────────────────────────────────── */}
      <div className="trk-detail-body">

        {/* Route */}
        <div className="trk-detail-card">
          <div className="trk-detail-card__label">Itinéraire</div>
          <div className="trk-detail-route">
            <div className="trk-detail-route__city trk-detail-route__city--from">
              <AppIcon icon={MapPin} size={14} color="#00A86B" /><span>{trip.from}</span>
            </div>
            <div className="trk-detail-route__line" />
            <div className="trk-detail-route__city trk-detail-route__city--to">
              <AppIcon icon={MapPin} size={14} color="#E53935" /><span>{trip.to}</span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="trk-detail-card">
          <div className="trk-detail-card__label">Informations</div>
          <div className="trk-detail-info-grid">
            <div className="trk-detail-info-item">
              <AppIcon icon={Clock} size={13} color="#6B7280" />
              <span className="trk-detail-info-item__k">Date</span>
              <span className="trk-detail-info-item__v">{fmtDate(trip.scheduledAt)}</span>
            </div>
            {trip.scheduledAt && (
              <div className="trk-detail-info-item">
                <AppIcon icon={Clock} size={13} color="#D97706" />
                <span className="trk-detail-info-item__k">Prévu à</span>
                <span className="trk-detail-info-item__v" style={{ color: '#D97706' }}>{fmtTime(trip.scheduledAt)}</span>
              </div>
            )}
            {trip.startedAt && (
              <div className="trk-detail-info-item">
                <AppIcon icon={CheckCircle} size={13} color="#00A86B" />
                <span className="trk-detail-info-item__k">Démarré à</span>
                <span className="trk-detail-info-item__v" style={{ color: '#00A86B' }}>{trip.startedAt}</span>
              </div>
            )}
            <div className="trk-detail-info-item">
              <AppIcon icon={Clock} size={13} color="#2563EB" />
              <span className="trk-detail-info-item__k">Arr. estimée</span>
              <span className="trk-detail-info-item__v">{trip.estimatedArrival}</span>
            </div>
            <div className="trk-detail-info-item">
              <AppIcon icon={Users} size={13} color="#6B7280" />
              <span className="trk-detail-info-item__k">Passagers</span>
              <span className="trk-detail-info-item__v">{trip.passengerCount}{trip.totalSeats ? `/${trip.totalSeats}` : ''}</span>
            </div>
            {trip.position.speed != null && (
              <div className="trk-detail-info-item">
                <Navigation size={13} color="#6B7280" />
                <span className="trk-detail-info-item__k">Vitesse</span>
                <span className="trk-detail-info-item__v">{trip.position.speed} km/h</span>
              </div>
            )}
            {trip.price != null && (
              <div className="trk-detail-info-item">
                <span style={{ fontSize: 13 }}>💰</span>
                <span className="trk-detail-info-item__k">Prix</span>
                <span className="trk-detail-info-item__v">{trip.price.toLocaleString('fr-FR')} {trip.priceUnit ?? 'FCFA'}</span>
              </div>
            )}
            <div className="trk-detail-info-item">
              <Phone size={13} color="#6B7280" />
              <span className="trk-detail-info-item__k">Tél. conducteur</span>
              <span className="trk-detail-info-item__v">{trip.driverPhone}</span>
            </div>
          </div>
        </div>

        {/* Véhicule */}
        {trip.vehicle && (Object.values(trip.vehicle).some(Boolean)) && (
          <div className="trk-detail-card">
            <div className="trk-detail-card__label">Véhicule</div>
            <div className="trk-detail-info-grid">
              {trip.vehicle.plate && (
                <div className="trk-detail-info-item">
                  <AppIcon icon={Car} size={13} color="#6B7280" />
                  <span className="trk-detail-info-item__k">Plaque</span>
                  <span className="trk-detail-info-item__v" style={{ fontFamily: 'monospace', fontWeight: 700 }}>{trip.vehicle.plate}</span>
                </div>
              )}
              {trip.vehicle.brand && trip.vehicle.model && (
                <div className="trk-detail-info-item">
                  <AppIcon icon={Car} size={13} color="#6B7280" />
                  <span className="trk-detail-info-item__k">Modèle</span>
                  <span className="trk-detail-info-item__v">{trip.vehicle.brand} {trip.vehicle.model}</span>
                </div>
              )}
              {trip.vehicle.color && (
                <div className="trk-detail-info-item">
                  <span style={{ fontSize: 13 }}>🎨</span>
                  <span className="trk-detail-info-item__k">Couleur</span>
                  <span className="trk-detail-info-item__v">{trip.vehicle.color}</span>
                </div>
              )}
              {trip.vehicle.type && (
                <div className="trk-detail-info-item">
                  <span style={{ fontSize: 13 }}>🚌</span>
                  <span className="trk-detail-info-item__k">Type</span>
                  <span className="trk-detail-info-item__v">{trip.vehicle.type}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active incident */}
        {hasIncident && trip.incident && (
          <div className="trk-detail-card trk-detail-incident">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <AppIcon icon={AlertTriangle} size={14} color="#E53935" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#E53935' }}>
                {trip.incident.type === 'panne' ? 'Panne' : trip.incident.type === 'urgence' ? 'Urgence' : 'Autre incident'}
              </span>
              {trip.incident.reportedAt && (
                <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 'auto' }}>à {trip.incident.reportedAt}</span>
              )}
            </div>
            {trip.incident.notes && <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 8px', lineHeight: 1.5 }}>{trip.incident.notes}</p>}
            <button type="button" className="trk-detail-resolve-btn" onClick={() => onResolveIncident(trip.id)}>
              ✓ Marquer comme résolu
            </button>
          </div>
        )}

        {/* Modération */}
        {trip.isFlagged && trip.moderationNote && (
          <div style={{ padding: '10px 12px', background: '#F3E8FF', border: '1.5px solid #DDD6FE', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <AppIcon icon={Flag} size={13} color="#7C3AED" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED' }}>Trajet signalé</span>
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{trip.moderationNote}</p>
          </div>
        )}

        {/* Passengers */}
        <div className="trk-detail-card">
          <div className="trk-detail-card__label">
            Points de prise en charge &amp; dépose
            {loadingDetail && <span style={{ marginLeft: 6, display: 'inline-flex' }}><AppIcon icon={Loader} size={12} color="#9CA3AF" /></span>}
          </div>
          {!trip.passengers || trip.passengers.length === 0 ? (
            <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', padding: '12px 0' }}>
              {loadingDetail ? 'Chargement des passagers…' : 'Aucun passager enregistré'}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {trip.passengers.map((p) => <PassengerCard key={p.id} p={p} />)}
            </div>
          )}
        </div>

        {/* Timeline */}
        {trip.timeline && trip.timeline.length > 0 ? (
          <div className="trk-detail-card">
            <div className="trk-detail-card__label">Chronologie</div>
            <div className="trk-timeline">
              {trip.timeline.map((evt, i) => (
                <div key={i}>
                  <div className="trk-timeline__step trk-timeline__step--done">
                    <div className="trk-timeline__dot trk-timeline__dot--done" />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{evt.event}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                        {/^\d{2}:\d{2}/.test(evt.timestamp) ? evt.timestamp : fmtFull(evt.timestamp)}
                        {evt.note && ` — ${evt.note}`}
                      </div>
                    </div>
                  </div>
                  {i < trip.timeline!.length - 1 && <div className="trk-timeline__connector" />}
                </div>
              ))}
            </div>
          </div>
        ) : (trip.startedAt || trip.scheduledAt) ? (
          // Fallback timeline
          <div className="trk-detail-card">
            <div className="trk-detail-card__label">Chronologie</div>
            <div className="trk-timeline">
              <div className="trk-timeline__step trk-timeline__step--done">
                <div className="trk-timeline__dot trk-timeline__dot--done" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Publication</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>Trajet publié par le conducteur</div>
                </div>
              </div>
              <div className="trk-timeline__connector" />
              <div className={`trk-timeline__step${trip.startedAt ? ' trk-timeline__step--done' : trip.status === 'retard' ? ' trk-timeline__step--delayed' : ''}`}>
                <div className={`trk-timeline__dot${trip.startedAt ? ' trk-timeline__dot--done' : trip.status === 'retard' ? ' trk-timeline__dot--delayed' : ''}`} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                    Départ {trip.startedAt ? `à ${trip.startedAt}` : trip.scheduledAt ? `prévu à ${fmtTime(trip.scheduledAt)}` : ''}
                  </div>
                  <div style={{ fontSize: 11, color: trip.status === 'retard' ? '#E53935' : '#9CA3AF' }}>
                    {trip.startedAt ? 'Trajet en cours' : trip.status === 'retard' ? `Retard de ${trip.delayMinutes} min` : 'En attente du départ'}
                  </div>
                </div>
              </div>
              <div className="trk-timeline__connector" />
              <div className={`trk-timeline__step${trip.status === 'terminé' ? ' trk-timeline__step--done' : ''}`}>
                <div className={`trk-timeline__dot${trip.status === 'terminé' ? ' trk-timeline__dot--done' : ''}`} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Arrivée</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>Estimée à {trip.estimatedArrival}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Action footer ─────────────────────────────────────────────────────── */}
      <div className="trk-detail-footer">
        <button
          type="button"
          className="trk-detail-footer__btn trk-detail-footer__btn--alert"
          onClick={() => onAlertDriver(trip)}
        >
          <AppIcon icon={MessageSquare} size={14} color="#fff" />
          Notifier conducteur
        </button>
        {!hasIncident && trip.status !== 'terminé' && trip.status !== 'annulé' && (
          <button
            type="button"
            className="trk-detail-footer__btn trk-detail-footer__btn--incident"
            onClick={() => onReportIncident(trip.id)}
          >
            <AppIcon icon={AlertTriangle} size={14} color="#E53935" />
            Signaler incident
          </button>
        )}
        <button
          type="button"
          className="trk-detail-footer__btn"
          onClick={() => setFlagOpen(true)}
          style={{
            background: trip.isFlagged ? '#F3E8FF' : '#F9FAFB',
            color:      trip.isFlagged ? '#7C3AED' : '#6B7280',
            border:     `1.5px solid ${trip.isFlagged ? '#DDD6FE' : '#E5E7EB'}`,
          }}
          title={trip.isFlagged ? 'Retirer le signalement' : 'Signaler'}
        >
          <AppIcon icon={Flag} size={14} color={trip.isFlagged ? '#7C3AED' : '#6B7280'} />
        </button>
      </div>

      {/* Flag modal */}
      {flagOpen && (
        <FlagModal
          tripId={trip.id}
          current={trip.isFlagged ?? false}
          onClose={() => setFlagOpen(false)}
          onSave={(flag, note) => onFlagTrip(trip.id, flag, note || undefined)}
        />
      )}
    </div>
  );
}
