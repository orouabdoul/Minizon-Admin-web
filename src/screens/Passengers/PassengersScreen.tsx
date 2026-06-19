import { useState } from 'react';
import { UserX }              from 'lucide-react';
import { DashboardLayout }    from '../../components/Layout/DashboardLayout/DashboardLayout';
import { PassengersMetrics }  from './components/PassengersMetrics';
import { PassengersFilters }  from './components/PassengersFilters';
import { PassengersTable }    from './components/PassengersTable';
import { ConfirmDialog }      from '../../components/Overlay/ConfirmDialog/ConfirmDialog';
import { usePassengers }      from '../../hooks/usePassengers';

export function PassengersScreen() {
  const {
    passengers,
    total,
    pageSize,
    currentPage,
    setCurrentPage,
    loadingId,
    cityFilter,   setCityFilter,
    riskFilter,   setRiskFilter,
    statusFilter, setStatusFilter,
    verifFilter,  setVerifFilter,
    suspend,
    unsuspend,
    resetFilters,
    setSelectedId,
    selectedPassenger,
  } = usePassengers();

  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <DashboardLayout title="Gestion des Passagers">
      <div className="passengers-screen">
        {confirmId && (
          <ConfirmDialog
            isOpen
            onClose={() => setConfirmId(null)}
            onConfirm={() => { suspend(confirmId); setConfirmId(null); }}
            title="Suspendre le passager ?"
            message="Le passager ne pourra plus effectuer de réservations pendant la suspension."
            confirmLabel="Suspendre"
            variant="warning"
            icon={UserX}
          />
        )}

        <PassengersMetrics />

        <PassengersFilters
          cityFilter={cityFilter}
          riskFilter={riskFilter}
          statusFilter={statusFilter}
          verifFilter={verifFilter}
          onCity={setCityFilter}
          onRisk={setRiskFilter}
          onStatus={setStatusFilter}
          onVerif={setVerifFilter}
          onReset={resetFilters}
        />

        <PassengersTable
          passengers={passengers}
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          loadingId={loadingId}
          onSuspend={(id) => setConfirmId(id)}
          onUnsuspend={unsuspend}
          onView={setSelectedId}
          onCloseDetail={() => setSelectedId(null)}
          selectedPassenger={selectedPassenger}
        />
      </div>
    </DashboardLayout>
  );
}
