import { useState } from 'react';
import { UserPlus }  from 'lucide-react';
import { AppIcon }   from '../../../components/Common/AppIcon';
import { DetailModal, DetailSection } from '../../../components/Overlay/DetailModal/DetailModal';
import type {
  PlatformUserType,
  PlatformUserStatus,
  PlatformUserVerification,
} from '../../../models/user.model';

interface NewUser {
  name:         string;
  phone:        string;
  type:         PlatformUserType;
  status:       PlatformUserStatus;
  verification: PlatformUserVerification;
}

interface Props {
  onClose: () => void;
  onSave:  (data: NewUser) => void;
}

const INIT: NewUser = {
  name: '', phone: '', type: 'Passager', status: 'Actif', verification: 'En attente',
};

export function AddUserModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState<NewUser>(INIT);

  return (
    <DetailModal title="Ajouter un Utilisateur" onClose={onClose} accentColor="#1A5FB4">
      <div className="detail-hero" style={{ background: 'rgba(26,95,180,0.06)' }}>
        <div className="modal-icon-bubble" style={{ background: 'rgba(26,95,180,0.12)' }}>
          <AppIcon icon={UserPlus} size={24} color="#1A5FB4" />
        </div>
        <div>
          <p className="detail-hero__name">Nouvel Utilisateur</p>
          <p className="detail-hero__sub">Remplissez les informations ci-dessous</p>
        </div>
      </div>

      <DetailSection title="Informations">
        <div className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">Nom complet *</label>
            <input
              className="settings-input"
              type="text"
              placeholder="Ex: Marie Dupont"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Téléphone *</label>
            <input
              className="settings-input"
              type="text"
              placeholder="+229 97 123 456"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Type</label>
            <select
              className="settings-select"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as PlatformUserType }))}
            >
              <option value="Passager">Passager</option>
              <option value="Conducteur">Conducteur</option>
            </select>
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Statut</label>
            <select
              className="settings-select"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PlatformUserStatus }))}
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Vérification</label>
            <select
              className="settings-select"
              value={form.verification}
              onChange={(e) => setForm((f) => ({ ...f, verification: e.target.value as PlatformUserVerification }))}
            >
              <option value="En attente">En attente</option>
              <option value="Vérifié">Vérifié</option>
            </select>
          </div>
        </div>
      </DetailSection>

      <div className="modal-form-footer">
        <button
          type="button"
          className="modal-btn-save"
          disabled={!form.name.trim() || !form.phone.trim()}
          onClick={() => { onSave(form); onClose(); }}
        >
          Ajouter l'utilisateur
        </button>
        <button type="button" className="modal-btn-cancel" onClick={onClose}>
          Annuler
        </button>
      </div>
    </DetailModal>
  );
}
