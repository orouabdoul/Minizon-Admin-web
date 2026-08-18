import {
  AlertTriangle, UserCheck, CreditCard, AlertCircle, Car,
  Search, X, Check, Loader2, AlertOctagon, Star, Unlock, RefreshCw, ExternalLink, ExternalLink as LinkOut,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate }      from 'react-router-dom';
import { AppIcon }          from '../../../components/Common/AppIcon';
import { NOTIF_TYPE_OPTIONS } from '../../../config/constants';
import { ROUTES }           from '../../../navigation/routes';
import type {
  Notification, NotifType, NotifPriority, NotifTab, NotifDateGroup,
} from '../../../models/notification.model';

interface NotificationsFeedProps {
  notifications:  Notification[];
  tabFilter:      NotifTab;
  setTabFilter:   (t: NotifTab) => void;
  tabCounts:      Record<NotifTab, number>;
  search:         string;
  setSearch:      (v: string) => void;
  typeFilter:     string;
  setTypeFilter:  (v: string) => void;
  selectedId:     string;
  setSelectedId:  (id: string) => void;
  onMarkRead:     (id: string) => void;
  onMarkAllRead:  () => void;
  onDelete:       (id: string) => void;
  loading:        boolean;
  fetchError:     string | null;
  // Critical review actions
  onPaymentView?:    (paymentUuid: string, notifId: string) => void;
  onPaymentRelease?: (paymentUuid: string, notifId: string) => void;
  onPaymentRefund?:  (paymentUuid: string, notifId: string) => void;
  paymentActionState?: Record<string, { loading?: boolean; success?: string; error?: string }>;
}

const TYPE_CONFIG: Record<NotifType, { icon: LucideIcon; color: string; bg: string; label: string }> = {
  system:         { icon: AlertTriangle, color: '#E53935', bg: 'rgba(229,57,53,0.10)',   label: 'Système'         },
  user:           { icon: UserCheck,     color: '#1A5FB4', bg: 'rgba(26,95,180,0.10)',   label: 'Utilisateur'     },
  payment:        { icon: CreditCard,    color: '#1A5FB4', bg: 'rgba(26,95,180,0.10)',   label: 'Paiement'        },
  dispute:        { icon: AlertCircle,   color: '#F4B400', bg: 'rgba(244,180,0,0.10)',   label: 'Litige'          },
  driver:         { icon: Car,           color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)',  label: 'Conducteur'      },
  critical_review:{ icon: AlertOctagon,  color: '#DC2626', bg: 'rgba(220,38,38,0.10)',   label: 'Avis critique'   },
};

const PRIORITY_BORDER: Record<NotifPriority, string> = {
  Urgente: '#E53935',
  Haute:   '#FB8C00',
  Normale: '#1A5FB4',
  Basse:   '#E5E7EB',
};

const DATE_ORDER: NotifDateGroup[] = ["Aujourd'hui", 'Hier', 'Cette semaine'];

const TABS: { key: NotifTab; label: string }[] = [
  { key: 'all',    label: 'Toutes'   },
  { key: 'unread', label: 'Non lues' },
  { key: 'urgent', label: 'Urgentes' },
  { key: 'system', label: 'Système'  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <AppIcon key={s} icon={Star} size={11} color={s <= rating ? '#F59E0B' : '#D1D5DB'} />
      ))}
      <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 3 }}>{rating}/5</span>
    </span>
  );
}

