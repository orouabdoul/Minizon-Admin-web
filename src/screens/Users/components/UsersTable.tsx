import {
  Search, Eye, Pencil, Trash2, CheckCircle, XCircle, UserX, UserCheck, UserPlus,
} from 'lucide-react';
import { AppIcon }        from '../../../components/Common/AppIcon';
import { Badge }          from '../../../components/DataDisplay/Badge/Badge';
import {
  Table, TableHead, TableBody, TableRow, Th, Td,
} from '../../../components/DataDisplay/Table/Table';
import { useUsers }           from '../../../hooks/useUsers';
import { UserDetailModal }    from './UserDetailModal';
import { DriverDetailModal }  from '../../Drivers/components/DriverDetailModal';
import { AddUserModal }       from './AddUserModal';
import { EditUserModal }      from './EditUserModal';
import { ConfirmDialog }      from '../../../components/Overlay/ConfirmDialog/ConfirmDialog';
import type { BadgeVariant }  from '../../../components/DataDisplay/Badge/Badge';
import type { PlatformUserType, PlatformUserStatus, PlatformUserVerification } from '../../../models/user.model';

const TYPE_VARIANT: Record<PlatformUserType, BadgeVariant> = {
  Conducteur: 'info',
  Passager:   'purple',
};
const STATUS_VARIANT: Record<PlatformUserStatus, BadgeVariant> = {
  Actif:    'primary',
  Inactif:  'neutral',
  Suspendu: 'error',
};
const VERIF_VARIANT: Record<PlatformUserVerification, BadgeVariant> = {
  'Vérifié':    'primary',
  'En attente': 'pending',
  'Rejeté':     'error',
};

const STATUS_OPTIONS = [
  { value: 'all',      label: 'Tous les statuts' },
  { value: 'Actif',    label: 'Actif' },
  { value: 'Inactif',  label: 'Inactif' },
  { value: 'Suspendu', label: 'Suspendu' },
];

const CONFIRM_CONFIG = {
  delete: {
    title:  'Supprimer l\'utilisateur ?',
    message:'Cette action est irréversible. L\'utilisateur sera définitivement supprimé.',
    label:  'Supprimer',
    variant:'danger' as const,
    icon:   Trash2,
  },
  suspend: {
    title:  'Suspendre l\'utilisateur ?',
    message:'L\'utilisateur ne pourra plus accéder à la plateforme pendant la suspension.',
    label:  'Suspendre',
    variant:'warning' as const,
    icon:   UserX,
  },
  unsuspend: {
    title:  'Lever la suspension ?',
    message:'L\'utilisateur retrouvera l\'accès complet à la plateforme.',
    label:  'Lever la suspension',
    variant:'success' as const,
    icon:   UserCheck,
  },
};

