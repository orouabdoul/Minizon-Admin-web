import { DetailModal, DetailSection, DetailRow, DetailBar } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }    from '../../../components/DataDisplay/Badge/Badge';
import { MapPin, Phone, Mail, Star } from 'lucide-react';
import { AppIcon }  from '../../../components/Common/AppIcon';
import type { Passenger, PassengerStatus, RiskLevel } from '../../../models/passenger.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

const STATUS_VARIANT: Record<PassengerStatus, BadgeVariant> = {
  Actif:    'primary',
  Inactif:  'neutral',
  Suspendu: 'warning',
};
const RISK_VARIANT: Record<RiskLevel, BadgeVariant> = {
  Faible: 'lime',
  Moyen:  'amber',
  Élevé:  'error',
};

interface Props { passenger: Passenger; onClose: () => void; }

export function PassengerDetailModal({ passenger: p, onClose }: Props) {
  return (
    <DetailModal title="Détail Passager" onClose={onClose} accentColor="#A855F7">
      {/* Hero */}
      <div className="detail-hero" style={{ background: 'rgba(168,85,247,0.06)' }}>
        <img src="https://placehold.co/52x52" alt={p.name} className="detail-hero__avatar" style={{ borderColor: '#A855F7' }} />
        <div>
          <p className="detail-hero__name">{p.name}</p>
          <p className="detail-hero__sub">{p.passengerId}</p>
          <div className="detail-hero__badge">
            <Badge label={p.status} variant={STATUS_VARIANT[p.status]} />
          </div>
        </div>
      </div>

      {/* Contact & Localisation */}
      <DetailSection title="Contact &amp; Localisation">
        <DetailRow label="Téléphone">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AppIcon icon={Phone} size={13} color="#A855F7" />{p.phone}
          </span>
        </DetailRow>
        <DetailRow label="Email">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AppIcon icon={Mail} size={13} color="#A855F7" />{p.email}
          </span>
        </DetailRow>
        <DetailRow label="Ville">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AppIcon icon={MapPin} size={13} color="#A855F7" />{p.city}
          </span>
        </DetailRow>
        <DetailRow label="Inscription"><span>{p.createdAt}</span></DetailRow>
      </DetailSection>

      {/* Statistiques */}
      <DetailSection title="Statistiques">
        <div className="detail-stats">
          <div className="detail-stat">
            <span className="detail-stat__value">{p.reservations}</span>
            <span className="detail-stat__label">Réservations</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat__value">{p.spending}</span>
            <span className="detail-stat__label">Dépenses</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat__value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <AppIcon icon={Star} size={14} color="#F4B400" />{p.rating}
            </span>
            <span className="detail-stat__label">Note</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat__value">{p.trustScore}%</span>
            <span className="detail-stat__label">Confiance</span>
          </div>
        </div>
        <DetailRow label="Score de confiance"><span /></DetailRow>
        <DetailBar value={p.trustScore} color="#A855F7" />
      </DetailSection>

      {/* Statut */}
      <DetailSection title="Statut &amp; Risque">
        <DetailRow label="Statut">
          <Badge label={p.status} variant={STATUS_VARIANT[p.status]} />
        </DetailRow>
        <DetailRow label="Niveau de risque">
          <Badge label={p.riskLevel} variant={RISK_VARIANT[p.riskLevel]} />
        </DetailRow>
        <DetailRow label="Activité récente"><span>{p.lastActivity}</span></DetailRow>
        <DetailRow label="Présence">
          <Badge label={p.activityStatus} variant={p.activityStatus === 'En ligne' ? 'primary' : 'neutral'} />
        </DetailRow>
      </DetailSection>
    </DetailModal>
  );
}
