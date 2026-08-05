import { RefreshCw, Loader, Zap } from 'lucide-react';
import { AppIcon }   from '../../../components/Common/AppIcon';
import { DetailModal, DetailSection, DetailRow, DetailTimeline } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge }     from '../../../components/DataDisplay/Badge/Badge';
import type { Payment, PaymentTxStatus } from '../../../models/payment.model';
import type { BadgeVariant }             from '../../../components/DataDisplay/Badge/Badge';

const STATUS_VARIANT: Record<PaymentTxStatus, BadgeVariant> = {
  'En attente': 'pending',
  'Sécurisé':   'info',
  'Libéré':     'primary',
  'Échoué':     'error',
  'Remboursé':  'neutral',
};

interface Props {
  payment:        Payment;
  onClose:        () => void;
  onRefund:       (id: string) => void;
  onSyncOne:      (id: string) => void;
  loadingId:      string | null;
  detailLoading?: boolean;
  syncOneLoading: boolean;
}

export function PaymentDetailModal({
  payment: p, onClose, onRefund, onSyncOne,
  loadingId, detailLoading, syncOneLoading,
}: Props) {
  const busy        = loadingId === p.id;
  const isPending   = p.status === 'En attente';

  return (
    <DetailModal title="Détail Transaction" onClose={onClose} accentColor="#2563EB">
      {detailLoading && (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#9CA3AF', padding: '8px 0' }}>Chargement…</p>
      )}

      {/* Hero montant */}
      <div className="detail-hero" style={{ background: 'rgba(37,99,235,0.06)', borderRadius: 12, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{p.amount}</span>
        <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'monospace' }}>{p.paymentId}</span>
        <div style={{ marginTop: 4, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Badge label={p.status} variant={STATUS_VARIANT[p.status]} />

          {/* Vérifier chez FedaPay — visible uniquement si En attente */}
          {isPending && (
            <button
              type="button"
              disabled={syncOneLoading}
              onClick={() => onSyncOne(p.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', border: '1px solid #2563EB',
                borderRadius: 6, background: syncOneLoading ? '#F9FAFB' : '#EFF6FF',
                color: '#2563EB', fontSize: 12, fontWeight: 600,
                cursor: syncOneLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}
            >
              {syncOneLoading
                ? <AppIcon icon={Loader} size={12} color="#2563EB" />
                : <AppIcon icon={Zap} size={12} color="#2563EB" />}
              {syncOneLoading ? 'Vérification…' : 'Vérifier chez FedaPay'}
            </button>
          )}

          {p.canRefund && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onRefund(p.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', border: '1px solid #E53935',
                borderRadius: 6, background: busy ? '#F9FAFB' : '#FEF2F2',
                color: '#E53935', fontSize: 12, fontWeight: 600,
                cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}
            >
              <AppIcon icon={RefreshCw} size={12} color="#E53935" />
              {busy ? 'Traitement…' : 'Rembourser'}
            </button>
          )}
        </div>

        {/* FedaPay raw status — show if available and different from display status */}
        {p.fedapayStatus && (
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
            Statut FedaPay : <span style={{ fontFamily: 'monospace', color: '#374151' }}>{p.fedapayStatus}</span>
          </div>
        )}
      </div>

      {/* Route */}
      <div className="detail-route" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.15)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', flex: 1 }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>Départ</span>
          <span className="detail-route__city">{p.from}</span>
        </div>
        <div className="detail-route__arrow"><div className="detail-route__line" /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', flex: 1 }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>Arrivée</span>
          <span className="detail-route__city">{p.to}</span>
        </div>
      </div>

      {/* Informations */}
      <DetailSection title="Informations">
        <DetailRow label="Réf. paiement">
          <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{p.reference}</span>
        </DetailRow>
        {p.providerReference && (
          <DetailRow label="Réf. opérateur">
            <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{p.providerReference}</span>
          </DetailRow>
        )}
        <DetailRow label="Réservation">
          <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{p.reservationId}</span>
        </DetailRow>
        <DetailRow label="Méthode">
          <span style={{ fontWeight: 600 }}>{p.method}</span>
        </DetailRow>
        <DetailRow label="Date"><span>{p.createdAt}</span></DetailRow>
      </DetailSection>

      {/* Parties */}
      <DetailSection title="Parties concernées">
        <DetailRow label="Passager">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={p.passengerAvatar} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
            <span>
              {p.passengerName}
              {p.passengerPhone && <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 6 }}>{p.passengerPhone}</span>}
            </span>
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
        <DetailRow label="Commission">
          <span style={{ color: '#E53935' }}>-{p.commission}</span>
        </DetailRow>
        <DetailRow label="Net conducteur">
          <span style={{ fontWeight: 700, color: '#00A86B' }}>{p.netAmount}</span>
        </DetailRow>
      </DetailSection>

      {/* Timeline */}
      {p.timelineEvents.length > 0 && (
        <DetailSection title="Suivi transaction">
          <DetailTimeline events={p.timelineEvents} />
        </DetailSection>
      )}
    </DetailModal>
  );
}
