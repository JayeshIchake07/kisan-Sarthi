/**
 * Kisan Sarthi Design System — Color Tokens
 * Consistent branding across all Framer dashboards.
 */
export const colors = {
  // Brand
  primary: '#059669',
  primaryLight: '#10b981',
  primaryDark: '#047857',
  primaryGlow: 'rgba(5, 150, 105, 0.3)',

  // Backgrounds
  bg: '#060f09',
  bgLight: '#0a1810',
  bgLighter: '#0f2318',
  bgCard: '#0a1810',
  bgCardHover: '#0f2318',
  bgSurface: '#112a1a',
  bgOverlay: 'rgba(6, 15, 9, 0.85)',

  // Text
  textPrimary: '#f0fdf4',
  textSecondary: '#86efac',
  textMuted: '#6b8f7b',
  textDim: '#4a6b5a',

  // Semantic
  success: '#10b981',
  successBg: 'rgba(16, 185, 129, 0.12)',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  danger: '#ef4444',
  dangerBg: 'rgba(239, 68, 68, 0.12)',
  info: '#3b82f6',
  infoBg: 'rgba(59, 130, 246, 0.12)',

  // Borders
  border: 'rgba(16, 185, 129, 0.15)',
  borderLight: 'rgba(16, 185, 129, 0.08)',
  borderActive: 'rgba(5, 150, 105, 0.5)',

  // Charts
  chart1: '#10b981',
  chart2: '#3b82f6',
  chart3: '#f59e0b',
  chart4: '#ef4444',
  chart5: '#8b5cf6',
  chart6: '#ec4899',

  // Glassmorphism
  glass: 'rgba(10, 24, 16, 0.7)',
  glassBorder: 'rgba(16, 185, 129, 0.12)',
};

/** Utility to get a status-based color */
export function statusColor(status) {
  const map = {
    healthy: colors.success,
    mild: colors.warning,
    severe: colors.danger,
    critical: colors.danger,
    warning: colors.warning,
    good: colors.success,
    moderate: colors.warning,
    poor: colors.danger,
    low: colors.success,
    medium: colors.warning,
    high: colors.danger,
    active: colors.danger,
    monitoring: colors.warning,
    contained: colors.info,
    resolved: colors.success,
    new: colors.info,
    review: colors.warning,
    approved: colors.success,
    disbursed: colors.primaryLight,
    rejected: colors.danger,
  };
  return map[status] || colors.textMuted;
}

/** Utility to get status background color */
export function statusBgColor(status) {
  const map = {
    healthy: colors.successBg,
    mild: colors.warningBg,
    severe: colors.dangerBg,
    critical: colors.dangerBg,
    warning: colors.warningBg,
    low: colors.successBg,
    medium: colors.warningBg,
    high: colors.dangerBg,
    new: colors.infoBg,
    review: colors.warningBg,
    approved: colors.successBg,
    disbursed: 'rgba(5, 150, 105, 0.12)',
    rejected: colors.dangerBg,
  };
  return map[status] || 'rgba(107, 143, 123, 0.12)';
}
