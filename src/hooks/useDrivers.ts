import { useState, useCallback, useEffect } from 'react';
import { driverService }        from '../services/driver_service';
import { mapApiDriverToDriver } from '../models/driver.model';
import type { Driver }          from '../models/driver.model';

const PAGE_SIZE = 10;

export function useDrivers() {
  const [drivers,       setDrivers]     = useState<Driver[]>([]);
  const [total,         setTotal]       = useState(0);
  const [loading,       setLoading]     = useState(false);
  const [fetchError,    setFetchError]  = useState<string | null>(null);
  const [search,        setSearchState] = useState('');
  const [statusFilter,  setStatusState] = useState<string>('all');
  const [currentPage,   setCurrentPage] = useState(1);
  const [loadingId,     setLoadingId]   = useState<string | null>(null);
  const [selectedId,    setSelectedIdState]  = useState<string | null>(null);
  const [detailDriver,  setDetailDriver]     = useState<Driver | null>(null);
  const [detailLoading, setDetailLoading]    = useState(false);

  const fetchDrivers = useCallback(async (page: number, status: string, q: string) => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data } = await driverService.getAll(page, PAGE_SIZE, status, q);
      // API returns: { success, message, body: { data: [...], total, per_page, ... } }
      const body = (data as Record<string, unknown>).body as {
        data: unknown[];
        total: number;
      };
      const list = Array.isArray(body?.data) ? body.data : [];
      setDrivers(list.map((d) => mapApiDriverToDriver(d as Parameters<typeof mapApiDriverToDriver>[0])));
      setTotal(body?.total ?? 0);
    } catch (err) {
      console.error('[Drivers] fetchDrivers:', err);
      setFetchError('Impossible de charger les conducteurs.');
      setDrivers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers(currentPage, statusFilter, search);
  }, [fetchDrivers, currentPage, statusFilter, search]);

  const setSearch = useCallback((val: string) => {
    setSearchState(val);
    setCurrentPage(1);
  }, []);

  const setStatusFilter = useCallback((val: string) => {
    setStatusState(val);
    setCurrentPage(1);
  }, []);

  const patchLocal = useCallback((id: string, patch: Partial<Driver>) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    setDetailDriver((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  }, []);

  const withLoading = useCallback(async (
    id: string,
    action: () => Promise<unknown>,
    patch: Partial<Driver>,
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

  const validate = useCallback((id: string) =>
    withLoading(id, () => driverService.validate(id), { status: 'Vérifié' }),
  [withLoading]);

  const reject = useCallback((id: string) =>
    withLoading(id, () => driverService.reject(id), { status: 'Rejeté' }),
  [withLoading]);

  const setSelectedId = useCallback(async (id: string | null) => {
    setSelectedIdState(id);
    if (!id) { setDetailDriver(null); return; }

    // Show list data immediately while fetching full detail
    const basic = drivers.find((d) => d.id === id) ?? null;
    setDetailDriver(basic);

    setDetailLoading(true);
    try {
      const { data } = await driverService.getById(id);
      const body = ((data as Record<string, unknown>).body ?? data) as Parameters<typeof mapApiDriverToDriver>[0];
      console.log('[Driver getById] raw documents:', (body as Record<string, unknown>).documents);
      const detail = mapApiDriverToDriver(body);
      console.log('[Driver getById] mapped urls:', {
        selfies: detail.selfies,
        idCard:  detail.idCard,
        permisUrl:     detail.documents.permisUrl,
        carteGriseUrl: detail.documents.carteGriseUrl,
        assuranceUrl:  detail.documents.assuranceUrl,
      });
      // Merge: preserve URL fields from list data if detail doesn't provide them
      setDetailDriver({
        ...detail,
        selfies: detail.selfies ?? basic?.selfies,
        idCard:  detail.idCard  ?? basic?.idCard,
        documents: {
          ...detail.documents,
          permisUrl:     detail.documents.permisUrl     ?? basic?.documents.permisUrl,
          carteGriseUrl: detail.documents.carteGriseUrl ?? basic?.documents.carteGriseUrl,
          assuranceUrl:  detail.documents.assuranceUrl  ?? basic?.documents.assuranceUrl,
        },
      });
    } catch (err) {
      console.error('[Driver getById]', err);
      // keep basic data on error
    } finally {
      setDetailLoading(false);
    }
  }, [drivers]);

  return {
    drivers,
    total,
    pageSize: PAGE_SIZE,
    currentPage,
    setCurrentPage,
    loading,
    fetchError,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    loadingId,
    validate,
    reject,
    selectedId,
    setSelectedId,
    selectedDriver: detailDriver,
    detailLoading,
  };
}
