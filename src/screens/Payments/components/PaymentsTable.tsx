import { Eye, RefreshCw, Zap, Loader }  from 'lucide-react';
import { AppIcon }          from '../../../components/Common/AppIcon';
import { Badge }            from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import { PaymentDetailModal } from './PaymentDetailModal';
import type { BadgeVariant }  from '../../../components/DataDisplay/Badge/Badge';
import type { Payment, PaymentTxStatus, SyncAllResult } from '../../../models/payment.model';

interface PaymentsTableProps {
  payments:        Payment[];
  total:           number;
  pageSize:        number;
  currentPage:     number;
  setCurrentPage:  (p: number) => void;
  loading:         boolean;
  fetchError:      string | null;
  loadingId:       string | null;
  detailLoading?:  boolean;
  onRefund:        (id: string) => void;
  onView:          (id: string) => void;
  onCloseDetail:   () => void;
  selectedPayment: Payment | null;
  // FedaPay sync
  onSyncAll:       () => void;
  syncAllLoading:  boolean;
  syncAllResult:   SyncAllResult | null;
  syncAllError:    string | null;
  onDismissSync:   () => void;
  onSyncOne:       (id: string) => void;
  syncOneLoading:  boolean;
}

const STATUS_VARIANT: Record<PaymentTxStatus, BadgeVariant> = {
  'En attente': 'pending',
  'Sécurisé':   'info',
  'Libéré':     'primary',
  'Échoué':     'error',
  'Remboursé':  'neutral',
};

function methodVariant(provider: string): BadgeVariant {
  const p = provider.toLowerCase();
  if (p.includes('mtn'))  return 'emerald';
  if (p.includes('moov')) return 'amber';
  if (p.includes('wave')) return 'info';
  return 'neutral';
}

