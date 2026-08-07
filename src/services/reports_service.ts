import { api } from './api';
import type { ReportPeriod } from '../models/reports.model';

export const reportsService = {
  getData: (period: ReportPeriod) =>
    api.get('/admin/reports', { params: { period } }),

  export: (period: ReportPeriod, format: 'excel' | 'pdf') =>
    api.get('/admin/reports/export', {
      params: { period, format },
      ...(format === 'excel' ? { responseType: 'blob' as const } : {}),
    }),
};
