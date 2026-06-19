import { Eye, Pencil, MoreVertical, Download, Columns } from 'lucide-react';
import { AppIcon }          from '../../../components/Common/AppIcon';
import { Badge }            from '../../../components/DataDisplay/Badge/Badge';
import {
  Table, TableHead, TableBody, TableRow, Th, Td,
} from '../../../components/DataDisplay/Table/Table';
import { TripDetailModal }  from './TripDetailModal';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';
import type { Trip, TripStatus } from '../../../models/trip.model';

interface TripsTableProps {
  trips:         Trip[];
  onView:        (id: string) => void;
  onCloseDetail: () => void;
  selectedTrip:  Trip | null;
}

function statusVariant(s: TripStatus): BadgeVariant {
  if (s === 'Actif')   return 'primary';
  if (s === 'Terminé') return 'success';
  if (s === 'Annulé')  return 'error';
  return 'warning'; // Signalé
}

export function TripsTable({ trips, onView, onCloseDetail, selectedTrip }: TripsTableProps) {
  return (
    <>
    {selectedTrip && (
      <TripDetailModal trip={selectedTrip} onClose={onCloseDetail} />
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
            <Th width="150px">Passagers</Th>
            <Th width="130px">Revenus</Th>
            <Th width="90px">Statut</Th>
            <Th width="110px">Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.length === 0 ? (
            <TableRow>
              <Td colSpan={11}>
                <div className="data-table__empty">Aucun trajet trouvé</div>
              </Td>
            </TableRow>
          ) : (
            trips.map((t) => (
              <TableRow key={t.id}>
                {/* Checkbox */}
                <Td><input type="checkbox" /></Td>

                {/* ID */}
                <Td><span className="trip-id">{t.tripId}</span></Td>

                {/* Conducteur */}
                <Td>
                  <div className="data-table__user-cell">
                    <img src={t.driverAvatar} alt={t.driverName} className="data-table__avatar" />
                    <div>
                      <div className="data-table__user-name">{t.driverName}</div>
                      <div className="data-table__user-phone">★ {t.driverRating} ({t.driverReviews} avis)</div>
                    </div>
                  </div>
                </Td>

                {/* Itinéraire */}
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

                {/* Date & Heure */}
                <Td>
                  <div className="trip-datetime">
                    <span className="trip-datetime__date">{t.date}</span>
                    <span className="trip-datetime__time">{t.time}</span>
                  </div>
                </Td>

                {/* Places */}
                <Td><span className="trip-seats">{t.seats} places</span></Td>

                {/* Prix/Place */}
                <Td><span className="trip-price">{t.pricePerSeat}</span></Td>

                {/* Passagers */}
                <Td>
                  <div className="trip-passengers">
                    <div className="trip-passenger-avatars">
                      {t.passengers.map((p) => (
                        <img
                          key={p.id}
                          src={p.avatar}
                          alt="passager"
                          className="trip-passenger-avatar"
                        />
                      ))}
                    </div>
                    <span className="trip-seat-count">{t.seatsBooked}/{t.seats}</span>
                  </div>
                </Td>

                {/* Revenus */}
                <Td><span className="trip-revenue">{t.revenue}</span></Td>

                {/* Statut */}
                <Td><Badge label={t.status} variant={statusVariant(t.status)} /></Td>

                {/* Actions */}
                <Td>
                  <div className="trip-actions">
                    <button type="button" className="trip-action-btn" title="Voir" onClick={() => onView(t.id)}>
                      <AppIcon icon={Eye} size={18} color="#4B5563" />
                    </button>
                    <button type="button" className="trip-action-btn" title="Modifier">
                      <AppIcon icon={Pencil} size={18} color="#F4B400" />
                    </button>
                    <button type="button" className="trip-action-btn" title="Plus">
                      <AppIcon icon={MoreVertical} size={18} color="#4B5563" />
                    </button>
                  </div>
                </Td>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
    </>
  );
}
