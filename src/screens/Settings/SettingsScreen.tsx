import { DashboardLayout }        from '../../components/Layout/DashboardLayout/DashboardLayout';
import { SettingsSummary }        from './components/SettingsSummary';
import { SettingsGeneralCard }    from './components/SettingsGeneralCard';
import { SettingsCommissionsCard }from './components/SettingsCommissionsCard';
import { SettingsPaymentsCard }   from './components/SettingsPaymentsCard';
import { SettingsSecurityCard }   from './components/SettingsSecurityCard';
import { SettingsAdminsCard }     from './components/SettingsAdminsCard';
import { SettingsAnalyticsCard }  from './components/SettingsAnalyticsCard';

export function SettingsScreen() {
  return (
    <DashboardLayout title="Paramètres">
      <div className="settings-screen">
        <SettingsSummary />
        <SettingsGeneralCard />
        <SettingsCommissionsCard />
        <SettingsPaymentsCard />
        <SettingsSecurityCard />
        <SettingsAdminsCard />
        <SettingsAnalyticsCard />
      </div>
    </DashboardLayout>
  );
}