function Pagination({ total, pageSize, currentPage, onChange }: {
  total: number; pageSize: number; currentPage: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from  = (currentPage - 1) * pageSize + 1;
  const to    = Math.min(currentPage * pageSize, total);
  const start = Math.max(1, currentPage - 2);
  const pages: number[] = [];
  for (let p = start; p <= Math.min(totalPages, start + 4); p++) pages.push(p);
  return (
    <div className="payments-pagination">
      <span className="payments-pagination__info">
        Affichage de {from} à {to} sur {total.toLocaleString('fr-FR')} transactions
      </span>
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
  loading, fetchError, loadingId, detailLoading,
  onRefund, onView, onCloseDetail, selectedPayment,
  onSyncAll, syncAllLoading, syncAllResult, syncAllError, onDismissSync,
  onSyncOne, syncOneLoading,
}: PaymentsTableProps) {

  // Build sync result banner message
  const syncBannerMsg = syncAllResult
    ? `${syncAllResult.locked + syncAllResult.failed} paiement(s) mis à jour — ${syncAllResult.locked} sécurisé(s), ${syncAllResult.failed} échoué(s). ${syncAllResult.skipped} encore en attente.${syncAllResult.errors > 0 ? ` ⚠️ ${syncAllResult.errors} erreur(s) FedaPay.` : ''}`
    : null;

  return (
    <>
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={onCloseDetail}
          detailLoading={detailLoading}
          onRefund={onRefund}
          loadingId={loadingId}
          onSyncOne={onSyncOne}
          syncOneLoading={syncOneLoading}
        />
      )}

      <div className="payments-table-card">
        <div className="payments-table-header">
          <div>
            <p className="payments-table-header__title">Toutes les Transactions</p>
            <p className="payments-table-header__count">{total.toLocaleString('fr-FR')} transactions</p>
          </div>

          {/* FedaPay sync button */}
          <button
            type="button"
            onClick={onSyncAll}
            disabled={syncAllLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: '1.5px solid #2563EB',
              background: syncAllLoading ? '#F9FAFB' : '#EFF6FF',
              color: syncAllLoading ? '#9CA3AF' : '#2563EB',
              fontSize: 12, fontWeight: 700,
              cursor: syncAllLoading ? 'default' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {syncAllLoading
              ? <AppIcon icon={Loader} size={13} color="#9CA3AF" />
              : <AppIcon icon={Zap} size={13} color="#2563EB" />}
            {syncAllLoading ? 'Synchronisation…' : 'Synchroniser avec FedaPay'}
          </button>
        </div>

        {/* Sync result / error banner */}
        {(syncBannerMsg || syncAllError) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px',
            background:   syncAllError ? '#FEF2F2' : '#F0FDF4',
            borderBottom: `1px solid ${syncAllError ? '#FCA5A5' : '#BBF7D0'}`,
          }}>
            <span style={{ fontSize: 13, color: syncAllError ? '#DC2626' : '#166534', flex: 1 }}>
              {syncAllError ?? syncBannerMsg}
              {syncAllResult?.errors && syncAllResult.errors > 0
                ? <span style={{ marginLeft: 4, color: '#DC2626' }}>Certaines requêtes FedaPay ont échoué.</span>
                : null}
            </span>
            <button
              type="button"
              onClick={onDismissSync}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 16, lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <Th>Transaction</Th>
              <Th width="160px">Passager</Th>
              <Th width="160px">Conducteur</Th>
              <Th width="130px">Trajet</Th>
              <Th width="140px">Montant</Th>
              <Th width="130px">Méthode</Th>
              <Th width="130px">Date</Th>
              <Th width="110px">Statut</Th>
              <Th width="90px">Actions</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <Td colSpan={9}><div className="data-table__empty">Chargement…</div></Td>
              </TableRow>
            ) : fetchError ? (
              <TableRow>
                <Td colSpan={9}><div className="data-table__empty" style={{ color: '#E53935' }}>{fetchError}</div></Td>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <Td colSpan={9}><div className="data-table__empty">Aucune transaction trouvée</div></Td>
              </TableRow>
            ) : (
              payments.map((p) => {
                const busy = loadingId === p.id;
                return (
                  <TableRow key={p.id}>
                    <Td>
                      <div className="payment-id-cell">
                        <span className="payment-id">{p.paymentId}</span>
                        <span className="payment-ref">{p.reference}</span>
                      </div>
                    </Td>

                    <Td>
                      <div className="data-table__user-cell">
                        <img src={p.passengerAvatar} alt={p.passengerName} className="data-table__avatar" />
                        <div>
                          <div className="data-table__user-name">{p.passengerName}</div>
                          <div className="data-table__user-phone">{p.passengerPhone}</div>
                        </div>
                      </div>
                    </Td>

                    <Td>
                      <div className="data-table__user-cell">
                        <img src={p.driverAvatar} alt={p.driverName} className="data-table__avatar" />
                        <div className="data-table__user-name">{p.driverName}</div>
                      </div>
                    </Td>

                    <Td>
                      <div className="trip-route">
                        <span className="trip-route__city" style={{ fontSize: 13 }}>{p.from}</span>
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>→ {p.to}</span>
                      </div>
                    </Td>

                    <Td>
                      <div className="payment-amount-cell">
                        <span className="payment-amount">{p.amount}</span>
                        <span className="payment-fee">Comm: {p.commission}</span>
                      </div>
                    </Td>

                    <Td>
                      <Badge label={p.method} variant={methodVariant(p.provider)} />
                    </Td>

                    <Td>
                      <div className="trip-datetime">
                        <span className="trip-datetime__date">{p.createdAt.split(' ')[0]}</span>
                        <span className="trip-datetime__time">{p.createdAgo}</span>
                      </div>
                    </Td>

                    <Td><Badge label={p.status} variant={STATUS_VARIANT[p.status]} /></Td>

                    <Td>
                      <div className="trip-actions">
                        <button type="button" className="trip-action-btn" title="Voir" onClick={() => onView(p.id)}>
                          <AppIcon icon={Eye} size={16} color="#4B5563" />
                        </button>
                        {p.canRefund && (
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
