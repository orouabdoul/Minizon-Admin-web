import { api } from './api';

export const refundService = {
  getAll:   (status?: string) => api.get('/admin/refunds', { params: { status } }),
  approve:  (id: string, method: string) => api.post(`/admin/refunds/${id}/approve`, { method }),
  reject:   (id: string, reason: string) => api.post(`/admin/refunds/${id}/reject`, { reason }),
  markDone: (id: string, reference: string) => api.post(`/admin/refunds/${id}/done`, { reference }),
};
