import '../../payments.css';
import { AlertTriangle, Loader, Unlock } from 'lucide-react';
import { AppIcon }              from '../../components/Common/AppIcon';
import { DashboardLayout }      from '../../components/Layout/DashboardLayout/DashboardLayout';
import { PaymentsMetrics }      from './components/PaymentsMetrics';
import { PaymentsFilters }      from './components/PaymentsFilters';
import { PaymentsTable }        from './components/PaymentsTable';
import { usePayments }          from '../../hooks/usePayments';

export function PaymentsScreen() {
  const {
    metrics, metricsLoading,
    payments, total, pageSize, currentPage, setCurrentPage,
    loading, fetchError,
    search, setSearch,
    statusFilter, setStatusFilter,
    methodFilter, setMethodFilter,
    dateFilter,   setDateFilter,
    applyFilters, resetFilters,
    loadingId,
    refundError,  dismissRefundError,
    requestRefund, cancelRefund, confirmRefund, confirmRefundId,
    releaseError, dismissReleaseError,
    requestRelease, cancelRelease, confirmRelease, confirmReleaseId,
    setSelectedId, selectedPayment, detailLoading,
    syncAll, syncAllLoading, syncAllResult, syncAllError, dismissSyncResult,
    syncOne, syncOneLoading,
  } = usePayments();

  const refundTarget  = payments.find((p) => p.id === confirmRefundId)  ?? selectedPayment ?? null;
  const releaseTarget = payments.find((p) => p.id === confirmReleaseId) ?? selectedPayment ?? null;

  return (
    <DashboardLayout title="Gestion des Paiements">
      <div className="payments-screen">

        {/* ── Confirmation remboursement ── */}
        {confirmRefundId && (
          <div className="payments-confirm-overlay">
            <div className="payments-confirm-dialog" role="dialog" aria-modal="true">
              <div className="payments-confirm-dialog__icon">
                <AppIcon icon={AlertTriangle} size={28} color="#D97706" />
              </div>
              <h3 className="payments-confirm-dialog__title">Confirmer le remboursement</h3>
              <p className="payments-confirm-dialog__body">
                {refundTarget
                  ? <>Voulez-vous vraiment rembourser le paiement de&nbsp;
                      <strong>{refundTarget.amount}</strong> pour&nbsp;
                      <strong>{refundTarget.passengerName}</strong>&nbsp;?</>
                  : 'Voulez-vous vraiment rembourser ce paiement ?'}
              </p>
              <p className="payments-confirm-dialog__warning">
                Cette action est irréversible. L'appel FedaPay sera déclenché immédiatement.
              </p>
              <div className="payments-confirm-dialog__actions">
                <button
                  type="button"
                  className="payments-confirm-dialog__btn payments-confirm-dialog__btn--cancel"
                  onClick={cancelRefund}
                  disabled={!!loadingId}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="payments-confirm-dialog__btn payments-confirm-dialog__btn--confirm"
                  onClick={confirmRefund}
                  disabled={!!loadingId}
                >
                  {loadingId
                    ? <><AppIcon icon={Loader} size={14} color="#fff" /> Traitement…</>
                    : 'Confirmer le remboursement'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirmation libération ── */}
        {confirmReleaseId && (
          <div className="payments-confirm-overlay">
            <div className="payments-confirm-dialog" role="dialog" aria-modal="true">
              <div className="payments-confirm-dialog__icon" style={{ background: '#F0FDF4' }}>
                <AppIcon icon={Unlock} size={28} color="#16A34A" />
              </div>
              <h3 className="payments-confirm-dialog__title">Confirmer la libération</h3>
              <p className="payments-confirm-dialog__body">
                {releaseTarget
                  ? <>Voulez-vous libérer&nbsp;<strong>{releaseTarget.amount}</strong> vers
                      le portefeuille de&nbsp;<strong>{releaseTarget.driverName}</strong>&nbsp;?</>
                  : 'Voulez-vous libérer les fonds de ce paiement ?'}
              </p>
              <p className="payments-confirm-dialog__warning">
                Le montant net sera crédité dans le portefeuille du conducteur. Action irréversible.
              </p>
              <div className="payments-confirm-dialog__actions">
                <button
                  type="button"
                  className="payments-confirm-dialog__btn payments-confirm-dialog__btn--cancel"
                  onClick={cancelRelease}
                  disabled={!!loadingId}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="payments-confirm-dialog__btn payments-confirm-dialog__btn--release"
                  onClick={confirmRelease}
                  disabled={!!loadingId}
                >
                  {loadingId
                    ? <><AppIcon icon={Loader} size={14} color="#fff" /> Libération…</>
                    : 'Libérer les fonds'}
                </button>
              </div>
            </div>
          </div>
        )}

        <PaymentsMetrics metrics={metrics} loading={metricsLoading} />

        {/* Refund error banner */}
        {refundError && (
          <div className="payments-refund-error">
            <span style={{ flex: 1 }}>{refundError}</span>
            <button type="button" className="payments-refund-error__close" onClick={dismissRefundError}>×</button>
          </div>
        )}

        {/* Release error banner */}
        {releaseError && (
          <div className="payments-refund-error payments-refund-error--release">
            <span style={{ flex: 1 }}>{releaseError}</span>
            <button type="button" className="payments-refund-error__close" onClick={dismissReleaseError}>×</button>
          </div>
        )}

        <PaymentsFilters
          statusFilter={statusFilter} methodFilter={methodFilter}
          dateFilter={dateFilter} search={search}
          onStatus={setStatusFilter} onMethod={setMethodFilter}
          onDate={setDateFilter} onSearch={setSearch}
          onReset={resetFilters}
          onFilter={applyFilters}
        />

        <PaymentsTable
          payments={payments} total={total} pageSize={pageSize}
          currentPage={currentPage} setCurrentPage={setCurrentPage}
          loading={loading} fetchError={fetchError}
          loadingId={loadingId}
          onRefund={requestRefund}
          onRelease={requestRelease}
          detailLoading={detailLoading}
          onView={setSelectedId}
          onCloseDetail={() => setSelectedId(null)}
          selectedPayment={selectedPayment}
          onSyncAll={syncAll}
          syncAllLoading={syncAllLoading}
          syncAllResult={syncAllResult}
          syncAllError={syncAllError}
          onDismissSync={dismissSyncResult}
          onSyncOne={syncOne}
          syncOneLoading={syncOneLoading}
        />
      </div>
    </DashboardLayout>
  );
}
