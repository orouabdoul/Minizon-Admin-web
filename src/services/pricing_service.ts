import { api } from './api';
import type { PromoCode } from '../models/pricing.model';

export const pricingService = {
  getTariffs:    ()                                         => api.get('/admin/pricing/tariffs'),
  updateTariff:  (id: string, value: number, active: boolean) => api.put(`/admin/pricing/tariffs/${id}`, { value, active }),
  getPromos:     ()                                         => api.get('/admin/pricing/promos'),
  createPromo:   (data: Omit<PromoCode, 'id' | 'usageCount'>) => api.post('/admin/pricing/promos', data),
  togglePromo:   (id: string, active: boolean)             => api.patch(`/admin/pricing/promos/${id}`, { active }),
  deletePromo:   (id: string)                              => api.delete(`/admin/pricing/promos/${id}`),
};
