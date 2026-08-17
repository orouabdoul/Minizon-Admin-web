import { useState } from 'react';
import {
  DollarSign, Download, CheckCircle, Clock, AlertCircle, RefreshCw,
  Loader, WifiOff, Sparkles, AlertTriangle,
} from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { usePayouts }      from '../../hooks/usePayouts';
import type { PayoutMethod, PayoutStatus } from '../../models/payout.model';

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PayoutStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  en_attente:    { label: 'En attente',    color: '#D97706', bg: '#FEF3C7', icon: Clock        },
  en_traitement: { label: 'En traitement', color: '#1A5FB4', bg: '#D6E8F7', icon: RefreshCw    },
  payé:          { label: 'Payé',          color: '#1A5FB4', bg: '#D6E8F7', icon: CheckCircle  },
  échoué:        { label: 'Échoué',        color: '#E53935', bg: '#FEE2E2', icon: AlertCircle  },
};

const METHODS: PayoutMethod[] = ['MTN Mobile Money', 'Moov Money', 'Virement bancaire'];

function fmt(n: number) { return n.toLocaleString('fr-FR') + ' FCFA'; }

// ── Process Modal ──────────────────────────────────────────────────────────────

function ProcessModal({
  name, netAmount, method: initMethod, onClose, onConfirm,
}: { name: string; netAmount: number; method: PayoutMethod; onClose: () => void; onConfirm: (m: PayoutMethod) => void }) {
  const [method, setMethod] = useState<PayoutMethod>(initMethod);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Déclencher le virement</span>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 18, color: '#6B7280', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Conducteur</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{name}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1A5FB4', marginTop: 4 }}>{fmt(netAmount)}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Méthode de paiement</span>
            {METHODS.map((m) => (
              <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: `2px solid ${method === m ? '#1A5FB4' : '#E5E7EB'}`, cursor: 'pointer', background: method === m ? '#EFF6FF' : '#fff' }}>
                <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} style={{ accentColor: '#1A5FB4' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: method === m ? '#1A5FB4' : '#374151' }}>{m}</span>
              </label>
            ))}
          </div>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Annuler</button>
          <button type="button" onClick={() => onConfirm(method)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1A5FB4', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Confirmer le virement</button>
        </div>
      </div>
    </div>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export function PayoutsScreen() {
  const {
    payouts, summary, loading, usingMock,
    statusFilter, setStatusFilter,
    processing, exportMsg,
    selected, toggleSelect, selectAll, clearSelection,
    generating, generateMsg, generateError, generatePayouts,
    processPayout, markPaid, retryPayout, batchProcess, exportCsv,
    refresh,
  } = usePayouts();

  const [modalFor, setModalFor] = useState<string | null>(null);

  const pendingCount = payouts.filter((p) => p.status === 'en_attente').length;
  const modalItem    = payouts.find((p) => p.id === modalFor);

  return (
    <DashboardLayout title="Virements Conducteurs">

      {/* ── Mock banner ──────────────────────────────────────────────────────── */}
      {usingMock && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '10px 16px', marginBottom: 14 }}>
          <AppIcon icon={WifiOff} size={15} color="#D97706" />
          <span style={{ fontSize: 13, color: '#92400E', flex: 1 }}>Mode démo — API indisponible, données simulées.</span>
          <button type="button" onClick={refresh} style={{ fontSize: 12, fontWeight: 700, color: '#D97706', background: 'none', border: '1.5px solid #FDE68A', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>Réessayer</button>
        </div>
      )}

      {/* ── Generate banner ───────────────────────────────────────────────────── */}
      {generateMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 16px', marginBottom: 14 }}>
          <AppIcon icon={CheckCircle} size={15} color="#16A34A" />
          <span style={{ fontSize: 13, color: '#14532D' }}>{generateMsg}</span>
        </div>
      )}
      {generateError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 16px', marginBottom: 14 }}>
          <AppIcon icon={AlertTriangle} size={15} color="#DC2626" />
          <span style={{ fontSize: 13, color: '#991B1B' }}>{generateError}</span>
        </div>
      )}

      {/* ── Summary cards ────────────────────────────────────────────────────── */}
      <div className="fin-kpi-grid">
        {[
          { label: 'Montant à verser',     value: fmt(summary.totalPending),     color: '#D97706', bg: '#FEF3C7', icon: Clock        },
          { label: 'Virements en attente', value: String(summary.pendingAmount), color: '#D97706', bg: '#FEF3C7', icon: Clock        },
          { label: 'Total versé (mois)',   value: fmt(summary.totalPaid),        color: '#1A5FB4', bg: '#D6E8F7', icon: CheckCircle  },
          { label: 'Conducteurs actifs',   value: String(summary.totalDrivers),  color: '#1A5FB4', bg: '#D6E8F7', icon: DollarSign   },
        ].map((k) => (
          <div key={k.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AppIcon icon={k.icon} size={18} color={k.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', marginBottom: 12 }}>
        <div className="fin-toolbar" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', flexWrap: 'wrap' }}>

          {/* Status filter tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#F3F4F6', borderRadius: 8, padding: 3 }}>
            {(['all', 'en_attente', 'en_traitement', 'payé', 'échoué'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                style={{ padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', background: statusFilter === s ? '#fff' : 'transparent', color: statusFilter === s ? '#111827' : '#6B7280', boxShadow: statusFilter === s ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
              >
                {s === 'all' ? 'Tous' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Batch actions */}
          {selected.size > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#EFF6FF', borderRadius: 8, border: '1.5px solid #B3D4F0' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1A5FB4' }}>{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
              <button type="button" onClick={() => batchProcess('MTN Mobile Money')} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#1A5FB4', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                Verser tout (MTN)
              </button>
              <button type="button" onClick={clearSelection} style={{ border: 'none', background: 'none', fontSize: 12, color: '#6B7280', cursor: 'pointer' }}>×</button>
            </div>
          )}

          {pendingCount > 0 && selected.size === 0 && (
            <button type="button" onClick={selectAll} style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
              Sélectionner les en attente ({pendingCount})
            </button>
          )}

          {/* Generate payout sheets */}
          <button
            type="button"
            onClick={generatePayouts}
            disabled={generating}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: generating ? '#F9FAFB' : '#fff', fontSize: 12, fontWeight: 600, color: generating ? '#9CA3AF' : '#374151', cursor: generating ? 'default' : 'pointer' }}
          >
            {generating
              ? <AppIcon icon={Loader} size={13} color="#9CA3AF" />
              : <AppIcon icon={Sparkles} size={13} color="#374151" />}
            Générer les fiches
          </button>

          <button
            type="button"
            onClick={exportCsv}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
          >
            <AppIcon icon={Download} size={13} color="#374151" />
            Export CSV
          </button>
        </div>

        {exportMsg && (
          <div style={{ padding: '8px 16px', background: '#D6E8F7', borderTop: '1px solid #B3D4F0', fontSize: 12, fontWeight: 600, color: '#0F4A9E' }}>
            ℹ️ {exportMsg}
          </div>
        )}
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="fin-table-scroll">
      <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', overflow: 'hidden', minWidth: 1020 }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '40px 200px 80px 130px 130px 120px 130px 140px', gap: 8, padding: '10px 16px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
          {['', 'Conducteur', 'Trajets', 'Brut', 'Commission', 'Net à verser', 'Méthode', 'Statut / Action'].map((h) => (
            <span key={h || '_cb'} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.3 }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Chargement…</div>
        ) : payouts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Aucun virement trouvé</div>
        ) : (
          payouts.map((p, i) => {
            const sc          = STATUS_CONFIG[p.status];
            const isSelected  = selected.has(p.id);
            const isProcessing= processing === p.id;
            return (
              <div
                key={p.id}
                style={{ display: 'grid', gridTemplateColumns: '40px 200px 80px 130px 130px 120px 130px 140px', gap: 8, padding: '12px 16px', alignItems: 'center', borderBottom: i < payouts.length - 1 ? '1px solid #F9FAFB' : 'none', background: isSelected ? '#EFF6FF' : (i % 2 === 0 ? '#fff' : '#FAFAFA') }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={p.status !== 'en_attente'}
                  onChange={() => toggleSelect(p.id)}
                  style={{ accentColor: '#1A5FB4', cursor: p.status === 'en_attente' ? 'pointer' : 'default' }}
                />

                {/* Driver */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={p.driverAvatar} alt={p.driverName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{p.driverName}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.driverPhone}</div>
                  </div>
                </div>

                {/* Trips */}
                <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{p.tripsCount}</span>

                {/* Gross */}
                <span style={{ fontSize: 12, color: '#374151' }}>{fmt(p.grossAmount)}</span>

                {/* Commission */}
                <span style={{ fontSize: 12, color: '#E53935' }}>−{fmt(p.commission)}</span>

                {/* Net */}
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1A5FB4' }}>{fmt(p.netAmount)}</span>

                {/* Method */}
                <span style={{ fontSize: 11, color: '#6B7280' }}>{p.method}</span>

                {/* Status + action */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 9999, color: sc.color, background: sc.bg, alignSelf: 'flex-start' }}>
                    {sc.label}
                  </span>

                  {p.status === 'en_attente' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setModalFor(p.id)}
                      style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#1A5FB4', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {isProcessing ? <AppIcon icon={Loader} size={11} color="#fff" /> : null}
                      Verser
                    </button>
                  )}

                  {p.status === 'en_traitement' && (
                    <button
                      type="button"
                      onClick={() => markPaid(p.id)}
                      style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#1A5FB4', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}
                    >
                      Confirmer payé
                    </button>
                  )}

                  {p.status === 'échoué' && (
                    <button
                      type="button"
                      onClick={() => retryPayout(p.id)}
                      style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#FEF3C7', fontSize: 11, fontWeight: 700, color: '#D97706', cursor: 'pointer' }}
                    >
                      Réessayer
                    </button>
                  )}

                  {p.reference && (
                    <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>{p.reference}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>{/* fin-table-scroll */}

      {/* Process modal */}
      {modalItem && (
        <ProcessModal
          name={modalItem.driverName}
          netAmount={modalItem.netAmount}
          method={modalItem.method}
          onClose={() => setModalFor(null)}
          onConfirm={(method) => { processPayout(modalItem.id, method); setModalFor(null); }}
        />
      )}

    </DashboardLayout>
  );
}
