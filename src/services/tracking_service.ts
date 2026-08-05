import { api }            from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { TrackedTrip, TripListBody, TrackingStats, IncidentType } from '../models/tracking.model';

export const trackingService = {
  getActiveTrips:  (filter?: string) =>
    api.get<ApiBodyResponse<TripListBody>>('/admin/tracking/trips', { params: { filter: filter ?? 'all' } }),

  getStats:        () =>
    api.get<ApiBodyResponse<TrackingStats>>('/admin/tracking/stats'),

  getTripDetail:   (uuid: string) =>
    api.get<ApiBodyResponse<TrackedTrip>>(`/admin/tracking/${uuid}`),

  reportIncident:  (uuid: string, type: IncidentType, notes: string) =>
    api.post<ApiBodyResponse<null>>(`/admin/tracking/${uuid}/incident`, { type, notes }),

  resolveIncident: (uuid: string) =>
    api.patch<ApiBodyResponse<null>>(`/admin/tracking/${uuid}/incident/resolve`),
};
