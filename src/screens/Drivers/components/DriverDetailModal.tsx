import { DetailModal, DetailSection, DetailRow, DetailBar, DetailTimeline } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }    from '../../../components/DataDisplay/Badge/Badge';
import type { Driver, DriverStatus, DocumentStatus } from '../../../models/driver.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

const STATUS_VARIANT: Record<DriverStatus, BadgeVariant> = {
  'En attente': 'amber',
  'Vérifié':    'emerald',
  'Rejeté':     'error',
  'Suspendu':   'neutral',
};
const DOC_VARIANT: Record<DocumentStatus, BadgeVariant> = {
  ok:       'emerald',
  pending:  'amber',
  rejected: 'error',
};
const DOC_LABEL: Record<DocumentStatus, string> = { ok: 'Valide', pending: 'En attente', rejected: 'Rejeté' };

interface Props { driver: Driver; onClose: () => void; }

export function DriverDetailModal({ driver, onClose }: Props) {
  const timeline = [
    { label: 'Inscription',            time: 'Compte créé',         done: true  },
    { label: 'Documents soumis',       time: 'En cours de vérif.',  done: driver.status !== 'En attente' },
    { label: 'Vérification complète',  time: driver.status === 'Vérifié' ? 'Conducteur validé' : 'En attente', done: driver.status === 'Vérifié' },
  ];

  return (
    <DetailModal title="Détail Conducteur" onClose={onClose} accentColor="#00A86B">
      {/* Hero */}
      <div className="detail-hero" style={{ background: 'rgba(0,168,107,0.06)' }}>
        <img src={driver.avatar} alt={driver.name} className="detail-hero__avatar" />
        <div>
          <p className="detail-hero__name">{driver.name}</p>
          <p className="detail-hero__sub">{driver.driverId}</p>
          <div className="detail-hero__badge">
            <Badge label={driver.status} variant={STATUS_VARIANT[driver.status]} />
          </div>
        </div>
      </div>

      {/* Informations */}
      <DetailSection title="Informations">
        <DetailRow label="Téléphone"><span>{driver.phone}</span></DetailRow>
        <DetailRow label="Email"><span>{driver.email}</span></DetailRow>
        <DetailRow label="Véhicule"><span>{driver.vehicle}</span></DetailRow>
        <DetailRow label="Plaque"><span>{driver.plate}</span></DetailRow>
      </DetailSection>

      {/* Documents */}
      <DetailSection title="Documents">
        <DetailRow label="Permis de conduire">
          <Badge label={DOC_LABEL[driver.documents.permis]}     variant={DOC_VARIANT[driver.documents.permis]} />
        </DetailRow>
        <DetailRow label="Carte grise">
          <Badge label={DOC_LABEL[driver.documents.carteGrise]} variant={DOC_VARIANT[driver.documents.carteGrise]} />
        </DetailRow>
        <DetailRow label="Assurance">
          <Badge label={DOC_LABEL[driver.documents.assurance]}  variant={DOC_VARIANT[driver.documents.assurance]} />
        </DetailRow>
      </DetailSection>

      {/* Performance */}
      <DetailSection title="Performance">
        <DetailRow label="Score de validation"><span>{driver.score}%</span></DetailRow>
        <DetailBar value={driver.score} color="#00A86B" />
      </DetailSection>

      {/* Timeline */}
      <DetailSection title="Progression">
        <DetailTimeline events={timeline} />
      </DetailSection>
    </DetailModal>
  );
}
