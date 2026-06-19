import { useState }        from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { AppIcon }         from '../../../components/Common/AppIcon';
import { Badge }           from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import { DetailModal, DetailSection } from '../../../components/Overlay/DetailModal/DetailModal';
import { ConfirmDialog }   from '../../../components/Overlay/ConfirmDialog/ConfirmDialog';
import { SETTINGS_ADMINS } from '../../../config/constants';

type Admin = {
  id:        string;
  name:      string;
  avatar:    string;
  email:     string;
  role:      string;
  lastLogin: string;
  status:    string;
};

const ROLE_OPTIONS = ['Super Admin', 'Administrateur', 'Modérateur', 'Observateur'];

const INITIAL_ADMINS: Admin[] = SETTINGS_ADMINS.map((a) => ({ ...a }));

function AdminFormModal({
  admin,
  onClose,
  onSave,
}: {
  admin:   Admin | null;
  onClose: () => void;
  onSave:  (data: Omit<Admin, 'id' | 'avatar' | 'lastLogin' | 'status'>) => void;
}) {
  const isEdit = admin !== null;
  const [form, setForm] = useState({
    name:  admin?.name  ?? '',
    email: admin?.email ?? '',
    role:  admin?.role  ?? 'Administrateur',
  });

  return (
    <DetailModal
      title={isEdit ? "Modifier l'Administrateur" : 'Ajouter un Administrateur'}
      onClose={onClose}
      accentColor={isEdit ? '#2563EB' : '#00A86B'}
    >
      {isEdit && admin && (
        <div className="detail-hero" style={{ background: 'rgba(37,99,235,0.06)' }}>
          <img src={admin.avatar} alt={admin.name} className="detail-hero__avatar" />
          <div>
            <p className="detail-hero__name">{admin.name}</p>
            <p className="detail-hero__sub">{admin.email}</p>
          </div>
        </div>
      )}
      {!isEdit && (
        <div className="detail-hero" style={{ background: 'rgba(0,168,107,0.06)' }}>
          <div className="modal-icon-bubble" style={{ background: 'rgba(0,168,107,0.12)' }}>
            <AppIcon icon={UserPlus} size={24} color="#00A86B" />
          </div>
          <div>
            <p className="detail-hero__name">Nouvel Administrateur</p>
            <p className="detail-hero__sub">Remplissez les informations ci-dessous</p>
          </div>
        </div>
      )}

      <DetailSection title="Informations">
        <div className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">Nom complet {!isEdit && '*'}</label>
            <input
              className="settings-input"
              type="text"
              placeholder={!isEdit ? 'Ex: Sophie Martin' : undefined}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Email {!isEdit && '*'}</label>
            <input
              className="settings-input"
              type="email"
              placeholder={!isEdit ? 'sophie@minizon.com' : undefined}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Rôle</label>
            <select
              className="settings-select"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </DetailSection>

      <div className="modal-form-footer">
        <button
          type="button"
          className={`modal-btn-save${isEdit ? ' modal-btn-save--blue' : ''}`}
          disabled={!form.name.trim() || !form.email.trim()}
          onClick={() => { onSave(form); onClose(); }}
        >
          {isEdit ? 'Enregistrer les modifications' : "Ajouter l'administrateur"}
        </button>
        <button type="button" className="modal-btn-cancel" onClick={onClose}>
          Annuler
        </button>
      </div>
    </DetailModal>
  );
}

export function SettingsAdminsCard() {
  const [admins,    setAdmins]    = useState<Admin[]>(INITIAL_ADMINS);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [isAdding,  setIsAdding]  = useState(false);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);

  const handleSave = (data: Omit<Admin, 'id' | 'avatar' | 'lastLogin' | 'status'>) => {
    if (editAdmin) {
      setAdmins((prev) => prev.map((a) => a.id === editAdmin.id ? { ...a, ...data } : a));
    } else {
      setAdmins((prev) => [
        ...prev,
        {
          id:        `adm-${Date.now()}`,
          avatar:    'https://placehold.co/32x32',
          lastLogin: "À l'instant",
          status:    'Actif',
          ...data,
        },
      ]);
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setAdmins((prev) => prev.filter((a) => a.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <>
      {(isAdding || editAdmin) && (
        <AdminFormModal
          admin={isAdding ? null : editAdmin}
          onClose={() => { setIsAdding(false); setEditAdmin(null); }}
          onSave={handleSave}
        />
      )}
      {deleteId && (
        <ConfirmDialog
          isOpen
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Supprimer l'administrateur ?"
          message="Cet administrateur perdra immédiatement tous ses accès à la plateforme."
          confirmLabel="Supprimer"
          variant="danger"
          icon={Trash2}
        />
      )}

      <div className="settings-card">
        <div className="settings-card__title-row">
          <p className="settings-card__title">Gestion Administrateurs</p>
          <button
            type="button"
            className="settings-add-btn"
            onClick={() => setIsAdding(true)}
          >
            <AppIcon icon={UserPlus} size={13} color="#fff" />
            Ajouter
          </button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <Th width="180px">Admin</Th>
              <Th>Email</Th>
              <Th width="130px">Rôle</Th>
              <Th width="160px">Dernière Connexion</Th>
              <Th width="90px">Statut</Th>
              <Th width="90px">Actions</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <Td>
                  <div className="data-table__user-cell">
                    <img src={admin.avatar} alt={admin.name} className="data-table__avatar" />
                    <span className="data-table__user-name">{admin.name}</span>
                  </div>
                </Td>
                <Td><span className="settings-table-text">{admin.email}</span></Td>
                <Td><Badge label={admin.role} variant="purple" /></Td>
                <Td><span className="settings-table-text">{admin.lastLogin}</span></Td>
                <Td><Badge label={admin.status} variant="emerald" /></Td>
                <Td>
                  <div className="trip-actions">
                    <button
                      type="button"
                      className="trip-action-btn"
                      title="Modifier"
                      onClick={() => setEditAdmin(admin)}
                    >
                      <AppIcon icon={Pencil} size={14} color="#2563EB" />
                    </button>
                    <button
                      type="button"
                      className="trip-action-btn"
                      title="Supprimer"
                      onClick={() => setDeleteId(admin.id)}
                    >
                      <AppIcon icon={Trash2} size={14} color="#DC2626" />
                    </button>
                  </div>
                </Td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
