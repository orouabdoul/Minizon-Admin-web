import { Trash2 } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import { DetailModal, DetailSection, DetailRow, DetailTimeline } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }   from '../../../components/DataDisplay/Badge/Badge';
import { Star }    from 'lucide-react';
import type { Reservation, ReservationStatus, PaymentStatus, ApiReservationStatus } from '../../../models/reservation.model';
import { API_STATUS_LABELS } from '../../../models/reservation.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

const STATUS_VARIANT: Record<ReservationStatus, BadgeVariant> = {
  Confirmée:   'primary',
  'En attente':'pending',
  Annulée:     'error',
  Terminée:    'success',
};
const PAYMENT_VARIANT: Record<PaymentStatus, BadgeVariant> = {
  Payé:         'primary',
  'En attente': 'pending',
  Échoué:       'error',
  Remboursé:    'neutral',
};

const STATUS_ACTIONS: { api: ApiReservationStatus; color: string }[] = [
  { api: 'accepted',  color: '#00A86B' },
  { api: 'rejected',  color: '#E53935' },
  { api: 'pending',   color: '#F4B400' },
  { api: 'cancelled', color: '#6B7280' },
];

interface Props {
  reservation:    Reservation;
  onClose:        () => void;
  detailLoading?: boolean;
  onUpdateStatus: (id: string, status: ApiReservationStatus) => void;
  onDelete:       (id: string) => void;
}

export function ReservationDetailModal({ reservation: r, onClose, detailLoading, onUpdateStatus, onDelete }: Props) {
  return (
    <DetailModal title="Détail Réservation" onClose={onClose} accentColor="#00A86B">
      {detailLoading && (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#9CA3AF', padding: '8px 0' }}>Chargement…</p>
      )}

      {/* Route hero */}
      <div className="detail-route" style={{ background: 'rgba(0,168,107,0.04)', border: '1px solid rgba(0,168,107,0.15)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', flex: 1 }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>Départ</span>
          <span className="detail-route__city">{r.from}</span>
        </div>
        <div className="detail-route__arrow">
          <div className="detail-route__line" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', flex: 1 }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>Arrivée</span>
          <span className="detail-route__city">{r.to}</span>
        </div>
      </div>

      {/* Informations Générales */}
      <DetailSection title="Informations Générales">
        <DetailRow label="ID">
          <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600 }}>{r.reservationId}</span>
        </DetailRow>
        <DetailRow label="Date création"><span>{r.createdAt}</span></DetailRow>
        <DetailRow label="Date trajet"><span>{r.date} à {r.time}</span></DetailRow>
        <DetailRow label="Places réservées"><span>{r.seats}</span></DetailRow>
        <DetailRow label="Statut">
          <Badge label={r.status} variant={STATUS_VARIANT[r.status]} />
        </DetailRow>
      </DetailSection>

      {/* Passager */}
      <DetailSection title="Passager">
        <div className="detail-hero" style={{ padding: '10px 0', background: 'transparent' }}>
          <img src={r.passengerAvatar} alt={r.passengerName} className="detail-hero__avatar" style={{ width: 40, height: 40, borderColor: '#00A86B' }} />
          <div>
            <p className="detail-hero__name">{r.passengerName}</p>
            <div className="detail-hero__badge">
              <Badge label={r.passengerVerified ? 'Vérifié' : 'Non vérifié'} variant={r.passengerVerified ? 'primary' : 'neutral'} />
            </div>
          </div>
        </div>
      </DetailSection>

      {/* Conducteur */}
      <DetailSection title="Conducteur">
        <div className="detail-hero" style={{ padding: '10px 0', background: 'transparent' }}>
          <img src={r.driverAvatar} alt={r.driverName} className="detail-hero__avatar" style={{ width: 40, height: 40, borderColor: '#F4B400' }} />
          <div>
            <p className="detail-hero__name">{r.driverName}</p>
            <p className="detail-hero__sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <AppIcon icon={Star} size={12} color="#F4B400" />
              {r.driverRating}
            </p>
          </div>
        </div>
      </DetailSection>

      {/* Paiement */}
      <DetailSection title="Paiement">
        <DetailRow label="Montant">
          <span style={{ fontWeight: 700, color: '#111827' }}>{r.amount}</span>
        </DetailRow>
        <DetailRow label="Statut paiement">
          <Badge label={r.paymentStatus} variant={PAYMENT_VARIANT[r.paymentStatus]} />
        </DetailRow>
      </DetailSection>

      {/* Changer le statut */}
      <DetailSection title="Changer le statut">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
          {STATUS_ACTIONS.map(({ api, color }) => (
            <button
              key={api}
              type="button"
              onClick={() => onUpdateStatus(r.id, api)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: `1px solid ${color}`,
                background: 'white',
                color,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {API_STATUS_LABELS[api]}
            </button>
          ))}
        </div>
      </DetailSection>

      {/* Timeline */}
      <DetailSection title="Timeline">
        <DetailTimeline events={r.timelineEvents} />
      </DetailSection>

      {/* Danger zone */}
      <div style={{ borderTop: '1px solid #FEE2E2', marginTop: 8, paddingTop: 16 }}>
        <button
          type="button"
          onClick={() => onDelete(r.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 6,
            border: '1px solid #E53935', background: '#FEF2F2',
            color: '#DC2626', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            width: '100%', justifyContent: 'center',
          }}
        >
          <AppIcon icon={Trash2} size={14} color="#DC2626" />
          Supprimer la réservation
        </button>
      </div>
    </DetailModal>
  );
}
