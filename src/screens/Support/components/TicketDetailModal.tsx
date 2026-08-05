import { CheckSquare, Trash2, Smartphone, Phone, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import { DetailModal, DetailSection, DetailRow } from '../../../components/Overlay/DetailModal/DetailModal';
import { Badge } from '../../../components/DataDisplay/Badge/Badge';
import type { SupportTicket, TicketPriority, TicketStatus, TicketChannel } from '../../../models/support.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

const PRIORITY_VARIANT: Record<TicketPriority, BadgeVariant> = {
  Haute:   'priority-haute',
  Moyenne: 'priority-moyenne',
  Basse:   'priority-basse',
};
const STATUS_VARIANT: Record<TicketStatus, BadgeVariant> = {
  Nouveau:   'ticket-nouveau',
  'En cours':'ticket-encours',
  Résolu:    'ticket-resolu',
  Clôturé:   'neutral',
};
const CHANNEL_ICON: Record<TicketChannel, LucideIcon> = {
  'App Mobile': Smartphone,
  'Téléphone':  Phone,
  'Email':      Mail,
  'Chat':       MessageCircle,
  'Autre':      HelpCircle,
};

interface Props {
  ticket:         SupportTicket;
  onClose:        () => void;
  detailLoading?: boolean;
  onResolve:      (id: string) => void;
  onDelete:       (id: string) => void;
  resolving?:     boolean;
}

export function TicketDetailModal({ ticket: t, onClose, detailLoading, onResolve, onDelete, resolving }: Props) {
  const isOpen    = t.status === 'Nouveau' || t.status === 'En cours';
  const ChannelIcon = CHANNEL_ICON[t.channel] ?? HelpCircle;

  return (
    <DetailModal title="Détail Ticket" onClose={onClose} accentColor="#3B82F6">
      {detailLoading && (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#9CA3AF', padding: '8px 0' }}>Chargement…</p>
      )}

      {/* Hero */}
      <div style={{
        background: 'rgba(59,130,246,0.04)',
        border: '1px solid rgba(59,130,246,0.15)',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <img src={t.userAvatar} alt={t.userName} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #3B82F6' }} />
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0 }}>{t.userName}</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{t.userEmail}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <Badge label={t.priority} variant={PRIORITY_VARIANT[t.priority]} />
            <Badge label={t.status}   variant={STATUS_VARIANT[t.status]}   />
          </div>
        </div>
        <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: '0 0 4px' }}>{t.subject}</p>
        <p style={{ fontSize: 13, color: '#4B5563', margin: 0, lineHeight: 1.5 }}>{t.description}</p>
      </div>

      {/* Informations */}
      <DetailSection title="Informations">
        <DetailRow label="Ticket ID">
          <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600 }}>{t.ticketId}</span>
        </DetailRow>
        <DetailRow label="Canal">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AppIcon icon={ChannelIcon} size={14} color="#3B82F6" />
            <span>{t.channel}</span>
          </div>
        </DetailRow>
        <DetailRow label="Date"><span>{t.date} à {t.time}</span></DetailRow>
        <DetailRow label="Temps écoulé"><span>{t.timeElapsed}</span></DetailRow>
        {t.createdAgo && <DetailRow label="Créé il y a"><span>{t.createdAgo}</span></DetailRow>}
      </DetailSection>

      {/* Agent */}
      {t.agentName && (
        <DetailSection title="Agent assigné">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
            {t.agentAvatar && (
              <img src={t.agentAvatar} alt={t.agentName} style={{ width: 32, height: 32, borderRadius: '50%' }} />
            )}
            <span style={{ fontWeight: 600, color: '#111827' }}>{t.agentName}</span>
          </div>
        </DetailSection>
      )}

      {/* Actions */}
      {isOpen && (
        <DetailSection title="Actions">
          <button
            type="button"
            disabled={resolving}
            onClick={() => onResolve(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
              width: '100%', padding: '9px 16px', borderRadius: 6,
              border: '1px solid #16A34A', background: '#F0FDF4',
              color: '#16A34A', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <AppIcon icon={CheckSquare} size={14} color="#16A34A" />
            {resolving ? 'En cours…' : 'Marquer comme résolu'}
          </button>
        </DetailSection>
      )}

      {/* Danger zone */}
      <div style={{ borderTop: '1px solid #FEE2E2', marginTop: 8, paddingTop: 16 }}>
        <button
          type="button"
          onClick={() => onDelete(t.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
            width: '100%', padding: '8px 16px', borderRadius: 6,
            border: '1px solid #E53935', background: '#FEF2F2',
            color: '#DC2626', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <AppIcon icon={Trash2} size={14} color="#DC2626" />
          Supprimer le ticket
        </button>
      </div>
    </DetailModal>
  );
}
