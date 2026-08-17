import { useState } from 'react';
import { DetailModal, DetailSection } from '../../../components/Overlay/DetailModal/DetailModal';
import type {
  PlatformUser,
  PlatformUserType,
  PlatformUserStatus,
  PlatformUserVerification,
} from '../../../models/user.model';

interface Props {
  user:    PlatformUser;
  onClose: () => void;
  onSave:  (updates: Partial<PlatformUser>) => void;
}

export function EditUserModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    name:         user.name,
    phone:        user.phone,
    type:         user.type,
    status:       user.status,
    verification: user.verification,
  });

  return (
    <DetailModal title="Modifier l'Utilisateur" onClose={onClose} accentColor="#1A5FB4">
      <div className="detail-hero" style={{ background: 'rgba(26,95,180,0.06)' }}>
        <img src={user.avatar} alt={user.name} className="detail-hero__avatar" />
        <div>
          <p className="detail-hero__name">{user.name}</p>
          <p className="detail-hero__sub">{user.phone}</p>
        </div>
      </div>

      <DetailSection title="Informations">
        <div className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">Nom complet</label>
            <input
              className="settings-input"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Téléphone</label>
            <input
              className="settings-input"
              type="text"
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
              <option value="Conducteur">Conducteur</option>
              <option value="Passager">Passager</option>
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
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Vérification</label>
            <select
              className="settings-select"
              value={form.verification}
              onChange={(e) => setForm((f) => ({ ...f, verification: e.target.value as PlatformUserVerification }))}
            >
              <option value="Vérifié">Vérifié</option>
              <option value="En attente">En attente</option>
              <option value="Rejeté">Rejeté</option>
            </select>
          </div>
        </div>
      </DetailSection>

      <div className="modal-form-footer">
        <button
          type="button"
          className="modal-btn-save modal-btn-save--blue"
          onClick={() => { onSave(form); onClose(); }}
        >
          Enregistrer les modifications
        </button>
        <button type="button" className="modal-btn-cancel" onClick={onClose}>
          Annuler
        </button>
      </div>
    </DetailModal>
  );
}