export function NotificationsFeed({
  notifications, tabFilter, setTabFilter, tabCounts,
  search, setSearch, typeFilter, setTypeFilter,
  selectedId, setSelectedId, onMarkRead, onMarkAllRead, onDelete,
  loading, fetchError,
  onPaymentView, onPaymentRelease, onPaymentRefund,
  paymentActionState = {},
}: NotificationsFeedProps) {
  const navigate = useNavigate();

  const groups = DATE_ORDER.map((g) => ({
    label: g,
    items: notifications.filter((n) => n.dateGroup === g),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="notif-feed-card">

      {/* ── Tabs ── */}
      <div className="notif-tabs">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`notif-tab${tabFilter === key ? ' notif-tab--active' : ''}`}
            onClick={() => setTabFilter(key)}
          >
            {label}
            <span className="notif-tab__count">{tabCounts[key]}</span>
          </button>
        ))}
        <button type="button" className="notif-mark-all-btn" onClick={onMarkAllRead}>
          Tout marquer lu
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="notif-filterbar">
        <div className="notif-filterbar__search">
          <AppIcon icon={Search} size={15} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Rechercher une notification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="notif-filterbar__input"
          />
        </div>
        <select
          className="notif-filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {NOTIF_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* ── Feed content ── */}
      {loading ? (
        <div className="notif-feed__empty">
          <AppIcon icon={Loader2} size={28} color="#D1D5DB" />
          <p>Chargement…</p>
        </div>
      ) : fetchError ? (
        <div className="notif-feed__empty" style={{ color: '#E53935' }}>
          <AppIcon icon={AlertCircle} size={28} color="#E53935" />
          <p>{fetchError}</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="notif-feed__empty">
          <AppIcon icon={AlertCircle} size={28} color="#D1D5DB" />
          <p>Aucune notification trouvée</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="notif-feed__empty">
          <AppIcon icon={AlertCircle} size={28} color="#D1D5DB" />
          <p>Aucune notification dans cette catégorie</p>
        </div>
      ) : (
        groups.map(({ label, items }) => (
          <div key={label}>
            <div className="notif-group-header">
              <span>{label}</span>
              <span className="notif-group-header__count">{items.length}</span>
            </div>

            {items.map((n) => {
              const tc       = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
              const TypeIcon = tc.icon;
              const isActive = n.id === selectedId;
              const isUnread = n.status === 'Non lue';
              const crd      = n.criticalReviewData;
              const pas      = paymentActionState[n.id] ?? {};

              // ── Critical review card ──────────────────────────────────
              if (n.type === 'critical_review' && crd) {
                return (
                  <div
                    key={n.id}
                    className={`notif-item notif-critical${isActive ? ' notif-item--active' : ''}${isUnread ? ' notif-item--unread' : ''}`}
                    style={{ borderLeftColor: '#DC2626' }}
                    onClick={() => {
                      setSelectedId(n.id);
                      if (isUnread) onMarkRead(n.id);
                    }}
                  >
                    {/* Header */}
                    <div className="notif-critical__header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="notif-item__bubble" style={{ background: tc.bg, flexShrink: 0 }}>
                          <AppIcon icon={AlertOctagon} size={16} color="#DC2626" />
                        </div>
                        <div>
                          <div className="notif-critical__title">{n.title}</div>
                          <StarRating rating={crd.rating} />
                        </div>
                      </div>
                      <div className="notif-item__meta-right" onClick={(e) => e.stopPropagation()}>
                        <span className="notif-item__time">{n.createdAgo}</span>
                        <div className="notif-item__actions">
                          {isUnread && (
                            <button type="button" className="notif-icon-btn" title="Marquer comme lue" onClick={() => onMarkRead(n.id)}>
                              <AppIcon icon={Check} size={12} color="#1A5FB4" />
                            </button>
                          )}
                          <button type="button" className="notif-icon-btn notif-icon-btn--danger" title="Supprimer" onClick={() => onDelete(n.id)}>
                            <AppIcon icon={X} size={12} color="#DC2626" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="notif-critical__body">
                      <p className="notif-critical__trip">
                        <strong>Trajet :</strong> {crd.trip}
                      </p>
                      {crd.comment && (
                        <p className="notif-critical__comment">
                          "{crd.comment}"
                        </p>
                      )}
                    </div>

                    {/* Action result */}
                    {pas.success && (
                      <div className="notif-critical__success">
                        <AppIcon icon={Check} size={13} color="#16A34A" />
                        {pas.success}
                      </div>
                    )}
                    {pas.error && (
                      <div className="notif-critical__error">{pas.error}</div>
                    )}

                    {/* Actions */}
                    {!pas.success && n.status !== 'Traitée' && (
                      <div className="notif-critical__actions" onClick={(e) => e.stopPropagation()}>
                        {onPaymentView && (
                          <button
                            type="button"
                            className="notif-critical__btn notif-critical__btn--view"
                            disabled={pas.loading}
                            onClick={() => onPaymentView(crd.payment_uuid, n.id)}
                          >
                            <AppIcon icon={ExternalLink} size={12} color="#1A5FB4" />
                            Voir le paiement
                          </button>
                        )}
                        {onPaymentRelease && (
                          <button
                            type="button"
                            className="notif-critical__btn notif-critical__btn--release"
                            disabled={pas.loading}
                            onClick={() => onPaymentRelease(crd.payment_uuid, n.id)}
                          >
                            {pas.loading
                              ? <AppIcon icon={Loader2} size={12} color="#fff" />
                              : <AppIcon icon={Unlock} size={12} color="#fff" />}
                            Libérer
                          </button>
                        )}
                        {onPaymentRefund && (
                          <button
                            type="button"
                            className="notif-critical__btn notif-critical__btn--refund"
                            disabled={pas.loading}
                            onClick={() => onPaymentRefund(crd.payment_uuid, n.id)}
                          >
                            {pas.loading
                              ? <AppIcon icon={Loader2} size={12} color="#fff" />
                              : <AppIcon icon={RefreshCw} size={12} color="#fff" />}
                            Rembourser
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // ── Standard card ─────────────────────────────────────────
              return (
                <div
                  key={n.id}
                  className={`notif-item${isActive ? ' notif-item--active' : ''}${isUnread ? ' notif-item--unread' : ''}`}
                  style={{ borderLeftColor: isActive ? '#1A5FB4' : PRIORITY_BORDER[n.priority] }}
                  onClick={() => {
                    setSelectedId(n.id);
                    if (isUnread) onMarkRead(n.id);
                  }}
                >
                  <div className="notif-item__bubble" style={{ background: tc.bg }}>
                    <AppIcon icon={TypeIcon} size={16} color={tc.color} />
                  </div>

                  <div className="notif-item__body">
                    <div className="notif-item__top">
                      <span className={`notif-item__title${isUnread ? ' notif-item__title--unread' : ''}`}>
                        {n.title}
                      </span>
                      <div className="notif-item__meta-right">
                        <span className="notif-item__time">{n.createdAgo}</span>
                        <div className="notif-item__actions" onClick={(e) => e.stopPropagation()}>
                          {isUnread && (
                            <button type="button" className="notif-icon-btn" title="Marquer comme lue" onClick={() => onMarkRead(n.id)}>
                              <AppIcon icon={Check} size={12} color="#1A5FB4" />
                            </button>
                          )}
                          <button type="button" className="notif-icon-btn notif-icon-btn--danger" title="Supprimer" onClick={() => onDelete(n.id)}>
                            <AppIcon icon={X} size={12} color="#DC2626" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="notif-item__desc">{n.description}</p>

                    <div className="notif-item__footer">
                      {n.userName && (
                        <div className="notif-item__user">
                          <img src={n.userAvatar} alt={n.userName} className="notif-item__user-avatar" />
                          <span className="notif-item__user-name">{n.userName}</span>
                        </div>
                      )}
                      <span className="notif-item__type-chip" style={{ color: tc.color, background: tc.bg }}>
                        {tc.label}
                      </span>
                      {n.status === 'Traitée' && (
                        <span className="notif-item__handled-chip">Traitée</span>
                      )}
                      {n.disputeId && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); navigate(ROUTES.DISPUTES); }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, border: 'none', background: '#FEF2F2', color: '#E53935', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                        >
                          <AppIcon icon={LinkOut} size={11} color="#E53935" />
                          Voir le litige
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
