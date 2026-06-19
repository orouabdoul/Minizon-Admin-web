import { Plus }             from 'lucide-react';
import { AppIcon }          from '../../components/Common/AppIcon';
import { DashboardLayout }  from '../../components/Layout/DashboardLayout/DashboardLayout';
import { TripsMetrics }     from './components/TripsMetrics';
import { TripsFilters }     from './components/TripsFilters';
import { TripsTable }       from './components/TripsTable';
import { useTrips }         from '../../hooks/useTrips';

export function TripsScreen() {
  const {
    trips,
    departureFilter,   setDepartureFilter,
    destinationFilter, setDestinationFilter,
    statusFilter,      setStatusFilter,
    dateFilter,        setDateFilter,
    resetFilters,
    setSelectedId,
    selectedTrip,
  } = useTrips();

  return (
    <DashboardLayout title="Gestion des Trajets">
      <div className="trips-screen">
        {/* Page header */}
        <div className="trips-page-header">
          <div className="trips-page-header__left">
            <h1 className="trips-page-header__title">Gestion des Trajets</h1>
            <p className="trips-page-header__subtitle">Supervisez et gérez tous les trajets de la plateforme</p>
          </div>
          <button type="button" className="trips-create-btn">
            <AppIcon icon={Plus} size={14} color="#fff" />
            Créer un trajet
          </button>
        </div>

        <TripsMetrics />

        <TripsFilters
          departureFilter={departureFilter}
          destinationFilter={destinationFilter}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          onDeparture={setDepartureFilter}
          onDestination={setDestinationFilter}
          onStatus={setStatusFilter}
          onDate={setDateFilter}
          onFilter={resetFilters}
        />

        <TripsTable
          trips={trips}
          onView={setSelectedId}
          onCloseDetail={() => setSelectedId(null)}
          selectedTrip={selectedTrip}
        />
      </div>
    </DashboardLayout>
  );
}
