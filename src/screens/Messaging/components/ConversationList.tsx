import { useState } from 'react';
import { Search, Radio } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import type { Conversation, DriverStatus } from '../../../models/messaging.model';

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
  if (diff < 60_000)   return 'À l\'instant';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min`;
  if (diff < 86_400_000)
    return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

type Filter = 'tous' | 'en_ligne' | 'en_trajet';

interface Props {
  conversations: Conversation[];
  selectedId:    string | null;
  totalUnread:   number;
  onSelect:      (id: string) => void;
  onBroadcast:   () => void;
}

export function ConversationList({ conversations, selectedId, totalUnread, onSelect, onBroadcast }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('tous');

  const list = [...conversations]
    .filter((c) => filter === 'tous' || c.driverStatus === filter)
    .filter((c) => c.driverName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

  return (
    <div className="msg-sidebar">
      {/* Header */}
      <div className="msg-sidebar__header">
        <div className="msg-sidebar__title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p className="msg-sidebar__title">Conversations</p>
            {totalUnread > 0 && (
              <span className="msg-unread-badge">{totalUnread}</span>
            )}
          </div>
          <button type="button" className="msg-broadcast-btn" onClick={onBroadcast}>
            <AppIcon icon={Radio} size={13} color="#fff" />
            Diffuser
          </button>
        </div>

        {/* Search */}
        <div className="msg-search-wrap">
          <AppIcon icon={Search} size={14} color="#9CA3AF" />
          <input
            className="msg-search"
            placeholder="Rechercher un conducteur…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter tabs */}
        <div className="msg-sidebar__tabs">
          {(['tous', 'en_ligne', 'en_trajet'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              className={`msg-sidebar__tab${filter === f ? ' msg-sidebar__tab--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'tous' ? 'Tous' : f === 'en_ligne' ? '🟢 En ligne' : '🔵 En trajet'}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="msg-sidebar__list">
        {list.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
            <p style={{ color: '#9CA3AF', fontSize: 13 }}>Aucune conversation</p>
          </div>
        ) : list.map((c) => {
          const dot      = STATUS_DOT[c.driverStatus];
          const priority = PRIORITY_BADGE[c.priority];
          const isActive = c.id === selectedId;

          return (
            <div
              key={c.id}
              className={`msg-conv-item${isActive ? ' msg-conv-item--active' : ''}${c.unreadCount > 0 ? ' msg-conv-item--unread' : ''}`}
              onClick={() => onSelect(c.id)}
            >
              <div className="msg-conv-item__avatar-wrap">
                <img src={c.driverAvatar} alt={c.driverName} className="msg-conv-item__avatar" />
                <span className="msg-conv-item__dot" style={{ background: dot.color }} title={dot.label} />
              </div>

              <div className="msg-conv-item__content">
                <div className="msg-conv-item__top">
                  <span className="msg-conv-item__name">{c.driverName}</span>
                  <span className="msg-conv-item__time">{formatRelative(c.lastMessageAt)}</span>
                </div>
                <div className="msg-conv-item__bottom">
                  <span className="msg-conv-item__preview">{c.lastMessage}</span>
                  {c.unreadCount > 0 && (
                    <span className="msg-conv-item__count">{c.unreadCount}</span>
                  )}
                </div>
                {priority && (
                  <span className="msg-conv-item__priority" style={{ color: priority.color, background: priority.bg }}>
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
