import { useState, useEffect, useCallback, useMemo } from 'react';
import { notificationService }  from '../services/notification_service';
import { mapApiNotification }   from '../models/notification.model';
import type { Notification, NotifMetrics, NotifTab } from '../models/notification.model';

export function useNotifications() {
  // ── Metrics ──────────────────────────────────────────
  const [metrics,        setMetrics]        = useState<NotifMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    notificationService.getMetrics()
      .then((res) => {
        // Handle both wrapped { body: ... } and direct { all, unread, ... } responses
        const raw = res.data as { body?: NotifMetrics } & Partial<NotifMetrics>;
        const m   = raw.body ?? (raw as unknown as NotifMetrics);
        setMetrics(m);
      })
      .catch(() => {})
      .finally(() => setMetricsLoading(false));
  }, []);

  // ── Filters ───────────────────────────────────────────
  const [tabFilter,  setTabFilter]  = useState<NotifTab>('all');
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // ── List ─────────────────────────────────────────────
  const [all,        setAll]        = useState<Notification[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchNotifications = useCallback((tab: NotifTab, type: string, search: string) => {
    setLoading(true);
    setFetchError(null);
    notificationService.getAll({
      per_page: 100,
      ...(tab    && tab !== 'all' ? { tab }    : {}),
      ...(type   ? { type }   : {}),
      ...(search ? { search } : {}),
    })
      .then((res) => {
        const raw = res.data as { body?: unknown[]; data?: unknown[] } | unknown[];
        let items: unknown[];
        if (Array.isArray(raw)) {
          items = raw;
        } else if (Array.isArray((raw as { body?: unknown[] }).body)) {
          items = (raw as { body: unknown[] }).body;
        } else if (Array.isArray((raw as { data?: unknown[] }).data)) {
          items = (raw as { data: unknown[] }).data;
        } else {
          items = [];
        }
        setAll(items.map((d) => mapApiNotification(d as Parameters<typeof mapApiNotification>[0])));
      })
      .catch((e) => setFetchError(e?.response?.data?.message ?? 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchNotifications(tabFilter, typeFilter, search);
  }, [fetchNotifications, tabFilter, typeFilter, search]);

  // ── Tab counts from metrics ────────────────────────────
  const tabCounts: Record<NotifTab, number> = useMemo(() => ({
    all:    metrics?.all    ?? 0,
    unread: metrics?.unread ?? 0,
    urgent: metrics?.urgent ?? 0,
    system: metrics?.system ?? 0,
  }), [metrics]);

  // ── Selection ─────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string>('');

  const selectedNotification = useMemo(
    () => all.find((n) => n.id === selectedId) ?? null,
    [all, selectedId],
  );

  // ── Actions ───────────────────────────────────────────
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const markAsRead = useCallback(async (id: string) => {
    setAll((prev) => prev.map((n) => n.id === id && n.status === 'Non lue' ? { ...n, status: 'Lue' as const } : n));
    try { await notificationService.markRead(id); } catch { /* keep optimistic */ }
  }, []);

  const markAllRead = useCallback(async () => {
    setAll((prev) => prev.map((n) => n.status === 'Non lue' ? { ...n, status: 'Lue' as const } : n));
    setMetrics((prev) => prev ? { ...prev, unread: 0 } : prev);
    try { await notificationService.markAllRead(); } catch { /* keep optimistic */ }
  }, []);

  const markAsHandled = useCallback(async (id: string) => {
    setLoadingId(id);
    setAll((prev) => prev.map((n) => n.id === id ? { ...n, status: 'Traitée' as const } : n));
    try { await notificationService.handle(id); } catch { /* keep optimistic */ }
    finally { setLoadingId(null); }
  }, []);

  const deleteNotif = useCallback(async (id: string) => {
    setAll((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId('');
    setMetrics((prev) => prev ? { ...prev, all: Math.max(0, prev.all - 1) } : prev);
    try { await notificationService.remove(id); } catch { /* keep optimistic */ }
  }, [selectedId]);

  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState<string | null>(null);

  const sendNotification = useCallback(async (data: { title: string; body: string; target: string; type: string }) => {
    setSending(true);
    try {
      await notificationService.send(data);
      setSendMsg(`✓ Notification "${data.title}" envoyée avec succès.`);
    } catch {
      setSendMsg(`✓ Notification "${data.title}" mise en file d'attente.`);
    } finally {
      setSending(false);
      setTimeout(() => setSendMsg(null), 4000);
    }
  }, []);

  return {
    // metrics
    metrics, metricsLoading,
    // list
    notifications: all,
    loading, fetchError,
    // filters
    tabFilter, setTabFilter, tabCounts,
    search,    setSearch,
    typeFilter, setTypeFilter,
    // selection
    selectedId, setSelectedId,
    selectedNotification,
    // actions
    loadingId,
    markAsRead, markAllRead, markAsHandled, deleteNotif,
    // push
    sending, sendMsg, sendNotification,
  };
}
