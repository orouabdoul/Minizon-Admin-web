import { useState, useCallback, useEffect } from 'react';
import { reservationService }            from '../services/reservation_service';
import { mapApiReservationToReservation } from '../models/reservation.model';
import type { Reservation, ReservationMetrics, ReservationStatus, ApiReservationStatus } from '../models/reservation.model';

const PAGE_SIZE = 10;

// Optimistic status mapping: API value → display value
const OPT_STATUS: Record<ApiReservationStatus, ReservationStatus> = {
  pending:   'En attente',
  accepted:  'Confirmée',
  rejected:  'Annulée',
  cancelled: 'Annulée',
};

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [fetchError,   setFetchError]   = useState<string | null>(null);

  const [metrics,        setMetrics]        = useState<ReservationMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  const [search,        setSearch]        = useState('');
  const [cityFilter,    setCityFilter]    = useState('all');
  const [statusFilter,  setStatusFilter]  = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter,    setDateFilter]    = useState('');
  const [currentPage,   setCurrentPage]  = useState(1);

  const [selectedId,         setSelectedIdState]    = useState<string | null>(null);
  const [detailReservation,  setDetailReservation]  = useState<Reservation | null>(null);
  const [detailLoading,      setDetailLoading]      = useState(false);

  // ── Metrics ────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMetricsLoading(true);
    reservationService.getMetrics()
      .then(({ data }) => setMetrics(data.body))
      .catch(() => null)
      .finally(() => setMetricsLoading(false));
  }, []);

  // ── List ───────────────────────────────────────────────────────────────────
  const fetchReservations = useCallback(async (
    page: number, q: string, city: string, status: string, payment: string, date: string,
  ) => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data } = await reservationService.getAll(page, PAGE_SIZE, {
        search:  q       || undefined,
        city:    city    !== 'all' ? city    : undefined,
        status:  status  !== 'all' ? status  : undefined,
        payment: payment !== 'all' ? payment : undefined,
        date:    date              ? date     : undefined,
      });
      const body = data.body;
      const list = Array.isArray(body?.data) ? body.data : [];
      setReservations(list.map(mapApiReservationToReservation));
      setTotal(body?.total ?? 0);
    } catch {
      setFetchError('Impossible de charger les réservations.');
      setReservations([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations(currentPage, search, cityFilter, statusFilter, paymentFilter, dateFilter);
  }, [fetchReservations, currentPage, search, cityFilter, statusFilter, paymentFilter, dateFilter]);

  const applyFilters = useCallback(() => {
    setCurrentPage(1);
    fetchReservations(1, search, cityFilter, statusFilter, paymentFilter, dateFilter);
  }, [fetchReservations, search, cityFilter, statusFilter, paymentFilter, dateFilter]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setCityFilter('all');
    setStatusFilter('all');
    setPaymentFilter('all');
    setDateFilter('');
    setCurrentPage(1);
  }, []);

  // ── Detail ─────────────────────────────────────────────────────────────────
  const setSelectedId = useCallback(async (id: string | null) => {
    setSelectedIdState(id);
    if (!id) { setDetailReservation(null); return; }

    const basic = reservations.find((r) => r.id === id) ?? null;
    setDetailReservation(basic);
    setDetailLoading(true);
    try {
      const { data } = await reservationService.getById(id);
      const body = (data.body ?? data) as Parameters<typeof mapApiReservationToReservation>[0];
      setDetailReservation(mapApiReservationToReservation(body));
    } catch {
      // keep basic list data
    } finally {
      setDetailLoading(false);
    }
  }, [reservations]);

  // ── Update status ──────────────────────────────────────────────────────────
  const updateStatus = useCallback(async (id: string, apiStatus: ApiReservationStatus) => {
    const optimistic = OPT_STATUS[apiStatus];
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status: optimistic } : r));
    setDetailReservation((prev) => prev && prev.id === id ? { ...prev, status: optimistic } : prev);
    try {
      await reservationService.updateStatus(id, apiStatus);
    } catch {
      // on error revert — trigger a list refresh instead
      fetchReservations(currentPage, search, cityFilter, statusFilter, paymentFilter, dateFilter);
    }
  }, [fetchReservations, currentPage, search, cityFilter, statusFilter, paymentFilter, dateFilter]);

  // ── Remove ─────────────────────────────────────────────────────────────────
  const removeReservation = useCallback(async (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    setTotal((t) => Math.max(0, t - 1));
    if (selectedId === id) { setSelectedIdState(null); setDetailReservation(null); }
    try {
      await reservationService.remove(id);
    } catch { /* keep optimistic */ }
  }, [selectedId]);

  return {
    reservations,
    total,
    pageSize: PAGE_SIZE,
    currentPage,
    setCurrentPage,
    loading,
    fetchError,
    metrics,
    metricsLoading,
    search,        setSearch,
    cityFilter,    setCityFilter,
    statusFilter,  setStatusFilter,
    paymentFilter, setPaymentFilter,
    dateFilter,    setDateFilter,
    applyFilters,
    resetFilters,
    selectedId,
    setSelectedId,
    selectedReservation: detailReservation,
    detailLoading,
    updateStatus,
    removeReservation,
  };
}
