import { DashboardLayout }    from '../../components/Layout/DashboardLayout/DashboardLayout';
import { DisputesMetrics }    from './components/DisputesMetrics';
import { DisputesTable }      from './components/DisputesTable';
import { DisputeDetailPanel } from './components/DisputeDetailPanel';
import { useDisputes }        from '../../hooks/useDisputes';

export function DisputesScreen() {
  const {
    disputes, total, pageSize, currentPage, setCurrentPage,
    search, setSearch,
    tabFilter,      setTabFilter,      tabCounts,
    typeFilter,     setTypeFilter,
    statusFilter,   setStatusFilter,
    priorityFilter, setPriorityFilter,
    loadingId, refundPassenger, payDriver, resetFilters,
    selectedId, setSelectedId, selectedDispute,
  } = useDisputes();

  return (
    <DashboardLayout title="Gestion des Litiges">
      <div className="disputes-screen">
        <div className="disputes-layout">

          <div className="disputes-left">
            <DisputesMetrics />

            <DisputesTable
              disputes={disputes}
              tabCounts={tabCounts}
              tabFilter={tabFilter}     setTabFilter={setTabFilter}
              search={search}           setSearch={setSearch}
              typeFilter={typeFilter}   setTypeFilter={setTypeFilter}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
              onReset={resetFilters}
              total={total} pageSize={pageSize}
              currentPage={currentPage} setCurrentPage={setCurrentPage}
              selectedId={selectedId}   setSelectedId={setSelectedId}
            />
          </div>

          <DisputeDetailPanel
            dispute={selectedDispute}
            loadingId={loadingId}
            onRefund={refundPassenger}
            onPay={payDriver}
          />

        </div>
      </div>
    </DashboardLayout>
  );
}
