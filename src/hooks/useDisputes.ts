import { useState, useEffect, useCallback } from 'react';
import { disputeService }                  from '../services/dispute_service';
import { mapApiListItemToDispute, mapApiDetailToDispute } from '../models/dispute.model';
import type { Dispute, DisputeMetrics, DisputeTab } from '../models/dispute.model';

const PAGE_SIZE = 10;

export function useDisputes() {
  // ── Metrics ──────────────────────────────────────────
  const [metrics,        setMetrics]        = useState<DisputeMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    disputeService.getMetrics()
      .then((res) => setMetrics(res.data.body))
      .catch(() => {})
      .finally(() => setMetricsLoading(false));
  }, []);

  // ── Pending filters ───────────────────────────────────
  const [search,         setSearch]         = useState('');
  const [tabFilter,      setTabFilter]      = useState<DisputeTab>('all');
  const [typeFilter,     setTypeFilter]     = useState('');
  const [statusFilter,   setStatusFilter]   = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // ── Applied filters ───────────────────────────────────
  const [appliedTab,      setAppliedTab]      = useState<DisputeTab>('all');
  const [appliedSearch,   setAppliedSearch]   = useState('');
  const [appliedType,     setAppliedType]     = useState('');
  const [appliedStatus,   setAppliedStatus]   = useState('');
  const [appliedPriority, setAppliedPriority] = useState('');

  // ── List ─────────────────────────────────────────────
  const [disputes,    setDisputes]    = useState<Dispute[]>([]);
  const [total,       setTotal]       = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [fetchError,  setFetchError]  = useState<string | null>(null);

  const fetchDisputes = useCallback((
    page: number, tab: DisputeTab,
    search: string, type: string, status: string, priority: string,
  ) => {
    setLoading(true);
    setFetchError(null);
    disputeService.getAll(page, PAGE_SIZE, {
      tab, search, type, status, priority,
    })
      .then((res) => {
        const body = res.data.body;
        setDisputes(body.data.map(mapApiListItemToDispute));
        setTotal(body.total);
      })
      .catch((e) => setFetchError(e?.response?.data?.message ?? 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchDisputes(currentPage, appliedTab, appliedSearch, appliedType, appliedStatus, appliedPriority);
  }, [fetchDisputes, currentPage, appliedTab, appliedSearch, appliedType, appliedStatus, appliedPriority]);

  // Tabs switch immediately
  const switchTab = useCallback((tab: DisputeTab) => {
    setTabFilter(tab);
    setAppliedTab(tab);
    setCurrentPage(1);
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedSearch(search);
    setAppliedType(typeFilter);
    setAppliedStatus(statusFilter);
    setAppliedPriority(priorityFilter);
    setCurrentPage(1);
  }, [search, typeFilter, statusFilter, priorityFilter]);

  const resetFilters = useCallback(() => {
    setSearch(''); setTypeFilter(''); setStatusFilter(''); setPriorityFilter('');
    setAppliedSearch(''); setAppliedType(''); setAppliedStatus(''); setAppliedPriority('');
    setTabFilter('all'); setAppliedTab('all');
    setCurrentPage(1);
  }, []);

  // ── Detail ────────────────────────────────────────────
  const [selectedId,      setSelectedId]      = useState<string | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [detailLoading,   setDetailLoading]   = useState(false);

  const openDispute = useCallback(async (id: string) => {
    const quick = disputes.find((d) => d.id === id) ?? null;
    setSelectedId(id);
    setSelectedDispute(quick);
    setDetailLoading(true);
    try {
      const res = await disputeService.getById(id);
      setSelectedDispute(mapApiDetailToDispute(res.data.body));
    } catch { /* keep quick data */ }
    finally { setDetailLoading(false); }
  }, [disputes]);

  const closeDetail = useCallback(() => {
    setSelectedId(null);
    setSelectedDispute(null);
  }, []);

  const patchDispute = useCallback((id: string, patch: Partial<Dispute>) => {
    setDisputes((prev) => prev.map((d) => d.id === id ? { ...d, ...patch } : d));
    setSelectedDispute((prev) => prev?.id === id ? { ...prev, ...patch } : prev);
  }, []);

  // ── Actions ───────────────────────────────────────────
  const [loadingId,  setLoadingId]  = useState<string | null>(null);
  const [actionMsg,  setActionMsg]  = useState<string | null>(null);

  const flashMsg = useCallback((msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 3500);
  }, []);

  const assign = useCallback(async (id: string) => {
    setLoadingId(id);
    try {
      await disputeService.assign(id);
      patchDispute(id, { status: 'En cours' });
      flashMsg('✓ Litige pris en charge — le plaignant a été notifié automatiquement.');
    } catch { /* server error */ }
    finally { setLoadingId(null); }
  }, [patchDispute, flashMsg]);

  const refund = useCallback(async (id: string, notes: string) => {
    setLoadingId(id);
    try {
      await disputeService.refund(id, notes);
      patchDispute(id, { status: 'Résolu' });
      flashMsg('✓ Remboursement confirmé — le plaignant a été notifié automatiquement.');
    } catch { /* server error */ }
    finally { setLoadingId(null); }
  }, [patchDispute, flashMsg]);

  const payDriver = useCallback(async (id: string, notes: string) => {
    setLoadingId(id);
    try {
      await disputeService.payDriver(id, notes);
      patchDispute(id, { status: 'Clôturé' });
      flashMsg('✓ Paiement conducteur confirmé — le plaignant a été notifié automatiquement.');
    } catch { /* server error */ }
    finally { setLoadingId(null); }
  }, [patchDispute, flashMsg]);

  const tabCounts = {
    all:      metrics?.all      ?? 0,
    open:     metrics?.open     ?? 0,
    critical: metrics?.critical ?? 0,
  };

  return {
    // metrics
    metrics, metricsLoading,
    // list
    disputes, total, pageSize: PAGE_SIZE, currentPage, setCurrentPage,
    loading, fetchError,
    // filters
    search, setSearch,
    tabFilter, switchTab, tabCounts,
    typeFilter,     setTypeFilter,
    statusFilter,   setStatusFilter,
    priorityFilter, setPriorityFilter,
    applyFilters, resetFilters,
    // detail
    selectedId, selectedDispute, detailLoading,
    openDispute, closeDetail,
    // actions
    loadingId, actionMsg, assign, refund, payDriver,
  };
}
