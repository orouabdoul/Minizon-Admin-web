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

  // POST /admin/messaging/send-to-selected
  sendToSelected: (userUuids: string[], content: string) =>
    api.post('/admin/messaging/send-to-selected', { user_uuids: userUuids, content }),

  // PATCH /admin/messaging/messages/{uuid}
  editMessage: (messageUuid: string, content: string) =>
    api.patch(`/admin/messaging/messages/${messageUuid}`, { content }),

  // DELETE /admin/messaging/messages/{uuid}
  deleteMessage: (messageUuid: string) =>
    api.delete(`/admin/messaging/messages/${messageUuid}`),

  // POST /admin/messaging/conversations/{uuid}/messages  (multipart — audio blob)
  sendAudioMessage: (uuid: string, audioBlob: Blob, mimeType?: string) => {
    const ext  = mimeType?.includes('ogg') ? 'ogg' : mimeType?.includes('mp4') ? 'mp4' : 'webm';
    const form = new FormData();
    // Backend expects field name "attachment" (not "audio")
    form.append('attachment', audioBlob, `voice_${Date.now()}.${ext}`);
    // Explicitly unset Content-Type so the browser can set multipart/form-data with the boundary.
    // Without this, the global 'application/json' default header prevents the server from
    // parsing the multipart body, causing attachment to be null on the backend.
    return api.post(`/admin/messaging/conversations/${uuid}/messages`, form, {
      headers: { 'Content-Type': undefined },
    });
  },
};
