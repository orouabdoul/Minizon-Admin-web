import { api } from './api';
import type { ApiResponse } from '../models/api_response.model';
import type { Payment } from '../models/payment.model';

export const paymentService = {
  getAll: (page = 1, limit = 10, params?: {
    status?:  string;
    method?:  string;
    date?:    string;
    search?:  string;
  }) =>
    api.get<{ data: Payment[]; total: number }>('/payments', {
      params: { page, limit, ...params },
    }),
  getById:  (id: string) => api.get<ApiResponse<Payment>>(`/payments/${id}`),
  refund:   (id: string) => api.post<ApiResponse<Payment>>(`/payments/${id}/refund`),
};
