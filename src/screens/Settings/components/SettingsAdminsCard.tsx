import { useState }              from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { AppIcon }              from '../../../components/Common/AppIcon';
import { Badge }                from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import { DetailModal, DetailSection } from '../../../components/Overlay/DetailModal/DetailModal';
import { ConfirmDialog }        from '../../../components/Overlay/ConfirmDialog/ConfirmDialog';
import type { SettingsAdmin }   from '../../../models/settings.model';

interface Props {
  admins:     SettingsAdmin[];
  loading:    boolean;
  onAdd:      (data: { name: string; email: string; phone: string; role: string }) => Promise<void>;
  onUpdate:   (id: string, data: { name: string; email: string; role: string }) => void;
  onRevoke:   (id: string) => void;
}

const ROLE_OPTIONS = ['Super Admin', 'Administrateur', 'Modérateur', 'Observateur'];
const AVATAR_FALLBACK = 'https://placehold.co/32x32';

function AdminFormModal({
  admin,
  onClose,
  onAdd,
  onUpdate,
}: {
  admin:    SettingsAdmin | null;
  onClose:  () => void;
  onAdd:    Props['onAdd'];
  onUpdate: Props['onUpdate'];
}) {
  const isEdit = admin !== null;
  const [form, setForm] = useState({
    name:  admin?.name  ?? '',
    email: admin?.email ?? '',
    phone: '',
    role:  admin?.role  ?? 'Administrateur',
  });
  const [localSaving, setLocalSaving] = useState(false);
  const [localError,  setLocalError]  = useState<string | null>(null);

  const handleSubmit = async () => {
    if (isEdit) {
      onUpdate(admin!.id, { name: form.name, email: form.email, role: form.role });
      onClose();
      return;
    }
    setLocalSaving(true);
    setLocalError(null);
    try {
      await onAdd({ name: form.name, email: form.email, phone: form.phone, role: form.role });
      onClose();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setLocalError(err?.response?.data?.message ?? "Erreur lors de la création");
    } finally {
      setLocalSaving(false);
    }
  };

  const canSubmit = form.name.trim() && form.email.trim() && (isEdit || form.phone.trim());

  return (
    <DetailModal
      title={isEdit ? "Modifier l'Administrateur" : 'Ajouter un Administrateur'}
      onClose={onClose}
      accentColor={isEdit ? '#2563EB' : '#00A86B'}
    >
      {isEdit && admin && (
        <div className="detail-hero" style={{ background: 'rgba(37,99,235,0.06)' }}>
          <img src={admin.avatar ?? AVATAR_FALLBACK} alt={admin.name} className="detail-hero__avatar" />
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
          {!isEdit && (
            <div className="modal-form-group">
              <label className="modal-form-label">Téléphone *</label>
              <input
                className="settings-input"
                type="tel"
                placeholder="+22997000001"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
          )}
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
          {localError && (
            <div style={{
              fontSize: 13, color: '#DC2626', background: '#FEF2F2',
              border: '1px solid #FECACA', borderRadius: 8, padding: '10px 12px',
            }}>
              {localError}
            </div>
          )}
        </div>
      </DetailSection>

      <div className="modal-form-footer">
        <button
          type="button"
          className={`modal-btn-save${isEdit ? ' modal-btn-save--blue' : ''}`}
          disabled={!canSubmit || localSaving}
          onClick={handleSubmit}
        >
          {localSaving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : "Ajouter l'administrateur"}
        </button>
        <button type="button" className="modal-btn-cancel" onClick={onClose}>
          Annuler
        </button>
      </div>
    </DetailModal>
  );
}

export function SettingsAdminsCard({ admins, loading, onAdd, onUpdate, onRevoke }: Props) {
  const [editAdmin, setEditAdmin] = useState<SettingsAdmin | null>(null);
  const [isAdding,  setIsAdding]  = useState(false);
  const [revokeId,  setRevokeId]  = useState<string | null>(null);

  return (
    <>
      {(isAdding || editAdmin) && (
        <AdminFormModal
          admin={isAdding ? null : editAdmin}
          onClose={() => { setIsAdding(false); setEditAdmin(null); }}
          onAdd={onAdd}
          onUpdate={onUpdate}
        />
      )}
      {revokeId && (
        <ConfirmDialog
          isOpen
          onClose={() => setRevokeId(null)}
          onConfirm={() => { onRevoke(revokeId); setRevokeId(null); }}
          title="Révoquer l'administrateur ?"
          message="Cet administrateur perdra immédiatement tous ses accès à la plateforme. Son compte utilisateur sera conservé."
          confirmLabel="Révoquer"
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
            {loading ? (
              <TableRow>
                <Td><span className="settings-table-text" style={{ color: '#9CA3AF' }}>Chargement…</span></Td>
                <Td /><Td /><Td /><Td /><Td />
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <Td><span className="settings-table-text" style={{ color: '#9CA3AF' }}>Aucun administrateur</span></Td>
                <Td /><Td /><Td /><Td /><Td />
              </TableRow>
            ) : admins.map((admin) => (
              <TableRow key={admin.id}>
                <Td>
                  <div className="data-table__user-cell">
                    <img
                      src={admin.avatar ?? AVATAR_FALLBACK}
                      alt={admin.name}
                      className="data-table__avatar"
                    />
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
                      title="Révoquer"
                      onClick={() => setRevokeId(admin.id)}
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
