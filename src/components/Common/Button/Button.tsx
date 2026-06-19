import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import { typography } from '../../../theme/typography';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
}

const base: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '16px',
  borderRadius: radius.lg,
  border: 'none',
  cursor: 'pointer',
  fontFamily: typography.fontFamily,
  fontSize: typography.sizes.md,
  fontWeight: typography.weights.semiBold,
  lineHeight: typography.lineHeights.md,
  transition: 'opacity 0.2s, transform 0.1s',
  outline: 'none',
};

const variants: Record<'primary' | 'secondary' | 'ghost', CSSProperties> = {
  primary: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    boxShadow: shadows.button,
    color: colors.white,
  },
  secondary: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    color: colors.textSecondary,
  },
  ghost: {
    background: 'transparent',
    color: colors.primary,
  },
};

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      style={{
        ...base,
        ...variants[variant],
        ...(fullWidth ? { width: '100%' } : {}),
        ...(isDisabled ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
        ...style,
      }}
    >
      {children}
    </button>
  );
}
