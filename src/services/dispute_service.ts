import { api } from './api';
import type { ApiResponse } from '../models/api_response.model';
import type { Dispute } from '../models/dispute.model';

export const disputeService = {
  getAll: (page = 1, limit = 10, params?: {
    status?:   string;
    type?:     string;
    priority?: string;
    search?:   string;
  }) =>
    api.get<{ data: Dispute[]; total: number }>('/disputes', {
      params: { page, limit, ...params },
    }),
  getById:  (id: string) => api.get<ApiResponse<Dispute>>(`/disputes/${id}`),
  resolve:  (id: string) => api.post<ApiResponse<Dispute>>(`/disputes/${id}/resolve`),
  close:    (id: string) => api.post<ApiResponse<Dispute>>(`/disputes/${id}/close`),
};
