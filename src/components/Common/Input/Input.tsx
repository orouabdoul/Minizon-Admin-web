import { forwardRef, type InputHTMLAttributes, type ReactNode, type CSSProperties } from 'react';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
}

const labelStyle: CSSProperties = {
  display: 'block',
  color: colors.textLabel,
  fontSize: typography.sizes.sm,
  fontFamily: typography.fontFamily,
  fontWeight: typography.weights.semiBold,
  lineHeight: typography.lineHeights.sm,
  marginBottom: '8px',
};

const containerStyle: CSSProperties = {
  position: 'relative',
};

const iconLeftStyle: CSSProperties = {
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none',
  color: colors.textLight,
};

const iconRightStyle: CSSProperties = {
  position: 'absolute',
  right: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: colors.textLight,
  background: 'none',
  border: 'none',
  padding: 0,
};

const inputBase: CSSProperties = {
  display: 'block',
  width: '100%',
  paddingTop: '16px',
  paddingBottom: '16px',
  background: colors.surface,
  borderRadius: radius.lg,
  border: `1px solid ${colors.border}`,
  outline: 'none',
  fontSize: typography.sizes.md,
  fontFamily: typography.fontFamily,
  fontWeight: typography.weights.regular,
  lineHeight: typography.lineHeights.md,
  color: colors.black,
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, leftIcon, rightIcon, error, id, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {label && (
          <label htmlFor={id} style={labelStyle}>
            {label}
          </label>
        )}
        <div style={containerStyle}>
          {leftIcon && <span style={iconLeftStyle}>{leftIcon}</span>}
          <input
            ref={ref}
            id={id}
            {...props}
            style={{
              ...inputBase,
              paddingLeft: leftIcon ? '48px' : '16px',
              paddingRight: rightIcon ? '48px' : '16px',
              borderColor: error ? colors.error : colors.border,
              ...style,
            }}
          />
          {rightIcon && <span style={iconRightStyle}>{rightIcon}</span>}
        </div>
        {error && (
          <span style={{ color: colors.error, fontSize: typography.sizes.xs }}>
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
