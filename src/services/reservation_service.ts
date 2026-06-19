import { api } from './api';
import type { ApiResponse } from '../models/api_response.model';
import type { Reservation } from '../models/reservation.model';

export const reservationService = {
  getAll: (page = 1, limit = 10, params?: {
    status?:  string;
    city?:    string;
    payment?: string;
    date?:    string;
    search?:  string;
  }) =>
    api.get<{ data: Reservation[]; total: number }>('/reservations', {
      params: { page, limit, ...params },
    }),

  getById: (id: string) =>
    api.get<ApiResponse<Reservation>>(`/reservations/${id}`),

  cancel: (id: string) =>
    api.post<ApiResponse<Reservation>>(`/reservations/${id}/cancel`),

  refund: (id: string) =>
    api.post<ApiResponse<Reservation>>(`/reservations/${id}/refund`),

  suspend: (id: string) =>
    api.post<ApiResponse<Reservation>>(`/reservations/${id}/suspend`),
};
