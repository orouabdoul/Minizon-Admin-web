import { useState } from 'react';
import {
  Tag, Plus, Trash2, ToggleLeft, ToggleRight,
  Check, Loader, WifiOff, RefreshCw,
} from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { ConfirmDialog }   from '../../components/Overlay/ConfirmDialog/ConfirmDialog';
import { usePricing }      from '../../hooks/usePricing';
import type { PromoCode }  from '../../models/pricing.model';

// ── Mock / API error banner ───────────────────────────────────────────────────

function MockBanner({ message, onRefresh }: { message: string; onRefresh: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', marginBottom: 16, background: '#FEF9C3', border: '1px solid #FDE68A', borderRadius: 9, fontSize: 12, color: '#92400E' }}>
      <AppIcon icon={WifiOff} size={14} color="#D97706" />
      <span style={{ flex: 1 }}><strong>Mode démo</strong> — {message}</span>
      <button type="button" onClick={onRefresh} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', fontSize: 12, fontWeight: 600 }}>
        <AppIcon icon={RefreshCw} size={12} color="#D97706" /> Réessayer
      </button>
    </div>
  );
}

// ── Add Promo Modal ───────────────────────────────────────────────────────────

const EMPTY_FORM: Omit<PromoCode, 'id' | 'usageCount'> = {
  code: '', discount: 10, description: '', expiresAt: '', usageLimit: 500, active: true,
};

function AddPromoModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (data: Omit<PromoCode, 'id' | 'usageCount'>) => void;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.expiresAt) return;
    setSubmitting(true);
    onAdd(form);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, width: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.20)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>Nouveau code promo</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>Les champs * sont obligatoires</p>
          </div>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 20, color: '#9CA3AF', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Fields */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Code */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Code promo *</span>
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
              placeholder="ex : ETE2026"
              style={{ height: 36, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none', letterSpacing: 1, fontFamily: 'monospace', fontWeight: 700 }}
            />
          </label>

          {/* Discount */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Remise (%)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number" min={1} max={100}
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: Math.min(100, Math.max(1, +e.target.value)) })}
                style={{ width: 80, height: 36, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#2563EB', fontWeight: 700, outline: 'none' }}
              />
              <span style={{ fontSize: 13, color: '#6B7280' }}>%</span>
              <div style={{ flex: 1, height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${form.discount}%`, background: '#2563EB', borderRadius: 4, transition: 'width .2s' }} />
              </div>
            </div>
          </label>

          {/* Description */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Description</span>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Courte description visible par les utilisateurs"
              style={{ height: 36, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none' }}
            />
          </label>

          {/* Expiry + usage limit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Date d'expiration *</span>
              <input
                required type="date"
                min={new Date().toISOString().split('T')[0]}
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
                onChange={(e) => setForm({ ...form, usageLimit: Math.max(1, +e.target.value) })}
                style={{ height: 36, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none' }}
              />
            </label>
          </div>

          {/* Active toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F9FAFB', borderRadius: 9, border: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Activer immédiatement</span>
            <button type="button" onClick={() => setForm({ ...form, active: !form.active })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: form.active ? '#00A86B' : '#9CA3AF' }}>
              <AppIcon icon={form.active ? ToggleRight : ToggleLeft} size={22} color={form.active ? '#00A86B' : '#D1D5DB'} />
              {form.active ? 'Oui' : 'Non'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" onClick={onClose}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            Annuler
          </button>
          <button type="submit" disabled={submitting}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#2563EB', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Création…' : 'Créer le code'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function PricingScreen() {
  const {
    tariffs, promos, loading, saving, error, usingMock,
    updateTariff, toggleTariff, addPromo, togglePromo, deletePromo, refresh,
  } = usePricing();

  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [editVal,      setEditVal]      = useState('');
  const [showModal,    setShowModal]    = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const startEdit = (id: string, val: number) => { setEditingId(id); setEditVal(String(val)); };
  const commitEdit = (id: string) => {
    const v = parseFloat(editVal);
    if (!isNaN(v) && v > 0) updateTariff(id, v);
    setEditingId(null);
  };

  return (
    <DashboardLayout title="Tarifs & Promotions">

      {usingMock && error && <MockBanner message={error} onRefresh={refresh} />}

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>Chargement…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 16, alignItems: 'start' }}>

          {/* ── Left: Tariff rules ─────────────────────────────────────────── */}
          <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AppIcon icon={Tag} size={16} color="#374151" />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Règles tarifaires</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9CA3AF' }}>{tariffs.filter((t) => t.active).length}/{tariffs.length} actives</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {tariffs.map((t, i) => (
                <div
                  key={t.id}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 140px 86px', gap: 12,
                    alignItems: 'center', padding: '12px 16px',
                    borderBottom: i < tariffs.length - 1 ? '1px solid #F9FAFB' : 'none',
                    background: t.active ? '#fff' : '#F9FAFB',
                    opacity: t.active ? 1 : 0.55,
                    transition: 'opacity .2s',
                  }}
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
                          autoFocus type="number"
                          value={editVal}
                          onChange={(e) => setEditVal(e.target.value)}
                          onBlur={() => commitEdit(t.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(t.id); if (e.key === 'Escape') setEditingId(null); }}
                          style={{ width: 72, height: 30, padding: '0 8px', borderRadius: 7, border: '2px solid #2563EB', fontSize: 13, outline: 'none', textAlign: 'right' }}
                        />
                        <span style={{ fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap' }}>{t.unit}</span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(t.id, t.value)}
                        title="Cliquer pour modifier"
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontSize: 13, fontWeight: 700, color: '#111827', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        {saving === t.id
                          ? <AppIcon icon={Loader} size={12} color="#9CA3AF" />
                          : <AppIcon icon={Check} size={12} color="#00A86B" />}
                        {t.value} {t.unit}
                      </button>
                    )}
                  </div>

                  {/* Toggle active */}
                  <button
                    type="button"
                    onClick={() => toggleTariff(t.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, border: 'none', background: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: t.active ? '#00A86B' : '#9CA3AF' }}
                  >
                    <AppIcon icon={t.active ? ToggleRight : ToggleLeft} size={22} color={t.active ? '#00A86B' : '#D1D5DB'} />
                    {t.active ? 'Actif' : 'Inactif'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Promo codes ─────────────────────────────────────────── */}
          <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Codes Promo</span>
                <span style={{ marginLeft: 8, fontSize: 11, color: '#9CA3AF' }}>{promos.filter((p) => p.active && new Date(p.expiresAt) >= new Date()).length} actifs</span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#2563EB', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer' }}
              >
                <AppIcon icon={Plus} size={13} color="#fff" /> Ajouter
              </button>
            </div>

            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px 48px 1fr 82px 68px', gap: 8, padding: '8px 16px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
              {['Code', 'Remise', 'Description', 'Expiration', 'Actions'].map((h) => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.3 }}>{h}</span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {promos.length === 0 ? (
                <p style={{ padding: '24px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>Aucun code promo</p>
              ) : promos.map((p, i) => {
                const isExpired = new Date(p.expiresAt) < new Date();
                const usagePct  = p.usageLimit > 0 ? Math.min(100, (p.usageCount / p.usageLimit) * 100) : 0;

                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'grid', gridTemplateColumns: '100px 48px 1fr 82px 68px', gap: 8,
                      alignItems: 'center', padding: '11px 16px',
                      borderBottom: i < promos.length - 1 ? '1px solid #F9FAFB' : 'none',
                      opacity: p.active && !isExpired ? 1 : 0.5,
                    }}
                  >
                    {/* Code */}
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#111827', fontFamily: 'monospace', letterSpacing: 0.5 }}>{p.code}</span>

                    {/* Discount */}
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#2563EB' }}>-{p.discount}%</span>

                    {/* Description + usage bar */}
                    <div>
                      <div style={{ fontSize: 11, color: '#374151', marginBottom: 3 }}>{p.description || '—'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ flex: 1, height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${usagePct}%`, background: usagePct >= 90 ? '#E53935' : '#2563EB', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 9, color: '#9CA3AF', whiteSpace: 'nowrap' }}>{p.usageCount}/{p.usageLimit}</span>
                      </div>
                    </div>

                    {/* Expiry */}
                    <div>
                      <span style={{ fontSize: 11, color: isExpired ? '#E53935' : '#6B7280' }}>
                        {new Date(p.expiresAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </span>
                      {isExpired && <div style={{ fontSize: 9, fontWeight: 700, color: '#E53935', marginTop: 1 }}>EXPIRÉ</div>}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 5 }}>
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
                        onClick={() => setDeleteTarget(p.id)}
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
      )}

      {/* Add promo modal */}
      {showModal && (
        <AddPromoModal onClose={() => setShowModal(false)} onAdd={addPromo} />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) { deletePromo(deleteTarget); setDeleteTarget(null); } }}
        title="Supprimer ce code promo ?"
        message="Cette action est irréversible. Le code sera définitivement supprimé et ne pourra plus être utilisé."
        confirmLabel="Supprimer"
        variant="danger"
        icon={Trash2}
      />

    </DashboardLayout>
  );
}
