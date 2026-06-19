import type { CSSProperties } from 'react';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import { spacing } from '../../../theme/spacing';

export const loginStyles = {
  // ── Banner ──────────────────────────────────────────
  bannerLogoBox: {
    width: '64px',
    height: '64px',
    background: colors.bannerBg,
    boxShadow: shadows.logo,
    borderRadius: radius.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } satisfies CSSProperties,

  bannerTitle: {
    color: colors.white,
    fontSize: '48px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold,
    lineHeight: '48px',
    letterSpacing: '-0.5px',
  } satisfies CSSProperties,

  bannerSubtitle: {
    color: colors.bannerBg,
    fontSize: '24px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semiBold,
    lineHeight: '32px',
  } satisfies CSSProperties,

  bannerDescription: {
    color: colors.bannerTextSecondary,
    fontSize: '18px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.regular,
    lineHeight: '28px',
    maxWidth: '448px',
  } satisfies CSSProperties,

  bannerSubdescription: {
    color: colors.bannerTextMuted,
    fontSize: '14px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.regular,
    lineHeight: '20px',
    maxWidth: '448px',
  } satisfies CSSProperties,

  bannerSecurityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap' as const,
  } satisfies CSSProperties,

  bannerSecurityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    color: colors.bannerTextSecondary,
    fontSize: '12px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.regular,
  } satisfies CSSProperties,

  // ── Form card ────────────────────────────────────────
  formCard: {
    background: colors.surface,
    boxShadow: shadows.card,
    borderRadius: radius.xxl,
    outline: `1px solid ${colors.borderFaint}`,
    outlineOffset: '-1px',
    padding: spacing.xl,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.xl,
  } satisfies CSSProperties,

  formHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing.sm,
  } satisfies CSSProperties,

  formTitle: {
    color: colors.textPrimary,
    fontSize: '30px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold,
    lineHeight: '36px',
    textAlign: 'center' as const,
  } satisfies CSSProperties,

  formSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.md,
    textAlign: 'center' as const,
  } satisfies CSSProperties,

  formFields: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.lg,
  } satisfies CSSProperties,

  formOptions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.md,
  } satisfies CSSProperties,

  formOptionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } satisfies CSSProperties,

  forgotPassword: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.sm,
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    textDecoration: 'none',
  } satisfies CSSProperties,

  formDivider: {
    borderTop: `1px solid ${colors.borderFaint}`,
    paddingTop: spacing.md,
    display: 'flex',
    justifyContent: 'center',
  } satisfies CSSProperties,

  formFooterLinks: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  } satisfies CSSProperties,

  formFooterLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.sm,
    cursor: 'pointer',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
  } satisfies CSSProperties,

  // ── Security badges (below card) ─────────────────────
  securityBadgesRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    flexWrap: 'wrap' as const,
    padding: '0 35px',
  } satisfies CSSProperties,

  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: colors.textMuted,
    fontSize: '12px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.regular,
    lineHeight: '16px',
  } satisfies CSSProperties,

  securityDot: {
    width: '8px',
    height: '8px',
    background: colors.success,
    borderRadius: radius.full,
    opacity: 0.6,
    flexShrink: 0,
  } satisfies CSSProperties,

  // ── Footer bar ────────────────────────────────────────
  footerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
  } satisfies CSSProperties,

  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
    flexWrap: 'wrap' as const,
  } satisfies CSSProperties,

  footerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  } satisfies CSSProperties,

  footerText: {
    color: colors.textMuted,
    fontSize: '12px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.regular,
    lineHeight: '16px',
  } satisfies CSSProperties,

  footerStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: colors.textMuted,
    fontSize: '12px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.regular,
  } satisfies CSSProperties,

  footerStatusDot: {
    width: '8px',
    height: '8px',
    background: colors.success,
    borderRadius: radius.full,
    flexShrink: 0,
  } satisfies CSSProperties,

  footerLink: {
    color: colors.primary,
    fontSize: '12px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.regular,
    lineHeight: '16px',
    textDecoration: 'none',
  } satisfies CSSProperties,
} as const;
