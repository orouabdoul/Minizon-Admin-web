import { Eye, Download, Columns, Trash2 } from 'lucide-react';
import { AppIcon }         from '../../../components/Common/AppIcon';
import { Badge }           from '../../../components/DataDisplay/Badge/Badge';
import {
  Table, TableHead, TableBody, TableRow, Th, Td,
} from '../../../components/DataDisplay/Table/Table';
import { TripDetailModal } from './TripDetailModal';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';
import type { Trip, TripStatus } from '../../../models/trip.model';
import type { ApiTripStatus }    from '../../../services/trip_service';

interface TripsTableProps {
  trips:          Trip[];
  total:          number;
  pageSize:       number;
  currentPage:    number;
  loading:        boolean;
  fetchError:     string | null;
  onView:         (id: string) => void;
  onCloseDetail:  () => void;
  selectedTrip:   Trip | null;
  detailLoading?: boolean;
  onPageChange:   (p: number) => void;
  onUpdateStatus: (id: string, status: ApiTripStatus) => void;
  onDelete:       (id: string) => void;
}

function statusVariant(s: TripStatus): BadgeVariant {
  if (s === 'Actif')   return 'primary';
  if (s === 'Terminé') return 'success';
  if (s === 'Annulé')  return 'error';
  return 'warning';
}

function Pagination({
  total, pageSize, currentPage, onChange,
}: { total: number; pageSize: number; currentPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  const from  = (currentPage - 1) * pageSize + 1;
  const to    = Math.min(currentPage * pageSize, total);
  const start = Math.max(1, currentPage - 2);
  const end   = Math.min(totalPages, start + 4);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return (
    <div className="users-pagination">
      <span className="users-pagination__info">
        Affichage de {from} à {to} sur {total} trajets
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

export function TripsTable({
  trips, total, pageSize, currentPage, loading, fetchError,
  onView, onCloseDetail, selectedTrip, detailLoading, onPageChange, onUpdateStatus, onDelete,
}: TripsTableProps) {
  return (
    <>
      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          detailLoading={detailLoading}
          onClose={onCloseDetail}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      <div className="trips-table-card">
        <div className="trips-table-header">
          <span className="trips-table-header__title">Liste des Trajets</span>
          <div className="trips-table-header-actions">
            <button type="button" className="trips-export-btn">
              <AppIcon icon={Download} size={14} color="#111827" />
              Exporter
            </button>
            <button type="button" className="trips-columns-btn">
              <AppIcon icon={Columns} size={14} color="#111827" />
              Colonnes
            </button>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <Th><input type="checkbox" /></Th>
              <Th width="110px">ID Trajet</Th>
              <Th width="190px">Conducteur</Th>
              <Th width="140px">Itinéraire</Th>
              <Th width="130px">Date &amp; Heure</Th>
              <Th width="90px">Places</Th>
              <Th width="120px">Prix/Place</Th>
              <Th width="130px">Passagers</Th>
              <Th width="130px">Revenus</Th>
              <Th width="90px">Statut</Th>
              <Th width="100px">Actions</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <Td colSpan={11}>
                  <div className="data-table__empty">Chargement…</div>
                </Td>
              </TableRow>
            ) : fetchError ? (
              <TableRow>
                <Td colSpan={11}>
                  <div className="data-table__empty" style={{ color: '#E53935' }}>{fetchError}</div>
                </Td>
              </TableRow>
            ) : trips.length === 0 ? (
              <TableRow>
                <Td colSpan={11}>
                  <div className="data-table__empty">Aucun trajet trouvé</div>
                </Td>
              </TableRow>
            ) : (
              trips.map((t) => (
                <TableRow key={t.id}>
                  <Td><input type="checkbox" /></Td>

                  <Td><span className="trip-id">{t.tripId}</span></Td>

                  <Td>
                    <div className="data-table__user-cell">
                      <img src={t.driverAvatar} alt={t.driverName} className="data-table__avatar" />
                      <div>
                        <div className="data-table__user-name">{t.driverName}</div>
                        <div className="data-table__user-phone">
                          ★ {t.driverRating} ({t.driverReviews} avis)
                        </div>
                      </div>
                    </div>
                  </Td>

                  <Td>
                    <div className="trip-route">
                      <span className="trip-route__city">{t.from}</span>
                      <div className="trip-route__dots">
                        <span className="trip-route__dot" />
                        <span className="trip-route__dot" />
                        <span className="trip-route__dot" />
                      </div>
                      <span className="trip-route__city">{t.to}</span>
                    </div>
                  </Td>

                  <Td>
                    <div className="trip-datetime">
                      <span className="trip-datetime__date">{t.date}</span>
                      <span className="trip-datetime__time">{t.time}</span>
                    </div>
                  </Td>

                  <Td><span className="trip-seats">{t.seats} places</span></Td>

                  <Td><span className="trip-price">{t.pricePerSeat}</span></Td>

                  <Td>
                    <div className="trip-passengers">
                      <div className="trip-passenger-avatars">
                        {t.passengers.slice(0, 3).map((p) => (
                          <img key={p.id} src={p.avatar} alt="passager" className="trip-passenger-avatar" />
                        ))}
                      </div>
                      <span className="trip-seat-count">{t.seatsBooked}/{t.seats}</span>
                    </div>
                  </Td>

                  <Td><span className="trip-revenue">{t.revenue}</span></Td>

                  <Td><Badge label={t.status} variant={statusVariant(t.status)} /></Td>

                  <Td>
                    <div className="trip-actions">
                      <button type="button" className="trip-action-btn" title="Voir" onClick={() => onView(t.id)}>
                        <AppIcon icon={Eye} size={18} color="#4B5563" />
                      </button>
                      <button type="button" className="trip-action-btn" title="Supprimer" onClick={() => onDelete(t.id)}>
                        <AppIcon icon={Trash2} size={16} color="#E53935" />
                      </button>
                    </div>
                  </Td>
                </TableRow>
              ))
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
