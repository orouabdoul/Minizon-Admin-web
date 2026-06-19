import { useState, useMemo, useCallback } from 'react';
import { MOCK_DISPUTES }     from '../config/constants';
import { disputeService }    from '../services/dispute_service';
import type { Dispute, DisputeTab } from '../models/dispute.model';

const TOTAL     = 55;
const PAGE_SIZE = 10;

export function useDisputes() {
  const [disputes,       setDisputes]      = useState<Dispute[]>(MOCK_DISPUTES);
  const [search,         setSearch]        = useState('');
  const [tabFilter,      setTabFilter]     = useState<DisputeTab>('all');
  const [statusFilter,   setStatusFilter]  = useState<string>('all');
  const [typeFilter,     setTypeFilter]    = useState<string>('all');
  const [priorityFilter, setPriorityFilter]= useState<string>('all');
  const [currentPage,    setCurrentPage]   = useState(1);
  const [loadingId,      setLoadingId]     = useState<string | null>(null);
  const [selectedId,     setSelectedId]    = useState<string>(MOCK_DISPUTES[0].id);

  const baseFiltered = useMemo(() =>
    disputes.filter((d) => {
      const matchSearch   = !search ||
        d.disputeId.toLowerCase().includes(search.toLowerCase()) ||
        d.passengerName.toLowerCase().includes(search.toLowerCase()) ||
        d.driverName.toLowerCase().includes(search.toLowerCase());
      const matchStatus   = statusFilter   === 'all' || d.status   === statusFilter;
      const matchType     = typeFilter     === 'all' || d.type     === typeFilter;
      const matchPriority = priorityFilter === 'all' || d.priority === priorityFilter;
      return matchSearch && matchStatus && matchType && matchPriority;
    }), [disputes, search, statusFilter, typeFilter, priorityFilter]);

  const tabCounts = useMemo(() => ({
    all:      baseFiltered.length,
    open:     baseFiltered.filter((d) => d.status === 'Ouvert' || d.status === 'En cours').length,
    critical: baseFiltered.filter((d) => d.priority === 'Critique').length,
  }), [baseFiltered]);

  const filtered = useMemo(() =>
    baseFiltered.filter((d) =>
      tabFilter === 'all'      ? true
      : tabFilter === 'open'   ? (d.status === 'Ouvert' || d.status === 'En cours')
      :                          d.priority === 'Critique',
    ), [baseFiltered, tabFilter]);

  const patchLocal = useCallback((id: string, patch: Partial<Dispute>) => {
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }, []);

  const resolve = useCallback(async (id: string) => {
    setLoadingId(id);
    try   { await disputeService.resolve(id); patchLocal(id, { status: 'Résolu' }); }
    catch { patchLocal(id, { status: 'Résolu' }); }
    finally { setLoadingId(null); }
  }, [patchLocal]);

  const close = useCallback(async (id: string) => {
    setLoadingId(id);
    try   { await disputeService.close(id); patchLocal(id, { status: 'Clôturé' }); }
    catch { patchLocal(id, { status: 'Clôturé' }); }
    finally { setLoadingId(null); }
  }, [patchLocal]);

  const resetFilters = useCallback(() => {
    setTabFilter('all'); setStatusFilter('all'); setTypeFilter('all');
    setPriorityFilter('all'); setSearch(''); setCurrentPage(1);
  }, []);

  const selectedDispute = useMemo(() =>
    disputes.find((d) => d.id === selectedId) ?? disputes[0] ?? null,
    [disputes, selectedId],
  );

  const refundPassenger = useCallback(async (id: string) => {
    setLoadingId(id);
    try   { await disputeService.resolve(id); patchLocal(id, { status: 'Résolu' }); }
    catch { patchLocal(id, { status: 'Résolu' }); }
    finally { setLoadingId(null); }
  }, [patchLocal]);

  const payDriver = useCallback(async (id: string) => {
    setLoadingId(id);
    try   { await disputeService.close(id); patchLocal(id, { status: 'Clôturé' }); }
    catch { patchLocal(id, { status: 'Clôturé' }); }
    finally { setLoadingId(null); }
  }, [patchLocal]);

  return {
    disputes: filtered, total: TOTAL, pageSize: PAGE_SIZE, currentPage, setCurrentPage,
    search, setSearch,
    tabFilter,      setTabFilter,      tabCounts,
    statusFilter,   setStatusFilter,
    typeFilter,     setTypeFilter,
    priorityFilter, setPriorityFilter,
    loadingId, resolve, close, refundPassenger, payDriver, resetFilters,
    selectedId, setSelectedId, selectedDispute,
  };
}
