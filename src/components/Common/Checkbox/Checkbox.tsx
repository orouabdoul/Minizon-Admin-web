import type { InputHTMLAttributes, ReactNode } from 'react';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export function Checkbox({ label, id, style, ...props }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        color: colors.textSecondary,
        fontSize: typography.sizes.sm,
        fontFamily: typography.fontFamily,
        fontWeight: typography.weights.regular,
        lineHeight: typography.lineHeights.sm,
        userSelect: 'none',
      }}
    >
      <input
        id={id}
        type="checkbox"
        {...props}
        style={{
          width: '16px',
          height: '16px',
          flexShrink: 0,
          cursor: 'pointer',
          accentColor: colors.primary,
          ...style,
        }}
      />
      {label}
    </label>
  );
}
