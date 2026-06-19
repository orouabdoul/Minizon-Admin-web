import { api } from './api';
import type { PaginatedResponse, ApiResponse } from '../models/api_response.model';
import type { User } from '../models/user.model';

export const userService = {
  getAll: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<User>>('/users', { params: { page, limit } }),

  getById: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`),

  create: (user: Partial<User>) =>
    api.post<ApiResponse<User>>('/users', user),

  update: (id: string, user: Partial<User>) =>
    api.patch<ApiResponse<User>>(`/users/${id}`, user),

  delete: (id: string) =>
    api.delete(`/users/${id}`),
};
