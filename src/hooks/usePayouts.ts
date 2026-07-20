import { useState, useEffect, useCallback } from 'react';
import type { DriverPayout, PayoutMethod, PayoutSummary } from '../models/payout.model';
import { payoutService } from '../services/payout_service';

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK: DriverPayout[] = [
  { id: 'py1', driverId: 'd1', driverName: 'Adjovi Sèna',           driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 97 11 22 33', period: 'Juin 2026', tripsCount: 198, grossAmount: 297000, commission: 53460, netAmount: 243540, method: 'MTN Mobile Money', status: 'en_attente'    },
  { id: 'py2', driverId: 'd2', driverName: 'Kofi Mensah',            driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 96 44 55 66', period: 'Juin 2026', tripsCount: 172, grossAmount: 258000, commission: 46440, netAmount: 211560, method: 'MTN Mobile Money', status: 'en_attente'    },
  { id: 'py3', driverId: 'd3', driverName: 'Adjoa Koffi',            driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 95 77 88 99', period: 'Juin 2026', tripsCount: 154, grossAmount: 231000, commission: 41580, netAmount: 189420, method: 'Moov Money',       status: 'en_traitement', reference: 'MOV-2026-0391' },
  { id: 'py4', driverId: 'd4', driverName: 'Jean-Baptiste Hounkpè', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 94 00 11 22', period: 'Juin 2026', tripsCount: 121, grossAmount: 181500, commission: 32670, netAmount: 148830, method: 'Virement bancaire', status: 'payé',          reference: 'VIR-2026-0277', processedAt: '2026-07-05T10:30:00' },
  { id: 'py5', driverId: 'd5', driverName: 'Yao Kobenan',            driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 93 33 44 55', period: 'Juin 2026', tripsCount: 98,  grossAmount: 147000, commission: 26460, netAmount: 120540, method: 'MTN Mobile Money', status: 'payé',          reference: 'MTN-2026-0584', processedAt: '2026-07-05T09:15:00' },
  { id: 'py6', driverId: 'd6', driverName: 'Amara Diallo',           driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 92 66 77 88', period: 'Juin 2026', tripsCount: 87,  grossAmount: 130500, commission: 23490, netAmount: 107010, method: 'MTN Mobile Money', status: 'échoué'       },
  { id: 'py7', driverId: 'd7', driverName: 'Moussa Traoré',          driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 91 99 00 11', period: 'Juin 2026', tripsCount: 63,  grossAmount: 94500,  commission: 17010, netAmount: 77490,  method: 'Moov Money',       status: 'en_attente'   },
];

const MOCK_SUMMARY: PayoutSummary = {
  totalPending:  MOCK.filter((p) => p.status === 'en_attente').reduce((s, p) => s + p.netAmount, 0),
  totalPaid:     MOCK.filter((p) => p.status === 'payé').reduce((s, p) => s + p.netAmount, 0),
  totalDrivers:  MOCK.length,
  pendingAmount: MOCK.filter((p) => p.status === 'en_attente').length,
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePayouts() {
  const [payouts,   setPayouts]   = useState<DriverPayout[]>(MOCK);
  const [summary,   setSummary]   = useState<PayoutSummary>(MOCK_SUMMARY);
  const [loading,   setLoading]   = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const [selected,  setSelected]  = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    payoutService.getAll()
      .then((res) => {
        const data = res.data.body;
        if (Array.isArray(data) && data.length > 0) {
          setPayouts(data);
          setSummary({
            totalPending:  data.filter((p: DriverPayout) => p.status === 'en_attente').reduce((s: number, p: DriverPayout) => s + p.netAmount, 0),
            totalPaid:     data.filter((p: DriverPayout) => p.status === 'payé').reduce((s: number, p: DriverPayout) => s + p.netAmount, 0),
            totalDrivers:  data.length,
            pendingAmount: data.filter((p: DriverPayout) => p.status === 'en_attente').length,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const processPayout = useCallback(async (id: string, method: PayoutMethod) => {
    setProcessing(id);
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'en_traitement' as const } : p));
    try { await payoutService.process(id, method); }
    catch { /* keep optimistic */ }
    finally { setProcessing(null); }
  }, []);

  const markPaid = useCallback(async (id: string) => {
    const ref = `MTN-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'payé' as const, reference: ref, processedAt: new Date().toISOString() } : p));
    try { await payoutService.markPaid(id, ref); }
    catch { /* keep optimistic */ }
  }, []);

  const retryPayout = useCallback(async (id: string) => {
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'en_attente' as const } : p));
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const pending = payouts.filter((p) => p.status === 'en_attente').map((p) => p.id);
    setSelected(new Set(pending));
  }, [payouts]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const batchProcess = useCallback(async (method: PayoutMethod) => {
    const ids = Array.from(selected);
    setPayouts((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, status: 'en_traitement' as const } : p));
    setSelected(new Set());
    try { await payoutService.batchPay(ids, method); }
    catch { /* keep optimistic */ }
  }, [selected]);

  const exportCsv = useCallback(() => {
    payoutService.exportCsv().catch(() => {});
    setExportMsg('Export CSV en cours de génération…');
    setTimeout(() => setExportMsg(null), 3000);
  }, []);

  return {
    payouts, summary, loading, processing, exportMsg,
    selected, toggleSelect, selectAll, clearSelection,
    processPayout, markPaid, retryPayout, batchProcess, exportCsv,
  };
}
