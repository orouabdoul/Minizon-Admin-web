import { Car, UserPlus, CreditCard, AlertTriangle } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';
import { ActivityColumn } from './ActivityColumn';
import type { DashboardUsers, DashboardPayments, DashboardDisputes } from '../../../models/dashboard.model';

interface TopDriver { id: number; name: string; trips: number; rating: number; }

interface Props {
  users?:       DashboardUsers       | null;
  payments?:    DashboardPayments    | null;
  disputes?:    DashboardDisputes    | null;
  topDrivers?:  TopDriver[];
}

function StatItem({ icon, label, value, color, bg }: {
  icon:  React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bg:    string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: '#6B7280' }}>{label}</div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function formatFcfa(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M ₣`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K ₣`;
  return `${v} ₣`;
}

export function RealTimeActivity({ users, payments, disputes, topDrivers = [] }: Props) {
  return (
    <section className="dash-realtime">
      <div className="dash-realtime__header">
        <div className="dash-realtime__title-row">
          <div className="dash-realtime__dot" />
          <span className="dash-realtime__title">Aperçu en Temps Réel</span>
        </div>
      </div>

      <div className="dash-realtime__grid">

        {/* ── Inscriptions ── */}
        <ActivityColumn title="Inscriptions">
          {users ? (
            <>
              <StatItem
                icon={<AppIcon icon={UserPlus} size={15} color="#00A86B" />}
                bg="#DCFCE7"
                label="Total inscrits"
                value={users.total}
                color="#00A86B"
              />
              <StatItem
                icon={<AppIcon icon={UserPlus} size={15} color="#A855F7" />}
                bg="rgba(168,85,247,0.10)"
                label="Nouveaux ce mois"
                value={users.new_this_month}
                color="#A855F7"
              />
              <StatItem
                icon={<AppIcon icon={UserPlus} size={15} color="#F59E0B" />}
                bg="rgba(245,158,11,0.10)"
                label="KYC en attente"
                value={users.pending_kyc}
                color="#F59E0B"
              />
              <StatItem
                icon={<AppIcon icon={UserPlus} size={15} color="#E53935" />}
                bg="#FEE2E2"
                label="Comptes bloqués"
                value={users.blocked}
                color="#E53935"
              />
            </>
          ) : (
            <div style={{ color: '#9CA3AF', fontSize: 13, padding: '12px 0' }}>Chargement…</div>
          )}
        </ActivityColumn>

        {/* ── Top Conducteurs ── */}
        <ActivityColumn title="Top Conducteurs">
          {topDrivers.length > 0 ? (
            topDrivers.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AppIcon icon={Car} size={15} color="#2563EB" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{d.trips} trajets · ★ {d.rating}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#9CA3AF', fontSize: 13, padding: '12px 0', textAlign: 'center' }}>
              Aucun conducteur actif
            </div>
          )}
        </ActivityColumn>

        {/* ── Paiements ── */}
        <ActivityColumn title="Paiements">
          {payments ? (
            <>
              <StatItem
                icon={<AppIcon icon={CreditCard} size={15} color="#374151" />}
                bg="#F9FAFB"
                label="Volume total"
                value={formatFcfa(payments.total_volume_fcfa)}
                color="#374151"
              />
              <StatItem
                icon={<AppIcon icon={CreditCard} size={15} color="#00A86B" />}
                bg="#DCFCE7"
                label="Revenus plateforme"
                value={formatFcfa(payments.platform_revenue_fcfa)}
                color="#00A86B"
              />
              <StatItem
                icon={<AppIcon icon={CreditCard} size={15} color="#2563EB" />}
                bg="#DBEAFE"
                label="En escrow"
                value={formatFcfa(payments.escrow_locked_fcfa)}
                color="#2563EB"
              />
              <StatItem
                icon={<AppIcon icon={CreditCard} size={15} color="#E53935" />}
                bg="#FEE2E2"
                label="Remboursés"
                value={formatFcfa(payments.refunded_fcfa)}
                color="#E53935"
              />
            </>
          ) : (
            <div style={{ color: '#9CA3AF', fontSize: 13, padding: '12px 0' }}>Chargement…</div>
          )}
        </ActivityColumn>

        {/* ── Litiges ── */}
        <ActivityColumn title="Litiges">
          {disputes ? (
            <>
              <StatItem
                icon={<AppIcon icon={AlertTriangle} size={15} color="#374151" />}
                bg="#F9FAFB"
                label="Total litiges"
                value={disputes.total}
                color="#374151"
              />
              <StatItem
                icon={<AppIcon icon={AlertTriangle} size={15} color="#F59E0B" />}
                bg="rgba(245,158,11,0.10)"
                label="En attente"
                value={disputes.pending}
                color="#F59E0B"
              />
              <StatItem
                icon={<AppIcon icon={AlertTriangle} size={15} color="#E53935" />}
                bg="#FEE2E2"
                label="En enquête"
                value={disputes.investigating}
                color="#E53935"
              />
              <StatItem
                icon={<AppIcon icon={AlertTriangle} size={15} color="#00A86B" />}
                bg="#DCFCE7"
                label="Résolus"
                value={disputes.resolved}
                color="#00A86B"
              />
            </>
          ) : (
            <div style={{ color: '#9CA3AF', fontSize: 13, padding: '12px 0' }}>Chargement…</div>
          )}
        </ActivityColumn>

      </div>
    </section>
  );
}
