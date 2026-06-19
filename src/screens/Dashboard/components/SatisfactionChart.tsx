import type { DashboardPayments, DashboardWithdrawals } from '../../../models/dashboard.model';

interface Props {
  payments:    DashboardPayments    | null;
  withdrawals: DashboardWithdrawals | null;
}

function formatFcfa(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M FCFA`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K FCFA`;
  return `${v} FCFA`;
}

function PaymentRow({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid #F9FAFB',
    }}>
      <div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{sub}</div>}
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, marginTop: 14 }}>
      {children}
    </p>
  );
}

export function SatisfactionChart({ payments, withdrawals }: Props) {
  if (!payments || !withdrawals) {
    return (
      <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#9CA3AF', fontSize: 13 }}>Chargement…</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '4px 0' }}>
      <SectionTitle>Paiements</SectionTitle>
      <PaymentRow label="Volume total"          value={formatFcfa(payments.total_volume_fcfa)}      color="#374151" sub="Toutes transactions" />
      <PaymentRow label="Revenus plateforme"    value={formatFcfa(payments.platform_revenue_fcfa)}  color="#00A86B" />
      <PaymentRow label="Fonds en escrow"       value={formatFcfa(payments.escrow_locked_fcfa)}     color="#2563EB" sub="Bloqués en attente" />
      <PaymentRow label="Remboursements"        value={formatFcfa(payments.refunded_fcfa)}          color="#E53935" />
      <PaymentRow label="Ce mois"               value={formatFcfa(payments.this_month_fcfa)}        color="#F59E0B" />

      <SectionTitle>Retraits</SectionTitle>
      <PaymentRow label="En attente (nombre)"   value={String(withdrawals.pending_count)}           color="#9333EA" />
      <PaymentRow label="En attente (montant)"  value={formatFcfa(withdrawals.pending_amount)}      color="#FB8C00" />
    </div>
  );
}
