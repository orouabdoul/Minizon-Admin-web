import { useState } from 'react';
import { DollarSign, Download, CheckCircle, Clock, AlertCircle, RefreshCw, Loader } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { usePayouts }      from '../../hooks/usePayouts';
import type { PayoutMethod, PayoutStatus } from '../../models/payout.model';

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PayoutStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  en_attente:    { label: 'En attente',    color: '#D97706', bg: '#FEF3C7', icon: Clock        },
  en_traitement: { label: 'En traitement', color: '#2563EB', bg: '#DBEAFE', icon: RefreshCw    },
  payé:          { label: 'Payé',          color: '#00A86B', bg: '#DCFCE7', icon: CheckCircle  },
  échoué:        { label: 'Échoué',        color: '#E53935', bg: '#FEE2E2', icon: AlertCircle  },
};

const METHODS: PayoutMethod[] = ['MTN Mobile Money', 'Moov Money', 'Virement bancaire'];

function fmt(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

// ── Process Modal ──────────────────────────────────────────────────────────────

function ProcessModal({
  name, netAmount, method: initMethod,
  onClose, onConfirm,
}: { name: string; netAmount: number; method: PayoutMethod; onClose: () => void; onConfirm: (m: PayoutMethod) => void }) {
  const [method, setMethod] = useState<PayoutMethod>(initMethod);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Déclencher le virement</span>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 18, color: '#6B7280', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Conducteur</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{name}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#00A86B', marginTop: 4 }}>{fmt(netAmount)}</div>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Méthode de paiement</span>
            {METHODS.map((m) => (
              <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: `2px solid ${method === m ? '#2563EB' : '#E5E7EB'}`, cursor: 'pointer', background: method === m ? '#EFF6FF' : '#fff' }}>
                <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} style={{ accentColor: '#2563EB' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: method === m ? '#2563EB' : '#374151' }}>{m}</span>
              </label>
            ))}
          </label>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Annuler</button>
          <button type="button" onClick={() => onConfirm(method)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#00A86B', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Confirmer le virement</button>
        </div>
      </div>
    </div>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export function PayoutsScreen() {
  const {
    payouts, summary, loading, processing, exportMsg,
    selected, toggleSelect, selectAll, clearSelection,
    processPayout, markPaid, retryPayout, batchProcess, exportCsv,
  } = usePayouts();

  const [modalFor, setModalFor] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'all'>('all');

  const visible = statusFilter === 'all' ? payouts : payouts.filter((p) => p.status === statusFilter);
  const pendingCount = payouts.filter((p) => p.status === 'en_attente').length;
  const modalItem = payouts.find((p) => p.id === modalFor);

  return (
    <DashboardLayout title="Virements Conducteurs">

      {/* ── Summary cards ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Montant à verser',    value: fmt(summary.totalPending), color: '#D97706', bg: '#FEF3C7', icon: Clock        },
          { label: 'Virements en attente',value: String(summary.pendingAmount), color: '#D97706', bg: '#FEF3C7', icon: Clock    },
          { label: 'Total versé (mois)',   value: fmt(summary.totalPaid),    color: '#00A86B', bg: '#DCFCE7', icon: CheckCircle  },
          { label: 'Conducteurs actifs',   value: String(summary.totalDrivers), color: '#2563EB', bg: '#DBEAFE', icon: DollarSign },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', flexWrap: 'wrap' }}>

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#EFF6FF', borderRadius: 8, border: '1.5px solid #BFDBFE' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#2563EB' }}>{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
              <button type="button" onClick={() => batchProcess('MTN Mobile Money')} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#2563EB', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
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

          <button type="button" onClick={exportCsv} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            <AppIcon icon={Download} size={13} color="#374151" /> Export CSV
          </button>
        </div>

        {exportMsg && (
          <div style={{ padding: '8px 16px', background: '#DBEAFE', borderTop: '1px solid #BFDBFE', fontSize: 12, fontWeight: 600, color: '#1D4ED8' }}>
            ℹ️ {exportMsg}
          </div>
        )}
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', overflow: 'hidden' }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '40px 200px 80px 130px 130px 120px 130px 140px', gap: 8, padding: '10px 16px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
          {['', 'Conducteur', 'Trajets', 'Brut', 'Commission', 'Net à verser', 'Méthode', 'Statut / Action'].map((h) => (
            <span key={h || '_cb'} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.3 }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Chargement…</div>
        ) : (
          visible.map((p, i) => {
            const sc = STATUS_CONFIG[p.status];
            const isSelected = selected.has(p.id);
            const isProcessing = processing === p.id;
            return (
              <div
                key={p.id}
                style={{ display: 'grid', gridTemplateColumns: '40px 200px 80px 130px 130px 120px 130px 140px', gap: 8, padding: '12px 16px', alignItems: 'center', borderBottom: i < visible.length - 1 ? '1px solid #F9FAFB' : 'none', background: isSelected ? '#EFF6FF' : (i % 2 === 0 ? '#fff' : '#FAFAFA') }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={p.status !== 'en_attente'}
                  onChange={() => toggleSelect(p.id)}
                  style={{ accentColor: '#2563EB', cursor: p.status === 'en_attente' ? 'pointer' : 'default' }}
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
                <span style={{ fontSize: 13, fontWeight: 800, color: '#00A86B' }}>{fmt(p.netAmount)}</span>

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
                      style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#00A86B', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {isProcessing ? <AppIcon icon={Loader} size={11} color="#fff" /> : null}
                      Verser
                    </button>
                  )}
                  {p.status === 'en_traitement' && (
                    <button
                      type="button"
                      onClick={() => markPaid(p.id)}
                      style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#2563EB', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}
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
