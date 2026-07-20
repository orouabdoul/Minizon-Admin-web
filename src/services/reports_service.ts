import { api } from './api';
import type { ReportPeriod } from '../models/reports.model';

export const reportsService = {
  getData:   (period: ReportPeriod) => api.get(`/admin/reports?period=${period}`),
  exportPdf: (period: ReportPeriod) => api.get(`/admin/reports/export/pdf?period=${period}`),
  exportXls: (period: ReportPeriod) => api.get(`/admin/reports/export/excel?period=${period}`),
};
