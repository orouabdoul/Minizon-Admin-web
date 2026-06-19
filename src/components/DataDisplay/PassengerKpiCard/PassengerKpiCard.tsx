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
  badgeBg?:    string; // overrides iconBg for the badge pill
  badgeColor?: string; // overrides iconColor for the badge text
}

const card: CSSProperties = {
  padding:       24,
  background:    '#fff',
  borderRadius:  16,
  outline:       '1px solid #F3F4F6',
  display:       'flex',
  flexDirection: 'column',
  gap:           16,
};

const topRow: CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'space-between',
};

const iconBox = (bg: string): CSSProperties => ({
  width:          48,
  height:         48,
  borderRadius:   12,
  background:     bg,
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  flexShrink:     0,
});

const badgePill = (bg: string, color: string): CSSProperties => ({
  padding:      '4px 10px',
  borderRadius: 9999,
  background:   bg,
  color,
  fontSize:     12,
  fontWeight:   600,
  lineHeight:   '16px',
  whiteSpace:   'nowrap',
});

const labelStyle: CSSProperties = {
  fontSize:   14,
  color:      '#6B7280',
  fontWeight: 400,
  lineHeight: '20px',
};

const valueStyle: CSSProperties = {
  fontSize:   30,
  color:      '#111111',
  fontWeight: 700,
  lineHeight: '36px',
};

export function PassengerKpiCard({
  label, value, badge, iconBg, iconColor, icon,
  badgeBg, badgeColor,
}: PassengerKpiCardProps) {
  return (
    <div style={card}>
      <div style={topRow}>
        <div style={iconBox(iconBg)}>
          <AppIcon icon={icon} size={22} color={iconColor} />
        </div>
        <span style={badgePill(badgeBg ?? iconBg, badgeColor ?? iconColor)}>{badge}</span>
      </div>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}
