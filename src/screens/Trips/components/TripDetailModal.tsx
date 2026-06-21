import { ArrowRight } from 'lucide-react';
import { AppIcon }    from '../../../components/Common/AppIcon';
import { DetailModal, DetailSection, DetailRow, DetailTimeline } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }      from '../../../components/DataDisplay/Badge/Badge';
import type { Trip, TripStatus } from '../../../models/trip.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

const STATUS_VARIANT: Record<TripStatus, BadgeVariant> = {
  Actif:    'primary',
  Terminé:  'success',
  Annulé:   'error',
  Signalé:  'warning',
};

interface Props { trip: Trip; onClose: () => void; detailLoading?: boolean; }

export function TripDetailModal({ trip: t, onClose, detailLoading }: Props) {
  const isDone     = t.status === 'Terminé';
  const isCanceled = t.status === 'Annulé';

  const timeline = [
    { label: 'Trajet créé',         time: `${t.date} à ${t.time}`,               done: true      },
    { label: 'Départ',              time: t.from,                                 done: true      },
    { label: 'En route',            time: `${t.seatsBooked}/${t.seats} passagers`,done: isDone    },
    { label: 'Arrivée',             time: t.to,                                   done: isDone    },
    { label: isCanceled ? 'Annulé' : 'Terminé',
                                    time: isCanceled ? '—' : 'Trajet complété',   done: isDone || isCanceled },
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
        <DetailRow label="ID Trajet"><span>{t.tripId}</span></DetailRow>
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
        <DetailRow label="Revenus"><span style={{ fontWeight: 700, color: '#00A86B' }}>{t.revenue}</span></DetailRow>
        <DetailRow label="Passagers">
          <div className="detail-pax">
            <div className="detail-pax-avatars">
              {t.passengers.map((p) => (
                <img key={p.id} src={p.avatar} alt="passager" className="detail-pax-avatar" />
              ))}
            </div>
            <span className="detail-pax-count">{t.seatsBooked}/{t.seats}</span>
          </div>
        </DetailRow>
      </DetailSection>

      {/* Timeline */}
      <DetailSection title="Déroulement">
        <DetailTimeline events={timeline} />
      </DetailSection>
    </DetailModal>
  );
}
