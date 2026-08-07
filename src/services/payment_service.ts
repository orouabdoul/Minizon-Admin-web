import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { ApiPayment, PaymentMetrics, SyncAllResult } from '../models/payment.model';

interface PaymentsListBody {
  data:         ApiPayment[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

export const paymentService = {
  getMetrics: () =>
    api.get<ApiBodyResponse<PaymentMetrics>>('/admin/payments/metrics'),

  getAll: (page = 1, perPage = 15, params?: {
    search?: string;
    status?: string;
    method?: string;
    date?:   string;
  }) =>
    api.get<ApiBodyResponse<PaymentsListBody>>('/admin/payments', {
      params: {
        page,
        per_page: perPage,
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.status ? { status: params.status } : {}),
        ...(params?.method ? { method: params.method } : {}),
        ...(params?.date   ? { date:   params.date }   : {}),
      },
    }),

  getById: (uuid: string) =>
    api.get<ApiBodyResponse<ApiPayment>>(`/admin/payments/${uuid}`),

  refund: (uuid: string) =>
    api.post<ApiBodyResponse<ApiPayment>>(`/admin/payments/${uuid}/refund`),

  release: (uuid: string) =>
    api.post<ApiBodyResponse<ApiPayment>>(`/admin/payments/${uuid}/release`),

  // Global FedaPay sync — checks all pending payments
  syncAll: () =>
    api.post<ApiBodyResponse<SyncAllResult>>('/admin/payments/sync'),

  // Single payment FedaPay sync
  syncOne: (uuid: string) =>
    api.post<ApiBodyResponse<ApiPayment & { fedapay_status?: string }>>(`/admin/payments/${uuid}/sync`),
};
