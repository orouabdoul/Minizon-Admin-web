import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { ApiPlatformUser, UserMetrics } from '../models/user.model';

interface UsersListBody {
  data:         ApiPlatformUser[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

interface CreateUserPayload {
  name:         string;
  phone:        string;
  type:         string;
  status:       string;
  verification: string;
}

export const platformUserService = {
  getMetrics: () =>
    api.get<ApiBodyResponse<UserMetrics>>('/admin/users/metrics'),

  getAll: (page = 1, perPage = 10, params?: {
    role_id?: number;
    status?:  string;
    search?:  string;
  }) =>
    api.get<ApiBodyResponse<UsersListBody>>('/admin/users', {
      params: { page, per_page: perPage, ...params },
    }),

  getById: (uuid: string) =>
    api.get<ApiBodyResponse<ApiPlatformUser>>(`/admin/users/${uuid}`),

  create: (payload: CreateUserPayload) =>
    api.post<ApiBodyResponse<ApiPlatformUser>>('/admin/users', payload),

  update: (uuid: string, payload: Partial<CreateUserPayload>) =>
    api.put<ApiBodyResponse<ApiPlatformUser>>(`/admin/users/${uuid}`, payload),

  delete: (uuid: string) =>
    api.delete(`/admin/users/${uuid}`),

  approveKyc: (uuid: string) =>
    api.put<ApiBodyResponse<ApiPlatformUser>>(`/admin/users/${uuid}/approve-kyc`),

  rejectKyc: (uuid: string) =>
    api.put<ApiBodyResponse<ApiPlatformUser>>(`/admin/users/${uuid}/reject-kyc`),

  suspend: (uuid: string) =>
    api.put<ApiBodyResponse<ApiPlatformUser>>(`/admin/users/${uuid}/suspend`),

  unsuspend: (uuid: string) =>
    api.put<ApiBodyResponse<ApiPlatformUser>>(`/admin/users/${uuid}/unsuspend`),
};
