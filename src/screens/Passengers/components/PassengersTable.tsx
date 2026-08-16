import {
  Eye, UserX, UserCheck, Phone, Mail, MapPin, TrendingUp,
} from 'lucide-react';
import { AppIcon }              from '../../../components/Common/AppIcon';
import { Badge }                from '../../../components/DataDisplay/Badge/Badge';
import {
  Table, TableHead, TableBody, TableRow, Th, Td,
} from '../../../components/DataDisplay/Table/Table';
import { PassengerDetailModal } from './PassengerDetailModal';
import type { BadgeVariant }    from '../../../components/DataDisplay/Badge/Badge';
import type { Passenger, PassengerStatus, RiskLevel } from '../../../models/passenger.model';

interface PassengersTableProps {
  passengers:        Passenger[];
  total:             number;
  pageSize:          number;
  currentPage:       number;
  onPageChange:      (p: number) => void;
  loadingId:         string | null;
  onSuspend:         (id: string) => void;
  onUnsuspend:       (id: string) => void;
  onView:            (id: string) => void;
  onCloseDetail:     () => void;
  selectedPassenger: Passenger | null;
  detailLoading?:    boolean;
  onApproveKyc?:     (id: string) => void;
  onRejectKyc?:      (id: string) => void;
}

function Pagination({
  total, pageSize, currentPage, onChange,
}: { total: number; pageSize: number; currentPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / pageSize);
  const from  = (currentPage - 1) * pageSize + 1;
  const to    = Math.min(currentPage * pageSize, total);
  const start = Math.max(1, currentPage - 2);
  const end   = Math.min(totalPages, start + 4);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return (
    <div className="users-pagination">
      <span className="users-pagination__info">
        Affichage de {from} à {to} sur {total} passagers
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

function statusVariant(s: PassengerStatus): BadgeVariant {
  if (s === 'Actif')   return 'primary';
  if (s === 'Inactif') return 'neutral';
  return 'warning';
}

function riskVariant(r: RiskLevel): BadgeVariant {
  if (r === 'Faible') return 'lime';
  if (r === 'Moyen')  return 'amber';
  return 'error';
}

export function PassengersTable({
  passengers, total, pageSize, currentPage, onPageChange,
  loadingId, onSuspend, onUnsuspend, onView, onCloseDetail,
  selectedPassenger, detailLoading, onApproveKyc, onRejectKyc,
}: PassengersTableProps) {
  return (
    <>
    {selectedPassenger && (
      <PassengerDetailModal
        passenger={selectedPassenger}
        detailLoading={detailLoading}
        onClose={onCloseDetail}
        onApproveKyc={onApproveKyc}
        onRejectKyc={onRejectKyc}
        loadingId={loadingId}
      />
    )}
    <div className="passengers-table-card">
      <div className="passengers-table-header">
        <div>
          <p className="passengers-table-header__title">Gestion des Passagers</p>
          <p className="passengers-table-header__subtitle">{total} passagers inscrits sur la plateforme</p>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <Th><input type="checkbox" /></Th>
            <Th>Passager</Th>
            <Th width="180px">Contact</Th>
            <Th width="110px">Ville</Th>
            <Th width="120px">Réservations</Th>
            <Th width="140px">Dépenses</Th>
            <Th width="130px">Inscription</Th>
            <Th width="90px">Statut</Th>
            <Th width="90px">Risque</Th>
            <Th width="100px">Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {passengers.length === 0 ? (
            <TableRow>
              <Td colSpan={13}>
                <div className="data-table__empty">Aucun passager trouvé</div>
              </Td>
            </TableRow>
          ) : (
            passengers.map((p) => {
              const busy = loadingId === p.id;
              return (
                <TableRow key={p.id}>
                  {/* Checkbox */}
                  <Td><input type="checkbox" /></Td>

                  {/* Passager */}
                  <Td>
                    <div className="passenger-identity">
                      <img src={p.avatar ?? 'https://placehold.co/40x40'} alt={p.name} className="passenger-avatar" />
                      <div>
                        <p className="passenger-name">{p.name}</p>
                        <p className="passenger-id">{p.passengerId}</p>
                      </div>
                    </div>
                  </Td>

                  {/* Contact */}
                  <Td>
                    <div className="passenger-contact">
                      <span className="passenger-contact__row">
                        <AppIcon icon={Phone} size={12} color="#6B7280" />
                        {p.phone}
                      </span>
                      {p.email && (
                        <span className="passenger-contact__row">
                          <AppIcon icon={Mail} size={12} color="#6B7280" />
                          {p.email}
                        </span>
                      )}
                    </div>
                  </Td>

                  {/* Ville */}
                  <Td>
                    {p.city ? (
                      <span className="passenger-city">
                        <AppIcon icon={MapPin} size={14} color="#6B7280" />
                        {p.city}
                      </span>
                    ) : <span className="data-table__user-phone">—</span>}
                  </Td>

                  {/* Réservations */}
                  <Td>
                    <span className="passenger-reservations">
                      <AppIcon icon={TrendingUp} size={14} color="#7C3AED" />
                      {p.reservations}
                    </span>
                  </Td>

                  {/* Dépenses */}
                  <Td><span className="passenger-spending">{p.spending}</span></Td>

                   
                  {/* Inscription */}
                  <Td>
                    <div className="passenger-date">
                      <span>{p.createdAt}</span>
                      <span className="passenger-date__ago">{p.createdAgo}</span>
                    </div>
                  </Td>

                  

                  {/* Statut */}
                  <Td><Badge label={p.status} variant={statusVariant(p.status)} /></Td>

                  {/* Risque */}
                  <Td><Badge label={p.riskLevel} variant={riskVariant(p.riskLevel)} /></Td>

                  {/* Actions */}
                  <Td>
                    <div className="data-table__actions">
                      <button
                        type="button"
                        className="data-table__action-btn"
                        title="Voir"
                        disabled={busy}
                        onClick={() => onView(p.id)}
                      >
                        <AppIcon icon={Eye} size={16} color="#7C3AED" />
                      </button>
                      {p.status !== 'Suspendu' ? (
                        <button
                          type="button"
                          className="data-table__action-btn"
                          title="Suspendre"
                          disabled={busy}
                          onClick={() => onSuspend(p.id)}
                        >
                          <AppIcon icon={UserX} size={16} color={busy ? '#9CA3AF' : '#FB8C00'} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="data-table__action-btn"
                          title="Activer"
                          disabled={busy}
                          onClick={() => onUnsuspend(p.id)}
                        >
                          <AppIcon icon={UserCheck} size={16} color={busy ? '#9CA3AF' : '#7C3AED'} />
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
        onChange={onPageChange}
      />
    </div>
    </>
  );
}
