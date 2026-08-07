import { api } from './api';
import type { BroadcastTarget, ConvStatusFilter, RoleFilter } from '../models/messaging.model';

export const messagingService = {
  // GET /admin/messaging/conversations?role=&search=&status=
  getConversations: (params?: { role?: RoleFilter; status?: ConvStatusFilter; search?: string }) =>
    api.get('/admin/messaging/conversations', { params }),

  // GET /admin/messaging/users?q=&role=
  searchUsers: (q: string, role: RoleFilter = 'all') =>
    api.get('/admin/messaging/users', { params: { q, role } }),

  // POST /admin/messaging/start
  startConversation: (userUuid: string, message?: string) =>
    api.post('/admin/messaging/start', {
      user_uuid: userUuid,
      ...(message ? { message } : {}),
    }),

  // GET /admin/messaging/conversations/{uuid}
  openConversation: (uuid: string) =>
    api.get(`/admin/messaging/conversations/${uuid}`),

  // POST /admin/messaging/conversations/{uuid}/messages
  sendMessage: (uuid: string, content: string) =>
    api.post(`/admin/messaging/conversations/${uuid}/messages`, { content }),

  // POST /admin/messaging/broadcast
  broadcast: (content: string, target: BroadcastTarget) =>
    api.post('/admin/messaging/broadcast', { content, target }),
};
