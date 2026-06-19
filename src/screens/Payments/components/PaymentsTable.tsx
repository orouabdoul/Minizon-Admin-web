import { Eye, RefreshCw } from 'lucide-react';
import { AppIcon }         from '../../../components/Common/AppIcon';
import { Badge }           from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import { PaymentDetailModal } from './PaymentDetailModal';
import type { BadgeVariant }   from '../../../components/DataDisplay/Badge/Badge';
import type { Payment, PaymentTxStatus, PaymentMethod } from '../../../models/payment.model';

interface PaymentsTableProps {
  payments:        Payment[];
  total:           number;
  pageSize:        number;
  currentPage:     number;
  setCurrentPage:  (p: number) => void;
  loadingId:       string | null;
  onRefund:        (id: string) => void;
  onView:          (id: string) => void;
  onCloseDetail:   () => void;
  selectedPayment: Payment | null;
}

const STATUS_VARIANT: Record<PaymentTxStatus, BadgeVariant> = {
  Succès:       'primary',
  'En attente': 'pending',
  Échoué:       'error',
  Remboursé:    'neutral',
};
const METHOD_VARIANT: Record<PaymentMethod, BadgeVariant> = {
  'Mobile Money':   'emerald',
  'Carte bancaire': 'info',
  'Virement':       'neutral',
  'Cash':           'amber',
};

function Pagination({ total, pageSize, currentPage, onChange }: { total: number; pageSize: number; currentPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize + 1;
  const to   = Math.min(currentPage * pageSize, total);
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  for (let p = start; p <= Math.min(totalPages, start + 4); p++) pages.push(p);
  return (
    <div className="payments-pagination">
      <span className="payments-pagination__info">Affichage de {from} à {to} sur {total.toLocaleString('fr')} transactions</span>
      <div className="payments-pagination__pages">
        <button type="button" className="payments-pagination__btn" disabled={currentPage === 1} onClick={() => onChange(currentPage - 1)}>Précédent</button>
        {pages.map((p) => (
          <button key={p} type="button" className={`payments-pagination__btn${p === currentPage ? ' payments-pagination__btn--active' : ''}`} onClick={() => onChange(p)}>{p}</button>
        ))}
        <button type="button" className="payments-pagination__btn" disabled={currentPage === totalPages} onClick={() => onChange(currentPage + 1)}>Suivant</button>
      </div>
    </div>
  );
}

export function PaymentsTable({
  payments, total, pageSize, currentPage, setCurrentPage,
  loadingId, onRefund, onView, onCloseDetail, selectedPayment,
}: PaymentsTableProps) {
  return (
    <>
    {selectedPayment && <PaymentDetailModal payment={selectedPayment} onClose={onCloseDetail} />}
    <div className="payments-table-card">
      <div className="payments-table-header">
        <div>
          <p className="payments-table-header__title">Toutes les Transactions</p>
          <p className="payments-table-header__count">{total.toLocaleString('fr')} transactions</p>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <Th>Transaction</Th>
            <Th width="160px">Passager</Th>
            <Th width="160px">Conducteur</Th>
            <Th width="140px">Montant</Th>
            <Th width="140px">Méthode</Th>
            <Th width="140px">Date</Th>
            <Th width="110px">Statut</Th>
            <Th width="110px">Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow><Td colSpan={8}><div className="data-table__empty">Aucune transaction trouvée</div></Td></TableRow>
          ) : (
            payments.map((p) => {
              const busy = loadingId === p.id;
              return (
                <TableRow key={p.id}>
                  {/* Transaction */}
                  <Td>
                    <div className="payment-id-cell">
                      <span className="payment-id">{p.transactionId}</span>
                      <span className="payment-ref">{p.reference}</span>
                    </div>
                  </Td>

                  {/* Passager */}
                  <Td>
                    <div className="data-table__user-cell">
                      <img src={p.passengerAvatar} alt={p.passengerName} className="data-table__avatar" />
                      <div className="data-table__user-name">{p.passengerName}</div>
                    </div>
                  </Td>

                  {/* Conducteur */}
                  <Td>
                    <div className="data-table__user-cell">
                      <img src={p.driverAvatar} alt={p.driverName} className="data-table__avatar" />
                      <div className="data-table__user-name">{p.driverName}</div>
                    </div>
                  </Td>

                  {/* Montant */}
                  <Td>
                    <div className="payment-amount-cell">
                      <span className="payment-amount">{p.amount}</span>
                      <span className="payment-fee">Frais: {p.fee}</span>
                    </div>
                  </Td>

                  {/* Méthode */}
                  <Td><Badge label={p.method} variant={METHOD_VARIANT[p.method]} /></Td>

                  {/* Date */}
                  <Td>
                    <div className="trip-datetime">
                      <span className="trip-datetime__date">{p.date}</span>
                      <span className="trip-datetime__time">{p.time}</span>
                    </div>
                  </Td>

                  {/* Statut */}
                  <Td><Badge label={p.status} variant={STATUS_VARIANT[p.status]} /></Td>

                  {/* Actions */}
                  <Td>
                    <div className="trip-actions">
                      <button type="button" className="trip-action-btn" title="Voir" onClick={() => onView(p.id)}>
                        <AppIcon icon={Eye} size={16} color="#4B5563" />
                      </button>
                      {p.status === 'Succès' && (
                        <button type="button" className="trip-action-btn" title="Rembourser" disabled={busy} onClick={() => onRefund(p.id)}>
                          <AppIcon icon={RefreshCw} size={16} color={busy ? '#9CA3AF' : '#E53935'} />
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
      <Pagination total={total} pageSize={pageSize} currentPage={currentPage} onChange={setCurrentPage} />
    </div>
    </>
  );
}
