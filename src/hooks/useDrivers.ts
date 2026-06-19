import { useState, useCallback, useEffect } from 'react';
import { driverService }        from '../services/driver_service';
import { mapApiDriverToDriver } from '../models/driver.model';
import type { Driver }          from '../models/driver.model';

const PAGE_SIZE = 10;

export function useDrivers() {
  const [drivers,      setDrivers]     = useState<Driver[]>([]);
  const [total,        setTotal]       = useState(0);
  const [loading,      setLoading]     = useState(false);
  const [search,       setSearchState] = useState('');
  const [statusFilter, setStatusState] = useState<string>('all');
  const [currentPage,  setCurrentPage] = useState(1);
  const [loadingId,    setLoadingId]   = useState<string | null>(null);
  const [selectedId,   setSelectedId]  = useState<string | null>(null);

  const fetchDrivers = useCallback(async (page: number, status: string, q: string) => {
    setLoading(true);
    try {
      const { data } = await driverService.getAll(page, PAGE_SIZE, status, q);
      setDrivers(data.body.data.map(mapApiDriverToDriver));
      setTotal(data.body.total);
    } catch {
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

  const selectedDriver = selectedId
    ? (drivers.find((d) => d.id === selectedId) ?? null)
    : null;

  return {
    drivers,
    total,
    pageSize: PAGE_SIZE,
    currentPage,
    setCurrentPage,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    loadingId,
    validate,
    reject,
    selectedId,
    setSelectedId,
    selectedDriver,
  };
}
