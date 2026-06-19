import { DetailModal, DetailSection, DetailRow, DetailBar } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }    from '../../../components/DataDisplay/Badge/Badge';
import type { PlatformUser } from '../../../models/user.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';
import type { PlatformUserStatus, PlatformUserVerification } from '../../../models/user.model';

const STATUS_VARIANT: Record<PlatformUserStatus, BadgeVariant> = {
  Actif:    'primary',
  Inactif:  'neutral',
  Suspendu: 'error',
};
const VERIF_VARIANT: Record<PlatformUserVerification, BadgeVariant> = {
  'Vérifié':    'primary',
  'En attente': 'pending',
  'Rejeté':     'error',
};

interface Props { user: PlatformUser; onClose: () => void; }

export function UserDetailModal({ user, onClose }: Props) {
  return (
    <DetailModal title="Détail Utilisateur" onClose={onClose} accentColor="#2563EB">
      {/* Hero */}
      <div className="detail-hero" style={{ background: 'rgba(37,99,235,0.06)' }}>
        <img src={user.avatar} alt={user.name} className="detail-hero__avatar" />
        <div>
          <p className="detail-hero__name">{user.name}</p>
          <p className="detail-hero__sub">{user.phone}</p>
          <div className="detail-hero__badge">
            <Badge label={user.type} variant={user.type === 'Conducteur' ? 'info' : 'purple'} />
          </div>
        </div>
      </div>

      {/* Profil */}
      <DetailSection title="Profil">
        <DetailRow label="Type">
          <Badge label={user.type} variant={user.type === 'Conducteur' ? 'info' : 'purple'} />
        </DetailRow>
        <DetailRow label="Statut">
          <Badge label={user.status} variant={STATUS_VARIANT[user.status]} />
        </DetailRow>
        <DetailRow label="Vérification">
          <Badge label={user.verification} variant={VERIF_VARIANT[user.verification]} />
        </DetailRow>
      </DetailSection>

      {/* Activité */}
      <DetailSection title="Activité">
        <DetailRow label="Dernière activité">
          <span>{user.lastActivity}</span>
        </DetailRow>
        <DetailRow label="Fiabilité compte">
          <span />
        </DetailRow>
        <DetailBar value={user.verification === 'Vérifié' ? 90 : user.verification === 'En attente' ? 50 : 20} color="#2563EB" />
      </DetailSection>
    </DetailModal>
  );
}