function Pagination({
  total, pageSize, currentPage, onChange,
}: { total: number; pageSize: number; currentPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize + 1;
  const to   = Math.min(currentPage * pageSize, total);
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end   = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);
  return (
    <div className="users-pagination">
      <span className="users-pagination__info">
        Affichage de {from} à {to} sur {total} utilisateurs
      </span>
      <div className="users-pagination__pages">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`users-pagination__btn${p === currentPage ? ' users-pagination__btn--active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

export function UsersTable() {
  const {
    users, total, pageSize, currentPage, setCurrentPage,
    loading,
    search, setSearch, statusFilter, setStatusFilter,
    roleFilter, setRoleFilter,
    loadingId, approveKyc, rejectKyc, suspend, unsuspend,
    setSelectedId, selectedUser, detailLoading,
    selectedDriver, driverLoading, validateDriver, rejectDriverFromUsers,
    setEditingId, editingUser, editUser,
    isAdding, setIsAdding, addUser,
    confirmAction, setConfirmAction, deleteUser,
  } = useUsers();

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.action === 'delete')    deleteUser(confirmAction.id);
    if (confirmAction.action === 'suspend')   suspend(confirmAction.id);
    if (confirmAction.action === 'unsuspend') unsuspend(confirmAction.id);
    setConfirmAction(null);
  };

  const cfg = confirmAction ? CONFIRM_CONFIG[confirmAction.action] : null;

  return (
    <>
      {selectedDriver ? (
        <DriverDetailModal
          driver={selectedDriver}
          detailLoading={driverLoading}
          onClose={() => setSelectedId(null)}
          onValidate={validateDriver}
          onReject={rejectDriverFromUsers}
          loadingId={loadingId}
        />
      ) : selectedUser ? (
        <UserDetailModal
          user={selectedUser}
          detailLoading={detailLoading}
          onClose={() => setSelectedId(null)}
          onApproveKyc={approveKyc}
          onRejectKyc={rejectKyc}
          loadingId={loadingId}
        />
      ) : null}
      {isAdding && (
        <AddUserModal onClose={() => setIsAdding(false)} onSave={addUser} />
      )}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingId(null)}
          onSave={(updates) => editUser(editingUser.id, updates)}
        />
      )}
      {cfg && (
        <ConfirmDialog
          isOpen
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
          title={cfg.title}
          message={cfg.message}
          confirmLabel={cfg.label}
          variant={cfg.variant}
          icon={cfg.icon}
        />
      )}

      <div className="users-table-card">
        {/* Toolbar */}
        <div className="users-table-toolbar">
          <div className="users-table-search">
            <AppIcon icon={Search} size={16} color="#9CA3AF" />
            <input
              className="users-table-search__input"
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <select
            className="users-filter-select"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(Number(e.target.value) as 0 | 2 | 3); setCurrentPage(1); }}
          >
            <option value={0}>Tous les rôles</option>
            <option value={2}>Passagers</option>
            <option value={3}>Conducteurs</option>
          </select>
          <select
            className="users-filter-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            type="button"
            className="users-table-add-btn"
            onClick={() => setIsAdding(true)}
          >
            <AppIcon icon={UserPlus} size={15} color="#fff" />
            Ajouter
          </button>
        </div>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <Th>Utilisateur</Th>
              <Th width="110px">Type</Th>
              <Th width="100px">Statut</Th>
              <Th width="120px">Vérification</Th>
              <Th width="130px">Activité</Th>
              <Th width="180px">Actions</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <Td colSpan={6}>
                  <div className="data-table__empty">Chargement...</div>
                </Td>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <Td colSpan={6}>
                  <div className="data-table__empty">Aucun utilisateur trouvé</div>
                </Td>
              </TableRow>
            ) : (
              users.map((u) => {
                const busy = loadingId === u.id;
                return (
                  <TableRow key={u.id}>
                    <Td>
                      <div className="data-table__user-cell">
                        <img src={u.avatar} alt={u.name} className="data-table__avatar" />
                        <div>
                          <div className="data-table__user-name">{u.name}</div>
                          <div className="data-table__user-phone">{u.phone}</div>
                        </div>
                      </div>
                    </Td>
                    <Td><Badge label={u.type}         variant={TYPE_VARIANT[u.type]}          /></Td>
                    <Td><Badge label={u.status}       variant={STATUS_VARIANT[u.status]}      /></Td>
                    <Td><Badge label={u.verification} variant={VERIF_VARIANT[u.verification]} /></Td>
                    <Td><span className="data-table__activity">{u.lastActivity}</span></Td>
                    <Td>
                      <div className="data-table__actions">
                        <button
                          type="button"
                          className="data-table__action-btn"
                          title="Voir"
                          onClick={() => setSelectedId(u.id)}
                        >
                          <AppIcon icon={Eye} size={16} color="#00A86B" />
                        </button>
                        <button
                          type="button"
                          className="data-table__action-btn"
                          title="Modifier"
                          onClick={() => setEditingId(u.id)}
                        >
                          <AppIcon icon={Pencil} size={16} color="#2563EB" />
                        </button>

                        {u.verification === 'En attente' && (
                          <>
                            <button
                              type="button"
                              className="data-table__action-btn"
                              title="Approuver KYC"
                              disabled={busy}
                              onClick={() => approveKyc(u.id)}
                            >
                              <AppIcon icon={CheckCircle} size={16} color={busy ? '#9CA3AF' : '#00A86B'} />
                            </button>
                            <button
                              type="button"
                              className="data-table__action-btn"
                              title="Rejeter KYC"
                              disabled={busy}
                              onClick={() => rejectKyc(u.id)}
                            >
                              <AppIcon icon={XCircle} size={16} color={busy ? '#9CA3AF' : '#E53935'} />
                            </button>
                          </>
                        )}

                        {u.status !== 'Suspendu' ? (
                          <button
                            type="button"
                            className="data-table__action-btn"
                            title="Suspendre"
                            disabled={busy}
                            onClick={() => setConfirmAction({ id: u.id, action: 'suspend' })}
                          >
                            <AppIcon icon={UserX} size={16} color={busy ? '#9CA3AF' : '#FB8C00'} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="data-table__action-btn"
                            title="Lever la suspension"
                            disabled={busy}
                            onClick={() => setConfirmAction({ id: u.id, action: 'unsuspend' })}
                          >
                            <AppIcon icon={UserCheck} size={16} color={busy ? '#9CA3AF' : '#00A86B'} />
                          </button>
                        )}

                        <button
                          type="button"
                          className="data-table__action-btn"
                          title="Supprimer"
                          onClick={() => setConfirmAction({ id: u.id, action: 'delete' })}
                        >
                          <AppIcon icon={Trash2} size={16} color="#E53935" />
                        </button>
                      </div>
                    </Td>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Pagination
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={setCurrentPage}
        />
      </div>
    </>
  );
}
