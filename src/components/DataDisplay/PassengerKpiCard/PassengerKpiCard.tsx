import type { CSSProperties } from 'react';
import type { LucideIcon }    from 'lucide-react';
import { AppIcon }             from '../../Common/AppIcon';

interface PassengerKpiCardProps {
  label:       string;
  value:       string;
  badge:       string;
  iconBg:      string;
  iconColor:   string;
  icon:        LucideIcon;
  badgeBg?:    string;
  badgeColor?: string;
}

const card: CSSProperties = {
  padding:       16,
  background:    '#fff',
  borderRadius:  12,
  outline:       '1px solid #F3F4F6',
  display:       'flex',
  flexDirection: 'column',
  gap:           10,
};

const topRow: CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'space-between',
};

const iconBox = (bg: string): CSSProperties => ({
  width:          36,
  height:         36,
  borderRadius:   10,
  background:     bg,
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  flexShrink:     0,
});

const badgePill = (bg: string, color: string): CSSProperties => ({
  padding:      '2px 8px',
  borderRadius: 9999,
  background:   bg,
  color,
  fontSize:     11,
  fontWeight:   600,
  lineHeight:   '16px',
  whiteSpace:   'nowrap',
});

const labelStyle: CSSProperties = {
  fontSize:   12,
  color:      '#6B7280',
  fontWeight: 400,
  lineHeight: '16px',
};

const valueStyle: CSSProperties = {
  fontSize:   20,
  color:      '#111111',
  fontWeight: 700,
  lineHeight: '26px',
};

export function PassengerKpiCard({
  label, value, badge, iconBg, iconColor, icon,
  badgeBg, badgeColor,
}: PassengerKpiCardProps) {
  return (
    <div style={card}>
      <div style={topRow}>
        <div style={iconBox(iconBg)}>
          <AppIcon icon={icon} size={18} color={iconColor} />
        </div>
        {badge && (
          <span style={badgePill(badgeBg ?? iconBg, badgeColor ?? iconColor)}>{badge}</span>
        )}
      </div>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}
