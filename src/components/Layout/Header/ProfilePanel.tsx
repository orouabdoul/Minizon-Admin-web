import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { AppIcon } from '../../Common/AppIcon';
import { ADMIN_USER } from '../../../config/constants';
import { DetailModal, DetailSection } from '../../Overlay/DetailModal/DetailModal';
import { ConfirmDialog } from '../../Overlay/ConfirmDialog/ConfirmDialog';
import { useAuth } from '../../../hooks/useAuth';

function EditProfileModal({ onClose }: { onClose: () => void }) {
  const [name,  setName]  = useState<string>(ADMIN_USER.name);
  const [email, setEmail] = useState<string>('admin@minizon.com');

  return (
    <DetailModal title="Modifier le Profil" onClose={onClose} accentColor="#00A86B">
      <div className="detail-hero" style={{ background: 'rgba(0,168,107,0.06)' }}>
        <img src={ADMIN_USER.avatar} alt={ADMIN_USER.name} className="detail-hero__avatar" />
        <div>
          <p className="detail-hero__name">{ADMIN_USER.name}</p>
          <p className="detail-hero__sub">{ADMIN_USER.role}</p>
        </div>
      </div>

      <DetailSection title="Informations personnelles">
        <div className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">Nom complet</label>
            <input
              className="settings-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Email</label>
            <input
              className="settings-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Rôle</label>
            <input
              className="settings-input"
              type="text"
              value={ADMIN_USER.role}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </DetailSection>

      <div className="modal-form-footer">
        <button type="button" className="modal-btn-save" onClick={onClose}>
          Enregistrer
        </button>
        <button type="button" className="modal-btn-cancel" onClick={onClose}>
          Annuler
        </button>
      </div>
    </DetailModal>
  );
}

export function ProfilePanel() {
  const { logout } = useAuth();
  const [open,        setOpen]        = useState(false);
  const [editOpen,    setEditOpen]    = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  function handleLogoutClick() {
    setOpen(false);
    setConfirmOpen(true);
  }

  return (
    <>
      {editOpen && createPortal(
        <EditProfileModal onClose={() => setEditOpen(false)} />,
        document.body,
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); logout(); }}
        title="Déconnexion"
        message="Voulez-vous vraiment vous déconnecter ? Votre session sera définitivement fermée."
        confirmLabel="Se déconnecter"
        variant="danger"
        icon={LogOut}
      />

      <div className="profile-panel-wrapper" ref={wrapperRef}>
        <button
          type="button"
          className="profile-panel-trigger"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu profil"
        >
          <img className="dash-header__avatar" src={ADMIN_USER.avatar} alt={ADMIN_USER.name} />
          <div className="dash-header__user-text">
            <div className="dash-header__user-name">{ADMIN_USER.name}</div>
            <div className="dash-header__user-role">{ADMIN_USER.role}</div>
          </div>
          <AppIcon icon={ChevronDown} size={14} color="#9CA3AF" />
        </button>

        {open && (
          <div className="profile-panel">
            <div className="profile-panel__header">
              <img className="profile-panel__avatar" src={ADMIN_USER.avatar} alt={ADMIN_USER.name} />
              <div>
                <p className="profile-panel__name">{ADMIN_USER.name}</p>
                <p className="profile-panel__role">{ADMIN_USER.role}</p>
                <p className="profile-panel__email">admin@minizon.com</p>
              </div>
            </div>
            <nav className="profile-panel__menu">
              <button
                type="button"
                className="profile-panel__item"
                onClick={() => { setOpen(false); setEditOpen(true); }}
              >
                <AppIcon icon={User} size={16} color="#6B7280" />
                Modifier le profil
              </button>
              <button type="button" className="profile-panel__item">
                <AppIcon icon={Settings} size={16} color="#6B7280" />
                Paramètres
              </button>
              <div className="profile-panel__divider" />
              <button
                type="button"
                className="profile-panel__item profile-panel__item--danger"
                onClick={handleLogoutClick}
              >
                <AppIcon icon={LogOut} size={16} color="#DC2626" />
                Déconnexion
              </button>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
