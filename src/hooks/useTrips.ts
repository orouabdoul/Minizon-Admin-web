import { useState, useCallback, useEffect } from 'react';
import { tripService }       from '../services/trip_service';
import { mapApiTripToTrip }  from '../models/trip.model';
import type { Trip, TripMetrics, TripStatus } from '../models/trip.model';
import type { ApiTripStatus } from '../services/trip_service';

const PAGE_SIZE = 15;

const OPT_STATUS: Record<ApiTripStatus, TripStatus> = {
  pending:   'Actif',
  active:    'Actif',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractList(body: any): any[] {
  if (Array.isArray(body?.data))  return body.data;
  if (Array.isArray(body?.trips)) return body.trips;
  if (Array.isArray(body))        return body;
  return [];
}

export function useTrips() {
  const [trips,        setTrips]       = useState<Trip[]>([]);
  const [total,        setTotal]       = useState(0);
  const [loading,      setLoading]     = useState(false);
  const [fetchError,   setFetchError]  = useState<string | null>(null);

  const [metrics,        setMetrics]        = useState<TripMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  const [departureFilter,   setDepartureFilter]   = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [statusFilter,      setStatusFilter]      = useState('all');
  const [dateFilter,        setDateFilter]        = useState('');
  const [currentPage,       setCurrentPage]       = useState(1);

  const [selectedId,    setSelectedIdState] = useState<string | null>(null);
  const [detailTrip,    setDetailTrip]      = useState<Trip | null>(null);
  const [detailLoading, setDetailLoading]   = useState(false);

  // ── Metrics ────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMetricsLoading(true);
    tripService.getMetrics()
      .then(({ data }) => setMetrics(data.body))
      .catch(() => null)
      .finally(() => setMetricsLoading(false));
  }, []);

  // ── List ───────────────────────────────────────────────────────────────────
  const fetchTrips = useCallback(async (
    page: number, dep: string, dest: string, status: string, date: string,
  ) => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data } = await tripService.getAll(page, PAGE_SIZE, {
        departure:   dep    !== 'all' ? dep    : undefined,
        destination: dest   !== 'all' ? dest   : undefined,
        status:      status !== 'all' ? status : undefined,
        date:        date              ? date   : undefined,
      });
      const body = data.body;
      const list = extractList(body);
      setTrips(list.map(mapApiTripToTrip));
      setTotal(body?.total ?? list.length);
    } catch {
      setFetchError('Impossible de charger les trajets.');
      setTrips([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips(currentPage, departureFilter, destinationFilter, statusFilter, dateFilter);
  }, [fetchTrips, currentPage, departureFilter, destinationFilter, statusFilter, dateFilter]);

  const applyFilters = useCallback(() => {
    setCurrentPage(1);
    fetchTrips(1, departureFilter, destinationFilter, statusFilter, dateFilter);
  }, [fetchTrips, departureFilter, destinationFilter, statusFilter, dateFilter]);

  const resetFilters = useCallback(() => {
    setDepartureFilter('all');
    setDestinationFilter('all');
    setStatusFilter('all');
    setDateFilter('');
    setCurrentPage(1);
  }, []);

  // ── Detail ─────────────────────────────────────────────────────────────────
  const setSelectedId = useCallback(async (id: string | null) => {
    setSelectedIdState(id);
    if (!id) { setDetailTrip(null); return; }

    const basic = trips.find((t) => t.id === id) ?? null;
    setDetailTrip(basic);
    setDetailLoading(true);
    try {
      const { data } = await tripService.getById(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = (data.body ?? data) as any;
      setDetailTrip(mapApiTripToTrip(body));
    } catch {
      // keep basic list data
    } finally {
      setDetailLoading(false);
    }
  }, [trips]);

  // ── Update status ──────────────────────────────────────────────────────────
  const updateStatus = useCallback(async (id: string, apiStatus: ApiTripStatus) => {
    const optimistic = OPT_STATUS[apiStatus];
    setTrips((prev) => prev.map((t) => t.id === id ? { ...t, status: optimistic } : t));
    setDetailTrip((prev) => prev && prev.id === id ? { ...prev, status: optimistic } : prev);
    try {
      await tripService.updateStatus(id, apiStatus);
    } catch {
      fetchTrips(currentPage, departureFilter, destinationFilter, statusFilter, dateFilter);
    }
  }, [fetchTrips, currentPage, departureFilter, destinationFilter, statusFilter, dateFilter]);

  // ── Remove ─────────────────────────────────────────────────────────────────
  // NOT optimistic — backend rejects deletion of active trips (HTTP 403)
  const removeTrip = useCallback(async (id: string): Promise<void> => {
    await tripService.remove(id);  // throws on 403 / other errors
    setTrips((prev) => prev.filter((t) => t.id !== id));
    setTotal((n) => Math.max(0, n - 1));
    if (selectedId === id) { setSelectedIdState(null); setDetailTrip(null); }
  }, [selectedId]);

  return {
    trips,
    total,
    pageSize: PAGE_SIZE,
    currentPage,
    setCurrentPage,
    loading,
    fetchError,
    metrics,
    metricsLoading,
    departureFilter,   setDepartureFilter,
    destinationFilter, setDestinationFilter,
    statusFilter,      setStatusFilter,
    dateFilter,        setDateFilter,
    applyFilters,
    resetFilters,
    selectedId,
    setSelectedId,
    selectedTrip:  detailTrip,
    detailLoading,
    updateStatus,
    removeTrip,
  };
}
