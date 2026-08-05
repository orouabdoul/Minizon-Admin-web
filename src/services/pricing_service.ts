import { api } from './api';
import type { ApiBodyResponse } from '../models/api_response.model';
import type { TariffListBody, PromoCode, PromoListBody, CreatePromoPayload } from '../models/pricing.model';

export const pricingService = {
  // ── Tariffs ──────────────────────────────────────────────────────────────
  getTariffs: () =>
    api.get<ApiBodyResponse<TariffListBody>>('/admin/pricing/tariffs'),

  updateTariff: (uuid: string, value: number) =>
    api.patch<ApiBodyResponse<null>>(`/admin/pricing/tariffs/${uuid}`, { value }),

  toggleTariff: (uuid: string) =>
    api.patch<ApiBodyResponse<null>>(`/admin/pricing/tariffs/${uuid}/toggle`),

  // ── Promos ────────────────────────────────────────────────────────────────
  getPromos: () =>
    api.get<ApiBodyResponse<PromoListBody>>('/admin/pricing/promos'),

  createPromo: (payload: CreatePromoPayload) =>
    api.post<ApiBodyResponse<PromoCode>>('/admin/pricing/promos', payload),

  togglePromo: (uuid: string) =>
    api.patch<ApiBodyResponse<null>>(`/admin/pricing/promos/${uuid}/toggle`),

  deletePromo: (uuid: string) =>
    api.delete<ApiBodyResponse<null>>(`/admin/pricing/promos/${uuid}`),
};
