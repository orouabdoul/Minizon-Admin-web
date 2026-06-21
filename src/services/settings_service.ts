import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type {
  SettingsSummaryItem, GeneralSettings, Commission, PaymentProvider,
  SecurityLogsBody, SettingsAdmin, AnalyticsItem,
} from '../models/settings.model';

export const settingsService = {
  getSummary: () =>
    api.get<ApiBodyResponse<SettingsSummaryItem[]>>('/admin/settings/summary'),

  getGeneral: () =>
    api.get<ApiBodyResponse<GeneralSettings>>('/admin/settings/general'),

  updateGeneral: (data: GeneralSettings) =>
    api.put<ApiBodyResponse<[]>>('/admin/settings/general', data),

  getCommissions: () =>
    api.get<ApiBodyResponse<Commission[]>>('/admin/settings/commissions'),

  updateCommission: (uuid: string, data: { rate: string; status: string }) =>
    api.put(`/admin/settings/commissions/${uuid}`, data),

  getPayments: () =>
    api.get<ApiBodyResponse<PaymentProvider[]>>('/admin/settings/payments'),

  getSecurity: (per_page = 20) =>
    api.get<ApiBodyResponse<SecurityLogsBody>>('/admin/settings/security', { params: { per_page } }),

  getAdmins: () =>
    api.get<ApiBodyResponse<SettingsAdmin[]>>('/admin/settings/admins'),

  addAdmin: (data: { name: string; email: string; phone: string; role: string }) =>
    api.post('/admin/settings/admins', data),

  updateAdmin: (uuid: string, data: { name: string; email: string; role: string }) =>
    api.put(`/admin/settings/admins/${uuid}`, data),

  revokeAdmin: (uuid: string) =>
    api.delete(`/admin/settings/admins/${uuid}`),

  getAnalytics: () =>
    api.get<ApiBodyResponse<AnalyticsItem[]>>('/admin/settings/analytics'),
};
