import { api } from './api';
import type { ApiBodyResponse }           from '../models/api_response.model';
import type { DriverPayout, PayoutSummary, PayoutStatus, PayoutMethod } from '../models/payout.model';

export const payoutService = {
  // KPIs
  getSummary: () =>
    api.get<ApiBodyResponse<PayoutSummary>>('/admin/payouts/summary'),

  // List — status filter sent to API
  getAll: (status?: PayoutStatus | 'all') =>
    api.get<ApiBodyResponse<DriverPayout[] | { data: DriverPayout[] }>>('/admin/payouts', {
      params: status && status !== 'all' ? { status } : {},
    }),

  // Generate payout sheets from unpaid earnings
  generate: (period: 'month' | 'week' = 'month') =>
    api.post<ApiBodyResponse<{ generated: number; skipped: number }>>('/admin/payouts/generate', { period }),

  // Trigger a single payout (en_attente → en_traitement)
  process: (uuid: string, method: PayoutMethod) =>
    api.post<ApiBodyResponse<DriverPayout>>(`/admin/payouts/${uuid}/process`, { method }),

  // Confirm a payout was sent (en_traitement → payé)
  markPaid: (uuid: string) =>
    api.post<ApiBodyResponse<DriverPayout>>(`/admin/payouts/${uuid}/mark-paid`),

  // Retry a failed payout (échoué → en_attente)
  retry: (uuid: string) =>
    api.post<ApiBodyResponse<DriverPayout>>(`/admin/payouts/${uuid}/retry`),

  // Batch process multiple pending payouts
  batchProcess: (uuids: string[], method: PayoutMethod) =>
    api.post<ApiBodyResponse<{ processed: number }>>('/admin/payouts/batch-process', { uuids, method }),

  // Export CSV (returns blob)
  exportCsv: (status?: string) =>
    api.get('/admin/payouts/export', {
      params:       status ? { status } : {},
      responseType: 'blob',
    }),
};
