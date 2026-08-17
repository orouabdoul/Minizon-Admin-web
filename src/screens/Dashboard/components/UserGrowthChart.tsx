import type { DashboardUsers } from '../../../models/dashboard.model';

interface Props { users: DashboardUsers | null; }

function ProportionalBar({ segments }: { segments: { pct: number; color: string }[] }) {
  const used = segments.reduce((s, seg) => s + seg.pct, 0);
  return (
    <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', marginBottom: 20 }}>
      {segments.map((seg, i) =>
        seg.pct > 0
          ? <div key={i} style={{ width: `${seg.pct}%`, background: seg.color }} />
          : null,
      )}
      {used < 100 && <div style={{ flex: 1, background: '#F3F4F6' }} />}
    </div>
  );
}

function StatRow({ label, value, color, dot = true }: { label: string; value: number; color: string; dot?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '9px 0', borderBottom: '1px solid #F9FAFB',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {dot && <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />}
        <span style={{ fontSize: 13, color: '#6B7280' }}>{label}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

export function UserGrowthChart({ users }: Props) {
  if (!users) {
    return (
      <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#9CA3AF', fontSize: 13 }}>Chargement…</span>
      </div>
    );
  }

  const platformTotal = users.drivers + users.passengers;
  const t = platformTotal || 1;
  return (
    <div style={{ padding: '4px 0' }}>
      <ProportionalBar segments={[
        { pct: (users.drivers    / t) * 100, color: '#1A5FB4' },
        { pct: (users.passengers / t) * 100, color: '#1A5FB4' },
        { pct: (users.blocked    / t) * 100, color: '#E53935' },
      ]} />
      <StatRow label="Total inscrits"    value={platformTotal}        color="#374151" dot={false} />
      <StatRow label="Conducteurs"       value={users.drivers}        color="#1A5FB4" />
      <StatRow label="Passagers"         value={users.passengers}     color="#1A5FB4" />
      <StatRow label="Nouveaux ce mois"  value={users.new_this_month} color="#A855F7" />
      <StatRow label="KYC en attente"    value={users.pending_kyc}    color="#F59E0B" />
      <StatRow label="Comptes bloqués"   value={users.blocked}        color="#E53935" />
    </div>
  );
}
