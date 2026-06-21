import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { ApiPassenger, PassengerMetrics } from '../models/passenger.model';

interface PassengersListBody {
  data:         ApiPassenger[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

export const passengerService = {
  getMetrics: () =>
    api.get<ApiBodyResponse<PassengerMetrics>>('/admin/passengers/metrics'),

  getAll: (page = 1, perPage = 10, params?: {
    city?:   string;
    risk?:   string;
    status?: string;
    verif?:  string;
    search?: string;
  }) =>
    api.get<ApiBodyResponse<PassengersListBody>>('/admin/passengers', {
      params: { page, per_page: perPage, ...params },
    }),

  getById: (uuid: string) =>
    api.get<ApiBodyResponse<ApiPassenger>>(`/admin/passengers/${uuid}`),

  suspend: (uuid: string) =>
    api.put<ApiBodyResponse<ApiPassenger>>(`/admin/passengers/${uuid}/suspend`),

  unsuspend: (uuid: string) =>
    api.put<ApiBodyResponse<ApiPassenger>>(`/admin/passengers/${uuid}/unsuspend`),
};
