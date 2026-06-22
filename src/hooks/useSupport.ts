import { useState, useEffect, useCallback } from 'react';
import { supportService }  from '../services/support_service';
import type { SupportTicket, SupportMetrics, SupportAgent } from '../models/support.model';

const PAGE_SIZE = 10;

export function useSupport() {
  // ── Metrics ──────────────────────────────────────────
  const [metrics,        setMetrics]        = useState<SupportMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    supportService.getMetrics()
      .then((res) => setMetrics(res.data.body))
      .catch(() => {})
      .finally(() => setMetricsLoading(false));
  }, []);

  // ── Agents (for filter dropdown) ──────────────────────
  const [agents, setAgents] = useState<SupportAgent[]>([]);

  useEffect(() => {
    supportService.getAgents()
      .then((res) => setAgents(res.data.body ?? []))
      .catch(() => {});
  }, []);

  // ── Pending filters ───────────────────────────────────
  const [search,         setSearch]         = useState('');
  const [statusFilter,   setStatusFilter]   = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [agentFilter,    setAgentFilter]    = useState('');
  const [dateFilter,     setDateFilter]     = useState('');

  // ── Applied filters ───────────────────────────────────
  const [appliedSearch,   setAppliedSearch]   = useState('');
  const [appliedStatus,   setAppliedStatus]   = useState('');
  const [appliedPriority, setAppliedPriority] = useState('');
  const [appliedAgent,    setAppliedAgent]    = useState('');
  const [appliedDate,     setAppliedDate]     = useState('');

  // ── List ─────────────────────────────────────────────
  const [tickets,     setTickets]     = useState<SupportTicket[]>([]);
  const [total,       setTotal]       = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [fetchError,  setFetchError]  = useState<string | null>(null);

  const fetchTickets = useCallback((
    page: number,
    search: string, status: string, priority: string, agent: string, date: string,
  ) => {
    setLoading(true);
    setFetchError(null);
    supportService.getAll(page, PAGE_SIZE, { search, status, priority, agent, date })
      .then((res) => {
        const body = res.data.body;
        setTickets(body?.data ?? []);
        setTotal(body?.total ?? 0);
      })
      .catch((e) => setFetchError(e?.response?.data?.message ?? 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTickets(currentPage, appliedSearch, appliedStatus, appliedPriority, appliedAgent, appliedDate);
  }, [fetchTickets, currentPage, appliedSearch, appliedStatus, appliedPriority, appliedAgent, appliedDate]);

  const applyFilters = useCallback(() => {
    setAppliedSearch(search);
    setAppliedStatus(statusFilter);
    setAppliedPriority(priorityFilter);
    setAppliedAgent(agentFilter);
    setAppliedDate(dateFilter);
    setCurrentPage(1);
  }, [search, statusFilter, priorityFilter, agentFilter, dateFilter]);

  const resetFilters = useCallback(() => {
    setSearch(''); setStatusFilter(''); setPriorityFilter(''); setAgentFilter(''); setDateFilter('');
    setAppliedSearch(''); setAppliedStatus(''); setAppliedPriority(''); setAppliedAgent(''); setAppliedDate('');
    setCurrentPage(1);
  }, []);

  // ── Resolve ───────────────────────────────────────────
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const resolve = useCallback(async (id: string) => {
    setLoadingId(id);
    try {
      await supportService.resolve(id);
      setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: 'Résolu' as const } : t));
    } catch { /* server error */ }
    finally { setLoadingId(null); }
  }, []);

  // ── Create ticket ─────────────────────────────────────
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [creating,      setCreating]      = useState(false);
  const [createError,   setCreateError]   = useState<string | null>(null);

  const createTicket = useCallback(async (payload: {
    user_uuid: string; subject: string; description: string; priority: string; channel: string;
  }) => {
    setCreating(true);
    setCreateError(null);
    try {
      await supportService.create(payload);
      setShowNewTicket(false);
      setCurrentPage(1);
      fetchTickets(1, appliedSearch, appliedStatus, appliedPriority, appliedAgent, appliedDate);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setCreateError(err?.response?.data?.message ?? 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  }, [fetchTickets, appliedSearch, appliedStatus, appliedPriority, appliedAgent, appliedDate]);

  return {
    // metrics
    metrics, metricsLoading,
    // agents
    agents,
    // list
    tickets, total, pageSize: PAGE_SIZE, currentPage, setCurrentPage,
    loading, fetchError,
    // filters
    search, setSearch,
    statusFilter,   setStatusFilter,
    priorityFilter, setPriorityFilter,
    agentFilter,    setAgentFilter,
    dateFilter,     setDateFilter,
    applyFilters, resetFilters,
    // resolve
    loadingId, resolve,
    // create
    showNewTicket, setShowNewTicket,
    creating, createError, createTicket,
  };
}
