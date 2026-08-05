import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { ApiTrip, TripMetrics } from '../models/trip.model';

// API status values accepted by PUT /admin/trips/{uuid}
export type ApiTripStatus = 'pending' | 'active' | 'completed' | 'cancelled';

interface TripsListBody {
  data:         ApiTrip[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

export const tripService = {
  getMetrics: () =>
    api.get<ApiBodyResponse<TripMetrics>>('/admin/trips/metrics'),

  getAll: (page = 1, perPage = 15, params?: {
    departure?:   string;
    destination?: string;
    status?:      string;
    date?:        string;
  }) =>
    api.get<ApiBodyResponse<TripsListBody>>('/admin/trips', {
      params: {
        page,
        per_page: perPage,
        ...(params?.departure   ? { departure:   params.departure }   : {}),
        ...(params?.destination ? { destination: params.destination } : {}),
        ...(params?.status      ? { status:      params.status }      : {}),
        ...(params?.date        ? { date:        params.date }        : {}),
      },
    }),

  getById: (uuid: string) =>
    api.get<ApiBodyResponse<ApiTrip>>(`/admin/trips/${uuid}`),

  updateStatus: (uuid: string, status: ApiTripStatus) =>
    api.put<ApiBodyResponse<ApiTrip>>(`/admin/trips/${uuid}`, { status }),

  remove: (uuid: string) =>
    api.delete<ApiBodyResponse<null>>(`/admin/trips/${uuid}`),
};
