export const colors = {
  // ── Couleurs principales MINIZON ──────────────────────────────────
  primary:       '#1A5FB4',                    // Bleu profond (marque, headers)
  primaryDark:   '#0F4A9E',                    // Bleu foncé (hover, actif)
  primaryLight:  'rgba(26, 95, 180, 0.10)',    // Bleu transparent (badges, bg)
  primaryGlow:   'rgba(26, 95, 180, 0.31)',
  primaryShadow: 'rgba(26, 95, 180, 0.45)',

  accent:      '#FF7A45',                      // Orange corail (CTA principal)
  accentDark:  '#E65E2A',
  accentLight: 'rgba(255, 122, 69, 0.12)',

  secondary: '#1F2933',

  // ── Sémantiques ───────────────────────────────────────────────────
  success:      '#17A398',                     // Turquoise (validation, badge vérifié)
  successLight: '#25C5BC',
  warning:      '#F5A623',                     // Ambre (alerte, litige)
  error:        '#E5484D',                     // Rouge discret

  // ── Fonds & surfaces ──────────────────────────────────────────────
  background: '#F2F4F7',                       // Fond neutre clair MINIZON
  surface:    '#FFFFFF',

  // ── Texte ─────────────────────────────────────────────────────────
  textPrimary:   '#1F2933',                    // Gris anthracite MINIZON
  textSecondary: '#6B7684',                    // Gris moyen MINIZON
  textMuted:     '#6B7684',
  textLight:     '#9CA3AF',
  textDisabled:  '#D1D5DB',
  textLabel:     '#374151',

  // ── Bordures ──────────────────────────────────────────────────────
  border:      '#D1D5DB',
  borderLight: '#E5E7EB',
  borderFaint: '#F3F4F6',

  // ── Bannière ──────────────────────────────────────────────────────
  bannerBg:            '#1A5FB4',
  bannerCard:          'rgba(255, 255, 255, 0.10)',
  bannerCardBorder:    'rgba(255, 255, 255, 0.20)',
  bannerTextPrimary:   '#FFFFFF',
  bannerTextSecondary: '#D1D5DB',
  bannerTextMuted:     '#FFFFFF',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
