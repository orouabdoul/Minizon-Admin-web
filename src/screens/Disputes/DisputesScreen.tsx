import { DashboardLayout }    from '../../components/Layout/DashboardLayout/DashboardLayout';
import { DisputesMetrics }    from './components/DisputesMetrics';
import { DisputesTable }      from './components/DisputesTable';
import { DisputeDetailPanel } from './components/DisputeDetailPanel';
import { useDisputes }        from '../../hooks/useDisputes';

export function DisputesScreen() {
  const {
    metrics, metricsLoading,
    disputes, total, pageSize, currentPage, setCurrentPage,
    loading, fetchError,
    search, setSearch,
    tabFilter, switchTab, tabCounts,
    typeFilter,     setTypeFilter,
    statusFilter,   setStatusFilter,
    priorityFilter, setPriorityFilter,
    applyFilters, resetFilters,
    selectedId, selectedDispute, detailLoading,
    openDispute,
    loadingId, assign, refund, payDriver,
  } = useDisputes();

  return (
    <DashboardLayout title="Gestion des Litiges">
      <div className="disputes-screen">
        <div className="disputes-layout">

          <div className="disputes-left">
            <DisputesMetrics metrics={metrics} loading={metricsLoading} />

            <DisputesTable
              disputes={disputes}
              tabCounts={tabCounts}
              tabFilter={tabFilter}     switchTab={switchTab}
              search={search}           setSearch={setSearch}
              typeFilter={typeFilter}   setTypeFilter={setTypeFilter}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
              onReset={resetFilters}    applyFilters={applyFilters}
              total={total}             pageSize={pageSize}
              currentPage={currentPage} setCurrentPage={setCurrentPage}
              selectedId={selectedId}   openDispute={openDispute}
              loading={loading}         fetchError={fetchError}
            />
          </div>

          <DisputeDetailPanel
            dispute={selectedDispute}
            loadingId={loadingId}
            detailLoading={detailLoading}
            onAssign={assign}
            onRefund={refund}
            onPay={payDriver}
          />

        </div>
      </div>
    </DashboardLayout>
  );
}
