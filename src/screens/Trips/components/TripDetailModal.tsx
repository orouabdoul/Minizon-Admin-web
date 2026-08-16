import { ArrowRight } from 'lucide-react';
import { AppIcon }    from '../../../components/Common/AppIcon';
import { DetailModal, DetailSection, DetailRow, DetailTimeline } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }      from '../../../components/DataDisplay/Badge/Badge';
import type { Trip, TripStatus, TripPassenger } from '../../../models/trip.model';
import type { ApiTripStatus }    from '../../../services/trip_service';
import type { BadgeVariant }     from '../../../components/DataDisplay/Badge/Badge';

const STATUS_VARIANT: Record<TripStatus, BadgeVariant> = {
  Actif:    'primary',
  Terminé:  'success',
  Annulé:   'error',
  Signalé:  'warning',
};

const STATUS_ACTIONS: { api: ApiTripStatus; label: string; color: string }[] = [
  { api: 'active',    label: 'Activer',    color: '#7C3AED' },
  { api: 'completed', label: 'Terminer',   color: '#2563EB' },
  { api: 'cancelled', label: 'Annuler',    color: '#E53935' },
  { api: 'pending',   label: 'En attente', color: '#F4B400' },
];

interface Props {
  trip:            Trip;
  onClose:         () => void;
  detailLoading?:  boolean;
  onUpdateStatus:  (id: string, status: ApiTripStatus) => void;
}

function PassengerRow({ p }: { p: TripPassenger }) {
  const isPending = p.status === 'pending';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 8,
      background: '#F9FAFB', marginBottom: 6,
    }}>
      <img
        src={p.avatar}
        alt={p.name ?? 'passager'}
        style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {p.name ?? 'Passager'}
        </p>
        {p.calculatedPriceFmt && (
          <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>
            {p.calculatedPriceFmt}
            {p.seatsBooked && p.seatsBooked > 1 ? ` · ${p.seatsBooked} places` : ''}
            {p.distanceKm ? ` · ${p.distanceKm} km` : ''}
          </p>
        )}
      </div>
      <span style={{
        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
        background: isPending ? '#FFFBEB' : '#F0FDF4',
        color: isPending ? '#D97706' : '#16A34A',
        border: `1px solid ${isPending ? '#FDE68A' : '#BBF7D0'}`,
        flexShrink: 0,
      }}>
        {isPending ? 'En attente' : 'Accepté'}
      </span>
    </div>
  );
}

export function TripDetailModal({ trip: t, onClose, detailLoading, onUpdateStatus }: Props) {
  const isDone     = t.status === 'Terminé';
  const isCanceled = t.status === 'Annulé';

  const timeline = [
    { label: 'Trajet créé',    time: `${t.date} à ${t.time}`,                done: true              },
    { label: 'Départ',         time: t.from,                                  done: true              },
    { label: 'En route',       time: `${t.seatsBooked}/${t.seats} passagers`, done: isDone            },
    { label: 'Arrivée',        time: t.to,                                    done: isDone            },
    {
      label: isCanceled ? 'Annulé' : 'Terminé',
      time:  isCanceled ? '—' : 'Trajet complété',
      done:  isDone || isCanceled,
    },
  ];

  return (
    <DetailModal title="Détail Trajet" onClose={onClose} accentColor="#F97316">
      {detailLoading && (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#9CA3AF', padding: '8px 0' }}>Chargement…</p>
      )}

      {/* Route hero */}
      <div className="detail-route" style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.15)' }}>
        <span className="detail-route__city">{t.from}</span>
        <div className="detail-route__arrow">
          <div className="detail-route__line" />
          <AppIcon icon={ArrowRight} size={16} color="#F97316" />
        </div>
        <span className="detail-route__city">{t.to}</span>
      </div>

      {/* Informations */}
      <DetailSection title="Informations">
        <DetailRow label="ID Trajet"><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{t.tripId}</span></DetailRow>
        <DetailRow label="Conducteur"><span>{t.driverName}</span></DetailRow>
        <DetailRow label="Note conducteur">
          <span>★ {t.driverRating} ({t.driverReviews} avis)</span>
        </DetailRow>
        <DetailRow label="Date"><span>{t.date}</span></DetailRow>
        <DetailRow label="Heure"><span>{t.time}</span></DetailRow>
        <DetailRow label="Prix / place"><span>{t.pricePerSeat}</span></DetailRow>
        <DetailRow label="Statut">
          <Badge label={t.status} variant={STATUS_VARIANT[t.status]} />
        </DetailRow>
      </DetailSection>

      {/* Occupation */}
      <DetailSection title="Occupation">
        <DetailRow label="Places totales"><span>{t.seats}</span></DetailRow>
        <DetailRow label="Places réservées"><span>{t.seatsBooked}</span></DetailRow>
        {t.bookingsCount > 0 && (
          <DetailRow label="Réservations"><span>{t.bookingsCount}</span></DetailRow>
        )}
        <DetailRow label="Revenus">
          <span style={{ fontWeight: 700, color: '#7C3AED' }}>{t.revenue}</span>
        </DetailRow>
      </DetailSection>

      {/* Passagers */}
      {t.passengers.length > 0 && (
        <DetailSection title={`Passagers (${t.passengers.length})`}>
          <div style={{ paddingTop: 4 }}>
            {t.passengers.map((p) => (
              <PassengerRow key={p.bookingUuid ?? p.id} p={p} />
            ))}
          </div>
        </DetailSection>
      )}

      {/* Changer le statut */}
      <DetailSection title="Changer le statut">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
          {STATUS_ACTIONS.map(({ api, label, color }) => (
            <button
              key={api}
              type="button"
              onClick={() => onUpdateStatus(t.id, api)}
              style={{
                padding: '6px 14px', borderRadius: 6,
                border: `1px solid ${color}`, background: 'white',
                color, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </DetailSection>

      {/* Timeline */}
      <DetailSection title="Déroulement">
        <DetailTimeline events={timeline} />
      </DetailSection>
    </DetailModal>
  );
}
