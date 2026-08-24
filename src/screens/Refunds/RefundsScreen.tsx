import { useState } from 'react';
import { Search, Clock, CheckCircle, XCircle, RefreshCw, Loader, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { useRefunds }      from '../../hooks/useRefunds';
import type { RefundMethod, RefundStatus } from '../../models/refund.model';

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<RefundStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  en_attente: { label: 'En attente',  color: '#D97706', bg: '#FEF3C7', icon: Clock        },
  approuvé:   { label: 'Approuvé',    color: '#1A5FB4', bg: '#D6E8F7', icon: RefreshCw    },
  remboursé:  { label: 'Remboursé',   color: '#1A5FB4', bg: '#D6E8F7', icon: CheckCircle  },
  rejeté:     { label: 'Rejeté',      color: '#E53935', bg: '#FEE2E2', icon: XCircle      },
};

const REASON_LABEL: Record<string, string> = {
  annulation:       'Annulation trajet',
  problème_trajet:  'Problème de trajet',
  double_paiement:  'Double paiement',
  surfacturation:   'Surfacturation',
  autre:            'Autre motif',
};

const METHODS: RefundMethod[] = ['MTN Mobile Money', 'Moov Money', 'Virement bancaire'];

function fmt(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Approve Modal ──────────────────────────────────────────────────────────────

function ApproveModal({
  name, amount, onClose, onConfirm,
}: { name: string; amount: number; onClose: () => void; onConfirm: (m: RefundMethod) => void }) {
  const [method, setMethod] = useState<RefundMethod>('MTN Mobile Money');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Approuver le remboursement</span>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 18, color: '#6B7280', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: '#F0FDF4', borderRadius: 10, padding: 14, marginBottom: 16, border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Passager à rembourser</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{name}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1A5FB4', marginTop: 4 }}>{fmt(amount)}</div>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Méthode de remboursement</span>
            {METHODS.map((m) => (
              <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: `2px solid ${method === m ? '#1A5FB4' : '#E5E7EB'}`, cursor: 'pointer', background: method === m ? '#EBF3FB' : '#fff' }}>
                <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} style={{ accentColor: '#1A5FB4' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: method === m ? '#1A5FB4' : '#374151' }}>{m}</span>
              </label>
            ))}
          </label>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Annuler</button>
          <button type="button" onClick={() => onConfirm(method)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1A5FB4', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Approuver</button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Done Modal ─────────────────────────────────────────────────────────

function ConfirmDoneModal({
  name, amount, onClose, onConfirm,
}: { name: string; amount: number; onClose: () => void; onConfirm: (ref: string) => void }) {
  const [ref, setRef] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Confirmer le remboursement</span>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 18, color: '#6B7280', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: '#374151', marginBottom: 12 }}>
            Confirmez que <strong>{name}</strong> a bien reçu <strong style={{ color: '#1A5FB4' }}>{fmt(amount)}</strong>.
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Référence de transaction</span>
            <input
              type="text"
              value={ref}
              onChange={(e) => setRef(e.target.value.toUpperCase())}
              placeholder="Ex: TXN-2026-XXXX"
              style={{ padding: '9px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'monospace' }}
            />
          </label>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Annuler</button>
          <button type="button" disabled={!ref.trim()} onClick={() => onConfirm(ref.trim())} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: ref.trim() ? '#1A5FB4' : '#E5E7EB', fontSize: 13, fontWeight: 600, color: '#fff', cursor: ref.trim() ? 'pointer' : 'not-allowed' }}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export function RefundsScreen() {
  const {
    refunds, loading, error, processing, summary, statusFilter, search, actionMsg,
    setStatusFilter, setSearch, approve, reject, markDone, reload,
  } = useRefunds();

  const [approveFor, setApproveFor] = useState<string | null>(null);
  const [doneFor,    setDoneFor]    = useState<string | null>(null);

  const approveItem = refunds.find((r) => r.id === approveFor);
  const doneItem    = refunds.find((r) => r.id === doneFor);

  return (
    <DashboardLayout title="Remboursements Passagers">

      {/* ── KPI cards ────────────────────────────────────────────────────────── */}
      <div className="fin-kpi-grid">
        {[
          { label: 'Demandes en attente', value: String(summary.totalPending),             color: '#D97706', bg: '#FEF3C7', icon: Clock        },
          { label: 'Montant en attente',  value: fmt(summary.pendingAmount),                color: '#D97706', bg: '#FEF3C7', icon: AlertCircle  },
          { label: 'Remboursements faits',value: String(summary.totalRefunded),             color: '#1A5FB4', bg: '#D6E8F7', icon: CheckCircle  },
          { label: 'Total remboursé',     value: fmt(summary.refundedAmount),               color: '#1A5FB4', bg: '#D6E8F7', icon: RefreshCw    },
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
            {(['all', 'en_attente', 'approuvé', 'remboursé', 'rejeté'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                style={{ padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', background: statusFilter === s ? '#fff' : 'transparent', color: statusFilter === s ? '#111827' : '#6B7280', boxShadow: statusFilter === s ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
              >
                {s === 'all' ? 'Tous' : STATUS_CFG[s].label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F3F4F6', borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 200 }}>
            <AppIcon icon={Search} size={13} color="#9CA3AF" />
            <input
              style={{ border: 'none', background: 'transparent', fontSize: 13, outline: 'none', flex: 1, color: '#374151' }}
              placeholder="Rechercher un passager, trajet…"
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
      <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', overflow: 'hidden', minWidth: 860 }}>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '180px 120px 140px 120px 110px 1fr', gap: 8, padding: '10px 16px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
          {['Passager', 'Trajet', 'Motif', 'Montant', 'Date', 'Statut / Action'].map((h) => (
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
          <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Aucune demande de remboursement</div>
        ) : refunds.map((r, i) => {
          const sc = STATUS_CFG[r.status];
          const isProcessing = processing === r.id;
          return (
            <div
              key={r.id}
              style={{ display: 'grid', gridTemplateColumns: '180px 120px 140px 120px 110px 1fr', gap: 8, padding: '12px 16px', alignItems: 'center', borderBottom: i < refunds.length - 1 ? '1px solid #F9FAFB' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}
            >
              {/* Passager */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={r.passengerAvatar} alt={r.passengerName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{r.passengerName}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{r.passengerPhone}</div>
                </div>
              </div>

              {/* Trajet */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1A5FB4', fontFamily: 'monospace' }}>{r.tripId}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{r.driverName}</div>
              </div>

              {/* Motif */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{REASON_LABEL[r.reason]}</div>
                {r.reasonDetail && (
                  <div style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }} title={r.reasonDetail}>{r.reasonDetail}</div>
                )}
              </div>

              {/* Montant */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#1A5FB4' }}>{fmt(r.refundAmount)}</div>
                {r.tripAmount !== r.refundAmount && (
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>sur {fmt(r.tripAmount)}</div>
                )}
              </div>

              {/* Date */}
              <div style={{ fontSize: 12, color: '#6B7280' }}>{fmtDate(r.requestedAt)}</div>

              {/* Statut + Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 9999, color: sc.color, background: sc.bg }}>
                    {sc.label}
                  </span>
                  {r.method && (
                    <span style={{ fontSize: 11, color: '#6B7280' }}>· {r.method}</span>
                  )}
                  {r.reference && (
                    <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>{r.reference}</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {r.status === 'en_attente' && (
                    <>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setApproveFor(r.id)}
                        style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#1A5FB4', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        {isProcessing ? <AppIcon icon={Loader} size={11} color="#fff" /> : null}
                        ✓ Approuver
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => reject(r.id)}
                        style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #FCA5A5', background: '#FFF5F5', fontSize: 11, fontWeight: 700, color: '#E53935', cursor: 'pointer' }}
                      >
                        ✕ Rejeter
                      </button>
                    </>
                  )}
                  {r.status === 'approuvé' && (
                    <button
                      type="button"
                      onClick={() => setDoneFor(r.id)}
                      style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#1A5FB4', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}
                    >
                      Confirmer envoi
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>{/* fin-table-scroll */}

      {/* Approve modal */}
      {approveItem && (
        <ApproveModal
          name={approveItem.passengerName}
          amount={approveItem.refundAmount}
          onClose={() => setApproveFor(null)}
          onConfirm={(method) => { approve(approveItem.id, method); setApproveFor(null); }}
        />
      )}

      {/* Confirm done modal */}
      {doneItem && (
        <ConfirmDoneModal
          name={doneItem.passengerName}
          amount={doneItem.refundAmount}
          onClose={() => setDoneFor(null)}
          onConfirm={(ref) => { markDone(doneItem.id, ref); setDoneFor(null); }}
        />
      )}

    </DashboardLayout>
  );
}
