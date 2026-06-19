import { api } from './api';
import type { ApiResponse } from '../models/api_response.model';
import type { Trip } from '../models/trip.model';

// GET    /trips                 → liste paginée (page, limit, from, to, status, date, search)
// GET    /trips/:id             → détail
// POST   /trips                 → créer un trajet
// PATCH  /trips/:id             → modifier un trajet
// POST   /trips/:id/cancel      → annuler
// POST   /trips/:id/flag        → signaler
// DELETE /trips/:id             → supprimer

export const tripService = {
  getAll: (page = 1, limit = 10, params?: {
    from?:   string;
    to?:     string;
    status?: string;
    date?:   string;
    search?: string;
  }) =>
    api.get<{ data: Trip[]; total: number }>('/trips', {
      params: { page, limit, ...params },
    }),

  getById: (id: string) =>
    api.get<ApiResponse<Trip>>(`/trips/${id}`),

  create: (payload: Partial<Trip>) =>
    api.post<ApiResponse<Trip>>('/trips', payload),

  update: (id: string, payload: Partial<Trip>) =>
    api.patch<ApiResponse<Trip>>(`/trips/${id}`, payload),

  cancel: (id: string) =>
    api.post<ApiResponse<Trip>>(`/trips/${id}/cancel`),

  flag: (id: string) =>
    api.post<ApiResponse<Trip>>(`/trips/${id}/flag`),

  delete: (id: string) =>
    api.delete(`/trips/${id}`),
};
