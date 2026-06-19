import { useState }            from 'react';
import { Eye, Check, X, Filter } from 'lucide-react';
import { AppIcon }          from '../../../components/Common/AppIcon';
import { Badge }            from '../../../components/DataDisplay/Badge/Badge';
import {
  Table, TableHead, TableBody, TableRow, Th, Td,
} from '../../../components/DataDisplay/Table/Table';
import { useDrivers }            from '../../../hooks/useDrivers';
import { DRIVER_STATUS_OPTIONS } from '../../../config/constants';
import { scoreTrack, scoreFill } from '../styles';
import { DriverDetailModal }     from './DriverDetailModal';
import { ConfirmDialog }         from '../../../components/Overlay/ConfirmDialog/ConfirmDialog';
import type { BadgeVariant }     from '../../../components/DataDisplay/Badge/Badge';
import type { DocumentStatus, DriverStatus } from '../../../models/driver.model';

const DOC_LABEL: Record<DocumentStatus, string> = {
  ok:       '✓',
  pending:  '⏳',
  rejected: '✗',
};
const DOC_VARIANT: Record<DocumentStatus, BadgeVariant> = {
  ok:       'emerald',
  pending:  'amber',
  rejected: 'error',
};

const STATUS_VARIANT: Record<DriverStatus, BadgeVariant> = {
  'En attente': 'amber',
  'Vérifié':    'emerald',
  'Rejeté':     'error',
  'Suspendu':   'neutral',
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
        Affichage de {from} à {to} sur {total} conducteurs
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

export function DriversTable() {
  const {
    drivers, total, pageSize, currentPage, setCurrentPage,
    setSearch, statusFilter, setStatusFilter,
    loadingId, validate, reject,
    setSelectedId, selectedDriver, detailLoading,
    fetchError,
  } = useDrivers();

  const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null);

  return (
    <>
      {selectedDriver && (
        <DriverDetailModal
          driver={selectedDriver}
          detailLoading={detailLoading}
          onClose={() => setSelectedId(null)}
          onValidate={validate}
          onReject={reject}
          loadingId={loadingId}
        />
      )}
      {confirmRejectId && (
        <ConfirmDialog
          isOpen
          onClose={() => setConfirmRejectId(null)}
          onConfirm={() => { reject(confirmRejectId); setConfirmRejectId(null); }}
          title="Rejeter le conducteur ?"
          message="La demande de vérification sera refusée. Le conducteur devra soumettre à nouveau ses documents."
          confirmLabel="Rejeter"
          variant="danger"
          icon={X}
        />
      )}

      <div className="users-table-card">
        <div className="drivers-table-header">
          <div className="drivers-table-header__left">
            <div className="drivers-table-header__title">Validation Conducteurs</div>
            <div className="drivers-table-header__subtitle">
              Gérer les demandes de vérification des conducteurs
            </div>
          </div>
          <div className="drivers-table-header__right">
            <select
              className="drivers-filter-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              {DRIVER_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              type="button"
              className="drivers-filter-btn"
              onClick={() => setSearch('')}
            >
              <AppIcon icon={Filter} size={16} color="white" />
              Filtrer
            </button>
          </div>
        </div>

        {fetchError && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
            padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#B91C1C',
          }}>
            {fetchError} — Ouvrez la console navigateur (F12) pour voir le détail de l'erreur.
          </div>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <Th>Conducteur</Th>
              <Th width="160px">Contact</Th>
              <Th width="150px">Véhicule</Th>
              <Th width="280px">Documents</Th>
              <Th width="110px">Score</Th>
              <Th width="110px">Statut</Th>
              <Th width="120px">Actions</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.length === 0 ? (
              <TableRow>
                <Td colSpan={7}>
                  <div className="data-table__empty">Aucun conducteur trouvé</div>
                </Td>
              </TableRow>
            ) : (
              drivers.map((d) => {
                const busy      = loadingId === d.id;
                const isPending = d.status === 'En attente';
                return (
                  <TableRow key={d.id}>
                    <Td>
                      <div className="data-table__user-cell">
                        <img src={d.avatar} alt={d.name} className="data-table__avatar" />
                        <div>
                          <div className="data-table__user-name">{d.name}</div>
                          <div className="data-table__user-phone">{d.driverId}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="data-table__user-name">{d.phone}</div>
                      <div className="data-table__user-phone">{d.email}</div>
                    </Td>
                    <Td>
                      <div className="data-table__user-name">{d.vehicle}</div>
                      <div className="data-table__user-phone">{d.plate}</div>
                    </Td>
                    <Td>
                      <div className="driver-docs">
                        <Badge label={`Permis ${DOC_LABEL[d.documents.permis]}`}         variant={DOC_VARIANT[d.documents.permis]}     />
                        <Badge label={`Carte Grise ${DOC_LABEL[d.documents.carteGrise]}`} variant={DOC_VARIANT[d.documents.carteGrise]} />
                        <Badge label={`Assurance ${DOC_LABEL[d.documents.assurance]}`}   variant={DOC_VARIANT[d.documents.assurance]}  />
                      </div>
                    </Td>
                    <Td>
                      <div className="driver-score">
                        <div style={scoreTrack}>
                          <div style={scoreFill(d.score)} />
                        </div>
                        <span className="driver-score__label">{d.score}%</span>
                      </div>
                    </Td>
                    <Td><Badge label={d.status} variant={STATUS_VARIANT[d.status]} /></Td>
                    <Td>
                      <div className="data-table__actions">
                        <button
                          type="button"
                          className="data-table__action-btn"
                          title="Voir"
                          onClick={() => setSelectedId(d.id)}
                        >
                          <AppIcon icon={Eye} size={16} color="#00A86B" />
                        </button>

                        {isPending ? (
                          <>
                            <button
                              type="button"
                              className="data-table__action-btn"
                              title="Valider"
                              disabled={busy}
                              onClick={() => validate(d.id)}
                            >
                              <AppIcon icon={Check} size={16} color={busy ? '#9CA3AF' : '#16A34A'} />
                            </button>
                            <button
                              type="button"
                              className="data-table__action-btn"
                              title="Rejeter"
                              disabled={busy}
                              onClick={() => setConfirmRejectId(d.id)}
                            >
                              <AppIcon icon={X} size={16} color={busy ? '#9CA3AF' : '#E53935'} />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="data-table__action-btn"
                            title="Validé"
                            disabled
                          >
                            <AppIcon icon={Check} size={16} color="#9CA3AF" />
                          </button>
                        )}
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
