import { useState, useEffect, useCallback } from 'react';
import type { TariffRule, PromoCode } from '../models/pricing.model';
import { pricingService } from '../services/pricing_service';

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_TARIFFS: TariffRule[] = [
  { id: 't1', key: 'base_rate_per_km',      name: 'Prix de base',               description: 'Tarif par kilomètre parcouru',                  value: 150,  unit: 'FCFA/km', active: true  },
  { id: 't2', key: 'rush_hour_surcharge',   name: 'Surcharge heures de pointe', description: 'Appliquée de 7h à 9h et 17h à 20h',            value: 30,   unit: '%',       active: true  },
  { id: 't3', key: 'night_surcharge',       name: 'Surcharge nuit',             description: 'Appliquée de 22h à 6h',                         value: 25,   unit: '%',       active: true  },
  { id: 't4', key: 'long_distance_discount',name: 'Remise longue distance',     description: 'Réduction à partir de 100 km',                  value: 10,   unit: '%',       active: true  },
  { id: 't5', key: 'booking_fee',           name: 'Frais de réservation',       description: 'Frais fixes par réservation effectuée',         value: 500,  unit: 'FCFA',    active: true  },
  { id: 't6', key: 'platform_commission',   name: 'Commission plateforme',      description: 'Part de la plateforme sur chaque trajet',        value: 18,   unit: '%',       active: true  },
  { id: 't7', key: 'premium_multiplier',    name: 'Tarif Premium',              description: 'Multiplicateur pour les véhicules Premium',      value: 1.5,  unit: '×',       active: false },
];

const MOCK_PROMOS: PromoCode[] = [
  { id: 'p1', code: 'BIENVENUE20', discount: 20, description: 'Code de bienvenue pour nouveaux utilisateurs', expiresAt: '2026-12-31', usageCount: 342,  usageLimit: 1000, active: true  },
  { id: 'p2', code: 'ETE2026',     discount: 15, description: 'Promotion été 2026',                           expiresAt: '2026-08-31', usageCount: 89,   usageLimit: 500,  active: true  },
  { id: 'p3', code: 'FIDELE10',    discount: 10, description: 'Code fidélité conducteurs partenaires',        expiresAt: '2026-12-31', usageCount: 1240, usageLimit: 2000, active: true  },
  { id: 'p4', code: 'NOEL2025',    discount: 25, description: 'Code promotionnel Noël 2025 — expiré',        expiresAt: '2026-01-01', usageCount: 892,  usageLimit: 500,  active: false },
];

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePricing() {
  const [tariffs,   setTariffs]   = useState<TariffRule[]>([]);
  const [promos,    setPromos]    = useState<PromoCode[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState<string | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tariffsRes, promosRes] = await Promise.all([
        pricingService.getTariffs(),
        pricingService.getPromos(),
      ]);

      const tariffList = tariffsRes.data.body?.tariffs;
      const promoList  = promosRes.data.body?.promos;

      // Normalize API promo fields: API may return snake_case (expires_at, usage_limit)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizePromo = (p: any): PromoCode => ({
        ...p,
        expiresAt:  p.expiresAt  ?? p.expires_at  ?? '',
        usageLimit: p.usageLimit ?? p.usage_limit  ?? 0,
        usageCount: p.usageCount ?? p.usage_count  ?? 0,
      });

      if (Array.isArray(tariffList)) setTariffs(tariffList);
      if (Array.isArray(promoList))  setPromos(promoList.map(normalizePromo));
      setUsingMock(false);
      setError(null);
    } catch (err) {
      setTariffs(MOCK_TARIFFS);
      setPromos(MOCK_PROMOS);
      setUsingMock(true);
      setError(err instanceof Error ? err.message : 'API indisponible — données de démo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Tariff actions ────────────────────────────────────────────────────────

  const updateTariff = useCallback(async (id: string, value: number) => {
    setSaving(id);
    setTariffs((prev) => prev.map((x) => x.id === id ? { ...x, value } : x));
    try {
      await pricingService.updateTariff(id, value);
    } catch { /* keep optimistic */ }
    finally { setSaving(null); }
  }, []);

  const toggleTariff = useCallback(async (id: string) => {
    setTariffs((prev) => prev.map((x) => x.id === id ? { ...x, active: !x.active } : x));
    try {
      await pricingService.toggleTariff(id);
    } catch {
      // Revert on error
      setTariffs((prev) => prev.map((x) => x.id === id ? { ...x, active: !x.active } : x));
    }
  }, []);

  // ── Promo actions ─────────────────────────────────────────────────────────

  const addPromo = useCallback(async (data: Omit<PromoCode, 'id' | 'usageCount'>) => {
    const temp: PromoCode = { ...data, id: `p-${Date.now()}`, usageCount: 0 };
    setPromos((prev) => [temp, ...prev]);
    try {
      const res = await pricingService.createPromo({
        code:        data.code,
        discount:    data.discount,
        description: data.description,
        expires_at:  data.expiresAt,
        usage_limit: data.usageLimit,
        active:      data.active,
      });
      const created = res.data.body;
      if (created?.id) setPromos((prev) => prev.map((x) => x.id === temp.id ? created : x));
    } catch { /* keep optimistic */ }
  }, []);

  const togglePromo = useCallback(async (id: string) => {
    setPromos((prev) => prev.map((x) => x.id === id ? { ...x, active: !x.active } : x));
    try {
      await pricingService.togglePromo(id);
    } catch {
      setPromos((prev) => prev.map((x) => x.id === id ? { ...x, active: !x.active } : x));
    }
  }, []);

  const deletePromo = useCallback(async (id: string) => {
    setPromos((prev) => prev.filter((x) => x.id !== id));
    try {
      await pricingService.deletePromo(id);
    } catch { /* keep optimistic */ }
  }, []);

  return {
    tariffs, promos, loading, saving, error, usingMock,
    updateTariff, toggleTariff,
    addPromo, togglePromo, deletePromo,
    refresh: loadData,
  };
}
