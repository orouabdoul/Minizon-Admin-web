import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settings_service';
import type {
  SettingsSummaryItem, GeneralSettings, Commission, PaymentProvider,
  SecurityLog, SettingsAdmin, AnalyticsItem,
} from '../models/settings.model';

export function useSettings() {
  // ── Summary ──────────────────────────────────────────
  const [summary,        setSummary]        = useState<SettingsSummaryItem[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // ── General ──────────────────────────────────────────
  const [general,        setGeneral]        = useState<GeneralSettings | null>(null);
  const [generalLoading, setGeneralLoading] = useState(true);
  const [generalSaving,  setGeneralSaving]  = useState(false);

  // ── Commissions ──────────────────────────────────────
  const [commissions,        setCommissions]        = useState<Commission[]>([]);
  const [commissionsLoading, setCommissionsLoading] = useState(true);

  // ── Payments ─────────────────────────────────────────
  const [providers,        setProviders]        = useState<PaymentProvider[]>([]);
  const [providersLoading, setProvidersLoading] = useState(true);

  // ── Security ─────────────────────────────────────────
  const [securityLogs,    setSecurityLogs]    = useState<SecurityLog[]>([]);
  const [securityLoading, setSecurityLoading] = useState(true);

  // ── Admins ───────────────────────────────────────────
  const [admins,        setAdmins]        = useState<SettingsAdmin[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [adminSaving,   setAdminSaving]   = useState(false);

  // ── Analytics ─────────────────────────────────────────
  const [analytics,        setAnalytics]        = useState<AnalyticsItem[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    settingsService.getSummary()
      .then((r) => setSummary(r.data.body ?? []))
      .catch(() => {})
      .finally(() => setSummaryLoading(false));

    settingsService.getGeneral()
      .then((r) => setGeneral(r.data.body ?? null))
      .catch(() => {})
      .finally(() => setGeneralLoading(false));

    settingsService.getCommissions()
      .then((r) => setCommissions(r.data.body ?? []))
      .catch(() => {})
      .finally(() => setCommissionsLoading(false));

    settingsService.getPayments()
      .then((r) => setProviders(r.data.body ?? []))
      .catch(() => {})
      .finally(() => setProvidersLoading(false));

    settingsService.getSecurity()
      .then((r) => setSecurityLogs(r.data.body?.data ?? []))
      .catch(() => {})
      .finally(() => setSecurityLoading(false));

    settingsService.getAdmins()
      .then((r) => setAdmins(r.data.body ?? []))
      .catch(() => {})
      .finally(() => setAdminsLoading(false));

    settingsService.getAnalytics()
      .then((r) => setAnalytics(r.data.body ?? []))
      .catch(() => {})
      .finally(() => setAnalyticsLoading(false));
  }, []);

  // ── Actions ───────────────────────────────────────────
  const saveGeneral = useCallback(async (data: GeneralSettings) => {
    setGeneralSaving(true);
    try {
      await settingsService.updateGeneral(data);
      setGeneral(data);
    } catch { /* ignore */ }
    finally { setGeneralSaving(false); }
  }, []);

  const updateCommission = useCallback(async (id: string, updates: { rate: string; status: string }) => {
    setCommissions((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));
    try { await settingsService.updateCommission(id, updates); } catch { /* keep optimistic */ }
  }, []);

  const addAdmin = useCallback(async (data: { name: string; email: string; phone: string; role: string }) => {
    setAdminSaving(true);
    try {
      await settingsService.addAdmin(data);
      const r = await settingsService.getAdmins();
      setAdmins(r.data.body ?? []);
    } finally {
      setAdminSaving(false);
    }
  }, []);

  const updateAdmin = useCallback(async (id: string, data: { name: string; email: string; role: string }) => {
    setAdmins((prev) => prev.map((a) => a.id === id ? { ...a, ...data } : a));
    try { await settingsService.updateAdmin(id, data); } catch { /* keep optimistic */ }
  }, []);

  const revokeAdmin = useCallback(async (id: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    try { await settingsService.revokeAdmin(id); } catch { /* keep optimistic */ }
  }, []);

  return {
    summary, summaryLoading,
    general, generalLoading, generalSaving, saveGeneral,
    commissions, commissionsLoading, updateCommission,
    providers, providersLoading,
    securityLogs, securityLoading,
    admins, adminsLoading, adminSaving, addAdmin, updateAdmin, revokeAdmin,
    analytics, analyticsLoading,
  };
}
