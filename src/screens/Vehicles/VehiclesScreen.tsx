import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { VehiclesMetrics } from './components/VehiclesMetrics';
import { VehiclesTable }   from './components/VehiclesTable';
import { useVehicles }     from '../../hooks/useVehicles';

export function VehiclesScreen() {
  const {
    metrics,
    vehicles, total, pageSize, currentPage, setCurrentPage, loading,
    search,       setSearch,
    statusFilter, setStatusFilter,
    typeFilter,   setTypeFilter,
    selectedVehicle, setSelectedId,
    approveVehicle, rejectVehicle, suspendVehicle, reinstateVehicle, deleteVehicle,
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
          loading={loading}
          search={search}             setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}     setTypeFilter={setTypeFilter}
          selectedVehicle={selectedVehicle}
          setSelectedId={setSelectedId}
          onApprove={approveVehicle}
          onReject={rejectVehicle}
          onSuspend={suspendVehicle}
          onReinstate={reinstateVehicle}
          onDelete={deleteVehicle}
        />

      </div>
    </DashboardLayout>
  );
}
