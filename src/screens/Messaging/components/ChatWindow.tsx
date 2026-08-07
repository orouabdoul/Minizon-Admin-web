import { useState, useEffect, useRef } from 'react';
import { Phone, Send, MessageSquare, ChevronRight, RefreshCw } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import type { Conversation, DriverStatus } from '../../../models/messaging.model';

const STATUS_CONFIG: Record<DriverStatus, { label: string; color: string; bg: string }> = {
  en_ligne:   { label: 'En ligne',   color: '#00A86B', bg: 'rgba(0,168,107,0.10)'   },
  en_trajet:  { label: 'En trajet',  color: '#2563EB', bg: 'rgba(37,99,235,0.10)'   },
  hors_ligne: { label: 'Hors ligne', color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)' },
};

const QUICK_TEMPLATES = [
  'Bonjour, avez-vous besoin d\'assistance ?',
  'Votre passager vous attend. Pouvez-vous confirmer votre ETA ?',
  'Veuillez démarrer votre trajet immédiatement.',
  'Êtes-vous en sécurité ? Appelez-nous si nécessaire.',
  'Votre trajet a été annulé. Merci de retourner à la base.',
  'Nouveau trajet disponible dans votre zone.',
  'Merci pour votre professionnalisme sur ce trajet.',
  'Nous avons signalé un incident sur votre route, restez prudent.',
];

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}
function sameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}
function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

interface Props {
  conversation:    Conversation | null;
  sending:         boolean;
  loadingMessages: boolean;
  onSend:          (content: string) => void;
  onRefresh:       (id: string) => void;
}

export function ChatWindow({ conversation, sending, loadingMessages, onSend, onRefresh }: Props) {
  const [input, setInput]  = useState('');
  const messagesEndRef     = useRef<HTMLDivElement>(null);
  const textareaRef        = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages?.length]);

  useEffect(() => {
    setInput('');
    textareaRef.current?.focus();
  }, [conversation?.id]);

  const handleSend = () => {
    if (!input.trim() || sending) return;
    onSend(input.trim());
    setInput('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!conversation) {
    return (
      <div className="msg-chat">
        <div className="msg-chat__empty">
          <div className="msg-chat__empty-icon">
            <AppIcon icon={MessageSquare} size={32} color="#2563EB" />
          </div>
          <p className="msg-chat__empty-title">Aucune conversation sélectionnée</p>
          <p className="msg-chat__empty-sub">
            Sélectionnez une conversation dans la liste<br />ou démarrez-en une nouvelle.
          </p>
        </div>
      </div>
    );
  }

  const name     = conversation.name ?? conversation.driverName ?? '?';
  const avatar   = conversation.avatar ?? conversation.driverAvatar;
  const phone    = conversation.phone;
  const status   = STATUS_CONFIG[conversation.driverStatus!] ?? STATUS_CONFIG.hors_ligne;
  const messages = conversation.messages ?? [];

  return (
    <div className="msg-chat">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="msg-chat__header">
        <div className="msg-chat__user">
          {avatar ? (
            <img src={avatar} alt={name} className="msg-chat__avatar" />
          ) : (
            <div className="msg-chat__avatar-fallback">{initials(name)}</div>
          )}
          <div>
            <div className="msg-chat__name">{name}</div>
            <div className="msg-chat__meta">
              {conversation.roleLabel && (
                <span className="msg-chat__role">{conversation.roleLabel}</span>
              )}
              <span
                className="msg-chat__status-badge"
                style={{ color: status.color, background: status.bg }}
              >
                <span className="msg-chat__status-dot" style={{ background: status.color }} />
                {status.label}
              </span>
              {conversation.activeTripId && (
                <span className="msg-chat__trip">
                  <ChevronRight size={10} />
                  Trajet {conversation.activeTripId}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="msg-chat__actions">
          <button
            type="button"
            className="msg-chat__refresh-btn"
            onClick={() => onRefresh(conversation.id)}
            disabled={loadingMessages}
            title="Actualiser les messages"
          >
            <AppIcon icon={RefreshCw} size={14} color="#6B7280" />
          </button>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="msg-chat__call-btn"
              title={`Appeler ${name} — ${phone}`}
            >
              <AppIcon icon={Phone} size={14} color="#fff" />
              Appeler
            </a>
          )}
        </div>
      </div>

      {/* Phone hint */}
      {phone && (
        <div className="msg-chat__phone-hint">
          📞 {phone} — cliquez sur Appeler pour ouvrir le téléphone
        </div>
      )}

      {/* ── Messages ────────────────────────────────────────────────────────── */}
      <div className="msg-chat__messages">
        {loadingMessages ? (
          <div className="msg-chat__loading">
            <p className="msg-chat__state-text">Chargement des messages…</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="msg-chat__no-messages">
            <p className="msg-chat__state-text">
              Aucun message pour l'instant.<br />Commencez la conversation ci-dessous.
            </p>
          </div>
        ) : messages.map((msg, i) => {
          const isAdmin  = msg.sender === 'admin';
          const showDate = i === 0 || !sameDay(messages[i - 1].sentAt, msg.sentAt);

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="msg-date-divider">
                  <span className="msg-date-divider__line" />
                  <span>{fmtDate(msg.sentAt)}</span>
                  <span className="msg-date-divider__line" />
                </div>
              )}
              <div className={`msg-bubble-row${isAdmin ? ' msg-bubble-row--admin' : ''}`}>
                {!isAdmin && (
                  avatar
                    ? <img src={avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    : <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#6B7280', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{initials(name)}</div>
                )}
                <div className={`msg-bubble${isAdmin ? ' msg-bubble--admin' : ' msg-bubble--user'}`}>
                  <p className="msg-bubble__text">{msg.content}</p>
                  <div className="msg-bubble__footer">
                    <span className="msg-bubble__time">{fmtTime(msg.sentAt)}</span>
                    {isAdmin && (
                      <span className="msg-bubble__ticks" title={msg.status}>
                        {msg.status === 'lu' ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="msg-sending-row">
            <div className="msg-sending-bubble">
              <p>Envoi en cours…</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick templates ──────────────────────────────────────────────────── */}
      <div className="msg-chat__templates">
        {QUICK_TEMPLATES.map((tpl, i) => (
          <button
            key={i}
            type="button"
            className="msg-template-chip"
            onClick={() => { setInput(tpl); textareaRef.current?.focus(); }}
          >
            {tpl.length > 42 ? tpl.slice(0, 39) + '…' : tpl}
          </button>
        ))}
      </div>

      {/* ── Input bar ────────────────────────────────────────────────────────── */}
      <div className="msg-chat__input-bar">
        <textarea
          ref={textareaRef}
          className="msg-chat__textarea"
          placeholder="Écrire un message… (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
          value={input}
          rows={2}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={`msg-chat__send-btn${input.trim() && !sending ? ' msg-chat__send-btn--active' : ''}`}
          onClick={handleSend}
          disabled={!input.trim() || sending}
          title="Envoyer (Entrée)"
        >
          <AppIcon icon={Send} size={18} color={input.trim() && !sending ? '#fff' : '#9CA3AF'} />
        </button>
      </div>
    </div>
  );
}
