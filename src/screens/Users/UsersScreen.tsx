import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { UsersMetrics }    from './components/UsersMetrics';
import { UsersTable }      from './components/UsersTable';
import { QuickActions }    from './components/QuickActions';
import { SystemAlerts }    from './components/SystemAlerts';
import { PerformanceCard } from './components/PerformanceCard';

export function UsersScreen() {
  return (
    <DashboardLayout title="Gestion des Utilisateurs">
      <div className="users-page">
        <UsersMetrics />
        <UsersTable />
        <div className="users-bottom-grid">
          <QuickActions />
          <SystemAlerts />
          <PerformanceCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
