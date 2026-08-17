import { X, MessageSquare, Send, Loader, Bell } from 'lucide-react';
import { useState } from 'react';
import { AppIcon } from '../../../components/Common/AppIcon';
import type { TrackedTrip } from '../../../models/tracking.model';

interface Props {
  isOpen:   boolean;
  trip:     TrackedTrip | null;
  sending:  boolean;
  onClose:  () => void;
  // title + message → FCM push notification
  onSend:   (tripId: string, title: string, message: string) => void;
}

const TEMPLATES: { label: string; title: string; message: string; icon: string }[] = [
  {
    label:   'Départ en retard',
    icon:    '⏰',
    title:   'Retard de départ',
    message: 'Bonjour, votre trajet affiche un retard de départ. Vos passagers attendent. Merci de confirmer votre heure de départ.',
  },
  {
    label:   'Passager en attente',
    icon:    '🧍',
    title:   'Passager en attente',
    message: 'Bonjour, un de vos passagers vous attend au point de prise en charge. Merci de vous manifester.',
  },
  {
    label:   'Vérification itinéraire',
    icon:    '🗺️',
    title:   'Vérification itinéraire',
    message: 'Bonjour, nous constatons une déviation de votre itinéraire prévu. Merci de confirmer votre trajet actuel.',
  },
  {
    label:   'Signalement urgence',
    icon:    '🚨',
    title:   'Urgence signalée',
    message: 'Bonjour, une urgence a été signalée sur votre trajet. Merci de nous contacter immédiatement ou de vous arrêter en lieu sûr.',
  },
  {
    label:   'Vérification passagers',
    icon:    '✅',
    title:   'Vérification en cours',
    message: 'Bonjour, merci de confirmer que tous vos passagers sont bien présents et que le trajet se déroule correctement.',
  },
];

export function AlertDriverModal({ isOpen, trip, sending, onClose, onSend }: Props) {
  const [selected,    setSelected]    = useState<number | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customMsg,   setCustomMsg]   = useState('');
  const [sent,        setSent]        = useState(false);

  if (!isOpen || !trip) return null;

  const finalTitle = selected !== null ? TEMPLATES[selected].title  : customTitle.trim();
  const finalMsg   = selected !== null ? TEMPLATES[selected].message : customMsg.trim();
  const canSend    = finalTitle.length > 0 && finalMsg.length > 0 && !sending;

  function handleSend() {
    if (!canSend) return;
    onSend(trip!.id, finalTitle, finalMsg);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelected(null);
      setCustomTitle('');
      setCustomMsg('');
      onClose();
    }, 1200);
  }

  function handleClose() {
    setSelected(null);
    setCustomTitle('');
    setCustomMsg('');
    setSent(false);
    onClose();
  }

  function selectTemplate(i: number) {
    setSelected(i);
    setCustomTitle('');
    setCustomMsg('');
  }

  return (
    <div className="trk-modal-backdrop" onClick={handleClose}>
      <div className="trk-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="trk-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AppIcon icon={Bell} size={16} color="#1A5FB4" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Notification push au conducteur</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>{trip.driverName} · {trip.tripId}</div>
            </div>
          </div>
          <button type="button" className="trk-modal__close" onClick={handleClose}>
            <AppIcon icon={X} size={16} color="#6B7280" />
          </button>
        </div>

        {/* Body */}
        <div className="trk-modal__body">

          {/* Templates */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
              Notifications rapides
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  className={`trk-alert-template${selected === i ? ' trk-alert-template--selected' : ''}`}
                  onClick={() => selectTemplate(i)}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{t.icon}</span>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{t.message.slice(0, 60)}…</div>
                  </div>
                  {selected === i && (
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#1A5FB4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#F3F4F6', margin: '4px 0 14px' }} />

          {/* Notification preview / custom fields */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10 }}>
              {selected !== null ? 'Aperçu de la notification' : 'Notification personnalisée'}
            </p>

            {selected !== null ? (
              // Preview card
              <div style={{ background: '#1E293B', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <AppIcon icon={MessageSquare} size={12} color="#94A3B8" />
                  <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Minizon Admin</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', marginBottom: 3 }}>
                  {TEMPLATES[selected].title}
                </div>
                <div style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.5 }}>
                  {TEMPLATES[selected].message}
                </div>
              </div>
            ) : (
              // Custom form
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  style={{
                    height: 38, padding: '0 12px',
                    border: '1.5px solid #E5E7EB', borderRadius: 9,
                    fontSize: 13, color: '#374151', outline: 'none', fontFamily: 'inherit',
                  }}
                  placeholder="Titre de la notification…"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                />
                <textarea
                  style={{
                    width: '100%', height: 80, padding: '10px 12px',
                    border: '1.5px solid #E5E7EB', borderRadius: 9,
                    fontSize: 13, color: '#374151', resize: 'none',
                    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: 1.5,
                  }}
                  placeholder="Corps du message…"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                />
              </div>
            )}
          </div>

          {selected !== null && (
            <button
              type="button"
              style={{ background: 'none', border: 'none', fontSize: 11, color: '#6B7280', cursor: 'pointer', padding: '8px 0', textDecoration: 'underline' }}
              onClick={() => setSelected(null)}
            >
              Rédiger une notification personnalisée
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="trk-modal__footer">
          <button type="button" className="trk-modal__cancel-btn" onClick={handleClose}>Annuler</button>
          <button type="button" className="trk-modal__send-btn" disabled={!canSend} onClick={handleSend}>
            {sending ? (
              <AppIcon icon={Loader} size={14} color="#fff" />
            ) : sent ? (
              <>✓ Envoyé</>
            ) : (
              <><AppIcon icon={Send} size={14} color="#fff" /> Envoyer la notification</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
