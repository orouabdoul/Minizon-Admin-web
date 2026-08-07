import { Eye, RefreshCw, Zap, Loader, BadgeCheck, Unlock } from 'lucide-react';
import { AppIcon }          from '../../../components/Common/AppIcon';
import { Badge }            from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import { PaymentDetailModal } from './PaymentDetailModal';
import type { BadgeVariant }  from '../../../components/DataDisplay/Badge/Badge';
import type { Payment, PaymentTxStatus, SyncAllResult } from '../../../models/payment.model';

// ── Badge variants ──────────────────────────────────────────────────────
const STATUS_VARIANT: Record<PaymentTxStatus, BadgeVariant> = {
  'En attente': 'pending',
  'Sécurisé':   'amber',
  'Libéré':     'primary',
  'Échoué':     'error',
  'Remboursé':  'neutral',
};

function methodVariant(provider: string): BadgeVariant {
  const p = provider.toLowerCase();
  if (p.includes('mtn'))     return 'emerald';
  if (p.includes('moov'))    return 'amber';
  if (p.includes('celtiis')) return 'info';
  if (p.includes('wave'))    return 'primary';
  return 'neutral';
}

const AVATAR_FALLBACK = 'https://placehold.co/30x30/F3F4F6/9CA3AF?text=?';

