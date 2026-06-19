import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { SupportMetrics }  from './components/SupportMetrics';
import { SupportFilters }  from './components/SupportFilters';
import { SupportTable }    from './components/SupportTable';
import { useSupport }      from '../../hooks/useSupport';

export function SupportScreen() {
  const {
    tickets, total, pageSize, currentPage, setCurrentPage,
    search, setSearch,
    statusFilter,   setStatusFilter,
    priorityFilter, setPriorityFilter,
    agentFilter,    setAgentFilter,
    loadingId, resolve, resetFilters,
  } = useSupport();

  return (
    <DashboardLayout title="Support">
      <div className="support-screen">

        <SupportMetrics />

        <SupportFilters
          statusFilter={statusFilter}     onStatus={setStatusFilter}
          priorityFilter={priorityFilter} onPriority={setPriorityFilter}
          agentFilter={agentFilter}       onAgent={setAgentFilter}
          onReset={resetFilters}
        />

        <SupportTable
          tickets={tickets}
          total={total} pageSize={pageSize}
          currentPage={currentPage} setCurrentPage={setCurrentPage}
          search={search} setSearch={setSearch}
          loadingId={loadingId} onResolve={resolve}
        />

      </div>
    </DashboardLayout>
  );
}
