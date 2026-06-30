import { api }            from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { TrackedTrip, TrackingStats, IncidentType } from '../models/tracking.model';

export const trackingService = {
  getActiveTrips:  ()                                          => api.get<ApiBodyResponse<TrackedTrip[]>>('/admin/tracking/trips'),
  getStats:        ()                                          => api.get<ApiBodyResponse<TrackingStats>>('/admin/tracking/stats'),
  getTripPosition: (id: string)                               => api.get<ApiBodyResponse<TrackedTrip>>(`/admin/tracking/trips/${id}`),
  reportIncident:  (id: string, type: IncidentType, notes: string) =>
    api.post<ApiBodyResponse<null>>(`/admin/tracking/trips/${id}/incident`, { type, notes }),
  resolveIncident: (tripId: string, incidentId: string) =>
    api.post<ApiBodyResponse<null>>(`/admin/tracking/trips/${tripId}/incident/${incidentId}/resolve`),
};