// ── Pagination ──────────────────────────────────────────────────────────
function Pagination({ total, pageSize, currentPage, onChange }: {
  total: number; pageSize: number; currentPage: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from  = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to    = Math.min(currentPage * pageSize, total);
  const start = Math.max(1, currentPage - 2);
  const pages: number[] = [];
  for (let p = start; p <= Math.min(totalPages, start + 4); p++) pages.push(p);

  return (
    <div className="payments-pagination">
      <span className="payments-pagination__info">
        {total === 0
          ? 'Aucune transaction'
          : `${from} – ${to} sur ${total.toLocaleString('fr-FR')} transactions`}
      </span>
      <div className="payments-pagination__pages">
        <button
          type="button"
          className="payments-pagination__btn"
          disabled={currentPage === 1}
          onClick={() => onChange(currentPage - 1)}
        >
          ← Précédent
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`payments-pagination__btn${p === currentPage ? ' payments-pagination__btn--active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className="payments-pagination__btn"
          disabled={currentPage === totalPages}
          onClick={() => onChange(currentPage + 1)}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

// ── Props ───────────────────────────────────────────────────────────────
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
  onRelease:       (id: string) => void;
  onView:          (id: string) => void;
  onCloseDetail:   () => void;
  selectedPayment: Payment | null;
  // FedaPay sync
  onSyncAll:      () => void;
  syncAllLoading: boolean;
  syncAllResult:  SyncAllResult | null;
  syncAllError:   string | null;
  onDismissSync:  () => void;
  onSyncOne:      (id: string) => void;
  syncOneLoading: boolean;
}

// ── Component ───────────────────────────────────────────────────────────
export function PaymentsTable({
  payments, total, pageSize, currentPage, setCurrentPage,
  loading, fetchError, loadingId, detailLoading,
  onRefund, onRelease, onView, onCloseDetail, selectedPayment,
  onSyncAll, syncAllLoading, syncAllResult, syncAllError, onDismissSync,
  onSyncOne, syncOneLoading,
}: PaymentsTableProps) {

  const syncBannerMsg = syncAllResult
    ? `${syncAllResult.locked + syncAllResult.failed} paiement(s) mis à jour — ` +
      `${syncAllResult.locked} sécurisé(s), ${syncAllResult.failed} échoué(s), ` +
      `${syncAllResult.skipped} encore en attente.` +
      (syncAllResult.errors > 0 ? ` ⚠️ ${syncAllResult.errors} erreur(s) FedaPay.` : '')
    : null;

  return (
    <>
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={onCloseDetail}
          detailLoading={detailLoading}
          onRefund={onRefund}
          onRelease={onRelease}
          loadingId={loadingId}
          onSyncOne={onSyncOne}
          syncOneLoading={syncOneLoading}
        />
      )}

      <div className="payments-table-card">

        {/* Header */}
        <div className="payments-table-header">
          <div>
            <p className="payments-table-header__title">Toutes les Transactions</p>
            <p className="payments-table-header__count">
              {total.toLocaleString('fr-FR')} transactions au total
            </p>
          </div>

          {/* FedaPay sync */}
          <button
            type="button"
            onClick={onSyncAll}
            disabled={syncAllLoading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 9,
              border: '1.5px solid #2563EB',
              background: syncAllLoading ? '#F9FAFB' : '#EFF6FF',
              color: syncAllLoading ? '#9CA3AF' : '#2563EB',
              fontSize: 12, fontWeight: 700,
              cursor: syncAllLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s', fontFamily: 'inherit',
            }}
          >
            {syncAllLoading
              ? <AppIcon icon={Loader} size={13} color="#9CA3AF" />
              : <AppIcon icon={Zap}    size={13} color="#2563EB" />}
            {syncAllLoading ? 'Synchronisation…' : 'Sync FedaPay'}
          </button>
        </div>

        {/* Sync result / error banner */}
        {(syncBannerMsg || syncAllError) && (
          <div className={`payments-sync-banner payments-sync-banner--${syncAllError ? 'error' : 'success'}`}>
            <span style={{ flex: 1 }}>{syncAllError ?? syncBannerMsg}</span>
            <button type="button" className="payments-sync-banner__close" onClick={onDismissSync}>×</button>
          </div>
        )}

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <Th>Transaction</Th>
              <Th width="170px">Passager</Th>
              <Th width="155px">Conducteur</Th>
              <Th width="120px">Trajet</Th>
              <Th width="130px">Montant</Th>
              <Th width="120px">Opérateur</Th>
              <Th width="120px">Date</Th>
              <Th width="105px">Statut</Th>
              <Th width="80px">Actions</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <Td colSpan={9}>
                  <div className="data-table__empty" style={{ color: '#6B7280' }}>
                    Chargement des transactions…
                  </div>
                </Td>
              </TableRow>
            ) : fetchError ? (
              <TableRow>
                <Td colSpan={9}>
                  <div className="data-table__empty" style={{ color: '#E53935' }}>
                    {fetchError}
                  </div>
                </Td>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <Td colSpan={9}>
                  <div className="data-table__empty">Aucune transaction trouvée</div>
                </Td>
              </TableRow>
            ) : (
              payments.map((p) => {
                const busy = loadingId === p.id;
                return (
                  <TableRow key={p.id}>

                    {/* Transaction ID + ref */}
                    <Td>
                      <div className="payment-id-cell">
                        <span className="payment-id">{p.paymentId}</span>
                        <span className="payment-ref">{p.reference}</span>
                      </div>
                    </Td>

                    {/* Passager */}
                    <Td>
                      <div className="data-table__user-cell">
                        <img
                          src={p.passengerAvatar || AVATAR_FALLBACK}
                          alt={p.passengerName}
                          className="data-table__avatar"
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="data-table__user-name">{p.passengerName}</span>
                            {p.passengerVerified && (
                              <span title="Compte vérifié">
                                <AppIcon icon={BadgeCheck} size={13} color="#2563EB" />
                              </span>
                            )}
                          </div>
                          <div className="data-table__user-phone">{p.passengerPhone}</div>
                        </div>
                      </div>
                    </Td>

                    {/* Conducteur */}
                    <Td>
                      <div className="data-table__user-cell">
                        <img
                          src={p.driverAvatar || AVATAR_FALLBACK}
                          alt={p.driverName}
                          className="data-table__avatar"
                        />
                        <span className="data-table__user-name">{p.driverName}</span>
                      </div>
                    </Td>

                    {/* Trajet */}
                    <Td>
                      <div className="trip-route">
                        <span className="trip-route__city">{p.from}</span>
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>→ {p.to}</span>
                      </div>
                    </Td>

                    {/* Montant */}
                    <Td>
                      <div className="payment-amount-cell">
                        <span className="payment-amount">{p.amount}</span>
                        <span className="payment-net">{p.netAmount}</span>
                        <span className="payment-fee">comm. {p.commission}</span>
                      </div>
                    </Td>

                    {/* Opérateur */}
                    <Td>
                      <Badge label={p.method} variant={methodVariant(p.provider)} />
                    </Td>

                    {/* Date */}
                    <Td>
                      <div className="trip-datetime">
                        <span className="trip-datetime__date">
                          {p.createdAt.split(' ')[0]}
                        </span>
                        <span className="trip-datetime__time">{p.createdAgo}</span>
                      </div>
                    </Td>

                    {/* Statut */}
                    <Td>
                      <Badge label={p.status} variant={STATUS_VARIANT[p.status] ?? 'neutral'} />
                    </Td>

                    {/* Actions */}
                    <Td>
                      <div className="trip-actions">
                        <button
                          type="button"
                          className="trip-action-btn"
                          title="Voir le détail"
                          onClick={() => onView(p.id)}
                        >
                          <AppIcon icon={Eye} size={15} color="#4B5563" />
                        </button>

                        {p.status === 'Sécurisé' && (
                          <button
                            type="button"
                            className="trip-action-btn"
                            title="Libérer les fonds"
                            disabled={busy}
                            onClick={() => onRelease(p.id)}
                          >
                            <AppIcon icon={Unlock} size={15} color={busy ? '#9CA3AF' : '#16A34A'} />
                          </button>
                        )}

                        {p.canRefund && (
                          <button
                            type="button"
                            className="trip-action-btn"
                            title="Rembourser"
                            disabled={busy}
                            onClick={() => onRefund(p.id)}
                          >
                            <AppIcon icon={RefreshCw} size={15} color={busy ? '#9CA3AF' : '#E53935'} />
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
