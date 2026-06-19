import { DashboardLayout }  from '../../components/Layout/DashboardLayout/DashboardLayout';
import { PaymentsMetrics }  from './components/PaymentsMetrics';
import { PaymentsFilters }  from './components/PaymentsFilters';
import { PaymentsTable }    from './components/PaymentsTable';
import { usePayments }      from '../../hooks/usePayments';

export function PaymentsScreen() {
  const {
    payments, total, pageSize, currentPage, setCurrentPage,
    search, setSearch,
    statusFilter, setStatusFilter,
    methodFilter, setMethodFilter,
    dateFilter,   setDateFilter,
    loadingId, refund, resetFilters,
    setSelectedId, selectedPayment,
  } = usePayments();

  return (
    <DashboardLayout title="Gestion des Paiements">
      <div className="payments-screen">
        <PaymentsMetrics />

        <PaymentsFilters
          statusFilter={statusFilter} methodFilter={methodFilter}
          dateFilter={dateFilter} search={search}
          onStatus={setStatusFilter} onMethod={setMethodFilter}
          onDate={setDateFilter} onSearch={setSearch}
          onReset={resetFilters}
        />

        <PaymentsTable
          payments={payments} total={total} pageSize={pageSize}
          currentPage={currentPage} setCurrentPage={setCurrentPage}
          loadingId={loadingId} onRefund={refund}
          onView={setSelectedId}
          onCloseDetail={() => setSelectedId(null)}
          selectedPayment={selectedPayment}
        />
      </div>
    </DashboardLayout>
  );
}
