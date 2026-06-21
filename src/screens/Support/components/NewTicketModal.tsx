import { useState }  from 'react';
import { X }         from 'lucide-react';
import { AppIcon }   from '../../../components/Common/AppIcon';

interface Props {
  creating:    boolean;
  createError: string | null;
  onClose:     () => void;
  onCreate:    (data: { user_uuid: string; subject: string; description: string; priority: string; channel: string }) => void;
}

const PRIORITIES = ['Haute', 'Moyenne', 'Basse'];
const CHANNELS   = ['App Mobile', 'Téléphone', 'Email', 'Chat', 'Autre'];

export function NewTicketModal({ creating, createError, onClose, onCreate }: Props) {
  const [userUuid,    setUserUuid]    = useState('');
  const [subject,     setSubject]     = useState('');
  const [description, setDescription] = useState('');
  const [priority,    setPriority]    = useState('Haute');
  const [channel,     setChannel]     = useState('App Mobile');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userUuid.trim() || !subject.trim() || !description.trim()) return;
    onCreate({ user_uuid: userUuid.trim(), subject, description, priority, channel });
  }

  return (
    <div className="support-modal-overlay" onClick={onClose}>
      <div className="support-modal" onClick={(e) => e.stopPropagation()}>

        <div className="support-modal__header">
          <p className="support-modal__title">Nouveau Ticket Support</p>
          <button type="button" className="support-modal__close" onClick={onClose}>
            <AppIcon icon={X} size={16} color="#6B7280" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="support-modal__body">
          <div className="support-modal__field">
            <label className="support-modal__label">UUID Utilisateur *</label>
            <input
              type="text"
              className="support-modal__input"
              placeholder="ex: 3fa85f64-5717-4562-b3fc-2c963f66afa6"
              value={userUuid}
              onChange={(e) => setUserUuid(e.target.value)}
              required
            />
          </div>

          <div className="support-modal__field">
            <label className="support-modal__label">Sujet *</label>
            <input
              type="text"
              className="support-modal__input"
              placeholder="Décrivez brièvement le problème"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="support-modal__field">
            <label className="support-modal__label">Description *</label>
            <textarea
              className="support-modal__textarea"
              placeholder="Décrivez le problème en détail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="support-modal__row">
            <div className="support-modal__field" style={{ flex: 1 }}>
              <label className="support-modal__label">Priorité</label>
              <select className="support-modal__select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="support-modal__field" style={{ flex: 1 }}>
              <label className="support-modal__label">Canal</label>
              <select className="support-modal__select" value={channel} onChange={(e) => setChannel(e.target.value)}>
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {createError && (
            <p className="support-modal__error">{createError}</p>
          )}

          <div className="support-modal__footer">
            <button type="button" className="support-modal__cancel" onClick={onClose}>Annuler</button>
            <button
              type="submit"
              className="support-modal__submit"
              disabled={creating || !userUuid.trim() || !subject.trim() || !description.trim()}
            >
              {creating ? 'Création…' : 'Créer le ticket'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
