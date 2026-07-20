import { useState } from 'react';
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, Check, Loader } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { usePricing }      from '../../hooks/usePricing';
import type { PromoCode }  from '../../models/pricing.model';

// ── Add Promo Modal ────────────────────────────────────────────────────────────

const EMPTY_FORM = { code: '', discount: 10, description: '', expiresAt: '', usageLimit: 500, active: true } as const;

function AddPromoModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: Omit<PromoCode, 'id' | 'usageCount'>) => void }) {
  const [form, setForm] = useState<Omit<PromoCode, 'id' | 'usageCount'>>(EMPTY_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.expiresAt) return;
    onAdd(form);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.20)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Nouveau code promo</span>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 18, color: '#6B7280', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Code */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Code promo *</span>
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="ex: ETE2026"
              style={{ height: 36, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none', letterSpacing: 1 }}
            />
          </label>

          {/* Discount */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Remise (%)</span>
            <input
              type="number" min={1} max={100}
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: +e.target.value })}
              style={{ height: 36, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none' }}
            />
          </label>

          {/* Description */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Description</span>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description courte du code"
              style={{ height: 36, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none' }}
            />
          </label>

          {/* Expiry + Usage in one row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Date d'expiration *</span>
              <input
                required type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Limite d'utilisation</span>
              <input
                type="number" min={1}
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: +e.target.value })}
                style={{ height: 36, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none' }}
              />
            </label>
          </div>
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Annuler</button>
          <button type="submit" style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#2563EB', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Créer le code</button>
        </div>
      </form>
    </div>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export function PricingScreen() {
  const { tariffs, promos, saving, updateTariff, toggleTariff, addPromo, togglePromo, deletePromo } = usePricing();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal,   setEditVal]   = useState('');
  const [showModal, setShowModal] = useState(false);

  const startEdit = (id: string, val: number) => {
    setEditingId(id);
    setEditVal(String(val));
  };

  const commitEdit = (id: string) => {
    const v = parseFloat(editVal);
    if (!isNaN(v) && v > 0) updateTariff(id, v);
    setEditingId(null);
  };

  return (
    <DashboardLayout title="Tarifs & Promotions">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 16, alignItems: 'start' }}>

        {/* ── Left: Tariff rules ──────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AppIcon icon={Tag} size={16} color="#374151" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Règles tarifaires</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tariffs.map((t, i) => (
              <div
                key={t.id}
                style={{ display: 'grid', gridTemplateColumns: '1fr 130px 80px', gap: 12, alignItems: 'center', padding: '12px 16px', borderBottom: i < tariffs.length - 1 ? '1px solid #F9FAFB' : 'none', background: t.active ? '#fff' : '#F9FAFB', opacity: t.active ? 1 : 0.6 }}
              >
                {/* Name + desc */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{t.description}</div>
                </div>

                {/* Editable value */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {editingId === t.id ? (
                    <>
                      <input
                        autoFocus
                        type="number"
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        onBlur={() => commitEdit(t.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(t.id); if (e.key === 'Escape') setEditingId(null); }}
                        style={{ width: 70, height: 30, padding: '0 8px', borderRadius: 7, border: '2px solid #2563EB', fontSize: 13, outline: 'none', textAlign: 'right' }}
                      />
                      <span style={{ fontSize: 11, color: '#6B7280' }}>{t.unit}</span>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(t.id, t.value)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontSize: 13, fontWeight: 700, color: '#111827', cursor: 'pointer' }}
                    >
                      {saving === t.id ? <AppIcon icon={Loader} size={12} color="#9CA3AF" /> : <AppIcon icon={Check} size={12} color="#00A86B" />}
                      {t.value}{t.unit}
                    </button>
                  )}
                </div>

                {/* Toggle active */}
                <button
                  type="button"
                  onClick={() => toggleTariff(t.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, border: 'none', background: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: t.active ? '#00A86B' : '#9CA3AF' }}
                >
                  <AppIcon icon={t.active ? ToggleRight : ToggleLeft} size={20} color={t.active ? '#00A86B' : '#D1D5DB'} />
                  {t.active ? 'Actif' : 'Inactif'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Promo codes ──────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Codes Promo</span>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#2563EB', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer' }}
            >
              <AppIcon icon={Plus} size={13} color="#fff" /> Ajouter
            </button>
          </div>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '90px 50px 1fr 80px 70px', gap: 8, padding: '8px 16px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
            {['Code', 'Remise', 'Description', 'Expiration', 'Actions'].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.3 }}>{h}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {promos.map((p, i) => {
              const isExpired = new Date(p.expiresAt) < new Date();
              return (
                <div
                  key={p.id}
                  style={{ display: 'grid', gridTemplateColumns: '90px 50px 1fr 80px 70px', gap: 8, alignItems: 'center', padding: '11px 16px', borderBottom: i < promos.length - 1 ? '1px solid #F9FAFB' : 'none', opacity: p.active && !isExpired ? 1 : 0.5 }}
                >
                  {/* Code */}
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#111827', fontFamily: 'monospace', letterSpacing: 0.5 }}>{p.code}</span>

                  {/* Discount */}
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#2563EB' }}>-{p.discount}%</span>

                  {/* Description + usage */}
                  <div>
                    <div style={{ fontSize: 11, color: '#374151' }}>{p.description || '—'}</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>{p.usageCount}/{p.usageLimit} utilisations</div>
                  </div>

                  {/* Expiry */}
                  <span style={{ fontSize: 11, color: isExpired ? '#E53935' : '#6B7280' }}>
                    {new Date(p.expiresAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}
                    {isExpired && <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: '#E53935' }}>EXPIRÉ</span>}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => togglePromo(p.id)}
                      title={p.active ? 'Désactiver' : 'Activer'}
                      style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <AppIcon icon={p.active ? ToggleRight : ToggleLeft} size={14} color={p.active ? '#00A86B' : '#D1D5DB'} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePromo(p.id)}
                      title="Supprimer"
                      style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #FEE2E2', background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <AppIcon icon={Trash2} size={13} color="#E53935" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <AddPromoModal onClose={() => setShowModal(false)} onAdd={addPromo} />
      )}
    </DashboardLayout>
  );
}
