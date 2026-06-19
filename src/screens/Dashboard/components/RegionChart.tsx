// Treemap — 5 regions displayed as proportional nested rectangles
// Chart area: x=60..472, y=20..260 (w=412, h=240)
const REGIONS = [
  { label: 'Porto-Novo', pct: '25%', color: '#2563EB', x:  60,    y:  20,   w: 226.6, h: 109.1 },
  { label: 'Parakou',    pct: '15%', color: '#FB8C00', x:  60,    y: 129.1, w: 113.3, h: 130.9 },
  { label: 'Abomey',     pct: '8%',  color: '#7C3AED', x: 173.3,  y: 129.1, w: 113.3, h:  69.8 },
  { label: 'Autres',     pct: '7%',  color: '#E53935', x: 173.3,  y: 198.9, w: 113.3, h:  61.1 },
  { label: 'Cotonou',    pct: '45%', color: '#00A86B', x: 286.6,  y:  20,   w: 185.4, h: 240   },
];

// Legend at y=285
const LEGEND_X = [34, 124, 210, 285, 355];

export function RegionChart() {
  return (
    <svg viewBox="0 0 502 300" width="100%" height="300" aria-label="Répartition par région">
      {REGIONS.map((r) => (
        <g key={r.label}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color} />
          {/* Percentage text centered in block */}
          <text
            x={r.x + r.w / 2}
            y={r.y + r.h / 2 + 5}
            textAnchor="middle"
            fill="white"
            fontSize={r.h > 50 ? 13 : 10}
            fontWeight={600}
          >
            {r.pct}
          </text>
        </g>
      ))}

      {/* Legend */}
      {REGIONS.map((r, i) => (
        <g key={`legend-${r.label}`}>
          <rect x={LEGEND_X[i]} y={272} width={10} height={10} fill={r.color} rx={2} />
          <text x={LEGEND_X[i] + 14} y={281} fill="#6B7280" fontSize={10}>
            {r.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
