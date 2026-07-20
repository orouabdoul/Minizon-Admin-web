import { useState } from 'react';
import { Bell, Users, Car, UserCheck } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';

export type NotifTarget = 'all' | 'drivers' | 'passengers' | 'specific';
export type NotifPushType = 'info' | 'warning' | 'promo' | 'system';

interface SendNotifModalProps {
  onClose: () => void;
  onSend:  (data: { title: string; body: string; target: NotifTarget; type: NotifPushType }) => void;
  sending: boolean;
}

const TARGETS: { id: NotifTarget; label: string; icon: typeof Users; desc: string }[] = [
  { id: 'all',        label: 'Tous les utilisateurs', icon: Users,    desc: 'Conducteurs + Passagers' },
  { id: 'drivers',    label: 'Conducteurs',           icon: Car,      desc: 'Uniquement les conducteurs actifs' },
  { id: 'passengers', label: 'Passagers',             icon: UserCheck, desc: 'Uniquement les passagers' },
];

const TYPES: { id: NotifPushType; label: string; color: string; bg: string }[] = [
  { id: 'info',    label: 'Information', color: '#2563EB', bg: '#DBEAFE' },
  { id: 'warning', label: 'Avertissement', color: '#D97706', bg: '#FEF3C7' },
  { id: 'promo',   label: 'Promotion',  color: '#7C3AED', bg: '#F3E8FF' },
  { id: 'system',  label: 'Système',    color: '#E53935', bg: '#FEE2E2' },
];

const TEMPLATES = [
  { label: 'Maintenance',  title: 'Maintenance planifiée', body: 'Une maintenance est prévue ce soir de 02h00 à 04h00. La plateforme sera temporairement indisponible.' },
  { label: 'Promo',        title: 'Offre spéciale !',      body: 'Profitez de -20% sur vos 3 prochains trajets avec le code PROMO20. Valable jusqu\'au 31/07/2026.' },
  { label: 'Sécurité',     title: 'Mise à jour sécurité',  body: 'Merci de mettre à jour vos informations de sécurité pour continuer à utiliser la plateforme.' },
];

export function SendNotifModal({ onClose, onSend, sending }: SendNotifModalProps) {
  const [title,  setTitle]  = useState('');
  const [body,   setBody]   = useState('');
  const [target, setTarget] = useState<NotifTarget>('all');
  const [type,   setType]   = useState<NotifPushType>('info');

  const canSend = title.trim().length > 0 && body.trim().length > 0;

  const applyTemplate = (t: (typeof TEMPLATES)[number]) => {
    setTitle(t.title);
    setBody(t.body);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AppIcon icon={Bell} size={18} color="#2563EB" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Envoyer une notification push</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Diffusion immédiate vers les appareils des utilisateurs</div>
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 20, color: '#9CA3AF', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: '20px' }}>

          {/* Templates */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Modèles rapides</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TEMPLATES.map((t) => (
                <button key={t.label} type="button" onClick={() => applyTemplate(t)} style={{ padding: '5px 12px', borderRadius: 20, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Destinataires</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {TARGETS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTarget(t.id)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `2px solid ${target === t.id ? '#2563EB' : '#E5E7EB'}`, background: target === t.id ? '#EFF6FF' : '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <AppIcon icon={t.icon} size={13} color={target === t.id ? '#2563EB' : '#6B7280'} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: target === t.id ? '#2563EB' : '#374151' }}>{t.label}</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#9CA3AF' }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Type de notification</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: `2px solid ${type === t.id ? t.color : '#E5E7EB'}`, background: type === t.id ? t.bg : '#fff', fontSize: 11, fontWeight: 700, color: type === t.id ? t.color : '#6B7280', cursor: 'pointer' }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
              Titre de la notification *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={65}
              placeholder="Titre court et percutant…"
              style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: 10, color: title.length > 55 ? '#E53935' : '#9CA3AF', textAlign: 'right', marginTop: 3 }}>{title.length}/65</div>
          </div>

          {/* Body */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
              Message *
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={200}
              rows={4}
              placeholder="Rédigez votre message…"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: 10, color: body.length > 180 ? '#E53935' : '#9CA3AF', textAlign: 'right', marginTop: 3 }}>{body.length}/200</div>
          </div>

          {/* Preview */}
          {(title || body) && (
            <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '12px 14px', marginBottom: 20, border: '1px dashed #E5E7EB' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Aperçu notification mobile</div>
              <div style={{ background: '#111827', borderRadius: 10, padding: '10px 14px', maxWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: '#2563EB', flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>MINIZON · Maintenant</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{title || '…'}</div>
                <div style={{ fontSize: 11, color: '#D1D5DB', lineHeight: 1.4 }}>{body || '…'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ position: 'sticky', bottom: 0, background: '#fff', padding: '14px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            Annuler
          </button>
          <button
            type="button"
            disabled={!canSend || sending}
            onClick={() => onSend({ title, body, target, type })}
            style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: canSend && !sending ? '#2563EB' : '#93C5FD', fontSize: 13, fontWeight: 700, color: '#fff', cursor: canSend && !sending ? 'pointer' : 'not-allowed' }}
          >
            {sending ? 'Envoi…' : `Envoyer à ${TARGETS.find((t) => t.id === target)?.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
