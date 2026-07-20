import { useState, useEffect, useCallback } from 'react';
import type { TariffRule, PromoCode } from '../models/pricing.model';
import { pricingService } from '../services/pricing_service';

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_TARIFFS: TariffRule[] = [
  { id: 't1', name: 'Prix de base',               description: 'Tarif par kilomètre parcouru',                  value: 150,  unit: 'FCFA/km', active: true  },
  { id: 't2', name: 'Surcharge heures de pointe', description: 'Appliquée de 7h à 9h et 17h à 20h',            value: 30,   unit: '%',       active: true  },
  { id: 't3', name: 'Surcharge nuit',             description: 'Appliquée de 22h à 6h',                         value: 25,   unit: '%',       active: true  },
  { id: 't4', name: 'Remise longue distance',     description: 'Réduction à partir de 100 km',                  value: 10,   unit: '%',       active: true  },
  { id: 't5', name: 'Frais de réservation',       description: 'Frais fixes par réservation effectuée',         value: 500,  unit: 'FCFA',    active: true  },
  { id: 't6', name: 'Commission plateforme',      description: 'Part de la plateforme sur chaque trajet',        value: 18,   unit: '%',       active: true  },
  { id: 't7', name: 'Tarif Premium',              description: 'Multiplicateur pour les véhicules Premium',      value: 1.5,  unit: '×',       active: false },
];

const MOCK_PROMOS: PromoCode[] = [
  { id: 'p1', code: 'BIENVENUE20', discount: 20, description: 'Code de bienvenue pour nouveaux utilisateurs', expiresAt: '2026-12-31', usageCount: 342,  usageLimit: 1000, active: true  },
  { id: 'p2', code: 'ETE2026',     discount: 15, description: 'Promotion été 2026',                           expiresAt: '2026-08-31', usageCount: 89,   usageLimit: 500,  active: true  },
  { id: 'p3', code: 'FIDELE10',    discount: 10, description: 'Code fidélité conducteurs partenaires',        expiresAt: '2026-12-31', usageCount: 1240, usageLimit: 2000, active: true  },
  { id: 'p4', code: 'NOEL2025',    discount: 25, description: 'Code promotionnel Noël 2025 — expiré',        expiresAt: '2026-01-01', usageCount: 892,  usageLimit: 500,  active: false },
];

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePricing() {
  const [tariffs,  setTariffs]  = useState<TariffRule[]>(MOCK_TARIFFS);
  const [promos,   setPromos]   = useState<PromoCode[]>(MOCK_PROMOS);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState<string | null>(null); // id of item being saved

  useEffect(() => {
    setLoading(true);
    Promise.all([
      pricingService.getTariffs().then((r) => { if (Array.isArray(r.data.body)) setTariffs(r.data.body); }).catch(() => {}),
      pricingService.getPromos().then((r)   => { if (Array.isArray(r.data.body)) setPromos(r.data.body);  }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  // ── Tariffs ───────────────────────────────────────────────────────────────
  const updateTariff = useCallback(async (id: string, value: number) => {
    setSaving(id);
    const t = tariffs.find((x) => x.id === id);
    if (!t) return;
    setTariffs((prev) => prev.map((x) => x.id === id ? { ...x, value } : x));
    try { await pricingService.updateTariff(id, value, t.active); }
    catch { /* keep optimistic */ }
    finally { setSaving(null); }
  }, [tariffs]);

  const toggleTariff = useCallback(async (id: string) => {
    const t = tariffs.find((x) => x.id === id);
    if (!t) return;
    const next = !t.active;
    setTariffs((prev) => prev.map((x) => x.id === id ? { ...x, active: next } : x));
    pricingService.updateTariff(id, t.value, next).catch(() => {});
  }, [tariffs]);

  // ── Promos ────────────────────────────────────────────────────────────────
  const addPromo = useCallback(async (data: Omit<PromoCode, 'id' | 'usageCount'>) => {
    const temp: PromoCode = { ...data, id: `p-${Date.now()}`, usageCount: 0 };
    setPromos((prev) => [temp, ...prev]);
    try {
      const res = await pricingService.createPromo(data);
      const created = res.data.body;
      if (created?.id) setPromos((prev) => prev.map((x) => x.id === temp.id ? created : x));
    } catch { /* keep optimistic */ }
  }, []);

  const togglePromo = useCallback((id: string) => {
    setPromos((prev) => prev.map((x) => x.id === id ? { ...x, active: !x.active } : x));
    const p = promos.find((x) => x.id === id);
    if (p) pricingService.togglePromo(id, !p.active).catch(() => {});
  }, [promos]);

  const deletePromo = useCallback((id: string) => {
    setPromos((prev) => prev.filter((x) => x.id !== id));
    pricingService.deletePromo(id).catch(() => {});
  }, []);

  return {
    tariffs, promos, loading, saving,
    updateTariff, toggleTariff,
    addPromo, togglePromo, deletePromo,
  };
}
