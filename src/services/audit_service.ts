import { api } from './api';
import type { AuditActionType, AuditSeverity } from '../models/audit.model';

export interface LogsParams {
  search?:      string;
  severity?:    AuditSeverity;
  action_type?: AuditActionType;
  admin_id?:    string;
  date_from?:   string;
  date_to?:     string;
  per_page?:    number;
  page?:        number;
}

export const auditService = {
  getLogs: (params: LogsParams = {}) =>
    api.get('/admin/audit/logs', { params: { per_page: 200, page: 1, ...params } }),

  getAdmins: () =>
    api.get('/admin/audit/admins'),

  exportLogs: (params: Omit<LogsParams, 'per_page' | 'page'>) =>
    api.get('/admin/audit/export', {
      params:       { format: 'excel', ...params },
      responseType: 'blob',
    }),
};
