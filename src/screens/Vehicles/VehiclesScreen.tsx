import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { VehiclesMetrics } from './components/VehiclesMetrics';
import { VehiclesTable }   from './components/VehiclesTable';
import { useVehicles }     from '../../hooks/useVehicles';

export function VehiclesScreen() {
  const {
    metrics,
    vehicles, total, pageSize, currentPage, setCurrentPage,
    search,       setSearch,
    statusFilter, setStatusFilter,
    typeFilter,   setTypeFilter,
    selectedVehicle, setSelectedId,
    suspendVehicle, activateVehicle, rejectVehicle, deleteVehicle,
  } = useVehicles();

  return (
    <DashboardLayout title="Gestion des Véhicules">
      <div className="users-page">

        <VehiclesMetrics metrics={metrics} />

        <VehiclesTable
          vehicles={vehicles}
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          search={search}             setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}     setTypeFilter={setTypeFilter}
          selectedVehicle={selectedVehicle}
          setSelectedId={setSelectedId}
          onSuspend={suspendVehicle}
          onActivate={activateVehicle}
          onReject={rejectVehicle}
          onDelete={deleteVehicle}
        />

      </div>
    </DashboardLayout>
  );
}
