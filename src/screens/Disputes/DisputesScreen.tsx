import { DashboardLayout }    from '../../components/Layout/DashboardLayout/DashboardLayout';
import { DisputesMetrics }    from './components/DisputesMetrics';
import { DisputesTable }      from './components/DisputesTable';
import { DisputeDetailPanel } from './components/DisputeDetailPanel';
import { AppIcon }            from '../../components/Common/AppIcon';
import { Bell }               from 'lucide-react';
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
    loadingId, actionMsg, assign, refund, payDriver,
  } = useDisputes();

  return (
    <DashboardLayout title="Gestion des Litiges">
      <div className="disputes-screen">

        {/* Confirmation "plaignant notifié" */}
        {actionMsg && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 16px', marginBottom: 12,
            background: '#DCFCE7', borderRadius: 10, border: '1px solid #BBF7D0',
            fontSize: 13, color: '#14532D',
          }}>
            <AppIcon icon={Bell} size={14} color="#16A34A" />
            <span>{actionMsg}</span>
          </div>
        )}

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
