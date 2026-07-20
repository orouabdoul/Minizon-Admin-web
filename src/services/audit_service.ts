import { api } from './api';

export const auditService = {
  getLogs:    (page = 1, limit = 50) => api.get('/admin/audit/logs', { params: { page, limit } }),
  exportLogs: (format: 'pdf' | 'excel') => api.get(`/admin/audit/export?format=${format}`),
};
