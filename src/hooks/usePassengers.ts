import { useState, useCallback, useEffect } from 'react';
import { passengerService }    from '../services/passenger_service';
import { platformUserService } from '../services/platform_user_service';
import { mapApiPassenger }     from '../models/passenger.model';
import type { Passenger }      from '../models/passenger.model';
import type { ApiPassenger }   from '../models/passenger.model';

const PAGE_SIZE = 15;

export function usePassengers() {
  const [passengers,    setPassengers]    = useState<Passenger[]>([]);
  const [total,         setTotal]         = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [search,        setSearchState]   = useState('');
  const [cityFilter,    setCityState]     = useState<string>('all');
  const [riskFilter,    setRiskState]     = useState<string>('all');
  const [statusFilter,  setStatusState]   = useState<string>('all');
  const [verifFilter,   setVerifState]    = useState<string>('all');
  const [currentPage,   setCurrentPage]   = useState(1);
  const [loadingId,     setLoadingId]     = useState<string | null>(null);
  const [selectedId,    setSelectedIdRaw] = useState<string | null>(null);
  const [detailPassenger, setDetailPassenger] = useState<Passenger | null>(null);
  const [detailLoading,   setDetailLoading]   = useState(false);

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
        ...(city   !== 'all' ? { city }     : {}),
        ...(risk   !== 'all' ? { risk }     : {}),
        ...(status !== 'all' ? { status }   : {}),
        ...(verif  !== 'all' ? { verif }    : {}),
        ...(q               ? { search: q } : {}),
      });
      // Apply mapper so URL paths are normalized + KYC fields extracted
      setPassengers(data.body.data.map(mapApiPassenger));
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

  const setSearch       = useCallback((v: string) => { setSearchState(v); resetPage(); }, [resetPage]);
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
    setDetailPassenger((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
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

  const approveKyc = useCallback((id: string) =>
    withLoading(id, () => platformUserService.approveKyc(id), { verification: 'Vérifié' }),
  [withLoading]);

  const rejectKyc = useCallback((id: string) =>
    withLoading(id, () => platformUserService.rejectKyc(id), { verification: 'Rejeté' }),
  [withLoading]);

  const setSelectedId = useCallback(async (id: string | null) => {
    setSelectedIdRaw(id);
    if (!id) { setDetailPassenger(null); return; }

    const basic = passengers.find((p) => p.id === id) ?? null;
    setDetailPassenger(basic);
    setDetailLoading(true);
    try {
      const { data } = await passengerService.getById(id);
      // Unwrap body: may be direct object or nested under a key
      const raw = ((data as unknown as Record<string, unknown>).body ?? data) as Record<string, unknown>;
      const body = ((raw.passenger ?? raw.user ?? raw.data) ?? raw) as ApiPassenger;
      console.log('[Passenger getById] raw body:', JSON.stringify(body, null, 2));
      const detail = mapApiPassenger(body);
      console.log('[Passenger getById] mapped:', { selfies: detail.selfies, idCard: detail.idCard });
      setDetailPassenger({
        ...detail,
        selfies: detail.selfies ?? basic?.selfies,
        idCard:  detail.idCard  ?? basic?.idCard,
      });
    } catch (err) {
      console.error('[Passenger getById]', err);
    } finally {
      setDetailLoading(false);
    }
  }, [passengers]);

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
    approveKyc,
    rejectKyc,
    resetFilters,
    selectedId,
    setSelectedId,
    selectedPassenger: detailPassenger,
    detailLoading,
  };
}
