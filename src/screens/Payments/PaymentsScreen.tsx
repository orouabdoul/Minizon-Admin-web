import { DashboardLayout }  from '../../components/Layout/DashboardLayout/DashboardLayout';
import { PaymentsMetrics }  from './components/PaymentsMetrics';
import { PaymentsFilters }  from './components/PaymentsFilters';
import { PaymentsTable }    from './components/PaymentsTable';
import { usePayments }      from '../../hooks/usePayments';

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
    loadingId, refund,
    setSelectedId, selectedPayment, detailLoading,
    // FedaPay sync
    syncAll, syncAllLoading, syncAllResult, syncAllError, dismissSyncResult,
    syncOne, syncOneLoading,
  } = usePayments();

  return (
    <DashboardLayout title="Gestion des Paiements">
      <div className="payments-screen">
        <PaymentsMetrics metrics={metrics} loading={metricsLoading} />

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
          loadingId={loadingId} onRefund={refund}
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
