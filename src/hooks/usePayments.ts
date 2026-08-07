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
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [dateFilter,   setDateFilter]   = useState('');

  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('');
  const [appliedMethod, setAppliedMethod] = useState('');
  const [appliedDate,   setAppliedDate]   = useState('');

  // ── List ─────────────────────────────────────────────
  const [payments,    setPayments]    = useState<Payment[]>([]);
  const [total,       setTotal]       = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [fetchError,  setFetchError]  = useState<string | null>(null);

  const fetchPayments = useCallback((
    page: number, search: string, status: string, method: string, date: string,
  ) => {
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
  const [loadingId,   setLoadingId]   = useState<string | null>(null);
  const [refundError, setRefundError] = useState<string | null>(null);

  const dismissRefundError = useCallback(() => setRefundError(null), []);

  const refund = useCallback(async (id: string) => {
    setLoadingId(id);
    setRefundError(null);
    try {
      await paymentService.refund(id);
      setPayments((prev) =>
        prev.map((p) => p.id === id ? { ...p, canRefund: false, status: 'Remboursé' } : p),
      );
      setSelectedPayment((prev) =>
        prev?.id === id ? { ...prev, canRefund: false, status: 'Remboursé' } : prev,
      );
      // Refresh metrics so counts stay accurate
      paymentService.getMetrics().then((r) => setMetrics(r.data.body)).catch(() => {});
    } catch (e: unknown) {
      const httpStatus = (e as any)?.response?.status;
      const apiMsg     = (e as any)?.response?.data?.message;
      const msg = apiMsg ?? (
        httpStatus === 422 ? 'Ce paiement ne peut pas être remboursé.' :
        httpStatus === 502 ? 'Erreur FedaPay : remboursement impossible pour le moment.' :
                             'Erreur lors du remboursement. Veuillez réessayer.'
      );
      setRefundError(msg);
    } finally {
      setLoadingId(null);
    }
  }, []);

  // ── Release ───────────────────────────────────────────
  const [releaseError, setReleaseError] = useState<string | null>(null);

  const dismissReleaseError = useCallback(() => setReleaseError(null), []);

  const release = useCallback(async (id: string) => {
    setLoadingId(id);
    setReleaseError(null);
    try {
      const res = await paymentService.release(id);
      const updated = mapApiPaymentToPayment(res.data.body);
      setPayments((prev) => prev.map((p) => p.id === id ? updated : p));
      setSelectedPayment((prev) => prev?.id === id ? updated : prev);
      paymentService.getMetrics().then((r) => setMetrics(r.data.body)).catch(() => {});
    } catch (e: unknown) {
      const httpStatus = (e as any)?.response?.status;
      const apiMsg     = (e as any)?.response?.data?.message;
      const msg = apiMsg ?? (
        httpStatus === 422 ? 'Ce paiement ne peut pas être libéré.' :
        httpStatus === 403 ? 'Accès refusé.' :
                             'Erreur lors de la libération. Veuillez réessayer.'
      );
      setReleaseError(msg);
    } finally {
      setLoadingId(null);
    }
  }, []);

  // ── Release confirmation ──────────────────────────────
  const [confirmReleaseId, setConfirmReleaseId] = useState<string | null>(null);

  const requestRelease = useCallback((id: string) => setConfirmReleaseId(id), []);
  const cancelRelease  = useCallback(() => setConfirmReleaseId(null), []);
  const confirmRelease = useCallback(async () => {
    const id = confirmReleaseId;
    setConfirmReleaseId(null);
    if (id) await release(id);
  }, [confirmReleaseId, release]);

  // ── Refund confirmation ───────────────────────────────
  const [confirmRefundId, setConfirmRefundId] = useState<string | null>(null);

  const requestRefund  = useCallback((id: string) => setConfirmRefundId(id), []);
  const cancelRefund   = useCallback(() => setConfirmRefundId(null), []);
  const confirmRefund  = useCallback(async () => {
    const id = confirmRefundId;
    setConfirmRefundId(null);
    if (id) await refund(id);
  }, [confirmRefundId, refund]);

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
      fetchPayments(currentPage, appliedSearch, appliedStatus, appliedMethod, appliedDate);
      paymentService.getMetrics().then((r) => setMetrics(r.data.body)).catch(() => {});
    } catch (e) {
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
      setPayments((prev) => prev.map((p) => p.id === id ? updated : p));
      setSelectedPayment(updated);
    } catch {
      // silently keep current state
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
    loadingId, refundError, dismissRefundError,
    requestRefund, cancelRefund, confirmRefund, confirmRefundId,
    // release
    releaseError, dismissReleaseError,
    requestRelease, cancelRelease, confirmRelease, confirmReleaseId,
    // sync all
    syncAll, syncAllLoading, syncAllResult, syncAllError, dismissSyncResult,
    // sync one
    syncOne, syncOneLoading,
  };
}
