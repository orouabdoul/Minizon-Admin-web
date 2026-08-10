import { api } from './api';
import type { IncidentType } from '../models/tracking.model';

export interface TripsParams {
  filter?:   string;   // all | actif | incident | panne | en_retard | flagged
  status?:   string;   // all | active | pending | completed | cancelled
  search?:   string;
  date?:     string;   // YYYY-MM-DD
  month?:    string;   // YYYY-MM
  year?:     string;   // YYYY
  per_page?: number;
  page?:     number;
}

export interface IncidentsParams {
  type?:     string;   // all | panne | urgence | autre
  resolved?: string;   // all | yes | no
  date?:     string;
  month?:    string;
  year?:     string;
  per_page?: number;
}

export const trackingService = {
  // ── Trips list ────────────────────────────────────────────────────────────
  getAllTrips: (params: TripsParams = {}) =>
    api.get('/admin/tracking/trips', { params: { per_page: 100, ...params } }),

  // ── Live GPS positions — polling léger 5s pour la carte ──────────────────
  getLive: () =>
    api.get('/admin/tracking/live'),

  // ── Stats KPIs ────────────────────────────────────────────────────────────
  getStats: () =>
    api.get('/admin/tracking/stats'),

  // ── Incidents list ────────────────────────────────────────────────────────
  getIncidents: (params: IncidentsParams = {}) =>
    api.get('/admin/tracking/incidents', { params }),

  // ── Trip detail complet ───────────────────────────────────────────────────
  // Detail complet — inclut passengers + vehicle + timeline + waypoints
  getTripDetail: (uuid: string) =>
    api.get(`/admin/tracking/${uuid}`),

  // ── Incident actions ──────────────────────────────────────────────────────
  reportIncident: (uuid: string, type: IncidentType, notes: string) =>
    api.post(`/admin/tracking/${uuid}/incident`, { type, notes }),

  resolveIncident: (uuid: string) =>
    api.patch(`/admin/tracking/${uuid}/incident/resolve`),

  // ── Modération ────────────────────────────────────────────────────────────
  flagTrip: (uuid: string, flag: boolean, moderationNote?: string) =>
    api.patch(`/admin/tracking/${uuid}/flag`, { flag, moderation_note: moderationNote }),

  // ── Notification FCM conducteur ───────────────────────────────────────────
  notifyDriver: (uuid: string, title: string, message: string) =>
    api.post(`/admin/tracking/${uuid}/notify-driver`, { title, message }),
};
