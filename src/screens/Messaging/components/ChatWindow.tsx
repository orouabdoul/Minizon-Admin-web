import { useState, useEffect, useRef } from 'react';
import { Phone, Send, MessageSquare, ChevronRight, RefreshCw, Pencil, Trash2, Check, X } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import type { Conversation, DriverStatus } from '../../../models/messaging.model';

const STATUS_CONFIG: Record<DriverStatus, { label: string; color: string; bg: string }> = {
  en_ligne:   { label: 'En ligne',   color: '#16A34A', bg: 'rgba(22,163,74,0.10)'   },
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
  onEdit:          (msgId: string, content: string) => void;
  onDelete:        (msgId: string) => void;
}

export function ChatWindow({ conversation, sending, loadingMessages, onSend, onRefresh, onEdit, onDelete }: Props) {
  const [input, setInput]             = useState('');
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);
  const [copied, setCopied]           = useState(false);
  const messagesEndRef                = useRef<HTMLDivElement>(null);
  const textareaRef                   = useRef<HTMLTextAreaElement>(null);
  const editInputRef                  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages?.length]);

  useEffect(() => {
    setInput('');
    setEditingId(null);
    textareaRef.current?.focus();
  }, [conversation?.id]);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  const handleSend = () => {
    if (!input.trim() || sending) return;
    onSend(input.trim());
    setInput('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const startEdit = (msgId: string, current: string) => {
    setEditingId(msgId);
    setEditContent(current);
  };

  const confirmEdit = () => {
    if (!editingId || !editContent.trim()) return;
    onEdit(editingId, editContent.trim());
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

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
            <button
              type="button"
              className="msg-chat__call-btn"
              title={`Copier le numéro de ${name} : ${phone}`}
              onClick={() => {
                navigator.clipboard.writeText(phone).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
            >
              <AppIcon icon={Phone} size={14} color="#fff" />
              {copied ? 'Copié !' : phone}
            </button>
          )}
        </div>
      </div>

      {/* Phone hint */}
      {phone && (
        <div className="msg-chat__phone-hint">
          📞 Cliquez sur le numéro pour le copier dans le presse-papiers
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
          const isEditing = editingId === msg.id;

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="msg-date-divider">
                  <span className="msg-date-divider__line" />
                  <span>{fmtDate(msg.sentAt)}</span>
                  <span className="msg-date-divider__line" />
                </div>
              )}
              <div
                className={`msg-bubble-row${isAdmin ? ' msg-bubble-row--admin' : ''}`}
                onMouseEnter={() => isAdmin && setHoveredMsgId(msg.id)}
                onMouseLeave={() => setHoveredMsgId(null)}
              >
                {/* Avatar utilisateur (messages non-admin) */}
                {!isAdmin && (
                  avatar
                    ? <img src={avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    : <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#6B7280', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{initials(name)}</div>
                )}

                {/* Bulle ou formulaire d'édition — sibling direct dans la row, max-width:70% OK */}
                {isEditing ? (
                  <div className="msg-bubble-edit">
                    <textarea
                      ref={editInputRef}
                      className="msg-bubble-edit__input"
                      value={editContent}
                      rows={2}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirmEdit(); }
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <div className="msg-bubble-edit__actions">
                      <button type="button" className="msg-bubble-edit-btn msg-bubble-edit-btn--cancel" onClick={cancelEdit}>
                        <AppIcon icon={X} size={12} color="#6B7280" /> Annuler
                      </button>
                      <button type="button" className="msg-bubble-edit-btn msg-bubble-edit-btn--save" onClick={confirmEdit}>
                        <AppIcon icon={Check} size={12} color="#fff" /> Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`msg-bubble${isAdmin ? ' msg-bubble--admin' : ' msg-bubble--user'}`}>
                    {msg.content && <p className="msg-bubble__text">{msg.content}</p>}
                    {msg.attachment && (
                      <div className="msg-bubble__attachment">
                        {msg.attachment.type === 'audio' ? (
                          <audio
                            controls
                            preload="metadata"
                            style={{ width: '100%', maxWidth: 260, marginTop: msg.content ? 6 : 0 }}
                          >
                            <source src={msg.attachment.url} />
                          </audio>
                        ) : msg.attachment.type === 'image' ? (
                          <img
                            src={msg.attachment.url}
                            alt="pièce jointe"
                            style={{ maxWidth: 220, maxHeight: 160, borderRadius: 8, marginTop: msg.content ? 6 : 0, display: 'block' }}
                          />
                        ) : (
                          <a
                            href={msg.attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 12, color: isAdmin ? 'rgba(255,255,255,0.85)' : '#2563EB', display: 'flex', alignItems: 'center', gap: 4, marginTop: msg.content ? 6 : 0 }}
                          >
                            📄 Télécharger le document
                          </a>
                        )}
                      </div>
                    )}
                    {isAdmin && msg.is_edited === true && (
                      <p style={{ fontSize: 10, fontStyle: 'italic', opacity: 0.6, margin: '2px 0 0', lineHeight: 1.2 }}>
                        (modifié)
                      </p>
                    )}
                    <div className="msg-bubble__footer">
                      <span className="msg-bubble__time">{fmtTime(msg.sentAt)}</span>
                      {isAdmin && (
                        <span
                          className="msg-bubble__ticks"
                          title={msg.status}
                          style={{ color: msg.status === 'lu' ? '#2563EB' : '#9CA3AF' }}
                        >
                          {msg.status === 'lu' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Boutons modifier/supprimer — sibling après la bulle.
                    Avec flex-direction:row-reverse sur .msg-bubble-row--admin,
                    ils apparaissent visuellement à GAUCHE de la bulle. */}
                {isAdmin && !isEditing && hoveredMsgId === msg.id && (
                  <div style={{ display: 'flex', gap: 4, alignSelf: 'center' }}>
                    <button
                      type="button"
                      className="msg-bubble-action-btn"
                      title="Modifier"
                      onClick={() => startEdit(msg.id, msg.content)}
                    >
                      <AppIcon icon={Pencil} size={11} color="#6B7280" />
                    </button>
                    <button
                      type="button"
                      className="msg-bubble-action-btn msg-bubble-action-btn--delete"
                      title="Supprimer"
                      onClick={() => onDelete(msg.id)}
                    >
                      <AppIcon icon={Trash2} size={11} color="#EF4444" />
                    </button>
                  </div>
                )}
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
