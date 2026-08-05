import { useState } from 'react';
import { Download, Bell, Ban, Trash2 } from 'lucide-react';
import { AppIcon }             from '../../components/Common/AppIcon';
import { DashboardLayout }     from '../../components/Layout/DashboardLayout/DashboardLayout';
import { ConfirmDialog }       from '../../components/Overlay/ConfirmDialog/ConfirmDialog';
import { ReservationsMetrics } from './components/ReservationsMetrics';
import { ReservationsFilters } from './components/ReservationsFilters';
import { ReservationsTable }   from './components/ReservationsTable';
import { useReservations }     from '../../hooks/useReservations';

export function ReservationsScreen() {
  const {
    reservations, total, pageSize, currentPage, setCurrentPage,
    loading, fetchError,
    metrics, metricsLoading,
    search,        setSearch,
    cityFilter,    setCityFilter,
    statusFilter,  setStatusFilter,
    paymentFilter, setPaymentFilter,
    dateFilter,    setDateFilter,
    applyFilters,  resetFilters,
    setSelectedId, selectedReservation, detailLoading,
    updateStatus,  removeReservation,
  } = useReservations();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDeleteRequest = (id: string) => {
    // Close detail modal first, then confirm
    setSelectedId(null);
    setDeleteTarget(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) removeReservation(deleteTarget);
    setDeleteTarget(null);
  };

  return (
    <DashboardLayout title="Gestion des Réservations">
      <div className="reservations-screen">
        <ReservationsMetrics metrics={metrics} loading={metricsLoading} />

        <ReservationsFilters
          search={search}
          cityFilter={cityFilter}
          statusFilter={statusFilter}
          paymentFilter={paymentFilter}
          dateFilter={dateFilter}
          onSearch={setSearch}
          onCity={setCityFilter}
          onStatus={setStatusFilter}
          onPayment={setPaymentFilter}
          onDate={setDateFilter}
          onFilter={applyFilters}
          onReset={resetFilters}
        />

        <ReservationsTable
          reservations={reservations}
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          loading={loading}
          fetchError={fetchError}
          setCurrentPage={setCurrentPage}
          onView={setSelectedId}
          onCloseDetail={() => setSelectedId(null)}
          selectedReservation={selectedReservation}
          detailLoading={detailLoading}
          onUpdateStatus={updateStatus}
          onDelete={handleDeleteRequest}
        />

        <div className="reservations-action-bar">
          <div className="reservations-action-bar__left">
            <button type="button" className="reservations-action-btn reservations-action-btn--green">
              <AppIcon icon={Download} size={16} color="white" />
              Exporter Sélection
            </button>
            <button type="button" className="reservations-action-btn reservations-action-btn--yellow">
              <AppIcon icon={Ban} size={16} color="white" />
              Suspendre
            </button>
            <button type="button" className="reservations-action-btn reservations-action-btn--blue">
              <AppIcon icon={Bell} size={16} color="white" />
              Notifier
            </button>
          </div>
          <span className="reservations-action-bar__info">Dernière mise à jour: à l'instant</span>
        </div>

        <ConfirmDialog
          isOpen={deleteTarget !== null}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Supprimer la réservation"
          message="Cette action est irréversible. La réservation sera définitivement supprimée."
          confirmLabel="Supprimer"
          variant="danger"
          icon={Trash2}
        />
      </div>
    </DashboardLayout>
  );
}
