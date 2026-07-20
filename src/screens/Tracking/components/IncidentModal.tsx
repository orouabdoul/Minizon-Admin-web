import { useState, useEffect } from 'react';
import { X, Wrench, AlertTriangle, Info } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import type { TrackedTrip, IncidentType } from '../../../models/tracking.model';

interface Props {
  trip:         TrackedTrip | null;
  isOpen:       boolean;
  initialType?: IncidentType | null;
  onClose:      () => void;
  onSubmit:     (tripId: string, type: IncidentType, notes: string) => void;
}

const INCIDENT_TYPES: { type: IncidentType; label: string; desc: string; color: string; bg: string; icon: typeof Wrench }[] = [
  { type: 'panne',   label: 'Panne',   desc: 'Panne mécanique, crevaison, carburant…',  color: '#E53935', bg: '#FEE2E2', icon: Wrench        },
  { type: 'urgence', label: 'Urgence', desc: 'Accident, urgence médicale, sécurité…',   color: '#F59E0B', bg: '#FEF9C3', icon: AlertTriangle  },
  { type: 'autre',   label: 'Autre',   desc: 'Embouteillage, incident routier, autre…', color: '#2563EB', bg: '#DBEAFE', icon: Info           },
];

export function IncidentModal({ trip, isOpen, initialType, onClose, onSubmit }: Props) {
  const [selected, setSelected] = useState<IncidentType | null>(initialType ?? null);
  const [notes,    setNotes]    = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) { setSelected(initialType ?? null); setNotes(''); }
  }, [isOpen, initialType]);

  if (!isOpen || !trip) return null;

  const handleSubmit = () => {
    if (!selected) return;
    onSubmit(trip.id, selected, notes.trim());
    setSelected(null);
    setNotes('');
    onClose();
  };

  const canSubmit = selected !== null;
  const def = INCIDENT_TYPES.find((d) => d.type === selected);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Signaler un Incident</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
              {trip.tripId} · {trip.from} → {trip.to} · {trip.driverName}
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 8, display: 'flex' }}>
            <AppIcon icon={X} size={18} color="#6B7280" />
          </button>
        </div>

        {/* Incident type selection */}
        <div style={{ padding: '16px 24px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Type d'incident
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {INCIDENT_TYPES.map(({ type, label, desc, color, bg, icon }) => {
              const isSelected = selected === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelected(type)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                    border: `2px solid ${isSelected ? color : '#E5E7EB'}`,
                    background: isSelected ? bg : '#FAFAFA',
                    textAlign: 'left', transition: 'all .15s',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: isSelected ? color : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AppIcon icon={icon} size={18} color={isSelected ? '#fff' : '#6B7280'} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? color : '#111827' }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{desc}</div>
                  </div>
                  {isSelected && (
                    <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div style={{ padding: '0 24px 16px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Notes (optionnel)
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={def ? def.desc : 'Décrivez l\'incident…'}
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', fontSize: 13, borderRadius: 8,
              border: `1.5px solid ${def ? def.color + '66' : '#E5E7EB'}`,
              resize: 'none', outline: 'none', fontFamily: 'inherit',
              background: def ? def.bg + '55' : '#F9FAFB',
              boxSizing: 'border-box', color: '#374151',
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px 20px', display: 'flex', gap: 10, borderTop: '1px solid #F3F4F6' }}>
          <button type="button" onClick={onClose} style={{
            flex: 1, height: 40, borderRadius: 8, border: '1.5px solid #E5E7EB',
            background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer',
          }}>
            Annuler
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            style={{
              flex: 2, height: 40, borderRadius: 8, border: 'none',
              background: canSubmit ? (def?.color ?? '#E53935') : '#E5E7EB',
              fontSize: 13, fontWeight: 700, color: '#fff',
              cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'background .2s',
            }}
          >
            {canSubmit ? `Signaler : ${def?.label}` : 'Choisir un type d\'incident'}
          </button>
        </div>
      </div>
    </div>
  );
}
