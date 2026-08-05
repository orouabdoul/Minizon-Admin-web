import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { ApiReservation, ReservationMetrics, ApiReservationStatus } from '../models/reservation.model';

interface ReservationsListBody {
  data:         ApiReservation[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

export const reservationService = {
  getMetrics: () =>
    api.get<ApiBodyResponse<ReservationMetrics>>('/admin/reservations/metrics'),

  getAll: (page = 1, perPage = 10, params?: {
    search?:  string;
    city?:    string;
    status?:  string;
    payment?: string;
    date?:    string;
  }) =>
    api.get<ApiBodyResponse<ReservationsListBody>>('/admin/reservations', {
      params: {
        page,
        per_page: perPage,
        ...(params?.search  ? { search:  params.search }  : {}),
        ...(params?.city    ? { city:    params.city }    : {}),
        ...(params?.status  ? { status:  params.status }  : {}),
        ...(params?.payment ? { payment: params.payment } : {}),
        ...(params?.date    ? { date:    params.date }    : {}),
      },
    }),

  getById: (uuid: string) =>
    api.get<ApiBodyResponse<ApiReservation>>(`/admin/reservations/${uuid}`),

  updateStatus: (uuid: string, status: ApiReservationStatus) =>
    api.put<ApiBodyResponse<ApiReservation>>(`/admin/reservations/${uuid}`, { status }),

  remove: (uuid: string) =>
    api.delete<ApiBodyResponse<null>>(`/admin/reservations/${uuid}`),
};
