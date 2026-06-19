const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const Y_LABELS = [0, 5, 10, 15, 20, 25, 30];
const MAX_H = 228;
const BOTTOM = 260;

// Exact Figma bar positions in 502×300 SVG
const BARS = [
  { x: 66.03,  h: 62.12  },
  { x: 126.31, h: 89.88  },
  { x: 186.60, h: 114    },
  { x: 246.89, h: 138.12 },
  { x: 307.17, h: 163.69 },
  { x: 367.46, h: 209.73 },
  { x: 427.74, h: 228    },
];
const BAR_W = 48.23;

function yPos(val: number) { return BOTTOM - (val / 30) * MAX_H; }

export function RevenueChart() {
  return (
    <svg viewBox="0 0 502 300" width="100%" height="300" aria-label="Revenus plateforme">
      {/* Y-axis grid + labels */}
      {Y_LABELS.map((val) => {
        const y = yPos(val);
        return (
          <g key={val}>
            <line x1={60} y1={y} x2={482} y2={y} stroke="#F3F4F6" strokeWidth={1} />
            <text x={52} y={y + 4} textAnchor="end" fill="#9CA3AF" fontSize={11}>
              {val === 0 ? '0' : `${val}k`}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {BARS.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={BOTTOM - bar.h}
          width={BAR_W}
          height={bar.h}
          fill="#2563EB"
          rx={4}
        />
      ))}

      {/* X-axis labels */}
      {DAYS.map((d, i) => (
        <text key={d} x={BARS[i].x + BAR_W / 2} y={278} textAnchor="middle" fill="#9CA3AF" fontSize={12}>
          {d}
        </text>
      ))}

      {/* Bottom axis */}
      <line x1={60} y1={BOTTOM} x2={482} y2={BOTTOM} stroke="#E5E7EB" strokeWidth={1} />
    </svg>
  );
}
