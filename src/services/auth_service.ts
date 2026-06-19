import { api } from './api';
import type { LoginCredentials, AuthToken } from '../models/auth.model';
import type { ApiBodyResponse } from '../models/api_response.model';

export const authService = {
  login: ({ email, password }: LoginCredentials) =>
    api.post<ApiBodyResponse<AuthToken>>('/auth/admin/login', { email, password }),

  logout: () => api.post('/auth/logout'),
};
