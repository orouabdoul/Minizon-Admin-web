interface DailyRevenue {
  date:   string;
  amount: number;
}

interface Props {
  dailyRevenue: DailyRevenue[];
}

const MAX_H  = 228;
const BOTTOM = 260;
const X0     = 66;
const AREA_W = 416;

function formatDate(d: string): string {
  // "2026-06-19" → "19/06"
  const p = d.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}` : d;
}

function niceMax(maxAmount: number): number {
  if (maxAmount <= 0)       return 30_000;
  const order = Math.pow(10, Math.floor(Math.log10(maxAmount)));
  return Math.ceil(maxAmount / order) * order;
}

function yLabel(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}k`;
  return String(v);
}

export function RevenueChart({ dailyRevenue }: Props) {
  if (dailyRevenue.length === 0) {
    return (
      <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#F3F4F6" />
          <path d="M10 30 L16 20 L22 24 L28 14 L34 18" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span style={{ color: '#9CA3AF', fontSize: 13 }}>Données en cours de collecte</span>
      </div>
    );
  }

  const n         = dailyRevenue.length;
  const maxAmount = Math.max(...dailyRevenue.map((d) => d.amount), 1);
  const yMax      = niceMax(maxAmount);
  const barW      = Math.min(54, (AREA_W / n) * 0.65);
  const step      = n > 1 ? (AREA_W - barW) / (n - 1) : 0;
  const ySteps    = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(yMax * f));

  return (
    <svg viewBox="0 0 502 300" width="100%" height="300" aria-label="Revenus plateforme 7 jours">
      {/* Y-axis grid + labels */}
      {ySteps.map((val) => {
        const y = BOTTOM - (val / yMax) * MAX_H;
        return (
          <g key={val}>
            <line x1={60} y1={y} x2={482} y2={y} stroke="#F3F4F6" strokeWidth={1} />
            <text x={52} y={y + 4} textAnchor="end" fill="#9CA3AF" fontSize={11}>
              {yLabel(val)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {dailyRevenue.map((d, i) => {
        const barH = Math.max(2, (d.amount / yMax) * MAX_H);
        const x    = X0 + i * step;
        return (
          <g key={i}>
            <rect x={x} y={BOTTOM - barH} width={barW} height={barH} fill="#1A5FB4" rx={4} />
            {d.amount > 0 && (
              <text
                x={x + barW / 2}
                y={BOTTOM - barH - 5}
                textAnchor="middle"
                fill="#6B7280"
                fontSize={9}
              >
                {yLabel(d.amount)}
              </text>
            )}
          </g>
        );
      })}

      {/* X-axis labels */}
      {dailyRevenue.map((d, i) => (
        <text
          key={i}
          x={X0 + i * step + barW / 2}
          y={278}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize={11}
        >
          {formatDate(d.date)}
        </text>
      ))}

      {/* Bottom axis */}
      <line x1={60} y1={BOTTOM} x2={482} y2={BOTTOM} stroke="#E5E7EB" strokeWidth={1} />
    </svg>
  );
}
