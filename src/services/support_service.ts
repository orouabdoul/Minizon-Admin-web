import { api } from './api';
import type { ApiResponse } from '../models/api_response.model';
import type { SupportTicket } from '../models/support.model';

export const supportService = {
  getAll: (page = 1, limit = 10, params?: {
    status?:   string;
    priority?: string;
    agent?:    string;
    search?:   string;
  }) =>
    api.get<{ data: SupportTicket[]; total: number }>('/support/tickets', {
      params: { page, limit, ...params },
    }),
  getById: (id: string) => api.get<ApiResponse<SupportTicket>>(`/support/tickets/${id}`),
  resolve: (id: string) => api.post<ApiResponse<SupportTicket>>(`/support/tickets/${id}/resolve`),
  close:   (id: string) => api.post<ApiResponse<SupportTicket>>(`/support/tickets/${id}/close`),
  assign:  (id: string, agentId: string) =>
    api.post<ApiResponse<SupportTicket>>(`/support/tickets/${id}/assign`, { agentId }),
};
