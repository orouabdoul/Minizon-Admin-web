import type { ReactNode } from 'react';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { radius } from '../../../theme/radius';

interface StatCardProps {
  value: string;
  label: string;
  badge: string;
  badgeColor?: string;
  icon: ReactNode;
}

export function StatCard({
  value,
  label,
  badge,
  badgeColor = colors.bannerTextMuted,
  icon,
}: StatCardProps) {
  return (
    <div
      style={{
        flex: '1 1 calc(50% - 8px)',
        minWidth: '130px',
        height: '118px',
        padding: '16px',
        background: colors.bannerCard,
        borderRadius: radius.lg,
        outline: `1px solid ${colors.bannerCardBorder}`,
        outlineOffset: '-1px',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '9px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {icon}
        <span
          style={{
            color: badgeColor,
            fontSize: typography.sizes.xs,
            fontFamily: typography.fontFamily,
            fontWeight: typography.weights.regular,
            lineHeight: typography.lineHeights.xs,
          }}
        >
          {badge}
        </span>
      </div>

      <div
        style={{
          color: colors.bannerTextPrimary,
          fontSize: typography.sizes.xl,
          fontFamily: typography.fontFamily,
          fontWeight: typography.weights.bold,
          lineHeight: typography.lineHeights.xl,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: colors.bannerTextSecondary,
          fontSize: typography.sizes.xs,
          fontFamily: typography.fontFamily,
          fontWeight: typography.weights.regular,
          lineHeight: typography.lineHeights.xs,
        }}
      >
        {label}
      </div>
    </div>
  );
}
