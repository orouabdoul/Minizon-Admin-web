import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { ApiDriver, DriverMetrics } from '../models/driver.model';

// Shape of body.data from GET /admin/drivers
interface DriversListBody {
  data:         ApiDriver[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

const STATUS_TO_API: Record<string, string> = {
  'En attente': 'pending',
  'Vérifié':    'approved',
  'Rejeté':     'rejected',
  'Suspendu':   'suspended',
};

export const driverService = {
  getMetrics: () =>
    api.get<ApiBodyResponse<DriverMetrics>>('/admin/drivers/metrics'),

  getAll: (page = 1, perPage = 10, status?: string, search?: string) =>
    api.get<ApiBodyResponse<DriversListBody>>('/admin/drivers', {
      params: {
        page,
        per_page: perPage,
        ...(status && status !== 'all' ? { status: STATUS_TO_API[status] ?? status } : {}),
        ...(search ? { search } : {}),
      },
    }),

  getById: (id: string) =>
    api.get<ApiBodyResponse<ApiDriver>>(`/admin/drivers/${id}`),

  validate: (id: string) =>
    api.put<ApiBodyResponse<ApiDriver>>(`/admin/drivers/${id}/validate`),

  reject: (id: string) =>
    api.put<ApiBodyResponse<ApiDriver>>(`/admin/drivers/${id}/reject`),
};
