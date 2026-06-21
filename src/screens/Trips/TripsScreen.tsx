import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
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
  } = useTrips();

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
        />
      </div>
    </DashboardLayout>
  );
}
