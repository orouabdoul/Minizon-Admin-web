import { api } from './api';
import type { ApiBodyResponse }  from '../models/api_response.model';
import type { SupportMetrics, SupportAgent, SupportTicket } from '../models/support.model';

interface TicketsListBody {
  data:         SupportTicket[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

interface CreateTicketPayload {
  user_uuid:   string;
  subject:     string;
  description: string;
  priority:    string;
  channel:     string;
}

export const supportService = {
  getMetrics: () =>
    api.get<ApiBodyResponse<SupportMetrics>>('/admin/support/metrics'),

  getAll: (page = 1, perPage = 10, params?: {
    search?:   string;
    status?:   string;
    priority?: string;
    agent?:    string;
    date?:     string;
  }) =>
    api.get<ApiBodyResponse<TicketsListBody>>('/admin/support', {
      params: {
        page, per_page: perPage,
        ...(params?.search   ? { search:   params.search }   : {}),
        ...(params?.status   ? { status:   params.status }   : {}),
        ...(params?.priority ? { priority: params.priority } : {}),
        ...(params?.agent    ? { agent:    params.agent }    : {}),
        ...(params?.date     ? { date:     params.date }     : {}),
      },
    }),

  getAgents: () =>
    api.get<ApiBodyResponse<SupportAgent[]>>('/admin/support/agents'),

  create: (payload: CreateTicketPayload) =>
    api.post<ApiBodyResponse<Record<string, never>>>('/admin/support', payload),

  resolve: (uuid: string) =>
    api.post<ApiBodyResponse<Record<string, never>>>(`/admin/support/${uuid}/resolve`),
};
