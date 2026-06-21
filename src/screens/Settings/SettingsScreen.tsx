import { DashboardLayout }         from '../../components/Layout/DashboardLayout/DashboardLayout';
import { SettingsSummary }         from './components/SettingsSummary';
import { SettingsGeneralCard }     from './components/SettingsGeneralCard';
import { SettingsCommissionsCard } from './components/SettingsCommissionsCard';
import { SettingsPaymentsCard }    from './components/SettingsPaymentsCard';
import { SettingsSecurityCard }    from './components/SettingsSecurityCard';
import { SettingsAdminsCard }      from './components/SettingsAdminsCard';
import { SettingsAnalyticsCard }   from './components/SettingsAnalyticsCard';
import { useSettings }             from '../../hooks/useSettings';

export function SettingsScreen() {
  const {
    summary, summaryLoading,
    general, generalLoading, generalSaving, saveGeneral,
    commissions, commissionsLoading, updateCommission,
    providers, providersLoading,
    securityLogs, securityLoading,
    admins, adminsLoading, addAdmin, updateAdmin, revokeAdmin,
    analytics, analyticsLoading,
  } = useSettings();

  return (
    <DashboardLayout title="Paramètres">
      <div className="settings-screen">

        <SettingsSummary items={summary} loading={summaryLoading} />

        <SettingsGeneralCard
          general={general}
          loading={generalLoading}
          saving={generalSaving}
          onSave={saveGeneral}
        />

        <SettingsCommissionsCard
          commissions={commissions}
          loading={commissionsLoading}
          onSaveCommission={updateCommission}
        />

        <SettingsPaymentsCard providers={providers} loading={providersLoading} />

        <SettingsSecurityCard logs={securityLogs} loading={securityLoading} />

        <SettingsAdminsCard
          admins={admins}
          loading={adminsLoading}
          onAdd={addAdmin}
          onUpdate={updateAdmin}
          onRevoke={revokeAdmin}
        />

        <SettingsAnalyticsCard analytics={analytics} loading={analyticsLoading} />

      </div>
    </DashboardLayout>
  );
}
