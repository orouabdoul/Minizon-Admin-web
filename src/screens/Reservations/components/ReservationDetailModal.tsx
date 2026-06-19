import { DetailModal, DetailSection, DetailRow, DetailTimeline } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }   from '../../../components/DataDisplay/Badge/Badge';
import { Star }    from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import type { Reservation, ReservationStatus, PaymentStatus } from '../../../models/reservation.model';
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

interface Props { reservation: Reservation; onClose: () => void; }

export function ReservationDetailModal({ reservation: r, onClose }: Props) {
  return (
    <DetailModal title="Détail Réservation" onClose={onClose} accentColor="#00A86B">
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

      {/* Timeline */}
      <DetailSection title="Timeline">
        <DetailTimeline events={r.timelineEvents} />
      </DetailSection>
    </DetailModal>
  );
}
