import { DetailModal, DetailSection, DetailRow, DetailTimeline } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }   from '../../../components/DataDisplay/Badge/Badge';
import type { Payment, PaymentTxStatus, PaymentMethod } from '../../../models/payment.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

const STATUS_VARIANT: Record<PaymentTxStatus, BadgeVariant> = {
  Succès:       'primary',
  'En attente': 'pending',
  Échoué:       'error',
  Remboursé:    'neutral',
};
const METHOD_COLOR: Record<PaymentMethod, string> = {
  'Mobile Money':   '#00A86B',
  'Carte bancaire': '#2563EB',
  'Virement':       '#6B7280',
  'Cash':           '#F4B400',
};

interface Props { payment: Payment; onClose: () => void; }

export function PaymentDetailModal({ payment: p, onClose }: Props) {
  const timeline = [
    { label: 'Transaction initiée', time: `${p.date} à ${p.time}`, done: true },
    { label: 'Vérification opérateur', time: 'Traitement en cours', done: p.status !== 'En attente' },
    { label: p.status === 'Remboursé' ? 'Remboursement effectué' : p.status === 'Succès' ? 'Paiement confirmé' : p.status === 'Échoué' ? 'Transaction échouée' : 'En attente', time: p.status === 'Succès' ? 'Confirmation reçue' : '—', done: p.status === 'Succès' || p.status === 'Remboursé' || p.status === 'Échoué' },
  ];

  return (
    <DetailModal title="Détail Transaction" onClose={onClose} accentColor="#2563EB">
      {/* Hero montant */}
      <div className="detail-hero" style={{ background: 'rgba(37,99,235,0.06)', borderRadius: 12, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{p.amount}</span>
        <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'monospace' }}>{p.transactionId}</span>
        <div style={{ marginTop: 4 }}>
          <Badge label={p.status} variant={STATUS_VARIANT[p.status]} />
        </div>
      </div>

      {/* Informations */}
      <DetailSection title="Informations">
        <DetailRow label="Référence">
          <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{p.reference}</span>
        </DetailRow>
        <DetailRow label="Réservation">
          <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{p.reservationId}</span>
        </DetailRow>
        <DetailRow label="Méthode">
          <span style={{ color: METHOD_COLOR[p.method], fontWeight: 600 }}>{p.method}</span>
        </DetailRow>
        <DetailRow label="Date"><span>{p.date} à {p.time}</span></DetailRow>
      </DetailSection>

      {/* Parties */}
      <DetailSection title="Parties concernées">
        <DetailRow label="Passager">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={p.passengerAvatar} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
            {p.passengerName}
          </span>
        </DetailRow>
        <DetailRow label="Conducteur">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={p.driverAvatar} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
            {p.driverName}
          </span>
        </DetailRow>
      </DetailSection>

      {/* Détail financier */}
      <DetailSection title="Détail financier">
        <DetailRow label="Montant brut">
          <span style={{ fontWeight: 700 }}>{p.amount}</span>
        </DetailRow>
        <DetailRow label="Frais plateforme">
          <span style={{ color: '#E53935' }}>-{p.fee}</span>
        </DetailRow>
        <DetailRow label="Net conducteur">
          <span style={{ fontWeight: 700, color: '#00A86B' }}>{p.net}</span>
        </DetailRow>
      </DetailSection>

      {/* Timeline */}
      <DetailSection title="Suivi transaction">
        <DetailTimeline events={timeline} />
      </DetailSection>
    </DetailModal>
  );
}
