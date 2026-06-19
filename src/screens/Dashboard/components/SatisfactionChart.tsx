// Exact Figma bar positions in 502×300 SVG (bottom at y=260)
const BARS = [
  { star: '5★', x:  68.44, h: 228,  color: '#00A86B' },
  { star: '4★', x: 152.84, h:  73.76, color: '#22C55E' },
  { star: '3★', x: 237.24, h:  23.47, color: '#86EFAC' },
  { star: '2★', x: 321.64, h:   6.71, color: '#FCA5A5' },
  { star: '1★', x: 406.04, h:   3.35, color: '#EF4444' },
];
const BAR_W = 67.52;
const BOTTOM = 260;
const Y_LABELS = [0, 25, 50, 75, 100];

function yPos(pct: number) { return BOTTOM - (pct / 100) * 228; }

export function SatisfactionChart() {
  return (
    <svg viewBox="0 0 502 300" width="100%" height="300" aria-label="Taux de satisfaction">
      {/* Y-axis grid + labels */}
      {Y_LABELS.map((val) => {
        const y = yPos(val);
        return (
          <g key={val}>
            <line x1={60} y1={y} x2={482} y2={y} stroke="#F3F4F6" strokeWidth={1} />
            <text x={52} y={y + 4} textAnchor="end" fill="#9CA3AF" fontSize={11}>
              {val}%
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {BARS.map((bar) => (
        <rect
          key={bar.star}
          x={bar.x}
          y={BOTTOM - bar.h}
          width={BAR_W}
          height={bar.h}
          fill={bar.color}
          rx={4}
        />
      ))}

      {/* X-axis labels */}
      {BARS.map((bar) => (
        <text key={`lbl-${bar.star}`} x={bar.x + BAR_W / 2} y={278} textAnchor="middle" fill="#9CA3AF" fontSize={12}>
          {bar.star}
        </text>
      ))}

      {/* Bottom axis */}
      <line x1={60} y1={BOTTOM} x2={482} y2={BOTTOM} stroke="#E5E7EB" strokeWidth={1} />
    </svg>
  );
}
