import { useState } from 'react';
import { Search, Eye, CheckCircle, Trash2 } from 'lucide-react';
import { AppIcon }       from '../../../components/Common/AppIcon';
import { Badge }         from '../../../components/DataDisplay/Badge/Badge';
import { ConfirmDialog } from '../../../components/Overlay/ConfirmDialog/ConfirmDialog';
import {
  Table, TableHead, TableBody, TableRow, Th, Td,
} from '../../../components/DataDisplay/Table/Table';
import { VehicleDetailModal } from './VehicleDetailModal';
import type { Vehicle, VehicleStatus, VehicleType, VehicleDocStatus } from '../../../models/vehicle.model';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';

interface Props {
  vehicles:        Vehicle[];
  total:           number;
  pageSize:        number;
  currentPage:     number;
  setCurrentPage:  (p: number) => void;
  loading:         boolean;
  search:          string;
  setSearch:       (v: string) => void;
  statusFilter:    string;
  setStatusFilter: (v: string) => void;
  typeFilter:      string;
  setTypeFilter:   (v: string) => void;
  selectedVehicle: Vehicle | null;
  setSelectedId:   (id: string | null) => void;
  onApprove:   (id: string) => Promise<void>;
  onReject:    (id: string, reason: string) => Promise<void>;
  onSuspend:   (id: string, reason: string) => Promise<void>;
  onReinstate: (id: string) => Promise<void>;
  onDelete:    (id: string) => Promise<void>;
}

const STATUS_VARIANT: Record<VehicleStatus, BadgeVariant> = {
  'Actif':         'emerald',
  'En inspection': 'amber',
  'Suspendu':      'neutral',
  'Rejeté':        'error',
};
const DOC_VARIANT: Record<VehicleDocStatus, BadgeVariant> = {
  ok: 'emerald', pending: 'amber', rejected: 'error',
};
const DOC_ICON: Record<VehicleDocStatus, string> = {
  ok: '✓', pending: '⏳', rejected: '✗',
};

const STATUS_OPTIONS = [
  { value: '',              label: 'Tous les statuts'  },
  { value: 'Actif',         label: 'Actif'             },
  { value: 'En inspection', label: 'En inspection'     },
  { value: 'Suspendu',      label: 'Suspendu'          },
  { value: 'Rejeté',        label: 'Rejeté'            },
];
const TYPE_OPTIONS = [
  { value: '',        label: 'Tous les types' },
  { value: 'Berline', label: 'Berline'        },
  { value: 'SUV',     label: 'SUV'            },
  { value: 'Moto',    label: 'Moto'           },
  { value: 'Van',     label: 'Van'            },
  { value: 'Minibus', label: 'Minibus'        },
];

const TYPE_COLORS: Record<VehicleType, { bg: string; color: string }> = {
  Berline: { bg: '#EFF6FF', color: '#2563EB' },
  SUV:     { bg: '#F3E8FF', color: '#7C3AED' },
  Moto:    { bg: '#FEF9C3', color: '#854D0E' },
  Van:     { bg: '#DCFCE7', color: '#15803D' },
  Minibus: { bg: '#FEE2E2', color: '#B91C1C' },
};

function TypeChip({ type }: { type: VehicleType }) {
  const s = TYPE_COLORS[type] ?? { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span style={{
      display: 'inline-flex', padding: '2px 8px', borderRadius: 9999,
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 700,
    }}>
      {type}
    </span>
  );
}

