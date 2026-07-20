import { api } from './api';
import type { PayoutMethod } from '../models/payout.model';

export const payoutService = {
  getAll:    (period?: string)                              => api.get('/admin/payouts', { params: { period } }),
  process:   (id: string, method: PayoutMethod)            => api.post(`/admin/payouts/${id}/process`, { method }),
  markPaid:  (id: string, reference: string)               => api.post(`/admin/payouts/${id}/paid`, { reference }),
  batchPay:  (ids: string[], method: PayoutMethod)         => api.post('/admin/payouts/batch', { ids, method }),
  exportCsv: (period?: string)                             => api.get('/admin/payouts/export', { params: { period, format: 'csv' } }),
};
