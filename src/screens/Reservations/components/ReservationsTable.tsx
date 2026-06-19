import { Eye, Pencil, MoreVertical, Star, Download } from 'lucide-react';
import { AppIcon }  from '../../../components/Common/AppIcon';
import { Badge }    from '../../../components/DataDisplay/Badge/Badge';
import {
  Table, TableHead, TableBody, TableRow, Th, Td,
} from '../../../components/DataDisplay/Table/Table';
import { ReservationDetailModal } from './ReservationDetailModal';
import type { BadgeVariant } from '../../../components/DataDisplay/Badge/Badge';
import type { Reservation, ReservationStatus, ReservationRisk, PaymentStatus } from '../../../models/reservation.model';

interface ReservationsTableProps {
  reservations:        Reservation[];
  total:               number;
  pageSize:            number;
  currentPage:         number;
  setCurrentPage:      (p: number) => void;
  onView:              (id: string) => void;
  onCloseDetail:       () => void;
  selectedReservation: Reservation | null;
}

const STATUS_VARIANT: Record<ReservationStatus, BadgeVariant> = {
  Confirmée:    'primary',
  'En attente': 'pending',
  Annulée:      'error',
  Terminée:     'success',
};
const RISK_VARIANT: Record<ReservationRisk, BadgeVariant> = {
  Faible: 'lime',
  Moyen:  'amber',
  Élevé:  'error',
};
const PAYMENT_COLOR: Record<PaymentStatus, string> = {
  Payé:         '#00A86B',
  'En attente': '#F4B400',
  Échoué:       '#E53935',
  Remboursé:    '#6B7280',
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
    <div className="reservations-pagination">
      <span className="reservations-pagination__info">
        Affichage de {from} à {to} sur {total.toLocaleString('fr')} réservations
      </span>
      <div className="reservations-pagination__pages">
        <button
          type="button"
          className="reservations-pagination__btn"
          disabled={currentPage === 1}
          onClick={() => onChange(currentPage - 1)}
        >
          Précédent
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`reservations-pagination__btn${p === currentPage ? ' reservations-pagination__btn--active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className="reservations-pagination__btn"
          disabled={currentPage === totalPages}
          onClick={() => onChange(currentPage + 1)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export function ReservationsTable({
  reservations, total, pageSize, currentPage, setCurrentPage,
  onView, onCloseDetail, selectedReservation,
}: ReservationsTableProps) {
  return (
    <>
    {selectedReservation && (
      <ReservationDetailModal reservation={selectedReservation} onClose={onCloseDetail} />
    )}
    <div className="reservations-table-card">
      <div className="reservations-table-header">
        <div>
          <p className="reservations-table-header__title">Toutes les Réservations</p>
          <p className="reservations-table-header__count">{total.toLocaleString('fr')} réservations</p>
        </div>
        <button type="button" className="reservations-export-btn">
          <AppIcon icon={Download} size={14} color="#9CA3AF" />
        </button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <Th>Réservation</Th>
            <Th width="170px">Passager</Th>
            <Th width="160px">Conducteur</Th>
            <Th width="120px">Trajet</Th>
            <Th width="140px">Date/Heure</Th>
            <Th width="140px">Montant</Th>
            <Th width="110px">Statut</Th>
            <Th width="90px">Risque</Th>
            <Th width="110px">Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <Td colSpan={9}>
                <div className="data-table__empty">Aucune réservation trouvée</div>
              </Td>
            </TableRow>
          ) : (
            reservations.map((r) => (
              <TableRow key={r.id}>
                {/* Réservation */}
                <Td>
                  <div className="reservation-id-cell">
                    <span className="reservation-id">{r.reservationId}</span>
                    <span className="reservation-ago">{r.createdAgo}</span>
                  </div>
                </Td>

                {/* Passager */}
                <Td>
                  <div className="data-table__user-cell">
                    <img src={r.passengerAvatar} alt={r.passengerName} className="data-table__avatar" />
                    <div>
                      <div className="data-table__user-name">{r.passengerName}</div>
                      <div className="data-table__user-phone" style={{ color: r.passengerVerified ? '#00A86B' : '#6B7280' }}>
                        {r.passengerVerified ? 'Vérifiée' : 'Nouveau'}
                      </div>
                    </div>
                  </div>
                </Td>

                {/* Conducteur */}
                <Td>
                  <div className="data-table__user-cell">
                    <img src={r.driverAvatar} alt={r.driverName} className="data-table__avatar" />
                    <div>
                      <div className="data-table__user-name">{r.driverName}</div>
                      <div className="data-table__user-phone" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AppIcon icon={Star} size={12} color="#F4B400" />
                        {r.driverRating}
                      </div>
                    </div>
                  </div>
                </Td>

                {/* Trajet */}
                <Td>
                  <div className="reservation-route">
                    <span className="reservation-route__text">{r.from} → {r.to}</span>
                    <span className="reservation-route__seats">{r.seats} place{r.seats > 1 ? 's' : ''}</span>
                  </div>
                </Td>

                {/* Date/Heure */}
                <Td>
                  <div className="trip-datetime">
                    <span className="trip-datetime__date">{r.date}</span>
                    <span className="trip-datetime__time">{r.time}</span>
                  </div>
                </Td>

                {/* Montant */}
                <Td>
                  <div className="reservation-amount">
                    <span className="reservation-amount__value">{r.amount}</span>
                    <span style={{ fontSize: 13, color: PAYMENT_COLOR[r.paymentStatus] }}>{r.paymentStatus}</span>
                  </div>
                </Td>

                {/* Statut */}
                <Td><Badge label={r.status} variant={STATUS_VARIANT[r.status]} /></Td>

                {/* Risque */}
                <Td><Badge label={r.riskLevel} variant={RISK_VARIANT[r.riskLevel]} /></Td>

                {/* Actions */}
                <Td>
                  <div className="trip-actions">
                    <button type="button" className="trip-action-btn" title="Voir" onClick={() => onView(r.id)}>
                      <AppIcon icon={Eye} size={16} color="#9CA3AF" />
                    </button>
                    <button type="button" className="trip-action-btn" title="Modifier">
                      <AppIcon icon={Pencil} size={16} color="#9CA3AF" />
                    </button>
                    <button type="button" className="trip-action-btn" title="Plus">
                      <AppIcon icon={MoreVertical} size={16} color="#9CA3AF" />
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
        onChange={setCurrentPage}
      />
    </div>
    </>
  );
}
