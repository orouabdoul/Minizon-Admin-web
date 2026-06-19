import { useState, useMemo, useCallback } from 'react';
import { MOCK_RESERVATIONS }    from '../config/constants';
import { reservationService }   from '../services/reservation_service';
import type { Reservation }     from '../models/reservation.model';

const TOTAL     = 2847;
const PAGE_SIZE = 10;

export function useReservations() {
  const [reservations,  setReservations]  = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [search,        setSearch]        = useState('');
  const [cityFilter,    setCityFilter]    = useState<string>('all');
  const [statusFilter,  setStatusFilter]  = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFilter,    setDateFilter]    = useState<string>('');
  const [currentPage,   setCurrentPage]   = useState(1);
  const [loadingId,     setLoadingId]     = useState<string | null>(null);
  const [selectedId,    setSelectedId]    = useState<string | null>(null);

  const filtered = useMemo(() =>
    reservations.filter((r) => {
      const matchSearch  = !search || r.reservationId.toLowerCase().includes(search.toLowerCase()) ||
        r.passengerName.toLowerCase().includes(search.toLowerCase()) ||
        r.driverName.toLowerCase().includes(search.toLowerCase());
      const matchCity    = cityFilter    === 'all' || r.from === cityFilter || r.to === cityFilter;
      const matchStatus  = statusFilter  === 'all' || r.status         === statusFilter;
      const matchPayment = paymentFilter === 'all' || r.paymentStatus  === paymentFilter;
      return matchSearch && matchCity && matchStatus && matchPayment;
    }), [reservations, search, cityFilter, statusFilter, paymentFilter]);

  const patchLocal = useCallback((id: string, patch: Partial<Reservation>) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const withLoading = useCallback(async (
    id: string,
    action: () => Promise<unknown>,
    patch: Partial<Reservation>,
  ) => {
    setLoadingId(id);
    try {
      await action();
      patchLocal(id, patch);
    } catch {
      patchLocal(id, patch);
    } finally {
      setLoadingId(null);
    }
  }, [patchLocal]);

  const cancel = useCallback((id: string) =>
    withLoading(id, () => reservationService.cancel(id), { status: 'Annulée' }),
  [withLoading]);

  const resetFilters = useCallback(() => {
    setCityFilter('all');
    setStatusFilter('all');
    setPaymentFilter('all');
    setDateFilter('');
    setSearch('');
    setCurrentPage(1);
  }, []);

  const selectedReservation = selectedId
    ? (filtered.find((r) => r.id === selectedId) ?? MOCK_RESERVATIONS.find((r) => r.id === selectedId) ?? null)
    : null;

  return {
    reservations: filtered,
    total: TOTAL,
    pageSize: PAGE_SIZE,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    cityFilter,    setCityFilter,
    statusFilter,  setStatusFilter,
    paymentFilter, setPaymentFilter,
    dateFilter,    setDateFilter,
    loadingId,
    cancel,
    resetFilters,
    selectedId,
    setSelectedId,
    selectedReservation,
  };
}
