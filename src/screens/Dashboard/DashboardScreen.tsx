import { useEffect } from 'react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { DashboardKpis } from './components/DashboardKpis';
import { ChartCard } from './components/ChartCard';
import { UserGrowthChart } from './components/UserGrowthChart';
import { RevenueChart } from './components/RevenueChart';
import { RegionChart } from './components/RegionChart';
import { SatisfactionChart } from './components/SatisfactionChart';
import { RealTimeActivity } from './components/RealTimeActivity';
import { useDashboardController } from '../../controllers/dashboard_controller';

export function DashboardScreen() {
  const { data, fetchData } = useDashboardController();

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <DashboardLayout title="Dashboard">
      {/* KPI Cards */}
      <DashboardKpis data={data} />

      {/* Charts row 1 */}
      <div className="dash-charts-grid">
        <ChartCard title="Croissance Utilisateurs" period="Cette semaine" sizeClass="dash-chart-card--fixed">
          <UserGrowthChart />
        </ChartCard>
        <ChartCard title="Revenus Plateforme" period="Cette semaine" sizeClass="dash-chart-card--flex">
          <RevenueChart />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="dash-charts-grid">
        <ChartCard title="Répartition par Région" linkLabel="Voir détails" sizeClass="dash-chart-card--fixed">
          <RegionChart />
        </ChartCard>
        <ChartCard title="Taux de Satisfaction" linkLabel="Voir détails" sizeClass="dash-chart-card--flex">
          <SatisfactionChart />
        </ChartCard>
      </div>

      {/* Real-time activity */}
      <RealTimeActivity />
    </DashboardLayout>
  );
}
