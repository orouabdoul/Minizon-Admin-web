import { useState, useEffect, useCallback } from 'react';
import { refundService } from '../services/refund_service';
import type { PassengerRefund, RefundStatus, RefundMethod, RefundSummary } from '../models/refund.model';

// Backend returns snake_case; normalize to the camelCase model used in the UI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeRefund(r: any): PassengerRefund {
  return {
    id:              r.id              ?? r.uuid             ?? '',
    tripId:          r.tripId          ?? r.trip_id          ?? '',
    passengerName:   r.passengerName   ?? r.passenger_name   ?? '',
    passengerAvatar: r.passengerAvatar ?? r.passenger_avatar ?? '',
    passengerPhone:  r.passengerPhone  ?? r.passenger_phone  ?? '',
    driverName:      r.driverName      ?? r.driver_name      ?? '',
    tripAmount:      r.tripAmount      ?? r.trip_amount      ?? 0,
    refundAmount:    r.refundAmount    ?? r.refund_amount     ?? 0,
    reason:          r.reason          ?? 'autre',
    reasonDetail:    r.reasonDetail    ?? r.reason_detail    ?? undefined,
    requestedAt:     r.requestedAt     ?? r.requested_at     ?? '',
    status:          r.status          ?? 'en_attente',
    processedAt:     r.processedAt     ?? r.processed_at     ?? undefined,
    method:          r.method          ?? undefined,
    reference:       r.reference       ?? undefined,
  };
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
      const res = await refundService.getAll();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw  = res.data as any;
      const list = raw?.body?.refunds ?? raw?.body ?? raw?.refunds ?? raw ?? [];
      setRefunds(Array.isArray(list) ? list.map(normalizeRefund) : []);
    } catch {
      setError('Impossible de charger les remboursements. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRefunds(); }, [fetchRefunds]);

  const approve = useCallback(async (id: string, method: RefundMethod) => {
    setProcessing(id);
    setRefunds((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: 'approuvé' as const, method } : r
    ));
    try { await refundService.approve(id, method); } catch { /* keep optimistic */ }
    finally { setProcessing(null); flash('Remboursement approuvé — en attente d\'exécution'); }
  }, []);

  const reject = useCallback(async (id: string) => {
    setProcessing(id);
    setRefunds((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: 'rejeté' as const, processedAt: new Date().toISOString() } : r
    ));
    try { await refundService.reject(id, 'Décision administrative'); } catch { /* keep optimistic */ }
    finally { setProcessing(null); flash('Demande de remboursement rejetée'); }
  }, []);

  const markDone = useCallback(async (id: string, reference: string) => {
    setProcessing(id);
    setRefunds((prev) => prev.map((r) =>
      r.id === id
        ? { ...r, status: 'remboursé' as const, reference, processedAt: new Date().toISOString() }
        : r
    ));
    try { await refundService.markDone(id, reference); } catch { /* keep optimistic */ }
    finally { setProcessing(null); flash(`Remboursement confirmé · Réf. ${reference}`); }
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

  // Summary computed from the full unfiltered list so KPI cards are always accurate
  const summary: RefundSummary = {
    totalPending:   refunds.filter((r) => r.status === 'en_attente').length,
    pendingAmount:  refunds.filter((r) => r.status === 'en_attente').reduce((s, r) => s + r.refundAmount, 0),
    totalRefunded:  refunds.filter((r) => r.status === 'remboursé').length,
    refundedAmount: refunds.filter((r) => r.status === 'remboursé').reduce((s, r) => s + r.refundAmount, 0),
  };

  return {
    refunds: visible, loading, error, processing, summary,
    statusFilter, search, actionMsg,
    setStatusFilter, setSearch, approve, reject, markDone,
    reload: fetchRefunds,
  };
}
