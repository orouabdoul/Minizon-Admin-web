export const colors = {
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  primaryLight: 'rgba(124, 58, 237, 0.10)',
  primaryGlow: 'rgba(124, 58, 237, 0.31)',
  primaryShadow: 'rgba(124, 58, 237, 0.45)',

  secondary: '#111111',

  success: '#22C55E',
  successLight: '#4ADE80',
  warning: '#F59E0B',
  error: '#EF4444',

  background: '#F6F7FB',
  surface: '#FFFFFF',

  textPrimary: '#111111',
  textSecondary: '#4B5563',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  textDisabled: '#D1D5DB',
  textLabel: '#374151',

  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  borderFaint: '#F3F4F6',

  bannerBg: '#7C3AED',
  bannerCard: 'rgba(255, 255, 255, 0.10)',
  bannerCardBorder: 'rgba(255, 255, 255, 0.20)',
  bannerTextPrimary: '#FFFFFF',
  bannerTextSecondary: '#D1D5DB',
  bannerTextMuted: '#FFFFFF',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
