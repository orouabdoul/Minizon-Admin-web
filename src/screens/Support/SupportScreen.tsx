import { useState } from 'react';
import { Trash2 }          from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { ConfirmDialog }   from '../../components/Overlay/ConfirmDialog/ConfirmDialog';
import { SupportMetrics }  from './components/SupportMetrics';
import { SupportFilters }  from './components/SupportFilters';
import { SupportTable }    from './components/SupportTable';
import { NewTicketModal }  from './components/NewTicketModal';
import { TicketDetailModal } from './components/TicketDetailModal';
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
    selectedTicketId, setSelectedTicketId,
    selectedTicket, detailLoading,
    removeTicket,
    showNewTicket, setShowNewTicket,
    creating, createError, createTicket,
  } = useSupport();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDeleteRequest = (id: string) => {
    setSelectedTicketId(null);
    setDeleteTarget(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) removeTicket(deleteTarget);
    setDeleteTarget(null);
  };

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
          onView={setSelectedTicketId}
          onDelete={handleDeleteRequest}
        />

        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            detailLoading={detailLoading}
            onClose={() => setSelectedTicketId(null)}
            onResolve={resolve}
            onDelete={handleDeleteRequest}
            resolving={loadingId === selectedTicketId}
          />
        )}

        {showNewTicket && (
          <NewTicketModal
            creating={creating}
            createError={createError}
            onClose={() => setShowNewTicket(false)}
            onCreate={createTicket}
          />
        )}

        <ConfirmDialog
          isOpen={deleteTarget !== null}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Supprimer le ticket"
          message="Cette action est irréversible. Le ticket de support sera définitivement supprimé."
          confirmLabel="Supprimer"
          variant="danger"
          icon={Trash2}
        />

      </div>
    </DashboardLayout>
  );
}
