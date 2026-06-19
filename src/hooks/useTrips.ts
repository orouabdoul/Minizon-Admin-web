import { useState, useMemo, useCallback } from 'react';
import { MOCK_TRIPS }  from '../config/constants';
import type { Trip }   from '../models/trip.model';

const TOTAL     = 1847;
const PAGE_SIZE = 10;

export function useTrips() {
  const [trips,             setTrips]           = useState<Trip[]>(MOCK_TRIPS);
  const [departureFilter,   setDepartureFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [statusFilter,      setStatusFilter]    = useState<string>('all');
  const [dateFilter,        setDateFilter]       = useState<string>('');
  const [currentPage,       setCurrentPage]     = useState(1);
  const [selectedId,        setSelectedId]      = useState<string | null>(null);

  const filtered = useMemo(() =>
    trips.filter((t) => {
      const matchDep  = departureFilter   === 'all' || t.from   === departureFilter;
      const matchDest = destinationFilter === 'all' || t.to     === destinationFilter;
      const matchStat = statusFilter      === 'all' || t.status === statusFilter;
      return matchDep && matchDest && matchStat;
    }), [trips, departureFilter, destinationFilter, statusFilter]);

  const resetFilters = useCallback(() => {
    setDepartureFilter('all');
    setDestinationFilter('all');
    setStatusFilter('all');
    setDateFilter('');
    setCurrentPage(1);
  }, []);

  // Optimistic status patch (used by cancel/flag if needed)
  const patchLocal = useCallback((id: string, patch: Partial<Trip>) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const selectedTrip = selectedId ? (trips.find((t) => t.id === selectedId) ?? MOCK_TRIPS.find((t) => t.id === selectedId) ?? null) : null;

  return {
    trips: filtered,
    total: TOTAL,
    pageSize: PAGE_SIZE,
    currentPage,
    setCurrentPage,
    departureFilter,   setDepartureFilter,
    destinationFilter, setDestinationFilter,
    statusFilter,      setStatusFilter,
    dateFilter,        setDateFilter,
    resetFilters,
    patchLocal,
    selectedId,
    setSelectedId,
    selectedTrip,
  };
}
