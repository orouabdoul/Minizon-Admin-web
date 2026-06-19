import { useState, useMemo, useCallback } from 'react';
import { MOCK_TICKETS }     from '../config/constants';
import { supportService }   from '../services/support_service';
import type { SupportTicket, TicketStatus } from '../models/support.model';

const TOTAL     = 84;
const PAGE_SIZE = 10;

export function useSupport() {
  const [tickets,        setTickets]       = useState<SupportTicket[]>(MOCK_TICKETS);
  const [search,         setSearch]        = useState('');
  const [statusFilter,   setStatusFilter]  = useState<string>('all');
  const [priorityFilter, setPriorityFilter]= useState<string>('all');
  const [agentFilter,    setAgentFilter]   = useState<string>('all');
  const [currentPage,    setCurrentPage]   = useState(1);
  const [loadingId,      setLoadingId]     = useState<string | null>(null);

  const filtered = useMemo(() =>
    tickets.filter((t) => {
      const matchSearch   = !search ||
        t.ticketId.toLowerCase().includes(search.toLowerCase()) ||
        t.userName.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase());
      const matchStatus   = statusFilter   === 'all' || t.status   === statusFilter;
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchAgent    = agentFilter    === 'all' || (t.agentName ?? 'Non assigné') === agentFilter;
      return matchSearch && matchStatus && matchPriority && matchAgent;
    }), [tickets, search, statusFilter, priorityFilter, agentFilter]);

  const patchLocal = useCallback((id: string, patch: Partial<SupportTicket>) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const resolve = useCallback(async (id: string) => {
    setLoadingId(id);
    try   { await supportService.resolve(id); patchLocal(id, { status: 'Résolu' as TicketStatus }); }
    catch { patchLocal(id, { status: 'Résolu' as TicketStatus }); }
    finally { setLoadingId(null); }
  }, [patchLocal]);

  const close = useCallback(async (id: string) => {
    setLoadingId(id);
    try   { await supportService.close(id); patchLocal(id, { status: 'Clôturé' as TicketStatus }); }
    catch { patchLocal(id, { status: 'Clôturé' as TicketStatus }); }
    finally { setLoadingId(null); }
  }, [patchLocal]);

  const resetFilters = useCallback(() => {
    setStatusFilter('all'); setPriorityFilter('all'); setAgentFilter('all');
    setSearch(''); setCurrentPage(1);
  }, []);

  return {
    tickets: filtered, total: TOTAL, pageSize: PAGE_SIZE, currentPage, setCurrentPage,
    search, setSearch,
    statusFilter,   setStatusFilter,
    priorityFilter, setPriorityFilter,
    agentFilter,    setAgentFilter,
    loadingId, resolve, close, resetFilters,
  };
}
