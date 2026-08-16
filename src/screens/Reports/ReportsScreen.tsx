import { Download, TrendingUp, TrendingDown, BarChart2, Loader, AlertTriangle, Star } from 'lucide-react';
import { DashboardLayout } from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }         from '../../components/Common/AppIcon';
import { useReports }      from '../../hooks/useReports';
import type { ReportPeriod } from '../../models/reports.model';

const PERIODS: { id: ReportPeriod; label: string }[] = [
  { id: '7j',  label: '7 derniers jours'  },
  { id: '30j', label: '30 derniers jours' },
  { id: '90j', label: '3 derniers mois'   },
];

const RANK_MEDAL = ['🥇', '🥈', '🥉', '4', '5'];

function DriverAvatar({ src, name }: { src: string; name: string }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
  if (!src) {
    return (
      <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: 11 }}>
        {initials}
      </div>
    );
  }
  return (
    <img
      src={src} alt={name}
      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function SkeletonBox({ w = '100%', h = 16, radius = 6 }: { w?: string | number; h?: number; radius?: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: radius, background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
  );
}

export function ReportsScreen() {
  const { data, period, loading, error, exportMsg, exporting, setPeriod, exportReport } = useReports();

  const maxRevenue = data ? Math.max(...data.revenueChart.map((b) => b.revenue), 1) : 1;

  return (
    <DashboardLayout title="Rapports & Statistiques">

      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      {/* ── Period tabs + Export ──────────────────────────────────────────────── */}
      <div className="reports-controls">
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
                transition: 'all 0.15s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {loading && data && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#9CA3AF' }}>
              <AppIcon icon={Loader} size={12} color="#9CA3AF" /> Actualisation…
            </span>
          )}
          <button
            type="button"
            onClick={() => exportReport('excel')}
            disabled={exporting || !data}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 12, fontWeight: 600, color: exporting ? '#9CA3AF' : '#374151', cursor: exporting || !data ? 'not-allowed' : 'pointer', opacity: !data ? 0.5 : 1 }}
          >
            <AppIcon icon={Download} size={13} color={exporting ? '#9CA3AF' : '#374151'} />
            {exporting ? 'Export…' : 'Excel'}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!data}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: 'none', background: !data ? '#9CA3AF' : '#2563EB', fontSize: 12, fontWeight: 600, color: '#fff', cursor: !data ? 'not-allowed' : 'pointer', opacity: !data ? 0.5 : 1 }}
          >
            <AppIcon icon={Download} size={13} color="#fff" />
            PDF
          </button>
        </div>
      </div>

      {/* Export / info message */}
      {exportMsg && (
        <div style={{ padding: '10px 16px', background: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#1D4ED8', marginBottom: 16 }}>
          ℹ️ {exportMsg}
        </div>
      )}

      {/* ── Full-page loading (first load) ───────────────────────────────────── */}
      {loading && !data && (
        <div>
          <div className="fin-kpi-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ padding: 16, background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <SkeletonBox h={10} w="60%" />
                <SkeletonBox h={28} w="80%" />
                <SkeletonBox h={10} w="50%" />
              </div>
            ))}
          </div>
          <div className="reports-chart-row">
            <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', padding: 16, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AppIcon icon={Loader} size={28} color="#D1D5DB" />
            </div>
            <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[0,1,2,3,4].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <SkeletonBox w={28} h={28} radius={14} />
                  <SkeletonBox w={28} h={28} radius={14} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <SkeletonBox h={10} w="70%" />
                    <SkeletonBox h={8}  w="50%" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Error state ───────────────────────────────────────────────────────── */}
      {error && !data && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AppIcon icon={AlertTriangle} size={26} color="#E53935" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Erreur de chargement</p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setPeriod(period)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#2563EB', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ── Report content ───────────────────────────────────────────────────── */}
      {data && (
        <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>

          {/* KPI cards */}
          <div className="fin-kpi-grid">
            {data.kpis.map((kpi) => (
              <div key={kpi.id} style={{ padding: '16px', background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: kpi.color, marginBottom: 6, lineHeight: 1.1 }}>
                  {kpi.value}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AppIcon icon={kpi.up ? TrendingUp : TrendingDown} size={13} color={kpi.up ? '#7C3AED' : '#E53935'} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: kpi.up ? '#7C3AED' : '#E53935' }}>{kpi.trend}</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>vs période préc.</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue chart + Top drivers */}
          <div className="reports-chart-row">

            {/* Bar chart */}
            <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <AppIcon icon={BarChart2} size={16} color="#374151" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Revenus & Trajets</span>
              </div>

              {data.revenueChart.length === 0 ? (
                <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: '#9CA3AF', fontSize: 13 }}>Aucune donnée disponible</p>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, paddingBottom: 28 }}>
                  {data.revenueChart.map((bar) => {
                    const pct = Math.round((bar.revenue / maxRevenue) * 100);
                    return (
                      <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600 }}>{bar.trips}</div>
                        <div
                          title={`${bar.revenue.toLocaleString('fr-FR')} FCFA — ${bar.trips} trajets`}
                          style={{ width: '100%', height: `${Math.max(pct, 2)}%`, background: 'linear-gradient(to top, #2563EB, #60A5FA)', borderRadius: '4px 4px 0 0', cursor: 'default', transition: 'height 0.3s ease' }}
                        />
                        <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>{bar.label}</div>
                      </div>
                    );
                  })}
                </div>
              )}

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
              {data.topDrivers.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: 13 }}>Aucun conducteur disponible</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {data.topDrivers.map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: i < 3 ? 18 : 14, minWidth: 28, textAlign: 'center', fontWeight: 700, color: '#6B7280' }}>{RANK_MEDAL[i]}</span>
                      <DriverAvatar src={d.avatar} name={d.name} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B7280' }}>
                          {d.trips} trajets
                          <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            · <AppIcon icon={Star} size={10} color="#F59E0B" /> {d.rating}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', flexShrink: 0 }}>{d.revenue}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Zone breakdown */}
          <div style={{ background: '#fff', borderRadius: 12, outline: '1px solid #F3F4F6', padding: '16px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Répartition par Zone</div>
            {data.byZone.length === 0 ? (
              <p style={{ color: '#9CA3AF', fontSize: 13 }}>Aucune donnée disponible</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.byZone.map((z) => (
                  <div key={z.zone} className="reports-zone-row" style={{ display: 'grid', gridTemplateColumns: '110px 1fr 80px 50px', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{z.zone}</span>
                    <div style={{ height: 10, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${z.percent}%`, background: 'linear-gradient(to right, #2563EB, #60A5FA)', borderRadius: 999, transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#6B7280', textAlign: 'right' }}>{z.trips.toLocaleString('fr-FR')} trajets</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', textAlign: 'right' }}>{z.percent}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
