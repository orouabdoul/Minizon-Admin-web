import { useState } from 'react';
import { Search, Clock, CheckCircle, XCircle, RefreshCw, Loader, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { useRefunds }      from '../../hooks/useRefunds';
import type { RefundStatus } from '../../models/refund.model';

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<RefundStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  en_attente: { label: 'En attente', color: '#D97706', bg: '#FEF3C7', icon: Clock       },
  approuvé:   { label: 'Approuvé',   color: '#1A5FB4', bg: '#D6E8F7', icon: RefreshCw   },
  remboursé:  { label: 'Remboursé',  color: '#16A34A', bg: '#DCFCE7', icon: CheckCircle },
  rejeté:     { label: 'Échoué',     color: '#E53935', bg: '#FEE2E2', icon: XCircle     },
};

function fmt(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

function fmtDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Confirm Modal ──────────────────────────────────────────────────────────────

function ConfirmRefundModal({
  name, amount, onClose, onConfirm,
}: { name: string; amount: number; onClose: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Confirmer le remboursement</span>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 18, color: '#6B7280', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: '#F0FDF4', borderRadius: 10, padding: 14, border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Passager à rembourser</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{name}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#16A34A', marginTop: 4 }}>{fmt(amount)}</div>
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', marginTop: 12 }}>
            Cette action déclenchera un remboursement via FedaPay. L'opération est irréversible.
          </p>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Annuler</button>
          <button type="button" onClick={onConfirm} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#16A34A', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Rembourser</button>
        </div>
      </div>
    </div>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export function RefundsScreen() {
  const {
    refunds, loading, error, processing, summary, statusFilter, search, actionMsg,
    setStatusFilter, setSearch, doRefund, reload,
  } = useRefunds();

  const [confirmFor, setConfirmFor] = useState<string | null>(null);
  const confirmItem = refunds.find((r) => r.id === confirmFor);

  // Only show tabs that make sense for the payment-refund flow
  const TABS: Array<{ key: RefundStatus | 'all'; label: string }> = [
    { key: 'all',        label: 'Tous'       },
    { key: 'en_attente', label: 'À rembourser' },
    { key: 'remboursé',  label: 'Remboursés'  },
    { key: 'rejeté',     label: 'Échoués'     },
  ];

  return (
    <DashboardLayout title="Remboursements Passagers">

      {/* ── KPI cards ────────────────────────────────────────────────────────── */}
      <div className="fin-kpi-grid">
        {[
          { label: 'Paiements à rembourser', value: String(summary.totalPending),  color: '#D97706', bg: '#FEF3C7', icon: Clock       },
          { label: 'Montant en attente',      value: fmt(summary.pendingAmount),    color: '#D97706', bg: '#FEF3C7', icon: AlertCircle },
          { label: 'Déjà remboursés',         value: String(summary.totalRefunded), color: '#16A34A', bg: '#DCFCE7', icon: CheckCircle },
          { label: 'Total remboursé',         value: fmt(summary.refundedAmount),   color: '#16A34A', bg: '#DCFCE7', icon: RefreshCw   },
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

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#F3F4F6', borderRadius: 8, padding: 3 }}>
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                style={{ padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', background: statusFilter === key ? '#fff' : 'transparent', color: statusFilter === key ? '#111827' : '#6B7280', boxShadow: statusFilter === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F3F4F6', borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 200 }}>
            <AppIcon icon={Search} size={13} color="#9CA3AF" />
            <input
              style={{ border: 'none', background: 'transparent', fontSize: 13, outline: 'none', flex: 1, color: '#374151' }}
              placeholder="Rechercher un passager, réservation…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {actionMsg && (
          <div style={{ padding: '8px 16px', background: '#D6E8F7', borderTop: '1px solid #B3D4F0', fontSize: 12, fontWeight: 600, color: '#0F4A9E' }}>
            ℹ️ {actionMsg}
          </div>
        )}
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="fin-table-scroll">
      <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', overflow: 'hidden', minWidth: 820 }}>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '180px 140px 140px 120px 1fr', gap: 8, padding: '10px 16px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
          {['Passager', 'Réservation', 'Montant', 'Date', 'Statut / Action'].map((h) => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.3 }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Chargement…</div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ color: '#E53935', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{error}</div>
            <button type="button" onClick={reload} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1A5FB4', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Réessayer
            </button>
          </div>
        ) : refunds.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Aucun remboursement à afficher</div>
        ) : refunds.map((r, i) => {
          const sc = STATUS_CFG[r.status];
          const isProcessing = processing === r.id;
          return (
            <div
              key={r.id}
              style={{ display: 'grid', gridTemplateColumns: '180px 140px 140px 120px 1fr', gap: 8, padding: '12px 16px', alignItems: 'center', borderBottom: i < refunds.length - 1 ? '1px solid #F9FAFB' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}
            >
              {/* Passager */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {r.passengerAvatar ? (
                  <img src={r.passengerAvatar} alt={r.passengerName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E5E7EB', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>
                    {r.passengerName?.[0] ?? '?'}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{r.passengerName}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{r.passengerPhone}</div>
                </div>
              </div>

              {/* Réservation + Conducteur */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1A5FB4', fontFamily: 'monospace' }}>{r.tripId}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{r.driverName}</div>
              </div>

              {/* Montant */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#1A5FB4' }}>{fmt(r.refundAmount)}</div>
                {r.reference && (
                  <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>{r.reference}</div>
                )}
              </div>

              {/* Date */}
              <div style={{ fontSize: 12, color: '#6B7280' }}>{fmtDate(r.requestedAt)}</div>

              {/* Statut + Action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 9999, color: sc.color, background: sc.bg, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AppIcon icon={sc.icon} size={10} color={sc.color} />
                  {sc.label}
                </span>

                {r.status === 'en_attente' && (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setConfirmFor(r.id)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#16A34A', fontSize: 11, fontWeight: 700, color: '#fff', cursor: isProcessing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start', opacity: isProcessing ? 0.6 : 1 }}
                  >
                    {isProcessing ? <AppIcon icon={Loader} size={11} color="#fff" /> : null}
                    Rembourser
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>{/* fin-table-scroll */}

      {/* Confirm modal */}
      {confirmItem && (
        <ConfirmRefundModal
          name={confirmItem.passengerName}
          amount={confirmItem.refundAmount}
          onClose={() => setConfirmFor(null)}
          onConfirm={() => { doRefund(confirmItem.id); setConfirmFor(null); }}
        />
      )}

    </DashboardLayout>
  );
}
