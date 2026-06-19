import { useState, useCallback, useEffect } from 'react';
import { passengerService } from '../services/passenger_service';
import type { Passenger }   from '../models/passenger.model';

const PAGE_SIZE = 15;

export function usePassengers() {
  const [passengers,   setPassengers]   = useState<Passenger[]>([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [search,       setSearchState]  = useState('');
  const [cityFilter,   setCityState]    = useState<string>('all');
  const [riskFilter,   setRiskState]    = useState<string>('all');
  const [statusFilter, setStatusState]  = useState<string>('all');
  const [verifFilter,  setVerifState]   = useState<string>('all');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [loadingId,    setLoadingId]    = useState<string | null>(null);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);

  const fetchPassengers = useCallback(async (
    page: number,
    city: string,
    risk: string,
    status: string,
    verif: string,
    q: string,
  ) => {
    setLoading(true);
    try {
      const { data } = await passengerService.getAll(page, PAGE_SIZE, {
        ...(city   !== 'all' ? { city }           : {}),
        ...(risk   !== 'all' ? { risk }           : {}),
        ...(status !== 'all' ? { status }         : {}),
        ...(verif  !== 'all' ? { verif }          : {}),
        ...(q               ? { search: q }       : {}),
      });
      setPassengers(data.body.data);
      setTotal(data.body.total);
    } catch {
      setPassengers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPassengers(currentPage, cityFilter, riskFilter, statusFilter, verifFilter, search);
  }, [fetchPassengers, currentPage, cityFilter, riskFilter, statusFilter, verifFilter, search]);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const setSearch = useCallback((v: string) => { setSearchState(v); resetPage(); }, [resetPage]);
  const setCityFilter   = useCallback((v: string) => { setCityState(v);   resetPage(); }, [resetPage]);
  const setRiskFilter   = useCallback((v: string) => { setRiskState(v);   resetPage(); }, [resetPage]);
  const setStatusFilter = useCallback((v: string) => { setStatusState(v); resetPage(); }, [resetPage]);
  const setVerifFilter  = useCallback((v: string) => { setVerifState(v);  resetPage(); }, [resetPage]);

  const resetFilters = useCallback(() => {
    setCityState('all');
    setRiskState('all');
    setStatusState('all');
    setVerifState('all');
    setSearchState('');
    setCurrentPage(1);
  }, []);

  const patchLocal = useCallback((id: string, patch: Partial<Passenger>) => {
    setPassengers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const withLoading = useCallback(async (
    id: string,
    action: () => Promise<unknown>,
    patch: Partial<Passenger>,
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

  const suspend = useCallback((id: string) =>
    withLoading(id, () => passengerService.suspend(id), { status: 'Suspendu' }),
  [withLoading]);

  const unsuspend = useCallback((id: string) =>
    withLoading(id, () => passengerService.unsuspend(id), { status: 'Actif' }),
  [withLoading]);

  const selectedPassenger = selectedId
    ? (passengers.find((p) => p.id === selectedId) ?? null)
    : null;

  return {
    passengers,
    total,
    pageSize: PAGE_SIZE,
    currentPage,
    setCurrentPage,
    loading,
    search,
    setSearch,
    cityFilter,
    setCityFilter,
    riskFilter,
    setRiskFilter,
    statusFilter,
    setStatusFilter,
    verifFilter,
    setVerifFilter,
    loadingId,
    suspend,
    unsuspend,
    resetFilters,
    selectedId,
    setSelectedId,
    selectedPassenger,
  };
}
