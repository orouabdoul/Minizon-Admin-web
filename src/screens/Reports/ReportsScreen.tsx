import { Download, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { useReports }      from '../../hooks/useReports';
import type { ReportPeriod } from '../../models/reports.model';

const PERIODS: { id: ReportPeriod; label: string }[] = [
  { id: '7j',  label: '7 derniers jours' },
  { id: '30j', label: '30 derniers jours' },
  { id: '90j', label: '3 derniers mois'  },
];

const RANK_MEDAL = ['🥇', '🥈', '🥉', '4', '5'];

export function ReportsScreen() {
  const { data, period, loading, exportMsg, setPeriod, exportReport } = useReports();

  const maxRevenue = Math.max(...data.revenueChart.map((b) => b.revenue));

  return (
    <DashboardLayout title="Rapports & Statistiques">

      {/* ── Period tabs + Export ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6, background: '#F3F4F6', borderRadius: 10, padding: 4 }}>
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              style={{
                padding: '7px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: period === p.id ? '#fff' : 'transparent',
                color:      period === p.id ? '#111827' : '#6B7280',
                boxShadow:  period === p.id ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {loading && <span style={{ fontSize: 12, color: '#9CA3AF' }}>Chargement…</span>}
          <button type="button" onClick={() => exportReport('excel')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            <AppIcon icon={Download} size={13} color="#374151" /> Excel
          </button>
          <button type="button" onClick={() => exportReport('pdf')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: 'none', background: '#2563EB', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
            <AppIcon icon={Download} size={13} color="#fff" /> PDF
          </button>
        </div>
      </div>

      {exportMsg && (
        <div style={{ padding: '10px 16px', background: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#1D4ED8', marginBottom: 16 }}>
          ℹ️ {exportMsg}
        </div>
      )}

      {/* ── KPI cards ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {data.kpis.map((kpi) => (
          <div key={kpi.id} style={{ padding: '16px', background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6' }}>
            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>{kpi.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: kpi.color, marginBottom: 6, lineHeight: 1.1 }}>{kpi.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <AppIcon icon={kpi.up ? TrendingUp : TrendingDown} size={13} color={kpi.up ? '#00A86B' : '#E53935'} />
              <span style={{ fontSize: 12, fontWeight: 700, color: kpi.up ? '#00A86B' : '#E53935' }}>{kpi.trend}</span>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>vs période préc.</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue chart + Top drivers ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, marginBottom: 16 }}>

        {/* Revenue bar chart */}
        <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AppIcon icon={BarChart2} size={16} color="#374151" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Revenus & Trajets</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, paddingBottom: 28 }}>
            {data.revenueChart.map((bar) => {
              const pct = Math.round((bar.revenue / maxRevenue) * 100);
              return (
                <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600 }}>{bar.trips}</div>
                  <div
                    title={`${bar.revenue.toLocaleString('fr-FR')} FCFA — ${bar.trips} trajets`}
                    style={{ width: '100%', height: `${pct}%`, minHeight: 4, background: 'linear-gradient(to top, #2563EB, #60A5FA)', borderRadius: '4px 4px 0 0', cursor: 'default' }}
                  />
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>{bar.label}</div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#2563EB' }} />
              <span style={{ fontSize: 11, color: '#6B7280' }}>Revenus</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600 }}>Chiffres</span>
              <span style={{ fontSize: 11, color: '#6B7280' }}> = nombre de trajets</span>
            </div>
          </div>
        </div>

        {/* Top 5 drivers */}
        <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', padding: '16px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Top 5 Conducteurs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.topDrivers.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: i < 3 ? 18 : 14, minWidth: 28, textAlign: 'center', fontWeight: 700, color: '#6B7280' }}>{RANK_MEDAL[i]}</span>
                <img src={d.avatar} alt={d.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{d.trips} trajets · ⭐ {d.rating}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#00A86B', flexShrink: 0 }}>{d.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Zone breakdown ───────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', padding: '16px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Répartition par Zone</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.byZone.map((z) => (
            <div key={z.zone} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 80px 50px', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{z.zone}</span>
              <div style={{ height: 10, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${z.percent}%`, background: 'linear-gradient(to right, #2563EB, #60A5FA)', borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 12, color: '#6B7280', textAlign: 'right' }}>{z.trips.toLocaleString('fr-FR')} trajets</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', textAlign: 'right' }}>{z.percent}%</span>
            </div>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}
