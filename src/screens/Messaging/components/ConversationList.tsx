import { useState } from 'react';
import { Search, Radio, Plus, Users } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import type {
  Conversation, DriverStatus, RoleFilter, ConvStatusFilter,
} from '../../../models/messaging.model';

const STATUS_DOT: Record<DriverStatus, { color: string; label: string }> = {
  en_ligne:   { color: '#00A86B', label: 'En ligne'   },
  en_trajet:  { color: '#2563EB', label: 'En trajet'  },
  hors_ligne: { color: '#9CA3AF', label: 'Hors ligne' },
};

const PRIORITY_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  retard:  { label: 'Retard',  color: '#D97706', bg: '#FEF3C7' },
  panne:   { label: 'Panne',   color: '#E53935', bg: '#FEE2E2' },
  urgence: { label: 'Urgence', color: '#C62828', bg: '#FFCDD2' },
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000)    return 'À l\'instant';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min`;
  if (diff < 86_400_000)
    return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const ROLE_TABS: { value: RoleFilter; label: string }[] = [
  { value: 'all',       label: 'Tous'         },
  { value: 'driver',    label: 'Conducteurs'  },
  { value: 'passenger', label: 'Passagers'    },
];

const STATUS_TABS: { value: ConvStatusFilter; label: string }[] = [
  { value: 'tous',        label: 'Tous'      },
  { value: 'en_ligne',    label: '🟢 Ligne'  },
  { value: 'en_trajet',   label: '🔵 Trajet' },
  { value: 'hors_ligne',  label: '⚫ Hors'   },
];

interface Props {
  conversations:     Conversation[];
  selectedId:        string | null;
  totalUnread:       number;
  loading:           boolean;
  error:             string | null;
  roleFilter:        RoleFilter;
  setRoleFilter:     (r: RoleFilter) => void;
  statusFilter:      ConvStatusFilter;
  setStatusFilter:   (s: ConvStatusFilter) => void;
  onSelect:          (id: string) => void;
  onBroadcast:       () => void;
  onNewConversation: () => void;
  onSendToSelected:  () => void;
}

export function ConversationList({
  conversations, selectedId, totalUnread,
  loading, error,
  roleFilter, setRoleFilter,
  statusFilter, setStatusFilter,
  onSelect, onBroadcast, onNewConversation, onSendToSelected,
}: Props) {
  const [search, setSearch] = useState('');

  const list = [...conversations]
    .filter((c) => {
      const name = c.name ?? c.driverName ?? '';
      const phone = c.phone ?? '';
      const q = search.toLowerCase();
      return name.toLowerCase().includes(q) || phone.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

  return (
    <div className="msg-panel">
      {/* Header */}
      <div className="msg-panel__header">
        <div className="msg-panel__title-row">
          <div className="msg-panel__title-group">
            <p className="msg-panel__title">Conversations</p>
            {totalUnread > 0 && (
              <span className="msg-panel__badge">{totalUnread}</span>
            )}
          </div>
          <div className="msg-panel__actions">
            <button
              type="button"
              className="msg-action-btn msg-action-btn--icon"
              style={{ background: '#6B7280' }}
              onClick={onNewConversation}
              title="Nouveau message"
            >
              <AppIcon icon={Plus} size={14} color="#fff" />
            </button>
            <button
              type="button"
              className="msg-action-btn"
              style={{ background: '#059669' }}
              onClick={onSendToSelected}
              title="Envoyer à une sélection"
            >
              <AppIcon icon={Users} size={12} color="#fff" />
              Sélection
            </button>
            <button
              type="button"
              className="msg-action-btn"
              style={{ background: '#2563EB' }}
              onClick={onBroadcast}
            >
              <AppIcon icon={Radio} size={12} color="#fff" />
              Diffuser
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="msg-panel__search">
          <AppIcon icon={Search} size={14} color="#9CA3AF" />
          <input
            className="msg-panel__search-input"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Role tabs */}
        <div className="msg-panel__tabs" style={{ marginBottom: 6 }}>
          {ROLE_TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`msg-tab${roleFilter === value ? ' msg-tab--active' : ''}`}
              onClick={() => setRoleFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Status tabs */}
        <div className="msg-panel__tabs">
          {STATUS_TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`msg-tab${statusFilter === value ? ' msg-tab--active' : ''}`}
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="msg-panel__list">
        {loading ? (
          <div className="msg-panel__state">
            <p className="msg-panel__state-text">Chargement…</p>
          </div>
        ) : error ? (
          <div className="msg-panel__state">
            <p className="msg-panel__state-error">{error}</p>
          </div>
        ) : list.length === 0 ? (
          <div className="msg-panel__state">
            <p className="msg-panel__state-text">
              {search ? `Aucun résultat pour « ${search} »` : 'Aucune conversation'}
            </p>
          </div>
        ) : list.map((c) => {
          const name     = c.name ?? c.driverName ?? '?';
          const avatar   = c.avatar ?? c.driverAvatar;
          const status   = STATUS_DOT[c.driverStatus ?? 'hors_ligne'];
          const priority = c.priority ? PRIORITY_BADGE[c.priority] : undefined;
          const isActive = c.id === selectedId;
          const hasUnread = c.unreadCount > 0;

          return (
            <div
              key={c.id}
              className={`msg-conv-item${isActive ? ' msg-conv-item--active' : ''}`}
              onClick={() => onSelect(c.id)}
            >
              <div className="msg-conv-item__avatar-wrap">
                {avatar ? (
                  <img src={avatar} alt={name} className="msg-conv-item__avatar" />
                ) : (
                  <div className="msg-conv-item__avatar-fallback">{initials(name)}</div>
                )}
                <span
                  className="msg-conv-item__dot"
                  style={{ background: status.color }}
                  title={status.label}
                />
              </div>

              <div className="msg-conv-item__body">
                <div className="msg-conv-item__row1">
                  <span className={`msg-conv-item__name${hasUnread ? ' msg-conv-item__name--unread' : ''}`}>
                    {name}
                  </span>
                  <span className="msg-conv-item__time">
                    {c.lastMessageAt ? formatRelative(c.lastMessageAt) : ''}
                  </span>
                </div>
                <div className="msg-conv-item__meta">{c.roleLabel}</div>
                <div className="msg-conv-item__preview-row">
                  <span className={`msg-conv-item__preview${hasUnread ? ' msg-conv-item__preview--unread' : ''}`}>
                    {c.lastMessage}
                  </span>
                  {hasUnread && (
                    <span className="msg-conv-item__unread-badge">{c.unreadCount}</span>
                  )}
                </div>
                {priority && (
                  <span
                    className="msg-conv-item__priority"
                    style={{ color: priority.color, background: priority.bg }}
                  >
                    {priority.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
