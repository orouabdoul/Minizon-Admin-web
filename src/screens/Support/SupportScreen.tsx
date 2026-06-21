import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { SupportMetrics }  from './components/SupportMetrics';
import { SupportFilters }  from './components/SupportFilters';
import { SupportTable }    from './components/SupportTable';
import { NewTicketModal }  from './components/NewTicketModal';
import { useSupport }      from '../../hooks/useSupport';

export function SupportScreen() {
  const {
    metrics, metricsLoading,
    agents,
    tickets, total, pageSize, currentPage, setCurrentPage,
    loading, fetchError,
    search, setSearch,
    statusFilter,   setStatusFilter,
    priorityFilter, setPriorityFilter,
    agentFilter,    setAgentFilter,
    dateFilter,     setDateFilter,
    applyFilters, resetFilters,
    loadingId, resolve,
    showNewTicket, setShowNewTicket,
    creating, createError, createTicket,
  } = useSupport();

  return (
    <DashboardLayout title="Support">
      <div className="support-screen">

        <SupportMetrics metrics={metrics} loading={metricsLoading} />

        <SupportFilters
          statusFilter={statusFilter}     onStatus={setStatusFilter}
          priorityFilter={priorityFilter} onPriority={setPriorityFilter}
          agentFilter={agentFilter}       onAgent={setAgentFilter}
          dateFilter={dateFilter}         onDate={setDateFilter}
          agents={agents}
          onFilter={applyFilters}
          onReset={resetFilters}
          onNewTicket={() => setShowNewTicket(true)}
        />

        <SupportTable
          tickets={tickets}
          total={total}       pageSize={pageSize}
          currentPage={currentPage} setCurrentPage={setCurrentPage}
          search={search}     setSearch={setSearch}
          applyFilters={applyFilters}
          loading={loading}   fetchError={fetchError}
          loadingId={loadingId} onResolve={resolve}
        />

        {showNewTicket && (
          <NewTicketModal
            creating={creating}
            createError={createError}
            onClose={() => setShowNewTicket(false)}
            onCreate={createTicket}
          />
        )}

      </div>
    </DashboardLayout>
  );
}
