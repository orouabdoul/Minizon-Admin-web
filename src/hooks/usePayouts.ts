import { useState, useEffect, useCallback } from 'react';
import type { DriverPayout, PayoutMethod, PayoutStatus, PayoutSummary } from '../models/payout.model';
import { payoutService } from '../services/payout_service';

// ── Mock fallback ──────────────────────────────────────────────────────────────

const MOCK: DriverPayout[] = [
  { id: 'py1', driverId: 'd1', driverName: 'Adjovi Sèna',           driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 97 11 22 33', period: 'Août 2026', tripsCount: 198, grossAmount: 297000, commission: 53460, netAmount: 243540, method: 'MTN Mobile Money', status: 'en_attente'    },
  { id: 'py2', driverId: 'd2', driverName: 'Kofi Mensah',            driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 96 44 55 66', period: 'Août 2026', tripsCount: 172, grossAmount: 258000, commission: 46440, netAmount: 211560, method: 'MTN Mobile Money', status: 'en_attente'    },
  { id: 'py3', driverId: 'd3', driverName: 'Adjoa Koffi',            driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 95 77 88 99', period: 'Août 2026', tripsCount: 154, grossAmount: 231000, commission: 41580, netAmount: 189420, method: 'Moov Money',       status: 'en_traitement', reference: 'MOV-2026-0391' },
  { id: 'py4', driverId: 'd4', driverName: 'Jean-Baptiste Hounkpè', driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 94 00 11 22', period: 'Août 2026', tripsCount: 121, grossAmount: 181500, commission: 32670, netAmount: 148830, method: 'Virement bancaire', status: 'payé',          reference: 'VIR-2026-0277', processedAt: '2026-08-01T10:30:00' },
  { id: 'py5', driverId: 'd5', driverName: 'Yao Kobenan',            driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 93 33 44 55', period: 'Août 2026', tripsCount: 98,  grossAmount: 147000, commission: 26460, netAmount: 120540, method: 'MTN Mobile Money', status: 'payé',          reference: 'MTN-2026-0584', processedAt: '2026-08-01T09:15:00' },
  { id: 'py6', driverId: 'd6', driverName: 'Amara Diallo',           driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 92 66 77 88', period: 'Août 2026', tripsCount: 87,  grossAmount: 130500, commission: 23490, netAmount: 107010, method: 'MTN Mobile Money', status: 'échoué'       },
  { id: 'py7', driverId: 'd7', driverName: 'Moussa Traoré',          driverAvatar: 'https://placehold.co/40x40', driverPhone: '+229 91 99 00 11', period: 'Août 2026', tripsCount: 63,  grossAmount: 94500,  commission: 17010, netAmount: 77490,  method: 'Moov Money',       status: 'en_attente'   },
];

function buildSummary(list: DriverPayout[]): PayoutSummary {
  return {
    totalPending:  list.filter((p) => p.status === 'en_attente').reduce((s, p) => s + p.netAmount, 0),
    totalPaid:     list.filter((p) => p.status === 'payé').reduce((s, p) => s + p.netAmount, 0),
    totalDrivers:  list.length,
    pendingAmount: list.filter((p) => p.status === 'en_attente').length,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractList(body: any): DriverPayout[] {
  if (Array.isArray(body))       return body;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePayouts() {
  const [allPayouts, setAllPayouts] = useState<DriverPayout[]>([]);
  const [summary,    setSummary]    = useState<PayoutSummary>(buildSummary(MOCK));
  const [loading,    setLoading]    = useState(false);
  const [usingMock,  setUsingMock]  = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'all'>('all');
  const [processing,   setProcessing]   = useState<string | null>(null);
  const [exportMsg,    setExportMsg]    = useState<string | null>(null);
  const [selected,     setSelected]     = useState<Set<string>>(new Set());

  const [generating,    setGenerating]    = useState(false);
  const [generateMsg,   setGenerateMsg]   = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [paidMsg,       setPaidMsg]       = useState<string | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [listRes, summaryRes] = await Promise.all([
        payoutService.getAll(statusFilter),
        payoutService.getSummary(),
      ]);
      const list = extractList(listRes.data.body);
      setAllPayouts(list);
      setSummary(summaryRes.data.body ?? buildSummary(list));
      setUsingMock(false);
    } catch {
      setUsingMock(true);
      setFetchError(null);
      setAllPayouts(MOCK);
      setSummary(buildSummary(MOCK));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Visible list (client filter on mock, API handles real filter) ──────────
  const payouts = usingMock && statusFilter !== 'all'
    ? allPayouts.filter((p) => p.status === statusFilter)
    : allPayouts;

  // ── Generate payout sheets ─────────────────────────────────────────────────
  const generatePayouts = useCallback(async () => {
    setGenerating(true);
    setGenerateMsg(null);
    setGenerateError(null);
    try {
      const res = await payoutService.generate('month');
      const body = res.data.body;
      const count = body?.generated ?? 0;
      setGenerateMsg(count > 0 ? `${count} fiche(s) générée(s) avec succès.` : 'Aucune nouvelle fiche à générer.');
      await loadData();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setGenerateError((e as any)?.response?.data?.message ?? 'Erreur lors de la génération.');
    } finally {
      setGenerating(false);
      setTimeout(() => { setGenerateMsg(null); setGenerateError(null); }, 5000);
    }
  }, [loadData]);

  // ── Process (en_attente → en_traitement) ──────────────────────────────────
  const processPayout = useCallback(async (id: string, method: PayoutMethod) => {
    setProcessing(id);
    setAllPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'en_traitement' as const } : p));
    try {
      const res = await payoutService.process(id, method);
      if (res.data.body) {
        setAllPayouts((prev) => prev.map((p) => p.id === id ? { ...p, ...res.data.body } : p));
      }
    } catch {
      // keep optimistic
    } finally {
      setProcessing(null);
    }
  }, []);

  // ── Mark paid (en_traitement → payé) ──────────────────────────────────────
  const markPaid = useCallback(async (id: string) => {
    setAllPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'payé' as const, processedAt: new Date().toISOString() } : p));
    try {
      const res = await payoutService.markPaid(id);
      if (res.data.body) {
        setAllPayouts((prev) => prev.map((p) => p.id === id ? { ...p, ...res.data.body } : p));
      }
      setPaidMsg('✓ Virement confirmé — le conducteur a été notifié automatiquement.');
      setTimeout(() => setPaidMsg(null), 3500);
    } catch {
      // keep optimistic
    }
  }, []);

  // ── Retry (échoué → en_attente) ───────────────────────────────────────────
  const retryPayout = useCallback(async (id: string) => {
    setAllPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'en_attente' as const } : p));
    try {
      await payoutService.retry(id);
    } catch {
      // keep optimistic
    }
  }, []);

  // ── Selection ─────────────────────────────────────────────────────────────
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

  // ── Batch process ─────────────────────────────────────────────────────────
  const batchProcess = useCallback(async (method: PayoutMethod) => {
    const uuids = Array.from(selected);
    setAllPayouts((prev) => prev.map((p) => uuids.includes(p.id) ? { ...p, status: 'en_traitement' as const } : p));
    setSelected(new Set());
    try {
      await payoutService.batchProcess(uuids, method);
    } catch {
      // keep optimistic
    }
  }, [selected]);

  // ── Export CSV ────────────────────────────────────────────────────────────
  const exportCsv = useCallback(async () => {
    setExportMsg('Export en cours…');
    try {
      const res = await payoutService.exportCsv(statusFilter !== 'all' ? statusFilter : undefined);
      const blob = new Blob([res.data as BlobPart], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `virements_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportMsg('Fichier CSV téléchargé.');
    } catch {
      setExportMsg('Export CSV non disponible en ce moment.');
    } finally {
      setTimeout(() => setExportMsg(null), 3500);
    }
  }, [statusFilter]);

  return {
    payouts, summary, loading, usingMock, fetchError,
    statusFilter, setStatusFilter,
    processing, exportMsg, paidMsg,
    selected, toggleSelect, selectAll, clearSelection,
    generating, generateMsg, generateError, generatePayouts,
    processPayout, markPaid, retryPayout, batchProcess, exportCsv,
    refresh: loadData,
  };
}
