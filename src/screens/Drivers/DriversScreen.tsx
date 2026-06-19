import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { DriversMetrics }  from './components/DriversMetrics';
import { DriversTable }    from './components/DriversTable';

export function DriversScreen() {
  return (
    <DashboardLayout title="Gestion des Conducteurs">
      <div className="users-page">
        <DriversMetrics />
        <DriversTable />
      </div>
    </DashboardLayout>
  );
}
