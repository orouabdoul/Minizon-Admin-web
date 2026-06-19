import { useState, useMemo, useCallback } from 'react';
import { MOCK_PAYMENTS }     from '../config/constants';
import { paymentService }    from '../services/payment_service';
import type { Payment }      from '../models/payment.model';

const TOTAL     = 4521;
const PAGE_SIZE = 10;

export function usePayments() {
  const [payments,      setPayments]      = useState<Payment[]>(MOCK_PAYMENTS);
  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState<string>('all');
  const [methodFilter,  setMethodFilter]  = useState<string>('all');
  const [dateFilter,    setDateFilter]    = useState<string>('');
  const [currentPage,   setCurrentPage]   = useState(1);
  const [loadingId,     setLoadingId]     = useState<string | null>(null);
  const [selectedId,    setSelectedId]    = useState<string | null>(null);

  const filtered = useMemo(() =>
    payments.filter((p) => {
      const matchSearch  = !search ||
        p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        p.passengerName.toLowerCase().includes(search.toLowerCase()) ||
        p.driverName.toLowerCase().includes(search.toLowerCase());
      const matchStatus  = statusFilter === 'all' || p.status === statusFilter;
      const matchMethod  = methodFilter === 'all' || p.method === methodFilter;
      return matchSearch && matchStatus && matchMethod;
    }), [payments, search, statusFilter, methodFilter]);

  const patchLocal = useCallback((id: string, patch: Partial<Payment>) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const refund = useCallback(async (id: string) => {
    setLoadingId(id);
    try   { await paymentService.refund(id); patchLocal(id, { status: 'Remboursé' }); }
    catch { patchLocal(id, { status: 'Remboursé' }); }
    finally { setLoadingId(null); }
  }, [patchLocal]);

  const resetFilters = useCallback(() => {
    setStatusFilter('all'); setMethodFilter('all'); setDateFilter(''); setSearch(''); setCurrentPage(1);
  }, []);

  const selectedPayment = selectedId
    ? (filtered.find((p) => p.id === selectedId) ?? MOCK_PAYMENTS.find((p) => p.id === selectedId) ?? null)
    : null;

  return {
    payments: filtered, total: TOTAL, pageSize: PAGE_SIZE, currentPage, setCurrentPage,
    search, setSearch,
    statusFilter, setStatusFilter,
    methodFilter, setMethodFilter,
    dateFilter,   setDateFilter,
    loadingId, refund, resetFilters,
    selectedId, setSelectedId, selectedPayment,
  };
}
