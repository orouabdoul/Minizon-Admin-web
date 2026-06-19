import { useEffect } from 'react';
import { DashboardLayout }   from '../../components/Layout/DashboardLayout/DashboardLayout';
import { DashboardKpis }     from './components/DashboardKpis';
import { ChartCard }         from './components/ChartCard';
import { UserGrowthChart }   from './components/UserGrowthChart';
import { RevenueChart }      from './components/RevenueChart';
import { RegionChart }       from './components/RegionChart';
import { SatisfactionChart } from './components/SatisfactionChart';
import { RealTimeActivity }  from './components/RealTimeActivity';
import { useDashboardController } from '../../controllers/dashboard_controller';

export function DashboardScreen() {
  const { data, loading, error, fetchData } = useDashboardController();

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <DashboardLayout title="Dashboard">

      {error && (
        <div style={{
          background: '#FEE2E2', color: '#B91C1C', borderRadius: 10,
          padding: '12px 16px', marginBottom: 16, fontSize: 14,
        }}>
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <DashboardKpis data={data} loading={loading} />

      {/* Charts row 1 */}
      <div className="dash-charts-grid">
        <ChartCard title="Répartition Utilisateurs" period="Données en direct" sizeClass="dash-chart-card--fixed">
          <UserGrowthChart users={data?.users ?? null} />
        </ChartCard>
        <ChartCard
          title="Revenus Plateforme"
          period="7 derniers jours"
          sizeClass="dash-chart-card--flex"
        >
          <RevenueChart dailyRevenue={data?.charts.daily_revenue_7d ?? []} />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="dash-charts-grid">
        <ChartCard title="Trajets & Réservations" linkLabel="Voir détails" sizeClass="dash-chart-card--fixed">
          <RegionChart trips={data?.trips ?? null} bookings={data?.bookings ?? null} />
        </ChartCard>
        <ChartCard title="Paiements & Retraits" linkLabel="Voir détails" sizeClass="dash-chart-card--flex">
          <SatisfactionChart payments={data?.payments ?? null} withdrawals={data?.withdrawals ?? null} />
        </ChartCard>
      </div>

      {/* Real-time activity */}
      <RealTimeActivity
        users={data?.users ?? null}
        payments={data?.payments ?? null}
        disputes={data?.disputes ?? null}
        topDrivers={data?.charts.top_drivers}
      />
    </DashboardLayout>
  );
}
