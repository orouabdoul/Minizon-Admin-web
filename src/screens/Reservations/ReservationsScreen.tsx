import { Download, Bell, Ban } from 'lucide-react';
import { AppIcon }              from '../../components/Common/AppIcon';
import { DashboardLayout }      from '../../components/Layout/DashboardLayout/DashboardLayout';
import { ReservationsMetrics }  from './components/ReservationsMetrics';
import { ReservationsFilters }  from './components/ReservationsFilters';
import { ReservationsTable }    from './components/ReservationsTable';
import { useReservations }      from '../../hooks/useReservations';

export function ReservationsScreen() {
  const {
    reservations, total, pageSize, currentPage, setCurrentPage,
    cityFilter,    setCityFilter,
    statusFilter,  setStatusFilter,
    paymentFilter, setPaymentFilter,
    dateFilter,    setDateFilter,
    resetFilters,
    setSelectedId,
    selectedReservation,
  } = useReservations();

  return (
    <DashboardLayout title="Gestion des Réservations">
      <div className="reservations-screen">
        <ReservationsMetrics />

        <ReservationsFilters
          cityFilter={cityFilter}
          statusFilter={statusFilter}
          paymentFilter={paymentFilter}
          dateFilter={dateFilter}
          onCity={setCityFilter}
          onStatus={setStatusFilter}
          onPayment={setPaymentFilter}
          onDate={setDateFilter}
          onFilter={resetFilters}
        />

        <ReservationsTable
          reservations={reservations}
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onView={setSelectedId}
          onCloseDetail={() => setSelectedId(null)}
          selectedReservation={selectedReservation}
        />

        {/* Bottom action bar */}
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
          <span className="reservations-action-bar__info">Dernière mise à jour: il y a 2 minutes</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
