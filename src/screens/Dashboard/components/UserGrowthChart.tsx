const DAYS   = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const VALUES = [1000,   1300,  1600,  1900,  2200,  2000,  2350];
const Y_LABELS = [0, 500, 1000, 1500, 2000, 2500];
const MAX_Y = 2500;

// chart area: x=60..482, y=20..260 (w=422, h=240)
const X0 = 60;  const X1 = 482;  const Y0 = 20;  const Y1 = 260;
const W  = X1 - X0;  const H = Y1 - Y0;

function xPos(i: number) { return X0 + (i / (DAYS.length - 1)) * W; }
function yPos(v: number) { return Y1 - (v / MAX_Y) * H; }

const points = VALUES.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ');
const areaPath = `M ${xPos(0)},${yPos(VALUES[0])} ${VALUES.map((v, i) => `L ${xPos(i)},${yPos(v)}`).join(' ')} L ${X1},${Y1} L ${X0},${Y1} Z`;

export function UserGrowthChart() {
  return (
    <svg viewBox="0 0 502 300" width="100%" height="300" aria-label="Croissance utilisateurs">
      {/* Y-axis grid lines + labels */}
      {Y_LABELS.map((val) => {
        const y = yPos(val);
        return (
          <g key={val}>
            <line x1={X0} y1={y} x2={X1} y2={y} stroke="#F3F4F6" strokeWidth={1} />
            <text x={X0 - 8} y={y + 4} textAnchor="end" fill="#9CA3AF" fontSize={11}>
              {val === 0 ? '0' : `${val / 1000}k`}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="rgba(0,168,107,0.10)" />

      {/* Line */}
      <polyline points={points} fill="none" stroke="#00A86B" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {VALUES.map((v, i) => (
        <circle key={i} cx={xPos(i)} cy={yPos(v)} r={4} fill="#00A86B" />
      ))}

      {/* X-axis labels */}
      {DAYS.map((d, i) => (
        <text key={d} x={xPos(i)} y={Y1 + 18} textAnchor="middle" fill="#9CA3AF" fontSize={12}>
          {d}
        </text>
      ))}

      {/* Bottom axis line */}
      <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="#E5E7EB" strokeWidth={1} />
    </svg>
  );
}
