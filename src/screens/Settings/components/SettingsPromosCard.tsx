import { useState, useEffect, useCallback } from 'react';
import { Tag, Plus, ToggleLeft, ToggleRight, Trash2, Loader } from 'lucide-react';
import { AppIcon }  from '../../../components/Common/AppIcon';
import { Badge }    from '../../../components/DataDisplay/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../../components/DataDisplay/Table/Table';
import { pricingService } from '../../../services/pricing_service';
import type { PromoCode, CreatePromoPayload } from '../../../models/pricing.model';

const EMPTY: CreatePromoPayload = {
  code: '', discount: 10, description: '', expires_at: '', usage_limit: 100, active: true,
};

export function SettingsPromosCard() {
  const [promos,   setPromos]   = useState<PromoCode[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState<CreatePromoPayload>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    pricingService.getPromos()
      .then((r) => setPromos(r.data.body?.promos ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = useCallback(async () => {
    if (!form.code.trim() || !form.expires_at) {
      setError('Le code et la date d\'expiration sont obligatoires.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const r = await pricingService.createPromo(form);
      setPromos((prev) => [r.data.body!, ...prev]);
      setForm(EMPTY);
      setShowForm(false);
    } catch {
      setError('Erreur lors de la création. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  }, [form]);

  const handleToggle = useCallback(async (uuid: string) => {
    setPromos((prev) => prev.map((p) => p.id === uuid ? { ...p, active: !p.active } : p));
    try { await pricingService.togglePromo(uuid); } catch {
      setPromos((prev) => prev.map((p) => p.id === uuid ? { ...p, active: !p.active } : p));
    }
  }, []);

  const handleDelete = useCallback(async (uuid: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== uuid));
    try { await pricingService.deletePromo(uuid); } catch {
      pricingService.getPromos().then((r) => setPromos(r.data.body?.promos ?? [])).catch(() => {});
    }
  }, []);

  const set = (k: keyof CreatePromoPayload, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="settings-card">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AppIcon icon={Tag} size={16} color="#9333EA" />
          </div>
          <div>
            <p className="settings-card__title" style={{ margin: 0 }}>Codes Promotionnels</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
              {loading ? 'Chargement…' : `${promos.length} code${promos.length !== 1 ? 's' : ''} actif${promos.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm((v) => !v); setError(''); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8,
            background: showForm ? '#F3F4F6' : '#9333EA',
            border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            color: showForm ? '#374151' : 'white',
          }}
        >
          <AppIcon icon={Plus} size={15} color={showForm ? '#6B7280' : 'white'} />
          {showForm ? 'Annuler' : 'Nouveau code'}
        </button>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <div style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 16 }}>Créer un code promo</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="modal-form-group">
              <label className="modal-form-label">Code promo *</label>
              <input
                className="settings-input"
                placeholder="Ex : NOEL2025"
                value={form.code}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <div className="modal-form-group">
              <label className="modal-form-label">Réduction (%)</label>
              <input
                className="settings-input"
                type="number" min={1} max={100} step={1}
                value={form.discount}
                onChange={(e) => set('discount', Number(e.target.value))}
              />
            </div>
            <div className="modal-form-group">
              <label className="modal-form-label">Date d'expiration *</label>
              <input
                className="settings-input"
                type="date"
                value={form.expires_at}
                onChange={(e) => set('expires_at', e.target.value)}
              />
            </div>
            <div className="modal-form-group">
              <label className="modal-form-label">Limite d'utilisation</label>
              <input
                className="settings-input"
                type="number" min={1}
                value={form.usage_limit}
                onChange={(e) => set('usage_limit', Number(e.target.value))}
              />
            </div>
            <div className="modal-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="modal-form-label">Description</label>
              <input
                className="settings-input"
                placeholder="Ex : Promo de Noël — 10% de réduction"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p style={{ color: '#DC2626', fontSize: 12, marginTop: 8 }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              type="button"
              className="modal-btn-save modal-btn-save--blue"
              style={{ background: '#9333EA', minWidth: 160 }}
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? <AppIcon icon={Loader} size={14} color="white" /> : 'Créer le code promo'}
            </button>
            <button type="button" className="modal-btn-cancel" onClick={() => { setShowForm(false); setError(''); }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Tableau des promos */}
      <Table>
        <TableHead>
          <TableRow>
            <Th>Code</Th>
            <Th width="90px">Réduction</Th>
            <Th width="130px">Expiration</Th>
            <Th width="120px">Utilisations</Th>
            <Th width="90px">Statut</Th>
            <Th width="90px">Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <Td><span className="settings-table-text" style={{ color: '#9CA3AF' }}>Chargement…</span></Td>
              <Td /><Td /><Td /><Td /><Td />
            </TableRow>
          ) : promos.length === 0 ? (
            <TableRow>
              <Td><span className="settings-table-text" style={{ color: '#9CA3AF' }}>Aucun code promo</span></Td>
              <Td /><Td /><Td /><Td /><Td />
            </TableRow>
          ) : promos.map((p) => (
            <TableRow key={p.id}>
              <Td>
                <span className="settings-table-text settings-table-text--bold" style={{ fontFamily: 'monospace', color: '#9333EA' }}>
                  {p.code}
                </span>
                {p.description && (
                  <span className="settings-table-text" style={{ display: 'block', fontSize: 11, color: '#9CA3AF' }}>{p.description}</span>
                )}
              </Td>
              <Td><span className="settings-table-text settings-table-text--bold">{p.discount}%</span></Td>
              <Td><span className="settings-table-text">{p.expiresAt ? new Date(p.expiresAt).toLocaleDateString('fr-FR') : '—'}</span></Td>
              <Td>
                <span className="settings-table-text">
                  {p.usageCount} / {p.usageLimit === 0 ? '∞' : p.usageLimit}
                </span>
              </Td>
              <Td><Badge label={p.active ? 'Actif' : 'Inactif'} variant={p.active ? 'emerald' : 'neutral'} /></Td>
              <Td>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    type="button" className="trip-action-btn"
                    title={p.active ? 'Désactiver' : 'Activer'}
                    onClick={() => handleToggle(p.id)}
                  >
                    <AppIcon icon={p.active ? ToggleRight : ToggleLeft} size={15} color={p.active ? '#16A34A' : '#9CA3AF'} />
                  </button>
                  <button
                    type="button" className="trip-action-btn"
                    title="Supprimer"
                    onClick={() => handleDelete(p.id)}
                  >
                    <AppIcon icon={Trash2} size={14} color="#E53935" />
                  </button>
                </div>
              </Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
