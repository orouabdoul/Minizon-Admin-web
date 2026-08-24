import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { paymentService }          from '../services/payment_service';
import { mapApiPaymentToPayment }   from '../models/payment.model';
import type { PassengerRefund, RefundStatus, RefundSummary } from '../models/refund.model';

// Payment amounts come as formatted strings ("8 500 FCFA") — extract the integer
function parseAmount(s: string): number {
  return parseInt(String(s ?? '0').replace(/[^\d]/g, ''), 10) || 0;
}

// Map payment status + canRefund flag → RefundStatus used by the UI
function toRefundStatus(paymentStatus: string, canRefund: boolean): RefundStatus {
  if (paymentStatus === 'Remboursé') return 'remboursé';
  if (paymentStatus === 'Échoué')    return 'rejeté';
  if (canRefund)                     return 'en_attente';
  return 'en_attente';
}

export function useRefunds() {
  const [refunds,      setRefunds]      = useState<PassengerRefund[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [processing,   setProcessing]   = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<RefundStatus | 'all'>('all');
  const [search,       setSearch]       = useState('');
  const [actionMsg,    setActionMsg]    = useState<string | null>(null);

  const flash = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 4000);
  };

  const fetchRefunds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all payments — the API doesn't have a dedicated refunds endpoint.
      // We show only payments that are refundable (canRefund=true) or already refunded.
      const res = await paymentService.getAll(1, 200);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw  = res.data as any;
      const list = raw?.body?.data ?? raw?.body ?? raw?.data ?? [];

      const mapped: PassengerRefund[] = (Array.isArray(list) ? list : [])
        .map(mapApiPaymentToPayment)
        .filter((p) => p.canRefund || p.status === 'Remboursé')
        .map((p) => ({
          id:              p.id,
          tripId:          p.reservationId,
          passengerName:   p.passengerName,
          passengerAvatar: p.passengerAvatar,
          passengerPhone:  p.passengerPhone,
          driverName:      p.driverName,
          tripAmount:      parseAmount(p.amount),
          refundAmount:    parseAmount(p.amount),
          reason:          'autre' as const,
          requestedAt:     p.createdAt,
          status:          toRefundStatus(p.status, p.canRefund),
          method:          p.method   || undefined,
          reference:       p.reference || undefined,
        }));

      setRefunds(mapped);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[useRefunds] error:', err);
      let msg = 'Impossible de charger les remboursements.';
      if (axios.isAxiosError(err)) {
        const status    = err.response?.status;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serverMsg = (err.response?.data as any)?.message ?? (err.response?.data as any)?.body?.message;
        if (status === 401 || status === 403) msg = `Accès refusé (${status}) — vérifiez votre session.`;
        else if (status === 404)              msg = `Endpoint introuvable (${status}).`;
        else if (status === 500)              msg = `Erreur serveur (500)${serverMsg ? ` : ${serverMsg}` : ''}.`;
        else if (status)                      msg = `Erreur ${status}${serverMsg ? ` : ${serverMsg}` : ''}.`;
        else if (err.code === 'ECONNABORTED') msg = 'Délai dépassé — le serveur ne répond pas.';
        else                                  msg = `Erreur réseau : ${err.message}`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRefunds(); }, [fetchRefunds]);

  // Single refund action — POST /admin/payments/{id}/refund
  const doRefund = useCallback(async (id: string) => {
    setProcessing(id);
    // Optimistic update
    setRefunds((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: 'remboursé' as const, processedAt: new Date().toISOString() } : r
    ));
    try {
      await paymentService.refund(id);
      flash('Remboursement effectué avec succès');
    } catch {
      // Rollback on failure
      setRefunds((prev) => prev.map((r) =>
        r.id === id ? { ...r, status: 'en_attente' as const, processedAt: undefined } : r
      ));
      flash('Erreur lors du remboursement. Veuillez réessayer.');
    } finally {
      setProcessing(null);
    }
  }, []);

  const visible = refunds.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || r.passengerName.toLowerCase().includes(q)
      || r.tripId.toLowerCase().includes(q)
      || r.driverName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // Summary from unfiltered list so KPI cards stay accurate regardless of active filter
  const summary: RefundSummary = {
    totalPending:   refunds.filter((r) => r.status === 'en_attente').length,
    pendingAmount:  refunds.filter((r) => r.status === 'en_attente').reduce((s, r) => s + r.refundAmount, 0),
    totalRefunded:  refunds.filter((r) => r.status === 'remboursé').length,
    refundedAmount: refunds.filter((r) => r.status === 'remboursé').reduce((s, r) => s + r.refundAmount, 0),
  };

  return {
    refunds: visible, loading, error, processing, summary,
    statusFilter, search, actionMsg,
    setStatusFilter, setSearch, doRefund, reload: fetchRefunds,
  };
}
