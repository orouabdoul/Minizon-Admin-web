import { api } from './api';
import type { BroadcastTarget } from '../models/messaging.model';

export const messagingService = {
  getConversations: ()                                         => api.get('/admin/messaging/conversations'),
  getMessages:      (id: string)                               => api.get(`/admin/messaging/conversations/${id}/messages`),
  sendMessage:      (id: string, content: string)              => api.post(`/admin/messaging/conversations/${id}/messages`, { content }),
  markAsRead:       (id: string)                               => api.post(`/admin/messaging/conversations/${id}/read`),
  broadcast:        (content: string, target: BroadcastTarget) => api.post('/admin/messaging/broadcast', { content, target }),
};
