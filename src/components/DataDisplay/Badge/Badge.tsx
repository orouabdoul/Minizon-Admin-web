import type { CSSProperties } from 'react';

export type BadgeVariant =
  | 'success' | 'error'   | 'warning' | 'neutral'
  | 'primary' | 'info'    | 'purple'  | 'pending'
  | 'emerald' | 'amber'   | 'lime'
  // Support page — gradient variants
  | 'priority-haute' | 'priority-moyenne' | 'priority-basse'
  | 'ticket-nouveau' | 'ticket-encours'   | 'ticket-resolu';

interface BadgeProps {
  label:    string;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, CSSProperties> = {
  // ── Dashboard ────────────────────────────────────
  success: { background: '#F0FDF4',               color: '#16A34A' },
  error:   { background: '#FEF2F2',               color: '#DC2626' },
  warning: { background: '#FEFCE8',               color: '#CA8A04' },
  neutral: { background: '#F3F4F6',               color: '#6B7280' },
  // ── Users page ───────────────────────────────────
  primary: { background: 'rgba(124,58,237,0.10)',  color: '#7C3AED' },
  info:    { background: 'rgba(37,99,235,0.10)',  color: '#2563EB' },
  purple:  { background: 'rgba(124,58,237,0.10)', color: '#7C3AED' },
  pending: { background: 'rgba(251,140,0,0.10)',  color: '#FB8C00' },
  // ── Drivers page ─────────────────────────────────
  emerald: { background: '#DCFCE7', color: '#15803D' }, // Vérifié, document ✓
  amber:   { background: '#FEF9C3', color: '#854D0E' }, // En attente, document ⏳
  // ── Passengers page ──────────────────────────────
  lime:    { background: 'rgba(34,197,94,0.10)', color: '#22C55E' }, // Risque Faible
  // ── Support page — gradient badges ───────────────────────
  'priority-haute':   { background: 'linear-gradient(135deg, #E53935 0%, #C62828 100%)', color: '#fff' },
  'priority-moyenne': { background: 'linear-gradient(135deg, #F4B400 0%, #FF8F00 100%)', color: '#fff' },
  'priority-basse':   { background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', color: '#fff' },
  'ticket-nouveau':   { background: 'linear-gradient(135deg, #F4B400 0%, #FF8F00 100%)', color: '#fff' },
  'ticket-encours':   { background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)', color: '#fff' },
  'ticket-resolu':    { background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', color: '#fff' },
};

const base: CSSProperties = {
  display:      'inline-flex',
  alignItems:   'center',
  padding:      '2px 8px',
  borderRadius: 9999,
  fontSize:     12,
  fontWeight:   600,
  lineHeight:   '16px',
  whiteSpace:   'nowrap',
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span style={{ ...base, ...VARIANT_STYLES[variant] }}>
      {label}
    </span>
  );
}
