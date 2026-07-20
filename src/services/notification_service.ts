import { api } from './api';
import type { ApiNotification, NotifMetrics } from '../models/notification.model';

export const notificationService = {
  // Metrics may or may not be wrapped — extract body or root
  getMetrics: () =>
    api.get<{ body?: NotifMetrics } & Partial<NotifMetrics>>('/admin/notifications/metrics'),

  getAll: (params?: { tab?: string; type?: string; search?: string; per_page?: number }) =>
    api.get<{ body?: ApiNotification[]; data?: ApiNotification[] } | ApiNotification[]>(
      '/admin/notifications',
      { params },
    ),

  markRead: (uuid: string) =>
    api.post(`/admin/notifications/${uuid}/read`),

  markAllRead: () =>
    api.post('/admin/notifications/read-all'),

  handle: (uuid: string) =>
    api.post(`/admin/notifications/${uuid}/handle`),

  remove: (uuid: string) =>
    api.delete(`/admin/notifications/${uuid}`),

  send: (data: { title: string; body: string; target: string; type: string }) =>
    api.post('/admin/notifications/push', data),
};
