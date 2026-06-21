import { api } from './api';
import type { ApiBodyResponse }    from '../models/api_response.model';
import type { DisputeMetrics, ApiDisputeListItem, ApiDisputeDetail } from '../models/dispute.model';

interface DisputesListBody {
  data:         ApiDisputeListItem[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

export const disputeService = {
  getMetrics: () =>
    api.get<ApiBodyResponse<DisputeMetrics>>('/admin/disputes/metrics'),

  getAll: (page = 1, perPage = 10, params?: {
    tab?:      string;
    search?:   string;
    type?:     string;
    status?:   string;
    priority?: string;
  }) =>
    api.get<ApiBodyResponse<DisputesListBody>>('/admin/disputes', {
      params: {
        page, per_page: perPage,
        ...(params?.tab      && params.tab !== 'all' ? { tab:      params.tab }      : {}),
        ...(params?.search   ? { search:   params.search }   : {}),
        ...(params?.type     ? { type:     params.type }     : {}),
        ...(params?.status   ? { status:   params.status }   : {}),
        ...(params?.priority ? { priority: params.priority } : {}),
      },
    }),

  getById: (id: string) =>
    api.get<ApiBodyResponse<ApiDisputeDetail>>(`/admin/disputes/${id}`),

  assign: (id: string) =>
    api.post<ApiBodyResponse<Record<string, never>>>(`/admin/disputes/${id}/assign`),

  refund: (id: string, notes: string) =>
    api.post<ApiBodyResponse<Record<string, never>>>(`/admin/disputes/${id}/refund`, { notes }),

  payDriver: (id: string, notes: string) =>
    api.post<ApiBodyResponse<Record<string, never>>>(`/admin/disputes/${id}/pay-driver`, { notes }),
};
