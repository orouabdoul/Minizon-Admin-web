import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { DashboardData } from '../models/dashboard.model';

export const dashboardService = {
  getData: () => api.get<ApiBodyResponse<DashboardData>>('/admin/dashboard'),
};
