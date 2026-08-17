import {
  AlertTriangle, UserCheck, CreditCard, AlertCircle, Car,
  CheckCircle, ExternalLink, Bell,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppIcon }  from '../../../components/Common/AppIcon';
import { Badge }    from '../../../components/DataDisplay/Badge/Badge';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';
import type { Notification, NotifType, NotifPriority, NotifStatus } from '../../../models/notification.model';

interface NotificationDetailProps {
  notification: Notification | null;
  loadingId:    string | null;
  onHandle:     (id: string) => void;
}

const TYPE_CONFIG: Record<NotifType, { icon: LucideIcon; color: string; bg: string; label: string }> = {
  system:         { icon: AlertTriangle, color: '#E53935', bg: 'rgba(229,57,53,0.10)',   label: 'Système'        },
  user:           { icon: UserCheck,     color: '#1A5FB4', bg: 'rgba(26,95,180,0.10)',   label: 'Utilisateur'    },
  payment:        { icon: CreditCard,    color: '#1A5FB4', bg: 'rgba(26,95,180,0.10)',   label: 'Paiement'       },
  dispute:        { icon: AlertCircle,   color: '#F4B400', bg: 'rgba(244,180,0,0.10)',   label: 'Litige'         },
  driver:         { icon: Car,           color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)',  label: 'Conducteur'     },
  critical_review:{ icon: AlertCircle,   color: '#DC2626', bg: 'rgba(220,38,38,0.10)',   label: 'Avis critique'  },
};

const PRIORITY_VARIANT: Record<NotifPriority, BadgeVariant> = {
  Urgente: 'error',
  Haute:   'warning',
  Normale: 'info',
  Basse:   'neutral',
};

const STATUS_VARIANT: Record<NotifStatus, BadgeVariant> = {
  'Non lue': 'info',
  'Lue':     'neutral',
  'Traitée': 'emerald',
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="notif-detail__info-row">
      <span className="notif-detail__info-label">{label}</span>
      <span className="notif-detail__info-value">{value}</span>
    </div>
  );
}

export function NotificationDetail({ notification, loadingId, onHandle }: NotificationDetailProps) {
  if (!notification) {
    return (
      <div className="notif-detail-panel notif-detail-panel--empty">
        <AppIcon icon={Bell} size={32} color="#D1D5DB" />
        <p className="notif-detail-panel__placeholder">Sélectionnez une notification</p>
      </div>
    );
  }

  const tc      = TYPE_CONFIG[notification.type];
  const TypeIcon = tc.icon;
  const busy    = loadingId === notification.id;

  return (
    <div className="notif-detail-panel">

      {/* ── Header ── */}
      <div className="notif-detail__header">
        <div className="notif-detail__header-top">
          <div className="notif-detail__type-bubble" style={{ background: tc.bg }}>
            <AppIcon icon={TypeIcon} size={20} color={tc.color} />
          </div>
          <span className="notif-detail__type-label" style={{ color: tc.color }}>{tc.label}</span>
        </div>
        <div className="notif-detail__badges">
          <Badge label={notification.priority} variant={PRIORITY_VARIANT[notification.priority]} />
          <Badge label={notification.status}   variant={STATUS_VARIANT[notification.status]}   />
        </div>
        <p className="notif-detail__id">{notification.notifId}</p>
        <p className="notif-detail__time">{notification.date} à {notification.time}</p>
      </div>

      <div className="notif-detail__divider" />

      {/* ── Content ── */}
      <div className="notif-detail__section">
        <p className="notif-detail__title">{notification.title}</p>
        <p className="notif-detail__desc">{notification.description}</p>
      </div>

      <div className="notif-detail__divider" />

      {/* ── Metadata ── */}
      <div className="notif-detail__section">
        <p className="notif-detail__section-title">Informations</p>
        <div className="notif-detail__info-grid">
          <InfoRow label="Catégorie"    value={tc.label}               />
          <InfoRow label="Priorité"     value={notification.priority}  />
          <InfoRow label="Reçue"        value={notification.createdAgo}/>
          {notification.refEntity && (
            <InfoRow label="Entité liée" value={notification.refEntity} />
          )}
        </div>

        {notification.userName && (
          <div className="notif-detail__user-card">
            <img
              src={notification.userAvatar}
              alt={notification.userName}
              className="notif-detail__user-avatar"
            />
            <div className="notif-detail__user-info">
              <span className="notif-detail__user-name">{notification.userName}</span>
              <span className="notif-detail__user-role">Utilisateur concerné</span>
            </div>
          </div>
        )}
      </div>

      <div className="notif-detail__divider" />

      {/* ── Actions ── */}
      <div className="notif-detail__footer">
        {notification.refEntity && (
          <button type="button" className="notif-action-btn notif-action-btn--link">
            <AppIcon icon={ExternalLink} size={14} color="#fff" />
            {notification.refLabel ?? 'Voir le détail'}
          </button>
        )}
        {notification.status !== 'Traitée' && (
          <button
            type="button"
            className="notif-action-btn notif-action-btn--handle"
            disabled={busy}
            onClick={() => onHandle(notification.id)}
          >
            <AppIcon icon={CheckCircle} size={14} color="#fff" />
            {busy ? 'En cours...' : 'Marquer comme Traitée'}
          </button>
        )}
        {notification.status === 'Traitée' && (
          <div className="notif-detail__handled-state">
            <AppIcon icon={CheckCircle} size={16} color="#16A34A" />
            <span>Notification traitée</span>
          </div>
        )}
      </div>

    </div>
  );
}
