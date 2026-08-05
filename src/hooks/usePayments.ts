import { useState, useEffect, useCallback } from 'react';
import { paymentService }               from '../services/payment_service';
import { mapApiPaymentToPayment }        from '../models/payment.model';
import type { Payment, PaymentMetrics, SyncAllResult } from '../models/payment.model';

const PAGE_SIZE = 15;

export function usePayments() {
  // ── Metrics ──────────────────────────────────────────
  const [metrics,        setMetrics]        = useState<PaymentMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    paymentService.getMetrics()
      .then((res) => setMetrics(res.data.body))
      .catch(() => {})
      .finally(() => setMetricsLoading(false));
  }, []);

  // ── Filters ──────────────────────────────────────────
  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState('');
  const [methodFilter,  setMethodFilter]  = useState('');
  const [dateFilter,    setDateFilter]    = useState('');

  const [appliedSearch,  setAppliedSearch]  = useState('');
  const [appliedStatus,  setAppliedStatus]  = useState('');
  const [appliedMethod,  setAppliedMethod]  = useState('');
  const [appliedDate,    setAppliedDate]    = useState('');

  // ── List ─────────────────────────────────────────────
  const [payments,     setPayments]     = useState<Payment[]>([]);
  const [total,        setTotal]        = useState(0);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState<string | null>(null);

  const fetchPayments = useCallback((page: number, search: string, status: string, method: string, date: string) => {
    setLoading(true);
    setFetchError(null);
    paymentService.getAll(page, PAGE_SIZE, {
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
      ...(method ? { method } : {}),
      ...(date   ? { date }   : {}),
    })
      .then((res) => {
        const body = res.data.body;
        setPayments(body.data.map(mapApiPaymentToPayment));
        setTotal(body.total);
      })
      .catch((e) => setFetchError(e?.response?.data?.message ?? 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPayments(currentPage, appliedSearch, appliedStatus, appliedMethod, appliedDate);
  }, [fetchPayments, currentPage, appliedSearch, appliedStatus, appliedMethod, appliedDate]);

  const applyFilters = useCallback(() => {
    setAppliedSearch(search);
    setAppliedStatus(statusFilter);
    setAppliedMethod(methodFilter);
    setAppliedDate(dateFilter);
    setCurrentPage(1);
  }, [search, statusFilter, methodFilter, dateFilter]);

  const resetFilters = useCallback(() => {
    setSearch(''); setStatusFilter(''); setMethodFilter(''); setDateFilter('');
    setAppliedSearch(''); setAppliedStatus(''); setAppliedMethod(''); setAppliedDate('');
    setCurrentPage(1);
  }, []);

  // ── Detail ────────────────────────────────────────────
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [detailLoading,   setDetailLoading]   = useState(false);

  const setSelectedId = useCallback(async (id: string | null) => {
    if (!id) { setSelectedPayment(null); return; }
    const quick = payments.find((p) => p.id === id) ?? null;
    setSelectedPayment(quick);
    setDetailLoading(true);
    try {
      const res = await paymentService.getById(id);
      setSelectedPayment(mapApiPaymentToPayment(res.data.body));
    } catch { /* keep quick data */ }
    finally { setDetailLoading(false); }
  }, [payments]);

  // ── Refund ────────────────────────────────────────────
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const refund = useCallback(async (id: string) => {
    setLoadingId(id);
    try {
      await paymentService.refund(id);
      setPayments((prev) => prev.map((p) => p.id === id ? { ...p, canRefund: false, status: 'Remboursé' } : p));
      setSelectedPayment((prev) => prev?.id === id ? { ...prev, canRefund: false, status: 'Remboursé' } : prev);
    } catch { /* server message visible via fetchError */ }
    finally { setLoadingId(null); }
  }, []);

  // ── Sync all (global FedaPay sync) ───────────────────
  const [syncAllLoading, setSyncAllLoading] = useState(false);
  const [syncAllResult,  setSyncAllResult]  = useState<SyncAllResult | null>(null);
  const [syncAllError,   setSyncAllError]   = useState<string | null>(null);

  const syncAll = useCallback(async () => {
    setSyncAllLoading(true);
    setSyncAllResult(null);
    setSyncAllError(null);
    try {
      const res = await paymentService.syncAll();
      setSyncAllResult(res.data.body);
      // Reload the list to reflect updated statuses
      fetchPayments(currentPage, appliedSearch, appliedStatus, appliedMethod, appliedDate);
      // Also refresh metrics
      paymentService.getMetrics().then((r) => setMetrics(r.data.body)).catch(() => {});
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSyncAllError((e as any)?.response?.data?.message ?? 'Erreur lors de la synchronisation FedaPay.');
    } finally {
      setSyncAllLoading(false);
    }
  }, [fetchPayments, currentPage, appliedSearch, appliedStatus, appliedMethod, appliedDate]);

  const dismissSyncResult = useCallback(() => {
    setSyncAllResult(null);
    setSyncAllError(null);
  }, []);

  // ── Sync one (single payment FedaPay check) ──────────
  const [syncOneLoading, setSyncOneLoading] = useState(false);

  const syncOne = useCallback(async (id: string) => {
    setSyncOneLoading(true);
    try {
      const res = await paymentService.syncOne(id);
      const updated = mapApiPaymentToPayment(res.data.body);
      // Update list row
      setPayments((prev) => prev.map((p) => p.id === id ? updated : p));
      // Update modal
      setSelectedPayment(updated);
    } catch {
      // Error displayed via syncOneError if needed; silently keep current state
    } finally {
      setSyncOneLoading(false);
    }
  }, []);

  return {
    // metrics
    metrics, metricsLoading,
    // list
    payments, total, pageSize: PAGE_SIZE, currentPage, setCurrentPage,
    loading, fetchError,
    // filters
    search, setSearch,
    statusFilter,  setStatusFilter,
    methodFilter,  setMethodFilter,
    dateFilter,    setDateFilter,
    applyFilters, resetFilters,
    // detail
    setSelectedId, selectedPayment, detailLoading,
    // refund
    loadingId, refund,
    // sync all
    syncAll, syncAllLoading, syncAllResult, syncAllError, dismissSyncResult,
    // sync one
    syncOne, syncOneLoading,
  };
}
