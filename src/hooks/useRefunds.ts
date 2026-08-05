import { useState, useCallback } from 'react';
import { refundService } from '../services/refund_service';
import type { PassengerRefund, RefundStatus, RefundMethod, RefundSummary } from '../models/refund.model';

const MOCK: PassengerRefund[] = [
  {
    id: 'r1', tripId: '#TRJ-8401',
    passengerName: 'Fatou Diallo', passengerAvatar: 'https://placehold.co/40x40',
    passengerPhone: '+229 97 11 22 33', driverName: 'Koffi Mensah',
    tripAmount: 8500, refundAmount: 8500,
    reason: 'annulation', reasonDetail: 'Conducteur annulé sans prévenir',
    requestedAt: '2026-07-28T10:15:00Z', status: 'en_attente',
  },
  {
    id: 'r2', tripId: '#TRJ-8312',
    passengerName: 'Moussa Traoré', passengerAvatar: 'https://placehold.co/40x40',
    passengerPhone: '+229 96 44 55 66', driverName: 'Adjovi Sèna',
    tripAmount: 12000, refundAmount: 6000,
    reason: 'surfacturation', reasonDetail: 'Montant débité deux fois',
    requestedAt: '2026-07-27T14:30:00Z', status: 'en_attente',
  },
  {
    id: 'r3', tripId: '#TRJ-8290',
    passengerName: 'Aminata Koné', passengerAvatar: 'https://placehold.co/40x40',
    passengerPhone: '+229 95 77 88 99', driverName: 'Jean-Baptiste Hounkpè',
    tripAmount: 5000, refundAmount: 5000,
    reason: 'problème_trajet', reasonDetail: 'Trajet non effectué malgré paiement',
    requestedAt: '2026-07-26T09:00:00Z', status: 'approuvé',
    method: 'MTN Mobile Money',
  },
  {
    id: 'r4', tripId: '#TRJ-8255',
    passengerName: 'Yao Agbotse', passengerAvatar: 'https://placehold.co/40x40',
    passengerPhone: '+229 94 33 44 55', driverName: 'Aminata Diallo',
    tripAmount: 9500, refundAmount: 9500,
    reason: 'double_paiement', reasonDetail: 'Double débit Mobile Money',
    requestedAt: '2026-07-25T16:45:00Z', status: 'remboursé',
    method: 'MTN Mobile Money', reference: 'REF-2026-0847',
    processedAt: '2026-07-26T08:00:00Z',
  },
  {
    id: 'r5', tripId: '#TRJ-8210',
    passengerName: 'Brice Homénou', passengerAvatar: 'https://placehold.co/40x40',
    passengerPhone: '+229 93 22 33 44', driverName: 'Moussa Traoré',
    tripAmount: 7500, refundAmount: 7500,
    reason: 'annulation',
    requestedAt: '2026-07-24T11:00:00Z', status: 'rejeté',
    processedAt: '2026-07-24T15:00:00Z',
  },
  {
    id: 'r6', tripId: '#TRJ-8198',
    passengerName: 'Célestine Gbaguidi', passengerAvatar: 'https://placehold.co/40x40',
    passengerPhone: '+229 92 11 22 33', driverName: 'Koffi Mensah',
    tripAmount: 15000, refundAmount: 15000,
    reason: 'autre', reasonDetail: 'Problème technique lors du paiement',
    requestedAt: '2026-07-23T08:30:00Z', status: 'en_attente',
  },
];

export function useRefunds() {
  const [refunds,    setRefunds]    = useState<PassengerRefund[]>(MOCK);
  const [loading]                   = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<RefundStatus | 'all'>('all');
  const [search,     setSearch]     = useState('');
  const [actionMsg,  setActionMsg]  = useState<string | null>(null);

  const flash = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 4000);
  };

  const approve = useCallback(async (id: string, method: RefundMethod) => {
    setProcessing(id);
    setRefunds((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approuvé' as const, method } : r));
    try { await refundService.approve(id, method); } catch { /* keep optimistic */ }
    finally { setProcessing(null); flash('Remboursement approuvé — en attente d\'exécution'); }
  }, []);

  const reject = useCallback(async (id: string) => {
    setProcessing(id);
    setRefunds((prev) => prev.map((r) => r.id === id
      ? { ...r, status: 'rejeté' as const, processedAt: new Date().toISOString() }
      : r,
    ));
    try { await refundService.reject(id, 'Décision administrative'); } catch { /* keep optimistic */ }
    finally { setProcessing(null); flash('Demande de remboursement rejetée'); }
  }, []);

  const markDone = useCallback(async (id: string, reference: string) => {
    setProcessing(id);
    setRefunds((prev) => prev.map((r) => r.id === id
      ? { ...r, status: 'remboursé' as const, reference, processedAt: new Date().toISOString() }
      : r,
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

  const summary: RefundSummary = {
    totalPending:   refunds.filter((r) => r.status === 'en_attente').length,
    pendingAmount:  refunds.filter((r) => r.status === 'en_attente').reduce((s, r) => s + r.refundAmount, 0),
    totalRefunded:  refunds.filter((r) => r.status === 'remboursé').length,
    refundedAmount: refunds.filter((r) => r.status === 'remboursé').reduce((s, r) => s + r.refundAmount, 0),
  };

  return {
    refunds: visible, loading, processing, summary, statusFilter, search, actionMsg,
    setStatusFilter, setSearch, approve, reject, markDone,
  };
}
