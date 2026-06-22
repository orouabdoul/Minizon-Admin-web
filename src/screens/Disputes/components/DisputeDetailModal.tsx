import { DetailModal, DetailSection, DetailRow } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }   from '../../../components/DataDisplay/Badge/Badge';
import type { Dispute, DisputeStatus, DisputePriority, DisputeType } from '../../../models/dispute.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

const STATUS_VARIANT: Record<DisputeStatus, BadgeVariant> = {
  Ouvert:    'error',
  'En cours':'warning',
  Résolu:    'primary',
  Clôturé:   'neutral',
};
const PRIORITY_VARIANT: Record<DisputePriority, BadgeVariant> = {
  Critique: 'error',
  Élevée:   'warning',
  Moyenne:  'amber',
  Faible:   'lime',
};
const TYPE_VARIANT: Record<DisputeType, BadgeVariant> = {
  Paiement:     'info',
  Annulation:   'amber',
  Comportement: 'error',
  Retard:       'warning',
  Autre:        'neutral',
};

interface Props { dispute: Dispute; onClose: () => void; }

export function DisputeDetailModal({ dispute: d, onClose }: Props) {
  return (
    <DetailModal title="Détail Litige" onClose={onClose} accentColor="#E53935">
      {/* Hero */}
      <div className="detail-hero" style={{ background: 'rgba(229,57,53,0.05)', borderRadius: 12, flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#111827' }}>{d.disputeId}</span>
          <Badge label={d.priority} variant={PRIORITY_VARIANT[d.priority]} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <Badge label={d.type}   variant={TYPE_VARIANT[d.type]} />
          <Badge label={d.status} variant={STATUS_VARIANT[d.status]} />
        </div>
      </div>

      {/* Description */}
      <DetailSection title="Description">
        <p style={{ fontSize: 13, color: '#374151', lineHeight: '20px', margin: 0 }}>{d.motif}</p>
      </DetailSection>

      {/* Informations */}
      <DetailSection title="Informations">
        <DetailRow label="Réservation">
          <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{d.reservationId}</span>
        </DetailRow>
        <DetailRow label="Trajet">
          <span>{d.trajet}</span>
        </DetailRow>
        <DetailRow label="Montant concerné">
          <span style={{ fontWeight: 700, color: '#E53935' }}>{d.amount}</span>
        </DetailRow>
        <DetailRow label="Date déclaration"><span>{d.createdAt}</span></DetailRow>
      </DetailSection>

      {/* Parties */}
      {(d.passenger || d.conductor) && (
        <DetailSection title="Parties concernées">
          {d.passenger && (
            <DetailRow label="Passager">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {d.passenger.avatar && (
                  <img src={d.passenger.avatar} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                )}
                {d.passenger.name}
              </span>
            </DetailRow>
          )}
          {d.conductor && (
            <DetailRow label="Conducteur">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {d.conductor.avatar && (
                  <img src={d.conductor.avatar} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                )}
                {d.conductor.name}
              </span>
            </DetailRow>
          )}
        </DetailSection>
      )}

      {/* Statut */}
      <DetailSection title="Statut actuel">
        <DetailRow label="Priorité">
          <Badge label={d.priority} variant={PRIORITY_VARIANT[d.priority]} />
        </DetailRow>
        <DetailRow label="Statut">
          <Badge label={d.status} variant={STATUS_VARIANT[d.status]} />
        </DetailRow>
        <DetailRow label="Type">
          <Badge label={d.type} variant={TYPE_VARIANT[d.type]} />
        </DetailRow>
      </DetailSection>
    </DetailModal>
  );
}
