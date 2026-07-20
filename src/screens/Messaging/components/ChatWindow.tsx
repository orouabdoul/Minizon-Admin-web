import { useState, useEffect, useRef } from 'react';
import { Phone, Send, MessageSquare, ChevronRight } from 'lucide-react';
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

interface Props {
  conversation: Conversation | null;
  sending:      boolean;
  onSend:       (content: string) => void;
}

export function ChatWindow({ conversation, sending, onSend }: Props) {
  const [input,        setInput]        = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!conversation) {
    return (
      <div className="msg-chat msg-chat--empty">
        <AppIcon icon={MessageSquare} size={44} color="#D1D5DB" />
        <p style={{ color: '#9CA3AF', fontSize: 14, marginTop: 12, textAlign: 'center' }}>
          Sélectionnez une conversation<br />pour commencer
        </p>
      </div>
    );
  }

  const status = STATUS_CONFIG[conversation.driverStatus];

  return (
    <div className="msg-chat">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="msg-chat__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={conversation.driverAvatar} alt={conversation.driverName} className="msg-chat__avatar" />
          <div>
            <div className="msg-chat__driver-name">{conversation.driverName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <span
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 9999,
                  color: status.color, background: status.bg,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.color }} />
                {status.label}
              </span>
              {conversation.activeTripId && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, color: '#6B7280' }}>
                  <ChevronRight size={10} />
                  Trajet {conversation.activeTripId}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Call button */}
        <a
          href={`tel:${conversation.driverPhone}`}
          className="msg-call-btn"
          title={`Appeler ${conversation.driverName} — ${conversation.driverPhone}`}
        >
          <AppIcon icon={Phone} size={15} color="#fff" />
          Appeler
        </a>
      </div>

      {/* Phone hint */}
      <div className="msg-phone-hint">
        📞 {conversation.driverPhone} — cliquez sur Appeler pour ouvrir le téléphone
      </div>

      {/* ── Messages ──────────────────────────────────────────────────────── */}
      <div className="msg-messages">
        {conversation.messages.map((msg, i) => {
          const isAdmin  = msg.sender === 'admin';
          const showDate = i === 0 || !sameDay(conversation.messages[i - 1].sentAt, msg.sentAt);

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="msg-date-sep">
                  <span>{fmtDate(msg.sentAt)}</span>
                </div>
              )}
              <div className={`msg-bubble-wrap${isAdmin ? ' msg-bubble-wrap--admin' : ''}`}>
                {!isAdmin && (
                  <img src={conversation.driverAvatar} alt="" className="msg-bubble__avatar" />
                )}
                <div className={`msg-bubble${isAdmin ? ' msg-bubble--admin' : ' msg-bubble--driver'}`}>
                  <p className="msg-bubble__text">{msg.content}</p>
                  <div className="msg-bubble__meta">
                    <span className="msg-bubble__time">{fmtTime(msg.sentAt)}</span>
                    {isAdmin && (
                      <span className="msg-bubble__status" title={msg.status}>
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
          <div className="msg-bubble-wrap msg-bubble-wrap--admin">
            <div className="msg-bubble msg-bubble--admin" style={{ opacity: 0.6 }}>
              <p className="msg-bubble__text" style={{ fontStyle: 'italic' }}>Envoi en cours…</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick templates ────────────────────────────────────────────────── */}
      <div className="msg-templates">
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

      {/* ── Input bar ─────────────────────────────────────────────────────── */}
      <div className="msg-input-bar">
        <textarea
          ref={textareaRef}
          className="msg-input"
          placeholder="Écrire un message… (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
          value={input}
          rows={2}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={`msg-send-btn${input.trim() && !sending ? ' msg-send-btn--active' : ''}`}
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
