import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { Vehicle, VehicleMetrics, VehicleListBody } from '../models/vehicle.model';

interface VehicleListParams {
  status?:   string;
  type?:     string;
  search?:   string;
  page?:     number;
  per_page?: number;
}

export const vehiclesService = {
  getMetrics: () =>
    api.get<ApiBodyResponse<VehicleMetrics>>('/admin/vehicles/metrics'),

  getList: (params: VehicleListParams = {}) =>
    api.get<ApiBodyResponse<VehicleListBody>>('/admin/vehicles', { params }),

  getById: (id: string) =>
    api.get<ApiBodyResponse<Vehicle>>(`/admin/vehicles/${id}`),

  approve: (id: string) =>
    api.post<ApiBodyResponse<Vehicle>>(`/admin/vehicles/${id}/approve`),

  reject: (id: string, reason: string) =>
    api.post<ApiBodyResponse<Vehicle>>(`/admin/vehicles/${id}/reject`, { reason }),

  suspend: (id: string, reason: string) =>
    api.post<ApiBodyResponse<Vehicle>>(`/admin/vehicles/${id}/suspend`, { reason }),

  reinstate: (id: string) =>
    api.post<ApiBodyResponse<Vehicle>>(`/admin/vehicles/${id}/reinstate`),

  delete: (id: string) =>
    api.delete<ApiBodyResponse<null>>(`/admin/vehicles/${id}`),
};
