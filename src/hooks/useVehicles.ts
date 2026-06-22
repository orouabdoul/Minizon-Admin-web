import { useState, useEffect, useCallback } from 'react';
import { vehiclesService } from '../services/vehicles_service';
import type { Vehicle, VehicleMetrics } from '../models/vehicle.model';

const PAGE_SIZE = 15;

export function useVehicles() {
  // ── Metrics ───────────────────────────────────────────
  const [metrics, setMetrics] = useState<VehicleMetrics>({ total: 0, actif: 0, inspection: 0, suspendu: 0 });

  // ── List ──────────────────────────────────────────────
  const [vehicles,    setVehicles]    = useState<Vehicle[]>([]);
  const [total,       setTotal]       = useState(0);
  const [loading,     setLoading]     = useState(true);

  // ── Filters ───────────────────────────────────────────
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter,   setTypeFilter]   = useState('');
  const [currentPage,  setCurrentPage]  = useState(1);

  // ── Detail selection ──────────────────────────────────
  const [selectedId,      setSelectedId]      = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // ── Fetch metrics ─────────────────────────────────────
  const fetchMetrics = useCallback(() => {
    vehiclesService.getMetrics()
      .then((r) => { if (r.data.success) setMetrics(r.data.body); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  // ── Fetch list ────────────────────────────────────────
  const fetchList = useCallback(() => {
    setLoading(true);
    vehiclesService.getList({
      ...(search       ? { search }           : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(typeFilter   ? { type:   typeFilter }   : {}),
      page:     currentPage,
      per_page: PAGE_SIZE,
    })
      .then((r) => {
        if (r.data.success) {
          setVehicles(r.data.body.data);
          setTotal(r.data.body.total);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, statusFilter, typeFilter, currentPage]);

  useEffect(() => { fetchList(); }, [fetchList]);

  // ── Fetch detail on selection ─────────────────────────
  useEffect(() => {
    if (!selectedId) { setSelectedVehicle(null); return; }
    vehiclesService.getById(selectedId)
      .then((r) => { if (r.data.success) setSelectedVehicle(r.data.body); })
      .catch(() => setSelectedVehicle(null));
  }, [selectedId]);

  // ── Actions ───────────────────────────────────────────
  const refresh = useCallback(() => { fetchList(); fetchMetrics(); }, [fetchList, fetchMetrics]);

  const approveVehicle = useCallback(async (id: string) => {
    await vehiclesService.approve(id);
    refresh();
  }, [refresh]);

  const rejectVehicle = useCallback(async (id: string, reason: string) => {
    await vehiclesService.reject(id, reason);
    refresh();
  }, [refresh]);

  const suspendVehicle = useCallback(async (id: string, reason: string) => {
    await vehiclesService.suspend(id, reason);
    refresh();
  }, [refresh]);

  const reinstateVehicle = useCallback(async (id: string) => {
    await vehiclesService.reinstate(id);
    refresh();
  }, [refresh]);

  const deleteVehicle = useCallback(async (id: string) => {
    await vehiclesService.delete(id);
    refresh();
  }, [refresh]);

  // ── Filter setters (reset page on change) ────────────
  const handleSearch = useCallback((v: string) => { setSearch(v);       setCurrentPage(1); }, []);
  const handleStatus = useCallback((v: string) => { setStatusFilter(v); setCurrentPage(1); }, []);
  const handleType   = useCallback((v: string) => { setTypeFilter(v);   setCurrentPage(1); }, []);

  return {
    vehicles, total, pageSize: PAGE_SIZE, currentPage, setCurrentPage, loading,
    search,       setSearch:       handleSearch,
    statusFilter, setStatusFilter: handleStatus,
    typeFilter,   setTypeFilter:   handleType,
    metrics,
    selectedVehicle, setSelectedId,
    approveVehicle, rejectVehicle, suspendVehicle, reinstateVehicle, deleteVehicle,
  };
}