function Pagination({ total, pageSize, currentPage, onChange }: {
  total: number; pageSize: number; currentPage: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize + 1;
  const to   = Math.min(currentPage * pageSize, total);
  const start = Math.max(1, currentPage - 2);
  const end   = Math.min(totalPages, start + 4);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return (
    <div className="users-pagination">
      <span className="users-pagination__info">
        Affichage de {from} à {to} sur {total} véhicule{total > 1 ? 's' : ''}
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

export function VehiclesTable({
  vehicles, total, pageSize, currentPage, setCurrentPage, loading,
  search, setSearch, statusFilter, setStatusFilter, typeFilter, setTypeFilter,
  selectedVehicle, setSelectedId,
  onApprove, onReject, onSuspend, onReinstate, onDelete,
}: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedId(null)}
          onApprove={async (id) => { await onApprove(id); setSelectedId(null); }}
          onReject={async (id, reason) => { await onReject(id, reason); setSelectedId(null); }}
          onSuspend={async (id, reason) => { await onSuspend(id, reason); setSelectedId(null); }}
          onReinstate={async (id) => { await onReinstate(id); setSelectedId(null); }}
          onDelete={async (id) => { await onDelete(id); setSelectedId(null); }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await onDelete(deleteId); setDeleteId(null); } }}
        title="Supprimer le véhicule ?"
        message="Cette action est irréversible. Le véhicule sera définitivement supprimé."
        confirmLabel="Supprimer"
        variant="danger"
      />

      <div className="users-table-card">
        {/* Header */}
        <div className="drivers-table-header">
          <div className="drivers-table-header__left">
            <div className="drivers-table-header__title">Flotte de Véhicules</div>
            <div className="drivers-table-header__subtitle">
              Gérer et superviser les véhicules des conducteurs
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="vehicles-filter-bar">
          <div className="vehicles-filter-search">
            <span className="vehicles-filter-search__icon">
              <AppIcon icon={Search} size={14} color="#9CA3AF" />
            </span>
            <input
              type="text"
              className="vehicles-filter-search__input"
              placeholder="Rechercher par conducteur, plaque, marque…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="vehicles-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            className="vehicles-filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <Th>Conducteur</Th>
              <Th>Véhicule</Th>
              <Th width="140px">Plaque & Type</Th>
              <Th width="240px">Documents</Th>
              <Th width="110px">Statut</Th>
              <Th width="100px">Actions</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <Td colSpan={6}>
                  <div className="data-table__empty">Chargement…</div>
                </Td>
              </TableRow>
            ) : vehicles.length === 0 ? (
              <TableRow>
                <Td colSpan={6}>
                  <div className="data-table__empty">Aucun véhicule trouvé</div>
                </Td>
              </TableRow>
            ) : vehicles.map((v) => (
              <TableRow key={v.id}>
                <Td>
                  <div className="data-table__user-cell">
                    <img src={v.driverAvatar} alt={v.driverName} className="data-table__avatar" />
                    <div>
                      <div className="data-table__user-name">{v.driverName}</div>
                      <div className="data-table__user-phone">{v.driverId}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div className="data-table__user-name">{v.make} {v.model}</div>
                  <div className="data-table__user-phone">{v.year} · {v.color} · {v.seats} pl.</div>
                </Td>
                <Td>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: '#111827', letterSpacing: 0.5, marginBottom: 4 }}>
                    {v.plate}
                  </div>
                  <TypeChip type={v.type} />
                </Td>
                <Td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Badge label={`Carte grise ${DOC_ICON[v.documents.carteGrise] ?? '?'}`} variant={DOC_VARIANT[v.documents.carteGrise] ?? 'neutral'} />
                    <Badge label={`Assurance ${DOC_ICON[v.documents.assurance] ?? '?'}`}    variant={DOC_VARIANT[v.documents.assurance]  ?? 'neutral'}  />
                    {v.type !== 'Moto' && v.documents.visite && (
                      <Badge label={`Visite ${DOC_ICON[v.documents.visite] ?? '?'}`} variant={DOC_VARIANT[v.documents.visite] ?? 'neutral'} />
                    )}
                  </div>
                </Td>
                <Td>
                  <Badge label={v.status} variant={STATUS_VARIANT[v.status] ?? 'neutral'} />
                </Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      type="button"
                      className="data-table__action-btn"
                      title="Voir le détail"
                      onClick={() => setSelectedId(v.id)}
                    >
                      <AppIcon icon={Eye} size={15} color="#7C3AED" />
                    </button>
                    <button
                      type="button"
                      className="data-table__action-btn"
                      title="Approuver"
                      disabled={v.status === 'Actif'}
                      style={{ opacity: v.status === 'Actif' ? 0.3 : 1 }}
                      onClick={() => onApprove(v.id)}
                    >
                      <AppIcon icon={CheckCircle} size={15} color="#7C3AED" />
                    </button>
                    <button
                      type="button"
                      className="data-table__action-btn"
                      title="Supprimer"
                      onClick={() => setDeleteId(v.id)}
                    >
                      <AppIcon icon={Trash2} size={15} color="#E53935" />
                    </button>
                  </div>
                </Td>
              </TableRow>
            ))}
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
