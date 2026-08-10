import { useState, useEffect, useCallback, useRef } from 'react';
import type { AuditLog, AuditStats, AuditAdminItem, AuditFilters } from '../models/audit.model';
import { auditService } from '../services/audit_service';

const DEFAULT_FILTERS: AuditFilters = {
  actionType: 'all',
  severity:   'all',
  adminId:    'all',
  search:     '',
  date_from:  '',
  date_to:    '',
};

export function useAudit() {
  const [logs,       setLogs]       = useState<AuditLog[]>([]);
  const [stats,      setStats]      = useState<AuditStats>({ today_count: 0, critique_count: 0, total: 0 });
  const [admins,     setAdmins]     = useState<AuditAdminItem[]>([]);
  const [filters,    setFiltersState] = useState<AuditFilters>(DEFAULT_FILTERS);
  const [loading,    setLoading]    = useState(true);
  const [exporting,  setExporting]  = useState(false);

  // Debounced search value — triggers API only after 400 ms of inactivity
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  // Keep a ref to latest filters for the export function
  const filtersRef = useRef(filters);
  useEffect(() => { filtersRef.current = filters; }, [filters]);

  // Fetch admin list once on mount
  useEffect(() => {
    auditService.getAdmins()
      .then((res) => {
        const raw = res.data as any;
        setAdmins(raw?.body?.admins ?? raw?.admins ?? []);
      })
      .catch(() => {});
  }, []);

  // Core fetch — builds clean params (omit 'all' / empty values)
  const fetchLogs = useCallback((f: AuditFilters, search: string) => {
    const params: Record<string, string | number> = { per_page: 200, page: 1 };
    if (search)                        params.search      = search;
    if (f.severity   !== 'all')        params.severity    = f.severity;
    if (f.actionType !== 'all')        params.action_type = f.actionType;
    if (f.adminId    !== 'all')        params.admin_id    = f.adminId;
    if (f.date_from)                   params.date_from   = f.date_from;
    if (f.date_to)                     params.date_to     = f.date_to;

    setLoading(true);
    auditService.getLogs(params as any)
      .then((res) => {
        const raw  = res.data as any;
        const body = raw?.body ?? raw;
        setLogs(body?.logs ?? []);
        setStats(body?.stats ?? { today_count: 0, critique_count: 0, total: body?.total ?? 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Refetch when non-search filters change (immediate) or debounced search settles
  useEffect(() => {
    fetchLogs(filters, debouncedSearch);
  }, [
    filters.severity, filters.actionType, filters.adminId,
    filters.date_from, filters.date_to,
    debouncedSearch,
    fetchLogs,
  ]);

  const setFilters = useCallback((f: Partial<AuditFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...f }));
  }, []);

  const exportLogs = useCallback(() => {
    const f = filtersRef.current;
    const params: Record<string, string> = {};
    if (f.search)            params.search      = f.search;
    if (f.severity   !== 'all') params.severity = f.severity;
    if (f.actionType !== 'all') params.action_type = f.actionType;
    if (f.adminId    !== 'all') params.admin_id  = f.adminId;
    if (f.date_from)         params.date_from   = f.date_from;
    if (f.date_to)           params.date_to     = f.date_to;

    setExporting(true);
    auditService.exportLogs(params as any)
      .then((res) => {
        const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `audit_minizon_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch(() => {})
      .finally(() => setExporting(false));
  }, []);

  const refresh = useCallback(() => {
    fetchLogs(filtersRef.current, filtersRef.current.search);
  }, [fetchLogs]);

  return {
    logs, stats, loading, filters, admins, exporting,
    setFilters, exportLogs, refresh,
  };
}
