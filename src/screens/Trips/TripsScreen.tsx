import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { AppIcon }         from '../../components/Common/AppIcon';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { ConfirmDialog }   from '../../components/Overlay/ConfirmDialog/ConfirmDialog';
import { TripsMetrics }    from './components/TripsMetrics';
import { TripsFilters }    from './components/TripsFilters';
import { TripsTable }      from './components/TripsTable';
import { useTrips }        from '../../hooks/useTrips';

export function TripsScreen() {
  const {
    trips, total, pageSize, currentPage, setCurrentPage, loading, fetchError,
    metrics, metricsLoading,
    departureFilter,   setDepartureFilter,
    destinationFilter, setDestinationFilter,
    statusFilter,      setStatusFilter,
    dateFilter,        setDateFilter,
    applyFilters,      resetFilters,
    setSelectedId,     selectedTrip,      detailLoading,
    updateStatus,      removeTrip,
  } = useTrips();

  const [deleteTarget,  setDeleteTarget]  = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError,   setDeleteError]   = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await removeTrip(deleteTarget);
      setDeleteTarget(null);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (e as any)?.response?.data?.message ?? 'Impossible de supprimer ce trajet.';
      setDeleteError(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardLayout title="Gestion des Trajets">
      <div className="trips-screen">
        <div className="trips-page-header">
          <div className="trips-page-header__left">
            <h1 className="trips-page-header__title">Gestion des Trajets</h1>
            <p className="trips-page-header__subtitle">Supervisez et gérez tous les trajets de la plateforme</p>
          </div>
        </div>

        <TripsMetrics metrics={metrics} loading={metricsLoading} />

        <TripsFilters
          departureFilter={departureFilter}
          destinationFilter={destinationFilter}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          onDeparture={setDepartureFilter}
          onDestination={setDestinationFilter}
          onStatus={setStatusFilter}
          onDate={setDateFilter}
          onFilter={applyFilters}
          onReset={resetFilters}
        />

        {/* Inline error banner for delete 403 */}
        {deleteError && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#FEF2F2', border: '1px solid #FCA5A5',
            borderRadius: 8, padding: '12px 16px', marginBottom: 8,
          }}>
            <AppIcon icon={AlertTriangle} size={16} color="#DC2626" />
            <span style={{ fontSize: 13, color: '#DC2626', flex: 1 }}>{deleteError}</span>
            <button
              type="button"
              onClick={() => setDeleteError(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: 16, lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        )}

        <TripsTable
          trips={trips}
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          loading={loading}
          fetchError={fetchError}
          onView={setSelectedId}
          onCloseDetail={() => setSelectedId(null)}
          selectedTrip={selectedTrip}
          detailLoading={detailLoading}
          onPageChange={setCurrentPage}
          onUpdateStatus={updateStatus}
          onDelete={(id) => { setDeleteError(null); setDeleteTarget(id); }}
        />

        <ConfirmDialog
          isOpen={deleteTarget !== null}
          onClose={() => { setDeleteTarget(null); setDeleteError(null); }}
          onConfirm={handleDeleteConfirm}
          title="Supprimer le trajet"
          message="Cette action est irréversible. Les réservations en attente seront automatiquement annulées. Un trajet en cours ne peut pas être supprimé."
          confirmLabel="Supprimer"
          variant="danger"
          icon={Trash2}
          loading={deleteLoading}
        />
      </div>
    </DashboardLayout>
  );
}
