import { useState } from 'react';
import { X, Radio } from 'lucide-react';
import { DashboardLayout }   from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }           from '../../components/Common/AppIcon';
import { ConversationList }  from './components/ConversationList';
import { ChatWindow }        from './components/ChatWindow';
import { useMessaging }      from '../../hooks/useMessaging';
import type { BroadcastTarget } from '../../models/messaging.model';
import '../../messaging.css';

const BROADCAST_TARGETS: { value: BroadcastTarget; label: string; desc: string }[] = [
  { value: 'tous',      label: 'Tous les conducteurs',   desc: 'Message envoyé à l\'ensemble du parc'        },
  { value: 'en_ligne',  label: 'Conducteurs en ligne',   desc: 'Conducteurs disponibles en ce moment'        },
  { value: 'en_trajet', label: 'Conducteurs en trajet',  desc: 'Conducteurs actuellement sur une course'     },
];

export function MessagingScreen() {
  const {
    conversations, selectedId, selectedConversation,
    totalUnread, sending,
    selectConversation, sendMessage, broadcastMessage,
  } = useMessaging();

  const [broadcastOpen,   setBroadcastOpen]   = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState<BroadcastTarget>('tous');
  const [broadcastMsg,    setBroadcastMsg]    = useState('');
  const [broadcastSent,   setBroadcastSent]   = useState(false);

  const handleBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    await broadcastMessage(broadcastMsg.trim(), broadcastTarget);
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastOpen(false);
      setBroadcastMsg('');
      setBroadcastSent(false);
      setBroadcastTarget('tous');
    }, 1600);
  };

  return (
    <DashboardLayout title="Centre de Communication">
      <div className="messaging-layout">
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          totalUnread={totalUnread}
          onSelect={selectConversation}
          onBroadcast={() => setBroadcastOpen(true)}
        />
        <ChatWindow
          conversation={selectedConversation}
          sending={sending}
          onSend={sendMessage}
        />
      </div>

      {/* ── Broadcast modal ──────────────────────────────────────────────── */}
      {broadcastOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setBroadcastOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Message Diffusé</p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>
                  Envoyer un message simultané à plusieurs conducteurs
                </p>
              </div>
              <button type="button" onClick={() => setBroadcastOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 8, display: 'flex' }}>
                <AppIcon icon={X} size={18} color="#6B7280" />
              </button>
            </div>

            {/* Destinataires */}
            <div style={{ padding: '16px 24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Destinataires
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {BROADCAST_TARGETS.map(({ value, label, desc }) => {
                  const sel = broadcastTarget === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setBroadcastTarget(value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                        borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                        border: `2px solid ${sel ? '#2563EB' : '#E5E7EB'}`,
                        background: sel ? '#EFF6FF' : '#FAFAFA',
                      }}
                    >
                      <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: sel ? '#2563EB' : '#D1D5DB' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: sel ? '#2563EB' : '#111827' }}>{label}</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>{desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <div style={{ padding: '0 24px 16px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Message
              </p>
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Tapez votre message ici…"
                rows={4}
                style={{ width: '100%', padding: '10px 12px', fontSize: 13, borderRadius: 8, border: '1.5px solid #E5E7EB', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#374151' }}
              />
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 24px 20px', display: 'flex', gap: 10, borderTop: '1px solid #F3F4F6' }}>
              <button
                type="button"
                onClick={() => setBroadcastOpen(false)}
                style={{ flex: 1, height: 40, borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleBroadcast}
                disabled={!broadcastMsg.trim() || broadcastSent}
                style={{
                  flex: 2, height: 40, borderRadius: 8, border: 'none',
                  background: broadcastSent ? '#00A86B' : (broadcastMsg.trim() ? '#2563EB' : '#E5E7EB'),
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  cursor: broadcastMsg.trim() && !broadcastSent ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}
              >
                {broadcastSent ? '✓ Message envoyé !' : (
                  <>
                    <AppIcon icon={Radio} size={14} color="#fff" />
                    Diffuser le message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
